import { writable, type Writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

// Define a local Profile interface matching your planned Supabase profiles table
export interface Profile {
  id: string;
  username: string;
  avatar_url?: string; // Assuming you'll store avatar URL
  // Add any other fields you plan for the profiles table
}

export interface AuthState {
  isAuthenticated: boolean; // Derived from session/user presence
  session: Session | null;
  user: Profile | null; // Use the local Profile type here
  loading: boolean; // Add a loading state while fetching initial session
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  session: null,
  user: null,
  loading: true, // Start in loading state
};

export const authState: Writable<AuthState> = writable(initialAuthState);

// Remove mock functions
// export function login(user: User) {
//   authState.set({ isAuthenticated: true, user });
// }

// export function logout() {
//   authState.set({ isAuthenticated: false, user: null });
// }

// Subscribe to auth state changes from Supabase
supabase.auth.onAuthStateChange(async (event, session) => { // Make the callback async
  console.log(`Supabase Auth State Change Event: ${event}`, { session });

  let profile: Profile | null = null;
  if (session?.user) {
    console.log('Session and user found, attempting to fetch profile for user ID:', session.user.id);
    // IMPORTANT: Ensure 'profiles' table exists and has RLS policies allowing
    // authenticated users to read their own profile (e.g., auth.uid() = id).
    // If testing, RLS might be temporarily disabled - REMEMBER TO RE-ENABLE!
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url') // Select the fields you need
      .eq('id', session.user.id) // Filter by the authenticated user's ID
      .single(); // Expect a single row

    if (profileError) {
      console.error('[AuthStore] Error fetching profile:', profileError);
      // Not setting profile to null here, as an error doesn't mean the user isn't authenticated
      // However, user-specific UI might not render correctly without a profile.
    } else if (profileData) {
      console.log('[AuthStore] Profile data fetched successfully:', profileData);
      profile = profileData;
    } else {
      console.warn('[AuthStore] No profile data found for user ID:', session.user.id, '(Profile might not exist yet)');
    }
  } else {
    console.log('[AuthStore] No active session or user, clearing profile.');
  }

  authState.set({
    isAuthenticated: !!session,
    session: session,
    user: profile,
    loading: false,
  });
  console.log('[AuthStore] Auth state updated:', { isAuthenticated: !!session, user: profile, loading: false });
});
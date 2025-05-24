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
  loading: false, // Initialize loading to false
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

  // Immediately update store to indicate loading has started for this auth event cycle
  authState.update(s => ({ ...s, loading: true }));

  let profile: Profile | null = null;
  // isLoading variable is effectively managed by the try/finally setting loading: false at the end.

  try {
    if (session?.user) {
      console.log('[AuthStore] Session and user found, attempting to fetch profile for user ID:', session.user.id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        if (profileError.code !== 'PGRST116') {
            console.error('[AuthStore] Error fetching profile:', profileError);
        } else {
            console.warn('[AuthStore] No profile data found for user ID:', session.user.id, '(Profile might not exist or RLS prevents access). Ensure server-side profile creation is in place.');
        }
      } else if (profileData) {
        console.log('[AuthStore] Profile data fetched successfully:', profileData);
        profile = profileData;
      } else {
        console.warn('[AuthStore] No profile data returned for user ID:', session.user.id, '(Profile might not exist).');
      }
    } else {
      console.log('[AuthStore] No active session or user, clearing profile.');
      // Profile remains null, isAuthenticated will be false
    }
  } catch (error) {
    console.error('[AuthStore] Unexpected error during auth state change processing:', error);
    // Ensure profile is null if an unexpected error occurs during its fetch or processing
    profile = null;
  } finally {
    // This block ensures that loading is set to false and authState is updated,
    // regardless of errors in the try block.
    authState.set({
      isAuthenticated: !!session, // Re-evaluate based on the session passed to the event
      session: session,
      user: profile,          // user will be the fetched profile or null
      loading: false,         // Crucially, set loading to false here
    });
    console.log('[AuthStore] Auth state updated (finally block):', { isAuthenticated: !!session, user: profile, loading: false });
  }
});
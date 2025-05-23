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

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows, which we'll handle
      console.error('[AuthStore] Error fetching profile:', profileError);
      // Not setting profile to null here, as an error doesn't mean the user isn't authenticated
      // However, user-specific UI might not render correctly without a profile.
    } else if (profileData) {
      console.log('[AuthStore] Profile data fetched successfully:', profileData);
      profile = profileData;
    } else {
      // No profile found, or PGRST116 error (no rows)
      console.warn('[AuthStore] No profile data found for user ID:', session.user.id, '(Profile might not exist yet). Attempting to create one.');
      if (session.user.email) {
        try {
          // Attempt to create a profile
          const usernameFromEmail = session.user.email.split('@')[0];
          const { data: newProfile, error: createProfileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                username: usernameFromEmail,
                // avatar_url can be set to a default or left null
              },
            ])
            .select('id, username, avatar_url')
            .single();

          if (createProfileError) {
            console.error('[AuthStore] Error creating profile:', createProfileError);
            // If profile creation fails, profile remains null
          } else if (newProfile) {
            console.log('[AuthStore] Profile created successfully:', newProfile);
            profile = newProfile;
          }
        } catch (e) {
          console.error('[AuthStore] Exception during profile creation:', e);
        }
      } else {
        console.warn('[AuthStore] Cannot create profile: user email is not available.');
      }
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
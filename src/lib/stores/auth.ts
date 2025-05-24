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
  console.log(`[AuthStore] Event: ${event}. Session available: ${!!session}`);

  // Immediately update store to indicate loading has started for this auth event cycle
  authState.update(s => ({ ...s, loading: true }));

  let profile: Profile | null = null;
  let isAuthenticated = !!session; // Determine auth status early, can be overridden in catch

  try {
    if (session?.user) {
      console.log(`[AuthStore] Fetching profile for user ID: ${session.user.id}`);

      const profilePromise = supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', session.user.id)
        .single();

      // Diagnostic: Timeout for the profile fetch
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timed out after 5 seconds')), 5000)
      );

      // @ts-ignore - Promise.race might not infer the exact error type from Supabase side.
      const { data: profileData, error: profileError } = await Promise.race([profilePromise, timeoutPromise]) as { data: Profile | null, error: any | null };

      if (profileError) {
        if (profileError.message && profileError.message.includes('Profile fetch timed out')) {
          console.error('[AuthStore] Profile fetch critically timed out.');
        } else if (profileError.code !== 'PGRST116') { // PGRST116 means no rows, which is handled as no profile
            console.error('[AuthStore] Error fetching profile:', profileError);
        } else { // PGRST116 or other case where data is null but no critical error
            console.warn(`[AuthStore] No profile data found for user ID: ${session.user.id} (PGRST116 or similar). RLS or missing record likely.`);
        }
        // profile remains null
      } else if (profileData) {
        console.log('[AuthStore] Profile data fetched successfully:', profileData);
        profile = profileData;
      } else {
        // This case means no error, but profileData is null/undefined.
        console.warn(`[AuthStore] No profile data returned (but no error) for user ID: ${session.user.id}.`);
        // profile remains null
      }
    } else {
      console.log('[AuthStore] No active session or user, clearing profile.');
      // profile remains null, isAuthenticated is already false from !!session
    }
  } catch (error: any) { // Catch any other unexpected errors
    console.error('[AuthStore] Unexpected error during auth state change processing:', error);
    // In case of a truly unexpected error, ensure user isn't considered authenticated
    // This might be aggressive, but safer if auth state is very broken.
    isAuthenticated = false;
    profile = null;
  } finally {
    // This block ensures that loading is set to false and authState is updated,
    // regardless of errors in the try block.
    console.log('[AuthStore] Entering finally block.');
    authState.set({
      isAuthenticated: isAuthenticated, // Use the determined isAuthenticated status
      session: session,
      user: profile,          // user will be the fetched profile or null
      loading: false,         // Crucially, set loading to false here
    });
    console.log('[AuthStore] Auth state updated (finally block):', { isAuthenticated: isAuthenticated, session, user: profile, loading: false });
  }
});
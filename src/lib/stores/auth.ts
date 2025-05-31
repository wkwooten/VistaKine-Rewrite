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

// Variable to keep track of the last fetched user ID
let lastFetchedUserId: string | null | undefined = null;

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
  // Only set loading to true if we don't have a user or if the user ID is different
  authState.update(s => {
    if (!s.user || (session?.user && s.user?.id !== session.user.id)) {
      return { ...s, loading: true };
    }
    return s; // No need to set loading if user is already loaded and IDs match
  });

  let profile: Profile | null = null;
  let isAuthenticated = !!session; // Determine auth status early, can be overridden in catch
  let currentStoreState = initialAuthState; // To get current user from store
  const unsubscribe = authState.subscribe(s => currentStoreState = s); // Get current store state
  unsubscribe(); // Unsubscribe immediately

  try {
    if (session?.user) {
      // If the user ID is the same as the one already in the store and we have user data,
      // and it's not a TOKEN_REFRESHED event (which might imply profile changes sometimes, though less likely for basic profile data)
      // we can potentially skip the refetch.
      // However, INITIAL_SESSION after a SIGNED_IN might still warrant a load if the initial load failed.
      // Let's refine to: if new session user ID is same as lastFetchedUserId, and we *have* a user profile, skip.
      if (session.user.id === lastFetchedUserId && currentStoreState.user && event !== 'USER_UPDATED') {
        console.log(`[AuthStore] User ID ${session.user.id} already processed and profile exists. Skipping profile refetch.`);
        profile = currentStoreState.user; // Use existing profile
        // Ensure loading is set to false if we skipped and it was true
        authState.update(s => ({ ...s, loading: false }));
      } else {
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
          lastFetchedUserId = session.user.id; // Update last fetched user ID
        } else {
          // This case means no error, but profileData is null/undefined.
          console.warn(`[AuthStore] No profile data returned (but no error) for user ID: ${session.user.id}.`);
          profile = null; // Explicitly set profile to null
          lastFetchedUserId = session.user.id; // Still update, as we attempted for this ID
        }
      }
    } else {
      console.log('[AuthStore] No active session or user, clearing profile.');
      profile = null; // Ensure profile is null
      lastFetchedUserId = null; // Clear last fetched user ID
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
    // If loading was manually set to false due to skipped fetch, respect that.
    // Otherwise, the default is to set loading to false here.
    const finalLoadingState = (session?.user?.id === lastFetchedUserId && currentStoreState.user && event !== 'USER_UPDATED') ? false : false;

    authState.set({
      isAuthenticated: isAuthenticated, // Use the determined isAuthenticated status
      session: session,
      user: profile,          // user will be the fetched profile or null
      loading: finalLoadingState, // Use the determined final loading state
    });
    console.log('[AuthStore] Auth state updated (finally block):', { isAuthenticated: isAuthenticated, session, user: profile, loading: finalLoadingState });
  }
});
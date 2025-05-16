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
  console.log(`Supabase Auth State Change: ${event}`);

  let profile: Profile | null = null;
  if (session?.user) {
    // Fetch the user's profile from the 'profiles' table
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url') // Select the fields you need
      .eq('id', session.user.id) // Filter by the authenticated user's ID
      .single(); // Expect a single row

    if (error) {
      console.error('Error fetching profile:', error);
      // Handle error (e.g., log out user if profile is missing/error)
    } else if (data) {
      profile = data; // Assign fetched profile data
    }
  }

  authState.set({
    isAuthenticated: !!session, // True if session exists
    session: session,
    user: profile, // Set the fetched profile here
    loading: false, // No longer loading after initial check or change
  });
});
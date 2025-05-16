import { writable, type Writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  isAuthenticated: boolean; // Derived from session/user presence
  session: Session | null;
  user: User | null;
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
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`Supabase Auth State Change: ${event}`);
  authState.set({
    isAuthenticated: !!session, // True if session exists
    session: session,
    user: session?.user || null,
    loading: false, // No longer loading after initial check or change
  });
});
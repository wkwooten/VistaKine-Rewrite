import { writable, type Writable } from 'svelte/store';

export interface User {
  username: string;
  avatar?: string; // Optional: path to avatar image
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  // For demonstration, let's simulate a logged-in user:
  // isAuthenticated: true,
  // user: { username: '@Kristi_Tremblay', avatar: '/path/to/default-avatar.png' }
};

export const authState: Writable<AuthState> = writable(initialAuthState);

// Mock login/logout functions (we'll expand these later)
export function login(user: User) {
  authState.set({ isAuthenticated: true, user });
}

export function logout() {
  authState.set({ isAuthenticated: false, user: null });
}
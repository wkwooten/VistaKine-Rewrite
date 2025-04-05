import { writable } from 'svelte/store';

export interface FBDVisibilityState {
  velocity: boolean;
  weight: boolean;
  acceleration: boolean;
  netForce: boolean;
  normalForce: boolean;
  friction: boolean;
}

// Initial state: all vectors visible
const initialState: FBDVisibilityState = {
  velocity: true,
  weight: true,
  acceleration: true,
  netForce: true,
  normalForce: true,
  friction: true
};

// Create the writable store
export const fbdVisibilityStore = writable<FBDVisibilityState>(initialState);
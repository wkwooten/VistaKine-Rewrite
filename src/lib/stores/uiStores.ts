import { writable } from 'svelte/store';

/** Controls the visibility of the FBD Menu */
export const isFBDMenuOpen = writable(false);
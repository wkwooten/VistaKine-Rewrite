import { writable } from 'svelte/store';

/** Controls the visibility of the FBD Menu */
export const isFBDMenuOpen = writable(false);

// ADD Store for Section Map visibility
export const sectionMapOpen = writable(false);
import { writable } from 'svelte/store';
import type { Group } from 'three';

/**
 * Stores a reference to the currently selected Three.js Group, or null if nothing is selected.
 */
export const selectedObject = writable<Group | null>(null);
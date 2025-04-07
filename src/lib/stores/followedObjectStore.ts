import { writable } from 'svelte/store';
import type { Group } from 'three';

/**
 * Stores a reference to the Three.js Group being followed by the camera, or null if nothing is followed.
 */
export const followedObject = writable<Group | null>(null);
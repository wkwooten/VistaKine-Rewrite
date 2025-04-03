import { writable } from 'svelte/store';

// Boolean store to track if any object is currently being dragged
export const isDragging = writable<boolean>(false);
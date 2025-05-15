import { writable } from 'svelte/store';
import { Vector3 } from 'three';

/**
 * Represents the vector currently being defined by the user in the VectorOperationControls.
 */
export const currentDefiningVectorStore = writable(new Vector3(0, 0, 0));

// Add other shared states for the vector-printer exercise as needed.
// For example:
// export const nozzlePositionStore = writable(new Vector3(0, 0, 0));
// export const printedSegmentsStore = writable<{ start: Vector3; end: Vector3; vector: Vector3 }[]>([]);
// export const dialogTurnsStore = writable<DialogTurn[]>([]);
// export const showDialogStore = writable<boolean>(false);
import { writable } from 'svelte/store';
import { Vector3 } from 'three';
import type { ColorRepresentation } from 'three';

/**
 * Represents the vector currently being defined by the user in the VectorOperationControls.
 */
export const currentDefiningVectorStore = writable(new Vector3(0, 0, 0));

export interface DefinedVector {
  vector: Vector3;
  name: string;
  color: ColorRepresentation;
  id: string;
}

/**
 * Stores the array of vectors that have been "printed" or defined by the user.
 */
export const definedVectorsStore = writable<DefinedVector[]>([]);

/**
 * Stores the resultant vector, calculated from the sum of vectors in definedVectorsStore.
 * It's null if there are not enough vectors to calculate a resultant.
 */
export const resultantVectorStore = writable<Vector3 | null>(null);

// Add other shared states for the vector-printer exercise as needed.
// For example:
// export const nozzlePositionStore = writable(new Vector3(0, 0, 0));
// export const printedSegmentsStore = writable<{ start: Vector3; end: Vector3; vector: Vector3 }[]>([]);
// export const dialogTurnsStore = writable<DialogTurn[]>([]);
// export const showDialogStore = writable<boolean>(false);
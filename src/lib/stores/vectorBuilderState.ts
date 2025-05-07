import { writable, derived } from 'svelte/store';
import { Vector3 } from 'three';
import type { DialogTurn } from './calibrationState'; // Assuming it's exported there or define locally

// Color stores removed, moved to themeColors.ts

// --- Constants (Symmetrical Range) ---
const BOUND = 10;
export const MIN_X = -BOUND;
export const MAX_X = BOUND;
export const MIN_Y = -BOUND;
export const MAX_Y = BOUND;
export const MIN_Z = -BOUND;
export const MAX_Z = BOUND;

// --- Core State --- //

// Raw coordinate inputs from the HUD
// Default to 0,0,0 for both start and end initially
export const startCoordsRaw = writable<{ x: string | null, y: string | null, z: string | null }>({ x: '0', y: '0', z: '0' });
export const endCoordsRaw = writable<{ x: string | null, y: string | null, z: string | null }>({ x: '0', y: '0', z: '0' });

// Parsed coordinate numbers, defaulting invalid/empty to 0, and clamping to new bounds
export const startCoordsNum = derived(startCoordsRaw, ($raw) => {
    let x = parseFloat($raw.x ?? '0');
    let y = parseFloat($raw.y ?? '0');
    let z = parseFloat($raw.z ?? '0');

    // Default to 0 if NaN
    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;
    if (isNaN(z)) z = 0;

    // Clamp values (optional, but good practice)
    x = Math.max(MIN_X, Math.min(MAX_X, x));
    y = Math.max(MIN_Y, Math.min(MAX_Y, y));
    z = Math.max(MIN_Z, Math.min(MAX_Z, z));

    return { x, y, z };
});

export const endCoordsNum = derived(endCoordsRaw, ($raw) => {
    let x = parseFloat($raw.x ?? '0');
    let y = parseFloat($raw.y ?? '0');
    let z = parseFloat($raw.z ?? '0');

    // Default to 0 if NaN
    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;
    if (isNaN(z)) z = 0;

     // Clamp values (optional, but good practice)
    x = Math.max(MIN_X, Math.min(MAX_X, x));
    y = Math.max(MIN_Y, Math.min(MAX_Y, y));
    z = Math.max(MIN_Z, Math.min(MAX_Z, z));

    return { x, y, z };
});

// Vector representation - should now always be valid unless start/end are identical initially
// (or if you add specific logic to return null for zero-length vectors)
export const vectorData = derived(
    [startCoordsNum, endCoordsNum],
    ([$start, $end]) => {
        const dx = $end.x - $start.x;
        const dy = $end.y - $start.y;
        const dz = $end.z - $start.z;
        const magnitude = Math.sqrt(dx*dx + dy*dy + dz*dz);

        return {
            start: { x: $start.x, y: $start.y, z: $start.z },
            end: { x: $end.x, y: $end.y, z: $end.z },
            components: { dx, dy, dz },
            magnitude
        };
    }
);

// --- Control State --- //

// Flags to control visibility of delta component lines
export const showDeltaX = writable<boolean>(true);
export const showDeltaY = writable<boolean>(true);
export const showDeltaZ = writable<boolean>(true);

// --- Notation State --- //
export const useIjkNotation = writable<boolean>(false);

// --- Dialog State (using DialogTurn) --- //
export const vectorBuilderDialogTurns = writable<DialogTurn[]>([]);
export const showVectorBuilderDialog = writable<boolean>(false);

// --- Helper Functions --- //

export function showVectorDialog(turnsToShow: DialogTurn[]) {
	vectorBuilderDialogTurns.set(turnsToShow);
	showVectorBuilderDialog.set(true);
}

export function hideVectorDialog() {
	showVectorBuilderDialog.set(false);
	// Optional: Clear turns when hiding
	// vectorBuilderDialogTurns.set([]);
}
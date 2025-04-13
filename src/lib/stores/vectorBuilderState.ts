import { writable, derived } from 'svelte/store';
import { Vector3 } from 'three';

// --- Constants (inherited from calibration, adjust if needed) ---
export const MIN_X = 0;
export const MAX_X = 12;
export const MIN_Y = 0;
export const MAX_Y = 10;
export const MIN_Z = 0;
export const MAX_Z = 12;

// --- Core State --- //

// Raw coordinate inputs from the HUD
export const startCoordsRaw = writable<{ x: string | null, y: string | null, z: string | null }>({ x: '0', y: '0', z: '0' });
export const endCoordsRaw = writable<{ x: string | null, y: string | null, z: string | null }>({ x: null, y: null, z: null });

// Parsed and validated coordinate numbers (null if invalid/empty)
export const startCoordsNum = derived(startCoordsRaw, ($raw) => {
    const x = parseFloat($raw.x ?? '');
    const y = parseFloat($raw.y ?? '');
    const z = parseFloat($raw.z ?? '');
    if (isNaN(x) || isNaN(y) || isNaN(z)) return null;
    // Add validation if needed (e.g., bounds checking)
    return { x, y, z };
});

export const endCoordsNum = derived(endCoordsRaw, ($raw) => {
    const x = parseFloat($raw.x ?? '');
    const y = parseFloat($raw.y ?? '');
    const z = parseFloat($raw.z ?? '');
    if (isNaN(x) || isNaN(y) || isNaN(z)) return null;
    // Add validation if needed (e.g., bounds checking)
    return { x, y, z };
});

// Vector representation (null if points are invalid)
export const vectorData = derived(
    [startCoordsNum, endCoordsNum],
    ([$start, $end]) => {
        if (!$start || !$end) return null;

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

// Flag to trigger the scene to trace the vector
export const traceVectorRequested = writable<boolean>(false);

// Flag to trigger a reset
export const resetVectorBuilderRequested = writable<boolean>(false);

// --- Dialog State (similar to calibration) --- //
export const vectorBuilderDialogMessages = writable<string[]>([]);
export const showVectorBuilderDialog = writable<boolean>(false);
export const vectorBuilderSpeaker = writable<string>('Leo');

// --- Helper Functions --- //

export function showVectorDialog(messagesToShow: string[], speakerName: string = 'Leo') {
	vectorBuilderSpeaker.set(speakerName);
	vectorBuilderDialogMessages.set(messagesToShow);
	showVectorBuilderDialog.set(true);
}

export function hideVectorDialog() {
	showVectorBuilderDialog.set(false);
}
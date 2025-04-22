import { writable, derived } from 'svelte/store';
import { Vector3 } from 'three';
import type { DialogTurn } from './calibrationState'; // Assuming it's exported there or define locally

// --- Visual State (Colors) ---
export const xAxisColor = writable<string>('red');
export const yAxisColor = writable<string>('lime');
export const zAxisColor = writable<string>('blue');
export const nozzleColor = writable<string>('#4682b4');
export const nozzleEdgesColor = writable<string>('#ADD8E6');
export const heightIndicatorColor = writable<string>('#ADD8E6');
export const bedColor = writable<string>('#ffffff');
export const bedEdgesColor = writable<string>('#ADD8E6');
export const gridCellColor = writable<string>('#ADD8E6');
export const gridSectionColor = writable<string>('#64B5F6');
export const vectorColor = writable<string>('#ff00ff');
export const startPointColor = writable<string>('#FFA500');
export const endPointColor = writable<string>('#1E90FF');

// --- Constants (inherited from calibration, adjust if needed) ---
export const MIN_X = 0;
export const MAX_X = 12;
export const MIN_Y = 0;
export const MAX_Y = 12;
export const MIN_Z = 0;
export const MAX_Z = 12;

// --- Core State --- //

// Raw coordinate inputs from the HUD
export const startCoordsRaw = writable<{ x: string | null, y: string | null, z: string | null }>({ x: '0', y: '0', z: '0' });
export const endCoordsRaw = writable<{ x: string | null, y: string | null, z: string | null }>({ x: null, y: null, z: null });

// Parsed and validated coordinate numbers (null if invalid/empty or out of bounds)
export const startCoordsNum = derived(startCoordsRaw, ($raw) => {
    const x = parseFloat($raw.x ?? '');
    const y = parseFloat($raw.y ?? '');
    const z = parseFloat($raw.z ?? '');
    if (
        isNaN(x) || isNaN(y) || isNaN(z) ||
        x < MIN_X || x > MAX_X ||
        y < MIN_Y || y > MAX_Y ||
        z < MIN_Z || z > MAX_Z
    ) {
        return null;
    }
    return { x, y, z };
});

export const endCoordsNum = derived(endCoordsRaw, ($raw) => {
    const x = parseFloat($raw.x ?? '');
    const y = parseFloat($raw.y ?? '');
    const z = parseFloat($raw.z ?? '');
    if (
        isNaN(x) || isNaN(y) || isNaN(z) ||
        x < MIN_X || x > MAX_X ||
        y < MIN_Y || y > MAX_Y ||
        z < MIN_Z || z > MAX_Z
    ) {
        return null;
    }
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

// Flags to control visibility of delta component lines
export const showDeltaX = writable<boolean>(true);
export const showDeltaY = writable<boolean>(true);
export const showDeltaZ = writable<boolean>(true);

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
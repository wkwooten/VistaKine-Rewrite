import { writable } from 'svelte/store';

// Define the structure for a single dialog turn
export interface DialogTurn {
	speaker: string;
	message: string;
}

// Define the structure for a target point
export interface TargetPoint {
  id: string;
  x: number;
  y: number;
  z: number;
}

// --- State ---
// Rename dialogMessages to dialogTurns and update type
export const dialogTurns = writable<DialogTurn[]>([]);
export const showDialog = writable<boolean>(false);
// Remove the speaker store as it will be derived from the turns
// export const speaker = writable<string>('');

// Nozzle and Stage State for Printer Calibration
export const relativeNozzleXStore = writable<number>(0);
export const relativeNozzleYStore = writable<number>(5);
export const relativeNozzleZStore = writable<number>(0);
export const currentStageStore = writable<number>(1);
export const activeTargetsStore = writable<TargetPoint[]>([]); // For the current stage's targets

// --- Actions / Functions ---
// We'll implement these functions within the components that handle the logic.
// Using simple writables to signal requests is often cleaner than exporting functions
// that modify state elsewhere, especially for triggering actions in the scene from the UI.

// UI -> Scene Communication
export const requestedNozzlePosition = writable<{ x: number; y: number; z: number } | null>(null);

// Scene -> UI Communication (Directly use the state writables above)

// Helper to simplify showing dialogs from the scene
// Update function to accept DialogTurn[] and remove speakerName parameter
export function showCalibrationDialog(turnsToShow: DialogTurn[]) {
	// speaker.set(speakerName); // Removed
	dialogTurns.set(turnsToShow);
	showDialog.set(true);
}

// Helper to hide dialog (can be called by UI or Scene)
export function hideCalibrationDialog() {
	showDialog.set(false);
	// Optional: Clear turns when hiding
	// dialogTurns.set([]);
}

// --- Constants (Consider moving MIN/MAX here if used widely) ---
export const MIN_X = 0;
export const MAX_X = 12;
export const MIN_Y = 0;
export const MAX_Y = 12;
export const MIN_Z = 0;
export const MAX_Z = 12;

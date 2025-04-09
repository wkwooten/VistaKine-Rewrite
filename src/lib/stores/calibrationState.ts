import { writable } from 'svelte/store';

// --- State ---
export const dialogMessages = writable<string[]>([]);
export const showDialog = writable<boolean>(false);
export const speaker = writable<string>('');

// --- Actions / Functions ---
// We'll implement these functions within the components that handle the logic.
// Using simple writables to signal requests is often cleaner than exporting functions
// that modify state elsewhere, especially for triggering actions in the scene from the UI.

// UI -> Scene Communication
export const requestedNozzlePosition = writable<{ x: number; y: number; z: number } | null>(null);
export const resetSceneRequested = writable<boolean>(false); // Use a simple boolean flag

// Scene -> UI Communication (Directly use the state writables above)

// Helper to simplify showing dialogs from the scene
export function showCalibrationDialog(messagesToShow: string[], speakerName: string = 'Leo') {
	speaker.set(speakerName);
	dialogMessages.set(messagesToShow);
	showDialog.set(true);
}

// Helper to hide dialog (can be called by UI or Scene)
export function hideCalibrationDialog() {
	showDialog.set(false);
	// Optional: Clear messages when hiding
	// dialogMessages.set([]);
	// speaker.set('');
}

// --- Constants (Consider moving MIN/MAX here if used widely) ---
export const MIN_X = 0;
export const MAX_X = 12;
export const MIN_Y = 0;
export const MAX_Y = 10;
export const MIN_Z = 0;
export const MAX_Z = 12;

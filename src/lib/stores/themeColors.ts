import { writable } from 'svelte/store';
import { get } from 'svelte/store'; // Needed for reading current value in update function
import type { Writable } from 'svelte/store'; // Import Writable type

// --- Common Visual State (Colors) ---
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
export const backgroundColor = writable<string>('#ffffff');
export const sceneGroundColor = writable<string>('#e0e0e0');

// --- Accent Colors (New) ---
export const accentColor = writable<string>('#004d9f'); // Default from $color-accent (light)
export const accentLightColor = writable<string>('#64B5F6'); // Default from $color-accent-light (light)
export const accentHoverColor = writable<string>('#1565C0'); // Default from $color-accent-hover (light)

// --- Vector Builder Specific Colors ---
export const vectorColor = writable<string>('#d32f2f');
export const startPointColor = writable<string>('#FFA500');
export const endPointColor = writable<string>('#1E90FF');

// --- Printer Calibration Specific Colors ---
export const targetPendingColor = writable<string>('#FFA500'); // Orange
export const targetHitColor = writable<string>('#32CD32'); // LimeGreen
export const targetLabelPendingColor = writable<string>('#FFA500'); // Darker Amber/Orange
export const targetLabelHitColor = writable<string>('#32CD32'); // Darker Green

// --- General UI/Label Colors ---
export const labelColor = writable<string>('#cccccc'); // Default fallback
export const originColor = writable<string>('#cccccc'); // Default fallback
export const surfaceColor = writable<string>('#cccccc'); // Default fallback
export const textColor = writable<string>('#cccccc'); // Default fallback

/**
 * Fetches color values from CSS custom properties and updates the stores.
 * This function also sets up a listener for system theme changes to re-fetch colors.
 * Should be called once client-side, e.g., in the root layout.
 */
export function updateThemeColors() {
	if (typeof window !== "undefined") {
		const fetchAndUpdateAllColors = () => {
			console.log("[ThemeColors] Fetching CSS color variables...");
			const styles = getComputedStyle(document.documentElement);

			// Helper function to get style and update store
			const updateColorStore = (store: Writable<string>, varName: string) => {
				const value = styles.getPropertyValue(varName).trim();
				if (value) {
					store.set(value);
				} else {
					console.warn(`[ThemeColors] CSS variable ${varName} not found, using default.`);
					// No need to set, default is already there
				}
			};

			// Update common colors
			updateColorStore(xAxisColor, '--axis-color-x');
			updateColorStore(yAxisColor, '--axis-color-y');
			updateColorStore(zAxisColor, '--axis-color-z');
			updateColorStore(labelColor, '--color-text-primary');
			updateColorStore(surfaceColor, '--color-surface');
			updateColorStore(nozzleColor, '--calibration-nozzle-color');
			updateColorStore(nozzleEdgesColor, '--calibration-nozzle-edges-color');
			updateColorStore(heightIndicatorColor, '--calibration-height-indicator-color');
			updateColorStore(bedColor, '--color-surface');
			updateColorStore(bedEdgesColor, '--calibration-bed-edges-color');
			updateColorStore(gridCellColor, '--scene-grid-cell-color');
			updateColorStore(gridSectionColor, '--scene-grid-section-color');
			updateColorStore(backgroundColor, '--color-background');
			updateColorStore(textColor, '--color-text-primary');
			updateColorStore(sceneGroundColor, '--scene-ground-color');

			// Update Accent Colors (New)
			updateColorStore(accentColor, '--color-accent');
			updateColorStore(accentLightColor, '--color-accent-light');
			updateColorStore(accentHoverColor, '--color-accent-hover');

			// Update vector builder specific colors
			updateColorStore(vectorColor, '--vector-color');
			updateColorStore(startPointColor, '--vector-builder-start-color');
			updateColorStore(endPointColor, '--vector-builder-end-color');

			// Update printer calibration specific colors
			updateColorStore(targetPendingColor, '--calibration-target-pending-color');
			updateColorStore(targetHitColor, '--calibration-target-hit-color');
			updateColorStore(targetLabelPendingColor, '--calibration-target-pending-color');
			updateColorStore(targetLabelHitColor, '--calibration-target-hit-color');

			// Update general label color
			updateColorStore(labelColor, '--color-text-primary');
			updateColorStore(originColor, '--color-text-secondary');

			console.log("[ThemeColors] Finished updating color stores.");
		};

		// Initial fetch
		fetchAndUpdateAllColors();

		// Listen for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			console.log("[ThemeColors] System theme changed, re-fetching colors.");
			fetchAndUpdateAllColors();
		};
		mediaQuery.addEventListener('change', handleChange);

		// It's good practice to offer a way to clean up the listener,
		// though for a global store like this that lives for the app's lifetime,
		// it might not be strictly necessary unless the app can be "unmounted".
		// For now, we'll assume it lives as long as the app.
		// If cleanup is needed, this function could return the cleanup function:
		// return () => mediaQuery.removeEventListener('change', handleChange);

	} else {
		console.warn("[ThemeColors] updateThemeColors called on server, skipping CSS variable fetch.");
	}
}
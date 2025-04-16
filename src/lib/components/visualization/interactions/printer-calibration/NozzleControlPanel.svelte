<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { showCalibrationDialog, MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_Z, MAX_Z } from '$lib/stores/calibrationState';
	// Axis colors are assumed to be global CSS variables (--axis-color-x, etc.)

	// --- Props ---
	// Use $bindable for two-way binding with the parent
	// Add explicit types
	let {
		x = $bindable<number>(MIN_X),
		y = $bindable<number>(5),
		z = $bindable<number>(MIN_Z)
	} = $props<{ x?: number; y?: number; z?: number }>();

	// --- Event Dispatcher (Potentially remove if direct binding handles everything) ---
	// Define the type for the dispatched event detail
	// const dispatch = createEventDispatcher<{ requestMove: { x: number; y: number; z: number } }>(); // Keep if needed for other actions

	// --- Validation Effect ---
	// Runs whenever x, y, or z changes due to binding
	$effect(() => {
		// Validate X
		if (x < MIN_X || x > MAX_X) {
			showCalibrationDialog([{ speaker: 'Leo', message: `Careful, Surya! My calculations show that X value is outside the physical print area. It needs to be between ${MIN_X} and ${MAX_X}.` }]);
			// Optional: Clamp or revert value here if needed
			x = Math.max(MIN_X, Math.min(MAX_X, x));
			return; // Stop further checks if one fails
		}
		// Validate Y
		if (y < MIN_Y || y > MAX_Y) {
			showCalibrationDialog([{ speaker: 'Surya', message: `Whoa, whoa! The Y-axis limit is ${MAX_Y}. We need to stay between ${MIN_Y} and ${MAX_Y}. We don't want to break my printer, its fragile!` }]);
			y = Math.max(MIN_Y, Math.min(MAX_Y, y));
			return;
		}
		// Validate Z
		if (z < MIN_Z || z > MAX_Z) {
			showCalibrationDialog([{ speaker: 'Leo', message: `That Z coordinate is problematic. We must remain within the ${MIN_Z} to ${MAX_Z} range for proper bed adhesion.` }]);
			z = Math.max(MIN_Z, Math.min(MAX_Z, z));
			return;
		}

		// Optional: If validation passes and we still needed dispatch for some reason
		// console.log(`[NozzleControlPanel] Values updated via binding: X=${x}, Y=${y}, Z=${z}`);
		// dispatch('requestMove', { x: x, y: y, z: z });
	});

	// Removed handleMoveRequest and handleKeydown functions
</script>

<!-- Replicate structure from VectorInputPanel -->
<div class="nozzle-control-panel">
	<h4>Control Nozzle</h4>
	<div class="coord-inputs">
		<!-- X Input Group -->
		<div class="axis-input-group" style="border-color: var(--axis-color-x);">
			<span class="axis-label" style="color: var(--axis-color-x);">X</span>
			<input
				type="number"
				bind:value={x}
				min={MIN_X}
				max={MAX_X}
				placeholder="X"
			/>
		</div>
		<!-- Y Input Group -->
		<div class="axis-input-group" style="border-color: var(--axis-color-y);">
			<span class="axis-label" style="color: var(--axis-color-y);">Y</span>
			<input
				type="number"
				bind:value={y}
				min={MIN_Y}
				max={MAX_Y}
				placeholder="Y"
			/>
		</div>
		<!-- Z Input Group -->
		<div class="axis-input-group" style="border-color: var(--axis-color-z);">
			<span class="axis-label" style="color: var(--axis-color-z);">Z</span>
			<input
				type="number"
				bind:value={z}
				min={MIN_Z}
				max={MAX_Z}
				placeholder="Z"
			/>
		</div>
	</div>
	<!-- Removed controls-section with the button -->
	<!-- Removed validation message display, dialog handles it -->
</div>

<style lang="scss">
	/* Adapted styles from VectorInputPanel */
	.nozzle-control-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		padding: var(--space-xs);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background-color: var(--color-surface-overlay);
		pointer-events: auto;
		user-select: none; /* Disable text selection */
		-webkit-user-select: none; /* Safari */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* IE/Edge */
	}

	h4 {
		margin-bottom: var(--space-2xs);
		color: var(--color-text-secondary);
		font-weight: 600;
		font-size: 1.1em;
	}
	/* Copied/Adapted from VectorInputPanel */
	.coord-inputs {
		display: grid;
		margin-bottom: var(--space-s);
		grid-template-columns: repeat(3, max-content); /* Arrange X, Y, Z groups */
		gap: var(--space-xs); /* Gap between X, Y, Z groups */
		justify-content: center; /* Center the groups if space allows */
	}

	.axis-input-group {
		display: flex;
		align-items: center;
		border-radius: var(--radius-md);
		padding: var(--space-3xs) var(--space-2xs);
		gap: var(--space-2xs);
		border: 2px solid; /* Color set inline via style */
		background-color: transparent;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.axis-label {
		font-weight: 600;
		font-size: 0.9em;
		min-width: 1em;
		text-align: center;
		/* Color set inline via style */
	}

	.axis-input-group input[type="number"] {
		width: 3ch; /* Reduced width */
		padding: var(--space-3xs); /* Adjust padding */
		font-size: 1em;
		background-color: var(--color-background); /* Grey background */
		border-radius: var(--radius-sm); /* Rounded corners for input */
		color: var(--color-text-primary);
		text-align: right;
		border: none; /* Remove default border */
		box-shadow: inset 0 1px 2px rgba(0,0,0,0.1); /* Subtle inset shadow */
		transition: box-shadow 0.2s ease;

		/* Hide spinners for Webkit browsers */
		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
		/* Hide spinners for Firefox */
		-moz-appearance: textfield;
	}

	/* Focus state */
	.axis-input-group:focus-within {
		box-shadow: 0 0 3px 1px var(--color-accent-light);
	}

	/* No specific invalid state styling needed here like VectorInputPanel */

	/* Removed controls-section styles */
</style>
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

	// --- Input step value ---
	const step = 1; // Adjust this value as needed

	// --- Validation Effect ---
	// Runs whenever x, y, or z changes due to binding or button clicks
	$effect(() => {
		// Ensure value is a number before validation
		x = Number(x);
		y = Number(y);
		z = Number(z);

		// Validate X
		if (x < MIN_X || x > MAX_X) {
			showCalibrationDialog([{ speaker: 'Leo', message: `Careful, Surya! My calculations show that X value is outside the physical print area. It needs to be between ${MIN_X} and ${MAX_X}.` }]);
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
	<h4>Nozzle Control Panel</h4>
	<div class="coord-inputs">
		<!-- X Input Group -->
		<div class="axis-input-group" style="border-color: var(--axis-color-x);">
			<span class="axis-label" style="color: var(--axis-color-x);">X</span>
			<div class="input-stepper">
				<button class="stepper-button" onclick={() => x = Number(x) + step}>+</button>
				<input
					type="number"
					bind:value={x}
					min={MIN_X}
					max={MAX_X}
					placeholder="X"
				/>
				<button class="stepper-button" onclick={() => x = Number(x) - step}>-</button>
			</div>
		</div>
		<!-- Y Input Group -->
		<div class="axis-input-group" style="border-color: var(--axis-color-y);">
			<span class="axis-label" style="color: var(--axis-color-y);">Y</span>
			<div class="input-stepper">
				<button class="stepper-button" onclick={() => y = Number(y) + step}>+</button>
				<input
					type="number"
					bind:value={y}
					min={MIN_Y}
					max={MAX_Y}
					placeholder="Y"
				/>
				<button class="stepper-button" onclick={() => y = Number(y) - step}>-</button>
			</div>
		</div>
		<!-- Z Input Group -->
		<div class="axis-input-group" style="border-color: var(--axis-color-z);">
			<span class="axis-label" style="color: var(--axis-color-z);">Z</span>
			<div class="input-stepper">
				<button class="stepper-button" onclick={() => z = Number(z) + step}>+</button>
				<input
					type="number"
					bind:value={z}
					min={MIN_Z}
					max={MAX_Z}
					placeholder="Z"
				/>
				<button class="stepper-button" onclick={() => z = Number(z) - step}>-</button>
			</div>
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
		gap: var(--space-s); /* Increased gap slightly */
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
		align-self: center; /* Align label with the center of the input-stepper */
	}

	.input-stepper {
		display: flex;
		flex-direction: column; /* Stack buttons and input vertically */
		align-items: center; /* Center items horizontally */
		gap: var(--space-3xs); /* Gap between buttons and input */
	}

	.input-stepper input[type="number"] {
		width: 4ch; /* Slightly wider to accommodate +/- buttons */
		padding: var(--space-3xs) var(--space-2xs); /* Adjust padding */
		font-size: 1em;
		background-color: var(--color-background); /* Grey background */
		border-radius: var(--radius-sm); /* Rounded corners for input */
		color: var(--color-text-primary);
		text-align: center; /* Center text */
		border: none; /* Remove default border */
		box-shadow: inset 0 1px 2px rgba(0,0,0,0.1); /* Subtle inset shadow */
		transition: box-shadow 0.2s ease;
		order: 2; /* Place input between buttons */

		/* Hide spinners for Webkit browsers */
		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
		/* Hide spinners for Firefox */
		-moz-appearance: textfield;
	}

	.stepper-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: calc(4ch + 2 * var(--space-2xs)); /* Match input width + padding */
		height: auto; /* Adjust height */
		padding: var(--space-3xs); /* Small padding */
		font-size: 1.1em; /* Slightly larger font for +/- */
		font-weight: bold;
		line-height: 1;
		color: var(--color-text-secondary);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease;

		&:first-child {
			order: 1; /* Place '+' button on top */
		}

		&:last-child {
			order: 3; /* Place '-' button on bottom */
		}

		&:hover {
			background-color: var(--color-surface-hover);
			color: var(--color-text-primary);
		}

		&:active {
			background-color: var(--color-surface-active);
		}
	}

	/* Focus state */
	.axis-input-group:focus-within {
		box-shadow: 0 0 3px 1px var(--color-accent-light);
	}

	/* No specific invalid state styling needed here like VectorInputPanel */

	/* Removed controls-section styles */
</style>
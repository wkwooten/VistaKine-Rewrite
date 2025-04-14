<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { showCalibrationDialog, MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_Z, MAX_Z } from '$lib/stores/calibrationState';
	// Axis colors are assumed to be global CSS variables (--axis-color-x, etc.)

	// --- State ---
	let nozzleX = $state(MIN_X);
	let nozzleY = $state(5);
	let nozzleZ = $state(MIN_Z);
	// Removed validationMessage, dialog store handles messages directly

	// --- Event Dispatcher ---
	// Define the type for the dispatched event detail
	const dispatch = createEventDispatcher<{ requestMove: { x: number; y: number; z: number } }>();

	// --- Event Handlers ---
	function handleMoveRequest() {
		// Input Validation
		if (nozzleX < MIN_X || nozzleX > MAX_X) {
			// Pass data as DialogTurn[]
			showCalibrationDialog([{ speaker: 'Leo', message: `Careful, Surya! My calculations show that X value is outside the physical print area. It needs to be between ${MIN_X} and ${MAX_X}.` }]);
			return;
		}
		if (nozzleY < MIN_Y || nozzleY > MAX_Y) {
			showCalibrationDialog([{ speaker: 'Surya', message: `Whoa, whoa! The Y-axis limit is ${MAX_Y}. We need to stay between ${MIN_Y} and ${MAX_Y}. We don't want to break my printer, its fragile!` }]);
			return;
		}
		if (nozzleZ < MIN_Z || nozzleZ > MAX_Z) {
			showCalibrationDialog([{ speaker: 'Leo', message: `That Z coordinate is problematic. We must remain within the ${MIN_Z} to ${MAX_Z} range for proper bed adhesion.` }]);
			return;
		}

		// If valid, dispatch the event for the parent (HUD) to handle
		console.log(`[NozzleControlPanel] Dispatching requestMove: X=${nozzleX}, Y=${nozzleY}, Z=${nozzleZ}`);
		dispatch('requestMove', { x: nozzleX, y: nozzleY, z: nozzleZ });
	}

	// New handler for keydown events on inputs
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			// Prevent default form submission behavior if this were inside a form
			event.preventDefault();
			handleMoveRequest();
		}
	}
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
				bind:value={nozzleX}
				min={MIN_X}
				max={MAX_X}
				onkeydown={handleKeydown}
				placeholder="X"
			/>
		</div>
		<!-- Y Input Group -->
		<div class="axis-input-group" style="border-color: var(--axis-color-y);">
			<span class="axis-label" style="color: var(--axis-color-y);">Y</span>
			<input
				type="number"
				bind:value={nozzleY}
				min={MIN_Y}
				max={MAX_Y}
				onkeydown={handleKeydown}
				placeholder="Y"
			/>
		</div>
		<!-- Z Input Group -->
		<div class="axis-input-group" style="border-color: var(--axis-color-z);">
			<span class="axis-label" style="color: var(--axis-color-z);">Z</span>
			<input
				type="number"
				bind:value={nozzleZ}
				min={MIN_Z}
				max={MAX_Z}
				onkeydown={handleKeydown}
				placeholder="Z"
			/>
		</div>
	</div>
	<div class="controls-section">
		<button onclick={handleMoveRequest}>Move Nozzle</button>
	</div>
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
		/* Removed absolute positioning */
	}

	h4 {
		margin-bottom: var(--space-2xs);
		color: var(--color-text-secondary);
		font-weight: 600;
		font-size: 1.1em;
	}

	/* Removed old .axis-inputs styles */

	/* Copied/Adapted from VectorInputPanel */
	.coord-inputs {
		display: grid;
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
		width: 5ch; /* Consistent width */
		padding: var(--space-3xs);
		font-size: 1em;
		background-color: var(--color-background);
		border-radius: var(--radius-sm);
		color: var(--color-text-primary);
		text-align: right;
		border: none;
		box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
		transition: box-shadow 0.2s ease;

		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
	}

	/* Focus state */
	.axis-input-group:focus-within {
		box-shadow: 0 0 3px 1px var(--color-accent-light);
	}

	/* No specific invalid state styling needed here like VectorInputPanel */

	/* Controls Section */
	.controls-section {
		display: flex;
		gap: var(--space-xs);
		justify-content: flex-end;

		button {
			padding: var(--space-2xs) var(--space-s);
			font-size: 0.95em;
			/* Use default button styles from theme */
		}
	}
</style>
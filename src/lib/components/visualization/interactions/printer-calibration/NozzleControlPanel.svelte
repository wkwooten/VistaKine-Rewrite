<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { showCalibrationDialog, MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_Z, MAX_Z } from '$lib/stores/calibrationState';

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
			showCalibrationDialog([`Leo: Hold on, Surya! Remember, the X-axis only goes from ${MIN_X} to ${MAX_X} on this printer bed.`]);
			return;
		}
		if (nozzleY < MIN_Y || nozzleY > MAX_Y) {
			showCalibrationDialog([`Leo: Easy there! Keep the nozzle height (Y) between ${MIN_Y} and ${MAX_Y} so we don't hit the bed or go way too high.`]);
			return;
		}
		if (nozzleZ < MIN_Z || nozzleZ > MAX_Z) {
			showCalibrationDialog([`Leo: Almost! The Z-axis (depth) needs to stay between ${MIN_Z} and ${MAX_Z} to be over the printing area.`]);
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

<!-- Bottom Right Input Controls -->
<div class="nozzle-control-panel">
	<div class="axis-inputs">
		<div class="axis-group" id="x-label">
			<label class="axis-label">
				X <span class="axis-range">({MIN_X}-{MAX_X})</span>
				<input type="number" bind:value={nozzleX} min={MIN_X} max={MAX_X} onkeydown={handleKeydown} />
			</label>
		</div>
		<div class="axis-group" id="y-label">
			<label class="axis-label">
				Y <span class="axis-range">({MIN_Y}-{MAX_Y})</span>
				<input type="number" bind:value={nozzleY} min={MIN_Y} max={MAX_Y} onkeydown={handleKeydown} />
			</label>
		</div>
		<div class="axis-group" id="z-label">
			<label class="axis-label">
				Z <span class="axis-range">({MIN_Z}-{MAX_Z})</span>
				<input type="number" bind:value={nozzleZ} min={MIN_Z} max={MAX_Z} onkeydown={handleKeydown} />
			</label>
		</div>
	</div>
	<button onclick={handleMoveRequest}>Move Nozzle</button>
	<!-- Removed validation message display, dialog handles it -->
</div>

<style lang="scss">
	.nozzle-control-panel {
		position: absolute;
		bottom: var(--space-s);
		right: var(--space-s);
		display: flex;
		flex-direction: column; /* Stack axis inputs and button */
		gap: var(--space-s); /* Gap between inputs row and button */
		padding: var(--space-s);
		background-color: rgba(var(--bg-secondary-rgb), 0.95);
		border-radius: var(--radius-sm);
		/* max-width: 180px; Remove or adjust if needed */
		color: var(--color-text-inverted);
		pointer-events: auto;
		z-index: 10;

		#x-label {
			background-color: var(--axis-color-x-t75);
			color: var(--color-text-inverted);
			border-radius: var(--radius-xs); // Add radius for consistency
			padding-bottom: var(--space-3xs); // Add some bottom padding inside label bg
		}

		#y-label {
			background-color: var(--axis-color-y-t75);
			color: var(--color-text-inverted);
			border-radius: var(--radius-xs); // Add radius for consistency
			padding-bottom: var(--space-3xs); // Add some bottom padding inside label bg
		}

		#z-label {
			background-color: var(--axis-color-z-t75);
			color: var(--color-text-inverted);
			border-radius: var(--radius-xs); // Add radius for consistency
			padding-bottom: var(--space-3xs); // Add some bottom padding inside label bg
		}


		.axis-inputs {
			display: flex;
			justify-content: space-between; /* Space out axis groups */
			gap: var(--space-xs);
		}

		.axis-group {
			display: flex; /* Use flex for label content alignment */
			flex-direction: column;
			align-items: center; /* Center label text and input */
			/* Removed border-radius from group, apply to label background instead */
			flex: 1; /* Allow groups to share space */
			padding-top: var(--space-3xs); // Add padding inside group if needed
		}

		label.axis-label { // Make selector more specific
			font-size: 0.9em;
			font-weight: bold;
			text-align: center;
			margin-bottom: var(--space-3xs);
			width: 100%; // Ensure label takes full width of group for background
			padding: var(--space-3xs) 0; // Add some vertical padding within label background
			border-radius: var(--radius-xs); // Apply radius here
		}

		.axis-range {
			font-size: 0.8em;
			font-weight: normal;
			display: block; /* Ensure range is on its own line or handled differently */
			color: var(--text-secondary); /* Dim the range text */
			margin-top: 2px; // Add small space above range text
		}

		input[type="number"] {
			/* width: 100%; Inherited flex item sizing will handle this */
			max-width: 60px; /* Limit input width */
			padding: var(--space-2xs);
			background-color: var(--bg-primary);
			border: 1px solid var(--color-border);
			border-radius: var(--radius-xs);
			color: var(--color-text-primary);
			/* background-color: var(--color-text-inverted); Input background should likely be standard */
			text-align: center;
			margin-top: var(--space-3xs); // Add space between range and input
		}

		button {
			width: 100%; /* Make button take full width of panel */
			padding: var(--space-s); /* Increased padding */
			background-color: var(--color-accent);
			color: var(--button-text-color);
			border: none;
			display: flex;
			justify-content: center;
			align-items: center; // Vertically center text
			border-radius: var(--radius-sm);
			cursor: pointer;
			font-weight: bold;       /* Make text bolder */
			font-size: 1rem;         /* Ensure a readable size */
			text-transform: uppercase; /* Uppercase text */
			letter-spacing: 0.5px;   /* Slight letter spacing */
			transition:
				background-color 0.2s ease,
				transform 0.1s ease-out; /* Added transform to transition */

			&:hover {
				background-color: var(--color-accent-hover);
				/* Optional: subtle lift effect */
				/* transform: translateY(-1px); */
			}

			&:active {
				/* Assuming --color-accent-active is defined or use a darker shade */
				background-color: var(--color-accent-active, color-mix(in srgb, var(--color-accent), black 15%));
				transform: scale(0.98); /* Push down effect */
				transition-duration: 0.05s; /* Make active transition faster */
			}
		}
		/* Removed validation-error style block as messages use DialogBox */
	}
</style>
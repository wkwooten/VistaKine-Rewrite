<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FullscreenButton from '../../elements/ui/FullscreenButton.svelte';
	import ResetButton from '../../elements/ui/ResetButton.svelte';
	import DialogBox from '../../elements/ui/DialogBox.svelte';
	import {
		dialogMessages,
		showDialog,
		speaker,
		hideCalibrationDialog,
		requestedNozzlePosition,
		resetSceneRequested,
		showCalibrationDialog, // For validation messages
		MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_Z, MAX_Z // Import constants
	} from '$lib/stores/calibrationState';

	// --- Props ---
	// export let overlayMessage: string | null = null; // Can be removed if DialogBox handles all messages
	export let isFullscreen = false; // Need to bind this from parent
	// export let targetElement: HTMLDivElement | undefined = undefined; // Removed: Logic moved to parent

	// --- Input State (Local to HUD, drives store update) ---
	let nozzleX = MIN_X;
	let nozzleY = 5;
	let nozzleZ = MIN_Z;
	let validationMessage: string | null = null;

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

		// If valid, update the store
		console.log(`[CalibrationHud] Requesting move via store: X=${nozzleX}, Y=${nozzleY}, Z=${nozzleZ}`);
		requestedNozzlePosition.set({ x: nozzleX, y: nozzleY, z: nozzleZ });
	}

	function handleResetScene() {
		console.log(`[CalibrationHud] Requesting reset via store`);
		resetSceneRequested.set(true);
	}

	function handleDialogClose() {
		console.log(`[CalibrationHud] Dialog close event received, hiding via store`);
		hideCalibrationDialog();
	}

	// Forward the request from the button
	const dispatch = createEventDispatcher();
	function handleRequestToggle() {
		console.log('[CalibrationHud] Forwarding requestToggleFullscreen');
		dispatch('requestToggleFullscreen');
	}
</script>

<!-- Main container for portal target -->
<div class="calibration-hud-container" id="hud-overlay">

	<!-- Top Panel for Controls and Dialog -->
	<div class="top-panel">
		<div class="top-left-controls">
			<ResetButton on:click={handleResetScene} />
		</div>
		<!-- Dialog Box - Centered in flex space -->
		<DialogBox
			messages={$dialogMessages}
			show={$showDialog}
			speaker={$speaker}
			on:close={handleDialogClose}
		/>
		<div class="top-right-controls">
			<FullscreenButton bind:isFullscreen on:requestToggle={handleRequestToggle} />
		</div>
	</div>

	<!-- Bottom Right Input Controls -->
	<div class="nozzle-control-panel">
		<div class="axis-inputs">
			<div class="axis-group" id="x-label">
				<label class="axis-label" >
					X <span class="axis-range">({MIN_X}-{MAX_X})</span>
					<input type="number" bind:value={nozzleX} min={MIN_X} max={MAX_X} />
				</label>
			</div>
			<div class="axis-group" id="y-label">
				<label class="axis-label" >
					Y <span class="axis-range">({MIN_Y}-{MAX_Y})</span>
					<input type="number" bind:value={nozzleY} min={MIN_Y} max={MAX_Y} />
				</label>
			</div>
			<div class="axis-group" id="z-label">
				<label class="axis-label" >
					Z <span class="axis-range">({MIN_Z}-{MAX_Z})</span>
					<input type="number" bind:value={nozzleZ} min={MIN_Z} max={MAX_Z} />
				</label>
			</div>
		</div>
		<button on:click={handleMoveRequest}>Move Nozzle</button>
		{#if validationMessage}
			<p class="validation-error">{validationMessage}</p>
		{/if}
	</div>
</div>

<style lang="scss">
	.calibration-hud-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none; /* Default: pass clicks through */
		padding: var(--space-s);
		padding-left: calc(var(--space-s) + 70px); /* Adjust based on Gizmo size */
		padding-bottom: calc(var(--space-s) + 70px); /* Adjust based on Gizmo size */
		box-sizing: border-box;
		/* Use flex to potentially align groups if needed, but positioning is absolute */
		display: flex;
		justify-content: space-between;
		align-items: flex-start; /* Align items like top message */
	}

	/* Make sure all control groups allow pointer events */
	.overlay-message,
	.scene-controls,
	.nozzle-control-panel {
		pointer-events: auto;
		z-index: 10;
	}

	.overlay-message {
		position: absolute;
		top: var(--space-s);
		left: 50%;
		transform: translateX(-50%);
		background-color: rgba(var(--bg-secondary-rgb), 0.85);
		color: var(--color-text-primary);
		padding: var(--space-xs) var(--space-m);
		border-radius: var(--radius-sm);
		font-style: italic;
		text-align: center;
		max-width: 80%;

		p { margin: 0; }
	}

	.scene-controls {
		position: absolute;
		top: var(--space-s);
		left: var(--space-s);
		display: flex;
		gap: var(--space-xs);
		pointer-events: auto;
		z-index: 10;
	}

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
		}

		#y-label {
			background-color: var(--axis-color-y-t75);
			color: var(--color-text-inverted);
		}

		#z-label {
			background-color: var(--axis-color-z-t75);
			color: var(--color-text-inverted);
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
			border-radius: var(--radius-sm);
			flex: 1; /* Allow groups to share space */
		}

		label {
			/* display: flex; No longer needed here */
			/* flex-direction: column; No longer needed here */
			font-size: 0.9em;
			font-weight: bold;
			text-align: center;
			margin-bottom: var(--space-3xs);
		}

		.axis-range {
			font-size: 0.8em;
			font-weight: normal;
			display: block; /* Ensure range is on its own line or handled differently */
			color: var(--text-secondary); /* Dim the range text */
		}

		input[type="number"] {
			/* width: 100%; Inherited flex item sizing will handle this */
			max-width: 60px; /* Limit input width */
			padding: var(--space-2xs);
			background-color: var(--bg-primary);
			border: 1px solid var(--color-border);
			border-radius: var(--radius-xs);
			color: var(--color-text-primary);
			background-color: var(--color-text-inverted);
			text-align: center;
		}
		button {
			width: 100%; /* Make button take full width of panel */
			padding: var(--space-s); /* Increased padding */
			background-color: var(--color-accent);
			color: var(--button-text-color);
			border: none;
			display: flex;
			justify-content: center;
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
		.validation-error {
			color: var(--color-error);
			font-style: italic;
			font-size: 0.9em;
			margin-top: var(--space-xs);
		}
	}

	/* Top Panel adjustments */
	.top-panel {
		position: absolute;
		top: var(--space-s);
		left: var(--space-s);
		right: var(--space-s); /* Span across the top */
		display: flex;
		justify-content: space-between; /* Push items to edges */
		align-items: flex-start; /* Align items to the top */
		pointer-events: none; /* Pass clicks through by default */
		gap: var(--space-m); /* Space between elements */
	}

	/* Ensure control groups can be interacted with */
	.top-left-controls,
	.top-right-controls {
		display: flex;
		gap: var(--space-xs);
		pointer-events: auto;
		z-index: 10;
		/* Allow shrinking if dialog is wide */
		flex-shrink: 0;
	}
</style>

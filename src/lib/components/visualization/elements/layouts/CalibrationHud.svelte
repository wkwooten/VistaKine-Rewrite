<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FullscreenButton from '../ui/FullscreenButton.svelte';
	import ResetButton from '../ui/ResetButton.svelte';

	const dispatch = createEventDispatcher();

	// --- Props ---
	export let overlayMessage: string | null = null;
	export let isFullscreen = false; // Need to bind this from parent
	export let targetElement: HTMLDivElement | undefined = undefined;

	// --- Boundaries (Local or Props) ---
	const MIN_X = 0;
	const MAX_X = 12;
	const MIN_Y = 0;
	const MAX_Y = 10;
	const MIN_Z = 0;
	const MAX_Z = 12;

	// --- Input State ---
	let nozzleX = MIN_X;
	let nozzleY = 5;
	let nozzleZ = MIN_Z;
	let validationMessage: string | null = null;

	// --- Event Handlers ---
	function handleMoveRequest() {
		// ... (existing validation logic) ...
		// If valid, dispatch the event with coordinates
		dispatch('requestMove', { x: nozzleX, y: nozzleY, z: nozzleZ });
	}

	function handleResetScene() {
		dispatch('resetscene');
	}
</script>

<div class="calibration-hud-container">
	<!-- Top Center Message -->
	{#if overlayMessage}
		<div class="overlay-message">
			<p>{overlayMessage}</p>
		</div>
	{/if}

	<!-- Top Left Controls (Reset/Fullscreen) -->
	<div class="controls-top-left">
		<ResetButton on:click={handleResetScene} />
		{#if targetElement}
			<FullscreenButton {targetElement} bind:isFullscreen />
		{/if}
	</div>

	<!-- Bottom Right Input Controls -->
	<div class="controls-bottom-right">
		<label>
			X: ({MIN_X}-{MAX_X})
			<input type="number" bind:value={nozzleX} min={MIN_X} max={MAX_X} />
		</label>
		<label>
			Y: ({MIN_Y}-{MAX_Y})
			<input type="number" bind:value={nozzleY} min={MIN_Y} max={MAX_Y} />
		</label>
		<label>
			Z: ({MIN_Z}-{MAX_Z})
			<input type="number" bind:value={nozzleZ} min={MIN_Z} max={MAX_Z} />
		</label>
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
		box-sizing: border-box;
		/* Use flex to potentially align groups if needed, but positioning is absolute */
		display: flex;
		justify-content: space-between;
		align-items: flex-start; /* Align items like top message */
	}

	/* Make sure all control groups allow pointer events */
	.overlay-message,
	.controls-top-left,
	.controls-bottom-right {
		pointer-events: auto;
		z-index: 10;
	}

	.overlay-message {
		position: absolute;
		top: var(--space-s);
		left: 50%;
		transform: translateX(-50%);
		background-color: rgba(var(--bg-secondary-rgb), 0.85);
		color: var(--text-color);
		padding: var(--space-xs) var(--space-m);
		border-radius: var(--radius-sm);
		font-style: italic;
		text-align: center;
		max-width: 80%;

		p { margin: 0; }
	}

	.controls-top-left {
		position: absolute;
		top: var(--space-s);
		left: var(--space-s);
		display: flex;
		gap: var(--space-xs);
		pointer-events: auto;
		z-index: 10;
	}

	.controls-bottom-right {
		position: absolute;
		bottom: var(--space-s);
		right: var(--space-s);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		padding: var(--space-s);
		background-color: rgba(var(--bg-secondary-rgb), 0.95);
		border-radius: var(--radius-sm);
		max-width: 180px;
		color: var(--text-color);
		pointer-events: auto;
		z-index: 10;

		label {
			display: flex;
			flex-direction: column;
			font-size: 0.9em;
		}
		input[type="number"] {
			width: 100%;
			padding: var(--space-2xs);
			background-color: var(--bg-primary);
			border: 1px solid var(--border-color);
			border-radius: var(--radius-xs);
			color: var(--text-color);
		}
		button {
			padding: var(--space-xs) var(--space-s);
			background-color: var(--color-accent);
			color: var(--button-text-color);
			border: none;
			border-radius: var(--radius-sm);
			cursor: pointer;
			transition: background-color 0.2s ease;
			&:hover { background-color: var(--color-accent-hover); }
		}
		.validation-error {
			color: var(--color-error);
			font-style: italic;
			font-size: 0.9em;
			margin-top: var(--space-xs);
		}
	}
</style>

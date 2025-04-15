<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FullscreenButton from '../../elements/ui/FullscreenButton.svelte';
	import ResetButton from '../../elements/ui/ResetButton.svelte';
	import {
		requestedNozzlePosition,
		resetSceneRequested,
		// showCalibrationDialog, // No longer needed here for validation
		// MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_Z, MAX_Z // Moved to NozzleControlPanel
	} from '$lib/stores/calibrationState';
	import NozzleControlPanel from './NozzleControlPanel.svelte'; // Import the new component

	// --- Props ---
	// export let overlayMessage: string | null = null; // Can be removed if DialogBox handles all messages
	export let isFullscreen = false; // Need to bind this from parent
	// export let targetElement: HTMLDivElement | undefined = undefined; // Removed: Logic moved to parent

	// --- Local State (Nozzle state moved to child) ---
	// let nozzleX = MIN_X; // Moved
	// let nozzleY = 5; // Moved
	// let nozzleZ = MIN_Z; // Moved
	// let validationMessage: string | null = null; // Moved/Handled differently

	// --- Event Handlers ---
	// Renamed to handle the event from the child component
	function handleNozzleMoveRequest(event: CustomEvent<{ x: number; y: number; z: number }>) {
		const { x, y, z } = event.detail;
		// Validation is now done within NozzleControlPanel
		// Update the store
		console.log(`[CalibrationHud] Handling requestMove event: X=${x}, Y=${y}, Z=${z}`);
		requestedNozzlePosition.set({ x, y, z });
	}

	function handleResetScene() {
		console.log(`[CalibrationHud] Requesting reset via store`);
		resetSceneRequested.set(true);
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

	<!-- Top Left Controls -->
	<div class="hud-controls-top-left">
		<ResetButton on:click={handleResetScene} />
		<FullscreenButton bind:isFullscreen on:requestToggle={handleRequestToggle} />
	</div>

	<!-- Bottom Right Input Controls - Render only when fullscreen -->

	<!-- Removed old nozzle-control-panel div -->
</div>

{#if isFullscreen}
<div class="nozzle-control-panel-container">
	<NozzleControlPanel on:requestMove={handleNozzleMoveRequest} />
</div>
{/if}

<style lang="scss">
	.calibration-hud-container {
		/* Width/Height determined by HTML component's projection */
		width: 100%;
		height: 100%;
		/* Remove padding to allow controls at edges */
        /* padding: var(--space-s); */
        /* padding-left: calc(var(--space-s) + 70px); */ /* Remove */
        /* padding-bottom: calc(var(--space-s) + 70px); */ /* Remove */
		box-sizing: border-box;
		/* Use flex to potentially align groups if needed, but positioning is absolute */
		display: block; /* Changed from flex to block as children are absolute */
		position: relative; /* Needed for absolute children */
        /* justify-content: space-between; */ /* Remove */
        /* align-items: flex-start; */ /* Remove */
	}

	/* New container for top-left buttons */
	.hud-controls-top-left {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
        display: flex; /* Use flex for horizontal layout */
        flex-direction: row; /* Explicitly horizontal */
        /* height: 100%; */ /* Remove */
        /* width: 100%; */ /* Remove */
        /* Buttons have their own margin, so no extra padding needed here */
	}

	.nozzle-control-panel-container {
		position: absolute;
		bottom: var(--space-s);
		right: var(--space-s);
		z-index: 10;
	}

</style>

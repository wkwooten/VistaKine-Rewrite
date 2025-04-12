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

	<!-- Bottom Right Input Controls - Replaced with Component -->
	<NozzleControlPanel on:requestMove={handleNozzleMoveRequest} />
	<!-- Removed old nozzle-control-panel div -->
</div>

<style lang="scss">
	.calibration-hud-container {
		/* Width/Height determined by HTML component's projection */
		padding: var(--space-s);
		padding-left: calc(var(--space-s) + 70px); /* Adjust based on Gizmo size */
		padding-bottom: calc(var(--space-s) + 70px); /* Adjust based on Gizmo size */
		box-sizing: border-box;
		/* Use flex to potentially align groups if needed, but positioning is absolute */
		display: flex;
		justify-content: space-between;
		align-items: flex-start; /* Align items like top message */
	}

	/* New container for top-left buttons */
	.hud-controls-top-left {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
	}

	/* Ensure NozzleControlPanel still has pointer-events and z-index */
	/* (It should have these internally, but doesn't hurt to ensure here if needed */
	:global(.nozzle-control-panel) {
		/* Position is already absolute bottom/right internally */
		pointer-events: auto;
		z-index: 10;
	}

</style>

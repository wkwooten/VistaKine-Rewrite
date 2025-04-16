<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FullscreenButton from '../../elements/ui/FullscreenButton.svelte';
	import ResetButton from '../../elements/ui/ResetButton.svelte';
	import DialogBox from '../../elements/ui/DialogBox.svelte';
	import {
		requestedNozzlePosition,
		resetSceneRequested,
		showDialog,
		dialogTurns,
	} from '$lib/stores/calibrationState';
	import NozzleControlPanel from './NozzleControlPanel.svelte';

	// --- Props ---
	export let isFullscreen = false;

	// --- Local State (Nozzle state moved to child) ---

	// --- Event Handlers ---
	function handleNozzleMoveRequest(event: CustomEvent<{ x: number; y: number; z: number }>) {
		const { x, y, z } = event.detail;
		console.log(`[CalibrationHud] Handling requestMove event: X=${x}, Y=${y}, Z=${z}`);
		requestedNozzlePosition.set({ x, y, z });
	}

	function handleResetScene() {
		console.log(`[CalibrationHud] Requesting reset via store`);
		resetSceneRequested.set(true);
	}

	const dispatch = createEventDispatcher();
	function handleRequestToggle() {
		console.log('[CalibrationHud] Forwarding requestToggleFullscreen');
		dispatch('requestToggleFullscreen');
	}
</script>

<!-- Main container for portal target -->
<div class="calibration-hud-container" class:fullscreen-active={isFullscreen} id="hud-overlay">

	<!-- Top Left Controls -->
	<div class="hud-controls-top-left">
		<ResetButton on:click={handleResetScene} />
		<FullscreenButton bind:isFullscreen on:requestToggle={handleRequestToggle} />
	</div>

	<!-- Conditionally render DialogBox directly inside HUD -->
	{#if $showDialog && isFullscreen}
		<DialogBox
			turns={$dialogTurns}
			bind:show={$showDialog}
		/>
	{/if}

	<!-- Bottom Right Input Controls Container -->
	{#if isFullscreen}
		<div class="nozzle-control-panel-container">
			<NozzleControlPanel on:requestMove={handleNozzleMoveRequest} />
		</div>
	{/if}

</div>

<style lang="scss">
	.calibration-hud-container {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		display: block;
		position: relative;
	}

	/* Position the DialogBox only when HUD is in fullscreen */
	.fullscreen-active :global(.dialog-box.expanded) {
		position: absolute;
		top: var(--space-m);
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		max-width: 600px;
		z-index: 1000;
	}

	.fullscreen-active :global(.dialog-box.collapsed) {
		position: absolute;
		top: var(--space-s);
		right: var(--space-s);
		z-index: 11; /* Match other buttons */
	}

	/* Container for top-left buttons */
	.hud-controls-top-left {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		display: flex;
		flex-direction: row;
	}

	/* Container for bottom-right panel */
	.nozzle-control-panel-container {
		position: absolute;
		bottom: var(--space-s);
		right: var(--space-s);
		z-index: 10;
	}

</style>

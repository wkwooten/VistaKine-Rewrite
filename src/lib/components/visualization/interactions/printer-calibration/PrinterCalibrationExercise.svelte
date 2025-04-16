<script lang="ts">
  import VisContainer from '../../VisContainer.svelte';
  import PrinterCalibrationScene from './PrinterCalibrationScene.svelte';
  import PrinterCalibrationHud from './PrinterCalibrationHud.svelte';
  import NozzleControlPanel from './NozzleControlPanel.svelte';
  import {
    resetSceneRequested,
    dialogTurns,
    showDialog,
    hideCalibrationDialog,
    requestedNozzlePosition
  } from '$lib/stores/calibrationState';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { HTML } from '@threlte/extras';
  import DialogBox from '../../elements/ui/DialogBox.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // Define Stage 1 target points (relative to corner origin)
  const stage1Targets = [
    { id: 't1', x: 12, y: 0, z: 0 },
    { id: 't2', x: 2, y: 0, z: 4 },
    { id: 't3', x: 7, y: 0, z: 10 }
  ];

  // Define Stage 2 target points (relative to corner origin)
  const stage2Targets = [
    { id: 't4', x: 1, y: 3, z: 1 },
    { id: 't5', x: 8, y: 5, z: 8 },
    { id: 't6', x: 11, y: 2, z: 11 }
  ];

  // --- Printer Boundaries (Could potentially move to store if shared) ---
  const MIN_X = 0;
  const MAX_X = 12;
  const MIN_Y = 0;
  const MAX_Y = 10;
  const MIN_Z = 0;
  const MAX_Z = 12;

  // --- Core Exercise State ---
  let currentStage = $state(1);
  let isCalibrationComplete = $state(false);
  let isFullscreen = $state(false);
  let exerciseWrapperElement: HTMLDivElement;

  // Add a key that changes when dialog content should reset
  let dialogKey = $state(0);

  // --- Derived State ---
  let activeTargets = $derived((currentStage === 1) ? stage1Targets : stage2Targets);

  // --- Event Handlers ---
  function goToStage2() {
    if (currentStage === 1) {
      console.log("[Exercise] Stage 1 Complete event received! Starting Stage 2.");
      currentStage = 2;
      dialogKey += 1; // Increment key on stage change
    }
  }

  function handleCalibrationComplete() {
    console.log("[Exercise] Calibration Complete event received!");
    isCalibrationComplete = true;
    dialogKey += 1; // Increment key on completion
    dispatch('calibrationComplete');
  }

  // Handler for the NozzleControlPanel event when not fullscreen
  function handlePanelMoveRequest(event: CustomEvent<{ x: number; y: number; z: number }>) {
      const { x, y, z } = event.detail;
      console.log(`[Exercise] Handling requestMove event from outside panel: X=${x}, Y=${y}, Z=${z}`);
      requestedNozzlePosition.set({ x, y, z });
  }

  // --- Fullscreen Logic (Moved from VisContainer) ---
	async function toggleFullscreen() {
		if (!browser || !exerciseWrapperElement) return;

		const newState = !isFullscreen;

		if (newState) {
			if (!document.fullscreenElement) {
				try {
					if (exerciseWrapperElement.requestFullscreen) {
						await exerciseWrapperElement.requestFullscreen();
					} else if ((exerciseWrapperElement as any).webkitRequestFullscreen) {
						await (exerciseWrapperElement as any).webkitRequestFullscreen();
					} else if ((exerciseWrapperElement as any).msRequestFullscreen) {
						await (exerciseWrapperElement as any).msRequestFullscreen();
					}
					isFullscreen = true;
				} catch (err) {
					console.error(`[Exercise] Error enabling fullscreen: ${err instanceof Error ? err.message : String(err)}`);
					isFullscreen = false;
				}
			}
		} else {
			if (document.fullscreenElement) {
				try {
					if (document.exitFullscreen) {
						await document.exitFullscreen();
					} else if ((document as any).webkitExitFullscreen) {
						await (document as any).webkitExitFullscreen();
					} else if ((document as any).msExitFullscreen) {
						await (document as any).msExitFullscreen();
					}
					isFullscreen = false;
				} catch (err) {
					console.error(`[Exercise] Error disabling fullscreen: ${err instanceof Error ? err.message : String(err)}`);
				}
			} else {
				isFullscreen = false; // Sync state if fullscreen exited via other means (e.g., ESC key)
			}
		}
	}

	onMount(() => {
		function handleFullscreenChange() {
			if (browser) {
				const browserIsFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
				if (isFullscreen !== browserIsFullscreen) {
					console.log(`[Exercise] Syncing fullscreen state. Browser: ${browserIsFullscreen}, Component: ${isFullscreen}.`);
					isFullscreen = browserIsFullscreen;
				}
			}
		}

		if (browser) {
			document.addEventListener('fullscreenchange', handleFullscreenChange);
			document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
			document.addEventListener('msfullscreenchange', handleFullscreenChange);
		}

		return () => {
			if (browser) {
				document.removeEventListener('fullscreenchange', handleFullscreenChange);
				document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
				document.removeEventListener('msfullscreenchange', handleFullscreenChange);
			}
		};
	});

  // --- Reset Logic ---
  $effect(() => {
    if ($resetSceneRequested) {
      console.log('[Exercise] Resetting stage state due to store request.');
      currentStage = 1;
      isCalibrationComplete = false;
      dialogKey += 1; // Increment key on reset
      // NOTE: The store flag ($resetSceneRequested) is reset by PrinterCalibrationScene
    }
  });

  // Increment key on mount for the initial dialog
  onMount(() => {
      dialogKey += 1;
  });

</script>

<div
  bind:this={exerciseWrapperElement}
  class="exercise-wrapper"
  class:fullscreen={isFullscreen}
>
  <!-- Moved title and description inside -->
  <h3 class="exercise-title"><b>Visualize it:</b> Calibrating the Printer</h3>
  <p class="exercise-description">
    Help surya calibrate her 3D printer by moving the nozzle to the targets. Use the control panel to enter coordinates of target position then move the nozzle to the target.
  </p>

  <!-- Render DialogBox OUTSIDE VisContainer when NOT fullscreen -->
  {#if $showDialog && !isFullscreen}
    <div class="dialog-above-vis">
      {#key dialogKey}
        <DialogBox
          turns={$dialogTurns}
          show={$showDialog}
        />
      {/key}
    </div>
  {/if}

  <!-- Render NozzleControlPanel OUTSIDE VisContainer when NOT fullscreen -->
  {#if !isFullscreen}
      <div class="control-panel-outside-vis">
          <NozzleControlPanel on:requestMove={handlePanelMoveRequest} />
      </div>
  {/if}

  <VisContainer isComplete={isCalibrationComplete}>
    <PrinterCalibrationScene
      targets={activeTargets}
      currentStage={currentStage}
      on:stageComplete={goToStage2}
      on:allStagesComplete={handleCalibrationComplete}
    />
    <HTML fullscreen>
      <PrinterCalibrationHud
        bind:isFullscreen
        on:requestToggleFullscreen={toggleFullscreen}
      />
    </HTML>
  </VisContainer>

  <!-- Render DialogBox INSIDE the wrapper (overlay) when fullscreen -->
</div>

<style>
  .exercise-wrapper {
    display: flex;
    flex-direction: column;
    position: relative; /* Added for absolute positioning context */
    /* Add border, background, padding */
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background-color: var(--bg-secondary);
    padding: var(--space-m) var(--space-xs); /* Adjusted padding */
    margin-bottom: var(--space-l); /* Add margin-bottom */
  }

  /* --- Styles for moved title/description --- */
  .exercise-title {
      font-size: var(--step-2); /* Slightly smaller */
      font-weight: 600;
      margin-bottom: var(--space-s); /* Space below title */
      /* Resetting potential global heading margins */
      margin-top: 0;
  }
  .exercise-description {
      font-size: var(--step-0);
      margin-bottom: var(--space-m); /* Space below description */
      color: var(--color-text-secondary);
       /* Resetting potential global paragraph margins */
      margin-top: 0;
  }
  /* ------------------------------------------- */

  /* Add order to VisContainer */
  :global(.visualization-container) {
      order: 1;
  }

  /* Style for the control panel when it's outside the visualization */
  .control-panel-outside-vis {
      width: 100%; /* Take full width */
      box-sizing: border-box;
      margin-block: var(--space-s); /* Space below the panel */
      order: 2; /* Ensure it comes after the VisContainer in default flow */
  }

  .exercise-wrapper.fullscreen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh; /* Fallback */
        height: -webkit-fill-available; /* Use available height */
		max-height: 100vh; /* Fallback */
        max-height: -webkit-fill-available; /* Use available height */
		border-radius: 0;
		border: none;
		z-index: 100;
    flex-direction: row;
    padding: 0; /* Remove padding in fullscreen */
    pointer-events: auto; /* Ensure wrapper passes events */

    /* Hide title and description when fullscreen */
    & > .exercise-title,
    & > .exercise-description {
        display: none;
    }

    & > :global(.visualization-container) {
        width: 100%;
        height: 100%; /* Keep this as 100% to fill parent */
        max-height: 100%; /* Use parent's max-height implicitly */
        border: none;
        border-radius: 0;
        aspect-ratio: auto; /* Override aspect ratio in fullscreen */
    }

    & > .control-panel-outside-vis {
        display: none;
    }
	}

  /* Style for the dialog wrapper when it's above the visualization */
  .dialog-above-vis {
    box-sizing: border-box;
    margin-bottom: var(--space-s);
    position: relative;
  }
</style>
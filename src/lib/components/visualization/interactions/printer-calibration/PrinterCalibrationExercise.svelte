<script lang="ts">
  import VisContainer from '../../VisContainer.svelte';
  import PrinterCalibrationScene from './PrinterCalibrationScene.svelte';
  import PrinterCalibrationHud from './PrinterCalibrationHud.svelte';
  import { resetSceneRequested } from '$lib/stores/calibrationState';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  // --- Printer Boundaries (Could potentially move to store if shared) ---
  const MIN_X = 0;
  const MAX_X = 12;
  const MIN_Y = 0;
  const MAX_Y = 10;
  const MIN_Z = 0;
  const MAX_Z = 12;

  // --- Define Stage Targets ---
  const stage1Targets = [
    { id: 't1', x: 12, y: 0, z: 0 },
    { id: 't2', x: 2, y: 0, z: 4 },
    { id: 't3', x: 7, y: 0, z: 10 }
  ];

  const stage2Targets = [
    { id: 't4', x: 1, y: 3, z: 1 },
    { id: 't5', x: 8, y: 5, z: 8 },
    { id: 't6', x: 11, y: 2, z: 11 }
  ];

  // --- Core Exercise State ---
  let currentStage = $state(1);
  let isCalibrationComplete = $state(false);
  let isFullscreen = $state(false);
  let exerciseWrapperElement: HTMLDivElement;

  // --- Derived State ---
  let activeTargets = $derived((currentStage === 1) ? stage1Targets : stage2Targets);

  // --- Event Handlers ---
  function goToStage2() {
    if (currentStage === 1) {
      console.log("[Exercise] Stage 1 Complete event received! Starting Stage 2.");
      currentStage = 2;
    }
  }

  function handleCalibrationComplete() {
    console.log("[Exercise] Calibration Complete event received!");
    isCalibrationComplete = true;
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
      // NOTE: The store flag ($resetSceneRequested) is reset by PrinterCalibrationScene
    }
  });

</script>

<div
  bind:this={exerciseWrapperElement}
  class="exercise-wrapper"
  class:fullscreen={isFullscreen}
  class:complete={isCalibrationComplete}
>
  <VisContainer>
    <PrinterCalibrationScene
      targets={activeTargets}
      currentStage={currentStage}
      on:stageComplete={goToStage2}
      on:allStagesComplete={handleCalibrationComplete}
    />
  </VisContainer>

  <PrinterCalibrationHud
    bind:isFullscreen
    on:requestToggleFullscreen={toggleFullscreen}
  />
</div>

<style>
  .exercise-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    max-height: 500px;
    aspect-ratio: 16/9;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    transition: border-color 0.5s ease, box-shadow 0.5s ease;
    background-color: var(--color-background);
  }

  .exercise-wrapper.complete {
	  box-shadow: var(--color-success) 2px 2px 10px 0;
    border-color: var(--color-success);
	}

	.exercise-wrapper.fullscreen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		max-height: 100vh;
		border-radius: 0;
		border: none;
		z-index: 9999;
		aspect-ratio: auto;
    & > :global(.visualization-container) {
        width: 100%;
        height: 100%;
        max-height: 100vh;
        border: none;
        border-radius: 0;
        aspect-ratio: auto;
    }
	}

  @media (max-width: 768px) {
		.exercise-wrapper {
      aspect-ratio: 9/16;
    }
		.exercise-wrapper.fullscreen {
			aspect-ratio: auto;
		}
	}

</style>
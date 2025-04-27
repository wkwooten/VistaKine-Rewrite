<script lang="ts">
  import VisContainer from "../../VisContainer.svelte";
  import PrinterCalibrationScene from "./PrinterCalibrationScene.svelte";
  import PrinterCalibrationHud from "./PrinterCalibrationHud.svelte";
  import NozzleControlPanel from "./NozzleControlPanel.svelte";
  import {
    resetSceneRequested,
    dialogTurns,
    showDialog,
    hideCalibrationDialog,
    requestedNozzlePosition,
  } from "$lib/stores/calibrationState";
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { HTML } from "@threlte/extras";
  import DialogBox from "../../elements/ui/DialogBox.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // Define Stage 1 target points (relative to corner origin)
  const stage1Targets = [
    { id: "t1", x: 12, y: 0, z: 0 },
    { id: "t2", x: 2, y: 0, z: 4 },
    { id: "t3", x: 7, y: 0, z: 10 },
  ];

  // Define Stage 2 target points (relative to corner origin)
  const stage2Targets = [
    { id: "t4", x: 1, y: 3, z: 1 },
    { id: "t5", x: 8, y: 5, z: 8 },
    { id: "t6", x: 11, y: 2, z: 11 },
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

  // STATE MOVED HERE: Nozzle position state, bound to controls
  const initialRelativePosition = { x: 0, y: 5, z: 0 };
  let relativeNozzleX = $state(initialRelativePosition.x);
  let relativeNozzleY = $state(initialRelativePosition.y);
  let relativeNozzleZ = $state(initialRelativePosition.z);

  // --- Derived State ---
  let activeTargets = $derived(
    currentStage === 1 ? stage1Targets : stage2Targets,
  );

  // --- Event Handlers ---
  function goToStage2() {
    if (currentStage === 1) {
      console.log(
        "[Exercise] Stage 1 Complete event received! Starting Stage 2.",
      );
      currentStage = 2;
      dialogKey += 1; // Increment key on stage change
    }
  }

  function handleCalibrationComplete() {
    console.log("[Exercise] Calibration Complete event received!");
    isCalibrationComplete = true;
    dialogKey += 1; // Increment key on completion
    dispatch("calibrationComplete");
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
          console.error(
            `[Exercise] Error enabling fullscreen: ${err instanceof Error ? err.message : String(err)}`,
          );
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
          console.error(
            `[Exercise] Error disabling fullscreen: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      } else {
        isFullscreen = false; // Sync state if fullscreen exited via other means (e.g., ESC key)
      }
    }
  }

  onMount(() => {
    function handleFullscreenChange() {
      if (browser) {
        const browserIsFullscreen = !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement
        );
        if (isFullscreen !== browserIsFullscreen) {
          console.log(
            `[Exercise] Syncing fullscreen state. Browser: ${browserIsFullscreen}, Component: ${isFullscreen}.`,
          );
          isFullscreen = browserIsFullscreen;
        }
      }
    }

    if (browser) {
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.addEventListener("msfullscreenchange", handleFullscreenChange);
    }

    return () => {
      if (browser) {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange,
        );
        document.removeEventListener(
          "webkitfullscreenchange",
          handleFullscreenChange,
        );
        document.removeEventListener(
          "msfullscreenchange",
          handleFullscreenChange,
        );
      }
    };
  });

  // --- Reset Logic ---
  $effect(() => {
    if ($resetSceneRequested) {
      console.log("[Exercise] Resetting stage state due to store request.");
      currentStage = 1;
      isCalibrationComplete = false;
      dialogKey += 1; // Increment key on reset
      // Reset nozzle state here
      relativeNozzleX = initialRelativePosition.x;
      relativeNozzleY = initialRelativePosition.y;
      relativeNozzleZ = initialRelativePosition.z;
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
  <!-- Render DialogBox OUTSIDE VisContainer when NOT fullscreen -->
  {#if $showDialog && !isFullscreen}
    <div class="dialog-above-vis">
      {#key dialogKey}
        <DialogBox turns={$dialogTurns} show={$showDialog} />
      {/key}
    </div>
  {/if}

  <!-- Render NozzleControlPanel OUTSIDE VisContainer when NOT fullscreen -->
  {#if !isFullscreen}
    <div class="control-panel-outside-vis">
      <NozzleControlPanel
        bind:x={relativeNozzleX}
        bind:y={relativeNozzleY}
        bind:z={relativeNozzleZ}
      />
    </div>
  {/if}

  <!-- New Wrapper for VisContainer and its Overlay -->
  <div class="vis-area-wrapper">
    <!-- UI Overlay -->
    <div class="ui-overlay">
      <PrinterCalibrationHud
        bind:isFullscreen
        bind:relativeNozzleX
        bind:relativeNozzleY
        bind:relativeNozzleZ
        on:requestToggleFullscreen={toggleFullscreen}
      />
    </div>

    <!-- VisContainer -->
    <VisContainer isComplete={isCalibrationComplete}>
      <PrinterCalibrationScene
        targets={activeTargets}
        {currentStage}
        {relativeNozzleX}
        {relativeNozzleY}
        {relativeNozzleZ}
        on:stageComplete={goToStage2}
        on:allStagesComplete={handleCalibrationComplete}
      />
    </VisContainer>
  </div>
</div>

<style>
  /* Add styles similar to VectorBuilderExercise */
  .exercise-wrapper {
    /* position: relative; */ /* Not needed here */
  }

  /* Add this rule block for non-fullscreen layout */
  .exercise-wrapper:not(.fullscreen) {
    display: flex;
    flex-direction: column;
  }

  .vis-area-wrapper {
    position: relative;
    width: 100%;
    order: 2;
    z-index: 1;
  }

  .ui-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
  }

  /* No need for .ui-overlay > :global(*) rule here if children handle it */

  /* Existing rules for outside panels */
  .control-panel-outside-vis {
    width: 100%;
    box-sizing: border-box;
    margin-block: var(--space-s);
    order: 4;
  }
  .dialog-above-vis {
    box-sizing: border-box;
    margin-bottom: var(--space-s);
    position: relative;
    order: 0; /* Ensure dialog is first in non-fullscreen */
    /* min-height might be needed depending on DialogBox */
  }

  /* Remove order from visualization-container as it's now wrapped */
  :global(.visualization-container) {
    /* order: 1; */
  }

  /* Fullscreen styles */
  .exercise-wrapper.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    height: -webkit-fill-available;
    max-height: 100vh;
    max-height: -webkit-fill-available;
    border-radius: 0;
    border: none;
    z-index: 9999; /* Match vector builder */
    flex-direction: row; /* Keep this? */
    padding: 0;
    pointer-events: auto;

    /* Hide outside elements */
    & > .control-panel-outside-vis,
    & > .dialog-above-vis,
    & > h3,
    & > p:first-of-type {
      display: none;
    }

    /* Style vis area wrapper */
    & > .vis-area-wrapper {
      width: 100%;
      /* height: 100%; Remove or comment out */
      position: absolute; /* Position relative to the fixed parent */
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1;
    }

    /* Style overlay within wrapper */
    & > .vis-area-wrapper > .ui-overlay {
      z-index: 10;
    }

    /* Style vis container within wrapper */
    & > .vis-area-wrapper > :global(.visualization-container) {
      width: 100%;
      height: 100%;
      max-height: 100%;
      border: none;
      border-radius: 0;
      aspect-ratio: auto;
      z-index: 5; /* Below overlay */
      position: relative;
    }
  }
</style>

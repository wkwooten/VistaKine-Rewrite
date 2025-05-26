<script lang="ts">
  // import VisContainer from "../../VisContainer.svelte"; // Replaced by InteractiveExercise
  import PrinterCalibrationScene from "./PrinterCalibrationScene.svelte";
  import PrinterCalibrationHud from "./PrinterCalibrationHud.svelte";
  import NozzleControlPanel from "./NozzleControlPanel.svelte";
  import {
    resetSceneRequested, // Store flag can still be used by other parts
    dialogTurns,
    showDialog,
    // Import new stores
    relativeNozzleXStore,
    relativeNozzleYStore,
    relativeNozzleZStore,
    currentStageStore,
    activeTargetsStore,
    type TargetPoint, // Import type for clarity
  } from "$lib/components/visualization/interactions/printer-calibration/calibrationState";
  import { onMount } from "svelte"; // $effect is auto-imported by Svelte 5
  import DialogBox from "../../elements/ui/DialogBox.svelte";
  // import { fullscreenAction } from "$lib/actions/useFullscreen"; // Handled by InteractiveExercise
  import InteractiveExercise from "../../InteractiveExercise.svelte";
  import type { SvelteComponent, ComponentType } from "svelte"; // For casting if needed

  let { onCalibrationComplete } = $props<{
    onCalibrationComplete?: () => void;
  }>();

  // Define Stage 1 target points (relative to corner origin)
  const stage1Targets: TargetPoint[] = [
    { id: "t1", x: 12, y: 0, z: 0 },
    { id: "t2", x: 2, y: 0, z: 4 },
    { id: "t3", x: 7, y: 0, z: 10 },
  ];

  // Define Stage 2 target points (relative to corner origin)
  const stage2Targets: TargetPoint[] = [
    { id: "t4", x: 1, y: 3, z: 1 },
    { id: "t5", x: 8, y: 5, z: 8 },
    { id: "t6", x: 11, y: 2, z: 11 },
  ];

  // --- Core Exercise State ---
  let currentStageLocal = $state(1);
  let isCalibrationComplete = $state(false);
  // This isFullscreen is for the layout of PrinterCalibrationExercise itself.
  // InteractiveExercise will manage its own internal fullscreen state for the viz area.
  // We might need a way to sync them or get notified by InteractiveExercise if PCE's layout needs to change *based on* IE's fullscreen state.
  // For now, this state controls the visibility of DialogBox/NozzleControlPanel outside InteractiveExercise.
  let isFullscreenForPCELayout = $state(false);
  // let exerciseWrapperElement: HTMLDivElement; // No longer directly managed here for fullscreen

  let dialogKey = $state(0);

  const initialRelativePosition = { x: 0, y: 5, z: 0 };

  $effect(() => {
    console.log(
      `[PCE $effect] Updating currentStageStore to: ${currentStageLocal}`
    );
    currentStageStore.set(currentStageLocal);
  });

  let activeTargetsLocal = $derived(
    currentStageLocal === 1 ? stage1Targets : stage2Targets
  );

  $effect(() => {
    console.log(`[PCE $effect] Updating activeTargetsStore`);
    activeTargetsStore.set(activeTargetsLocal);
  });

  // --- Event Handlers for Scene ---
  function handleStageComplete() {
    if (currentStageLocal === 1) {
      console.log(
        "[Exercise] Stage 1 Complete event received! Starting Stage 2."
      );
      currentStageLocal = 2;
      dialogKey += 1;
    }
  }

  function handleAllStagesComplete() {
    console.log(
      "[Exercise] Calibration Complete event received! Calling onCalibrationComplete prop."
    );
    isCalibrationComplete = true;
    dialogKey += 1;
    onCalibrationComplete?.();
  }

  // --- Reset Logic for this exercise ---
  function handleActualReset() {
    console.log("[Exercise] Resetting stage state.");
    currentStageLocal = 1;
    isCalibrationComplete = false;
    dialogKey += 1;
    // Directly set stores to initial positions
    relativeNozzleXStore.set(initialRelativePosition.x);
    relativeNozzleYStore.set(initialRelativePosition.y);
    relativeNozzleZStore.set(initialRelativePosition.z);
  }

  // Effect for store-initiated reset
  $effect(() => {
    if (resetSceneRequested && $resetSceneRequested) {
      console.log(
        "[Exercise] Resetting state due to store request ($resetSceneRequested)."
      );
      handleActualReset();
    }
  });

  onMount(() => {
    dialogKey += 1;
    // Initialize stores on mount. NozzleControlPanel will initialize its local state from these.
    // Set the stores to the specific initial positions for this exercise instance.
    relativeNozzleXStore.set(initialRelativePosition.x);
    relativeNozzleYStore.set(initialRelativePosition.y);
    relativeNozzleZStore.set(initialRelativePosition.z);

    currentStageStore.set(currentStageLocal);
    activeTargetsStore.set(activeTargetsLocal);
  });

  const sceneProps = $derived({
    // Nozzle positions, currentStage, and targets are now via stores
    onStageComplete: handleStageComplete, // This is a function defined in PCE
    onAllStagesComplete: handleAllStagesComplete, // This is a function defined in PCE
  });

  const hudProps = $derived({
    // isFullscreen is managed and passed by InteractiveExercise to the HUD.
    // Nozzle positions are no longer needed here for the HUD to pass to a control panel,
    // as the HUD and ControlPanel (slotted) now use stores.
    // PrinterCalibrationHud will subscribe to relativeNozzleXStore etc. for its own display if needed.
  });
</script>

<!--
  The main div no longer needs fullscreenAction or class:fullscreen directly related to the viz.
  The isFullscreenForPCELayout state is for this component's own layout decisions if any part of *this* component
  (outside of InteractiveExercise) needs to change when the viz part goes fullscreen.
  This might require a callback from InteractiveExercise if its fullscreen state needs to drive isFullscreenForPCELayout.
-->
<div class="printer-calibration-exercise-shell">
  <!-- Render DialogBox OUTSIDE InteractiveExercise when NOT fullscreen (PCE's concept of fullscreen) -->
  {#if showDialog && $showDialog && !isFullscreenForPCELayout}
    <div class="dialog-above-vis">
      {#key dialogKey}
        <DialogBox
          turns={dialogTurns && $dialogTurns}
          show={showDialog && $showDialog}
        />
      {/key}
    </div>
  {/if}

  <!-- Render NozzleControlPanel OUTSIDE InteractiveExercise when NOT fullscreen (PCE's concept of fullscreen) -->
  {#if !isFullscreenForPCELayout}
    <div class="control-panel-outside-vis">
      <NozzleControlPanel />
    </div>
  {/if}

  <InteractiveExercise
    class="interactive-exercise-component"
    exerciseTitle="Printer Calibration"
    SceneComponent={PrinterCalibrationScene as unknown as ComponentType<SvelteComponent>}
    HudComponent={PrinterCalibrationHud as unknown as ComponentType<SvelteComponent>}
    ControlPanelComponent={NozzleControlPanel as unknown as ComponentType<SvelteComponent>}
    {sceneProps}
    {hudProps}
    controlPanelProps={{}}
    onResetRequestedByHudCallback={handleActualReset}
    onFullscreenStatusChangeCallback={(isFs: boolean) =>
      (isFullscreenForPCELayout = isFs)}
  />
</div>

<style lang="scss">
  .printer-calibration-exercise-shell {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden; // Prevent scrollbars on the shell itself if content overflows before handled by children

    & > :global(.interactive-exercise-component) {
      flex-grow: 1;
      flex-shrink: 1; // Allow shrinking if necessary
      min-height: 300px; // Minimum height for the visualization area
      height: 100%; // Attempt to take full height of the flex container portion
    }
  }

  .printer-calibration-exercise-shell:not(.fullscreen-layout-active) {
    // This class seems to be based on isFullscreenForPCELayout, which might not be needed
    // if the main shell is always flex column. Original styles had this.
    // If specific non-fullscreen layout is needed, it can be refined here.
    // For now, the base .printer-calibration-exercise-shell handles the flex layout.
  }

  .control-panel-outside-vis {
    width: 100%;
    box-sizing: border-box;
    margin-block: var(--space-s);
    order: 4; /* Example order */
  }
  .dialog-above-vis {
    box-sizing: border-box;
    margin-bottom: var(--space-s);
    position: relative;
    order: 0; /* Example order */
  }

  /* Styles from the old .exercise-wrapper.fullscreen can be adapted if needed
     for .printer-calibration-exercise-shell.fullscreen-layout-active */
</style>

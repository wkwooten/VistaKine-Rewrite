<script lang="ts">
  // import VisContainer from "../../VisContainer.svelte"; // Replaced by InteractiveExercise
  import PrinterCalibrationScene from "./PrinterCalibrationScene.svelte";
  import PrinterCalibrationHud from "./PrinterCalibrationHud.svelte";
  import NozzleControlPanel from "./NozzleControlPanel.svelte";
  import {
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

  const hudProps = $derived({});
</script>

{#snippet dialogArea(data: { isFullscreen: boolean })}
  {#if $showDialog}
    {#key dialogKey}
      <DialogBox
        turns={$dialogTurns}
        bind:show={$showDialog}
        isFullscreen={data.isFullscreen}
      />
    {/key}{/if}
{/snippet}

{#snippet controlsArea(data: { isFullscreen: boolean })}
  <NozzleControlPanel />
{/snippet}

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
  dialogAreaSnippet={dialogArea}
  controlsAreaSnippet={controlsArea}
  onFullscreenStatusChangeCallback={(isFs: boolean) => {
    // Optional: if PCE needs to react to IE's fullscreen state for other reasons
    // console.log("[PCE] IE Fullscreen: ", isFs);
  }}
/>

<style lang="scss">
  /* Remove all styles related to .printer-calibration-exercise-shell */
  /* Styles for .control-panel-outside-vis and .dialog-above-vis are removed */
  /* Any styles specific to the content of the snippets (DialogBox, NozzleControlPanel) */
  /* should ideally be within those components or globally if applicable. */

  /* If DialogBox or NozzleControlPanel need specific wrapper styles when passed as snippets, */
  /* they could be applied here by targeting them within the snippet context if Svelte allows, */
  /* or by ensuring their own internal styling is sufficient. */
  /* For now, assume their internal styles are fine or handled globally. */

  /* Example: Ensure the component passed to InteractiveExercise fills its parent if PCE itself is in a flex layout */
  :global(.interactive-exercise-component) {
    /* This might not be needed if PCE is no longer a flex container itself */
    /* width: 100%; */
    /* height: 100%; */
  }
</style>

<script lang="ts">
  import type { SvelteComponent, ComponentType } from "svelte";
  import { Vector3 } from "three";
  import InteractiveExercise from "../../InteractiveExercise.svelte";
  import VectorPrinterScene from "./VectorPrinterScene.svelte";
  import VectorPrinterHud from "./VectorPrinterHud.svelte";
  import VectorOperationControls from "./VectorOperationControls.svelte";
  import VectorPrinterOutputPanel from "./VectorPrinterOutputPanel.svelte";
  import DialogBox from "$lib/components/visualization/elements/ui/DialogBox.svelte";
  import type { DialogTurn } from "$lib/components/visualization/interactions/printer-calibration/calibrationState";
  import {
    currentDefiningVectorStore,
    definedVectorsStore,
    resultantVectorStore,
    type DefinedVector,
  } from "./vectorPrinterState";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  // --- Component Props ---
  let { initialNozzlePosition = new Vector3(-6, 1.1, -6) } = $props<{
    initialNozzlePosition?: Vector3;
  }>();

  // --- State for VectorPrinterExercise ---
  let nozzlePosition = $state(initialNozzlePosition.clone());
  let showDialogState = $state(false);
  let dialogTurnsState = $state<DialogTurn[]>([]);

  const LINTER_FIX_DUMMY_VALUE = ""; // TODO: Replace with actual value

  const PREDEFINED_COLORS: import("three").ColorRepresentation[] = [
    "#FF6347", // Tomato
    "#4682B4", // SteelBlue
    "#32CD32", // LimeGreen
    "#FFD700", // Gold
    "#6A5ACD", // SlateBlue
  ];

  function getNextColor(index: number): import("three").ColorRepresentation {
    return PREDEFINED_COLORS[index % PREDEFINED_COLORS.length];
  }

  // --- Main Functions ---
  function handlePrintCurrentVector() {
    console.log("[VPE handlePrint] Function CALLED");
    const currentDefiningVector = get(currentDefiningVectorStore);
    const newVectorMagnitude = currentDefiningVector.length();

    if (newVectorMagnitude < 0.001) {
      console.warn(
        "[VPE handlePrint] Attempted to print a zero-length vector. Operation skipped."
      );
      return;
    }

    const currentDefinedVectors = get(definedVectorsStore);
    const vectorName = String.fromCharCode(65 + currentDefinedVectors.length); // A, B, C...
    const vectorColor = getNextColor(currentDefinedVectors.length);

    const newDefinedVector: DefinedVector = {
      vector: currentDefiningVector.clone(),
      name: vectorName,
      color: vectorColor,
      id: Date.now().toString() + vectorName,
    };

    definedVectorsStore.update((currentVectors) => [
      ...currentVectors,
      newDefinedVector,
    ]);

    // Update nozzle position: tip of the new vector relative to the previous nozzle position
    nozzlePosition.add(currentDefiningVector);

    console.log(
      `[VPE handlePrint] Vector ${vectorName} printed. New nozzlePosition:`,
      $state.snapshot(nozzlePosition)
    );
    console.log(
      `[VPE handlePrint] All defined vectors (${get(definedVectorsStore).length}):`,
      get(definedVectorsStore)
    );

    // Calculate resultant vector if there are two or more vectors
    const updatedDefinedVectors = get(definedVectorsStore);
    if (updatedDefinedVectors.length >= 2) {
      const sum = new Vector3();
      updatedDefinedVectors.forEach((item) => sum.add(item.vector));
      resultantVectorStore.set(sum);
      console.log(
        "[VPE handlePrint] Resultant vector calculated:",
        get(resultantVectorStore)
      );
    } else {
      resultantVectorStore.set(null);
      console.log("[VPE handlePrint] Not enough vectors for a resultant.");
    }

    // Reset the defining vector for the next input
    currentDefiningVectorStore.set(new Vector3(0, 0, 0));
  }

  // This function is called by InteractiveExercise when HUD requests reset
  function handleActualReset(): void {
    console.log(
      "[VectorPrinterExercise] Resetting exercise via InteractiveExercise callback."
    );
    nozzlePosition = initialNozzlePosition.clone();
    definedVectorsStore.set([]);
    resultantVectorStore.set(null);
    currentDefiningVectorStore.set(new Vector3(0, 0, 0));
    showDialogState = false;
    dialogTurnsState = [];
  }

  // This function is passed to VectorOperationControls when rendered directly by VPE
  function resetExerciseFromDirectControls(): void {
    console.log(
      "[VectorPrinterExercise] Resetting exercise via direct controls panel."
    );
    handleActualReset();
  }

  // --- Props for Child Components ---
  const sceneProps = $derived({
    nozzlePosition: nozzlePosition,
    currentVectorOrigin: nozzlePosition,
    sequenceStartOrigin: initialNozzlePosition,
    undefinedVectorColorHint: getNextColor($definedVectorsStore.length),
  });

  const hudProps = $derived({
    // nozzlePosition: nozzlePosition,
  });

  const controlPanelPropsForInteractiveExercise = $derived({
    onPrintVector: handlePrintCurrentVector,
    onReset: handleActualReset,
  });

  onMount(() => {
    console.log(
      "[VectorPrinterExercise] Initialized with nozzle at:",
      $state.snapshot(nozzlePosition)
    );
    definedVectorsStore.set([]);
    resultantVectorStore.set(null);
    currentDefiningVectorStore.set(new Vector3(0, 0, 0));
  });
</script>

{#snippet dialogArea(data: { isFullscreen: boolean })}
  {#if showDialogState}
    <DialogBox
      bind:show={showDialogState}
      bind:turns={dialogTurnsState}
      isFullscreen={data.isFullscreen}
    />
  {/if}
{/snippet}

{#snippet controlsArea(data: { isFullscreen: boolean })}
  <div class="vpe-controls-wrapper-normal-view">
    <VectorPrinterOutputPanel
      {nozzlePosition}
      extraClass="vpe-output-panel-normal"
    />
    <VectorOperationControls
      onPrintVector={handlePrintCurrentVector}
      onReset={handleActualReset}
    />
  </div>
{/snippet}

<InteractiveExercise
  class="interactive-exercise-component"
  exerciseTitle="Vector Printer"
  SceneComponent={VectorPrinterScene as unknown as ComponentType<SvelteComponent>}
  HudComponent={VectorPrinterHud as unknown as ComponentType<SvelteComponent>}
  ControlPanelComponent={VectorOperationControls as unknown as ComponentType<SvelteComponent>}
  {sceneProps}
  {hudProps}
  controlPanelProps={controlPanelPropsForInteractiveExercise}
  onResetRequestedByHudCallback={handleActualReset}
  dialogAreaSnippet={dialogArea}
  controlsAreaSnippet={controlsArea}
  onFullscreenStatusChangeCallback={(isFs: boolean) => {
    // isFullscreenForVPLayout = isFs; // No longer needed
  }}
/>

<style lang="scss">
  .vpe-controls-wrapper-normal-view {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    padding: var(--space-s); // Add some padding around the combined controls
    background-color: var(--color-surface);
    border-top: 1px solid var(--color-border); // Mimic previous style for controls area
  }

  /* :global(.vpe-output-panel-normal) {} */ /* Optional: if specific styling needed for output panel in normal view */
</style>

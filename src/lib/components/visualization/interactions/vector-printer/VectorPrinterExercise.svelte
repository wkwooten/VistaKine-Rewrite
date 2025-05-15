<script lang="ts">
  import type { SvelteComponent, ComponentType } from "svelte";
  import { Vector3 } from "three";
  import InteractiveExercise from "../../InteractiveExercise.svelte";
  import VectorPrinterScene from "./VectorPrinterScene.svelte";
  import VectorPrinterHud from "./VectorPrinterHud.svelte";
  import VectorOperationControls from "./VectorOperationControls.svelte";
  import DialogBox from "$lib/components/visualization/elements/ui/DialogBox.svelte";
  import type { DialogTurn } from "$lib/components/visualization/interactions/printer-calibration/calibrationState";
  import { currentDefiningVectorStore } from "./vectorPrinterState";
  import { onMount } from "svelte";

  // --- Component Props ---
  let { initialNozzlePosition = new Vector3(0, 0.1, 0) } = $props<{
    initialNozzlePosition?: Vector3;
  }>();

  // --- State for VectorPrinterExercise ---
  let nozzlePosition = $state(initialNozzlePosition.clone());
  let printedSegments = $state<
    { start: Vector3; end: Vector3; vector: Vector3 }[]
  >([]);

  // Dialog state
  let showDialog = $state(false);
  let dialogTurns = $state<DialogTurn[]>([]);

  // Layout state controlled by InteractiveExercise
  let isFullscreenForVPLayout = $state(false);

  // --- Main Functions ---
  function handlePrintCurrentVector() {
    const vectorToPrint = $currentDefiningVectorStore;
    if (vectorToPrint.lengthSq() === 0) {
      console.log("[VectorPrinterExercise] Cannot print a zero vector.");
      return;
    }
    addSegmentToPrint(vectorToPrint);
    currentDefiningVectorStore.set(new Vector3(0, 0, 0)); // Reset store after printing
  }

  function addSegmentToPrint(vector: Vector3) {
    const startPoint = nozzlePosition.clone();
    const endPoint = nozzlePosition.clone().add(vector);

    // Use a new array to ensure reactivity for printedSegments prop
    printedSegments = [
      ...printedSegments,
      {
        start: startPoint,
        end: endPoint,
        vector: vector.clone(),
      },
    ];
    nozzlePosition = endPoint; // Update nozzlePosition state

    console.log(
      "[VectorPrinterExercise] Segment printed. New nozzle position:",
      nozzlePosition
    );
    console.log("[VectorPrinterExercise] All segments:", printedSegments);
  }

  // This function is called by InteractiveExercise when HUD requests reset
  function handleActualReset(): void {
    console.log(
      "[VectorPrinterExercise] Resetting exercise via InteractiveExercise callback."
    );
    nozzlePosition = initialNozzlePosition.clone();
    printedSegments = [];
    currentDefiningVectorStore.set(new Vector3(0, 0, 0));
    showDialog = false;
    dialogTurns = [];
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
    printedSegments: printedSegments,
    currentVectorOrigin: nozzlePosition,
  });

  const hudProps = $derived({
    nozzlePosition: nozzlePosition,
  });

  // VectorOperationControls uses the store for its vector, only needs callbacks
  const controlPanelPropsForInteractiveExercise = $derived({
    onPrintVector: handlePrintCurrentVector,
    onReset: handleActualReset, // When slotted into HUD, it should call the main reset
  });

  onMount(() => {
    console.log(
      "[VectorPrinterExercise] Initialized with nozzle at:",
      nozzlePosition
    );
  });
</script>

<div class="vector-printer-exercise-shell">
  <!-- Dialog Box (rendered by VPE when not in its fullscreen layout) -->
  {#if showDialog && !isFullscreenForVPLayout}
    <div class="dialog-above-vis">
      <DialogBox bind:show={showDialog} bind:turns={dialogTurns} />
    </div>
  {/if}

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
    onFullscreenStatusChangeCallback={(isFs: boolean) =>
      (isFullscreenForVPLayout = isFs)}
  />

  <!-- VectorOperationControls (rendered by VPE when not in its fullscreen layout) -->
  {#if !isFullscreenForVPLayout}
    <div class="controls-area-outside-vis">
      <VectorOperationControls
        onPrintVector={handlePrintCurrentVector}
        onReset={resetExerciseFromDirectControls}
      />
    </div>
  {/if}
</div>

<style lang="scss">
  .vector-printer-exercise-shell {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    & > :global(.interactive-exercise-component) {
      flex-grow: 1;
      min-height: 300px;
    }
  }

  .dialog-above-vis {
    width: 100%;
    box-sizing: border-box;
    margin-bottom: var(--space-s);
    order: 1;
  }

  .controls-area-outside-vis {
    padding-block: var(--space-s);
    background-color: var(--color-surface-alt);
    border-top: 1px solid var(--color-border);
    overflow-y: auto;
    order: 3;
  }
</style>

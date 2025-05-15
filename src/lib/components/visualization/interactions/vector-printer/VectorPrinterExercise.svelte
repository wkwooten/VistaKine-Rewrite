<script lang="ts">
  import { Vector3 } from "three";
  import VectorPrinterScene from "./VectorPrinterScene.svelte";
  import VectorPrinterHud from "./VectorPrinterHud.svelte";
  import VectorOperationControls from "./VectorOperationControls.svelte";
  import DialogBox from "$lib/components/visualization/elements/ui/DialogBox.svelte";
  import type { DialogTurn } from "$lib/components/visualization/interactions/printer-calibration/calibrationState";
  import VisContainer from "../../VisContainer.svelte";

  // --- Component Props ---
  let { initialNozzlePosition = new Vector3(0, 0, 0) } = $props<{
    initialNozzlePosition?: Vector3;
  }>();

  // --- State ---
  let nozzlePosition = $state(initialNozzlePosition.clone());
  let printedSegments = $state<
    { start: Vector3; end: Vector3; vector: Vector3 }[]
  >([]);

  let currentDefiningVector = $state(new Vector3(0, 0, 0));

  // Dialog state (scaffolding)
  let showDialog = $state(false);
  let dialogTurns = $state<DialogTurn[]>([]);
  let currentDialogTurn = $derived(dialogTurns[0] ?? null);

  // --- Functions ---

  function handlePrintCurrentVector() {
    if (currentDefiningVector.lengthSq() === 0) {
      console.log("Cannot print a zero vector.");
      return;
    }
    addSegmentToPrint(currentDefiningVector);
    currentDefiningVector = new Vector3(0, 0, 0);
  }

  function addSegmentToPrint(vector: Vector3) {
    const startPoint = nozzlePosition.clone();
    const endPoint = nozzlePosition.clone().add(vector);

    printedSegments.push({
      start: startPoint,
      end: endPoint,
      vector: vector.clone(),
    });
    nozzlePosition = endPoint;

    console.log("Segment printed. New nozzle position:", nozzlePosition);
    console.log("All segments:", printedSegments);
  }

  function resetExercise() {
    nozzlePosition = initialNozzlePosition.clone();
    printedSegments = [];
    currentDefiningVector = new Vector3(0, 0, 0);
    showDialog = false;
    dialogTurns = [];
    console.log("Exercise Reset");
  }

  // --- Lifecycle & Effects ---
  $effect(() => {
    console.log("VectorPrinterExercise initialized/updated.");
  });
</script>

<div class="vector-printer-exercise-wrapper">
  <div class="vis-area-wrapper">
    <VisContainer>
      <VectorPrinterScene
        bind:nozzlePosition
        {printedSegments}
        currentVectorToDisplay={currentDefiningVector}
        currentVectorOrigin={nozzlePosition}
      />
    </VisContainer>

    <VectorPrinterHud
      {nozzlePosition}
      currentVectorA={currentDefiningVector}
      dialogMessage={currentDialogTurn?.message}
      dialogSpeaker={currentDialogTurn?.speaker}
    />
    {#if showDialog}
      <DialogBox
        bind:show={showDialog}
        bind:turns={dialogTurns}
        isFullscreen={false}
      />
    {/if}
  </div>

  <div class="controls-area">
    <VectorOperationControls
      bind:vectorToDefine={currentDefiningVector}
      onPrintVector={handlePrintCurrentVector}
      onReset={resetExercise}
    />
  </div>
</div>

<style lang="scss">
  .vector-printer-exercise-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .vis-area-wrapper {
    flex-grow: 1;
    position: relative;
    min-height: 300px;
    display: flex;
  }

  .controls-area {
    padding-block: var(--space-s);
    background-color: var(--color-surface-alt);
    border-top: 1px solid var(--color-border);
    min-height: 150px;
    overflow-y: auto;
  }

  :global(.vector-printer-exercise-wrapper .threlte-view) {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  :global(.vector-printer-exercise-wrapper .threlte-view > div) {
    pointer-events: auto;
  }
</style>

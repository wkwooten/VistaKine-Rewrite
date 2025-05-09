<script lang="ts">
  import { Vector3 } from "three";
  import { Canvas } from "@threlte/core";
  import VectorPrinterScene from "./VectorPrinterScene.svelte";
  import VectorPrinterHud from "./VectorPrinterHud.svelte";
  import VectorOperationControls from "./VectorOperationControls.svelte";
  import DialogBox from "$lib/components/visualization/elements/ui/DialogBox.svelte";
  import type { DialogTurn } from "$lib/stores/calibrationState"; // Reusing type for now
  import VisContainer from "../../VisContainer.svelte"; // Added import

  // --- Component Props ---
  let { initialNozzlePosition = new Vector3(0, 0, 0) } = $props<{
    initialNozzlePosition?: Vector3;
  }>();

  // --- State ---
  let nozzlePosition = $state(initialNozzlePosition.clone());
  let printedSegments = $state<
    { start: Vector3; end: Vector3; vector: Vector3 }[]
  >([]);

  // For Vector Addition
  let vectorA_input = $state(new Vector3(1, 0, 0)); // Example initial
  let vectorB_input = $state(new Vector3(0, 1, 0)); // Example initial
  let currentSegmentVector = $state(new Vector3()); // The vector for the current segment being defined/printed

  // Dialog state (scaffolding)
  let showDialog = $state(false);
  let dialogTurns = $state<DialogTurn[]>([]);
  let currentDialogTurn = $derived(dialogTurns[0] ?? null);

  // --- Functions ---

  function handleDefineVectorA() {
    // For now, directly use vectorA_input. Later, this could come from VectorOperationControls
    currentSegmentVector = vectorA_input.clone();
    console.log("Vector A defined:", currentSegmentVector);
    // In a real scenario, we might wait for a "Print" command
    // For now, let's imagine it's printed immediately for testing
    addSegmentToPrint(currentSegmentVector);
  }

  function handleDefineVectorB() {
    // For now, directly use vectorB_input.
    currentSegmentVector = vectorB_input.clone();
    console.log("Vector B defined:", currentSegmentVector);
    addSegmentToPrint(currentSegmentVector);
  }

  function addSegmentToPrint(vector: Vector3) {
    const startPoint = nozzlePosition.clone();
    const endPoint = nozzlePosition.clone().add(vector);

    printedSegments.push({
      start: startPoint,
      end: endPoint,
      vector: vector.clone(),
    });
    nozzlePosition = endPoint; // Update nozzle position

    console.log("Segment printed. New nozzle position:", nozzlePosition);
    console.log("All segments:", printedSegments);
  }

  function resetExercise() {
    nozzlePosition = initialNozzlePosition.clone();
    printedSegments = [];
    vectorA_input = new Vector3(1, 0, 0);
    vectorB_input = new Vector3(0, 1, 0);
    currentSegmentVector = new Vector3();
    // Reset dialog too if needed
    showDialog = false;
    dialogTurns = [];
    console.log("Exercise Reset");
  }

  // --- Lifecycle & Effects ---
  $effect(() => {
    // Example: Load initial dialog when component mounts (or based on some condition)
    // dialogTurns = [
    // 	{ speaker: 'Leo', message: 'Welcome to the Vector Printer! Let\'s start by adding some vectors.' },
    // 	{ speaker: 'Surya', message: 'Define your first vector (Vector A) using the controls.' }
    // ];
    // showDialog = true;
    console.log("VectorPrinterExercise initialized/updated.");
  });
</script>

<div class="vector-printer-exercise-wrapper">
  <!-- Visualization Area using VisContainer -->
  <div class="vis-area-wrapper">
    <VisContainer>
      <VectorPrinterScene
        bind:nozzlePosition
        {printedSegments}
        currentVectorToDisplay={currentSegmentVector}
        currentVectorOrigin={nozzlePosition}
      />
    </VisContainer>

    <!-- HUD and Dialog overlaying the VisContainer -->
    <VectorPrinterHud
      {nozzlePosition}
      currentVectorA={vectorA_input}
      currentVectorB={vectorB_input}
      resultantVector={vectorA_input.clone().add(vectorB_input)}
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
      bind:vectorA={vectorA_input}
      bind:vectorB={vectorB_input}
      onDefineVectorA={handleDefineVectorA}
      onDefineVectorB={handleDefineVectorB}
      onReset={resetExercise}
    />
    <!-- More controls for subtraction, scalar mult will go here -->
  </div>
</div>

<style lang="scss">
  .vector-printer-exercise-wrapper {
    display: flex;
    flex-direction: column; // Or row, depending on layout preference
    height: 100%; // Or a fixed height like 600px
    width: 100%;
    border-radius: var(--radius-md);
    overflow: hidden; // Prevent canvas/controls from breaking layout
  }

  /* New wrapper for VisContainer and its overlays */
  .vis-area-wrapper {
    flex-grow: 1;
    position: relative; // For absolute positioning of HUD and DialogBox
    min-height: 300px; // Ensure VisContainer has some space
    display: flex; // Added to help VisContainer take full space
  }

  /* Ensure VisContainer takes up space */
  /* :global(.visualization-area > .threlte-canvas-wrapper) removed as VisContainer handles its own canvas */

  /* Styling for VectorPrinterHud and DialogBox to overlay the canvas */
  /* VectorPrinterHud already has position: absolute in its own styles */
  /* DialogBox also has its own positioning logic often */

  .controls-area {
    padding-block: var(--space-s);
    background-color: var(--color-surface-alt);
    border-top: 1px solid var(--color-border); // If layout is column
    // border-left: 1px solid var(--color-border); // If layout is row
    min-height: 150px; // Ensure controls have some space
    overflow-y: auto; // If controls become too tall
  }

  /* Basic styling for HUD elements if View doesn't span full canvas for some reason */
  :global(.vector-printer-exercise-wrapper .threlte-view) {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none; /* Allow interaction with canvas below */
  }
  :global(.vector-printer-exercise-wrapper .threlte-view > div) {
    pointer-events: auto; /* Re-enable pointer events for HUD elements */
  }
</style>

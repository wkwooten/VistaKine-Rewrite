<script lang="ts">
  // import VisContainer from "../../VisContainer.svelte"; // Removed, InteractiveExercise handles this
  import FullCoordinateExplorerScene from "./FullCoordinateExplorerScene.svelte";
  import FrameManipulationHud from "./FrameManipulationHud.svelte";
  import InteractiveExercise from "../../InteractiveExercise.svelte"; // Added
  import type { ComponentType, Snippet } from "svelte"; // Added Snippet for prop typing
  import { onMount, onDestroy } from "svelte"; // Added for keydown listener
  import { browser } from "$app/environment"; // Added for browser check
  import {
    transformModeStore,
    type ExplorerTransformMode,
  } from "./coordinateExplorerStore"; // Import the store

  // type TransformMode = "translate" | "rotate"; // Type now comes from store
  // let currentMode = $state<TransformMode>("translate"); // Replaced by store
  let sceneResetKey = $state(0);

  // Define props for FullCoordinateExplorerExercise
  let {
    instructionSnippet,
  }: { instructionSnippet?: Snippet<[{ isFullscreen: boolean }]> } = $props();

  function setMode(mode: ExplorerTransformMode) {
    console.log(`[FCEE] Setting mode store to: ${mode}`);
    transformModeStore.set(mode); // Set the store value
  }

  // This function will be called by InteractiveExercise when its HUD requests a reset
  function handleResetRequestedByHud() {
    console.log(
      "FullCoordinateExplorerExercise: Resetting scene via InteractiveExercise."
    );
    // Incrementing sceneResetKey here will be passed down to FullCoordinateExplorerScene
    // via sceneProps through InteractiveExercise.
    // InteractiveExercise also has its own internal resetKey for VisContainer,
    // but this specific one is for the scene's own reset logic if needed beyond VisContainer's reset.
    // For this particular scene, its resetKey prop directly triggers its reset effect.
    sceneResetKey++;
  }

  // sceneProps will still pass the current mode from the store
  const sceneProps = $derived({
    initialMode: $transformModeStore, // Read from store for prop passing
    resetKey: sceneResetKey,
  });

  // FrameManipulationHud now reads currentMode from the store directly,
  // so we only need to pass onModeChange.
  const completeHudProps = $derived({
    onModeChange: setMode,
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key.toLowerCase() === "t") {
      setMode("translate");
    } else if (event.key.toLowerCase() === "r") {
      setMode("rotate");
    }
  }

  onMount(() => {
    if (browser) {
      // Check if in browser environment
      window.addEventListener("keydown", handleKeydown);
    }
  });

  onDestroy(() => {
    if (browser) {
      // Check if in browser environment
      window.removeEventListener("keydown", handleKeydown);
    }
  });
</script>

<!-- {#snippet dialogArea(data: { isFullscreen: boolean })}
  <div class="description-fcee">
    <p>
      Use the controls above the 3D view to switch between
      <strong>Translate (Move)</strong> and <strong>Rotate</strong> modes for the
      coordinate axes. Observe how the coordinates of the fixed reference points
      (the colored blocks) change as you move or rotate the entire axis system. The
      reset button will reset the axes to their initial state. This demonstrates
      that a point's coordinates are relative to the chosen frame of reference. Try
      setting the axes to an "awkward" position or angle to see how it complicates
      the coordinates!
    </p>
  </div>
{/snippet} -->

<InteractiveExercise
  SceneComponent={FullCoordinateExplorerScene as unknown as ComponentType<any>}
  HudComponent={FrameManipulationHud as unknown as ComponentType<any>}
  {sceneProps}
  hudProps={completeHudProps}
  ControlPanelComponent={undefined}
  onResetRequestedByHudCallback={handleResetRequestedByHud}
  exerciseTitle="Coordinate System Explorer"
  controlsAreaSnippet={undefined}
  {instructionSnippet}
/>

<style lang="scss">
  /* Removed .exercise-wrapper-fcee and .interaction-area-fcee styles */

  .description-fcee {
    padding: var(
      --space-s
    ); // Add some padding if it's now directly in the snippet
    background-color: var(
      --color-surface-alt
    ); // Optional: distinguish background
    border-bottom: 1px solid var(--color-border-light); // Optional: separator
    p {
      margin: 0;
      font-size: var(--step-0);
      color: var(--color-text-secondary);
    }
  }
</style>

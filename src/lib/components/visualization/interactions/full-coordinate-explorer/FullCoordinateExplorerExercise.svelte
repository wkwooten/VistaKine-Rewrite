<script lang="ts">
  import VisContainer from "../../VisContainer.svelte";
  import FullCoordinateExplorerScene from "./FullCoordinateExplorerScene.svelte";
  import CoordinateInputPanel from "./CoordinateInputPanel.svelte";

  // Local state for the coordinates, serving as the source of truth.
  let x = $state(1);
  let y = $state(1);
  let z = $state(1);

  // Optional: Add any exercise-specific logic or state here, like completion status if needed.
  // let isExerciseComplete = $state(false);

  // Debugging: Log state changes
  $effect(() => {
    console.log(`[FullCoordinateExplorerExercise] x updated: ${x}`);
  });
  $effect(() => {
    console.log(`[FullCoordinateExplorerExercise] y updated: ${y}`);
  });
  $effect(() => {
    console.log(`[FullCoordinateExplorerExercise] z updated: ${z}`);
  });
</script>

<div class="exercise-layout">
  <div class="description">
    <p>
      Use the input fields below to control the position of the magenta point in
      the 3D scene. Observe how changing the X, Y, and Z values moves the point
      along the respective axes. This explorer allows you to use both positive
      and negative coordinate values.
    </p>
  </div>

  <div class="interaction-area">
    <div class="scene-container">
      <VisContainer>
        <FullCoordinateExplorerScene {x} {y} {z} />
      </VisContainer>
    </div>
    <div>
      <CoordinateInputPanel bind:x bind:y bind:z />
    </div>
  </div>

  <!-- Placeholder for any results or feedback area -->
  <!-- {#if isExerciseComplete}\n    <div class="results">\n      <p>Congratulations! You've explored the coordinate system.</p>\n    </div>\n  {/if} -->
</div>

<style lang="scss">
  .exercise-layout {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  .interaction-area {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    align-items: center;
  }

  .scene-container {
    width: 100%;
    min-width: 0;
  }

  .controls-container {
    width: auto;
    min-width: 200px;
  }

  /* Styles for results, if used later
  .results {
    padding: var(--space-s);
    background-color: var(--success-container);
    color: var(--on-success-container);
    border: 1px solid var(--success);
    border-radius: var(--radius-base);
    text-align: center;
  }
  */
</style>

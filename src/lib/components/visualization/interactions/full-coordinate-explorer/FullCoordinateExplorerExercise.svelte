<script lang="ts">
  import VisContainer from "../../VisContainer.svelte";
  import FullCoordinateExplorerScene from "./FullCoordinateExplorerScene.svelte";

  // Optional: Add any exercise-specific logic or state here, like completion status if needed.
  // let isExerciseComplete = $state(false);
</script>

<div class="exercise-layout">
  <div class="description">
    <p>
      In this explorer, you can directly manipulate the coordinate system's
      origin. Observe how the coordinates of the fixed reference points (the
      colored spheres) change as you move the entire axis system (the red,
      green, and blue lines). This demonstrates that a point's coordinates are
      relative to the chosen frame of reference.
    </p>
  </div>

  <div class="interaction-area">
    <div class="scene-container">
      <VisContainer>
        <FullCoordinateExplorerScene />
      </VisContainer>
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

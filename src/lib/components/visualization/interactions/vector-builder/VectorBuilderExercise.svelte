<script lang="ts">
  import VisContainer from '../../VisContainer.svelte';
  import VectorBuilderScene from './VectorBuilderScene.svelte';
  import VectorBuilderHud from './VectorBuilderHud.svelte';
  // Import state later as needed
</script>

<h3>Vector Builder Exercise</h3>
<p>Define a start and end point to create and visualize a vector.</p>

<div class="exercise-wrapper">
  <!-- Dialog placement similar to calibration if needed -->

  <VisContainer>
    <VectorBuilderScene />
    <!-- HUD might go here or outside VisContainer -->
  </VisContainer>

  <VectorBuilderHud />

</div>

<style>
  .exercise-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
  }
</style>
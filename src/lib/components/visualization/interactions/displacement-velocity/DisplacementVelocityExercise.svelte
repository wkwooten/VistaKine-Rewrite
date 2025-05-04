<script lang="ts">
  import { T, Canvas } from "@threlte/core";
  import DisplacementVelocityScene from "./DisplacementVelocityScene.svelte";
  import DisplacementVelocityHud from "./DisplacementVelocityHud.svelte";
  import VisContainer from "$lib/components/visualization/VisContainer.svelte";
  import ContentCard from "$lib/components/ContentCard.svelte";
  import { onMount } from "svelte";
  // Later: Import state management functions/stores

  let isMounted = false;
  onMount(() => {
    isMounted = true;
    // Initialize state, start intro dialogue etc.
  });

  // Props for title/description if needed
  export let title: string = "Exercise 2.1: Distance vs. Displacement";
  export let description: string =
    "Watch the drone move and observe the difference between the path it takes (distance) and its overall change in position (displacement).";
</script>

<ContentCard blockType="exercise-block" layoutWidth="full">
  {#if title || description}
    <div class="exercise-header">
      {#if title}<h3>{title}</h3>{/if}
      {#if description}<p>{description}</p>{/if}
    </div>
  {/if}

  <VisContainer>
    {#if isMounted}
      <!-- Render HUD Overlay -->
      <DisplacementVelocityHud />

      <!-- Threlte Canvas -->
      <Canvas>
        <DisplacementVelocityScene />
      </Canvas>

      <!-- Other overlay elements like DialogBox could go here -->
    {:else}
      <div class="loading-placeholder">Loading Visualization...</div>
    {/if}
  </VisContainer>
</ContentCard>

<style lang="scss">
  .exercise-header {
    margin-bottom: var(--space-s);
    padding: 0 var(--space-s); // Add padding if needed
    @media (max-width: 600px) {
      padding: 0;
    }
    h3 {
      margin-bottom: var(--space-3xs);
    }
    p {
      color: var(--color-text-secondary);
      font-size: var(--step--1);
    }
  }

  .loading-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px; // Ensure placeholder has some height
    color: var(--color-text-secondary);
  }
</style>

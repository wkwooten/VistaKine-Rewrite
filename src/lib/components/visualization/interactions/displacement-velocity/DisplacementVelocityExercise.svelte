<script lang="ts">
  import type { SvelteComponent, ComponentType } from "svelte"; // Ensure SvelteComponent is imported
  import InteractiveExercise from "../../InteractiveExercise.svelte"; // Added
  import DisplacementVelocityScene from "./DisplacementVelocityScene.svelte";
  import DisplacementVelocityHud from "./DisplacementVelocityHud.svelte";
  import { onMount } from "svelte";
  // Later: Import state management functions/stores

  // Props for title/description if needed, these will be used in the snippet
  let {
    title = "Exercise 2.1: Distance vs. Displacement",
    description = "Watch the drone move and observe the difference between the path it takes (distance) and its overall change in position (displacement).",
  } = $props<{
    title?: string;
    description?: string;
  }>();

  // Removed isMounted logic, assuming InteractiveExercise handles child rendering

  // Placeholder for actual reset logic if DisplacementVelocityHud requests it
  function handleActualReset() {
    console.log("[DisplacementVelocityExercise] Reset requested.");
    // TODO: Implement actual reset logic for this exercise (e.g., call state store reset)
  }

  const sceneProps = $derived({}); // DVScene doesn't seem to take props currently
  const hudProps = $derived({}); // DVHud doesn't seem to take props currently (besides those from IE)
  const controlPanelProps = $derived({}); // Added for completeness
</script>

{#snippet dialogArea(data: { isFullscreen: boolean })}
  {#if title || description}
    <div class="exercise-header-dve">
      {#if title}<h3>{title}</h3>{/if}
      {#if description}<p>{description}</p>{/if}
    </div>
  {/if}
{/snippet}

<InteractiveExercise
  SceneComponent={DisplacementVelocityScene as unknown as ComponentType<SvelteComponent>}
  HudComponent={DisplacementVelocityHud as unknown as ComponentType<SvelteComponent>}
  ControlPanelComponent={undefined}
  {sceneProps}
  {hudProps}
  {controlPanelProps}
  onResetRequestedByHudCallback={handleActualReset}
  exerciseTitle={title}
  dialogAreaSnippet={dialogArea}
  controlsAreaSnippet={undefined}
></InteractiveExercise>

<style lang="scss">
  .exercise-header-dve {
    /* Renamed to avoid conflict if original class was global */
    margin-bottom: var(--space-s);
    /* Original padding was conditional, apply consistently or remove if IE handles spacing */
    padding: 0 var(--space-s);
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

  /* Removed .loading-placeholder style as isMounted logic is removed */
</style>

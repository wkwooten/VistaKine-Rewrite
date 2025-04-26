<script lang="ts">
  import { intersect, type IntersectDetail } from '$lib/utils/intersection';
  import { onDestroy } from 'svelte';
  import type { Snippet } from 'svelte'; // Import Snippet type

  // Props using Svelte 5 $props pattern
  let { blockType = '', class: klass = '', children, ...restProps } = $props<{ // Destructure children explicitly
    blockType?: string;
    class?: string;
    children: Snippet; // Type children as Snippet
  }>();

  let isVisible = $state(false);
  let elementRef: HTMLElement | undefined = $state();

  // Intersection Observer Logic using the action
  // We don't need an explicit observer instance here if the action handles it
  function handleIntersect(detail: IntersectDetail) {
    isVisible = detail.isIntersecting;
  }

  // Note: The use:intersect action handles cleanup via its destroy method automatically

</script>

<div
  bind:this={elementRef}
  use:intersect={{
    rootMargin: '-20% 0px -20% 0px', // Keep the refined margin
    threshold: 0.2,
    onIntersect: handleIntersect
  }}
  class="content-card {blockType} {klass}"
  class:is-visible={isVisible}
>
  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="scss">
  @use '$lib/styles/variables' as vars; // Import variables

  .content-card {
    // --- Base Card Styles (Moved from SectionTemplate) ---
    margin-top: var(--space-l);
    margin-bottom: var(--space-xl);
		margin-inline: var(--space-3xs);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-sm); // Use the base shadow defined in variables
    border-radius: var(--radius-md);
    padding: var(--space-l) var(--space-m);
    padding-bottom: var(--space-xl);
    transition: box-shadow var(--transition-normal) var(--transition-bezier), transform var(--transition-normal) var(--transition-bezier);

    /* Default state (not lifted) */
    transform: translateY(0);
  }

  .content-card.is-visible {
    // --- Lifted Styles (Moved from SectionTemplate) ---
    box-shadow: var(--shadow-lg);
    transform: translateY(3px);
  }

  /* Styles specifically for visualization-block type */
  .content-card{
    border: 1px solid var(--color-border);


    // Specific adjustments when it's also an exercise
    // Note: .-exercise class comes from the parent via `class` prop
    &.-exercise {
      .exercise-description {
        font-size: var(--step-0);
        margin-bottom: var(--space-m);
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin-left: 0;
        margin-right: 0;
      }

      // Adjustments if it also has .visualization-card (legacy?)
      &.visualization-card { // TODO: Review if visualization-card class is still needed here
        background-color: transparent;
        border: none;
        padding: 0;
        box-shadow: none;
        margin: var(--space-xl) 0;
      }
    }
  }

  /*
   Specific block-type overrides (like specific backgrounds for explanation-block)
   will still be handled in SectionTemplate.svelte using :global()
   targeting .content-card.blockType (e.g., :global(.content-card.visualization-block))
  */
</style>
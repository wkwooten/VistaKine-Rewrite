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
    threshold: 0.1,
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
  .content-card {
    // --- Base Card Styles (Moved from SectionTemplate) ---
    margin-top: var(--space-l);
    margin-bottom: var(--space-xl);
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
    box-shadow: var(--shadow-xl);
    transform: translateY(-3px);
  }

  /*
   Specific block-type overrides (like borders, specific backgrounds)
   will still be handled in SectionTemplate.svelte using :global()
   targeting .content-card.blockType (e.g., :global(.content-card.visualization-block))
  */
</style>
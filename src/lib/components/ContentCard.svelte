<script lang="ts">
  import { intersect, type IntersectDetail } from "$lib/utils/intersection";
  import { onDestroy } from "svelte";
  import type { Snippet } from "svelte"; // Import Snippet type

  // Define possible layout width values
  type LayoutWidth = "full" | "condensed";

  // Props using Svelte 5 $props pattern
  let {
    blockType = "",
    class: klass = "",
    layoutWidth = "full" as LayoutWidth, // Add layoutWidth prop, default to 'full'
    children,
    ...restProps
  } = $props<{
    // Destructure children explicitly
    blockType?: string;
    class?: string;
    layoutWidth?: LayoutWidth; // Make prop optional in type
    children: Snippet; // Type children as Snippet
    // Add other props if necessary, e.g., ...restProps: Record<string, any>
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
    rootMargin: "-20% 0px -20% 0px", // Keep the refined margin
    threshold: 0.2,
    onIntersect: handleIntersect,
  }}
  class="content-card {blockType} {klass}"
  class:is-visible={isVisible}
  class:layout-full={layoutWidth === "full"}
  class:layout-condensed={layoutWidth === "condensed"}
>
  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="scss">
  @use "$lib/styles/variables" as vars; // Import variables

  .content-card {
    margin-top: var(--space-l);
    margin-bottom: var(--space-xl);
    margin-inline: auto; // Center the card by default
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm); // Use the base shadow defined in variables
    border-radius: var(--radius-md);
    padding: var(--space-l) var(--space-m);
    padding-bottom: var(--space-xl);
    transition:
      box-shadow var(--transition-normal) var(--transition-bezier),
      transform var(--transition-normal) var(--transition-bezier),
      max-width var(--transition-normal) var(--transition-bezier); // Added max-width transition
    width: 100%; // Ensure it tries to take available space up to max-width

    /* Default state (not lifted) */
    transform: translateY(0);

    // Default to standard content width
    max-width: var(
      --wide-content-width
    ); // Use the standard wide width as default max
  }

  .content-card.is-visible {
    // --- Lifted Styles (Moved from SectionTemplate) ---
    box-shadow: var(--shadow-lg);
    transform: translateY(3px);
  }

  // --- Layout Width Specific Styles ---
  .content-card.layout-full {
    max-width: var(
      --wide-content-width
    ); // Explicitly full width (same as default)
  }

  .content-card.layout-condensed {
    max-width: 500px; // Changed from 65ch for more noticeable difference
    // Could also use vars.$breakpoint-sm or similar variable
    border-radius: var(--radius-md);
  }

  /* Styles specifically for visualization-block and exercise types */
  .content-card.visualization-block,
  .content-card.-exercise {
    // Apply common border or other styles specific to these types
    border: 1px solid var(--color-border); // Example: Moved border here

    // Specific adjustments when it's also an exercise
    &.-exercise {
      // This nested rule now only applies if the card *already* has .visualization-block or .-exercise
      // Adjustments if it also has .visualization-card (legacy?)
      // This selector might need adjustment if visualization-card is passed via `class` prop
      &.visualization-card {
        // TODO: Review if visualization-card class is still needed here
        background-color: transparent;
        border: none; // Overrides the border set above if both classes are present
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

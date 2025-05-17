<script lang="ts">
  import { intersect, type IntersectDetail } from "$lib/utils/intersection";
  import type { Snippet } from "svelte";
  import BookmarkIcon from "$lib/components/ui/BookmarkIcon.svelte";

  type LayoutWidth = "full" | "condensed";

  let {
    blockType = "",
    class: klass = "",
    layoutWidth = "full" as LayoutWidth,
    contentId,
    showBookmarkFeature = false,
    children,
    ...restProps
  } = $props<{
    blockType?: string;
    class?: string;
    layoutWidth?: LayoutWidth;
    contentId?: string;
    showBookmarkFeature?: boolean;
    children: Snippet;
  }>();

  let isVisible = $state(false);
  let elementRef: HTMLElement | undefined = $state();

  function handleIntersect(detail: IntersectDetail) {
    isVisible = detail.isIntersecting;
  }

  if (showBookmarkFeature && !contentId) {
    console.warn(
      "ContentCard: `contentId` prop is required when `showBookmarkFeature` is true. " +
        "Bookmark feature will be disabled for this card."
    );
  }

  // Condition to render the BookmarkIcon component wrapper
  // BookmarkIcon itself will check for authentication.
  const shouldRenderBookmarkWrapper = $derived(
    showBookmarkFeature && !!contentId
  );
</script>

<div
  bind:this={elementRef}
  use:intersect={{
    rootMargin: "-20% 0px -20% 0px",
    threshold: 0.2,
    onIntersect: handleIntersect,
  }}
  class="content-card {blockType} {klass}"
  class:is-visible={isVisible}
  class:layout-full={layoutWidth === "full"}
  class:layout-condensed={layoutWidth === "condensed"}
>
  {#if shouldRenderBookmarkWrapper}
    <BookmarkIcon
      contentId={contentId!}
      contentType="card"
      class="card-bookmark-icon"
    />
  {/if}

  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="scss">
  @use "$lib/styles/variables" as vars;

  .content-card {
    position: relative;
    margin-top: var(--space-l);
    margin-bottom: var(--space-3xl);
    margin-inline: auto; // Center the card by default
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm); // Use the base shadow defined in variables
    border-radius: var(--radius-md);
    padding: var(--space-l) var(--space-m);
    padding-bottom: var(--space-xl);
    transition:
      box-shadow var(--transition-normal) var(--transition-bezier),
      max-width var(--transition-normal) var(--transition-bezier);
    width: 100%; // Ensure it tries to take available space up to max-width

    /* Default state (not lifted) */

    // Default to standard content width
    max-width: var(
      --wide-content-width
    ); // Use the standard wide width as default max

    @media (max-width: 600px) {
      padding: var(--space-m) var(--space-s); // Reduced top/bottom and side padding
      padding-bottom: var(--space-l); // Reduced bottom padding
      margin-top: var(--space-m); // Optionally reduce top margin as well
      margin-bottom: var(--space-2xl); // Optionally reduce bottom margin
    }
  }

  .content-card.is-visible {
    // --- Lifted Styles (Moved from SectionTemplate) ---
    box-shadow: var(--shadow-lg);
    // @media (prefers-reduced-motion: no-preference) {
    //   transform: translateY(-4px); // REMOVED
    // }
    // Define transitions for when this class is active
    transition:
      // transform var(--transition-slow) var(--transition-bezier), // REMOVED
      box-shadow var(--transition-slow) var(--transition-bezier); // SLOW for shadow appearing
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

  // Updated to style the wrapper/positioning for the new component if needed
  // The actual button styling is now in BookmarkIcon.svelte
  // This class is now applied to the BookmarkIcon component itself.
  :global(.card-bookmark-icon) {
    position: absolute;
    top: var(--space-xs);
    right: var(--space-xs);
    z-index: 10;
    // Font size and color will be inherited from BookmarkIcon.svelte's own styles
    // but you can override or add layout-specific styles here if needed.
  }

  /*
   Specific block-type overrides (like specific backgrounds for explanation-block)
   will still be handled in SectionTemplate.svelte using :global()
   targeting .content-card.blockType (e.g., :global(.content-card.visualization-block))
  */
</style>

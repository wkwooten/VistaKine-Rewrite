<script lang="ts">
  import { slide } from 'svelte/transition';
  import { ChevronRight } from 'lucide-svelte';

  // Props
  export let initiallyOpen: boolean = true; // Allow controlling initial state

  // Internal state
  let showContent = initiallyOpen;

  // Unique ID for ARIA
  const contentId = `accordion-content-${Math.random().toString(36).substring(2, 9)}`;
  const headerId = `accordion-header-${Math.random().toString(36).substring(2, 9)}`; // ID for the header itself
</script>

<div class="accordion">
  <div
    class="accordion-header"
    id={headerId}
    role="button"
    tabindex="0"
    aria-expanded={showContent}
    aria-controls={contentId}
    on:click={() => showContent = !showContent}
    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { showContent = !showContent; } }}
  >
    <slot name="header">Default Header</slot>
    <div class="chevron" class:expanded={showContent}>
      <ChevronRight size={24} />
    </div>
  </div>

  {#if showContent}
    <div
      class="accordion-content"
      id={contentId}
      role="region"
      aria-labelledby={headerId}
      transition:slide={{ duration: 300, axis: 'y' }}
    >
      <slot name="content">Default Content</slot>
    </div>
  {/if}
</div>

<style lang="scss">
  /* Generic Accordion Styles */
  .accordion {
    /* Add any overall container styles if needed, e.g., margin */
    margin-bottom: var(--space-m);
    /* Optional: Add border/padding based on common use case */
    border-left: 3px solid var(--chapter-color, var(--primary-color)); /* Use a variable or fallback */
  }

  .accordion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xs);
    font-size: var(--step-1); /* Consider making font size/weight props or using defaults */
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--bg-hover, rgba(59, 130, 246, 0.1));
    }

    &:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
  }

  .chevron {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;

    &.expanded {
      transform: rotate(90deg);
    }
  }

  .accordion-content {
    overflow: hidden;
    /* Optional: Add default padding/margin/background/border for content */
    padding: var(--space-m);
    margin-inline: var(--space-m);
    margin-top: var(--space-xs);
    border-radius: var(--radius-md);
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
  }
</style>
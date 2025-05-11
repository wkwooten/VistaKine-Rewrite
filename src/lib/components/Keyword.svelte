<script lang="ts">
  // Runes ($state, $derived, $effect) are automatically available in Svelte 5
  import glossaryData from "$lib/data/glossary-data";
  import type { GlossaryTerm } from "$lib/data/glossary-data";
  import { currentChapter } from "$lib/stores/appState.js"; // Import the store

  let { term }: { term: string } = $props();

  let showPopover = $state(false);
  let popoverElement: HTMLElement | undefined = $state();

  // Generate a URL-friendly ID from the term
  const keywordId = $derived(
    term
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  );

  // Find the glossary entry for the given term
  // Consider optimizing this if glossaryData becomes very large
  const glossaryEntry: GlossaryTerm | undefined = $derived(
    glossaryData
      .flatMap((chapter) => chapter.glossaryTerms)
      .find((entry) => entry.term.toLowerCase() === term.toLowerCase())
  );

  function handleClick(event: MouseEvent) {
    showPopover = !showPopover;
    // Basic positioning attempt - might need refinement
    if (showPopover && popoverElement) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      popoverElement.style.top = `${rect.bottom + window.scrollY + 5}px`; // Position below the keyword
      popoverElement.style.left = `${rect.left + window.scrollX}px`;
    }
  }

  function closePopover() {
    showPopover = false;
  }

  // Close popover if clicking outside
  $effect(() => {
    if (!showPopover) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverElement &&
        !popoverElement.contains(event.target as Node) &&
        event.target !== popoverElement.previousElementSibling
      ) {
        closePopover();
      }
    };

    document.addEventListener("click", handleClickOutside, true); // Use capture phase

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });
</script>

<span
  id={keywordId}
  class="keyword"
  onclick={handleClick}
  role="button"
  tabindex="0"
  aria-haspopup="dialog"
  aria-expanded={showPopover}
>
  {term}
</span>

{#if showPopover && glossaryEntry}
  <div
    class="keyword-popover"
    bind:this={popoverElement}
    role="dialog"
    aria-modal="true"
  >
    <button
      class="close-button"
      onclick={closePopover}
      aria-label="Close definition">&times;</button
    >
    <p class="popover-term"><strong>{glossaryEntry.term}</strong></p>
    <p class="definition">{glossaryEntry.definition}</p>
    <a href="/glossary" class="glossary-link">Go to Glossary</a>
    {#if glossaryEntry.sectionRef}
      <!-- Use the store value ($currentChapter), sectionRef, and the generated keywordId -->
      <a
        href={`/chapter/${$currentChapter}/${glossaryEntry.sectionRef}#${keywordId}`}
        class="glossary-link">Go to Section</a
      >
    {/if}
  </div>
{/if}

<style lang="scss">
  .keyword {
    /* Styles inherited from chapter-styles.scss */
    /* Ensure it behaves like a button */
    cursor: help;
    outline: none; /* Remove default focus outline if needed, handle focus state */
    padding-inline: 0.2em;
    &:focus-visible {
      /* Add a distinct focus style */
      box-shadow: 0 0 0 2px
        color-mix(in srgb, var(--color-accent) 50%, transparent);
    }
  }

  .keyword-popover {
    position: absolute; /* Position relative to nearest positioned ancestor or body */
    z-index: 1000; /* Ensure it appears above other content */
    background-color: var(--color-surface, white);
    border: 1px solid var(--color-border, #ccc);
    border-radius: var(--radius-md, 4px);
    box-shadow: var(--shadow-lg, 0 4px 12px rgba(0, 0, 0, 0.15));
    padding: var(--space-m, 1rem);
    max-width: 400px;
    font-size: var(--step--0);

    .popover-term {
      margin: 0 0 var(--space-s) 0;
      font-size: inherit;
      color: var(--color-accent);
    }

    .close-button {
      position: absolute;
      top: var(--space-xs);
      right: var(--space-xs);
      background: none;
      border: none;
      font-size: 1.5em;
      line-height: 1;
      cursor: pointer;
      padding: 0;
      color: var(--color-text-secondary);

      &:hover {
        color: var(--color-text-primary);
      }
    }

    .definition {
      margin: 0 0 var(--space-s) 0;
      line-height: 1.5;
      max-height: 100px;
      padding-bottom: var(--space-s);
      overflow-y: scroll;
    }

    .glossary-link {
      display: block;
      margin-top: var(--space-s);
      font-size: var(--step--1);
      color: var(--color-accent);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>

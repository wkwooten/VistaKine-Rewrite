<script lang="ts">
  import { chapters } from "$lib/data/chapters";
  import { fly } from "svelte/transition";
  import { quintIn, quintOut } from "svelte/easing";
  import { goto } from "$app/navigation";
  import { tick } from "svelte";
  import type { SearchableItem } from "$lib/searchLogic";
  import { getSearchableData, filterSearchableData } from "$lib/searchLogic";

  let query = $state("");
  let currentTopicPrompt = $state("VistaKine..."); // Will hold only the topic, e.g., "Vectors"
  let searchPrompts = $state<string[]>([]); // Will store only topic words
  let promptIndex = $state(0);
  let isInputFocused = $state(false);

  // --- New state for dropdown ---
  let activeIndex = $state(-1);
  let itemElements = $state<Array<HTMLLIElement | undefined>>([]);
  let listElement: HTMLUListElement | undefined = $state();
  let inputElement: HTMLInputElement | undefined = $state();
  let showDropdown = $state(false);
  // --- End new state ---

  // --- Filtered Results ---
  const allSearchableItems = getSearchableData(); // Get all items once
  const filteredResults = $derived.by((): SearchableItem[] => {
    if (!query.trim()) return [];
    return filterSearchableData(query, allSearchableItems).slice(0, 7); // Limit to 7 results
  });
  // --- End Filtered Results ---

  // Log critical states for debugging - MOVED HERE
  $inspect(showDropdown, query, filteredResults, isInputFocused);

  function preparePrompts() {
    const topics: string[] = [];
    const blacklist = [
      "basic",
      "advanced",
      "understanding",
      "introduction",
      "and",
      "the",
      "of",
      "in",
      "to",
      "a",
      "&",
    ]; // Words to be wary of as primary prompts

    chapters.forEach((chapter) => {
      chapter.sections.forEach((section) => {
        if (section.title) {
          let titleParts = section.title
            .toLowerCase()
            .split(/\s+|\-/)
            .filter((word) => word.length > 2 && !blacklist.includes(word));
          let prompt = "";

          if (titleParts.length > 0) {
            if (titleParts.length === 1) {
              prompt = titleParts[0];
            } else if (titleParts.length >= 2) {
              // Prefer two-word combinations if they are descriptive
              prompt = titleParts.slice(0, 2).join(" ");
              // If first word is short, try second and third or just second if longer
              if (titleParts[0].length < 4 && titleParts.length > 2) {
                prompt = titleParts.slice(1, 3).join(" ");
              } else if (titleParts[0].length < 4 && titleParts[1]) {
                prompt = titleParts[1];
              }
            }
          }

          // Capitalize first letter of each word in the prompt
          if (prompt) {
            prompt = prompt
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }

          // Add to topics if it's a meaningful prompt
          if (prompt && prompt.length > 3 && prompt.length < 25) {
            topics.push(prompt);
          } else {
            // Fallback: use a significant word from the slug if title processing failed
            const slugParts = section.slug
              .split("-")
              .filter((p) => p.length > 3 && !blacklist.includes(p));
            if (slugParts.length > 0) {
              let slugPrompt = slugParts[0];
              if (
                slugParts.length > 1 &&
                slugParts[0].length < 5 &&
                slugParts[1]
              )
                slugPrompt = slugParts.slice(0, 2).join(" ");
              else if (
                slugParts.length > 1 &&
                slugParts[1] &&
                slugParts[1].length > slugParts[0].length
              )
                slugPrompt = slugParts[1];

              topics.push(
                slugPrompt.charAt(0).toUpperCase() + slugPrompt.slice(1)
              );
            }
          }
        }
      });
    });

    let uniqueTopics = [...new Set(topics.filter((t) => t && t.trim() !== ""))];

    if (uniqueTopics.length === 0) {
      // Default fallback prompts if no suitable ones are generated
      uniqueTopics = [
        "Vectors",
        "Motion",
        "Physics",
        "Forces",
        "Energy",
        "Kinematics",
        "Dynamics",
      ];
    }

    // Store only topic words, shuffle them
    searchPrompts = uniqueTopics
      .map((p) => p.trim())
      .sort(() => 0.5 - Math.random());

    if (searchPrompts.length > 0) {
      currentTopicPrompt = searchPrompts[0];
    } else {
      currentTopicPrompt = "Topics..."; // Fallback if no prompts generated
    }
  }

  preparePrompts();

  $effect(() => {
    if (searchPrompts.length === 0) return;

    const intervalId = setInterval(() => {
      promptIndex = (promptIndex + 1) % searchPrompts.length;
      currentTopicPrompt = searchPrompts[promptIndex]; // Update only the topic part
    }, 4500); // Cycle every 4.5 seconds

    return () => {
      clearInterval(intervalId);
    };
  });

  // --- Effects for dropdown ---
  $effect(() => {
    if (filteredResults.length === 0 || !showDropdown) {
      if (activeIndex !== -1) {
        activeIndex = -1;
      }
    } else if (activeIndex >= filteredResults.length) {
      activeIndex = -1;
    }
  });

  $effect(() => {
    const currentActiveIndex = activeIndex;
    if (currentActiveIndex > -1 && itemElements[currentActiveIndex]) {
      const targetElement = itemElements[currentActiveIndex];
      if (targetElement instanceof HTMLElement) {
        tick().then(() => {
          if (
            activeIndex === currentActiveIndex &&
            itemElements[currentActiveIndex] &&
            itemElements[currentActiveIndex] instanceof HTMLElement
          ) {
            itemElements[currentActiveIndex].scrollIntoView({
              block: "nearest",
            });
          }
        });
      }
    }
  });
  // --- End effects for dropdown ---

  function handleSearch() {
    // If an item is selected in dropdown, navigate to it. Otherwise, perform general search.
    if (activeIndex > -1 && filteredResults[activeIndex]) {
      handleResultClick(filteredResults[activeIndex]);
    } else if (query.trim()) {
      goto(`/search?q=${encodeURIComponent(query.trim())}`);
      showDropdown = false; // Hide dropdown after search
      inputElement?.blur();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    const { key } = event;
    const resultsCount = filteredResults.length;

    if (key === "Enter") {
      event.preventDefault();
      handleSearch(); // Uses the modified handleSearch
    } else if (key === "ArrowDown") {
      event.preventDefault();
      if (resultsCount > 0 && showDropdown) {
        activeIndex = (activeIndex + 1) % resultsCount;
      }
    } else if (key === "ArrowUp") {
      event.preventDefault();
      if (resultsCount > 0 && showDropdown) {
        activeIndex = (activeIndex - 1 + resultsCount) % resultsCount;
      }
    } else if (key === "Escape") {
      event.preventDefault();
      showDropdown = false;
      activeIndex = -1;
      inputElement?.blur();
    } else if (key === "Tab") {
      if (showDropdown && resultsCount > 0) {
        // Allow tab to move focus out, closing dropdown
        showDropdown = false;
        activeIndex = -1;
      }
    }
  }

  function handleFocus() {
    isInputFocused = true;
    showDropdown = true;
  }

  function handleBlur(event: FocusEvent) {
    isInputFocused = false; // For placeholder animation

    // Delay hiding the dropdown to allow click events on its items to process
    setTimeout(() => {
      const activeEl = document.activeElement;
      // If focus is NOT on the input itself AND (either the list doesn't exist OR focus is not within the list)
      if (
        activeEl !== inputElement &&
        (!listElement || !listElement.contains(activeEl))
      ) {
        showDropdown = false;
        activeIndex = -1;
      }
      // If focus somehow ended up on body or nowhere, and not on an intended target, also hide.
      else if (activeEl === document.body || activeEl === null) {
        if (
          event.relatedTarget !== null &&
          listElement &&
          listElement.contains(event.relatedTarget as Node)
        ) {
          // If relatedTarget (where focus is going) is in list, DONT hide. This case is tricky.
          // The onmousedown on li should prevent blur, but this is a safeguard.
        } else {
          showDropdown = false;
          activeIndex = -1;
        }
      }
    }, 150); // Increased delay slightly for safety
  }

  function handleResultClick(result: SearchableItem) {
    goto(result.href);
    query = ""; // Clear query after selection
    showDropdown = false;
    activeIndex = -1;
    inputElement?.blur();
  }
</script>

<div class="search-bar-container">
  <div class="placeholder-container" class:hidden={query || isInputFocused}>
    <span class="static-placeholder-prefix">Search&nbsp;</span>
    {#key currentTopicPrompt}
      <span
        class="animated-placeholder"
        in:fly|local={{ y: 20, duration: 500, delay: 500, easing: quintOut }}
        out:fly|local={{ y: -20, duration: 500, easing: quintIn }}
      >
        {currentTopicPrompt}
      </span>
    {/key}
  </div>
  <input
    type="text"
    bind:value={query}
    onkeydown={handleKeydown}
    onfocus={handleFocus}
    onblur={handleBlur}
    aria-label="Search VistaKine"
    class="search-input"
    bind:this={inputElement}
    role="combobox"
    aria-expanded={showDropdown && filteredResults.length > 0}
    aria-controls="hero-search-results-listbox"
    aria-activedescendant={activeIndex > -1 && itemElements[activeIndex]
      ? `hero-result-item-${activeIndex}`
      : undefined}
  />
  <button onclick={handleSearch} class="search-button" aria-label="Search">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="search-icon"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  </button>

  <!-- Dropdown List -->
  {#if showDropdown && query.trim() && filteredResults.length > 0}
    <ul
      class="search-results-list"
      role="listbox"
      id="hero-search-results-listbox"
      bind:this={listElement}
    >
      {#each filteredResults as result, i (result.id)}
        <li
          bind:this={itemElements[i]}
          id="hero-result-item-{i}"
          role="option"
          aria-selected={i === activeIndex}
          class="result-item"
          class:is-active-descendant={i === activeIndex}
          onclick={() => handleResultClick(result)}
          onmousedown={(e) => e.preventDefault()}
        >
          <div class="result-title">{result.title}</div>
          {#if result.context}
            <div class="result-context">{result.context}</div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
  <!-- End Dropdown List -->
</div>

<style lang="scss">
  @use "sass:color";
  @use "$lib/styles/variables" as theme; // Import variables

  .search-bar-container {
    display: flex;
    align-items: center;
    width: 100%;
    margin-block: var(--space-m) var(--space-l);
    border: 1px solid var(--color-border);
    background-color: var(--color-surface);
    border-radius: 25px; // Pill shape
    /* overflow: hidden; */ // REMOVED - This was likely clipping the absolute positioned dropdown
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    position: relative; // For absolute positioning of placeholder AND dropdown
    box-sizing: border-box; // Ensure padding is included within the 100% width

    &:focus-within {
      box-shadow: 0 4px 8px rgba(var(--color-accent-rgb), 0.3);
      border-color: var(--color-accent);
    }

    &.hidden {
      display: none; /* Changed back for simplicity and effectiveness */
      /*
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      z-index: -1;
      */
    }
  }

  .placeholder-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    display: flex; // Changed from flex to allow inline behavior of spans
    align-items: center;
    // Match .search-input padding-left for text alignment
    padding-left: var(--space-s);
    // Account for button width (44px) + its right margin (var(--space-xs) which is ~0.75rem or 12px) + a little extra for safety (e.g. 4px)
    // Total approx: 44px + 12px + 4px = 60px
    padding-right: calc(44px + var(--space-xs, 12px) + 4px);
    pointer-events: none;
    overflow: hidden;
    width: 100%; // Occupy full width of parent, padding will create space for button

    &.hidden {
      display: none; /* Changed back for simplicity and effectiveness */
      /*
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      z-index: -1;
      */
    }
  }

  .animated-placeholder {
    font-weight: 500;
  }

  .static-placeholder-prefix,
  .animated-placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;

    font-size: var(--step-0);
    white-space: nowrap;
    display: inline; // Ensures they sit side-by-side
  }

  .animated-placeholder {
    // No specific text-align needed as it's inline and will follow container's flow
    // Overflow and ellipsis for the animated part if it gets too long
    overflow: hidden;
    text-overflow: ellipsis;
    // Max width for the animated part to ensure it doesn't push static text or overflow badly
    // This needs to be dynamic or carefully considered. For now, let it be flexible.
    // max-width: calc(100% - /* width of "Search " */ - /* other paddings/margins */ );
  }

  .search-input {
    flex-grow: 1;
    padding: var(--space-m) var(--space-s);
    border: none;
    outline: none;
    font-size: var(--step-0);
    background-color: transparent; // Make input background transparent
    color: var(--color-text-primary);
    position: relative; // Ensure input is on top of the custom placeholder
    z-index: 1;
    min-width: 0; // Fix for flex item overflow

    &::placeholder {
      // Hide native placeholder if any
      color: transparent;
    }
  }

  .search-button {
    min-width: 44px;
    background-color: var(--color-accent);
    color: white;
    border: none;
    // Pill shape for button too, or keep as is? Keeping it slightly rounded.
    border-radius: 20px; // Make it consistently rounded, adjust as needed
    padding: var(--space-xs);
    margin-right: var(
      --space-xs
    ); // Reduced margin slightly to fit button in pill
    margin-left: var(--space-3xs); // Small space between input and button
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
    flex-shrink: 0; // Prevent button from shrinking
    z-index: 2; // Ensure button is above placeholder and input content for click

    svg {
      min-width: 1.2em;
      min-height: 1.2em;
      width: 1.2em;
      height: 1.2em;
    }

    &:hover {
      // Use var for hover if available, or keep color.adjust
      background-color: var(
        --color-accent-hover,
        #{color.adjust(theme.$color-accent, $lightness: -10%)}
      );
    }

    &:focus {
      outline: 2px solid var(--color-accent);
      // outline-offset: -2px; // Can cause issues with overflow:hidden on parent
      outline-offset: 1px;
    }
  }

  // --- Styles for Dropdown ---
  .search-results-list {
    position: absolute;
    top: calc(
      100% + var(--space-3xs)
    ); // Position below the search bar container
    left: 0;
    right: 0;
    background-color: var(
      --color-background
    ); // Use background color, not surface
    border: 1px solid var(--color-border);
    border-radius: var(--radius-m); // Slightly larger radius than NavSearch
    list-style: none;
    margin: 0;
    padding: var(--space-3xs); // Add some padding around items
    max-height: 300px; // Limit height
    overflow-y: auto;
    z-index: 10; // Ensure it's above other content
    box-shadow: var(--shadow-lg); // Use a larger shadow
    text-align: initial;

    li {
      padding: var(--space-s); // More padding per item
      cursor: pointer;
      margin-left: 0;
      border-radius: var(--radius-s); // Rounded items
      margin-bottom: var(--space-3xs); // Space between items

      &:last-child {
        margin-bottom: 0;
      }

      &:hover,
      &.is-active-descendant {
        background-color: var(--color-surface-hover);
        // Using outline for focus indication as in NavSearch
        outline: 2px solid var(--color-accent);
        outline-offset: -1px; // Keep outline inside
      }
    }
  }

  .result-title {
    color: var(--color-text-primary);
    font-size: var(--step-0);
    font-weight: 500;
  }

  .result-context {
    font-size: var(--step--1);
    color: var(--color-text-secondary);
    margin-top: var(--space-3xs);
    margin-left: var(--space-xs); // Indent context
  }
  // --- End Styles for Dropdown ---
</style>

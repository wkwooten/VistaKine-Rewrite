<script lang="ts">
  import { chapters } from "$lib/data/chapters";
  import { fly } from "svelte/transition";
  import { quintIn, quintOut } from "svelte/easing";
  import { goto } from "$app/navigation";
  import { tick } from "svelte";
  import type { SearchableItem } from "$lib/searchLogic";
  import { getSearchableData, filterSearchableData } from "$lib/searchLogic";

  // Interfaces
  interface TopicPromptLink {
    text: string;
    href: string;
  }

  // Constants
  const MAX_FILTERED_RESULTS = 7;
  const PLACEHOLDER_CYCLE_INTERVAL_MS = 4500;
  const BLUR_TIMEOUT_MS = 150;
  const DEFAULT_PLACEHOLDER_TEXT = "Topics...";
  const PROMPT_BLACKLIST = [
    "basic",
    "advanced",
    "understanding",
    "introduction",
    "the",
    "of",
    "in",
    "to",
    "a",
  ];

  const MIN_GENERATED_PROMPT_LENGTH = 3;

  // Component State
  let query = $state("");
  let topicPromptLinks = $state<TopicPromptLink[]>([]);
  let currentTopicPromptLink = $state<TopicPromptLink | null>(null);
  let promptIndex = $state(0);
  let isInputFocused = $state(false);
  let activeIndex = $state(-1);
  let itemElements = $state<Array<HTMLLIElement | undefined>>([]);
  let listElement: HTMLUListElement | undefined = $state();
  let inputElement: HTMLInputElement | undefined = $state();
  let showDropdown = $state(false);

  // Derived State
  const allSearchableItems = getSearchableData();
  const filteredResults = $derived.by((): SearchableItem[] => {
    if (!query.trim()) return [];
    return filterSearchableData(query, allSearchableItems).slice(
      0,
      MAX_FILTERED_RESULTS
    );
  });

  // Debugging (dev-only)
  $inspect(
    showDropdown,
    query,
    filteredResults,
    isInputFocused,
    currentTopicPromptLink
  );

  // Generates a list of topic prompts for the animated placeholder from chapter and section data.
  function preparePrompts() {
    const generatedTopics: TopicPromptLink[] = [];

    const titleCaseWithAcronyms = (text: string): string => {
      return text
        .toLowerCase()
        .split(" ")
        .map((word) => {
          if (word === "&") return "&";
          // Preserve specific terms/acronyms
          if (word.toUpperCase() === "3D") return "3D";
          if (word.toUpperCase() === "IC") return "IC";
          // Add other acronyms as needed, e.g., API, HTML

          // General acronym check (2-4 letters, all caps)
          if (
            word.length >= 2 &&
            word.length <= 4 &&
            word === word.toUpperCase() &&
            /^[A-Z0-9]+$/.test(word) // Ensures it's actually all caps and possibly numbers
          ) {
            return word;
          }
          // Default to capitalizing the first letter and lowercasing the rest
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
    };

    chapters.forEach((chapter) => {
      const chapterHref = `/chapter/${chapter.slug}`;

      // Handle special chapter titles
      if (chapter.slug === "understanding-3d-space") {
        generatedTopics.push({ text: "3D Space", href: chapterHref });
      } else if (
        chapter.title.includes(",") ||
        chapter.title.toLowerCase().includes(" and ")
      ) {
        const parts = chapter.title
          .split(/,|\\s+and\\s+/i) // Split by comma or 'and' (with surrounding spaces, case-insensitive)
          .map((p) => p.trim())
          .filter(
            (p) => p.length > 0 && !PROMPT_BLACKLIST.includes(p.toLowerCase())
          );

        parts.forEach((partOrigin) => {
          let cleanPart = partOrigin;
          if (cleanPart.toLowerCase().startsWith("and ")) {
            cleanPart = cleanPart.substring(4).trim();
          } else if (cleanPart.toLowerCase().startsWith("& ")) {
            cleanPart = cleanPart.substring(2).trim();
          }

          // Re-validate the cleaned part
          if (
            cleanPart &&
            cleanPart.length >= MIN_GENERATED_PROMPT_LENGTH &&
            !PROMPT_BLACKLIST.includes(cleanPart.toLowerCase())
          ) {
            generatedTopics.push({
              text: titleCaseWithAcronyms(cleanPart),
              href: chapterHref,
            });
          }
        });
      } else {
        // Standard chapter title
        generatedTopics.push({
          text: titleCaseWithAcronyms(chapter.title),
          href: chapterHref,
        });
      }

      // Section titles
      chapter.sections.forEach((section) => {
        if (section.title) {
          generatedTopics.push({
            text: titleCaseWithAcronyms(section.title),
            href: `/chapter/${chapter.slug}/${section.slug}`,
          });
        }
      });
    });

    let uniqueGeneratedTopics = generatedTopics
      .filter((topic) => {
        return (
          topic.text.length >= MIN_GENERATED_PROMPT_LENGTH &&
          topic.text.trim() !== ""
        );
      })
      .filter(
        (topic, index, self) =>
          index ===
          self.findIndex((t) => t.text === topic.text && t.href === topic.href)
      );

    if (uniqueGeneratedTopics.length === 0) {
      // Fallback to default prompts, ensuring they also fit the new "Search X" or special format
      uniqueGeneratedTopics = [
        { text: "Vectors", href: "/search?q=Vectors" },
        { text: "Motion", href: "/search?q=Motion" },
        { text: "Physics", href: "/search?q=Physics" },
        { text: "Forces", href: "/search?q=Forces" },
        { text: "Energy", href: "/search?q=Energy" },
        { text: "Kinematics", href: "/search?q=Kinematics" },
        { text: "Dynamics", href: "/search?q=Dynamics" },
      ];
    }

    topicPromptLinks = uniqueGeneratedTopics.sort(() => 0.5 - Math.random());

    if (topicPromptLinks.length > 0) {
      currentTopicPromptLink = topicPromptLinks[0];
    } else {
      currentTopicPromptLink = {
        text: DEFAULT_PLACEHOLDER_TEXT,
        href: "/search?q=Topics",
      };
    }
  }

  // Initialize placeholder prompts
  preparePrompts();

  // Performs a search action, navigating to a selected result, the current query, or the animated topic prompt.
  function handleSearch() {
    if (activeIndex > -1 && filteredResults[activeIndex]) {
      handleResultClick(filteredResults[activeIndex]);
    } else if (query.trim()) {
      goto(`/search?q=${encodeURIComponent(query.trim())}`);
      showDropdown = false;
      inputElement?.blur();
    } else if (topicPromptLinks.length > 0 && currentTopicPromptLink?.href) {
      goto(currentTopicPromptLink.href);
      showDropdown = false;
      inputElement?.blur();
    }
  }

  // Handles clicks on a search result item in the dropdown.
  function handleResultClick(result: SearchableItem) {
    goto(result.href);
    query = "";
    showDropdown = false;
    activeIndex = -1;
    inputElement?.blur();
  }

  // Manages keyboard interactions for navigating dropdown, submitting search, or closing dropdown.
  function handleKeydown(event: KeyboardEvent) {
    const { key } = event;
    const resultsCount = filteredResults.length;

    if (key === "Enter") {
      event.preventDefault();
      handleSearch();
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
        showDropdown = false;
        activeIndex = -1;
      }
    }
  }

  // Sets focus state and shows the dropdown when the input is focused.
  function handleFocus() {
    isInputFocused = true;
    showDropdown = true;
  }

  // Clears focus state and conditionally hides the dropdown when the input loses focus.
  function handleBlur(event: FocusEvent) {
    isInputFocused = false;

    setTimeout(() => {
      const activeEl = document.activeElement;
      if (
        activeEl !== inputElement &&
        (!listElement || !listElement.contains(activeEl))
      ) {
        showDropdown = false;
        activeIndex = -1;
      } else if (activeEl === document.body || activeEl === null) {
        if (
          event.relatedTarget !== null &&
          listElement &&
          listElement.contains(event.relatedTarget as Node)
        ) {
          // Focus moved to an item in the list, don't hide.
        } else {
          showDropdown = false;
          activeIndex = -1;
        }
      }
    }, BLUR_TIMEOUT_MS);
  }

  // --- Effects ---

  // Effect for cycling through topic prompts in the placeholder.
  $effect(() => {
    if (topicPromptLinks.length === 0) return;

    const intervalId = setInterval(() => {
      promptIndex = (promptIndex + 1) % topicPromptLinks.length;
      currentTopicPromptLink = topicPromptLinks[promptIndex];
    }, PLACEHOLDER_CYCLE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  });

  // Effect for managing activeIndex when results change or dropdown is hidden.
  $effect(() => {
    if (filteredResults.length === 0 || !showDropdown) {
      if (activeIndex !== -1) {
        activeIndex = -1;
      }
    } else if (activeIndex >= filteredResults.length) {
      activeIndex = -1; // Reset if out of bounds
    }
  });

  // Effect for scrolling the active dropdown item into view.
  $effect(() => {
    const currentActiveIndex = activeIndex;
    if (currentActiveIndex > -1 && itemElements[currentActiveIndex]) {
      const targetElement = itemElements[currentActiveIndex];
      if (targetElement instanceof HTMLElement) {
        tick().then(() => {
          // Check again if still the active item before scrolling
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
</script>

<div class="search-bar-container">
  <div class="placeholder-container" class:hidden={query || isInputFocused}>
    <span class="static-placeholder-prefix">Search&nbsp;</span>
    {#key currentTopicPromptLink?.text}
      <span
        class="animated-placeholder"
        in:fly|local={{ y: 20, duration: 500, delay: 500, easing: quintOut }}
        out:fly|local={{ y: -20, duration: 500, easing: quintIn }}
      >
        {currentTopicPromptLink?.text ?? DEFAULT_PLACEHOLDER_TEXT}
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
    overflow: hidden;
    text-overflow: ellipsis;
    // Ensure it respects max-width and allows text-overflow to work
    display: inline-block;
    max-width: 28ch; // Max width of ~22 characters, adjust as needed
    vertical-align: bottom; // Or middle, adjust for best alignment with prefix
    // overflow: hidden; // Already in common styles via .placeholder-container or directly
    // text-overflow: ellipsis; // Already in common styles or directly
    // white-space: nowrap; // Already in common styles
  }

  .static-placeholder-prefix,
  .animated-placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;

    font-size: var(--step-0);
    white-space: nowrap;
    display: inline; // Ensures they sit side-by-side
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
    border-radius: var(--radius-sm); // Slightly larger radius than NavSearch
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

<script lang="ts">
  import { goto } from "$app/navigation";
  import { tick } from "svelte";
  import {
    chapters as allChaptersFromData,
    getChapterBySlug,
  } from "$lib/data/chapters";
  import globalGlossaryData from "$lib/data/glossary-data";
  import { Search, X as ClearIcon } from "lucide-svelte";

  interface SearchableItem {
    id: string;
    type: "chapter" | "section" | "glossary";
    title: string;
    href: string;
    context?: string;
  }

  let searchQuery = $state("");
  let isFocused = $state(false);
  let inputElement: HTMLInputElement | undefined = $state();
  let activeIndex = $state(-1);
  let itemElements = $state<Array<HTMLLIElement | undefined>>([]);
  let listElement: HTMLUListElement | undefined = $state();

  // searchableItems must be defined before filteredResults
  const searchableItems = $derived.by((): SearchableItem[] => {
    const items: SearchableItem[] = [];

    // 1. Chapters
    allChaptersFromData.forEach((chapter) => {
      items.push({
        id: `chapter-${chapter.slug}`,
        type: "chapter",
        title: chapter.title,
        href: `/chapter/${chapter.slug}`,
        context: `Chapter ${chapter.number}`,
      });

      // 2. Sections within this chapter
      chapter.sections.forEach((section) => {
        items.push({
          id: `section-${chapter.slug}-${section.slug}`,
          type: "section",
          title: section.title,
          href: `/chapter/${chapter.slug}/${section.slug}`,
          context: `Section in: ${chapter.title}`,
        });
      });
    });

    // 3. Glossary Terms
    globalGlossaryData.forEach((glossaryChapter) => {
      const sourceChapterForContext = getChapterBySlug(
        glossaryChapter.chapterSlug
      );
      const chapterContextTitle =
        sourceChapterForContext?.title ?? glossaryChapter.chapterTitle;

      glossaryChapter.glossaryTerms.forEach((term) => {
        let href = `/glossary#${encodeURIComponent(term.term.toLowerCase().replace(/\s+/g, "-"))}`;
        let context = `Glossary Term (in ${chapterContextTitle})`;

        if (term.sectionRef && glossaryChapter.chapterSlug) {
          const sourceChapter = getChapterBySlug(glossaryChapter.chapterSlug);
          if (sourceChapter) {
            href = `/chapter/${glossaryChapter.chapterSlug}/${term.sectionRef}`;
            const referencedSection = sourceChapter.sections.find(
              (s) => s.slug === term.sectionRef
            );
            context = `Term related to: ${referencedSection ? referencedSection.title : term.sectionRef} (in ${sourceChapter.title})`;
          }
        }

        items.push({
          id: `glossary-${glossaryChapter.chapterSlug}-${encodeURIComponent(term.term)}`,
          type: "glossary",
          title: term.term,
          href: href,
          context: context,
        });
      });
    });
    return items;
  });

  // filteredResults must be defined before clearButtonTabindex
  const filteredResults = $derived.by((): SearchableItem[] => {
    if (!searchQuery.trim()) {
      return [];
    }
    const query = searchQuery.toLowerCase().trim();
    return searchableItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.context?.toLowerCase().includes(query)
      )
      .slice(0, 10); // Limit to 10 results
  });

  // Derived state for clear button's tabindex - MOVED AFTER filteredResults
  const clearButtonTabindex = $derived(
    isFocused && filteredResults.length > 0 ? -1 : 0
  );

  $effect(() => {
    if (filteredResults.length === 0 || !isFocused) {
      if (activeIndex !== -1) {
        console.log("Resetting activeIndex due to no results or not focused.");
        activeIndex = -1;
      }
    }
    // If filteredResults shrinks and activeIndex is now out of bounds, reset it.
    else if (activeIndex >= filteredResults.length) {
      console.log(
        `Resetting activeIndex (${activeIndex}) because it's out of bounds for filteredResults length (${filteredResults.length}).`
      );
      activeIndex = -1; // Or perhaps filteredResults.length - 1 if we want to keep focus on the last item
    }
  });

  // Effect to scroll active item into view
  $effect(() => {
    const currentActiveIndex = activeIndex;
    // console.log(`Scroll effect triggered. activeIndex: ${currentActiveIndex}`);

    if (currentActiveIndex > -1 && itemElements[currentActiveIndex]) {
      // <<< ADDED CHECK for itemElements[currentActiveIndex] here
      const targetElement = itemElements[currentActiveIndex];
      // console.log(`Target element for scroll (itemElements[${currentActiveIndex}]):`, targetElement);

      // Check if it's a valid HTMLElement before calling tick
      if (targetElement instanceof HTMLElement) {
        tick().then(() => {
          // console.log(`Inside tick for scroll. currentActiveIndex: ${currentActiveIndex}, activeIndex now: ${activeIndex}`);
          // console.log(`Filtered results length: ${filteredResults.length}`);

          // Re-check targetElement and activeIndex after tick as state might have changed
          if (
            activeIndex === currentActiveIndex &&
            itemElements[currentActiveIndex] &&
            itemElements[currentActiveIndex] instanceof HTMLElement
          ) {
            // console.log("Attempting to scroll element into view.");
            itemElements[currentActiveIndex].scrollIntoView({
              block: "nearest",
            });
          } else {
            // console.log("Scroll skipped post-tick due to conditions not met.");
          }
        });
      } else {
        // console.log("Scroll skipped: itemElements[currentActiveIndex] is not an HTMLElement.");
      }
    }
  });

  function handleFocus() {
    isFocused = true;
  }

  function handleBlur(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (
      (listElement && listElement.contains(relatedTarget)) ||
      (event.currentTarget &&
        (event.currentTarget as HTMLElement)
          .querySelector(".clear-button")
          ?.contains(relatedTarget))
    ) {
      return;
    }

    setTimeout(() => {
      const activeElement = document.activeElement;
      const wrapper = inputElement?.closest(".search-component-wrapper");
      if (wrapper && !wrapper.contains(activeElement)) {
        isFocused = false;
        activeIndex = -1;
      }
    }, 150);
  }

  function handleResultClick(result: SearchableItem) {
    goto(result.href);
    searchQuery = "";
    isFocused = false;
    activeIndex = -1;
    inputElement?.blur();
  }

  function clearSearch() {
    searchQuery = "";
    activeIndex = -1;
    inputElement?.focus();
  }

  function closeAndClearResults() {
    searchQuery = "";
    isFocused = false;
    activeIndex = -1;
  }

  function handleInputKeyDown(event: KeyboardEvent) {
    const { key } = event;
    const resultsCount = filteredResults.length;

    if (!resultsCount && key !== "Escape") return;

    switch (key) {
      case "ArrowDown":
        event.preventDefault();
        if (resultsCount > 0) {
          activeIndex = (activeIndex + 1) % resultsCount;
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (resultsCount > 0) {
          activeIndex = (activeIndex - 1 + resultsCount) % resultsCount;
        }
        break;
      case "Enter":
        event.preventDefault();
        if (activeIndex > -1 && filteredResults[activeIndex]) {
          handleResultClick(filteredResults[activeIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        closeAndClearResults();
        break;
      case "Tab":
        if (isFocused && filteredResults.length > 0) {
          isFocused = false;
          activeIndex = -1;
        }
        break;
    }
  }

  const iconSize = 18;
</script>

<div class="search-component-wrapper">
  <div class="search-input-container">
    <div class="search-icon-area">
      <Search size={iconSize} color="var(--color-text-primary)" opacity="0.6" />
    </div>
    <input
      bind:this={inputElement}
      type="text"
      placeholder="Search textbook..."
      bind:value={searchQuery}
      onfocus={handleFocus}
      onblur={handleBlur}
      onkeydown={handleInputKeyDown}
      aria-label="Search textbook"
      autocomplete="off"
      role="combobox"
      aria-expanded={isFocused && filteredResults.length > 0}
      aria-controls="search-results-listbox"
      aria-activedescendant={activeIndex > -1 && itemElements[activeIndex]
        ? `result-item-${activeIndex}`
        : undefined}
    />
    {#if searchQuery}
      <button
        class="clear-button"
        onclick={clearSearch}
        aria-label="Clear search"
        tabindex={clearButtonTabindex}
      >
        <ClearIcon size={iconSize * 0.9} />
      </button>
    {/if}
  </div>

  {#if isFocused && filteredResults.length > 0}
    <ul
      class="search-results-list"
      role="listbox"
      id="search-results-listbox"
      bind:this={listElement}
    >
      {#each filteredResults as result, i (result.id)}
        <li
          bind:this={itemElements[i]}
          id="result-item-{i}"
          role="option"
          aria-selected={i === activeIndex}
          class="result-item"
          class:is-active-descendant={i === activeIndex}
          onclick={() => handleResultClick(result)}
        >
          <div class="result-title">{result.title}</div>
          {#if result.context}
            <div class="result-context">{result.context}</div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="scss">
  .search-component-wrapper {
    position: relative;
    width: 100%;
  }

  .search-input-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-s);
    background-color: var(--color-surface);
    margin-block: var(--space-2xs);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:focus-within {
      outline: 2px solid var(--color-accent);
      outline-offset: -1px;
      border-color: var(--color-accent);
    }

    input {
      width: 100%;
      flex-grow: 1;
      padding: var(--space-xs) 0;
      padding-right: calc(var(--space-xs) + #{iconSize}px + var(--space-3xs));
      border-radius: 0;
      border: none;
      background-color: transparent;
      color: var(--color-text-primary);
      font-size: var(--step--1);
      line-height: 1.5;
      outline: none;
    }
  }

  .search-icon-area {
    padding: 0 var(--space-3xs) 0 var(--space-xs);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clear-button {
    position: absolute;
    right: var(--space-3xs);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 0 var(--space-xs);

    &:hover {
      color: var(--color-text-primary);
    }
  }

  .search-results-list {
    position: absolute;
    top: calc(100% + var(--space-3xs));
    left: 0;
    right: 0;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-s);
    list-style: none;
    margin: 0;
    max-height: 400px;
    overflow-y: auto;
    z-index: 10;
    box-shadow: var(--shadow-md);

    li {
      padding: var(--space-xs);
      cursor: pointer;
      border-radius: var(--radius-xs);

      &:hover,
      &.is-active-descendant {
        background-color: var(--color-surface-hover);
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }
  }

  .result-item {
    margin: var(--space-xs);
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
    margin-left: var(--space-s);
  }
</style>

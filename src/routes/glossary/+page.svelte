<script lang="ts">
  import glossaryData from '$lib/data/glossary-data';
  import type { GlossaryData } from '$lib/data/glossary-data'; //
  import Dropdown from '$lib/components/Dropdown.svelte'; // Import the Dropdown component

  let searchTerm = ''; // Reactive variable for search term
  let selectedChapterFilter = null; // Reactive variable to track selected chapter filter
  let selectedSortMethod = 'chronological'; // Reactive variable for sort method, default to 'chronological'

  // Flatten the glossary terms from all chapters into a single array for easier filtering
  $: allGlossaryTerms = glossaryData.reduce((terms, chapter) => {
    return [...terms, ...chapter.glossaryTerms];
  }, []);

  $: filteredGlossaryTerms = allGlossaryTerms.filter(entry => {
    const termLower = entry.term.toLowerCase();
    const definitionLower = entry.definition.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = termLower.includes(searchLower) || definitionLower.includes(searchLower);
    return matchesSearch; // Only search filter here, chapter filter in chapter loop
  });

  function setChapterFilter(chapterSlug) {
    selectedChapterFilter = chapterSlug; // Update selected chapter filter
  }

  function clearChapterFilter() {
    selectedChapterFilter = null; // Clear chapter filter
  }

  function handleSortMethodChange(newSortMethod) { // Function to handle dropdown change event
    console.log('Sort method changed to:', newSortMethod); // DEBUG LOG
    selectedSortMethod = newSortMethod;
  }

  function sortByAlphabetical(terms) {
    // Create a copy before sorting to avoid mutating the original array reactively
    const sortedTerms = [...terms].sort((a, b) => a.term.localeCompare(b.term));
    // console.log('Terms after alphabetical sort:', sortedTerms); // DEBUG LOG (moved inside the loop for clarity)
    return sortedTerms;
  }

  function sortByChronological(terms) {
    // console.log('Terms returned chronologically:', terms); // DEBUG LOG (can be noisy, uncomment if needed)
    return terms; // No sorting needed, return original order
  }

  const sortOptions = [ // Define sort options for the Dropdown component
    { value: 'chronological', label: 'Chronological' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];
</script>

<div class="glossary-page">
  <h1>Glossary of Key Terms</h1>
  <div class="glossary-search-bar">
    <input
      type="text"
      placeholder="Search key terms..."
      bind:value={searchTerm}
    />
  </div>
<div>
  <p>Filter by Chapter:</p>
    <div class="chapter-filter-buttons">  <!-- Chapter Filter Buttons Container -->
      <button
        class="chapter-filter-button"
        class:active={selectedChapterFilter === null}
        on:click={clearChapterFilter}
      >
        All Chapters
      </button>
      {#each glossaryData as chapter}
        <button
          class="chapter-filter-button"
          class:active={selectedChapterFilter === chapter.chapterSlug}
          on:click={() => setChapterFilter(chapter.chapterSlug)}
        >
          {chapter.chapterTitle}
        </button>
      {/each}
    </div>
</div>

  <div class="sort-dropdown-container">  <!-- Container for the dropdown -->
    <Dropdown
      options={sortOptions}
      selectedValue={selectedSortMethod}
      on:change={(event) => handleSortMethodChange(event.detail)}
      label="Sort By:"
    />
  </div>

  <div class="glossary-chapters">  <!-- Container for glossary chapters -->
    {#each glossaryData as chapter}
      {#if selectedChapterFilter === null || selectedChapterFilter === chapter.chapterSlug}  <!-- Conditionally render chapter -->
        <div class="glossary-chapter">
          <h2 class="chapter-title">{chapter.chapterTitle}</h2>  <!-- Display chapter title -->
          <ul class="glossary-list">
            {#each (() => {
              // 1. Get chapter-specific terms from filteredGlossaryTerms
              let chapterTerms = filteredGlossaryTerms.filter(term => {
                const currentChapter = glossaryData.find(c => c.chapterSlug === chapter.chapterSlug);
                return currentChapter?.glossaryTerms.includes(term);
              });

              console.log(`[${chapter.chapterSlug}] Terms before sort (${selectedSortMethod}):`, [...chapterTerms]); // DEBUG LOG: Log before sorting (use spread to avoid logging proxy object)

              // 2. Apply sorting based on selectedSortMethod
              let sortedChapterTerms;
              if (selectedSortMethod === 'alphabetical') {
                sortedChapterTerms = sortByAlphabetical(chapterTerms);
                console.log(`[${chapter.chapterSlug}] Terms AFTER alphabetical sort:`, [...sortedChapterTerms]); // DEBUG LOG: Log after sorting
              } else {
                sortedChapterTerms = sortByChronological(chapterTerms);
                // Optional: Log chronological result if needed
                // console.log(`[${chapter.chapterSlug}] Terms returned chronologically:`, [...sortedChapterTerms]);
              }
              return sortedChapterTerms; // Return the processed terms
            })() as entry (entry.term)}
              <li class="glossary-item">
                {#if entry.sectionRef}
                  <a href={`/chapter/${chapter.chapterSlug}#${entry.sectionRef}`} class="glossary-term-link"> <!-- Construct chapter and section link -->
                    <strong class="glossary-term">{entry.term}</strong >
                  </a>
                {:else}
                  <strong class="glossary-term">{entry.term}</strong >
                {/if}
                <p class="glossary-definition">{entry.definition}</p >
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style lang="scss">
  .glossary-page {
    padding: var(--space-l);
    max-width: 960px;
    margin: 0 auto;
    position: relative;
  }

  h1 {
    margin-bottom: var(--space-l);
  }

  .glossary-search-bar {
    position: sticky;
    top: 0;
    background-color: var(--color-background);
    padding: var(--space-m) 0;
    margin-bottom: var(--space-l);
    z-index: 100;
  }

  .glossary-search-bar input {
    width: 100%;
    padding: var(--space-s);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    font-size: 1rem;
  }

  /* Chapter Filter Buttons Styles */
  .chapter-filter-buttons {
    display: flex;
    padding: var(--space-s);
    gap: var(--space-s);
    margin-bottom: var(--space-l);
    overflow-x: auto; /* Enable horizontal scrolling if many buttons */
  }

  .chapter-filter-button {
    padding: var(--space-s) var(--space-m);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background-color: var(--bg-secondary);
    color: var(--color-text-primary);
    cursor: pointer;
    white-space: nowrap; /* Prevent text wrapping */
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

    &:hover {
      background-color: var(--bg-hover);
    }

    &.active {
      background-color: var(--color-accent);
      color: var(--color-text-on-dark);
      border-color: var(--color-accent);
    }
  }

  /* Sort Buttons Styles */
  .sort-dropdown-container {
    margin-bottom: var(--space-l); /* Add some space below the dropdown */
  }

  .glossary-chapters { /* Styles for the chapter container */
    margin-top: var(--space-l);
  }

  .glossary-chapter { /* Styles for each chapter section */
    margin-bottom: var(--space-xl); /* Space between chapters */
  }

  .chapter-title { /* Styles for chapter titles */
    margin-bottom: var(--space-m);
    color: var(--color-primary); /* Example: use primary color for chapter titles */
  }

  .glossary-list {
    list-style: none;
    padding: 0;
    margin: var(--space-m);
  }

  .glossary-item {
    margin-bottom: var(--space-m);
    padding-bottom: var(--space-m);
    border-bottom: 1px solid var(--color-border);
  }

  .glossary-term {
    font-weight: bold;
    display: block;
    margin-bottom: var(--space-2xs);
    color: var(--color-accent);
  }

  .glossary-term-link {
    text-decoration: none;
    color: var(--color-accent);

    &:hover {
      text-decoration: underline;
    }
  }

  .glossary-definition {
    margin-top: 0;
  }

  dt {
    font-weight: bold;
    margin-top: var(--space-s);
    color: var(--color-text-primary);
  }

  .glossary-item {
    padding: var(--space-xs) var(--space-s);
    border-radius: var(--radius-sm);
    color: var(--color-text-on-dark);
    font-weight: 600;
    margin-right: var(--space-s);
  }
</style>
<script lang="ts">
  import {
    getSearchableData,
    filterSearchableData,
    type SearchableItem,
  } from "$lib/searchLogic";
  import ContentCard from "$lib/components/ContentCard.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let { data } = $props(); // From load function in +page.ts

  let allSearchableItems = $state<SearchableItem[]>([]);
  let filteredResults = $state<SearchableItem[]>([]);

  // Use a local reactive variable for the search query, initialized from page data
  // This allows the input on this page to modify the query reactively
  let searchQuery = $state(data.query || "");

  onMount(() => {
    allSearchableItems = getSearchableData();
  });

  // Effect to update results when searchQuery changes or allSearchableItems are loaded
  $effect(() => {
    if (searchQuery.trim() && allSearchableItems.length > 0) {
      filteredResults = filterSearchableData(searchQuery, allSearchableItems);
    } else {
      filteredResults = [];
    }
  });

  // Effect to update document title based on search query
  $effect(() => {
    document.title = searchQuery ? `Search: ${searchQuery}` : "Search Results";
  });

  function handleItemClick(item: SearchableItem) {
    goto(item.href);
  }

  // Function to update the URL and searchQuery when the on-page search input changes
  // This is for if the user modifies the search on the results page itself.
  function handleSearchInputChange(event: Event) {
    const newQuery = (event.target as HTMLInputElement).value;
    searchQuery = newQuery;
    // Optionally update URL query parameter reactively as user types
    // goto(`/search?q=${encodeURIComponent(newQuery)}`, { replaceState: true, keepFocus: true });
  }

  function handleSearchSubmit(event: Event) {
    event.preventDefault(); // Prevent default form submission
    // If user presses enter in the search input on this page
    goto(`/search?q=${encodeURIComponent(searchQuery)}`, {
      replaceState: true,
    });
  }
</script>

<div class="search-results-page u-container">
  <ContentCard layoutWidth="full">
    <h1>Search VistaKine</h1>
    <form onsubmit={handleSearchSubmit}>
      <input
        type="search"
        value={searchQuery}
        oninput={handleSearchInputChange}
        placeholder="Search again..."
        aria-label="Search query"
        class="search-input-on-page"
      />
    </form>

    {#if searchQuery.trim()}
      {#if filteredResults.length > 0}
        <p class="results-count">
          Showing {filteredResults.length} results for:
          <strong>{searchQuery}</strong>
        </p>
        <ul class="results-list">
          {#each filteredResults as item (item.id)}
            <li
              class="result-item-on-page"
              onclick={() => handleItemClick(item)}
              onkeypress={(e) => e.key === "Enter" && handleItemClick(item)}
              tabindex="0"
            >
              <a
                href={item.href}
                class="result-link"
                onclick={(e) => e.preventDefault()}
              >
                <!-- Prevent default link navigation, handle via JS -->
                <span class="result-title">{item.title}</span>
                {#if item.context}
                  <span class="result-context">{item.context}</span>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="no-results-message">
          Sorry, your search for "<strong>{searchQuery}</strong>" did not yield
          any results.
        </p>
      {/if}
    {:else}
      <p class="prompt-message">Please enter a search term to see results.</p>
    {/if}
  </ContentCard>
</div>

<style lang="scss">
  @use "$lib/styles/variables" as theme;

  .search-results-page {
    padding-block: var(--space-l) var(--space-xl);
    min-height: 70vh; // Ensure it takes some space even if no results
  }

  .search-input-on-page {
    width: 100%;
    padding: var(--space-s) var(--space-m);
    font-size: var(--step-0);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-l);
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    box-sizing: border-box;

    &:focus {
      outline: 2px solid var(--color-accent);
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.2);
    }
  }

  .results-count {
    font-size: var(--step--1);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-m);
  }

  .results-list {
    list-style: none;
    padding: 0;
    margin-top: var(--space-m);
  }

  .result-item-on-page {
    margin-bottom: var(--space-m);
    padding: var(--space-m);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface-alt);
    transition:
      background-color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
    cursor: pointer;

    &:hover,
    &:focus-within {
      background-color: var(--color-surface-hover);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }

  .result-link {
    text-decoration: none;
    display: block;
    color: inherit;
  }

  .result-title {
    font-weight: 600;
    font-size: var(--step-0);
    color: var(--color-accent);
    margin-bottom: var(--space-3xs);
  }

  .result-context {
    font-size: var(--step--1);
    color: var(--color-text-secondary);
  }

  .no-results-message,
  .prompt-message {
    margin-top: var(--space-l);
    font-size: var(--step-0);
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    box-sizing: border-box;

    &:focus {
      outline: 2px solid var(--color-accent);
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.2);
    }
  }
</style>

  }
</style>

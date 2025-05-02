<script lang="ts">
  let { placeholder = "Search..." } = $props();
  let query = $state("");

  function handleSearch() {
    // Placeholder for actual search logic
    // For now, just log the query or show an alert
    if (query.trim()) {
      console.log(`Search submitted for: ${query}`);
      alert(
        `Search functionality not yet implemented. You searched for: "${query}"`
      );
      // Future: Navigate to search results page or trigger search API
    } else {
      alert("Please enter a search term.");
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }
</script>

<div class="search-bar-container">
  <input
    type="text"
    bind:value={query}
    {placeholder}
    onkeydown={handleKeydown}
    aria-label="Search VistaKine"
    class="search-input"
  />
  <button
    onclick={handleSearch}
    class="search-button"
    aria-label="Submit search"
  >
    <!-- Basic Search Icon (SVG or Icon Font recommended for better visuals) -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1em"
      height="1em"
    >
      <path
        d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      />
    </svg>
  </button>
</div>

<style lang="scss">
  @use "sass:color";

  .search-bar-container {
    display: flex;
    align-items: center;
    width: 100%;
    margin-block: var(--space-m) var(--space-l);
    border: 1px solid var(--color-border);
    background-color: var(--color-surface);
    border-radius: 25px; // Pill shape
    overflow: hidden; // Keep button contained
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;

    &:focus-within {
      box-shadow: 0 4px 8px rgba(var(--color-accent-rgb), 0.3);
      border-color: var(--color-accent);
    }
  }

  .search-input {
    flex-grow: 1;
    padding: var(--space-m) var(--space-s);
    border: none;
    outline: none;
    font-size: var(--step-0);
    background-color: transparent;
    color: var(--color-text-primary);

    &::placeholder {
      color: var(--color-text-secondary);
      opacity: 0.7;
    }
  }

  .search-button {
    background-color: var(--color-accent);
    color: white;
    border: none;
    border-radius: 80px;
    padding: var(--space-xs);
    margin-right: var(--space-s);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;

    svg {
      width: 1.2em;
      height: 1.2em;
    }

    &:hover {
      background-color: color.adjust(#3b82f6, $lightness: -10%);
    }

    &:focus {
      outline: 2px solid var(--color-accent);
      outline-offset: -2px;
    }
  }
</style>

<script>
  export let options; // Array of options (e.g., [{value: 'alphabetical', label: 'Alphabetical'}, {value: 'chronological', label: 'Chronological'}])
  export let selectedValue;
  export let label = 'Sort By'; // Optional label for the dropdown

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleChange(event) {
    selectedValue = event.target.value;
    dispatch('change', selectedValue); // Dispatch 'change' event with the selected value
  }
</script>

<div class="dropdown">
  {#if label}
    <label for="sort-dropdown" class="dropdown-label">{label}</label>
  {/if}
  <select
    id="sort-dropdown"
    class="dropdown-select"
    value={selectedValue}
    on:change={handleChange}
  >
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
</div>

<style lang="scss">
  .dropdown {
    display: inline-flex;
    align-items: center;
    gap: var(--space-s);
  }

  .dropdown-label {
    font-weight: bold;
  }

  .dropdown-select {
    padding: var(--space-s);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background-color: var(--bg-secondary);
    color: var(--text-color);
    font-size: 1rem;
    appearance: none; /* Remove default dropdown arrow */
    -webkit-appearance: none; /* For Safari */
    -moz-appearance: none; /* For Firefox */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23{$text-color}' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); /* Custom arrow */
    background-repeat: no-repeat;
    background-position-x: calc(100% - 0.5rem);
    background-position-y: 50%;
    padding-right: var(--space-l); /* Make space for the arrow */

    &:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px var(--color-accent-light); /* Optional: subtle focus highlight */
    }
  }
</style>

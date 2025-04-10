<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  let { label = 'Sort By', options, selectedValue = $bindable('') }: { label?: string, options: { value: string; label: string }[], selectedValue?: string } = $props();

  const dispatch = createEventDispatcher();

  function onChange(event: any) {
    selectedValue = event.target.value;
    dispatch('change', selectedValue);
  }
</script>

<div class="dropdown">
  {#if label}
    <label for="sort-dropdown" class="dropdown-label">{label}</label>
  {/if}
  <select
    id="sort-dropdown"
    class="dropdown-select"
    bind:value={selectedValue}
    on:change={onChange}
  >
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
</div>

<style lang="scss">
  @use 'sass:string';
  @use '$lib/styles/variables' as vars;

  .dropdown {
    display: inline-flex;
    align-items: center;
    gap: var(--space-s);
  }

  .dropdown-label {
    font-weight: bold;
  }

  .dropdown-select {
    padding: 0.5rem 2.5rem 0.5rem 0.75rem; /* Adjust padding for arrow */
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    font-size: 1rem;
    appearance: none; /* Remove default dropdown arrow */
    -webkit-appearance: none; /* For Safari */
    -moz-appearance: none; /* For Firefox */
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23{string.slice(vars.$color-text-primary, 2)}' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); /* Custom arrow */
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1em;
    transition: border-color var(--transition-fast);

    &:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px rgba(vars.$color-accent-light, 0.3);
    }

    &:hover {
      border-color: var(--color-accent-light);
    }

    option {
      background-color: var(--color-surface);
      color: var(--color-text-primary);
    }
  }
</style>

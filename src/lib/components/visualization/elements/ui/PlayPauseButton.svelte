<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Play, Pause } from "lucide-svelte";

  // Use Svelte 5 runes for props and state if applicable
  // let { playing = $bindable(false), disabled = false } = $props();

  // Using Svelte 4 style for broader compatibility example here
  export let playing: boolean = false;
  export let disabled: boolean = false;
  const dispatch = createEventDispatcher();

  function handleClick(event: MouseEvent) {
    if (!disabled) {
      dispatch("click", event);
      // If not using bind:playing, you might toggle state internally or expect parent to handle
      // playing = !playing; // Example internal toggle
    }
  }

  // Removed iconName logic
  $: label = playing ? "Pause animation" : "Play animation";
</script>

<button
  class="ui-button"
  class:playing
  class:disabled
  on:click={handleClick}
  aria-label={label}
  aria-pressed={playing}
  title={label}
  {disabled}
>
  {#if playing}
    <Pause size={24} />
  {:else}
    <Play size={24} />
  {/if}
</button>

<style lang="scss">
  @use "$lib/styles/variables" as vars; // Keep variables import if needed for transitions etc.

  .ui-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-s); // Match padding
    border-radius: var(--radius-round); // Match radius (round)
    cursor: pointer;
    transition:
      transform 0.1s ease,
      background-color 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease; // Match transition
    border: 1px solid var(--color-accent); // Match border
    aspect-ratio: 1 / 1;
    width: 44px; // Keep fixed size or adjust as needed
    height: 44px;
    color: var(--color-accent); // Match text color
    background-color: var(--color-surface); // Match background
    box-shadow: var(--shadow-sm); // Match shadow

    &:hover:not(.disabled) {
      background-color: var(--color-accent-hover-bg);
      color: var(--color-accent-light);
      transform: translateY(-1px);
      // Optional: border change on hover
      // border-color: var(--color-accent-light);
    }

    &:active:not(.disabled) {
      background-color: var(--color-accent-active-bg);
      transform: translateY(0);
      // color: var(--color-accent-light); // Optionally change color on active
    }

    &.playing {
      // Style for the playing state, e.g., use active state colors
      background-color: var(--color-accent-active-bg);
      color: var(--color-accent-light); // Ensure contrast
      // border-color: var(--color-accent-light); // Optional border change
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
      // Consistent disabled look
      background-color: var(--color-surface-secondary); // Example disabled bg
      border-color: var(--color-border);
      color: var(--color-text-disabled);
      box-shadow: none;
      transform: none;
    }

    :global(svg) {
      display: block; // Prevents extra space below icon
    }
  }
</style>

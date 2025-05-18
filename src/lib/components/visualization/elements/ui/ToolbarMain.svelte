<script lang="ts">
  import ControlModeToggle from "./ControlModeToggle.svelte";
  import { Move } from "lucide-svelte"; // Import the icon
  import { isFBDMenuOpen } from "$lib/stores/uiStores"; // Import the store

  // Props for customization (optional, but good practice)
  export let backgroundColor: string = "var(--color-surface)"; // Default background
  export let textColor: string = "var(--color-text-primary)"; // Default text color
  export let padding: string = "var(--space-2xs)"; // Default padding, using Utopia fluid spacing
  export let gap: string = "var(--space-s)"; // Default gap between items
  export let borderRadius: string = "var(--radius-sm)"; // Default border radius
  export let boxShadow: string = "var(--shadow-sm)"; // Default box shadow
  export let width: string = "fit-content";
  export let selectedMode: "drag" | "translate" = "drag"; // Default - Exported prop

  function handleModeChange(
    event: CustomEvent<{ mode: "drag" | "translate" }>
  ) {
    selectedMode = event.detail.mode; // Update the bound prop directly
  }
</script>

<div
  class="toolbar-main"
  style:background-color={backgroundColor}
  style:color={textColor}
  style:padding
  style:gap
  style:border-radius={borderRadius}
  style:box-shadow={boxShadow}
  style:width
>
  <ControlModeToggle on:modechange={handleModeChange} />

  <!-- FBD Menu Toggle Button -->
  <button
    class="toolbar-button fbd-toggle-button"
    on:click={() => isFBDMenuOpen.update((open) => !open)}
    title="Free Body Diagram Controls"
  >
    <Move size={32} />
  </button>

  <!-- Placeholder slots -->
  <!-- <div class="placeholder-slot">1</div>
	<div class="placeholder-slot">2</div> -->
  <div class="placeholder-slot">3</div>
  <div class="placeholder-slot">4</div>
</div>

<style>
  .toolbar-main {
    display: flex;
    align-items: center; /* Vertically center items */
    z-index: 1000; /* Ensure it's above other content */
    border: 1px solid var(--color-border, #ccc);
    box-shadow: var(--shadow-sm);
    border-radius: var(--radius-lg);

    /* Glassmorphism */
    backdrop-filter: var(--glass-backdrop-blur, blur(8px));
    -webkit-backdrop-filter: var(
      --glass-backdrop-blur,
      blur(8px)
    ); /* Safari support */
    /* border: var(--glass-border, 1px solid rgba(255, 255, 255, 0.15)); */
  }

  /* Basic styling for placeholder slots */
  .placeholder-slot {
    width: 30px;
    height: 30px;
    border: 1px dashed var(--color-border, #ccc);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8em;
    color: var(--color-text-secondary, #888);
  }

  /* Style for the toolbar buttons */
  .toolbar-button {
    background: none;
    border: none;
    padding: var(--space-3xs); /* Small padding */
    margin: 0;
    color: var(--color-accent); /* Inherit text color from toolbar */
    cursor: pointer;
    display: inline-flex; /* Align icon nicely */
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: background-color 0.2s ease;
  }

  .toolbar-button:hover {
    background-color: var(--color-accent-hover-bg);
    color: var(--color-accent-light);
  }

  .fbd-toggle-button:focus {
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 1px;
  }

  .button-label {
    font-size: 0.75rem;
    color: var(--color-text-secondary, #888);
    margin-top: 2px;
    text-align: center;
  }
</style>

<script lang="ts">
  import {
    fbdVisibilityStore,
    type FBDVisibilityState,
  } from "$lib/stores/fbdStores";
  import { get } from "svelte/store"; // Import get
  import { ChevronDown } from "lucide-svelte"; // Import ChevronDown
  import { slide } from "svelte/transition"; // Import slide transition

  // --- Component State ---
  let isCollapsed = $state(false); // State for collapsing, initially expanded

  // --- Unique ID for ARIA ---
  const contentId = `fbd-menu-content-${Math.random().toString(36).substring(2, 9)}`;
  const headerId = `fbd-menu-header-${Math.random().toString(36).substring(2, 9)}`;

  // Local reactive variables bound to checkboxes
  let velocityVisible = $state($fbdVisibilityStore.velocity);
  let weightVisible = $state($fbdVisibilityStore.weight);
  let accelerationVisible = $state($fbdVisibilityStore.acceleration);
  let netForceVisible = $state($fbdVisibilityStore.netForce);
  let normalForceVisible = $state($fbdVisibilityStore.normalForce);
  let frictionVisible = $state($fbdVisibilityStore.friction);
  let axesVisible = $state($fbdVisibilityStore.axes);

  // Effect to update the store when local checkbox states change
  $effect(() => {
    fbdVisibilityStore.update((current: FBDVisibilityState) => ({
      ...current,
      velocity: velocityVisible,
      weight: weightVisible,
      acceleration: accelerationVisible,
      netForce: netForceVisible,
      normalForce: normalForceVisible,
      friction: frictionVisible,
      axes: axesVisible,
    }));
  });

  // Effect to update local checkbox states if the store changes elsewhere
  $effect(() => {
    const storeState = $fbdVisibilityStore;
    velocityVisible = storeState.velocity;
    weightVisible = storeState.weight;
    accelerationVisible = storeState.acceleration;
    netForceVisible = storeState.netForce;
    normalForceVisible = storeState.normalForce;
    frictionVisible = storeState.friction;
    axesVisible = storeState.axes;
  });

  // Function to toggle all visibility states
  function toggleAll() {
    const currentVisibility = get(fbdVisibilityStore);
    // Check if *any* vector is currently visible
    const anyVisible = Object.values(currentVisibility).some(
      (visible) => visible
    );
    const newState = !anyVisible; // If any are visible, new state is false (hide all), otherwise true (show all)

    fbdVisibilityStore.update((current) => {
      const updated: FBDVisibilityState = { ...current };
      for (const key in updated) {
        updated[key as keyof FBDVisibilityState] = newState;
      }
      return updated;
    });
  }
</script>

<div class="fbd-menu-panel">
  <!-- Collapsible Header -->
  <div
    class="panel-header"
    id={headerId}
    role="button"
    tabindex="0"
    aria-expanded={!isCollapsed}
    aria-controls={contentId}
    on:click={() => (isCollapsed = !isCollapsed)}
    on:keydown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        isCollapsed = !isCollapsed;
      }
    }}
  >
    <h4>FBD Controls</h4>
    <div class="chevron" class:collapsed={isCollapsed}>
      <ChevronDown size={20} />
    </div>
  </div>

  <!-- Collapsible Content -->
  {#if !isCollapsed}
    <div
      class="panel-content"
      id={contentId}
      role="region"
      aria-labelledby={headerId}
      transition:slide={{ duration: 250 }}
    >
      <!-- Toggle All Button -->
      <button on:click={toggleAll} class="toggle-all-button">
        Toggle All
      </button>
      <hr class="divider" />
      <label>
        <input type="checkbox" bind:checked={velocityVisible} />
        Show Velocity (v)
      </label>
      <br />
      <label>
        <input type="checkbox" bind:checked={weightVisible} />
        Show Weight (W)
      </label>
      <br />
      <label>
        <input type="checkbox" bind:checked={accelerationVisible} />
        Show Acceleration (a)
      </label>
      <br />
      <label>
        <input type="checkbox" bind:checked={netForceVisible} />
        Show Net Force (ΣF)
      </label>
      <br />
      <label>
        <input type="checkbox" bind:checked={normalForceVisible} />
        Show Normal Force (N)
      </label>
      <br />
      <label>
        <input type="checkbox" bind:checked={frictionVisible} />
        Show Friction (Ff)
      </label>
      <hr class="divider" />
      <label>
        <input type="checkbox" bind:checked={axesVisible} />
        Show Axes (XYZ)
      </label>
    </div>
  {/if}
</div>

<style lang="scss">
  .fbd-menu-panel {
    display: flex;
    width: 230px; // Adjusted width
    flex-direction: column;
    max-height: 275px;
    overflow-y: scroll;
    gap: 0;
    padding: 0;
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    pointer-events: auto;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    box-shadow: var(--shadow-md); // Added shadow
    border: 1px solid var(--color-border-light); // Added border
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xs) var(--space-s); // Adjusted padding
    cursor: pointer;
    border-bottom: 1px solid var(--color-border-light);

    &:hover {
      background-color: var(--color-surface-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
  }

  .panel-header h4 {
    margin: 0;
    color: var(--color-text-secondary);
    font-weight: 600;
    font-size: var(--step-0); // Standardized font size
  }

  .chevron {
    transition: transform 0.25s ease-out;
    color: var(--color-text-secondary); // Ensure chevron has color
  }
  .chevron.collapsed {
    transform: rotate(-90deg);
  }

  .panel-content {
    padding: var(--space-s); // Consistent padding
    overflow: scroll; // For slide transition
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs); // Gap between items in content
  }

  label {
    display: flex; // Changed to flex for alignment
    align-items: center; // Align checkbox and text
    gap: var(--space-2xs); // Gap between checkbox and text
    // margin-bottom: 5px; // Replaced by gap in .panel-content
    font-size: var(--step--1); // Standardized font size
    color: var(--color-text-primary); // Ensure text color
  }

  input[type="checkbox"] {
    cursor: pointer;
    accent-color: var(--color-accent); // Theme checkbox color
    transform: scale(0.9); // Slightly smaller checkboxes
  }

  .toggle-all-button {
    width: 100%;
    padding: var(--space-3xs);
    // margin-bottom: var(--space-xs); // Handled by gap in panel-content
    border: 1px solid var(--color-border);
    background-color: var(--subtle-bg);
    color: var(--color-text-primary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease; // Added color transition
    font-size: var(--step--1);
  }
  .toggle-all-button:hover {
    background-color: var(--color-accent-hover-bg);
    color: var(--color-accent-light);
  }
  .divider {
    border: none;
    border-top: 1px solid var(--color-border-light); // Adjusted color
    margin-top: var(--space-xs); // Adjusted margin
    margin-bottom: var(--space-xs); // Adjusted margin
  }

  // Removed old h4 styling, now part of .panel-header h4
  // Removed br tags effect by using flex and gap in label and panel-content
</style>

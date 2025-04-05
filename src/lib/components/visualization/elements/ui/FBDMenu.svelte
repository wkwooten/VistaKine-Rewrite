<script lang="ts">
  import { fbdVisibilityStore, type FBDVisibilityState } from '$lib/stores/fbdStores';
  import { get } from 'svelte/store'; // Import get

  // Local reactive variables bound to checkboxes
  // We initialize them from the store's current value
  // We use the update method for store changes
  let velocityVisible = $fbdVisibilityStore.velocity;
  let weightVisible = $fbdVisibilityStore.weight;
  let accelerationVisible = $fbdVisibilityStore.acceleration;
  let netForceVisible = $fbdVisibilityStore.netForce;
  let normalForceVisible = $fbdVisibilityStore.normalForce;
  let frictionVisible = $fbdVisibilityStore.friction;
  let axesVisible = $fbdVisibilityStore.axes;

  // Update the store when checkboxes change
  $: fbdVisibilityStore.update((current: FBDVisibilityState) => ({
    ...current,
    velocity: velocityVisible,
    weight: weightVisible,
    acceleration: accelerationVisible,
    netForce: netForceVisible,
    normalForce: normalForceVisible,
    friction: frictionVisible,
    axes: axesVisible
  }));

  // Keep the store value synced with local state if it changes elsewhere (optional but safer)
  $: {
    velocityVisible = $fbdVisibilityStore.velocity;
    weightVisible = $fbdVisibilityStore.weight;
    accelerationVisible = $fbdVisibilityStore.acceleration;
    netForceVisible = $fbdVisibilityStore.netForce;
    normalForceVisible = $fbdVisibilityStore.normalForce;
    frictionVisible = $fbdVisibilityStore.friction;
    axesVisible = $fbdVisibilityStore.axes;
  }

  // Function to toggle all visibility states
  function toggleAll() {
    const currentVisibility = get(fbdVisibilityStore);
    // Check if *any* vector is currently visible
    const anyVisible = Object.values(currentVisibility).some(visible => visible);
    const newState = !anyVisible; // If any are visible, new state is false (hide all), otherwise true (show all)

    fbdVisibilityStore.update(current => {
      const updated: FBDVisibilityState = { ...current };
      for (const key in updated) {
        updated[key as keyof FBDVisibilityState] = newState;
      }
      return updated;
    });
  }

</script>

<div>
  <h4>FBD Controls</h4>
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

<style>
  label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.9em;
  }
  h4 {
	  margin-top: 0;
	  margin-bottom: 8px;
	  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
	  padding-bottom: 4px;
  }

  .toggle-all-button {
    /* Add some basic styling */
    width: 100%;
    padding: var(--space-3xs);
    margin-bottom: var(--space-xs);
    border: 1px solid var(--border-color);
    background-color: var(--subtle-bg);
    color: var(--text-color);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .toggle-all-button:hover {
    background-color: var(--brand-hover-bg);
	color: var(--brand-hover-color);
  }
  .divider {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    margin-top: var(--space-2xs);
    margin-bottom: var(--space-s);
  }
</style>

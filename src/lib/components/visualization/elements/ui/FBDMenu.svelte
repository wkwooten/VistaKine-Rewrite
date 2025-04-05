<script lang="ts">
  import { fbdVisibilityStore, type FBDVisibilityState } from '$lib/stores/fbdStores';

  // Local reactive variables bound to checkboxes
  // We initialize them from the store's current value
  // We use the update method for store changes
  let velocityVisible = $fbdVisibilityStore.velocity;
  let weightVisible = $fbdVisibilityStore.weight;
  let accelerationVisible = $fbdVisibilityStore.acceleration;
  let netForceVisible = $fbdVisibilityStore.netForce;
  let normalForceVisible = $fbdVisibilityStore.normalForce;
  let frictionVisible = $fbdVisibilityStore.friction;

  // Update the store when checkboxes change
  $: fbdVisibilityStore.update((current: FBDVisibilityState) => ({
    ...current,
    velocity: velocityVisible,
    weight: weightVisible,
    acceleration: accelerationVisible,
    netForce: netForceVisible,
    normalForce: normalForceVisible,
    friction: frictionVisible,
  }));

  // Keep the store value synced with local state if it changes elsewhere (optional but safer)
  $: {
    velocityVisible = $fbdVisibilityStore.velocity;
    weightVisible = $fbdVisibilityStore.weight;
    accelerationVisible = $fbdVisibilityStore.acceleration;
    netForceVisible = $fbdVisibilityStore.netForce;
    normalForceVisible = $fbdVisibilityStore.normalForce;
    frictionVisible = $fbdVisibilityStore.friction;
  }

</script>

<div>
  <h4>FBD Controls</h4>
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
</div>

<style>
  div {
    /* Basic styling to make it visible */
    background-color: rgba(50, 50, 50, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    position: absolute; /* Example positioning, adjust as needed */
    top: 10px; /* Adjusted position */
    right: 60px; /* Adjusted position */
    z-index: 10; /* Ensure it's above the canvas */
    width: 200px; /* Give it some width */
  }
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
</style>

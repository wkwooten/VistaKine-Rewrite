<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  /** Current visibility state of the velocity vector. */
  export let velocityVisible: boolean = true;

  /** Current visibility state of the gravity vector. */
  export let gravityVisible: boolean = true;

  const dispatch = createEventDispatcher();

  function handleVelocityChange() {
    dispatch('toggleVelocity');
  }

  function handleGravityChange() {
    dispatch('toggleGravity');
  }
</script>

<div>
  <h4>FBD Controls</h4>
  <label>
    <input type="checkbox" bind:checked={velocityVisible} on:change={handleVelocityChange} />
    Show Velocity
  </label>
  <br />
  <label>
    <input type="checkbox" bind:checked={gravityVisible} on:change={handleGravityChange} />
    Show Gravity
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
    top: 50%;
    left: 10px;
    z-index: 10; /* Ensure it's above the canvas */
  }
  label {
    display: block;
    margin-bottom: 5px;
  }
</style>

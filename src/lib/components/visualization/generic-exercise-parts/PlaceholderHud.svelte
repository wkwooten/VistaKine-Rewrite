<script lang="ts">
  // Placeholder HUD
  let {
    title = "Placeholder HUD Title",
    isFullscreen = false,
    onrequestToggleFullscreen,
    onrequestReset,
  } = $props<{
    title?: string;
    isFullscreen?: boolean;
    onrequestToggleFullscreen?: () => void;
    onrequestReset?: () => void;
  }>();

  // In a real HUD, buttons would dispatch 'requestToggleFullscreen' and 'requestReset' events.
  // InteractiveExercise listens for these.
  // For this placeholder, actions are just logged or visual.
</script>

<div class="placeholder-hud">
  <h3>{title}</h3>
  <div class="buttons">
    <button onclick={() => onrequestToggleFullscreen?.()}
      >Fullscreen Toggle (State: {isFullscreen ? "On" : "Off"})</button
    >
    <button onclick={() => onrequestReset?.()}>Reset Button</button>
  </div>
  <div class="controls-slot-content">
    <slot name="controls"></slot>
    <!-- Slot for control panel -->
  </div>
</div>

<style>
  .placeholder-hud {
    padding: 10px;
    background-color: rgba(238, 238, 238, 0.85);
    border: 1px dashed #bbb;
    color: #555;
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    min-width: 200px; /* Ensure it has some size */
    box-sizing: border-box;
  }
  .buttons button {
    margin: 0 5px;
  }
  .controls-slot-content {
    border-top: 1px solid #ccc;
    padding-top: 10px;
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>

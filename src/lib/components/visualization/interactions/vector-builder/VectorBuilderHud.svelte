<script lang="ts">
  // import { createEventDispatcher } from "svelte"; // Removed
  import FullscreenButton from "../../elements/ui/FullscreenButton.svelte";
  import ResetButton from "../../elements/ui/ResetButton.svelte";
  import DialogBox from "../../elements/ui/DialogBox.svelte";
  // import VectorInputPanel from "./VectorInputPanel.svelte"; // Removed, will be slotted
  import VectorOutputPanel from "./VectorOutputPanel.svelte";
  import {
    startCoordsRaw,
    endCoordsRaw,
    // vectorData, // Not directly used
    showVectorBuilderDialog,
    vectorBuilderDialogTurns,
    // MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_Z, MAX_Z, // Not directly used
  } from "$lib/components/visualization/interactions/vector-builder/vectorBuilderState";

  // --- Props ---
  let {
    isFullscreen = false, // Changed from $bindable(false) as it's driven by InteractiveExercise
    onrequestToggleFullscreen,
    onrequestReset,
  } = $props<{
    isFullscreen?: boolean;
    onrequestToggleFullscreen?: () => void;
    onrequestReset?: () => void;
  }>();

  // const dispatch = createEventDispatcher(); // Removed

  // Function to handle reset
  function handleResetScene() {
    console.log(
      `[VectorBuilderHud] Resetting coordinate inputs locally and calling onrequestReset.`
    );
    startCoordsRaw.set({ x: "0", y: "0", z: "0" });
    endCoordsRaw.set({ x: "0", y: "0", z: "0" }); // Reset end coords to origin as well
    onrequestReset?.(); // Call the new prop
  }

  // Forward the request from the button
  function handleRequestToggleFullscreen() {
    console.log(
      "[VectorBuilderHud] Forwarding requestToggleFullscreen via prop"
    );
    onrequestToggleFullscreen?.(); // Call the new prop
  }
</script>

<div class="hud-container" class:fullscreen-active={isFullscreen}>
  <!-- Top Left Controls -->
  <div class="hud-controls-top-left">
    <ResetButton onclick={handleResetScene} />
    <FullscreenButton
      {isFullscreen}
      onRequestToggleCallback={handleRequestToggleFullscreen}
    />
  </div>

  <!-- Conditionally render DialogBox directly inside HUD -->
  {#if $showVectorBuilderDialog && isFullscreen}
    <DialogBox
      turns={$vectorBuilderDialogTurns}
      bind:show={$showVectorBuilderDialog}
      {isFullscreen}
    />
  {/if}

  <!-- Control Panel Slot - Bottom Right - ONLY IN FULLSCREEN -->
  {#if isFullscreen}
    <div class="vector-input-panel-container">
      <slot name="controls"></slot>
    </div>
  {/if}

  <!-- Output Panel - Mid Right (Original was Top Right, keeping it as per original file) -->
  <VectorOutputPanel extraClass="vector-output-positioned" />
</div>

<style lang="scss">
  .hud-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 10;
    font-size: 0.85em;
    pointer-events: none; // Base layer is passthrough
  }

  /* Position the DialogBox only when HUD is in fullscreen */
  .fullscreen-active :global(.dialog-box.expanded) {
    position: absolute;
    top: var(--space-m);
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 600px;
    z-index: 1000; // Dialog should be on top
    pointer-events: auto;
  }

  .fullscreen-active :global(.dialog-box.collapsed) {
    position: absolute;
    top: var(--space-s);
    right: var(--space-s);
    z-index: 11; // Above other controls
    pointer-events: auto;
  }

  .hud-controls-top-left {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 11; // Above other elements if necessary
    display: flex;
    pointer-events: auto; // These are interactive
  }

  /* NEW: Container for the slotted VectorInputPanel */
  .vector-input-panel-container {
    position: absolute;
    bottom: var(--space-s);
    right: var(--space-s);
    border: none;
    max-width: 90%;
    z-index: 10;
    pointer-events: auto; // Container itself doesn't need events, but content will.
  }

  /* Positioning for Output Panel */
  :global(.vector-output-positioned) {
    position: absolute;
    top: var(--space-s); /* As per original positioning */
    right: var(--space-s); /* As per original positioning */
    max-width: 40%;
    z-index: 10;
    pointer-events: auto; // This is interactive
  }
</style>

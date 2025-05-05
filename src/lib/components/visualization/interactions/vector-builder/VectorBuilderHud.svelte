<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import FullscreenButton from "../../elements/ui/FullscreenButton.svelte";
  import ResetButton from "../../elements/ui/ResetButton.svelte";
  import DialogBox from "../../elements/ui/DialogBox.svelte";
  import VectorInputPanel from "./VectorInputPanel.svelte";
  import VectorOutputPanel from "./VectorOutputPanel.svelte";
  import {
    startCoordsRaw,
    endCoordsRaw,
    vectorData,
    showVectorBuilderDialog,
    vectorBuilderDialogTurns,
    MIN_X,
    MAX_X,
    MIN_Y,
    MAX_Y,
    MIN_Z,
    MAX_Z,
  } from "$lib/stores/vectorBuilderState";

  // --- Props ---
  export let isFullscreen = false;

  const dispatch = createEventDispatcher();

  // Function to handle reset
  function handleResetScene() {
    console.log(`[VectorBuilderHud] Resetting coordinate inputs.`);
    startCoordsRaw.set({ x: "0", y: "0", z: "0" });
    endCoordsRaw.set({ x: "0", y: "0", z: "0" }); // Reset end coords to origin as well
  }

  // Forward the request from the button
  function handleRequestToggleFullscreen() {
    console.log("[VectorBuilderHud] Forwarding requestToggleFullscreen");
    dispatch("requestToggleFullscreen");
  }
</script>

<div class="hud-container" class:fullscreen-active={isFullscreen}>
  <!-- Top Left Controls -->
  <div class="hud-controls-top-left">
    <ResetButton on:click={handleResetScene} />
    <FullscreenButton
      bind:isFullscreen
      on:requestToggle={handleRequestToggleFullscreen}
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

  <!-- Input Panel - Bottom Right -->
  {#if isFullscreen}
    <VectorInputPanel extraClass="vector-input-positioned" />
  {/if}

  <!-- Output Panel - Mid Left -->
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
  }

  /* Position the DialogBox only when HUD is in fullscreen */
  .fullscreen-active :global(.dialog-box.expanded) {
    position: absolute;
    top: var(--space-m);
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 600px;
    z-index: 1000;
  }

  .fullscreen-active :global(.dialog-box.collapsed) {
    position: absolute;
    top: var(--space-s);
    right: var(--space-s);
    z-index: 11;
  }

  .hud-controls-top-left {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 11;
    display: flex;
    pointer-events: auto;
  }

  /* Positioning for Input Panel */
  :global(.vector-input-positioned) {
    position: absolute;
    bottom: var(--space-s);
    right: var(--space-s);
    border: none;
    max-width: 90%;
    z-index: 10;
    pointer-events: auto;
  }

  /* Positioning for Output Panel */
  :global(.vector-output-positioned) {
    position: absolute;
    top: var(--space-s);
    right: var(--space-s);
    max-width: 40%;
    z-index: 10;
    pointer-events: auto;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import FullscreenButton from '../../elements/ui/FullscreenButton.svelte';
  import ResetButton from '../../elements/ui/ResetButton.svelte';
  import VectorInputPanel from './VectorInputPanel.svelte';
  import VectorOutputPanel from './VectorOutputPanel.svelte';
  import {
    startCoordsRaw,
    endCoordsRaw,
    vectorData,
    resetVectorBuilderRequested,
    MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_Z, MAX_Z
  } from '$lib/stores/vectorBuilderState';

  // --- Props ---
  export let isFullscreen = false;

  const dispatch = createEventDispatcher();

  // Function to handle reset - Stays here as it resets both inputs and scene
  function handleResetScene() {
    console.log(`[VectorBuilderHud] Requesting reset via store`);
    startCoordsRaw.set({ x: '0', y: '0', z: '0' });
    endCoordsRaw.set({ x: null, y: null, z: null });
    resetVectorBuilderRequested.set(true);
  }

  // Forward the request from the button
  function handleRequestToggleFullscreen() {
    console.log('[VectorBuilderHud] Forwarding requestToggleFullscreen');
    dispatch('requestToggleFullscreen');
  }

</script>

<div class="hud-container">
  <!-- Top Left Controls -->
  <div class="hud-controls-top-left">
      <ResetButton on:click={handleResetScene} />
      <FullscreenButton bind:isFullscreen on:requestToggle={handleRequestToggleFullscreen} />
  </div>

  <!-- Position Panels Directly using extraClass prop -->
  <!-- Only render Input Panel in HUD when fullscreen -->
  {#if isFullscreen}
    <VectorInputPanel extraClass="vector-input-positioned" />
  {/if}
  <VectorOutputPanel extraClass="vector-output-positioned" />

</div>

<style lang="scss">
  .hud-container {
    position: relative;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 10;
    /* Remove background/border from root container */
    font-size: 0.85em; /* Keep base size */
  }

  .hud-controls-top-left {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 11;
    display: flex;
    pointer-events: auto;
  }

  /* Remove .main-hud-content-wrapper */

  /* Positioning for Input Panel */
  :global(.vector-input-positioned) {
    position: absolute;
    bottom: var(--space-s);
    right: var(--space-s);
    border: none;
    /* width: 320px; /* Remove fixed width */
    max-width: 90%;
    z-index: 10;
  }

  /* Positioning for Output Panel */
  :global(.vector-output-positioned) {
    position: absolute;
    top: 50%; /* Center vertically */
    left: var(--space-s);
    transform: translateY(-50%); /* Fine-tune vertical centering */
    /* width: 200px; /* Remove fixed width */
    max-width: 40%;
    z-index: 10;
  }

</style>
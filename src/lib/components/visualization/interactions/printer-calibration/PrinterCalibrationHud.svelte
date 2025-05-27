<script lang="ts">
  import FullscreenButton from "../../elements/ui/FullscreenButton.svelte";
  import ResetButton from "../../elements/ui/ResetButton.svelte";
  import DialogBox from "../../elements/ui/DialogBox.svelte";
  import {
    showDialog,
    dialogTurns,
    relativeNozzleXStore,
    relativeNozzleYStore,
    relativeNozzleZStore,
  } from "$lib/components/visualization/interactions/printer-calibration/calibrationState";
  import type { Snippet } from "svelte";

  // --- Props ---
  let {
    isFullscreen = $bindable(false),
    onrequestToggleFullscreen,
    onrequestReset,
    controlsSnippet,
  } = $props<{
    isFullscreen?: boolean;
    onrequestToggleFullscreen?: () => void;
    onrequestReset?: () => void;
    controlsSnippet?: Snippet;
  }>();

  // --- Derived State for Display (subscribing to stores directly) ---
  let formattedPosition = $derived(
    `X: ${$relativeNozzleXStore.toFixed(1)}, Y: ${$relativeNozzleYStore.toFixed(
      1
    )}, Z: ${$relativeNozzleZStore.toFixed(1)}`
  );

  // --- Event Handlers ---
  function handleResetScene() {
    console.log(`[CalibrationHud] Requesting reset via prop`);
    onrequestReset?.();
  }

  function handleRequestToggle() {
    console.log("[CalibrationHud] Forwarding requestToggleFullscreen via prop");
    onrequestToggleFullscreen?.();
  }
</script>

<!-- Main container for portal target -->
<div
  class="calibration-hud-container"
  class:fullscreen-active={isFullscreen}
  id="hud-overlay"
>
  <!-- Top Left Controls -->
  <div class="hud-controls-top-left">
    <ResetButton onclick={handleResetScene} />
    <FullscreenButton
      {isFullscreen}
      onRequestToggleCallback={handleRequestToggle}
    />
  </div>

  <!-- NEW: Top Right Position Display (now uses derived state from stores) -->
  <div class="hud-position-display">
    <span>{formattedPosition}</span>
  </div>

  <!-- Conditionally render DialogBox directly inside HUD -->
  {#if $showDialog && isFullscreen}
    <DialogBox turns={$dialogTurns} bind:show={$showDialog} {isFullscreen} />
  {/if}

  <!-- Bottom Right Input Controls Container - uses snippet -->
  {#if isFullscreen && controlsSnippet}
    <div class="nozzle-control-panel-container">
      {@render controlsSnippet()}
    </div>
  {/if}
</div>

<style lang="scss">
  .calibration-hud-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: block;
    position: relative;
    pointer-events: none;
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
    z-index: 11; /* Match other buttons */
  }

  /* Container for top-left buttons */
  .hud-controls-top-left {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    flex-direction: row;
    pointer-events: auto;
  }

  /* NEW: Styles for position display */
  .hud-position-display {
    position: absolute;
    top: var(--space-xs, 4px); /* Align with top-left buttons */
    right: var(--space-xs, 4px); /* Position in top right */
    z-index: 10; /* Same level as other controls */
    padding: var(--space-2xs, 2px) var(--space-xs, 4px);
    background-color: var(--color-surface, #fefeff);
    color: var(--color-text-primary, #1f2937);
    border: 1px solid var(--color-border, rgba(0, 77, 159, 0.2));
    box-shadow: var(--shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.05));
    font-size: var(--font-size-xs, 0.75rem);
    border-radius: var(--radius-sm, 4px);
    pointer-events: none;
    white-space: nowrap;
    user-select: none;
    font-family: var(--font-mono, monospace);
  }

  /* Container for bottom-right panel */
  .nozzle-control-panel-container {
    position: absolute;
    bottom: var(--space-s);
    right: var(--space-s);
    z-index: 10;
    pointer-events: auto;
  }
</style>

<script lang="ts">
  import FullscreenButton from "$lib/components/visualization/elements/ui/FullscreenButton.svelte";
  import ResetButton from "$lib/components/visualization/elements/ui/ResetButton.svelte";
  import DialogBox from "../../elements/ui/DialogBox.svelte";
  import PlayPauseButton from "$lib/components/visualization/elements/ui/PlayPauseButton.svelte";
  import { slide } from "svelte/transition";
  import type { Snippet } from "svelte";
  // Later: Import state like isPlaying, distance, displacement, velocity etc.

  let isPlaying = false; // Placeholder state
  let distance = 0; // Placeholder state
  let displacement = 0; // Placeholder state

  interface HudProps {
    onrequestToggleFullscreen?: () => void;
    onrequestReset?: () => void;
    controlsSnippet?: Snippet;
    title?: string;
    isFullscreen?: boolean;
  }

  let {
    onrequestToggleFullscreen,
    onrequestReset,
    controlsSnippet,
    title,
    isFullscreen,
  }: HudProps = $props();

  function handleReset() {
    // TODO: Call reset function from state store
    console.log("Reset clicked");
    isPlaying = false;
    distance = 0;
    displacement = 0;
    onrequestReset?.(); // Call the prop function
  }

  function togglePlayPause() {
    // TODO: Call play/pause function from state store
    isPlaying = !isPlaying;
    console.log("Play/Pause toggled:", isPlaying);
  }
</script>

<div class="hud-overlay" transition:slide={{ duration: 200, axis: "y" }}>
  <div class="controls-top-right">
    <FullscreenButton onRequestToggleCallback={onrequestToggleFullscreen} />
  </div>

  <div class="controls-bottom-left">
    <div class="readout">
      <span>Distance: {distance.toFixed(1)} m</span>
      <span>Displacement: {displacement.toFixed(1)} m</span>
    </div>
    <div class="graph-area-placeholder">
      <p>Graph Placeholder Area</p>
    </div>
  </div>

  <div class="controls-bottom-center">
    <PlayPauseButton bind:playing={isPlaying} on:click={togglePlayPause} />
    <ResetButton onclick={handleReset} />
  </div>

  {#if controlsSnippet}
    <div class="controls-bottom-right">
      {@render controlsSnippet()}
    </div>
  {/if}
</div>

<style lang="scss">
  .hud-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; // Allow interaction with canvas below
    padding: var(--space-xs);
    display: grid;
    grid-template-areas:
      "top-left top-center top-right"
      "center-left center center-right"
      "bottom-left bottom-center bottom-right";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto 1fr auto;
    gap: var(--space-xs);

    & > * {
      pointer-events: auto; // Re-enable pointer events for controls
    }
  }

  .controls-top-right {
    grid-area: top-right;
    display: flex;
    gap: var(--space-3xs);
    justify-content: flex-end;
  }

  .controls-bottom-left {
    grid-area: bottom-left;
    align-self: end; // Align to bottom
    display: flex; // Use flex to arrange readout and graphs
    flex-direction: column; // Stack readout and graphs vertically
    gap: var(--space-xs); // Space between readout and graphs
  }

  .controls-bottom-center {
    grid-area: bottom-center;
    display: flex;
    justify-content: center;
    align-items: flex-end; // Align buttons to bottom
    gap: var(--space-xs);
  }

  .controls-bottom-right {
    grid-area: bottom-right;
    align-self: end; // Align to bottom
    display: flex;
    justify-content: flex-end;
  }

  .readout {
    background-color: var(--color-surface-transparent);
    border: 1px solid var(--color-border-light);
    padding: var(--space-2xs) var(--space-xs);
    border-radius: var(--radius-sm);
    backdrop-filter: blur(5px);
    color: var(--color-text-primary);
    font-size: var(--step--1);
    display: flex;
    flex-direction: column;
    gap: var(--space-3xs);
    min-width: 15ch; // Ensure some minimum width
  }

  .graph-area-placeholder {
    background-color: var(--color-surface-transparent);
    border: 1px solid var(--color-border-light);
    padding: var(--space-xs);
    border-radius: var(--radius-sm);
    backdrop-filter: blur(5px);
    color: var(--color-text-primary);
    font-size: var(--step--1);
    min-height: 100px; /* Placeholder height */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Ensure buttons are clickable */
  :global(.hud-overlay button) {
    pointer-events: auto;
  }
</style>

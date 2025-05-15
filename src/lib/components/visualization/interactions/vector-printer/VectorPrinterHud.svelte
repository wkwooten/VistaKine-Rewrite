<script lang="ts">
  import FullscreenButton from "./../../elements/ui/FullscreenButton.svelte";
  import ResetButton from "../../elements/ui/ResetButton.svelte";
  import type { Vector3 } from "three";
  // Import specific color stores if needed by HUD text, or rely on CSS variables set by themeColors
  // For now, assuming HUD text color is primarily handled by CSS variables or defaults.
  import katex from "katex";
  import AddButton from "$lib/components/visualization/elements/ui/AddButton.svelte";
  import { currentDefiningVectorStore } from "./vectorPrinterState"; // Import store

  let {
    nozzlePosition,
    dialogMessage,
    dialogSpeaker,
    isFullscreen = false, // No longer $bindable, driven by InteractiveExercise
    onrequestToggleFullscreen, // Callback from InteractiveExercise
    onrequestReset, // Callback from InteractiveExercise
  } = $props<{
    nozzlePosition: Vector3;
    dialogMessage?: string;
    dialogSpeaker?: string;
    isFullscreen?: boolean;
    onrequestToggleFullscreen?: () => void;
    onrequestReset?: () => void;
  }>();

  const formatVector = (v: Vector3 | undefined, defaultText = "⟨0,0,0⟩") => {
    if (!v || v.lengthSq() === 0) return defaultText;
    return `⟨${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)}⟩`;
  };

  const formatStoreDeltaVector = (v: Vector3 | undefined) => {
    if (!v || v.lengthSq() === 0) return "⟨0,0,0⟩";
    return `⟨${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)}⟩`;
  };

  // Event Handlers for HUD buttons
  function handleRequestToggle() {
    onrequestToggleFullscreen?.();
  }

  function handleRequestReset() {
    onrequestReset?.();
  }
</script>

<div class="vector-printer-hud-overlay" class:fullscreen-active={isFullscreen}>
  <div class="hud-items-top-left">
    <ResetButton onclick={handleRequestReset} />
    <FullscreenButton
      {isFullscreen}
      onRequestToggleCallback={handleRequestToggle}
    />
    <!-- AddButton's functionality is TBD, leaving as is for now -->
    <AddButton />
  </div>

  <div class="hud-panel bottom-right">
    <div class="hud-item">
      <span class="label">Nozzle Position:</span>
      <span class="value">{formatVector(nozzlePosition)}</span>
    </div>
    {#if $currentDefiningVectorStore && $currentDefiningVectorStore.lengthSq() > 0}
      <div class="hud-item">
        <span class="label">{@html katex.renderToString("\\vec{A}")} =</span>
        <span class="value"
          >{formatStoreDeltaVector($currentDefiningVectorStore)}</span
        >
      </div>
    {/if}
  </div>

  <!-- Container for ControlPanelComponent, shown only in fullscreen -->
  {#if isFullscreen}
    <div class="controls-panel-slot-container">
      <slot name="controls"></slot>
    </div>
  {/if}

  <!-- Dialog rendering can be added here if needed when fullscreen -->
  <!-- Example from other HUDs:
  {#if $showDialogStore && isFullscreen} // Assuming a showDialogStore for vector-printer
    <DialogBox turns={$dialogTurnsStore} bind:show={$showDialogStore} {isFullscreen} />
  {/if}
  -->
</div>

<style lang="scss">
  .vector-printer-hud-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: flex;
    flex-direction: column; // Changed for overall layout
    justify-content: space-between; // Pushes elements to top and bottom
    padding: var(--space-xs);
    font-family: var(--font-mono);
    font-size: var(--step--1);
    color: var(--color-text-hud, white);
  }

  .hud-items-top-left {
    display: flex;
    gap: var(--space-xs);
    pointer-events: auto;
    width: fit-content; // Only take space needed for buttons
  }

  .hud-panel {
    background-color: var(--color-surface-transparent, rgba(0, 0, 0, 0.5));
    padding: var(--space-xs);
    border-radius: var(--radius-sm);
    pointer-events: auto;
    box-shadow: var(--shadow-sm);
    max-width: 300px;
    align-self: flex-end; // Aligns this panel to the right if flex-direction is row, or bottom if column
  }

  .bottom-right {
    // Specific class for positioning if needed, for now using flex properties
    // align-self: flex-end; // Already on .hud-panel
  }

  .hud-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-xxs);
    align-items: center;

    .label {
      margin-right: var(--space-xs);
      color: var(--color-text-hud-secondary, lightgray);
    }
    .value {
      font-weight: 500;
      min-width: 100px;
      text-align: right;
    }
  }

  :global(.vector-printer-hud-overlay .katex) {
    font-size: inherit !important;
    color: inherit !important;
  }

  .controls-panel-slot-container {
    position: absolute; // Example positioning, adjust as needed
    bottom: var(--space-s);
    left: var(--space-s); // Example: bottom-left
    // Or right: var(--space-s); for bottom-right
    z-index: 10;
    pointer-events: auto;
    width: auto; // Or a specific width
    max-width: calc(100% - 2 * var(--space-s)); // Ensure it fits
  }
</style>

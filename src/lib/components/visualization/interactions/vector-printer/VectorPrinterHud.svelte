<script lang="ts">
  import type { Vector3 } from "three";
  // import VectorPrinterOutputPanel from "./VectorPrinterOutputPanel.svelte";
  import FullscreenButton from "../../elements/ui/FullscreenButton.svelte";
  import ResetButton from "../../elements/ui/ResetButton.svelte";
  import type { Snippet } from "svelte";

  let {
    // nozzlePosition,
    isFullscreen = false,
    onrequestToggleFullscreen,
    onrequestReset,
    controlsSnippet,
    // Assuming an onrequestAdd might be needed for AddButton if it has specific logic
    // onrequestAdd,
  } = $props<{
    // nozzlePosition: Vector3;
    isFullscreen?: boolean;
    onrequestToggleFullscreen?: () => void;
    onrequestReset?: () => void;
    controlsSnippet?: Snippet;
    // onrequestAdd?: () => void;
  }>();

  function handleRequestToggleFullscreen() {
    onrequestToggleFullscreen?.();
  }

  function handleRequestReset() {
    onrequestReset?.();
  }

  // function handleRequestAdd() {
  // onrequestAdd?.();
  // }
</script>

<div class="vector-printer-hud-overlay" class:fullscreen-active={isFullscreen}>
  <div class="hud-items-top-left">
    <ResetButton onclick={handleRequestReset} />
    <FullscreenButton
      {isFullscreen}
      onRequestToggleCallback={handleRequestToggleFullscreen}
    />
  </div>

  {#if isFullscreen && controlsSnippet}
    <div class="controls-panel-slot-container">
      {@render controlsSnippet()}
    </div>
  {/if}
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
    flex-direction: column;
    justify-content: space-between;
    padding: var(--space-s); // Use consistent spacing
    box-sizing: border-box;

    &.fullscreen-active {
      // Add any specific styles for fullscreen mode if needed, e.g., different padding
      // padding: var(--space-m);
    }
  }

  .hud-items-top-left {
    display: flex;
    gap: var(--space-s);
    pointer-events: auto;
    width: fit-content;
    z-index: 20; // Ensure buttons are above other elements
  }

  .controls-panel-slot-container {
    position: absolute;
    bottom: var(--space-s);
    left: 50%;
    transform: translateX(-50%);
    pointer-events: auto;
    width: clamp(300px, 80%, 500px); /* Responsive width */
    z-index: 30; // Ensure controls are above everything in fullscreen
  }

  // Ensure consistent styling for slotted controls
  :global(.vector-printer-hud-overlay .controls-panel-slot-container > *) {
    padding: var(--space-s);
    background-color: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
  }
</style>

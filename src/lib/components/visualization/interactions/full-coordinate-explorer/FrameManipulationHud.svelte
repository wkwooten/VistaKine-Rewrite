<script lang="ts">
  import ResetButton from "$lib/components/visualization/elements/ui/ResetButton.svelte"; // Assuming a reset icon component
  import {
    transformModeStore,
    type ExplorerTransformMode,
  } from "./coordinateExplorerStore"; // Import the store

  // type TransformMode = "translate" | "rotate"; // Type now comes from store

  let {
    // currentMode = "translate" as ExplorerTransformMode, // Removed from props, will use store
    onModeChange,
    onrequestReset,
  } = $props<{
    // currentMode?: ExplorerTransformMode; // Removed from props
    onModeChange?: (mode: ExplorerTransformMode) => void;
    onrequestReset?: () => void;
  }>();

  // $effect(() => { // No longer needed as we directly use $transformModeStore in template
  //   console.log(`[FrameManipulationHud] currentMode prop is: ${currentMode}`);
  // });

  function handleModeClick(mode: ExplorerTransformMode) {
    onModeChange?.(mode); // This signals the exercise to update the store
  }

  function handleResetClick() {
    onrequestReset?.();
  }
</script>

<div class="frame-manipulation-hud">
  <ResetButton
    class="hud-button reset-button"
    onclick={handleResetClick}
    aria-label="Reset Axes Position and Rotation"
  />
  <div class="mode-toggle-buttons-group">
    <button
      class="mode-button"
      class:active={$transformModeStore === "translate"}
      onclick={() => handleModeClick("translate")}
    >
      Transform (T)
    </button>
    <button
      class="mode-button"
      class:active={$transformModeStore === "rotate"}
      onclick={() => handleModeClick("rotate")}
    >
      Rotate (R)
    </button>
  </div>
</div>

<style lang="scss">
  .frame-manipulation-hud {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    gap: var(--space-s);
    padding: var(--space-xs);
    // background-color: var(--color-surface-overlay, hsl(0 0% 100% / 0.8)); // Can be transparent if page bg is light
    border-radius: var(
      --radius-md
    ); // Overall container doesn't need a border or strong bg if buttons are self-contained
    // box-shadow: var(--shadow-md); // Optional shadow for the whole HUD
    position: absolute;
    top: var(--space-s);
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    pointer-events: auto;
  }

  .mode-toggle-buttons-group {
    display: flex;
    border: 1px solid var(var(--color-border), #cccccc); // Border for the whole group
    border-radius: var(--radius-md); // Rounded corners for the group
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    // background-color: var(--color-surface, white); // Group background if needed, or let buttons define it

    .mode-button {
      padding: var(--space-xs) var(--space-s);
      border: none;
      background-color: var(
        --color-surface,
        white
      ); // Default/Inactive background
      color: var(
        --color-text-secondary,
        #333333
      ); // Default/Inactive text color
      cursor: pointer;
      transition:
        background-color 0.2s,
        color 0.2s;
      position: relative;
      line-height: 1.2; // Ensure text is vertically centered well

      &:hover:not(.active) {
        background-color: var(--color-surface-hover, #f5f5f5);
        color: var(--color-text-primary, black);
      }

      &.active {
        background-color: var(
          --color-accent,
          #007bff
        ); // Active background (blueish)
        color: var(--color-border-subtle); // Active text (white)
        font-weight: 500; // Slightly bolder for active
        // The active button's own separator (if it has one on its right) should not be visible
        // And the separator of the button to its left should also not be visible if this one is active.
        // This is tricky with ::after on the button itself.
        // A simpler approach might be to have the separator always on the left, except for the first button.
      }

      // Alternative separator: on the left of each button except the first
      // &:not(:first-child) {
      //   border-left: 1px solid var(--color-border-subtle, #cccccc);
      // }
    }
  }
</style>

<script lang="ts">
  import VisContainer from "$lib/components/visualization/VisContainer.svelte";
  import { fullscreenAction } from "$lib/actions/useFullscreen";
  import PlaceholderScene from "./generic-exercise-parts/PlaceholderScene.svelte";
  import PlaceholderHud from "./generic-exercise-parts/PlaceholderHud.svelte";
  import PlaceholderControls from "./generic-exercise-parts/PlaceholderControls.svelte";
  import type { Component, ComponentType, Snippet } from "svelte";
  import FullscreenManager from "./FullscreenManager.svelte";

  interface ExerciseProps {
    SceneComponent?: Component<any>;
    HudComponent?: Component<any>;
    ControlPanelComponent?: Component<any>;
    sceneProps?: Record<string, any>;
    hudProps?: Record<string, any>;
    controlPanelProps?: Record<string, any>;
    exerciseTitle?: string;
    onResetRequestedByHudCallback?: () => void;
    onFullscreenStatusChangeCallback?: (isFullscreen: boolean) => void;
    class?: string;
  }

  const passedProps: ExerciseProps = $props();

  // Log received sceneProps
  $effect(() => {
    console.log(
      "[InteractiveExercise] Received sceneProps:",
      passedProps.sceneProps
    );
  });

  const SceneComponent = passedProps.SceneComponent ?? PlaceholderScene;
  const HudComponent = passedProps.HudComponent ?? PlaceholderHud;
  const ControlPanelComponentToRender =
    passedProps.ControlPanelComponent ?? PlaceholderControls;

  const sceneProps = passedProps.sceneProps ?? {};
  const hudProps = passedProps.hudProps ?? {};
  const controlPanelProps = passedProps.controlPanelProps ?? {};
  const exerciseTitle = passedProps.exerciseTitle ?? "Interactive Exercise";
  const extraClass = passedProps.class ?? "";

  let resetKey = $state(0);
  let isFullscreen = $state(false);
  let exerciseWrapperElement: HTMLDivElement;
  let controlsVisible = $state(true);
  let isActuallyFullscreen = $state(false);
  let fullscreenManagerInstance: FullscreenManager | undefined = $state();

  // Effect to call the fullscreen status change callback and log local fullscreen state
  $effect(() => {
    console.log(
      "[InteractiveExercise] isFullscreen state changed to:",
      isFullscreen
    );
    passedProps.onFullscreenStatusChangeCallback?.(isFullscreen);
  });

  function handleRequestToggleFullscreen(): void {
    console.log("[InteractiveExercise] Fullscreen toggle requested.");
    if (fullscreenManagerInstance) {
      fullscreenManagerInstance.toggle();
    } else {
      console.warn(
        "[InteractiveExercise] FullscreenManager instance not available."
      );
    }
    if (passedProps.onFullscreenStatusChangeCallback) {
      passedProps.onFullscreenStatusChangeCallback(isActuallyFullscreen);
    }
  }

  function handleRequestReset(): void {
    resetKey++;
    passedProps.onResetRequestedByHudCallback?.();
  }

  const combinedHudProps = $derived({
    ...hudProps,
    isFullscreen: isActuallyFullscreen,
    title: hudProps.title ?? exerciseTitle,
  });
</script>

<div
  class="interactive-exercise-wrapper {extraClass}"
  class:is-actually-fullscreen={isActuallyFullscreen}
  bind:this={exerciseWrapperElement}
>
  {#snippet controlsPanelContent()}
    <ControlPanelComponentToRender {...controlPanelProps} />
  {/snippet}

  <div class="exercise-content">
    <FullscreenManager
      bind:active={isActuallyFullscreen}
      bind:this={fullscreenManagerInstance}
    >
      <div class="visualization-area">
        <VisContainer {resetKey} isFullscreen={isActuallyFullscreen}>
          <SceneComponent {...sceneProps} />
        </VisContainer>
      </div>
    </FullscreenManager>

    {#if HudComponent}
      <div class="hud-area">
        <svelte:component
          this={HudComponent}
          onrequestToggleFullscreen={handleRequestToggleFullscreen}
          onrequestReset={handleRequestReset}
          {...combinedHudProps}
        />
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .interactive-exercise-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    overflow: hidden;
    background-color: var(--color-background);

    // Styles for when FullscreenManager makes the content fullscreen
    &.is-actually-fullscreen {
      .visualization-area {
        // The FullscreenManager's child (which is .visualization-area's parent in this structure)
        // will be the actual fullscreen element.
        // So .visualization-area itself doesn't need position:fixed if its parent is fullscreen.
        // It just needs to fill its parent (the FullscreenManager's div).
        width: 100%;
        height: 100%;

        :global(.visualization-container) {
          // Target VisContainer
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
          aspect-ratio: auto !important;
          border-radius: 0 !important;
          border: none !important;
        }
      }

      .hud-area {
        position: absolute; // Position relative to .interactive-exercise-wrapper or .exercise-content
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1001; // Ensure it's above the visualization area
        pointer-events: none;

        :global(> *) {
          pointer-events: auto;
        }
      }

      .controls-area {
        display: none;
      }
    }
  }

  .hud-layer {
    grid-row: 1 / -1;
    grid-column: 1 / -1;
    position: relative;
    z-index: 20;
    pointer-events: none;
  }

  .vis-layer {
    grid-row: 1 / -1;
    grid-column: 1 / -1;
    position: relative;
    z-index: 10;
    display: flex;
    min-height: 0;
  }

  // When the wrapper element itself enters fullscreen via the action
  // these styles apply. This is usually handled by the browser, but good for overrides.
  // &.fullscreen-active { // Example class if action adds one, or use pseudo-selectors
  //   // Potentially override child z-indexes or positions if necessary
  // }
  // The above style for .fullscreen-active seems to be an example/placeholder and might not be needed
  // if the fullscreen action doesn't add such a class. If specific styling for fullscreen is needed,
  // it's often managed by the :fullscreen pseudo-class on the element itself.
  // For now, I will comment it out to resolve the SCSS error, it can be revisited if specific
  // fullscreen styling needs are identified for the wrapper.
</style>

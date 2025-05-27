<script lang="ts">
  import VisContainer from "$lib/components/visualization/VisContainer.svelte";
  import { fullscreenAction } from "$lib/actions/useFullscreen";
  import PlaceholderScene from "./generic-exercise-parts/PlaceholderScene.svelte";
  import PlaceholderHud from "./generic-exercise-parts/PlaceholderHud.svelte";
  import PlaceholderControls from "./generic-exercise-parts/PlaceholderControls.svelte";
  import type { SvelteComponent, ComponentType, Snippet } from "svelte";

  interface ExerciseProps {
    SceneComponent?: ComponentType<SvelteComponent>;
    HudComponent?: ComponentType<SvelteComponent>;
    ControlPanelComponent?: ComponentType<SvelteComponent>;
    sceneProps?: Record<string, any>;
    hudProps?: Record<string, any>;
    controlPanelProps?: Record<string, any>;
    exerciseTitle?: string;
    onResetRequestedByHudCallback?: () => void;
    onFullscreenStatusChangeCallback?: (isFullscreen: boolean) => void;
    class?: string;
    dialogAreaSnippet?: Snippet<[{ isFullscreen: boolean }]>;
    controlsAreaSnippet?: Snippet<[{ isFullscreen: boolean }]>;
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

  const dialogAreaSnippet = passedProps.dialogAreaSnippet;
  const controlsAreaSnippet = passedProps.controlsAreaSnippet;

  let resetKey = $state(0);
  let isFullscreen = $state(false);
  let exerciseWrapperElement: HTMLDivElement;

  // Effect to call the fullscreen status change callback and log local fullscreen state
  $effect(() => {
    console.log(
      "[InteractiveExercise] isFullscreen state changed to:",
      isFullscreen
    );
    passedProps.onFullscreenStatusChangeCallback?.(isFullscreen);
  });

  function handleRequestToggleFullscreen(): void {
    console.log(
      "[InteractiveExercise] handleRequestToggleFullscreen called. Current isFullscreen:",
      isFullscreen,
      "Dispatching event with detail:",
      !isFullscreen
    );
    if (exerciseWrapperElement) {
      exerciseWrapperElement.dispatchEvent(
        new CustomEvent("toggleFullscreenRequest", { detail: !isFullscreen })
      );
    }
  }

  function handleRequestReset(): void {
    resetKey++;
    passedProps.onResetRequestedByHudCallback?.();
  }

  const combinedHudProps = $derived({
    ...hudProps,
    isFullscreen,
    title: hudProps.title ?? exerciseTitle,
  });
</script>

<div
  class="interactive-exercise-wrapper {extraClass}"
  use:fullscreenAction={{
    isFullscreenStore: { set: (v) => (isFullscreen = v) },
  }}
  bind:this={exerciseWrapperElement}
>
  {#if dialogAreaSnippet && !isFullscreen}
    <div class="dialog-area-wrapper">
      {@render dialogAreaSnippet({ isFullscreen })}
    </div>
  {/if}

  {#snippet controlsPanelContentInternal()}
    <ControlPanelComponentToRender {...controlPanelProps} />
  {/snippet}

  <div class="visualization-area-wrapper">
    <div class="hud-layer">
      <HudComponent
        {...combinedHudProps}
        onrequestToggleFullscreen={handleRequestToggleFullscreen}
        onrequestReset={handleRequestReset}
        controlsSnippet={controlsPanelContentInternal}
      ></HudComponent>
    </div>

    <div class="vis-layer">
      <VisContainer {resetKey} {isFullscreen}>
        <SceneComponent {...sceneProps} />
      </VisContainer>
    </div>
  </div>

  {#if controlsAreaSnippet && !isFullscreen}
    <div class="controls-area-wrapper">
      {@render controlsAreaSnippet({ isFullscreen })}
    </div>
  {/if}
</div>

<style lang="scss">
  .interactive-exercise-wrapper {
    position: relative; // Keep relative for absolute children if any, but manage layout with flex
    width: 100%;
    height: 100%;
    display: flex; // Changed to flex
    flex-direction: column; // Main layout is columnar
    overflow: hidden;
    gap: var(--space-s);
    margin-bottom: var(--space-s);
  }

  .dialog-area-wrapper {
    // Styles for the dialog area, e.g., prevent shrinking
    flex-shrink: 0;
    // order: 1; // If explicit ordering is needed
    // Add any other necessary styling, like padding or margins if not handled by the snippet content
  }

  .visualization-area-wrapper {
    // Wrapper for vis + hud layers
    position: relative; // For layering hud-layer and vis-layer
    display: grid; // Using grid for easy layering of hud and vis
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    flex-grow: 1; // This area should take up remaining space
    min-height: 0; // Important for flex children to shrink properly
    // order: 2;
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
    display: flex; // Ensure VisContainer can flex if its content needs to
    min-height: 0; // Allow shrinking
  }

  .controls-area-wrapper {
    // Styles for the controls area, e.g., prevent shrinking
    flex-shrink: 0;
    // order: 3;
    // Add any other necessary styling
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

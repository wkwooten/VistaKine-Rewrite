<script lang="ts">
  import VisContainer from "$lib/components/visualization/VisContainer.svelte";
  import { fullscreenAction } from "$lib/actions/useFullscreen";
  import PlaceholderScene from "./generic-exercise-parts/PlaceholderScene.svelte";
  import PlaceholderHud from "./generic-exercise-parts/PlaceholderHud.svelte";
  import PlaceholderControls from "./generic-exercise-parts/PlaceholderControls.svelte";
  import type { SvelteComponent } from "svelte";

  interface ExerciseProps {
    SceneComponent?: any;
    HudComponent?: any;
    ControlPanelComponent?: any;
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
  const showCustomControlPanel =
    passedProps.ControlPanelComponent !== undefined;

  const sceneProps = passedProps.sceneProps ?? {};
  const hudProps = passedProps.hudProps ?? {};
  const controlPanelProps = passedProps.controlPanelProps ?? {};
  const exerciseTitle = passedProps.exerciseTitle ?? "Interactive Exercise";
  const extraClass = passedProps.class ?? "";

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
  <div class="hud-layer">
    <HudComponent
      {...combinedHudProps}
      onrequestToggleFullscreen={handleRequestToggleFullscreen}
      onrequestReset={handleRequestReset}
    >
      <svelte:fragment slot="controls">
        <ControlPanelComponentToRender {...controlPanelProps} />
      </svelte:fragment>
    </HudComponent>
  </div>

  <div class="vis-layer">
    <VisContainer {resetKey} {isFullscreen}>
      <SceneComponent {...sceneProps} />
    </VisContainer>
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

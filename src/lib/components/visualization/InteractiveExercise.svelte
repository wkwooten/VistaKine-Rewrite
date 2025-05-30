<script lang="ts">
  import VisContainer from "$lib/components/visualization/VisContainer.svelte";
  // import { fullscreenAction } from "$lib/actions/useFullscreen"; // Removed
  import FullscreenWrapper from "$lib/components/ui/FullscreenWrapper.svelte"; // Added
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
    instructionSnippet?: Snippet<[{ isFullscreen: boolean }]>;
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
  const instructionSnippet = passedProps.instructionSnippet;

  let resetKey = $state(0);
  let isFullscreenActive = $state(false); // Renamed for clarity, will be bound to FullscreenWrapper
  // let exerciseWrapperElement: HTMLDivElement; // No longer needed for dispatching event

  // Effect to call the fullscreen status change callback and log local fullscreen state
  $effect(() => {
    console.log(
      "[InteractiveExercise] isFullscreenActive state changed to:",
      isFullscreenActive
    );
    passedProps.onFullscreenStatusChangeCallback?.(isFullscreenActive);
  });

  function handleRequestToggleFullscreen(): void {
    console.log(
      "[InteractiveExercise] handleRequestToggleFullscreen called. Current isFullscreenActive:",
      isFullscreenActive,
      "Setting to:",
      !isFullscreenActive
    );
    // This will now toggle the FullscreenWrapper's active state via binding
    isFullscreenActive = !isFullscreenActive;
  }

  function handleRequestReset(): void {
    resetKey++;
    passedProps.onResetRequestedByHudCallback?.();
  }

  const combinedHudProps = $derived({
    ...hudProps,
    isFullscreen: isFullscreenActive, // Pass the current fullscreen state to HUD
    title: hudProps.title ?? exerciseTitle,
  });
</script>

<FullscreenWrapper bind:active={isFullscreenActive}>
  {#if instructionSnippet && !isFullscreenActive}
    <div class="instruction-area-wrapper">
      {@render instructionSnippet({ isFullscreen: isFullscreenActive })}
    </div>
  {/if}

  <div class="interactive-exercise-content-wrapper {extraClass}">
    {#if dialogAreaSnippet && !isFullscreenActive}
      <div class="dialog-area-wrapper">
        {@render dialogAreaSnippet({ isFullscreen: isFullscreenActive })}
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
        <VisContainer {resetKey} isFullscreen={isFullscreenActive}>
          <SceneComponent {...sceneProps} />
        </VisContainer>
      </div>
    </div>

    {#if controlsAreaSnippet && !isFullscreenActive}
      <div class="controls-area-wrapper">
        {@render controlsAreaSnippet({ isFullscreen: isFullscreenActive })}
      </div>
    {/if}
  </div>
</FullscreenWrapper>

<style lang="scss">
  /* Renamed .interactive-exercise-wrapper to .interactive-exercise-content-wrapper */
  /* This wrapper is now INSIDE FullscreenWrapper */
  :global(.interactive-exercise-content-wrapper) {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    gap: var(--space-s);
    margin-bottom: var(--space-s);
    /* background-color: var(--color-background); // REMOVED to allow parent background for gaps */
  }

  .dialog-area-wrapper {
    flex-shrink: 0;
  }

  .visualization-area-wrapper {
    position: relative;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    flex-grow: 1;
    min-height: 0;
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

  .instruction-area-wrapper {
    flex-shrink: 0;
    // Potentially add padding/margin here if needed, or let the Instruction component handle it
  }

  .controls-area-wrapper {
    flex-shrink: 0;
  }
</style>

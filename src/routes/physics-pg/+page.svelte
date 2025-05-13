<script lang="ts">
  import { T, Canvas } from "@threlte/core";
  import { World, Debug } from "@threlte/rapier";
  import Scene from "$lib/components/visualization/scenes/Scene.svelte";
  import { writable } from "svelte/store";
  import type { Writable } from "svelte/store";
  import { onMount, createEventDispatcher } from "svelte";

  // Imports from PhysicsPlayground.svelte
  import HudScene from "$lib/components/visualization/elements/layouts/HudScene.svelte";
  import RendererSetup from "$lib/components/visualization/helpers/RendererSetup.svelte";
  import { PerfMonitor } from "@threlte/extras";
  import ToolBarMain from "$lib/components/visualization/elements/ui/ToolbarMain.svelte";
  // Snippet type is not needed as we are not taking children prop anymore

  const currentSection: Writable<string> =
    writable<string>("physics-playground");

  // State for the selected control mode (was controlMode in PhysicsPlayground)
  let selectedControlMode: "drag" | "translate" = $state("drag"); // Made $state for reactivity with ToolBarMain

  // Reference to the Scene component instance
  let sceneComponent: Scene;

  // State from PhysicsPlayground.svelte
  let isFullscreen = $state(false);
  let containerElement: HTMLDivElement;

  // Effect from PhysicsPlayground.svelte
  $effect(() => {
    if (!isFullscreen && document.fullscreenElement === null) {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
      });
    }
  });

  // Fullscreen request handler from PhysicsPlayground.svelte
  async function handleFullscreenRequest() {
    if (!document.fullscreenElement) {
      try {
        if (containerElement) {
          // Ensure containerElement is defined
          await containerElement.requestFullscreen();
          isFullscreen = true;
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
        } else {
          console.error(
            "An unknown error occurred during fullscreen request.",
            err
          );
        }
      }
    } else {
      try {
        await document.exitFullscreen();
        isFullscreen = false;
      } catch (err) {
        if (err instanceof Error) {
          console.error(
            `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
          );
        } else {
          console.error(
            "An unknown error occurred during fullscreen exit.",
            err
          );
        }
      }
    }
  }

  // Handler to update the mode (was forwardModeChange in PhysicsPlayground, now directly sets selectedControlMode)
  function handleModeChange(
    event: CustomEvent<{ mode: "drag" | "translate" }>
  ) {
    selectedControlMode = event.detail.mode;
    // console.log('Page received mode change:', selectedControlMode); // For debugging
  }

  // Handler for the reset scene event (was handleResetScene in PhysicsPlayground, now directly calls sceneComponent.resetScene)
  function handleReset() {
    // console.log('Reset event received in page, calling Scene.resetScene()');
    if (sceneComponent) {
      sceneComponent.resetScene(); // Call the exported function
    }
    // Reset the control mode back to drag
    selectedControlMode = "drag";
    // console.log('Control mode reset to drag');
  }

  // Removed onMount that dynamically imported PhysicsPlaygroundComponent
  // Removed PhysicsPlaygroundComponent variable
</script>

<div class="page-container">
  <h1 class="title">Physics Playground</h1>
  <div class="physics-pg-container">
    <div
      bind:this={containerElement}
      class="visualization-container"
      class:fullscreen={isFullscreen}
    >
      <div class="ui-container">
        <HudScene
          {currentSection}
          bind:isFullscreen
          targetElement={containerElement}
          on:modechange={handleModeChange}
          on:resetscene={handleReset}
          on:requestToggle={handleFullscreenRequest}
        >
          <ToolBarMain bind:selectedMode={selectedControlMode} />
        </HudScene>
      </div>

      <Canvas>
        <RendererSetup />
        <World>
          <!-- Directly inserting Scene component here -->
          <Scene
            bind:this={sceneComponent}
            bind:controlMode={selectedControlMode}
          />
        </World>
        <PerfMonitor
          domElement={containerElement}
          anchorX={"right"}
          anchorY={"top"}
        />
      </Canvas>
    </div>
  </div>
  <p>This is a testbed for physics simulations.</p>
</div>

<style lang="scss">
  .title {
    font-size: var(--step-3);
    font-weight: 500;
    margin-top: var(--space-m);
  }
  .physics-pg-container {
    padding: var(--space-m);
    /* styles for visualization-container will be appended here */
  }

  /* Styles from PhysicsPlayground.svelte */
  .visualization-container {
    background-color: var(--color-background);
    /* margin-block: var(--space-xl); */
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    max-height: 800px;
    width: 100%;
    position: relative;
    border-radius: var(--radius-sm);
    aspect-ratio: 16 / 9;

    &.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      min-height: 100vh; /* Override min-height */
      border-radius: 0;
      border: none;
      z-index: 9999;
      aspect-ratio: auto;
    }

    @media (max-width: 768px) {
      aspect-ratio: 9/16;
      min-height: 300px;

      &.fullscreen {
        aspect-ratio: auto; /* Override aspect ratio for fullscreen on mobile */
        min-height: 100vh; /* Ensure full height on mobile fullscreen */
      }
    }
  }
</style>

<script lang="ts">
  import VisContainer from "../../VisContainer.svelte";
  import VectorBuilderScene from "./VectorBuilderScene.svelte";
  import VectorBuilderHud from "./VectorBuilderHud.svelte";
  import VectorInputPanel from "./VectorInputPanel.svelte";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import DialogBox from "../../elements/ui/DialogBox.svelte";
  import {
    showVectorBuilderDialog,
    vectorBuilderDialogTurns,
  } from "$lib/components/visualization/interactions/vector-builder/vectorBuilderState";
  import { fullscreenAction } from "$lib/actions/useFullscreen";

  // --- Fullscreen State & Logic ---
  let isFullscreen = $state(false);
  let exerciseWrapperElement: HTMLDivElement;

  // --- Dialog Key State ---
  let dialogKey = $state(0);

  onMount(() => {
    dialogKey += 1;
    // TODO: Add logic to increment dialogKey if a reset happens
  });

  // REMOVE OLD FULLSCREEN LOGIC (toggleFullscreen function and onMount listeners)
  // The new request function, to be called by HUD's event
  function requestToggleFullscreenDispatch() {
    if (exerciseWrapperElement) {
      exerciseWrapperElement.dispatchEvent(
        new CustomEvent("toggleFullscreenRequest", { detail: !isFullscreen })
      );
    }
  }
</script>

<div
  bind:this={exerciseWrapperElement}
  class="exercise-wrapper"
  class:fullscreen={isFullscreen}
  use:fullscreenAction={{
    isFullscreenStore: { set: (val) => (isFullscreen = val) },
  }}
>
  <!-- Render DialogBox OUTSIDE VisContainer when NOT fullscreen -->
  {#if $showVectorBuilderDialog && !isFullscreen}
    <div class="dialog-above-vis">
      {#key dialogKey}
        <DialogBox
          turns={$vectorBuilderDialogTurns}
          bind:show={$showVectorBuilderDialog}
        />
      {/key}
    </div>
  {/if}

  <!-- Render VectorInputPanel OUTSIDE VisContainer when NOT fullscreen -->
  {#if !isFullscreen}
    <div class="input-panel-outside-vis">
      <VectorInputPanel />
    </div>
  {/if}

  <!-- Wrapper for VisContainer and its Overlay -->
  <div class="vis-area-wrapper">
    <!-- UI Overlay Container -->
    <div class="ui-overlay">
      <VectorBuilderHud
        bind:isFullscreen
        on:requestToggleFullscreen={requestToggleFullscreenDispatch}
      />
    </div>

    <!-- VisContainer -->
    <VisContainer>
      <VectorBuilderScene />
    </VisContainer>
  </div>
</div>

<style>
  /* Wrapper for the visualization area and its overlay */
  .vis-area-wrapper {
    position: relative;
    width: 100%;
    order: 1;
    z-index: 1;
  }

  /* The transparent overlay for HUD elements */
  .ui-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none; /* Allows clicks through to canvas */
  }

  /* Style for the input panel when outside the vis area */
  .input-panel-outside-vis {
    width: 100%;
    box-sizing: border-box;
    margin-bottom: var(--space-s);
    order: 2;
  }

  /* Layout for non-fullscreen mode */
  .exercise-wrapper:not(.fullscreen) {
    display: flex;
    flex-direction: column;
  }

  /* Styles for fullscreen mode */
  .exercise-wrapper.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh; /* Fallback */
    height: -webkit-fill-available;
    max-height: 100vh; /* Fallback */
    max-height: -webkit-fill-available;
    border-radius: 0;
    border: none;
    z-index: 9999;
    padding: 0;
    pointer-events: auto; /* Allow events on wrapper in fullscreen */

    /* Hide non-visualization elements when fullscreen */
    & > .dialog-above-vis,
    & > .input-panel-outside-vis,
    & > h3,
    & > p:first-of-type {
      display: none;
    }

    /* Ensure vis area takes full space in fullscreen */
    & > .vis-area-wrapper {
      width: 100%;
      /* height: 100%; Remove or comment out */
      position: absolute; /* Position relative to the fixed parent */
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1;
    }

    /* Style VisContainer specifically in fullscreen */
    & > .vis-area-wrapper > :global(.visualization-container) {
      height: 100%;
      max-height: 100%;
      border: none;
      border-radius: 0;
      aspect-ratio: auto;
      z-index: 5;
      position: relative;
    }

    /* Style overlay specifically in fullscreen (optional, inherits z-index) */
    & > .vis-area-wrapper > .ui-overlay {
      z-index: 10; /* Inherited */
    }
  }

  /* Style for the dialog wrapper when above the vis */
  .dialog-above-vis {
    width: 100%;
    box-sizing: border-box;
    min-height: 110px;
    margin-bottom: var(--space-s);
    position: relative;
    order: 0;
  }
</style>

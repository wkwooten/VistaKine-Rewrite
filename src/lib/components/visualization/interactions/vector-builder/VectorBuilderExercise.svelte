<script lang="ts">
  import VisContainer from '../../VisContainer.svelte';
  import VectorBuilderScene from './VectorBuilderScene.svelte';
  import VectorBuilderHud from './VectorBuilderHud.svelte';
  import { HTML } from '@threlte/extras';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import DialogBox from '../../elements/ui/DialogBox.svelte'; // Import DialogBox
  import {
    showVectorBuilderDialog, // Import dialog state
    vectorBuilderDialogTurns // Import dialog state
  } from '$lib/stores/vectorBuilderState';

  // --- Fullscreen State & Logic ---
  let isFullscreen = $state(false);
  let exerciseWrapperElement: HTMLDivElement;

  // --- Dialog Key State ---
  let dialogKey = $state(0);

  // Increment key on mount for the initial dialog
  onMount(() => {
      dialogKey += 1;
      // TODO: Add logic to increment dialogKey if a reset happens
  });

  async function toggleFullscreen() {
    if (!browser || !exerciseWrapperElement) return;
    const newState = !isFullscreen;
    if (newState) {
      if (!document.fullscreenElement) {
        try {
          if (exerciseWrapperElement.requestFullscreen) {
            await exerciseWrapperElement.requestFullscreen();
          } else if ((exerciseWrapperElement as any).webkitRequestFullscreen) {
            await (exerciseWrapperElement as any).webkitRequestFullscreen();
          } else if ((exerciseWrapperElement as any).msRequestFullscreen) {
            await (exerciseWrapperElement as any).msRequestFullscreen();
          }
          isFullscreen = true;
        } catch (err) {
          console.error(`[VectorBuilderExercise] Error enabling fullscreen: ${err instanceof Error ? err.message : String(err)}`);
          isFullscreen = false;
        }
      }
    } else {
      if (document.fullscreenElement) {
        try {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen();
          } else if ((document as any).msExitFullscreen) {
            await (document as any).msExitFullscreen();
          }
          isFullscreen = false;
        } catch (err) {
          console.error(`[VectorBuilderExercise] Error disabling fullscreen: ${err instanceof Error ? err.message : String(err)}`);
        }
      } else {
        isFullscreen = false; // Sync state
      }
    }
  }

  onMount(() => {
    function handleFullscreenChange() {
      if (browser) {
        const browserIsFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
        if (isFullscreen !== browserIsFullscreen) {
          console.log(`[VectorBuilderExercise] Syncing fullscreen state.`);
          isFullscreen = browserIsFullscreen;
        }
      }
    }

    if (browser) {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('msfullscreenchange', handleFullscreenChange);
    }

    return () => {
      if (browser) {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      }
    };
  });
</script>

<h3>Vector Builder Exercise</h3>
<p>Define a start and end point to create and visualize a vector.</p>

<div
  bind:this={exerciseWrapperElement}
  class="exercise-wrapper"
  class:fullscreen={isFullscreen}
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

  <VisContainer>
    <VectorBuilderScene />

    <HTML fullscreen pointerEvents="none">
        <VectorBuilderHud
            bind:isFullscreen
            on:requestToggleFullscreen={toggleFullscreen}
        />
    </HTML>

  </VisContainer>

  <!-- Render DialogBox INSIDE the wrapper (overlay) when fullscreen -->
  {#if $showVectorBuilderDialog && isFullscreen}
    <div class="dialog-in-fullscreen">
     {#key dialogKey}
        <DialogBox
          turns={$vectorBuilderDialogTurns}
          bind:show={$showVectorBuilderDialog}
        />
      {/key}
    </div>
  {/if}

</div>

<style>
  .exercise-wrapper {
    display: flex;
    flex-direction: column;
    margin-block: var(--space-l);
    position: relative; /* Needed for potential absolute children like Dialog */
  }

  /* Ensure VisContainer allows pointer events on children */
  :global(.visualization-container) {
    pointer-events: auto;
  }

  /* Add styles for fullscreen mode */
  .exercise-wrapper.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    border: none;
    z-index: 9999;
    flex-direction: row; /* Ensure layout works with overlay */

    & > :global(.visualization-container) {
      width: 100%;
      height: 100%;
      max-height: 100vh;
      border: none;
      border-radius: 0;
    }

    & > .dialog-in-fullscreen {
      position: absolute;
      top: var(--space-m);
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 600px; /* Adjust as needed */
      z-index: 100; /* Ensure dialog is above HUD */
      pointer-events: auto; /* Allow dialog interaction */
    }
  }

  /* Style for the dialog wrapper when it's above the visualization */
  .dialog-above-vis {
    width: 100%;
    box-sizing: border-box;
    min-height: 110px; /* Adjust based on DialogBox content */
    margin-bottom: var(--space-s);
    position: relative;
  }
</style>
<script lang="ts">
  import VisContainer from '../../VisContainer.svelte';
  import VectorBuilderScene from './VectorBuilderScene.svelte';
  import VectorBuilderHud from './VectorBuilderHud.svelte';
  import VectorInputPanel from './VectorInputPanel.svelte';
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

<div
  bind:this={exerciseWrapperElement}
  class="exercise-wrapper"
  class:fullscreen={isFullscreen}
>
  <!-- Moved title and description inside -->
  <h3>Vector Builder Exercise</h3>
  <p>In the interactive visualization below, you can define your own vector in 3D space. Play around with its start and end points and see how the arrow changes length and direction.</p>

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


  <VisContainer>
    <VectorBuilderScene />

    <HTML fullscreen pointerEvents="none">
        <VectorBuilderHud
            bind:isFullscreen
            on:requestToggleFullscreen={toggleFullscreen}
        />
    </HTML>

  </VisContainer>

</div>

<style>
  .exercise-wrapper {
    display: flex;
    flex-direction: column;
    position: relative; /* Needed for potential absolute children like Dialog */
    /* Add border, background, padding */
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background-color: var(--bg-secondary);
    padding: var(--space-m) var(--space-xs); /* Adjusted padding */
    margin-bottom: var(--space-l); /* Add margin-bottom */
  }

  /* --- Styles for moved title/description --- */
  .exercise-wrapper > h3 { /* Target h3 directly */
      font-size: var(--step-2); /* Slightly smaller */
      font-weight: 600;
      margin-bottom: var(--space-s); /* Space below title */
      /* Resetting potential global heading margins */
      margin-top: 0;
  }
  .exercise-wrapper > p:first-of-type { /* Target first p */
      font-size: var(--step-0);
      margin-bottom: var(--space-m); /* Space below description */
      color: var(--color-text-secondary);
       /* Resetting potential global paragraph margins */
      margin-top: 0;
  }
  /* ------------------------------------------- */

  /* Ensure VisContainer allows pointer events on children */
  :global(.visualization-container) {
    pointer-events: auto;
    order: 1; /* Ensure VisContainer comes first in default flow */
  }

  /* Style for the input panel when it's outside the visualization */
  .input-panel-outside-vis {
    width: 100%; /* Take full width */
    box-sizing: border-box;
    margin-bottom: var(--space-s); /* Space below the panel */
    order: 2; /* Ensure it comes after the VisContainer in default flow */
  }

  /* Adjust exercise-wrapper for non-fullscreen */
  .exercise-wrapper:not(.fullscreen) {
      display: flex;
      flex-direction: column; /* Stack elements vertically */
  }


  /* Add styles for fullscreen mode */
  .exercise-wrapper.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh; /* Fallback */
    height: -webkit-fill-available; /* Use available height */
    max-height: 100vh; /* Fallback */
    max-height: -webkit-fill-available; /* Use available height */
    border-radius: 0;
    border: none;
    z-index: 9999;
    flex-direction: row; /* Ensure layout works with overlay */
    padding: 0; /* Remove padding in fullscreen */
    pointer-events: auto; /* Ensure wrapper passes events */

    /* Hide title and description when fullscreen */
    & > h3,
    & > p:first-of-type {
        display: none;
    }

    & > :global(.visualization-container) {
      width: 100%;
      height: 100%; /* Keep this as 100% to fill parent */
      max-height: 100%; /* Use parent's max-height implicitly */
      border: none;
      border-radius: 0;
      aspect-ratio: auto; /* Override aspect ratio in fullscreen */
    }

    /* Target expanded dialog as descendant, use :global() for nested classes */
    /* Removed rule for .dialog-in-fullscreen */

    /* Position collapsed dialog separately in top-right using :global() */
    /* Removed rule for .dialog-box.collapsed */

    /* Hide the outside panel when fullscreen */
    & > .input-panel-outside-vis {
        display: none;
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
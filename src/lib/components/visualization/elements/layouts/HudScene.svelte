<script lang="ts">
  import ToolbarMain from "../ui/ToolbarMain.svelte";
  import FullscreenButton from "../ui/FullscreenButton.svelte";
  import type { Writable } from "svelte/store";
  import { createEventDispatcher } from "svelte";
  import FBDMenu from "../ui/FBDMenu.svelte";
  import ResetButton from "../ui/ResetButton.svelte";
  import { isFBDMenuOpen } from "$lib/stores/uiStores"; // Import menu state store
  import {
    fbdVisibilityStore,
    type FBDVisibilityState,
  } from "$lib/stores/fbdStores"; // Import FBD visibility store

  export let currentSection: Writable<string>;
  export let isFullscreen: boolean;
  export let targetElement: HTMLDivElement;

  const dispatch = createEventDispatcher<{
    requestToggle: void;
    resetscene: void;
  }>();

  let width: number;
  let height: number;

  // Removed handleFullscreenToggle as the button only requests now
  // function handleFullscreenToggle(event: CustomEvent<boolean>) {
  // 	isFullscreen = event.detail;
  // }

  // Forward the request from the button to the parent component
  function forwardFullscreenRequest() {
    dispatch("requestToggle");
  }

  // $: console.log('Selected control mode in HudScene:', selectedControlMode); // Optional: Log changes

  // Reactive statement to clear FBD visibility when menu closes
  $: {
    if (!$isFBDMenuOpen) {
      // Check if any are currently visible before updating to avoid unnecessary updates
      let anyVisible = false;
      const unsub = fbdVisibilityStore.subscribe((current) => {
        anyVisible = Object.values(current).some((v) => v);
      });
      unsub(); // Unsubscribe immediately after reading

      if (anyVisible) {
        console.log("[HudScene] FBD Menu closed, hiding all vectors.");
        fbdVisibilityStore.update((current) => {
          const updated: FBDVisibilityState = { ...current };
          for (const key in updated) {
            updated[key as keyof FBDVisibilityState] = false;
          }
          return updated;
        });
      }
    }
  }
</script>

<div class="ui-container">
  <slot />
  <ResetButton on:resetscene={() => dispatch("resetscene")} />
  <!-- Conditionally render FBDMenu container based on store -->
  {#if $isFBDMenuOpen}
    <div class="fbd-menu-container">
      <FBDMenu />
    </div>
  {/if}
  <FullscreenButton
    on:requestToggle={forwardFullscreenRequest}
    {isFullscreen}
  />
</div>

<style lang="scss">
  .ui-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Allow clicks to pass through to the canvas */
    z-index: 10; /* Ensure UI is on top */
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Push toolbar to bottom, button to top */
    align-items: center;
  }

  :global(.ui-container > *) {
    pointer-events: auto; /* Make children of ui-container clickable */
  }

  :global(.ui-container .toolbar-main) {
    margin-top: auto; /* Push toolbar to bottom */
    margin-bottom: 1rem; /* Keep some spacing from bottom edge */
    align-self: center;
  }
  :global(.ui-container .fullscreen-button) {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  :global(.ui-container .fbd-menu-container) {
    position: absolute;
    top: 20%; /* Position below the reset button */
    left: var(--space-s);
    z-index: 11;
    padding: var(--space-s);
    border-radius: var(--radius-md);
  }

  :global(.ui-container .reset-button) {
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 11; /* Ensure it's above other UI elements if needed */
  }
  .hud-scene {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

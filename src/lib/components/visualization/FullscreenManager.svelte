<script lang="ts">
  import { fullscreenAction } from "$lib/actions/useFullscreen";
  import { browser } from "$app/environment";
  import type { Snippet } from "svelte";
  import type { Action } from "svelte/action";

  // Props
  let { active = $bindable(false), children } = $props<{
    active?: boolean;
    children: Snippet;
  }>();

  // Internal state
  let elementToMakeFullscreen: HTMLElement | undefined = $state();
  let internalIsFullscreen = $state(false);

  // Sync internalIsFullscreen with the bindable 'active' prop
  $effect(() => {
    internalIsFullscreen = active;
  });

  // When internalIsFullscreen changes (e.g., due to browser events via fullscreenAction),
  // update the bindable 'active' prop.
  $effect(() => {
    if (browser) {
      active = internalIsFullscreen;
    }
  });

  // Public method to toggle fullscreen
  export function toggle(force?: boolean) {
    if (!browser || !elementToMakeFullscreen) return;

    const shouldBeFullscreen =
      force !== undefined ? force : !internalIsFullscreen;

    console.log(
      `[FullscreenManager] toggle called. Should be fullscreen: ${shouldBeFullscreen}`
    );

    elementToMakeFullscreen.dispatchEvent(
      new CustomEvent("toggleFullscreenRequest", { detail: shouldBeFullscreen })
    );
  }

  // Props for the fullscreenAction
  const fullscreenActionOptions = {
    isFullscreenStore: {
      // Adhere to the store-like interface expected by fullscreenAction
      set: (value: boolean) => {
        console.log(
          `[FullscreenManager] isFullscreenStore.set called with: ${value}`
        );
        internalIsFullscreen = value;
      },
    },
  };
</script>

{#if browser}
  <div
    bind:this={elementToMakeFullscreen}
    use:fullscreenAction={fullscreenActionOptions}
    class="fullscreen-manager-wrapper"
  >
    {@render children()}
  </div>
{:else}
  <!-- Fallback for SSR or if browser is not available -->
  {@render children()}
{/if}

<style lang="scss">
  .fullscreen-manager-wrapper {
    width: 100%;
    height: 100%;
    position: relative; /* Or as needed by your layout */

    &:has(:fullscreen) {
      // More robust way to detect if a child is fullscreen
      // Potentially useful for styling the wrapper when content is fullscreen
      // but most styling will be on the content itself.
    }
  }
</style>

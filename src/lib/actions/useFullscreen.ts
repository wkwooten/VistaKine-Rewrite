import { browser } from '$app/environment';
import type { Action } from 'svelte/action';

interface FullscreenActionOptions {
  isFullscreenStore: { set: (value: boolean) => void }; // Writable store
}

/**
 * A Svelte action to manage fullscreen state for an HTML element.
 *
 * It listens for a custom 'toggleFullscreenRequest' event on the node to programmatically enter/exit fullscreen.
 * It also listens to browser fullscreenchange events to keep the store in sync.
 *
 * @param node The HTML element to make fullscreen.
 * @param options Options object containing `isFullscreenStore`, a Svelte writable store to sync the fullscreen state.
 */
export const fullscreenAction: Action<HTMLElement, FullscreenActionOptions> = (
  node,
  options
) => {
  if (!browser || !options) {
    return {
      destroy: () => {},
    };
  }

  const { isFullscreenStore } = options;

  const enterFullscreen = async () => {
    try {
      if (node.requestFullscreen) await node.requestFullscreen();
      else if ((node as any).webkitRequestFullscreen) await (node as any).webkitRequestFullscreen();
      else if ((node as any).msRequestFullscreen) await (node as any).msRequestFullscreen();
      // Note: Store is set by handleBrowserFullscreenChange to avoid race conditions
    } catch (err) {
      console.error(`Error enabling fullscreen: ${err instanceof Error ? err.message : String(err)}`);
      isFullscreenStore.set(false); // Explicitly set false on error
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen) await (document as any).webkitExitFullscreen();
      else if ((document as any).msExitFullscreen) await (document as any).msExitFullscreen();
      // Note: Store is set by handleBrowserFullscreenChange
    } catch (err) {
      console.error(`Error disabling fullscreen: ${err instanceof Error ? err.message : String(err)}`);
      // If error occurs, fullscreen might still be active or inactive, rely on browser event to sync
    }
  };

  // Listener for programmatic requests to toggle fullscreen
  const handleProgrammaticToggle = (event: CustomEvent<boolean>) => {
    const shouldBeFullscreen = event.detail;
    const currentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
    );

    if (shouldBeFullscreen && !currentlyFullscreen) {
      enterFullscreen();
    } else if (!shouldBeFullscreen && currentlyFullscreen) {
      exitFullscreen();
    }
  };

  // Listener for browser-initiated fullscreen changes (e.g., ESC key)
  const handleBrowserFullscreenChange = () => {
    const browserIsFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    );
    isFullscreenStore.set(browserIsFullscreen);
  };

  node.addEventListener('toggleFullscreenRequest', handleProgrammaticToggle as EventListener);
  document.addEventListener('fullscreenchange', handleBrowserFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleBrowserFullscreenChange);
  document.addEventListener('msfullscreenchange', handleBrowserFullscreenChange);

  // Initial sync in case the action is applied while already in fullscreen (e.g. hot-reloading)
  handleBrowserFullscreenChange();

  return {
    destroy: () => {
      node.removeEventListener('toggleFullscreenRequest', handleProgrammaticToggle as EventListener);
      document.removeEventListener('fullscreenchange', handleBrowserFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleBrowserFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleBrowserFullscreenChange);
    },
  };
};
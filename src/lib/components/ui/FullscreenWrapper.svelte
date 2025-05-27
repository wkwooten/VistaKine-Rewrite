<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount, onDestroy } from "svelte";
  import type { Snippet } from "svelte";

  let {
    active = $bindable(false),
    children,
    onStateChange,
    forcePseudo = false,
  } = $props<{
    active?: boolean;
    children: Snippet;
    onStateChange?: (isActive: boolean) => void;
    forcePseudo?: boolean;
  }>();

  let elementRef: HTMLElement | undefined = $state();
  let isPseudoFullscreen = $state(false);
  let nativeFullscreenPossible = $state(true); // Assume possible until first attempt
  let isIOS = $state(false);

  onMount(() => {
    if (browser) {
      isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream;
      if (isIOS) {
        console.log(
          "[FullscreenWrapper] iOS detected, native fullscreen will be bypassed."
        );
        nativeFullscreenPossible = false; // Effectively bypass native for iOS
      }
    }
  });

  // --- Native Fullscreen Logic (adapted from useFullscreen.ts) ---
  const enterNativeFullscreen = async () => {
    if (!elementRef || !nativeFullscreenPossible || isIOS) {
      // Added isIOS check
      if (isIOS && active) enterPseudoFullscreen(); // Directly go to pseudo if iOS and trying to activate
      return;
    }
    console.log("[FullscreenWrapper] Requesting native fullscreen.");
    try {
      if (elementRef.requestFullscreen) await elementRef.requestFullscreen();
      else if ((elementRef as any).webkitRequestFullscreen)
        await (elementRef as any).webkitRequestFullscreen(); // Safari
      else if ((elementRef as any).msRequestFullscreen)
        await (elementRef as any).msRequestFullscreen(); // IE11
      // Successfully entered native fullscreen, state will be updated by 'fullscreenchange' listener
    } catch (err) {
      console.warn(
        "[FullscreenWrapper] Error entering native fullscreen:",
        err
      );
      nativeFullscreenPossible = false; // Assume native is not possible after a failure
      // Fallback to pseudo if native failed
      if (active) {
        // only if still trying to be active
        enterPseudoFullscreen();
      }
    }
  };

  const exitNativeFullscreen = async () => {
    if (
      !document.fullscreenElement &&
      !(document as any).webkitFullscreenElement &&
      !(document as any).msFullscreenElement
    )
      return;
    console.log("[FullscreenWrapper] Exiting native fullscreen.");
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen)
        await (document as any).webkitExitFullscreen();
      else if ((document as any).msExitFullscreen)
        await (document as any).msExitFullscreen();
    } catch (err) {
      console.error(
        "[FullscreenWrapper] Error exiting native fullscreen:",
        err
      );
    }
  };

  const handleNativeFullscreenChange = () => {
    if (isIOS) return; // Ignore native changes if we are on iOS and forcing pseudo
    const isNativeActive = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    );
    console.log(
      "[FullscreenWrapper] Native fullscreenchange event. Is active:",
      isNativeActive
    );
    if (isNativeActive) {
      isPseudoFullscreen = false; // Ensure pseudo is off if native is on
    }
    // Only update 'active' if it's different, to avoid loops if 'active' was set programmatically
    if (active !== isNativeActive && !isPseudoFullscreen) {
      active = isNativeActive;
    }
  };

  // --- Pseudo Fullscreen Logic ---
  const enterPseudoFullscreen = () => {
    if (isPseudoFullscreen) return;
    console.log("[FullscreenWrapper] Entering pseudo fullscreen.");
    isPseudoFullscreen = true;
    if (!active) active = true; // Ensure parent knows we are active
  };

  const exitPseudoFullscreen = () => {
    if (!isPseudoFullscreen) return;
    console.log("[FullscreenWrapper] Exiting pseudo fullscreen.");
    isPseudoFullscreen = false;
    if (active) active = false; // Ensure parent knows we are not active
  };

  // --- Main Toggle Logic ---
  function toggleFullscreen(shouldBeActive: boolean) {
    console.log(
      `[FullscreenWrapper] toggleFullscreen called. Target active state: ${shouldBeActive}`
    );
    if (shouldBeActive) {
      if (forcePseudo || isIOS || !nativeFullscreenPossible) {
        // Added isIOS check
        enterPseudoFullscreen();
      } else {
        enterNativeFullscreen(); // Will fallback to pseudo if it fails and active is still true
      }
    } else {
      // Check native first only if not on iOS where we might be in pseudo-fullscreen
      if (
        !isIOS &&
        (document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).msFullscreenElement)
      ) {
        exitNativeFullscreen();
      }
      // Always check pseudo because native exit might not have triggered if iOS detection is imperfect or user hit Esc from native
      if (isPseudoFullscreen) {
        exitPseudoFullscreen();
      }
    }
  }

  // --- Effects ---
  $effect(() => {
    // Sync with external 'active' prop changes
    console.log(
      `[FullscreenWrapper] Effect: 'active' prop changed to ${active}. Current pseudo: ${isPseudoFullscreen}, Native possible: ${nativeFullscreenPossible}, iOS: ${isIOS}`
    );
    const isNativeActive =
      !isIOS &&
      !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );

    if (active) {
      // Try to activate if not already in the desired state
      if (!isNativeActive && !isPseudoFullscreen) {
        toggleFullscreen(true);
      }
    } else {
      // Try to deactivate if in any fullscreen state
      if (isNativeActive || isPseudoFullscreen) {
        toggleFullscreen(false);
      }
    }
  });

  $effect(() => {
    // Notify parent of state changes
    console.log(
      `[FullscreenWrapper] Effect: onStateChange. Active: ${active}, Pseudo: ${isPseudoFullscreen}`
    );
    onStateChange?.(active);
  });

  onMount(() => {
    if (!browser) return;
    // iOS detection is already done in the earlier onMount

    // Only add native listeners if not on iOS (or if we decide to still listen for other reasons)
    if (!isIOS) {
      document.addEventListener(
        "fullscreenchange",
        handleNativeFullscreenChange
      );
      document.addEventListener(
        "webkitfullscreenchange",
        handleNativeFullscreenChange
      ); // Safari (desktop)
      document.addEventListener(
        "msfullscreenchange",
        handleNativeFullscreenChange
      ); // IE11
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isPseudoFullscreen) {
        exitPseudoFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Initial check for native fullscreen state (only if not iOS)
    if (!isIOS) {
      handleNativeFullscreenChange();
    }

    return () => {
      if (!isIOS) {
        document.removeEventListener(
          "fullscreenchange",
          handleNativeFullscreenChange
        );
        document.removeEventListener(
          "webkitfullscreenchange",
          handleNativeFullscreenChange
        );
        document.removeEventListener(
          "msfullscreenchange",
          handleNativeFullscreenChange
        );
      }
      window.removeEventListener("keydown", handleKeyDown);
      // Ensure exiting fullscreen if component is destroyed while active
      if (active) {
        toggleFullscreen(false);
      }
    };
  });
</script>

<div
  bind:this={elementRef}
  class:pseudo-fullscreen={isPseudoFullscreen}
  class="fullscreen-wrapper-container"
>
  {@render children()}
</div>

<style>
  .fullscreen-wrapper-container {
    width: 100%;
    height: 100%;
    /* Base styles - component should fill its parent by default */
  }

  .pseudo-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh; /* Fallback for other browsers */
    height: -webkit-fill-available; /* More robust for iOS Safari */
    background-color: var(--color-background, #fff); /* Or a theme variable */
    z-index: 2147483647; /* Max z-index */
    overflow: auto; /* Ensure content scrolls if it overflows */
  }
</style>

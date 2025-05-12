<script lang="ts">
  import { page } from "$app/stores";
  import { onMount, onDestroy } from "svelte";
  import "../app.scss";
  import Navigation from "$lib/components/Navigation.svelte";
  import { sidebarExpanded } from "$lib/stores/appState";
  import { parallaxBackground } from "$lib/scripts/parallax";
  import { ChevronLeft, ChevronRight, Menu } from "lucide-svelte";
  import { browser } from "$app/environment";
  import SectionMap from "$lib/components/ui/SectionMap.svelte";
  import { sectionMapOpen } from "$lib/stores/uiStores";
  import { updateThemeColors } from "$lib/stores/themeColors";
  import Footer from "$lib/components/Footer.svelte";

  let { children } = $props(); // Add children prop

  let mobileNavOpen = $state(false);
  let isMobile = $state(false);
  let lgBreakpointValue = 1024; // Default fallback (numeric)

  let mainContentElement: HTMLElement | null = null;
  let navBarHeight = 80; // Default height, will try to read from CSS

  function checkMobile() {
    if (browser) {
      isMobile = window.innerWidth <= lgBreakpointValue;
      if (!isMobile && mobileNavOpen) {
        mobileNavOpen = false;
      }
    }
  }

  onMount(() => {
    parallaxBackground();
    updateThemeColors();

    if (browser) {
      // Read CSS variables
      try {
        const styles = getComputedStyle(document.documentElement);
        const bpValueString = styles.getPropertyValue("--breakpoint-lg").trim();
        if (bpValueString) {
          const parsedValue = parseInt(bpValueString, 10);
          if (!isNaN(parsedValue)) {
            lgBreakpointValue = parsedValue;
          }
        }
        const navHeightString = styles
          .getPropertyValue("--navbar-height")
          .trim();
        if (navHeightString) {
          const parsedNavHeight = parseInt(navHeightString, 10);
          if (!isNaN(parsedNavHeight)) {
            navBarHeight = parsedNavHeight;
          }
        }
      } catch (error) {
        console.error("Error reading CSS variables:", error);
      }

      window.addEventListener("resize", checkMobile);

      // Initial check
      checkMobile();
    }

    return () => {
      if (browser) {
        window.removeEventListener("resize", checkMobile);
      }
    };
  });

  function toggleDesktopSidebar() {
    $sidebarExpanded = !$sidebarExpanded;
  }

  function toggleMobileSidebar() {
    mobileNavOpen = !mobileNavOpen;
  }

  function closeMobileSidebar() {
    mobileNavOpen = false;
  }

  let currentChapterSlug = $derived($page.params.slug || null);
  let currentSectionSlug = $derived($page.params.section || null);

  // CONVERT $: assignment to $derived
  // $: currentChapterSlug = $page.params.slug || null; // Get slug from route params
</script>

<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- Mobile Menu Button - REMOVED from here -->
<!-- {#if isMobile} ... {/if} -->

<div class="parallax-background">
  <div class="grid-background"></div>

  <!-- <svg
    class="bg-svg-illustration svg-illustration-1"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="80" fill="rgba(255, 255, 255, 0.05)" />
  </svg>

  <svg
    class="bg-svg-illustration svg-illustration-2"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="20"
      y="20"
      width="160"
      height="160"
      fill="rgba(255, 255, 255, 0.05)"
    />
  </svg> -->
</div>

<div
  class="app-container"
  class:sidebar-collapsed={!$sidebarExpanded}
  class:mobile-nav-active={mobileNavOpen}
>
  <!-- Mobile Menu Button - MOVED here -->
  {#if isMobile}
    <button
      class="mobile-menu-button"
      onclick={toggleMobileSidebar}
      aria-label="Open Menu"
      type="button"
    >
      <Menu size={24} />
    </button>
  {/if}

  <aside
    class="navigation"
    class:collapsed={!isMobile && !$sidebarExpanded}
    class:mobile-open={mobileNavOpen}
  >
    <Navigation {currentChapterSlug} {isMobile} />
    {#if !isMobile}
      <button
        class="sidebar-toggle-button"
        onclick={toggleDesktopSidebar}
        aria-label="Toggle Sidebar"
        title="Toggle Sidebar"
      >
        {#if $sidebarExpanded}
          <ChevronLeft size={18} stroke-width="3" />
        {:else}
          <ChevronRight size={18} stroke-width="3" />
        {/if}
      </button>
    {/if}
  </aside>

  {#if isMobile && mobileNavOpen}
    <div
      class="mobile-overlay active"
      onclick={closeMobileSidebar}
      onkeydown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          closeMobileSidebar();
        }
      }}
      role="button"
      tabindex="0"
      aria-label="Close Menu"
    ></div>
  {:else if !isMobile && mobileNavOpen}
    <script>
      if (browser) {
        console.warn(
          "[Layout Debug] Mobile overlay was open on desktop. Forcing closed."
        );
        mobileNavOpen = false;
      }
    </script>
  {/if}

  <main class="content" bind:this={mainContentElement}>
    <!-- REMOVE Top Nav Bar -->
    <!-- <div class="top-nav-bar" class:hidden={!topNavVisible}> ... </div> -->

    <!-- REVERT: Remove column wrapper, place content and map directly -->
    <!-- REMOVE .main-content-and-map-wrapper -->
    <!-- Simply render children within the u-container -->
    <div class="u-container">
      {@render children()}
      <Footer />
    </div>
    <!-- REMOVE SectionMap rendering from here -->
    <!-- {#if currentSectionSlug}
        <SectionMap
          bind:isOpen={$sectionMapOpen}
          sectionSlug={currentSectionSlug}
        />
      {/if} -->
  </main>
</div>

<style lang="scss">
  @use "$lib/styles/variables" as variables;

  .parallax-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .app-container {
    height: 100vh;
    width: 100%;
    position: relative;
    z-index: 2;
    display: flex; // Use flex for main layout

    &.mobile-nav-active {
      .mobile-menu-button {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    }
  }

  .navigation {
    // Keep most styles, ensure width uses variable
    display: flex;
    align-items: stretch;
    height: 100vh;
    z-index: 1001;
    position: fixed; // Keep fixed positioning
    top: 0;
    left: 0;
    /* width: var(--sidebar-width); // Use variable for expanded width
    transition: width var(--sidebar-transition-duration)
      var(--sidebar-transition-timing); // Keep transition */

    & > :first-child {
      flex-grow: 1;
      min-width: 0;
      width: 100%; // Make inner nav take full width of container
    }

    @media (max-width: variables.$breakpoint-lg) {
      // Keep mobile overlay styles
      position: fixed;
      top: 0;
      left: 0;
      width: 300px;
      max-width: 80%;
      transform: translateX(-100%);
      transition: transform 0.3s ease; // Keep mobile transition
      background-color: var(--sidebar-background, var(--color-background));
      flex-direction: column;
      align-items: initial;
      height: 100vh;
      z-index: 1050;

      & > nav {
        width: 100% !important;
        transition: none !important;
        max-width: none !important;
      }

      &.mobile-open {
        transform: translateX(0);
      }

      .sidebar-toggle-button {
        display: none;
      }
    }
  }

  .sidebar-toggle-button {
    // Keep existing styles
    z-index: 1002;
    flex-shrink: 0;
    width: 30px;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    padding: 0;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    border-left: none;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    color: var(--color-text-primary);
    transition:
      background-color 0.2s ease,
      box-shadow 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      border-color: var(--color-border-hover);
      box-shadow: var(--shadow-md);
      color: var(--color-accent);
    }
  }

  .content {
    flex-grow: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
    // REMOVE fixed margin-left. Let content flow naturally.
    position: relative; /* Needed for sticky positioning context */

    @media (max-width: variables.$breakpoint-lg) {
      // REMOVE margin-left: 0; // No margin needed on mobile
    }
  }

  /* REMOVE styles for the top navigation bar */
  /* .top-nav-bar { ... } */

  .mobile-overlay {
    // Keep existing styles
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1040;
    display: none;

    &.active {
      display: block;
    }
  }

  .mobile-menu-button {
    // Keep existing styles
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: var(--space-s, 10px);
    left: var(--space-s, 10px);
    z-index: 1060;
    background-color: var(--color-background, white);
    border: 1px solid var(--color-border, #ccc);
    border-radius: var(--radius-sm, 4px);
    padding: var(--space-xs, 8px);
    cursor: pointer;
    box-shadow: var(--shadow-md);
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
    opacity: 1;
    visibility: visible;
  }

  .skip-link {
    // Keep existing styles
    position: absolute;
    left: -9999px;
    color: var(--color-text-primary);
  }

  /* Keep .u-container styles - This will now wrap all children */
  .u-container {
    min-height: 1px;
    width: 100%; // Ensure it takes available width
    max-width: var(--max-content-width, 1400px);
    margin-inline: auto;
    padding: var(--space-m);
    box-sizing: border-box;

    @media (max-width: variables.$breakpoint-lg) {
      padding: var(--space-s);
    }
  }

  // REMOVE styles for the specific section+map wrapper
  /* .main-content-and-map-wrapper { ... } */
  /* .main-slot-container { ... } */
  /* :global(.section-map-container) { ... } */
</style>

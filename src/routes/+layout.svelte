<script lang="ts">
  import { page } from "$app/stores";
  import { onMount, onDestroy } from "svelte";
  import "../app.scss";
  import Navigation from "$lib/components/Navigation.svelte";
  import PageNav from "$lib/components/PageNav.svelte";
  import { sidebarExpanded } from "$lib/stores/appState";
  import { parallaxBackground } from "$lib/scripts/parallax";
  import { ChevronLeft, ChevronRight, Menu } from "lucide-svelte";
  import { browser } from "$app/environment";

  let { children } = $props(); // Add children prop

  let mobileNavOpen = false;
  let isMobile = false;
  let lgBreakpointValue = 1024; // Default fallback (numeric)

  // State for top nav visibility and scroll tracking - Use Svelte 5 $state rune correctly
  let topNavVisible = $state(true);
  let lastScrollY = $state(0);
  let mainContentElement: HTMLElement | null = null;
  let navBarHeight = 80; // Default height, will try to read from CSS

  // Define handlers outside the if (browser) block
  function handleScroll() {
    if (!mainContentElement) return;
    const currentScrollY = mainContentElement.scrollTop;
    if (currentScrollY < navBarHeight) {
      topNavVisible = true;
    } else if (currentScrollY > lastScrollY) {
      topNavVisible = false;
    } else {
      topNavVisible = true;
    }
    lastScrollY = currentScrollY;
  }

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

      // Add listeners
      if (mainContentElement) {
        mainContentElement.addEventListener("scroll", handleScroll, {
          passive: true,
        });
      } else {
        console.warn("Main content element not found for scroll listener.");
      }
      window.addEventListener("resize", checkMobile);

      // Initial check
      checkMobile();
    }

    return () => {
      if (browser) {
        window.removeEventListener("resize", checkMobile);
        if (mainContentElement) {
          mainContentElement.removeEventListener("scroll", handleScroll);
        }
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

  // CONVERT $: assignment to $derived
  // $: currentChapterSlug = $page.params.slug || null; // Get slug from route params
</script>

<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- Mobile Menu Button - REMOVED from here -->
<!-- {#if isMobile} ... {/if} -->

<div class="parallax-background">
  <div class="grid-background"></div>

  <svg
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
  </svg>
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
  {/if}

  <main class="content" bind:this={mainContentElement}>
    <div class="top-nav-bar" class:hidden={!topNavVisible}>
      <!-- New Wrapper Structure -->
      <div class="page-nav-wrapper">
        <!-- Container for the actual PageNav -->
        <div class="page-nav-container">
          <!-- Render PageNav directly if data exists -->
          {#if $page.data.prevSection !== undefined || $page.data.nextSection !== undefined || $page.data.prevChapter !== undefined || $page.data.nextChapter !== undefined || $page.data.currentChapterSlug}
            <PageNav
              prevSection={$page.data.prevSection}
              nextSection={$page.data.nextSection}
              prevChapter={$page.data.prevChapter}
              nextChapter={$page.data.nextChapter}
              currentChapterSlug={$page.data.currentChapterSlug}
              currentChapterTitle={$page.data.chapterTitle}
              currentChapterNumber={$page.data.chapterNumber}
            />
          {/if}
        </div>
        <!-- Empty spacer to represent SectionMap width on desktop -->
        <div class="page-nav-spacer"></div>
      </div>
    </div>
    {@render children()}
  </main>
</div>

<style lang="scss">
  @use "$lib/styles/variables" as variables;

  .app-container {
    height: 100vh;
    width: 100%;
    position: relative;
    z-index: 2;

    &.mobile-nav-active {
      .mobile-menu-button {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    }
  }

  .navigation {
    display: flex;
    align-items: stretch;
    height: 100vh;
    z-index: 1001;
    position: fixed;
    top: 0;
    left: 0;

    & > :first-child {
      flex-grow: 1;
      min-width: 0;
      width: 100%;
    }

    @media (max-width: variables.$breakpoint-lg) {
      position: fixed;
      top: 0;
      left: 0;
      width: 300px;
      max-width: 80%;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
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

    @media (max-width: variables.$breakpoint-lg) {
      // display: none;
    }
  }

  .content {
    flex-grow: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
    margin-left: 80px;
    position: relative; /* Needed for sticky positioning context */
    /* Add padding-top to prevent content from being hidden by sticky top bar */
    /* padding-top: 40px; */

    @media (max-width: variables.$breakpoint-lg) {
      margin-left: 0;
      /* Use mobile specific padding or inherit base */

      /* Remove the extra padding-bottom added for the bottom bar */
      /* padding-bottom: calc(40px + var(--space-s)); REMOVED */
    }
  }

  /* Styles for the top navigation bar */
  .top-nav-bar {
    position: sticky;
    top: 0; /* Changed from bottom */
    left: 0;
    width: 100%;
    height: var(--navbar-height, 80px); // Use variable or default
    background-color: var(
      --color-background-alt,
      var(--color-background)
    ); /* Slightly different bg or fallback */
    border-bottom: 1px solid var(--color-border); /* Changed from border-top */
    z-index: 10; /* Ensure it's above content but below overlays/modals if any */
    display: flex; /* Use flex to easily center/align content */
    align-items: center;
    justify-content: center; /* Center the wrapper inside */
    transition: transform 0.3s ease; // ADD transition for hiding

    // ADD style for hidden state
    &.hidden {
      transform: translateY(-100%);
    }

    // ADD styles for the wrapper structure
    .page-nav-wrapper {
      display: flex;
      justify-content: center; // Center items within the wrapper
      align-items: center; // Align items vertically
      width: 100%;
      gap: var(--space-l, 1rem); // Match SectionTemplate gap
      // Optional: Set max-width similar to SectionTemplate's container
      // max-width: calc(var(--wide-content-width, 800px) + var(--section-map-width, 220px) + var(--space-l, 1rem));
      padding-inline: var(--space-s); // Add horizontal padding
    }

    .page-nav-container {
      flex: 1; // Takes up space left by spacer
      max-width: var(--wide-content-width, 800px); // Match main content width
      min-width: 0;
      display: flex; // Needed to contain the PageNav properly
      justify-content: center;
      align-items: center;
      height: 100%; // Take full height of bar
    }

    .page-nav-spacer {
      width: var(--section-map-width, 220px); // Mimic SectionMap width
      flex-shrink: 0;
    }

    /* Remove default padding/margin/width from PageNav when inside the bar */
    // MODIFY existing global rule
    :global(.page-nav) {
      padding: 0 !important; // Remove internal padding
      margin: 0 !important; // Remove internal margin
      border: none !important; // Remove internal border
      width: 100%;
      height: 100%;
      // REMOVE max-width & margin: 0 auto - handled by container now
      // max-width: var(--max-content-width, 1200px);
      // margin: 0 auto;
      // REMOVE padding-inline - handled by wrapper now
      // padding-inline: var(--space-s);
    }

    @media (max-width: variables.$breakpoint-lg) {
      background-color: var(
        --color-background
      ); /* Match main background on mobile maybe? */

      // ADD mobile adjustments for wrapper structure
      .page-nav-wrapper {
        gap: 0;
        padding-inline: 0; // Use PageNav's internal padding on mobile? Or adjust here.
      }
      .page-nav-spacer {
        display: none; // Hide spacer on mobile
      }
      .page-nav-container {
        max-width: 100%; // Allow container to be full width
      }
      // Ensure PageNav internal padding is restored/correct on mobile if needed
      // Might need adjustments depending on desired mobile PageNav appearance
      :global(.page-nav) {
        padding: 0 var(--space-s) !important; // Example: restore horizontal padding
      }
    }
  }

  .mobile-overlay {
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
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: var(--space-s, 10px);
    right: var(--space-s, 10px);
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
    position: absolute;
    left: -9999px;
    color: var(--color-text-primary);
  }
</style>

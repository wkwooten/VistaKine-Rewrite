<script lang="ts">
  import { page } from "$app/stores";
  import { onMount, onDestroy } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import "../app.scss";
  import Navigation from "$lib/components/Navigation.svelte";
  import { sidebarExpanded, currentChapter } from "$lib/stores/appState";
  import { parallaxBackground } from "$lib/scripts/parallax";
  import { ChevronLeft, ChevronRight, Menu } from "lucide-svelte";
  import { browser } from "$app/environment";
  import SectionMap from "$lib/components/ui/SectionMap.svelte";
  import { sectionMapOpen } from "$lib/stores/uiStores";
  import { updateThemeColors } from "$lib/stores/themeColors";
  import Footer from "$lib/components/Footer.svelte";
  import AuthWidget from "$lib/components/AuthWidget.svelte";
  import { inject } from "@vercel/analytics";

  inject();

  let { children } = $props();

  let mobileNavOpen = $state(false);
  let isMobile = $state(false);
  let lgBreakpointValue = 1024;

  let mainContentElement: HTMLElement | null = null;
  let navBarHeight = 80;

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

  afterNavigate((navigation) => {
    if (browser) {
      const routeId = navigation.to?.route?.id;
      const chapterSlugParam = navigation.to?.params?.slug;

      if (
        routeId &&
        (routeId.startsWith("/chapter/[slug]/[section]") ||
          routeId === "/chapter/[slug]")
      ) {
        if (chapterSlugParam) {
          currentChapter.set(chapterSlugParam);
        } else {
          console.warn(
            "[Layout] Chapter route detected but no slug param found. Clearing chapter."
          );
          currentChapter.set(null);
        }
      } else {
        currentChapter.set(null);
      }
    }
  });
</script>

<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<div class="parallax-background">
  <div class="grid-background"></div>
</div>

<div
  class="app-container"
  class:sidebar-collapsed={!$sidebarExpanded}
  class:mobile-nav-active={mobileNavOpen}
>
  <div class="auth-widget">
    <AuthWidget />
  </div>

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
    <Navigation {currentChapterSlug} initialIsMobile={isMobile} />
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
    <div class="u-container">
      {@render children()}
      <Footer />
    </div>
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
    display: flex;

    &.mobile-nav-active {
      .mobile-menu-button {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      & > .content {
        overflow: hidden;
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
  }

  .content {
    flex-grow: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
    position: relative;

    @media (max-width: variables.$breakpoint-lg) {
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
    top: var(--space-m, 10px);
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
    position: absolute;
    left: -9999px;
    color: var(--color-text-primary);
  }

  .u-container {
    min-height: 1px;
    width: 100%;
    max-width: var(--max-content-width, 1400px);
    margin-inline: auto;
    padding: var(--space-m);
    box-sizing: border-box;

    @media (max-width: variables.$breakpoint-lg) {
      padding: var(--space-s);
    }
  }

  .auth-widget {
    position: fixed;
    top: var(--space-s, 10px);
    right: var(--space-s, 10px);
    z-index: 1100;
  }
</style>

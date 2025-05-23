<script lang="ts">
  import { page } from "$app/stores";
  import { onMount, onDestroy } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import "../app.scss";
  import Navigation from "$lib/components/Navigation.svelte";
  import { sidebarExpanded, currentChapter } from "$lib/stores/appState";
  import { authState } from "$lib/stores/auth";
  import { parallaxBackground } from "$lib/scripts/parallax";
  import {
    ChevronLeft,
    ChevronRight,
    Menu,
    User as UserIcon,
  } from "lucide-svelte";
  import { browser } from "$app/environment";
  import SectionMap from "$lib/components/ui/SectionMap.svelte";
  import { sectionMapOpen } from "$lib/stores/uiStores";
  import { updateThemeColors } from "$lib/stores/themeColors";
  import Footer from "$lib/components/Footer.svelte";
  import { supabase } from "$lib/supabaseClient";

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

  // ADDED: afterNavigate logic to update currentChapter store
  afterNavigate((navigation) => {
    if (browser) {
      // Ensure this runs only on the client
      const routeId = navigation.to?.route?.id;
      const chapterSlugParam = navigation.to?.params?.slug;

      // Check if it's a chapter page (either chapter intro or a specific section)
      if (
        routeId &&
        (routeId.startsWith("/chapter/[slug]/[section]") ||
          routeId === "/chapter/[slug]")
      ) {
        if (chapterSlugParam) {
          currentChapter.set(chapterSlugParam);
        } else {
          // This case should ideally not happen if routeId implies a slug exists
          console.warn(
            "[Layout] Chapter route detected but no slug param found. Clearing chapter."
          );
          currentChapter.set(null);
        }
      } else {
        // Not a chapter page, clear the current chapter
        currentChapter.set(null);
      }
    }
  });

  // Helper for logout
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      alert(error.message);
    } else {
      console.log("User signed out");
      // authState store updates automatically via onAuthStateChange
      // goto('/'); // Optional: redirect to home or login page
    }
  }
</script>

<div class="auth-widget-component">
  {#if $authState.isAuthenticated && $authState.user}
    {@const user = $authState.user}
    <div class="user-profile">
      <div class="avatar-container">
        {#if user.avatar_url}
          <img src={user.avatar_url} alt="User avatar" class="avatar-image" />
        {:else}
          <UserIcon size={24} class="avatar-placeholder" />
        {/if}
      </div>
      <div class="user-details">
        <span class="username">{user.username}</span>
        <button class="sign-out-button" onclick={handleLogout}>Sign out</button>
      </div>
    </div>
  {:else if !$authState.loading}
    <!-- Only show login/signup if not loading -->
    <div class="auth-buttons">
      <a href="/signup" class="auth-button sign-up-button">Sign Up</a>
      <a href="/login" class="auth-button sign-in-button">Sign In</a>
    </div>
  {:else}
    <!-- Optional: Show a loading indicator -->
    <div class="auth-loading">Loading...</div>
  {/if}
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

      // Prevent scrolling on the main content when the mobile nav is active
      & > .content {
        overflow: hidden;
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

  /* ADDED: Auth Widget Styles */
  .auth-widget {
    position: fixed; /* Or absolute if app-container is the positioning context */
    top: var(--space-s, 10px);
    right: var(--space-s, 10px);
    z-index: 1100; /* Ensure it's above most other elements */
    display: flex;
    gap: var(--space-xs, 8px);
  }

  .auth-buttons {
    display: flex;
    padding: var(--space-2xs) var(--space-xs);
    background-color: var(--color-background);
    gap: var(--space-xs, 8px);
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
  }

  .auth-button {
    padding: var(--space-xs) var(--space-s);
    border: 1px solid var(--color-border);
    color: var(--color-text-primary);
    text-decoration: none;
    border-radius: var(--radius-sm);
    font-size: var(--step--1);
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      background-color: var(--color-surface-hover);
      border-color: var(--color-border-hover);
    }

    &.sign-up-button {
      /* Optional: different styling for sign up */
    }
    &.sign-in-button {
      /* Optional: different styling for sign in */
    }
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    background-color: var(--color-surface-raised);
    padding: var(--space-xs) var(--space-s);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .avatar-container {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--color-surface-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden; /* To clip avatar image if it's not perfectly round */
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    color: var(--color-text-secondary);
  }

  .user-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: var(--step--1);
  }

  .username {
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .sign-out-button {
    background: none;
    border: none;
    padding: 0;
    color: var(--color-text-secondary);
    text-decoration: underline;
    cursor: pointer;
    font-size: var(--step--2);

    &:hover {
      color: var(--color-accent);
    }
  }

  .auth-loading {
    padding: var(--space-xs) var(--space-s);
    font-size: var(--step--1);
    color: var(--color-text-secondary);
  }

  // REMOVE styles for the specific section+map wrapper
  /* .main-content-and-map-wrapper { ... } */
  /* .main-slot-container { ... } */
  /* :global(.section-map-container) { ... } */
</style>

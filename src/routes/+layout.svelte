<meta name="viewport" content="width=device-width, initial-scale=1.0">

<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import '../app.scss';
  import Navigation from '$lib/components/Navigation.svelte';
  import { sidebarExpanded } from '$lib/stores/appState';
  import { parallaxBackground } from '$lib/scripts/parallax';
  import { ChevronLeft, ChevronRight, Menu } from 'lucide-svelte';
  import { browser } from '$app/environment';

  let mobileNavOpen = false;
  let isMobile = false;

  onMount(() => {
    parallaxBackground();

    function checkMobile() {
      if (browser) {
        isMobile = window.innerWidth <= 768;
        if (!isMobile && mobileNavOpen) {
          mobileNavOpen = false;
        }
      }
    }

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      if (browser) {
        window.removeEventListener('resize', checkMobile);
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
</script>

<!-- Mobile Menu Button - REMOVED from here -->
<!-- {#if isMobile} ... {/if} -->

<div class="parallax-background">
  <div class="grid-background"></div>

  <svg class="bg-svg-illustration svg-illustration-1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="rgba(255, 255, 255, 0.05)" />
  </svg>

  <svg class="bg-svg-illustration svg-illustration-2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="160" height="160" fill="rgba(255, 255, 255, 0.05)" />
  </svg>
</div>

<div class="app-container"
     class:sidebar-collapsed={!$sidebarExpanded}
     class:mobile-nav-active={mobileNavOpen}
>
  <!-- Mobile Menu Button - MOVED here -->
  {#if isMobile}
    <button class="mobile-menu-button" on:click={toggleMobileSidebar} aria-label="Open Menu" type="button">
      <Menu size={24} />
    </button >
  {/if}

  <aside class="navigation" class:collapsed={!$sidebarExpanded} class:mobile-open={mobileNavOpen}>
    <Navigation />
    {#if !isMobile}
      <button
        class="sidebar-toggle-button"
        on:click={toggleDesktopSidebar}
        aria-label="Toggle Sidebar"
        title="Toggle Sidebar"
      >
        {#if $sidebarExpanded}
          <ChevronLeft size={18} stroke-width="3"/>
        {:else}
          <ChevronRight size={18} stroke-width="3"/>
        {/if}
      </button >
    {/if}
  </aside >

  {#if isMobile && mobileNavOpen}
    <div class="mobile-overlay active" on:click={closeMobileSidebar} role="button" tabindex="0" aria-label="Close Menu"></div>
  {/if}

  <main class="content">
    <slot />
  </main >
</div >

<style lang="scss">
  .app-container {
    height: 100vh;
    width: 100%;
    position: relative;
    z-index: 2;
    display: flex;
    transition: all var(--sidebar-transition-duration, 0.3s) var(--sidebar-transition-timing, ease);

    &.mobile-nav-active {
      .mobile-menu-button {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    }
  }

  .navigation {
    flex-shrink: 0;
    display: flex;
    align-items: stretch;
    height: 100vh;
    z-index: 1001;
    width: 330px;
    transition: width var(--sidebar-transition-duration, 0.3s) var(--sidebar-transition-timing, ease);

    & > :first-child {
        flex-grow: 1;
        min-width: 0;
        width: 100%;
    }

    &.collapsed {
      width: 110px;
    }

    @media (max-width: 768px) {
      position: fixed;
      top: 0;
      left: 0;
      width: 300px;
      max-width: 80%;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      background-color: var(--sidebar-background, var(--background-color));
      box-shadow: var(--shadow-lg);
      flex-direction: column;
      align-items: initial;
      height: 100vh;
      z-index: 1050;

      &.mobile-open {
        transform: translateX(0);
      }

      &.collapsed {
         width: 300px;
         max-width: 80%;
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
      background-color: var(--background-color);
      border: 1px solid var(--border-color);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      border-left: none;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      color: var(--text-color);
      transition: background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, border-color 0.2s ease;

      &:hover {
          background-color: var(--background-color-offset);
          border-color: var(--border-color-hover);
          box-shadow: var(--shadow-md);
          color: var(--primary-color);
      }

      @media (max-width: 768px) {
        // display: none;
      }
  }

  .content {
    flex-grow: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
    padding-inline: var(--space-m);

    @media (max-width: 768px) {
      margin-left: 0;
      padding: 5px;
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
    top: var(--space-s, 10px);
    left: var(--space-s, 10px);
    z-index: 1060;
    background-color: var(--background-color, white);
    border: 1px solid var(--border-color, #ccc);
    border-radius: var(--radius-sm, 4px);
    padding: var(--space-xs, 8px);
    cursor: pointer;
    box-shadow: var(--shadow-md);
    transition: opacity 0.3s ease, visibility 0.3s ease;
    opacity: 1;
    visibility: visible;
  }
</style>
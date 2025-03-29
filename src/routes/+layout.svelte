<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import '../app.scss';
  import Navigation from '$lib/components/Navigation.svelte';
  import { sidebarExpanded } from '$lib/stores/appState';
  import { parallaxBackground } from '$lib/scripts/parallax';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  onMount(() => {
    parallaxBackground();
  });

  function handleClick() {
    $sidebarExpanded = !$sidebarExpanded;
  }
</script>

<div class="parallax-background">
  <div class="grid-background"></div>

  <svg class="bg-svg-illustration svg-illustration-1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="rgba(255, 255, 255, 0.05)" />
  </svg>

  <svg class="bg-svg-illustration svg-illustration-2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="160" height="160" fill="rgba(255, 255, 255, 0.05)" />
  </svg>
</div>

<div class="app-container" class:sidebar-collapsed={!$sidebarExpanded}>
  <aside class="navigation" class:collapsed={!$sidebarExpanded}>
    <Navigation />
    <button
      class="sidebar-toggle-button"
      on:click={handleClick}
      aria-label="Toggle Sidebar"
      title="Toggle Sidebar"
    >
      {#if $sidebarExpanded}
        <ChevronLeft size={18} stroke-width="3"/>
      {:else}
        <ChevronRight size={18} stroke-width="3"/>
      {/if}
    </button>
  </aside>

  <main class="content">
    <slot />
  </main>
</div>

<style lang="scss">
  .app-container {
    height: 100vh;
    width: 100%;
    position: relative;
    z-index: 2;
    display: flex;
  }

  .navigation {
    flex-shrink: 0;
    display: flex;
    align-items: stretch;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1001;

    & > :first-child {
        flex-grow: 1;
        min-width: 0;
        width: 100%;
    }

    &.collapsed {
    }

    @media (max-width: 768px) {
      display: block;
      position: static;
      height: auto;
      width: auto;
      z-index: auto;
      transition: none;

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
  }

  .content {
    flex-grow: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
    padding-inline: var(--space-m);
  }

  @media (max-width: 768px) {
    .app-container { display: block; }
    .content { margin-left: 0; padding: var(--space-s); }
  }
</style>
<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import '../app.scss';
  import Navigation from '$lib/components/Navigation.svelte';
  import { sidebarExpanded } from '$lib/stores/appState';
  import { parallaxBackground } from '$lib/scripts/parallax';

  onMount(() => {
    parallaxBackground();
  });
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
  <aside class="navigation">
    <Navigation />
    <button
      class="sidebar-toggle-bar"
      on:click={() => ($sidebarExpanded = !$sidebarExpanded)}
      aria-label="Toggle Sidebar"
      title="Toggle Sidebar"
    ></button>
  </aside>

  <main class="content">
    <slot />
  </main>
</div>

<style lang="scss">
  .app-container {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    height: 100vh;
    width: 100%;
    transition: grid-template-columns 0.3s ease;
    position: relative;
    z-index: 2;

    &.sidebar-collapsed {
      grid-template-columns: var(--sidebar-width-collapsed) 1fr;
    }
  }

  .navigation {
    height: 100%;
    position: relative;
    border-right: 1px solid var(--border-color);
    transition: width 0.3s ease;
    width: var(--sidebar-width);

    .sidebar-collapsed & {
      width: var(--sidebar-width-collapsed);
    }
  }

  .sidebar-toggle-bar {
    position: fixed;
    top: 0;
    height: 100vh;
    left: var(--sidebar-width);
    z-index: 1002;
    width: 10px;
    background-color: var(--border-color);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: left 0.3s ease, background-color 0.2s ease;

    &:hover {
      background-color: var(--primary-color);
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  .app-container.sidebar-collapsed .sidebar-toggle-bar {
    left: var(--sidebar-width-collapsed);
  }

  .content {
    height: 100%;
    overflow-y: auto;
    padding: var(--space-m);
    margin-left: calc(var(--sidebar-width) + 10px);
    transition: margin-left 0.3s ease;
  }

  .app-container.sidebar-collapsed .content {
    margin-left: calc(var(--sidebar-width-collapsed) + 10px);
  }

  @media (max-width: 768px) {
    .app-container {
      display: block;

      &.sidebar-collapsed {
        display: block;
      }
    }

    .navigation {
      /* Navigation styles are handled within Navigation.svelte for mobile */
      /* Remove layout-specific overrides */
       /* border-right: none; */
       /* width: auto; */
    }

    .content {
      margin-left: 0;
      padding: var(--space-m);
    }
  }
</style>
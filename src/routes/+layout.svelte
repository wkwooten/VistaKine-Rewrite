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
  </aside>

  <main class="content">
    <slot />
  </main>
</div>

<style lang="scss">
  .app-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    height: 100vh;
    width: 100%;
    transition: grid-template-columns 0.3s ease;
    position: relative;
    z-index: 2;

    &.sidebar-collapsed {
      grid-template-columns: 60px 1fr;
    }
  }

  .navigation {
    height: 100%;
    overflow-y: visible;
    border-right: 1px solid var(--border-color);
  }

  .content {
    height: 100%;
    overflow-y: auto;
    padding: var(--space-m);
  }

  @media (max-width: 768px) {
    .app-container {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;

      &.sidebar-collapsed {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }
    }

    .navigation {
      border-right: none;
      border-bottom: 1px solid var(--border-color);
    }
  }
</style>
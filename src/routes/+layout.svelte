<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import '../app.scss';
  import Navigation from '$lib/components/Navigation.svelte';
  import { sidebarExpanded } from '$lib/stores/appState';
  import { parallaxBackground } from '$lib/scripts/parallax';

  let toggleButtonElement: HTMLButtonElement;
  let highlightTimeout: number | null = null;

  onMount(() => {
    parallaxBackground();
    return () => {
      if (highlightTimeout) {
        clearTimeout(highlightTimeout);
      }
    };
  });

  function handleClick() {
    $sidebarExpanded = !$sidebarExpanded;
    if (toggleButtonElement) {
      if (highlightTimeout) {
        clearTimeout(highlightTimeout);
        console.log('handleClick: Cleared previous timeout');
      }
      toggleButtonElement.classList.remove('fade-out-highlight');

      console.log('handleClick: Adding click-highlighted');
      toggleButtonElement.classList.add('click-highlighted');

      highlightTimeout = window.setTimeout(() => {
        console.log('Timeout: Attempting to remove click-highlighted');
        if (toggleButtonElement) {
          toggleButtonElement.classList.remove('click-highlighted');
          console.log('Timeout: Class removed. Current classes:', toggleButtonElement.classList.toString());
        } else {
          console.log('Timeout: toggleButtonElement gone?');
        }
        highlightTimeout = null;
      }, 600);
    }
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

<div class="app-container">
  <aside class="navigation" class:collapsed={!$sidebarExpanded}>
    <Navigation />
    <button
      bind:this={toggleButtonElement}
      class="sidebar-toggle-bar"
      on:click={handleClick}
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
    height: 100vh;
    width: 100%;
    position: relative;
    z-index: 2;
  }

  .navigation {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    display: grid;
    grid-template-columns: 300px 10px;
    transition: grid-template-columns 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0);
    z-index: 1001;

    &.collapsed {
      grid-template-columns: 80px 10px;

      .sidebar-toggle-bar::before {
        background-color: var(--border-color-light);
      }

      .sidebar-toggle-bar:hover::before {
        background-color: var(--primary-color);
      }

      .sidebar-toggle-bar.click-highlighted::before {
        background-color: var(--primary-color);
      }
    }

    @media (max-width: 768px) {
      display: block;
      position: static;
      height: auto;
      width: auto;
      z-index: auto;
      grid-template-columns: none;
      transition: none;
    }
  }

  .sidebar-toggle-bar {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      height: 100%;
      width: 4px;
      left: 0;
      background-color: var(--border-color-light);
      transition: background-color 0.3s ease-out;
      pointer-events: none;
    }

    &:hover::before {
      background-color: var(--primary-color);
    }

    &.click-highlighted::before {
      background-color: var(--primary-color);
      transition-duration: 0s;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  .content {
    height: 100%;
    overflow-y: auto;
    padding: var(--space-m);
  }

  @media (max-width: 768px) {
    .app-container { display: block; }
    .content { margin-left: 0; padding: var(--space-m); }
  }
</style>
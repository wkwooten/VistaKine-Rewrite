<script lang="ts">
  import { sidebarExpanded, currentChapter } from '$lib/stores/appState';
  import { Hexagon, BookOpen, Settings, Search, ChevronRight, List, Shapes } from 'lucide-svelte';
  import { onMount, onDestroy } from 'svelte';
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { browser } from '$app/environment';
  import { getChapterList } from '$lib/data/chapters';

  $: console.log('Navigation.svelte - currentChapter store value:', $currentChapter);

  export let chapters = getChapterList();

  interface SectionItem {
    id: string;
    title: string;
  }

  const iconSize = 18;

  let desktopSidebarExpanded = $sidebarExpanded; // Local state for desktop
  let isMobile = false; // State to track mobile viewport
  let bodyClassApplied = false; // Track if class is applied

  // Function to update body scroll class
  function updateBodyScroll() {
    if (browser) {
      const shouldLockScroll = $sidebarExpanded && isMobile;
      if (shouldLockScroll && !bodyClassApplied) {
        document.body.classList.add('body-no-scroll');
        bodyClassApplied = true;
      } else if (!shouldLockScroll && bodyClassApplied) {
        document.body.classList.remove('body-no-scroll');
        bodyClassApplied = false;
      }
    }
  }

  onMount(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)'); // Example breakpoint
    isMobile = mediaQuery.matches;

    const handleResize = () => {
      isMobile = mediaQuery.matches;
      updateBodyScroll(); // Update on resize
    };

    mediaQuery.addEventListener('change', handleResize);
    window.addEventListener('resize', handleResize); // Also listen to resize

    const unsubscribeSidebar = sidebarExpanded.subscribe(value => {
      desktopSidebarExpanded = value;
      updateBodyScroll(); // Update on sidebar state change
    });

    // Initial check
    updateBodyScroll();

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
      window.removeEventListener('resize', handleResize);
      unsubscribeSidebar();
      // Clean up body class if component is destroyed while scroll is locked
      if (bodyClassApplied) {
        document.body.classList.remove('body-no-scroll');
      }
    };
  });

  let expandedChapter: string | null = null;
  function toggleChapterSections(chapterSlug: string): void {
    expandedChapter = expandedChapter === chapterSlug ? null : chapterSlug;
  }

  function scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleSectionClick(chapterSlug: string, sectionId: string): void {
    if ($currentChapter === chapterSlug) {
      scrollToSection(sectionId);
    } else {
      if (browser) {
        window.location.href = `/chapter/${chapterSlug}#${sectionId}`;
      }
    }
  }

  // Use desktopSidebarExpanded directly for conditional rendering logic
  $: navCollapsed = !desktopSidebarExpanded;

</script>

<!-- Navigation -->
<nav class:collapsed={navCollapsed} style="--sidebar-width: {desktopSidebarExpanded ? 'var(--sidebar-width)' : 'var(--sidebar-width-collapsed)'}">
  <div class="nav-header-container">
    <a href="/" class="nav-header-link">
      <div class="logo">
        {#if !navCollapsed}
          <div class="logo-with-text">
            <div class="icon-logo">
              <Hexagon size={iconSize} color="var(--color-accent)" />
            </div>
            <h1>VistaKine</h1>
          </div>
        {:else}
          <div class="icon-logo">
            <Hexagon size={32} color="var(--color-accent)" />
          </div>
        {/if}
      </div>
    </a>
  </div>

  <div class="search">
    {#if !navCollapsed}
      <div class="search-input-container">
        <Search size={iconSize} color="var(--color-text-primary)" opacity="0.6" />
        <input type="text" placeholder="Search textbook..." />
      </div>
    {:else}
      <div class="icon-search">
        <Search size={24} />
      </div>
    {/if}
  </div>

  <div class="nav-content">
    <ul class="nav-items">
      <li>
        <a href="/chapter/toc" class="nav-item">
          <div class="icon">
            <BookOpen size={iconSize} />
          </div>
          {#if !navCollapsed}
            <span>Chapters</span>
          {/if}
        </a>
      </li>

      {#each chapters as chapter, index}
        {@const isActive = $currentChapter === chapter.slug}
        <li class="nav-chapter-group {`chapter-${index + 1}-theme`}" class:is-active={isActive}>
          <div
            class="nav-item chapter-item"
            role="button"
            tabindex="0"
            on:click={() => toggleChapterSections(chapter.slug)}
            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleChapterSections(chapter.slug); }}
            aria-expanded={expandedChapter === chapter.slug}
            aria-controls={`sections-${chapter.slug}`}
          >
            <a href={`/chapter/${chapter.slug}`}
               class="chapter-number"
               on:click={(event) => {
                   if (navCollapsed) {
                       event.preventDefault(); // Prevent default navigation initially
                       $sidebarExpanded = true; // Expand sidebar
                       expandedChapter = chapter.slug; // Expand the accordion for this chapter
                       // Navigate programmatically after setting state
                       if (browser) {
                           window.location.href = event.currentTarget.href;
                       }
                   }
                   // If sidebar is already expanded, allow default link behavior
               }}
            >{index + 1}</a>
            {#if !navCollapsed}
              <a href={`/chapter/${chapter.slug}`} class="chapter-title"><span>{chapter.title}</span></a>
              <div
                class="chevron"
                class:expanded={expandedChapter === chapter.slug}
                role="button"
                tabindex="0"
                on:click|stopPropagation={() => toggleChapterSections(chapter.slug)}
                on:keydown|stopPropagation={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleChapterSections(chapter.slug); }}
                aria-label={expandedChapter === chapter.slug ? `Collapse ${chapter.title} sections` : `Expand ${chapter.title} sections`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide lucide-chevron-right">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            {/if}
          </div>
          {#if !navCollapsed && expandedChapter === chapter.slug}
            <ul class="chapter-sections" id={`sections-${chapter.slug}`} transition:slide={{ duration: 300, easing: quintOut }}>
              {#each chapter.sections || [] as section}
                <li class="section-item">
                  <a
                    href={`/chapter/${chapter.slug}#${section.id}`}
                    class="nav-item section-link"
                    on:click|preventDefault={() => handleSectionClick(chapter.slug, section.id)}
                  >
                    {section.title}
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}

      <li>
        <a href="/physics-pg" class="nav-item">
          <div class="icon">
            <Shapes size={iconSize} />
          </div>
          {#if !navCollapsed}
            <span>Physics Playground</span>
          {/if}
        </a>
      </li>

    </ul>
  </div>

  <ul class="bottom-item">
    <li>
      <a href="/glossary" class="nav-item">
        <div class="icon">
          <List size={iconSize} />
        </div>
        {#if !navCollapsed}
        <span>Glossary</span>
        {/if}
      </a>
    </li>
    <li>
      <a href="/settings" class="nav-item">
        <div class="icon">
          <Settings size={iconSize} />
      </div>
      {#if !navCollapsed}
        <span>Settings</span>
      {/if}
      </a>
    </li>
  </ul>
</nav>

<style lang="scss">
  nav {
    height: 100vh;
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    padding: var(--space-xs) 0;
    top: 0;
    border-right: 1.5px solid var(--color-border);
    left: 0;
    z-index: 1001;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;

    &.collapsed {
      .nav-item {
        justify-content: center;
        padding: var(--space-xs);
      }

      .chapter-item .chapter-link {
        justify-content: center;
      }

      .icon, .chapter-number {
        margin-right: 0;
      }

      .logo {
        justify-content: center;
      }

      .icon-search {
        margin: 0 auto;
      }
    }
  }

  .icon {
    background-color: var(--color-surface);
  }


  .nav-header-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--space-xs) var(--space-s);
    position: relative;
    &:hover {
       background-color: rgba(59, 130, 246, 0.1);
    }
  }

  .nav-header-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
  }

  .logo {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    text-decoration: none;
  }


  .logo-with-text {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
  }

  .logo h1 {
    font-size: var(--step-1);
    color: var(--color-accent);
    margin: 0;
  }

  .icon-logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .navigation-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .search {
    padding: var(--space-xs);
    border-block: 1px solid var(--color-border);
    display: flex;
    justify-content: center;
  }

  .search-input-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;

    :global(svg) {
      position: absolute;
      left: 8px;
    }

    input {
      padding-left: 32px;
      background-color: var(--color-surface);
      color: var(--color-text-primary);
    }
  }

  input {
    width: 100%;
    padding: var(--space-xs);
    border-radius: 4px;
    border: 1px solid var(--color-border);
  }

  .icon-search {
    font-size: 20px;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .nav-content {
    overflow-y: auto;
    height: 100%;
  }

  .nav-items {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    padding-block: var(--space-l);
  }


  .nav-item {
    display: flex;
    align-items: center;
    padding: var(--space-xs) var(--space-m);
    color: var(--color-text-primary);
    text-decoration: none;
    border-radius: 4px;
    position: relative;
    box-sizing: border-box;
    min-width: 0;

    &:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
  }

  .chapter-title {
    text-decoration: none;
    color: inherit;
    white-space: normal;
    word-break: break-word;
    display: inline-block;

    &:hover {
      text-decoration: underline;
      color: var(--color-accent);
    }
  }

  .icon, .chapter-number {
    margin-right: var(--space-xs);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 2px solid var(--color-accent);
    min-width: 32px;
    min-height: 32px;
    width: 32px;
    height: 32px;
  }

  .chapter-number {
    background-color: #e6effd;
    border-radius: 50%;
    color: var(--color-accent);
    font-weight: bold;
    &:hover {
      text-decoration: underline;
      color: var(--color-accent);
    }
  }

  .bottom-item {
    margin-top: auto;
    margin-bottom: 0 !important;
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-xs);
  }

  .chapter-item {
    cursor: pointer;
  }

  .chapter-sections {
    list-style: none;
    padding-left: var(--space-s);
    margin: 0;
  }

  .section-item {
    margin-bottom: var(--space-2xs);
  }

  .section-link {
    @extend .nav-item;
    padding-left: calc(var(--space-s) + var(--space-xs));
    font-size: 0.9em;
    height: auto;
    box-sizing: border-box;

    &:hover {
      background-color: var(--chapter-bg);
      text-decoration: underline;
      color: var(--color-accent);
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    span {
      white-space: normal;
      word-break: break-word;
      display: inline-block;
    }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .chevron {
    margin-left: auto;
    cursor: pointer;
    padding: var(--space-2xs);
    display: flex;
    align-items: center;
    justify-content: center;

    /* Override reset styles for SVG inside chevron */
    :global(svg) {
      max-width: none; /* Prevent max-width: 100% from reset */
      transition: transform 0.3s ease;
    }

    &.expanded {
      :global(svg) {
        transform: rotate(90deg);
      }
    }

    &:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
  }
</style>

<!-- Add global style for body scroll lock -->
<svelte:head>
  {#if browser}
    <style>
      .body-no-scroll {
        overflow: hidden !important; /* Force no scroll */
        /* Optionally add touch-action: none; if needed for touch devices */
      }
    </style>
  {/if}
</svelte:head>

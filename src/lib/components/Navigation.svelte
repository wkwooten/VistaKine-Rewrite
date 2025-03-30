<script lang="ts">
  import { sidebarExpanded, currentChapter } from '$lib/stores/appState';
  import { Hexagon, BookOpen, Settings, Search, ChevronRight, Menu, X } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { browser } from '$app/environment';
  import { getChapterList } from '$lib/data/chapters';

  // Add a reactive log to monitor the store value
  $: console.log('Navigation.svelte - currentChapter store value:', $currentChapter);

  // Use the centralized chapter data
  export let chapters = getChapterList();

  interface SectionItem {
    id: string;
    title: string;
  }

  // Common size for all icons
  const iconSize = 18;

  let mobileSidebarOpen = false; // Track mobile sidebar state separately
  let desktopSidebarExpanded = $sidebarExpanded; // Local state for desktop
  let isMobile = false; // State to track if we are on mobile

  onMount(() => {
    // This code runs only in the browser
    function checkMobile() {
        isMobile = window.innerWidth < 768;
    }

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile); // Check on resize

    // Update desktopSidebarExpanded when $sidebarExpanded changes
    const unsubscribe = sidebarExpanded.subscribe(value => {
      desktopSidebarExpanded = value;
    });

    // Clean up the subscription and event listener when the component is unmounted
    return () => {
        window.removeEventListener('resize', checkMobile);
        unsubscribe();
    };
  });

  function toggleSidebar(): void {
    if (isMobile) { // Use the isMobile state
      mobileSidebarOpen = !mobileSidebarOpen;
    } else {
      $sidebarExpanded = !$sidebarExpanded;
    }
  }

  let expandedChapter: string | null = null; // Track expanded chapter for accordion
  function toggleChapterSections(chapterSlug: string): void {
    expandedChapter = expandedChapter === chapterSlug ? null : chapterSlug;
  }

  /**
   * Scroll to a section within the page
   */
  function scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Handle section link clicks
   */
  function handleSectionClick(chapterSlug: string, sectionId: string): void {
    if ($currentChapter === chapterSlug) {
      scrollToSection(sectionId);
    } else {
      // Use browser check before accessing window.location
      if (browser) {
        window.location.href = `/chapter/${chapterSlug}#${sectionId}`;
      }
    }

    // Close the mobile sidebar after clicking a section link
    if (isMobile) { // Use the isMobile state
      mobileSidebarOpen = false;
    }
  }

  function closeMobileSidebar() {
    mobileSidebarOpen = false;
  }

  $: combinedSidebarExpanded = isMobile ? mobileSidebarOpen : desktopSidebarExpanded;
</script>

<!-- Mobile Menu Button (Hamburger) -->
<button class="mobile-menu-button" on:click={toggleSidebar} aria-label="Open Menu" type="button">
  <Menu size={24} />
</button>

<!-- Mobile Overlay (shown when sidebar is open on mobile) -->
{#if isMobile && mobileSidebarOpen}
  <div class="mobile-overlay" on:click={closeMobileSidebar}></div>
{/if}

<!-- Navigation -->

<nav class:collapsed={!combinedSidebarExpanded} class:mobile-open={mobileSidebarOpen} style="--sidebar-width: {desktopSidebarExpanded ? 'var(--sidebar-width)' : 'var(--sidebar-width-collapsed)'}">
  <div class="nav-header-container">
    <a href="/" class="nav-header-link">
      <div class="logo">
        {#if combinedSidebarExpanded}
          <div class="logo-with-text">
            <div class="icon-logo">
              <Hexagon size={iconSize} color="var(--primary-color)" />
            </div>
            <h1>VistaKine</h1>
          </div>
        {:else}
          <div class="icon-logo">
            <Hexagon size={32} color="var(--primary-color)" />
          </div>
        {/if}
      </div>
    </a>

    <!-- Mobile Close Button (Moved outside the link) -->
    {#if mobileSidebarOpen}
      <button class="mobile-close-button" on:click={closeMobileSidebar} aria-label="Close Menu" type="button">
        <X size={24} />
      </button>
    {/if}
  </div>

  <div class="search">
    {#if combinedSidebarExpanded}
      <div class="search-input-container">
        <Search size={iconSize} color="var(--text-color)" opacity="0.6" />
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
          {#if combinedSidebarExpanded}
            <span>Chapters</span>
          {/if}
        </a>
      </li>

      {#each chapters as chapter, index}
        <!-- Add a log right before the class is checked -->
        {@const isActive = $currentChapter === chapter.slug}
        <!-- {console.log(`Checking active for ${chapter.slug}: current='${$currentChapter}', slug='${chapter.slug}', isActive=${isActive}`)} -->
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
            <a href={`/chapter/${chapter.slug}`} class="chapter-number" on:click|preventDefault="{() => {if(!desktopSidebarExpanded) {toggleSidebar()}}}">{index + 1}</a>
            {#if combinedSidebarExpanded}
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
                <ChevronRight size={iconSize} />
              </div>
            {/if}
          </div>
          {#if combinedSidebarExpanded && expandedChapter === chapter.slug}
            <ul class="chapter-sections" id={`sections-${chapter.slug}`} transition:slide>
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

    </ul>
  </div>

  <li class="bottom-item">
    <a href="/settings" class="nav-item">
      <div class="icon">
        <Settings size={iconSize} />
      </div>
      {#if combinedSidebarExpanded}
        <span>Settings</span>
      {/if}
    </a>
  </li>
</nav>

<style lang="scss">
  .mobile-menu-button {
    display: none; /* Hidden by default */
    position: fixed;
    top: var(--space-s);
    left: var(--space-s);
    z-index: 1001; /* Above the overlay */
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: var(--space-xs);
    cursor: pointer;

    @media (max-width: 768px) {
      display: block; /* Show on mobile */
    }
  }

  nav {
    height: 100vh;
    background-color: var(--background-color);
    transition: transform 0.4s ease; /* For mobile slide-in/out */
    display: flex;
    flex-direction: column;
    padding: var(--space-xs) 0;
    top: 0;
    border-right: 1.5px solid var(--border-color);
    left: 0;
    z-index: 1001;
    overflow: hidden;
    width: 100%; /* Fill the nav container width */
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

    @media (max-width: 768px) {
      /* Mobile positioning */
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 1001;

      /* Mobile sidebar should be a reasonable width */
      width: 300px;
      max-width: 80vw;
      transform: translateX(-100%);

      &.mobile-open {
        transform: translateX(0);
        box-shadow: var(--shadow-lg);
      }

      /* Reset desktop collapsed styles for mobile */
      &.collapsed {
         width: 300px; /* Ensure standard width on mobile regardless of desktop state */
         max-width: 80vw;

         .nav-item {
            justify-content: flex-start;
            padding: var(--space-xs) var(--space-s);
         }
         .icon, .chapter-number {
            margin-right: var(--space-xs);
         }
         .logo {
            justify-content: flex-start;
         }
         .icon-search {
            margin: 0;
         }
      }
    }
  }

  .nav-header-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--space-xs) var(--space-s);
    position: relative; /* Positioning context for the close button */
    &:hover { /* Apply hover effect to the container */
       background-color: rgba(59, 130, 246, 0.1);
    }
  }

  .nav-header-link {
    text-decoration: none;
    color: inherit; /* Ensure link inherits text color */
    display: flex; /* Ensure it takes up space correctly */
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
    color: var(--primary-color);
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
    border-block: 1px solid var(--border-color);
    display: flex;
    justify-content: center;
    /* margin-bottom: var(--space-m); */
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
    }
  }

  input {
    width: 100%;
    padding: var(--space-xs);
    border-radius: 4px;
    border: 1px solid var(--border-color);
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
    gap: var(--space-s);
    padding-block: var(--space-l);
  }

  .nav-items li {
    margin-bottom: var(--space-xs);
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: var(--space-xs) var(--space-s);
    color: var(--text-color);
    text-decoration: none;
    border-radius: 4px;
    position: relative;
    /* Ensure box-sizing is correct */
    box-sizing: border-box;
    /* Prevent flex items from causing overflow if not wrapping */
    min-width: 0;

    &:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
  }

  .chapter-title {
    text-decoration: none;
    color: inherit;
    /* Allow wrapping */
    white-space: normal;
    word-break: break-word; /* Or break-all */
    /* Remove max-width, let parent width control wrapping */
    /* max-width: calc(100% - 40px); */
    /* Ensure it takes space correctly */
    display: inline-block; /* Or block if needed */

    &:hover {
      text-decoration: underline;
      color: var(--primary-color);
    }
  }

  .icon, .chapter-number {
    margin-right: var(--space-xs);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 2px solid var(--primary-color);
    min-width: 32px;
    min-height: 32px;
    width: 32px;
    height: 32px;
  }

  .chapter-number {
    background-color: #e6effd;
    border-radius: 50%;
    color: var(--primary-color);
    font-weight: bold;
    &:hover {
      text-decoration: underline;
      color: var(--primary-color);
    }
  }

  .bottom-item {
    margin-top: auto;
    margin-bottom: 0 !important;
    border-top: 1px solid var(--border-color);
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
      color: var(--primary-color);
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    span {
      white-space: normal;
      word-break: break-word;
      display: inline-block;
    }
  }

  .chevron {
    margin-left: auto;
    padding: var(--space-2xs);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    :global(svg) {
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

  .mobile-close-button {
    position: absolute;
    top: 50%;
    right: var(--space-s);
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-color);
    padding: var(--space-xs);
    z-index: 1002;
    &:hover {
        background-color: transparent;
    }
  }

  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: none;

    @media (max-width: 768px) {
      display: block;
    }
  }
</style>

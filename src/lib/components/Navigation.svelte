<script lang="ts">
  import { sidebarExpanded, currentChapter } from '$lib/stores/appState';
  import { Hexagon, BookOpen, Settings, Search, ChevronRight, Menu, X } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { browser } from '$app/environment';

  // Navigation data could come from a store or API later
  export let chapters = [
    { title: 'Introduction', slug: 'chapter1' },
    { title: 'Kinematics', slug: 'chapter2' },
    { title: 'Dynamics', slug: 'chapter3' },
    { title: 'Advanced Topics', slug: 'chapter4' },
    { title: 'Motion Analysis', slug: 'chapter5' },
    { title: 'Biomechanics', slug: 'chapter6' },
    { title: 'Clinical Applications', slug: 'chapter7' },
    { title: 'Research Methods', slug: 'chapter8' },
    // Add more chapters as needed
  ];

  interface SectionItem {
    id: string;
    title: string;
  }

  interface ChapterSections {
    [key: string]: SectionItem[];
  }

  // Section data for each chapter (for sidebar navigation)
  const chapterSections: ChapterSections = {
    'chapter1': [ // Introduction chapter
      { id: "coordinate-systems", title: "1.1 Coordinate Systems" },
      { id: "vectors-in-space", title: "1.2 Vectors in 3D Space" },
      { id: "reference-frames", title: "1.3 Reference Frames" }
    ],
    'chapter2': [ // Kinematics chapter
      { id: "kinematics-section1", title: "2.1 Kinematics Section 1" },
      { id: "kinematics-section2", title: "2.2 Kinematics Section 2" },
      // ... more sections for Kinematics
    ],
    'chapter3': [ // Dynamics chapter
      { id: "dynamics-section1", title: "3.1 Dynamics Section 1" },
      // ... more sections for Dynamics
    ],
    'chapter4': [ // Advanced Topics chapter
      { id: "advanced-section1", title: "4.1 Advanced Topic 1 - Placeholder" },
      { id: "advanced-section2", title: "4.2 Advanced Topic 2 - Placeholder" },
      // ... more sections for Advanced Topics
    ],
    'chapter5': [ // Motion Analysis chapter
      { id: "motion-analysis-section1", title: "5.1 Motion Analysis 1 - Placeholder" },
      { id: "motion-analysis-section2", title: "5.2 Motion Analysis 2 - Placeholder" },
      // ... more sections for Motion Analysis
    ],
    'chapter6': [ // Biomechanics chapter
      { id: "biomechanics-section1", title: "6.1 Biomechanics 1 - Placeholder" },
      { id: "biomechanics-section2", title: "6.2 Biomechanics 2 - Placeholder" },
      // ... more sections for Biomechanics
    ],
    'chapter7': [ // Clinical Applications chapter
      { id: "clinical-section1", title: "7.1 Clinical Applications 1 - Placeholder" },
      { id: "clinical-section2", title: "7.2 Clinical Applications 2 - Placeholder" },
      // ... more sections for Clinical Applications
    ],
    'chapter8': [ // Research Methods chapter
      { id: "research-section1", title: "8.1 Research Methods 1 - Placeholder" },
      { id: "research-section2", title: "8.2 Research Methods 2 - Placeholder" }
    ]
  };

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
            <Hexagon size={iconSize} color="var(--primary-color)" />
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
        <Search size={iconSize} />
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
        <li class="nav-chapter-group {`chapter-${index + 1}-theme`}" class:is-active={$currentChapter === chapter.slug}>
          <div class="nav-item chapter-item" on:click={() => toggleChapterSections(chapter.slug)}>
            <a href={`/chapter/${chapter.slug}`} class="chapter-number" on:click|preventDefault="{() => {if(!desktopSidebarExpanded) {toggleSidebar()}}}">{index + 1}</a>
            {#if combinedSidebarExpanded}
              <a href={`/chapter/${chapter.slug}`} class="chapter-title"><span>{chapter.title}</span></a>
              <div class="chevron" class:expanded={expandedChapter === chapter.slug} on:click|stopPropagation={() => toggleChapterSections(chapter.slug)}>
                <ChevronRight size={iconSize} />
              </div>
            {/if}
          </div>
          {#if combinedSidebarExpanded && expandedChapter === chapter.slug}
            <ul class="chapter-sections" transition:slide>
              {#each chapterSections[chapter.slug] || [] as section}
                <li class="section-item">
                  <a
                    href={`/chapter/${chapter.slug}#${section.id}`}
                    class="nav-item section-link"
                    on:click|preventDefault={() => handleSectionClick(chapter.slug, section.id)}
                  >
                    {#if combinedSidebarExpanded}
                      <span>{section.title}</span>
                    {/if}
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
    /* Define transitions for relevant properties */
    /* Remove width and transform transitions here, handled by parent grid */
    /* transition: width 0.3s ease, transform 0.4s ease; */
    transition: transform 0.4s ease; /* Keep only transform for mobile */
    display: flex;
    flex-direction: column;
    padding: var(--space-xs) 0;
    /* Remove position: fixed, handled by parent */
    /* position: fixed; */
    top: 0;
    border-right: 1.5px solid var(--border-color);
    left: 0;
    z-index: 1001; /* Ensure it's above other content */
    overflow: hidden; /* Keep this */
    /* Remove explicit width, let grid control it */
    /* width: var(--sidebar-width); */
    /* width: 300px; */
    width: 100%; /* Fill the grid cell */
    box-sizing: border-box;

    &.collapsed {
      /* Remove desktop collapsed width, grid handles this */
      /* width: var(--sidebar-width-collapsed); */

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

      /* Remove toggle-btn adjustment here, it's handled by fixed positioning */
      /* .toggle-btn { ... } */
    }

    /* Remove the base .mobile-open rule, handle in media query */
    /* &.mobile-open { ... } */

    @media (max-width: 768px) {
      /* --- Add mobile positioning back --- */
      position: fixed; /* Position fixed for slide-out */
      top: 0;
      left: 0;
      height: 100vh; /* Ensure it takes full height */
      z-index: 1001; /* Ensure it's above other content */
      /* --- End additions --- */

      /* Mobile base state: Full width but off-screen */
      width: 100vw;
      max-width: none;
      transform: translateX(-100%);
      transition: transform 0.4s ease; /* Focus on transform */


      &.mobile-open {
        /* Slide in by changing transform */
        transform: translateX(0);
      }

      /* Prevent desktop collapsed styles from breaking mobile */
      &.collapsed {
         /* Ensure full width even if desktop is collapsed */
         width: 100vw;
         /* Reset specific desktop collapsed styles */
         .nav-item {
            justify-content: flex-start; /* Or initial value */
            padding: var(--space-xs) var(--space-s); /* Or initial value */
         }
         .icon, .chapter-number {
            margin-right: var(--space-xs); /* Restore margin */
         }
         .logo {
            justify-content: flex-start; /* Restore alignment */
         }
         .icon-search {
            margin: 0; /* Reset margin */
            /* Adjust justification if needed */
         }
      }
    }
  }

  .nav-header-container {
    display: flex;
    justify-content: space-between;
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
    width: 32px;
    height: 32px;

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
    margin: 0 var(--space-2xs);
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
    /* Allow link height to adjust */
    height: auto;
    /* Remove any truncation styles */
    /* overflow: hidden; */
    /* white-space: nowrap; */
    /* Ensure box-sizing */
    box-sizing: border-box;

    &:hover {
      text-decoration: underline;
      color: var(--primary-color);
    }

    span {
      /* Allow wrapping */
      white-space: normal;
      word-break: break-word; /* Or break-all */
      /* Remove any truncation styles */
      /* overflow: hidden; */
      /* text-overflow: ellipsis; */
      /* Remove max-width */
      /* max-width: calc(100% - 20px); */
      /* Ensure it takes space correctly */
      display: inline-block; /* Or block if needed */
    }
  }

  .chevron {
    margin-left: auto;
    /* Remove transition from the container */
    /* transition: transform 0.3s ease; */
    /* Add padding or dimensions if needed to maintain clickable area */
    padding: var(--space-2xs); /* Example padding */
    cursor: pointer; /* Ensure cursor indicates interactivity */
    display: flex; /* Helps align the SVG if needed */
    align-items: center; /* Center SVG vertically */
    justify-content: center; /* Center SVG horizontally */

    /* Target the SVG directly for transition */
    :global(svg) {
      transition: transform 0.3s ease;
    }

    &.expanded {
      /* Remove transform from the container */
      /* transform: rotate(90deg); */

      /* Apply transform to the SVG when expanded */
      :global(svg) {
        transform: rotate(90deg);
      }
    }

    &:hover {
      background-color: rgba(59, 130, 246, 0.1); // Highlight on hover
    }
  }

  .mobile-close-button {
    position: absolute;
    top: 50%;          /* Vertically center */
    right: var(--space-s);
    transform: translateY(-50%); /* Adjust for vertical centering */
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-color);
    padding: var(--space-xs);
    z-index: 1002; /* Ensure it's above the overlay */
    /* Ensure it doesn't get hover effect from container */
    &:hover {
        background-color: transparent;
    }
  }
</style>

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
<button class="mobile-menu-button" on:click={toggleSidebar} aria-label="Open Menu">
  <Menu size={24} />
</button>

<!-- Overlay (Backdrop) -->
{#if mobileSidebarOpen}
  <div class="sidebar-overlay" on:click={closeMobileSidebar} transition:slide={{ duration: 200 }}></div>
{/if}

<!-- Navigation -->
<nav class:collapsed={!combinedSidebarExpanded} class:mobile-open={mobileSidebarOpen} style="--sidebar-width: {desktopSidebarExpanded ? 'var(--sidebar-width)' : 'var(--sidebar-width-collapsed)'}" transition:slide>
  <a href="/" class="nav-header">
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

    <!-- Mobile Close Button -->
    {#if mobileSidebarOpen}
      <button class="mobile-close-button" on:click={closeMobileSidebar} aria-label="Close Menu">
        <X size={24} />
      </button>
    {/if}
  </a>

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
        <li>
          <div class="nav-item chapter-item">
            <a href={`/chapter/${chapter.slug}`} class="chapter-number" on:click|preventDefault="{() => {if(!desktopSidebarExpanded) {toggleSidebar()}}}">{index + 1}</a>
            {#if combinedSidebarExpanded}
              <a href={`/chapter/${chapter.slug}`} class="chapter-title"><span>{chapter.title}</span></a>
              <div class="chevron" class:expanded={expandedChapter === chapter.slug} on:click={() => toggleChapterSections(chapter.slug)}>
                <ChevronRight size={iconSize} />
              </div>
            {/if}
          </div>
          {#if combinedSidebarExpanded && expandedChapter === chapter.slug}
            <ul class="chapter-sections">
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

<!-- Desktop Toggle Button -->
<button class="toggle-btn" on:click="{() => {$sidebarExpanded = !$sidebarExpanded}}" aria-label="Toggle Sidebar">
  {#if desktopSidebarExpanded}
    «
  {:else}
    »
  {/if}
</button>


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

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
    z-index: 1000; /* High z-index to be on top */
    display: none;

    @media (max-width: 768px) {
      display: block;
    }
  }

  nav {
    height: 100vh;
    background-color: var(--sidebar-background);
    transition: width 0.3s ease;
    display: flex;
    flex-direction: column;
    padding: var(--space-xs) 0;
    position: fixed; /* Fixed position */
    top: 0;
    left: 0;
    z-index: 1001; /* Ensure it's above other content */
    overflow: hidden;

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

      .toggle-btn {
        right: calc(-40px + var(--sidebar-width-collapsed)); /* Adjust for collapsed width */
      }
    }

    &.mobile-open {
      width: 100vw; /* Full width on mobile */
      max-width: none; /* Remove max-width */
    }

    @media (max-width: 768px) {
      width: 0; /* Initially hidden on mobile */
      &.mobile-open {
        width: 100vw; /* Full width when open */
      }
    }
  }

  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xs) var(--space-s);
    border-bottom: 1px solid var(--border-color);
    position: relative; /* Make the nav-header a positioning context */
  }
  .nav-header:hover {
    text-decoration: none;
    background-color: rgba(59, 130, 246, 0.1);
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

  .toggle-btn {
    position: absolute;
    top: 50%;
    right: calc(-40px + var(--sidebar-width)); /* Position relative to sidebar */
    transform: translateY(-50%); /* Center vertically */
    border: none;
    background-color: #ccc;
    cursor: pointer;
    color: transparent;
    font-size: var(--step-1);
    z-index: 1000;
    transition: background-color 0.3s ease, color 0.3s ease, width 0.3s ease, padding 0.3s ease;
    width: 8px;
    padding: var(--space-xs) 0px;
    border-radius: var(--radius-sm);
    opacity: 0.6;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    &:hover {
      background-color: var(--primary-color);
      color: var(--text-color);
      width: 40px;
      opacity: 1;
      padding: var(--space-xs) var(--space-s);
    }

    @media (max-width: 768px) {
      display: none; /* Hide on mobile */
    }
  }

  .search {
    padding: var(--space-xs);
    border-bottom: 2px solid var(--border-color);
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
    padding-bottom: var(--space-l);
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

    &:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
  }

  .chapter-title {
    text-decoration: none;
    color: inherit;
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
    &:hover {
      text-decoration: underline;
      color: var(--primary-color);
    }
  }

  .chevron {
    margin-left: auto;
    transition: transform 0.3s ease;

    &.expanded {
      transform: rotate(90deg);
    }

    &:hover {
      background-color: rgba(59, 130, 246, 0.1); // Highlight on hover
    }
  }

  .mobile-close-button {
    position: absolute;
    top: var(--space-xs);
    right: var(--space-s);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-color);
    padding: var(--space-xs);
    z-index: 1002; /* Ensure it's above the overlay */
  }
</style>

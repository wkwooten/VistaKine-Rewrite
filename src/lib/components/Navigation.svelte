<script lang="ts">
  import { page } from "$app/stores";
  import { sidebarExpanded, currentChapter } from "$lib/stores/appState";
  import type { Writable } from "svelte/store"; // Import Writable as type
  import type { Chapter } from "$lib/data/chapters"; // Import only Chapter type
  import {
    Hexagon,
    BookOpen,
    Settings,
    Search,
    ChevronRight,
    List,
    Shapes,
  } from "lucide-svelte";
  import { onMount, onDestroy } from "svelte";
  import { slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { browser } from "$app/environment";
  import { getChapterList, chapters as allChapters } from "$lib/data/chapters";
  import NavSearch from "$lib/components/NavSearch.svelte";

  // --- Props ---
  // Slug of the currently viewed chapter, used to initialize the expanded state.
  export let currentChapterSlug: string | null = null;
  // Indicates if the component is in mobile view (detected via media query).
  export let isMobile: boolean = false;

  $: console.log(
    "Navigation.svelte - currentChapter store value:",
    $currentChapter
  );

  export let chapters: Chapter[] = getChapterList();

  const iconSize = 18;

  let bodyClassApplied = false; // Track if class is applied

  // Toggles the 'body-no-scroll' class based on sidebar state and mobile view
  // to prevent background scrolling when the navigation might overlay content.
  // Note: The sidebar itself is display:none on mobile via CSS, but this logic
  // was likely intended for a potential overlay behavior.
  function updateBodyScroll() {
    if (browser) {
      const shouldLockScroll = $sidebarExpanded && isMobile;
      if (shouldLockScroll && !bodyClassApplied) {
        document.body.classList.add("body-no-scroll");
        bodyClassApplied = true;
      } else if (!shouldLockScroll && bodyClassApplied) {
        document.body.classList.remove("body-no-scroll");
        bodyClassApplied = false;
      }
    }
  }

  // --- Lifecycle ---
  // Sets up responsive behavior on mount:
  // 1. Detects initial mobile state based on CSS variable breakpoint.
  // 2. Listens for viewport size changes to update mobile state.
  // 3. Subscribes to sidebarExpanded store changes.
  // 4. Calls updateBodyScroll initially and on changes to manage scroll lock.
  // 5. Cleans up listeners and body class on destroy.
  onMount(() => {
    let lgBreakpointValue = "1024px"; // Default fallback
    if (browser) {
      // Read the CSS custom property
      const styles = getComputedStyle(document.documentElement);
      const bpValue = styles.getPropertyValue("--breakpoint-lg").trim();
      if (bpValue) {
        // Use the value if found
        lgBreakpointValue = bpValue;
      }
    }

    const mediaQuery = window.matchMedia(`(max-width: ${lgBreakpointValue})`); // Use dynamic value
    isMobile = mediaQuery.matches;

    const handleResize = () => {
      isMobile = mediaQuery.matches;
      updateBodyScroll(); // Update on resize
    };

    mediaQuery.addEventListener("change", handleResize);
    window.addEventListener("resize", handleResize); // Also listen to resize

    const unsubscribeSidebar = sidebarExpanded.subscribe(() => {
      updateBodyScroll();
    });

    // Initial check
    updateBodyScroll();

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
      window.removeEventListener("resize", handleResize);
      unsubscribeSidebar();
      // Clean up body class if component is destroyed while scroll is locked
      if (bodyClassApplied) {
        document.body.classList.remove("body-no-scroll");
      }
    };
  });

  // --- State ---
  // Initialize the expanded chapter based on the initial prop value.
  let expandedChapter: string | null = currentChapterSlug;

  // Toggles the accordion display for a given chapter's sections.
  function toggleChapterSections(chapterSlug: string): void {
    expandedChapter = expandedChapter === chapterSlug ? null : chapterSlug;
  }

  function scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Handles clicks on section links.
  // If the section belongs to the already active chapter, it attempts
  // to navigate directly to the section's page URL.
  // If the section belongs to a different chapter, it navigates to that
  // chapter/section URL.
  function handleSectionClick(chapterSlug: string, sectionId: string): void {
    if ($currentChapter === chapterSlug) {
      // Find the section slug from the id
      const chapter = allChapters.find((ch) => ch.slug === chapterSlug);
      const section = chapter?.sections.find((sec) => sec.id === sectionId);

      if (section && browser) {
        // Navigate to the section page instead of scrolling
        window.location.href = `/chapter/${chapterSlug}/${section.slug}`;
      }
    } else {
      if (browser) {
        // Find the section slug
        const chapter = allChapters.find((ch) => ch.slug === chapterSlug);
        const section = chapter?.sections.find((sec) => sec.id === sectionId);

        if (section) {
          window.location.href = `/chapter/${chapterSlug}/${section.slug}`;
        } else {
          // Fallback to chapter page if section not found
          window.location.href = `/chapter/${chapterSlug}`;
        }
      }
    }
  }

  // Determines if the navigation should be visually collapsed.
  // On mobile, it's controlled differently (always expanded when shown).
  // On desktop, it depends on the `sidebarExpanded` store.
  $: navCollapsed = isMobile ? false : !$sidebarExpanded;

  // --- Reactive Logic ---
  // Tracks the previous chapter to react only when the store changes.
  let previousChapter: string | null = $currentChapter; // Track previous value
  // Automatically expands the corresponding chapter accordion when the
  // `$currentChapter` store changes to a new value.
  $: {
    if ($currentChapter && $currentChapter !== previousChapter) {
      // If the current chapter store changes to a new non-null value,
      // automatically expand the corresponding accordion.
      expandedChapter = $currentChapter;
    }
    previousChapter = $currentChapter;
  }
</script>

<!-- Navigation -->
<nav class:collapsed={navCollapsed}>
  <div
    class="nav-header-container"
    class:is-active={$page.url.pathname === "/"}
  >
    <a href="/" class="nav-header-link">
      <div class="logo">
        <div class="logo-with-text">
          <div class="icon-logo">
            <Hexagon size={iconSize} color="var(--color-accent)" />
          </div>
          <h1>VistaKine</h1>
        </div>
        {#if navCollapsed}
          <div class="icon-logo">
            <Hexagon size={32} color="var(--color-accent)" />
          </div>
        {/if}
      </div>
    </a>
  </div>

  <div class="search">
    {#if navCollapsed}
      <div
        class="icon-search"
        role="button"
        tabindex="0"
        on:click={() => ($sidebarExpanded = true)}
        on:keydown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            $sidebarExpanded = true;
          }
        }}
        aria-label="Open search and expand sidebar"
      >
        <Search size={24} />
      </div>
    {:else}
      <NavSearch />
    {/if}
  </div>

  <div class="nav-content">
    <ul class="nav-items">
      <li class:is-active={$page.url.pathname === "/table_of_contents"}>
        <a href="/table_of_contents" class="nav-item">
          <div class="icon">
            <BookOpen size={iconSize} />
          </div>
          <span>Table of Contents</span>
        </a>
      </li>

      {#each chapters as chapter, index}
        {@const isActive = $currentChapter === chapter.slug}
        <li
          class="nav-chapter-group {`chapter-${index + 1}-theme`}"
          class:is-active={isActive}
        >
          <div
            class="nav-item chapter-item"
            role="button"
            tabindex="0"
            on:click={(event) => {
              // If collapsed, trigger expand/navigate (handled by this div now)
              if (navCollapsed) {
                event.preventDefault(); // Prevent default link navigation if click originated from <a>
                $sidebarExpanded = true;
                expandedChapter = chapter.slug;
                if (browser) {
                  const targetHref = `/chapter/${chapter.slug}`;
                  setTimeout(() => {
                    window.location.href = targetHref;
                  }, 0);
                }
              } else {
                // If expanded, just toggle sections
                toggleChapterSections(chapter.slug);
              }
            }}
            on:keydown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault(); // Prevent default action (scrolling)
                if (navCollapsed) {
                  // If collapsed, trigger expand/navigate
                  $sidebarExpanded = true;
                  expandedChapter = chapter.slug;
                  if (browser) {
                    const targetHref = `/chapter/${chapter.slug}`;
                    setTimeout(() => {
                      window.location.href = targetHref;
                    }, 0);
                  }
                } else {
                  // If expanded, just toggle sections
                  toggleChapterSections(chapter.slug);
                }
              }
            }}
            aria-expanded={expandedChapter === chapter.slug}
            aria-controls={`sections-${chapter.slug}`}
          >
            <a
              href={`/chapter/${chapter.slug}`}
              class="chapter-number"
              aria-label={`Go to Chapter ${index + 1}: ${chapter.title}`}
              tabindex="-1">{index + 1}</a
            >
            <a
              href={`/chapter/${chapter.slug}`}
              class="chapter-title"
              tabindex="-1"
            >
              <span>{chapter.title}</span>
            </a>
            <div
              class="chevron"
              class:expanded={expandedChapter === chapter.slug}
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide-icon lucide lucide-chevron-right"
              >
                <path d="m9 18 6-6-6-6" /></svg
              >
            </div>
          </div>
          {#if !navCollapsed && expandedChapter === chapter.slug}
            <ul
              class="chapter-sections"
              id={`sections-${chapter.slug}`}
              transition:slide={{ duration: 300, easing: quintOut }}
            >
              {#each chapter.sections || [] as section}
                <li class="section-item">
                  <a
                    href={`/chapter/${chapter.slug}/${section.slug}`}
                    class="nav-item section-link"
                    class:is-active={$page.params.section === section.slug}
                    on:click={() =>
                      handleSectionClick(chapter.slug, section.id)}
                  >
                    <span>{section.number} - {section.title}</span>
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}

      <li class:is-active={$page.url.pathname === "/physics-pg"}>
        <a href="/physics-pg" class="nav-item">
          <div class="icon">
            <Shapes size={iconSize} />
          </div>
          <span>Physics Playground</span>
        </a>
      </li>
    </ul>
  </div>

  <ul class="bottom-item">
    <li class:is-active={$page.url.pathname === "/glossary"}>
      <a href="/glossary" class="nav-item">
        <div class="icon">
          <List size={iconSize} />
        </div>
        <span>Glossary</span>
      </a>
    </li>
    <li class:is-active={$page.url.pathname === "/settings"}>
      <a href="/settings" class="nav-item">
        <div class="icon">
          <Settings size={iconSize} />
        </div>
        <span>Settings</span>
      </a>
    </li>
  </ul>
</nav>

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

<style lang="scss">
  /* ADD import for variables */
  @use "$lib/styles/variables" as variables;

  li {
    list-style: none;
    margin: 0;
    // New active styles for LI elements containing nav items
    &.is-active {
      background-color: var(--chapter-bg, rgba(59, 130, 246, 0.1));

      > .nav-item {
        // Target the direct child a.nav-item
        color: var(--color-accent);
        font-weight: bold;

        .icon {
          border-color: var(--color-accent-dark);
        }

        // When an ACTIVE item is hovered:
        &:hover {
          background-color: transparent; // Ensure the LI's active background shows through
          color: var(
            --color-accent
          ); // Text remains accent (no change from active state)
          .icon {
            border-color: var(
              --color-accent-dark
            ); // Icon remains in ACTIVE state style
          }
        }
      }
    }
  }

  nav {
    height: 100vh;
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    padding: 0;
    top: 0;
    border-right: 1.5px solid var(--color-border);
    left: 0;
    z-index: 1001;
    overflow: hidden;
    /* width: var(--sidebar-width); */
    transition: width var(--sidebar-transition-duration)
      var(--sidebar-transition-timing);
    box-sizing: border-box;

    /* ADD Media query to disable width/transition on mobile */
    @media (max-width: var(--breakpoint-l)) {
      display: none;
    }

    &.collapsed {
      width: var(--sidebar-collapsed-width);

      .nav-item {
        justify-content: center;
        padding: var(--space-xs);
      }

      .chapter-item {
        justify-content: center;
      }

      .icon,
      .chapter-number {
        margin-right: 0;
      }

      .logo {
        justify-content: center;
      }

      .icon-search {
        margin: 0 auto;
      }
    }

    min-width: 0;
    overflow: hidden;

    span {
      opacity: 1;
      transition: opacity 0.1s ease-in-out;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
  }

  .icon {
    background-color: var(--color-surface);
  }

  .nav-header-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    flex-shrink: 0;
    padding: 0 var(--space-s);
    position: relative;
    &:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
    &.is-active {
      background-color: var(--chapter-bg, rgba(59, 130, 246, 0.1));
    }
  }

  .nav-header-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
  }

  .logo {
    display: flex;
    width: 100%;
    justify-content: center;
    text-decoration: none;
    min-width: 0;
    overflow: hidden;

    span {
      opacity: 1;
      transition: opacity 0.1s ease-in-out;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
  }

  .logo-with-text {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
    opacity: 1;
    transition: opacity 0.1s ease-in-out;
    overflow: hidden;
  }

  nav.collapsed .logo-with-text {
    opacity: 0;
    pointer-events: none;
    width: 0;
    position: absolute;
  }

  nav.collapsed .icon-logo {
    position: relative;
    width: auto;
  }

  .logo h1 {
    font-size: var(--step-1);
    color: var(--color-accent);
    margin: 0;
    white-space: nowrap;
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
    padding: 0 var(--space-xs);
    flex-shrink: 0;
    height: 80px;
    border-block: 1px solid var(--color-border);
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  .search-input-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    opacity: 1;
    transition: opacity 0.1s ease-in-out;
    overflow: hidden;

    :global(svg) {
      position: absolute;
      left: 8px;
    }
  }

  nav.collapsed .search-input-container {
    opacity: 0;
    pointer-events: none;
    width: 0;
    position: absolute;
    visibility: hidden;
  }

  nav.collapsed .icon-search {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    visibility: visible;
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
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
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
    overflow: hidden;

    &:hover {
      color: var(--color-accent);

      .icon {
        border-color: var(--color-accent);
      }
    }

    span {
      opacity: 1;
      transition: opacity 0.1s ease-in-out;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
  }

  nav.collapsed .nav-item span {
    opacity: 0;
    pointer-events: none;
    width: 0;
    margin-left: 0;
    margin-right: 0;
  }

  .chapter-title {
    text-decoration: none;
    color: inherit;
    display: block;
    flex-grow: 1;
    min-width: 0;
    opacity: 1;
    transition: opacity 0.1s ease-in-out;

    &:hover {
      text-decoration: underline;
      color: var(--color-accent);
    }

    span {
      display: block;
      white-space: normal;
      word-break: break-word;
      line-height: 1.3;
      overflow: visible;
      text-overflow: clip;
    }
  }

  nav.collapsed .chapter-title {
    opacity: 0;
    pointer-events: none;
    width: 0;
    position: absolute;
    visibility: hidden;
  }

  .icon,
  .chapter-number {
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

  nav.collapsed .chapter-item .chapter-number {
    margin-right: 0;
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
    height: 155px;
    margin-bottom: 0 !important;
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-xs);
    flex-shrink: 0;
    box-sizing: border-box;
    ul {
      padding: 0;
      margin: 0;
    }
    li {
      margin-bottom: var(--space-xs);
    }
  }

  .chapter-item {
    cursor: pointer;
    overflow: visible;
  }

  .chapter-sections {
    list-style: none;
    padding-left: var(--space-s);
    margin: 0;
    transition:
      opacity 0.1s ease-in-out,
      height var(--sidebar-transition-duration) var(--sidebar-transition-timing);
  }

  nav.collapsed .chapter-sections {
    opacity: 0;
    pointer-events: none;
  }

  .section-item {
    margin-bottom: var(--space-2xs);
  }

  .section-link {
    @extend .nav-item;
    margin-top: var(--space-xs);
    padding-left: calc(var(--space-s) + var(--space-xs));
    font-size: 0.9em;
    height: auto;
    box-sizing: border-box;

    &:hover {
      background-color: var(--color-accent-hover-bg);
      text-decoration: underline;
      color: var(--chapter-color-dark);
      transition:
        background-color 0.2s ease,
        color 0.2s ease;
    }

    &.is-active {
      background-color: var(--chapter-bg);
      font-weight: bold;
      color: var(--chapter-color-dark);

      &:hover {
        background-color: var(--color-accent-hover-bg);
      }
    }

    span {
      white-space: normal;
      word-break: break-word;
      display: inline-block;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .chevron {
    margin-left: auto;
    cursor: pointer;
    padding: var(--space-2xs);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition:
      opacity 0.1s ease-in-out,
      transform 0.3s ease;

    :global(svg) {
      max-width: none;
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

  nav.collapsed .chevron {
    opacity: 0;
    pointer-events: none;
    width: 0;
    padding: 0;
    margin-left: 0;
    visibility: hidden;
  }

  .nav-chapter-group.is-active > .chapter-item {
    background-color: var(--chapter-bg, rgba(59, 130, 246, 0.1));

    .chapter-title {
      color: var(--chapter-color-dark);
      font-weight: bold;
    }
  }
</style>

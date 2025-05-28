<script lang="ts">
  import { page } from "$app/stores";
  import { sidebarExpanded, currentChapter } from "$lib/stores/appState";
  import type { Chapter } from "$lib/data/chapters"; // Import only Chapter type
  import {
    Hexagon,
    BookOpen,
    Search,
    ChevronRight,
    List,
    Shapes,
    User,
  } from "lucide-svelte";
  import { onMount, onDestroy } from "svelte";
  import { slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { tweened } from "svelte/motion"; // Import tweened
  import { browser } from "$app/environment";
  import { getChapterList, chapters as allChapters } from "$lib/data/chapters";
  import NavSearch from "$lib/components/NavSearch.svelte";
  import AccountModal from "$lib/components/auth/AccountModal.svelte";

  const iconSize = 18; // Re-add the iconSize constant

  // --- Props (Svelte 5 Runes) ---
  let {
    currentChapterSlug = null,
    // Rename isMobile prop to avoid conflict with internal state
    initialIsMobile = false,
    chapters = getChapterList(),
  }: {
    currentChapterSlug?: string | null;
    initialIsMobile?: boolean;
    chapters?: Chapter[];
  } = $props();

  // --- State (Svelte 5 Runes) ---
  // Indicates if the component is in mobile view (detected via media query).
  let isMobile = $state(initialIsMobile);
  // Tracks the currently expanded chapter accordion. Initialized from prop.
  let expandedChapter = $state<string | null>(currentChapterSlug ?? null);
  // Used to track chapter changes for the effect below.
  let previousChapter = $state<string | null>(currentChapterSlug ?? null);
  let showAccountModal = $state(false);

  // --- Derived State (Svelte 5 Runes) ---
  // Determines if the navigation should be visually collapsed.
  const navCollapsed = $derived(isMobile ? false : !$sidebarExpanded);

  // --- State variables for widths, to be populated from CSS custom properties ---
  let sidebarWidth = $state(400); // Default fallback, will be updated from CSS
  let sidebarCollapsedWidth = $state(80); // Default fallback, will be updated from CSS

  // Tweened store for sidebar width
  let navWidth = tweened(navCollapsed ? sidebarCollapsedWidth : sidebarWidth, {
    duration: 300, // Match your desired transition duration
    easing: quintOut,
  });

  // --- Effects (Svelte 5 Runes) ---

  // Effect to update tweened width when navCollapsed or base widths change
  $effect(() => {
    // Ensure $navWidth reacts to changes in sidebarWidth and sidebarCollapsedWidth
    const targetWidth = navCollapsed ? sidebarCollapsedWidth : sidebarWidth;
    navWidth.set(targetWidth);
  });

  // Effect to manage body scrolling based on sidebar state and mobile view
  $effect(() => {
    if (browser) {
      // Depend on sidebarExpanded store and isMobile state
      const shouldLockScroll = $sidebarExpanded && isMobile;

      if (shouldLockScroll) {
        document.body.classList.add("body-no-scroll");
      } else {
        document.body.classList.remove("body-no-scroll");
      }

      // Cleanup function: remove class when effect re-runs or component unmounts
      return () => {
        if (browser) {
          document.body.classList.remove("body-no-scroll");
        }
      };
    }
  });

  // Effect to automatically expand the accordion when the currentChapter store changes
  $effect(() => {
    // Read currentChapter store to establish dependency
    const current = $currentChapter;

    // Check against previous state value
    if (current && current !== previousChapter) {
      expandedChapter = current;
    }

    // Update the previousChapter state *after* the check
    previousChapter = current;
  });

  // --- Lifecycle ---
  // Sets up responsive behavior on mount:
  // 1. Detects initial mobile state based on CSS variable breakpoint.
  // 2. Listens for viewport size changes to update mobile state.
  // 3. Cleans up listeners on destroy.
  onMount(() => {
    let lgBreakpointValue = "1024px"; // Default fallback
    let mediaQuery: MediaQueryList | null = null;

    if (browser) {
      const styles = getComputedStyle(document.documentElement);

      // Read the CSS custom property for the breakpoint
      const bpValue = styles.getPropertyValue("--breakpoint-lg").trim();
      if (bpValue) {
        lgBreakpointValue = bpValue;
      }

      // Read sidebar width CSS custom properties
      const cssSidebarWidth = styles.getPropertyValue("--sidebar-width").trim();
      const cssSidebarCollapsedWidth = styles
        .getPropertyValue("--sidebar-collapsed-width")
        .trim();

      if (cssSidebarWidth) {
        sidebarWidth = parseInt(cssSidebarWidth, 10);
      }
      if (cssSidebarCollapsedWidth) {
        sidebarCollapsedWidth = parseInt(cssSidebarCollapsedWidth, 10);
      }

      mediaQuery = window.matchMedia(`(max-width: ${lgBreakpointValue})`);

      // Set initial state
      isMobile = mediaQuery.matches;

      // Handler to update state on change
      const handleResize = () => {
        if (mediaQuery) {
          isMobile = mediaQuery.matches;
        }
      };

      mediaQuery.addEventListener("change", handleResize);
      // Add resize listener as a fallback/alternative
      window.addEventListener("resize", handleResize);

      // Cleanup function
      return () => {
        if (mediaQuery) {
          mediaQuery.removeEventListener("change", handleResize);
        }
        window.removeEventListener("resize", handleResize);
      };
    }
  });

  // --- Functions ---
  // Toggles the accordion display for a given chapter's sections.
  function toggleChapterSections(chapterSlug: string): void {
    expandedChapter = expandedChapter === chapterSlug ? null : chapterSlug;
  }

  // Handles clicks on section links. Navigates to the section page.
  function handleSectionClick(chapterSlug: string, sectionId: string): void {
    const chapter = allChapters.find((ch) => ch.slug === chapterSlug);
    const section = chapter?.sections.find((sec) => sec.id === sectionId);

    console.log("[NavDebug] Clicked section link:", chapterSlug, sectionId);

    if (section && browser) {
      window.location.href = `/chapter/${chapterSlug}/${section.slug}`;
    } else if (chapter && browser) {
      // Fallback to chapter page if section not found for some reason
      window.location.href = `/chapter/${chapterSlug}`;
    }
  }
</script>

<!-- Navigation -->
<nav class:collapsed={navCollapsed} style="width: {$navWidth}px;">
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
        onclick={() => ($sidebarExpanded = true)}
        onkeydown={(e) => {
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
        {#if process.env.NODE_ENV === "development"}
          <!-- Debug logic moved to $effect in script block -->
        {/if}
        <li
          class="nav-chapter-group {`chapter-${index + 1}-theme`}"
          class:is-active={isActive}
        >
          <div
            class="nav-item chapter-item"
            role="button"
            tabindex="0"
            onclick={(event) => {
              const targetElement = event.target as HTMLElement;
              const isInnerLinkClick =
                targetElement.closest(".chapter-number") ||
                targetElement.closest(".chapter-title");

              if (navCollapsed) {
                // If collapsed, this div handles expanding and navigating.
                // Prevent default for any inner links, as we navigate centrally.
                event.preventDefault();
                console.log(
                  "[NavDebug] Clicked chapter header (collapsed branch):",
                  chapter.slug,
                  "Target:",
                  targetElement.className
                );
                $sidebarExpanded = true;
                expandedChapter = chapter.slug;
                if (browser) {
                  const targetHref = `/chapter/${chapter.slug}`;
                  setTimeout(() => {
                    window.location.href = targetHref;
                  }, 0);
                }
              } else {
                // Sidebar is expanded.
                if (isInnerLinkClick) {
                  console.log(
                    "[NavDebug] Clicked inner chapter link (expanded branch):",
                    chapter.slug,
                    "Target:",
                    targetElement.className
                  );
                  // If click was on an inner link, let the link itself navigate.
                  // Ensure its accordion is open if not already.
                  if (expandedChapter !== chapter.slug) {
                    expandedChapter = chapter.slug;
                  }
                  // We don't event.preventDefault() here, allow <a> to navigate.
                  return; // Stop this handler from doing more.
                } else {
                  // Click was on the div itself (e.g., chevron, padding), not an inner link.
                  console.log(
                    "[NavDebug] Clicked chapter header area for toggle (expanded branch):",
                    chapter.slug,
                    "Target:",
                    targetElement.className
                  );
                  toggleChapterSections(chapter.slug);
                }
              }
            }}
            onkeydown={(e) => {
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
                    }, 0); // Use setTimeout
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
                    onclick={() => handleSectionClick(chapter.slug, section.id)}
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

  <div class="bottom-item">
    <ul>
      <li class:is-active={showAccountModal} title="Account">
        <button
          class="nav-item"
          onclick={() => (showAccountModal = true)}
          aria-label="Open account modal"
        >
          <div class="icon">
            <User size={iconSize} />
          </div>
          {#if !navCollapsed}
            <span>Account</span>
          {/if}
        </button>
      </li>
      <li class:is-active={$page.url.pathname === "/glossary"}>
        <a href="/glossary" class="nav-item">
          <div class="icon">
            <List size={iconSize} />
          </div>
          {#if !navCollapsed}
            <span>Glossary</span>
          {/if}
        </a>
      </li>
    </ul>
  </div>
</nav>

{#if showAccountModal}
  <AccountModal close={() => (showAccountModal = false)} />
{/if}

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
    background-color: var(--color-surface);
    display: flex;
    flex-direction: column;
    padding: 0;
    top: 0;
    border-right: 1.5px solid var(--color-border);
    left: 0;
    z-index: 1001;
    overflow: hidden;

    box-sizing: border-box;
    box-shadow: var(--shadow-md);

    /* ADD Media query to disable width/transition on mobile */
    @media (max-width: var(--breakpoint-l)) {
      display: none;
    }

    &.collapsed {
      /* width: var(--sidebar-collapsed-width); */ /* Handled by tweened store */
      background-color: var(--color-background);
      box-shadow: none;

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
      transition: opacity var(--transition-normal) ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
  }

  .icon {
    background-color: var(--color-surface);
    span {
      opacity: 1;
      transition: opacity var(--transition-opacity-fast) ease-in-out;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
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
      transition: opacity var(--transition-opacity-fast) ease-in-out;
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
    transition: opacity var(--transition-opacity-fast) ease-in-out;
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
    transition: opacity var(--transition-opacity-fast) ease-in-out;
    overflow: hidden;

    :global(svg) {
      position: absolute;
      left: 8px;
    }

    span {
      opacity: 1;
      transition: opacity var(--transition-opacity-fast) ease-in-out;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
    border-radius: var(--space-xs) 0 0 var(--space-xs);
    position: relative;
    box-sizing: border-box;
    min-width: 0;
    overflow: hidden;

    &:hover {
      color: var(--color-accent);
      background-color: var(--color-accent-hover-bg);

      .icon {
        border-color: var(--color-accent);
      }
    }

    span {
      opacity: 1;
      transition: opacity var(--transition-opacity-fast) ease-in-out;
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
    transition: opacity var(--transition-opacity-fast) ease-in-out;

    &:hover {
      text-decoration: underline;
      color: var(--chapter-color-dark);
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
      color: var(--chapter-color-dark);
    }
  }

  .bottom-item {
    margin-top: auto;
    height: 155px;
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-xs);
    box-sizing: border-box;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      gap: var(--space-s);

      // Default styling for LI in .bottom-item (expanded state)
      li {
        width: 100%;
        // Intentionally no display:flex or align-items:center here by default
      }
    }
  }

  nav.collapsed {
    /* width: var(--sidebar-collapsed-width); */ /* Handled by tweened store */

    .nav-item {
      justify-content: center;
      padding: var(--space-xs);
    }

    .chapter-item {
      justify-content: center;
    }

    // Specific styling for LI in .bottom-item when nav is collapsed
    .bottom-item ul li {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .icon,
    .chapter-number {
      margin-right: 0;
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
      opacity var(--transition-opacity-fast) ease-in-out,
      height var(--sidebar-transition-duration) var(--sidebar-transition-timing);
  }

  nav.collapsed .chapter-sections {
    opacity: 0;
    pointer-events: none;
    justify-content: center;
    opacity: 1;
    transition:
      opacity var(--transition-opacity-fast) ease-in-out,
      transform 0.3s ease;

    :global(svg) {
      max-width: none;
      transition: transform 0.3s ease;
    }
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
      text-decoration: underline;
      color: var(--chapter-color-dark);
      transition:
        background-color 0.2s ease,
        color 0.2s ease;
    }

    &.is-active {
      background-color: var(--chapter-color-light);
      font-weight: bold;
      color: var(--chapter-color-dark);

      /* &:hover {
        background-color: var(--chapter-color-light);
      } */
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
      color: var(--chapter-color-dark, var(--color-surface));
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

  // Added: Hover styles for INACTIVE chapter items
  .nav-chapter-group:not(.is-active) > .chapter-item:hover {
    // Set text/icon color for the item, which chevron inherits
    color: var(--chapter-color-dark);

    // Explicitly set text color for children, overriding general nav-item hover
    .chapter-title span,
    .chapter-number {
      color: var(--chapter-color-dark);
    }

    // Style chapter number border on hover
    .chapter-number {
      border-color: var(--chapter-color-dark);
    }
  }

  @media (prefers-color-scheme: dark) {
    .section-link {
      &.is-active {
        background-color: var(--chapter-color);
        color: var(--color-dark-text-on-accent);
        // font-weight: bold; is inherited
      }
    }
  }
</style>

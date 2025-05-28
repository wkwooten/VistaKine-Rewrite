<script lang="ts">
  import { ArrowLeft, ArrowRight, Menu, List } from "lucide-svelte";
  import { page } from "$app/stores"; // Import page store to get chapter title if needed
  import { sectionMapOpen } from "$lib/stores/uiStores";

  // Define types for the expected navigation structures
  type ChapterLink = { slug: string; title: string } | null;
  type SectionLink = {
    slug: string;
    title: string;
    id?: string;
    number?: string;
    chapterSlug?: string;
  } | null;

  // Define props using $props
  type PageNavProps = {
    prevChapter?: ChapterLink;
    nextChapter?: ChapterLink;
    prevSection?: SectionLink;
    nextSection?: SectionLink;
    currentChapterSlug: string;
    currentChapterTitle?: string | null;
    currentChapterNumber?: number | string | null;
    currentSectionSlug?: string | null;
  };

  // Revert getting full props object
  let {
    prevChapter = null,
    nextChapter = null,
    prevSection = null,
    nextSection = null,
    currentChapterSlug,
    currentChapterTitle = null,
    currentChapterNumber = null,
    currentSectionSlug = null,
  }: PageNavProps = $props();

  // ADD CONSOLE LOGGING
  console.log("[PageNav] Received Props:", {
    prevChapter,
    nextChapter,
    prevSection,
    nextSection,
    currentChapterSlug,
    currentChapterTitle,
    currentChapterNumber,
    currentSectionSlug,
  });

  // Determine navigation mode using $derived
  const hasChapterNav = $derived(prevChapter !== null || nextChapter !== null);
  const hasSectionNav = $derived(prevSection !== null || nextSection !== null);

  // Helper to format slug to title if title prop not passed
  function formatSlugToTitle(slug: string): string {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Determine the title for the current chapter link using $derived
  const chapterIntroTitle = $derived(
    currentChapterTitle ??
      (currentChapterSlug
        ? formatSlugToTitle(currentChapterSlug)
        : "Chapter Intro")
  );
</script>

<nav class="page-nav">
  <div class="nav-links">
    <!-- Previous link logic -->
    {#if prevSection && currentChapterSlug}
      <!-- Case 1: Navigating from a section to the previous section (or previous chapter's last section) -->
      {console.log("[PageNav] Rendering Prev Link (Section):", {
        prevSection,
        href: `/chapter/${prevSection.chapterSlug ?? currentChapterSlug}/${prevSection.slug}`,
      })}
      <a
        href={`/chapter/${prevSection.chapterSlug ?? currentChapterSlug}/${prevSection.slug}`}
        class="nav-link prev"
        data-section-number={prevSection.number ?? ""}
      >
        <ArrowLeft size={18} />
        <div class="nav-content">
          <div class="nav-label">Previous Section</div>
          <div class="nav-title">{prevSection.title}</div>
        </div>
      </a>
    {:else if currentSectionSlug && currentChapterSlug}
      <!-- Case 2: On first section, link back to current chapter overview -->
      {console.log("[PageNav] Rendering Prev Link (Chapter Intro):", {
        currentChapterSlug,
        href: `/chapter/${currentChapterSlug}`,
      })}
      <a
        href={`/chapter/${currentChapterSlug}`}
        class="nav-link prev chapter-intro-link"
        data-chapter-number={currentChapterNumber ?? ""}
      >
        <ArrowLeft size={18} />
        <div class="nav-content">
          <div class="nav-label">Chapter Intro</div>
          <div class="nav-title">{chapterIntroTitle}</div>
        </div>
      </a>
    {:else if prevChapter}
      <!-- Case 3: On chapter overview (and prevSection was null), link to previous chapter overview -->
      {console.log("[PageNav] Rendering Prev Link (Previous Chapter):", {
        prevChapter,
        href: `/chapter/${prevChapter.slug}`,
      })}
      <a href={`/chapter/${prevChapter.slug}`} class="nav-link prev">
        <ArrowLeft size={18} />
        <div class="nav-content">
          <div class="nav-label">Previous Chapter</div>
          <div class="nav-title">{prevChapter.title}</div>
        </div>
      </a>
    {:else}
      <!-- Case 4: No previous chapter or section, link Home -->
      {console.log("[PageNav] Rendering Prev Link (Home)")}
      <a href="/" class="nav-link prev">
        <ArrowLeft size={18} />
        <div class="nav-content">
          <div class="nav-label">Home</div>
          <div class="nav-title">Beginning</div>
        </div>
      </a>
    {/if}

    <!-- Table of Contents link (Always shown now) -->
    <!-- REMOVED Old TOC Link -->
    <!-- <a href="/chapter/toc" class="nav-link toc">
      <Menu size={18} />
      <div class="nav-content">
        <div class="nav-title">Table of Contents</div>
      </div>
    </a> -->

    <!-- ADD Section Map Toggle Button -->
    <button
      type="button"
      class="nav-link section-map-toggle"
      aria-label="Toggle section navigation"
      onclick={() => sectionMapOpen.update((v) => !v)}
    >
      <List size={18} />
      <div class="nav-content mobile-hidden-text">
        <!-- Hide text on mobile -->
        <div class="nav-title">Section Map</div>
      </div>
    </button>

    <!-- Next link logic -->
    {#if nextSection && currentChapterSlug}
      <a
        href={`/chapter/${currentChapterSlug}/${nextSection.slug}`}
        class="nav-link next"
        data-section-number={nextSection.number ?? ""}
      >
        <div class="nav-content">
          <div class="nav-label">Next Section</div>
          <div class="nav-title">{nextSection.title}</div>
        </div>
        <ArrowRight size={18} />
      </a>
    {:else if nextChapter}
      <a href={`/chapter/${nextChapter.slug}`} class="nav-link next">
        <div class="nav-content">
          <div class="nav-label">Next Chapter</div>
          <div class="nav-title">{nextChapter.title}</div>
        </div>
        <ArrowRight size={18} />
      </a>
    {:else}
      <span class="nav-link next disabled">
        <div class="nav-content">
          <div class="nav-title">End</div>
        </div>
        <ArrowRight size={18} />
      </span>
    {/if}
  </div>
</nav>

<style lang="scss">
  @use "$lib/styles/variables" as vars;

  .page-nav {
    text-align: center;
    width: 100%;
    background-color: var(--color-surface);
    position: sticky;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-md);
    /* margin-bottom: var(--space-s); */
    bottom: 10px;
    z-index: 1000;
  }

  .nav-links {
    display: flex;
    justify-content: space-between;
    max-width: var(--max-content-width, 1200px);
    margin: 0 auto;
    gap: var(--space-xs); // Keep gap for mobile
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
    color: var(--color-text-primary);
    text-decoration: none;
    /* border: 1px solid var(--color-border); */
    padding: var(--space-xs) var(--space-s);
    transition: all 0.2s ease;
    font-size: var(--step--1);
    flex: 1;
    min-width: 0;
    background-color: transparent;
    cursor: pointer;
    font-family: inherit;

    .nav-content {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      flex: 1;
    }

    .nav-label {
      font-size: var(--step--2);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-3xs);
    }

    .nav-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:hover:not(.disabled) {
      background-color: var(--color-accent-hover-bg);
    }

    &.prev {
      justify-content: flex-start;
      text-align: left;
      border-right: none;
    }

    &.next {
      justify-content: flex-end;
      text-align: right;
      border-left: none;

      .nav-content {
        align-items: flex-end;
      }
    }

    &.section-map-toggle {
      display: flex; // Show on all screen sizes now
      justify-content: center;
      text-align: center;
      flex-grow: 0;
      flex-basis: auto;
      padding-left: var(--space-m);
      padding-right: var(--space-m);
      border-inline: 1px solid var(--color-border);

      .nav-content {
        align-items: center;
      }

      @media (min-width: calc(vars.$breakpoint-xl + 1px)) {
        display: none; // Hide on very large screens where section map is always visible
      }
    }

    /* Mobile Styles */
    @media (max-width: vars.$breakpoint-lg) {
      padding: var(--space-xs) var(--space-s);
      gap: var(--space-2xs);
      flex: 1;
      min-width: 0;

      .nav-label {
        display: none;
      }

      .nav-title {
        font-size: var(--step--1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      // Hide text content for specific mobile links
      &.prev,
      &.next {
        .nav-title {
          display: none;
        }
        /* Use pseudo-element to show number */
        &::after {
          content: attr(data-section-number);
          font-size: var(--step--1);
          font-weight: 500;
          margin-left: var(--space-3xs);
          white-space: nowrap;
        }
      }

      // Align number for Prev link
      &.prev::after {
        order: 1;
        margin-left: var(--space-2xs);
        margin-right: 0;
      }
      /* Specific content for chapter intro link */
      &.prev.chapter-intro-link::after {
        content: attr(data-chapter-number);
      }

      // Align number for Next link
      &.next {
        .nav-content {
          order: -1;
          display: none;
        }
        &::after {
          order: -1;
          margin-left: 0;
          margin-right: var(--space-2xs);
        }
      }

      // Mobile TOC specific styles - Now Section Map Toggle
      &.section-map-toggle {
        flex-grow: 0;
        flex-basis: auto;
        padding-left: var(--space-s);
        padding-right: var(--space-s);

        // Hide text content for section map toggle on mobile
        .nav-content.mobile-hidden-text {
          display: none;
        }
      }
    } // End media query

    &.disabled {
      color: var(--color-text-disabled);
      pointer-events: none;
      opacity: 0.6;
      background-color: transparent;
    }
  } // End .nav-link
</style>

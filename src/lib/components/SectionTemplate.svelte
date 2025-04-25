<script lang="ts">
  import { currentSection } from '$lib/stores/appState.js';
  import Footer from '$lib/components/Footer.svelte';
  import PageNav from '$lib/components/PageNav.svelte';
  import { getChapterBySlug } from '$lib/data/chapters';
  import { onMount } from 'svelte';

  export let chapterSlug: string;
  export let sectionSlug: string;
  export let themeClass: string = '';
  // Accept chapter title from parent (+page.svelte)
  export let currentChapterTitle: string | null = null;
  // Accept current chapter slug from parent (+page.svelte)
  export let currentChapterSlug: string;
  // Accept chapter number from parent (+page.svelte)
  export let chapterNumber: number | string | undefined = undefined;

  // For debugging
  onMount(() => {
    console.log(`SectionTemplate mounted with chapterSlug=${chapterSlug}, sectionSlug=${sectionSlug}`);
  });

  $: {
    console.log(`SectionTemplate props updated: chapterSlug=${chapterSlug}, sectionSlug=${sectionSlug}`);
  }

  $: chapter = getChapterBySlug(chapterSlug);
  $: section = chapter?.sections.find(s => s.slug === sectionSlug);

  $: {
    if (chapter) {
      console.log(`Found chapter: ${chapter.title}`);
    } else {
      console.error(`Chapter not found: ${chapterSlug}`);
    }

    if (section) {
      console.log(`Found section: ${section.title}`);
    } else if (chapter) {
      console.error(`Section not found: ${sectionSlug} in chapter ${chapter.title}`);
    }
  }

  // Get previous and next sections for navigation
  $: sectionIndex = chapter?.sections.findIndex(s => s.slug === sectionSlug) ?? -1;
  $: prevSectionData = sectionIndex > 0 ? chapter?.sections[sectionIndex - 1] : null;
  $: nextSectionData = sectionIndex < (chapter?.sections.length ?? 0) - 1 ? chapter?.sections[sectionIndex + 1] : null;

  // Create simplified objects for PageNav, including the number
  $: prevSectionForNav = prevSectionData ? {
      slug: prevSectionData.slug,
      title: prevSectionData.title,
      number: prevSectionData.number
  } : null;

  $: nextSectionForNav = nextSectionData ? {
      slug: nextSectionData.slug,
      title: nextSectionData.title,
      number: nextSectionData.number
  } : null;

  // Handle chapter changes if last or first section
  $: prevChapterSlug = sectionIndex === 0 ? chapter?.prevChapter : null;
  $: nextChapterSlug = sectionIndex === (chapter?.sections.length ?? 0) - 1 ? chapter?.nextChapter : null;

  // Get previous and next chapter objects for navigation
  $: prevChapterObj = prevChapterSlug ? { slug: prevChapterSlug, title: getChapterBySlug(prevChapterSlug)?.title || 'Previous Chapter' } : null;
  $: nextChapterObj = nextChapterSlug ? { slug: nextChapterSlug, title: getChapterBySlug(nextChapterSlug)?.title || 'Next Chapter' } : null;
</script>

<svelte:options namespace="html" />

<svelte:head>
  <title>{section?.title || 'Section'} | {chapter?.title || 'Chapter'} | VistaKine</title>
</svelte:head>

<div class="chapter section-container {themeClass}">
  <div class="section-content-wrapper">
    <PageNav
      prevSection={prevSectionForNav}
      nextSection={nextSectionForNav}
      prevChapter={prevChapterObj}
      nextChapter={nextChapterObj}
      currentChapterSlug={currentChapterSlug}
      currentChapterTitle={currentChapterTitle}
      currentChapterNumber={chapterNumber}
    />

    <!-- Standardized Section Title -->
    {#if section}
      <h1 class="section-title">
        <span class="section-number-prefix">Section {section.number}:</span> <br/> <span class="section-title-main">{section.title}</span>
      </h1>
    {/if}

    <article class="section-content">
      <slot></slot>
    </article>

    <PageNav
      prevSection={prevSectionForNav}
      nextSection={nextSectionForNav}
      prevChapter={prevChapterObj}
      nextChapter={nextChapterObj}
      currentChapterSlug={currentChapterSlug}
      currentChapterTitle={currentChapterTitle}
      currentChapterNumber={chapterNumber}
    />
  </div>
  <Footer />
</div>


<style lang="scss">
  @use '$lib/styles/variables' as vars;

  .section-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    color: var(--color-text-primary);
  }

  .section-content-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: var(--wide-content-width);
    padding: var(--space-s);
    gap: var(--space-xl);
    flex-grow: 1;

    @media (max-width: vars.$breakpoint-lg) {
      padding: var(--space-xs) 0;
      gap: var(--space-l);
      max-width: 100%;
    }
  }

  .section-content {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Default styles for figures/figcaptions */
  :global(figure) {
    width: 100%;
    margin: var(--space-m) 0;
  }

  :global(figcaption) {
    text-align: center;
    font-style: italic;
    margin-top: var(--space-xs);
    color: var(--color-text-secondary);
  }

  /* Section titles */
  :global(.section-title) {
    background-color: transparent;
    color: var(--chapter-color);
    margin-top: 0;
    margin-bottom: var(--space-l);
    padding: var(--space-s) 0;
    border-bottom: 3px solid var(--chapter-color);
    text-align: center;
    text-wrap: balance;
    line-height: 1.2;
  }

  :global(.section-title .section-number-prefix) {
    display: block;
    font-size: var(--step-3);
    font-weight: 500;
    opacity: 0.85;
    margin-bottom: var(--space-3xs);
  }

  :global(.section-title .section-title-main) {
    display: block;
    font-size: var(--step-4);
    font-weight: 700;
  }

  /* Content block headings (h2) */
  :global(h2) {
    font-size: var(--step-2);
    /* color: var(--chapter-color-dark, var(--color-text-primary)); */
    margin-bottom: var(--space-m);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--color-border);
  }

  /* Basic text styling for content blocks */
  :global(.section-intro p),
  :global(.concept-block p),
  :global(.section-core p),
  :global(.section-header-block p),
  :global(.concept-block ul),
  :global(.concept-block ol),
  :global(.concept-block li),
  :global(.concept-block blockquote) {
    margin-bottom: var(--space-m);
    line-height: 1.7;
  }

  /* Subsection styling */
  :global(.subsection-title) {
    font-size: var(--step-1);
    font-weight: bold;
    text-wrap: balance;
    margin-top: var(--space-l);
    margin-bottom: var(--space-s);
  }

  /* Section review block */
  :global(.activity-block.-review) {
    /* border-top: 1px solid var(--color-border); */ /* Removed border-top as card has border */
    /* padding-top: var(--space-m); */ /* Padding is handled by the main .activity-block rule */
    margin-top: var(--space-xl); /* Keep margin */
  }

  /* Readable content */
  :global(.readable-content) {
    max-width: var(--readable-max-width, 75ch);
    margin-inline: auto;
    padding-inline: var(--space-m);
    width: 100%;
    box-sizing: border-box;

    @media (max-width: vars.$breakpoint-lg) {
      padding-inline: var(--space-s);
    }

    @media (max-width: vars.$breakpoint-sm) {
      padding-inline: 0;
    }
  }

  /* Two tiers of visualization cards */

  /* REMOVED: Basic visualization card styles (merged into .visualization-block:not(.-exercise)) */
  /* :global(.visualization-card) { ... } */
  /* :global(.visualization-card figure), ... */
  /* :global(.visualization-card:not(.-exercise):hover) { ... } */
  /* @media (max-width: vars.$breakpoint-md) { ... } */


  /* Interactive visualization container - styles remain */
  :global(.visualization-block.-exercise) {
    /* This block will have minimal styling as the exercises already have their own styling */
    margin-top: var(--space-xl);
    margin-bottom: var(--space-xl);

    /* Remove any conflicting styles when inside visualization-card */
    &.visualization-card {
      background-color: transparent;
      border: none;
      padding: 0;
      box-shadow: none;
    }

    /* But keep the margins */
    &.visualization-card {
      margin: var(--space-xl) 0;
    }

    /* Style for exercise description */
    & .exercise-description {
      font-size: var(--step-0);
      margin-bottom: var(--space-m);
      color: var(--color-text-secondary);
      line-height: 1.6;
    }
  }

  /* Semantic Block Styles - Added card styles */
  :global(.section-header-block) {
    margin-bottom: var(--space-xl);
    /* Card styles NOT added here yet - pending decision */
  }

  :global(.concept-block) {
    margin-top: var(--space-l);
    margin-bottom: var(--space-xl);
    /* Added card styles */
    background-color: var(--color-surface);
    box-shadow: var(--shadow-lg);
    border-radius: var(--radius-md);
    padding: var(--space-l);
  }

  :global(.visualization-block) {
    /* Shared margins */
    margin-top: var(--space-xl);
    margin-bottom: var(--space-xl);

    /* Card styles apply to ALL visualization blocks now */
    background-color: var(--color-surface);
    border: 1px solid var(--color-border); /* Keep border */
    border-radius: var(--radius-md);
    padding: var(--space-l);
    box-shadow: var(--shadow-lg); /* Added shadow */

    /* Maintain hover effect for all */
    &:hover {
        box-shadow: var(--shadow-xl); /* Enhanced shadow on hover */
        /* border-color: var(--chapter-color-light, var(--color-accent-light)); */ /* Optional: Accent border on hover */
    }

    /* Responsive adjustments for all visualization blocks */
    @media (max-width: vars.$breakpoint-md) {
      border-radius: 0;
      border-left: none;
      border-right: none;
      /* Adjust margins to account for removed padding - Applied via padding now */
      padding-inline: var(--space-s); /* Use padding for spacing */
    }

    /* Exercise-specific styles can still exist if needed, but appearance is handled above */
    &.-exercise {
      /* Example: Maybe slightly different padding for exercises? */
      /* padding: var(--space-m); */

      /* Ensure inner exercise description styles don't conflict badly */
      & .exercise-description {
        font-size: var(--step-0);
        margin-bottom: var(--space-m);
        color: var(--color-text-secondary);
        line-height: 1.6;
        /* Maybe remove extra margin if padding is sufficient */
         margin-left: 0; /* Ensure it aligns within the new padding */
         margin-right: 0;
      }
    }
  }

  :global(.activity-block) {
    margin-top: var(--space-xl);
    margin-bottom: var(--space-xl);
    /* Added card styles */
    background-color: var(--color-surface);
    box-shadow: var(--shadow-lg);
    border-radius: var(--radius-md);
    padding: var(--space-l);
  }
</style>
<script lang="ts">
  import { currentSection } from '$lib/stores/appState.js';
  import Footer from '$lib/components/Footer.svelte';
  import PageNav from '$lib/components/PageNav.svelte';
  import { getChapterBySlug } from '$lib/data/chapters';
  import { onMount } from 'svelte';

  export let chapterSlug: string;
  export let sectionSlug: string;
  export let themeClass: string = '';

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
  $: prevSection = sectionIndex > 0 ? chapter?.sections[sectionIndex - 1] : null;
  $: nextSection = sectionIndex < (chapter?.sections.length ?? 0) - 1 ? chapter?.sections[sectionIndex + 1] : null;

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
      prevSection={prevSection}
      nextSection={nextSection}
      prevChapter={prevChapterObj}
      nextChapter={nextChapterObj}
      currentChapterSlug={chapterSlug}
    />

    <article class="section-content">
      <slot></slot>
    </article>

    <PageNav
      prevSection={prevSection}
      nextSection={nextSection}
      prevChapter={prevChapterObj}
      nextChapter={nextChapterObj}
      currentChapterSlug={chapterSlug}
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
    gap: var(--space-l);
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

  /* ------------- Moved from chapter-styles.scss ------------- */

  /* Content section styles */
  :global(.content-section) {
    scroll-margin-top: 2rem;
    position: relative;
    padding: var(--space-l);
    padding-top: var(--space-xl);
    padding-bottom: var(--space-3xl);
    margin-bottom: var(--space-xl);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-lg);
    border-radius: var(--radius-md);

    @media (max-width: vars.$breakpoint-lg) {
      padding: var(--space-s);
      margin-bottom: var(--space-l);
      border-radius: 0;
      border-left: none;
      border-right: none;
      box-shadow: none;
    }
  }

  /* Section number indicators - top and bottom */
  :global(.content-section::after) {
    content: attr(data-section);
    position: absolute;
    left: 30px;
    top: var(--space-m);
    color: var(--chapter-color);
    font-size: var(--step-0);
    font-weight: bold;
    opacity: 0.7;
  }

  :global(.content-section::before) {
    content: attr(data-section);
    position: absolute;
    left: 30px;
    bottom: var(--space-m);
    color: var(--chapter-color);
    font-size: var(--step-0);
    font-weight: bold;
    opacity: 0.7;
  }

  /* Section line */
  :global(.section-line) {
    position: absolute;
    top: calc(var(--space-m) + var(--step-0) * 1.2 + 5px);
    bottom: calc(var(--space-m) + var(--step-0) * 1.2 + 5px);
    left: 45px;
    width: 2px;
    background-color: var(--chapter-color);
    opacity: 0.5;
  }

  @media (max-width: vars.$breakpoint-lg) {
    :global(.content-section::before),
    :global(.content-section::after),
    :global(.section-line) {
      display: none;
    }
  }

  /* Section titles */
  :global(.section-title) {
    background-color: transparent;
    color: var(--chapter-color);
    margin-top: 0;
    margin-bottom: var(--space-l);
    padding: var(--space-xs) 0;
    border-bottom: 2px solid var(--chapter-color);
    font-size: var(--step-3);
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
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-m);
    margin-top: var(--space-xl);
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

  /* Basic visualization card - for simple visualizations */
  :global(.visualization-card) {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-l);
    margin: var(--space-l) 0;
  }

  :global(.visualization-card figure),
  :global(.visualization-card p) {
    margin-left: 0;
    margin-right: 0;
  }

  :global(.visualization-card figure) {
    margin-bottom: var(--space-m);
    margin-top: 0;
  }

  /* Interactive visualization container - for complex interactive components */
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

  /* Hover effect only for normal visualization cards */
  :global(.visualization-card:not(.-exercise):hover) {
    box-shadow: var(--shadow-lg);
    /* border-color: var(--chapter-color-light, var(--color-accent-light)); */
  }

  @media (max-width: vars.$breakpoint-md) {
    :global(.visualization-card:not(.-exercise)) {
      border-radius: 0;
      border-left: none;
      border-right: none;
      margin-left: calc(-1 * var(--space-s));
      margin-right: calc(-1 * var(--space-s));
    }
  }

  /* Semantic Block Styles */
  :global(.section-header-block) {
    margin-bottom: var(--space-xl);
  }

  :global(.concept-block) {
    margin-top: var(--space-l);
    margin-bottom: var(--space-xl);
  }

  :global(.visualization-block) {
    margin-top: var(--space-xl);
    margin-bottom: var(--space-xl);
  }

  :global(.activity-block) {
    margin-top: var(--space-xl);
    margin-bottom: var(--space-xl);
  }
</style>
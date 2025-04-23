<script lang="ts">
  import { currentSection } from '$lib/stores/appState';
  import Footer from '$lib/components/Footer.svelte';
  import { getChapterBySlug } from '$lib/data/chapters';
  import '$lib/styles/chapter-styles.scss';
  import { onMount } from 'svelte';

  export let chapterSlug: string;
  export let sectionSlug: string;
  export let themeClass: string = '';

  // For debugging
  onMount(() => {
    console.log(`SectionTemplate mounted with chapterSlug=${chapterSlug}, sectionSlug=${sectionSlug}`);
  });

  $: {
    // Log whenever props change
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
</script>

<svelte:options namespace="html" />

<svelte:head>
  <title>{section?.title || 'Section'} | {chapter?.title || 'Chapter'} | VistaKine</title>
</svelte:head>

<div class="section {themeClass}">
  <div class="container">
    <nav class="section-nav">
      <div class="prev-next-links">
        {#if prevSection}
          <a href="/chapter/{chapterSlug}/{prevSection.slug}" class="prev-link">
            Previous: {prevSection.title}
          </a>
        {:else if prevChapterSlug}
          <a href="/chapter/{prevChapterSlug}" class="prev-link">
            Previous Chapter
          </a>
        {/if}

        {#if nextSection}
          <a href="/chapter/{chapterSlug}/{nextSection.slug}" class="next-link">
            Next: {nextSection.title}
          </a>
        {:else if nextChapterSlug}
          <a href="/chapter/{nextChapterSlug}" class="next-link">
            Next Chapter
          </a>
        {/if}
      </div>
    </nav>

    <article class="section-content">
      <h1>{section?.title || 'Section'}</h1>

      <slot></slot>
    </article>
  </div>
  <Footer />
</div>


<style lang="scss">
  .section {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    color: var(--color-text-primary);
  }

  .section-content {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-m);
  }

  .section-nav {
    width: 100%;
    padding: var(--space-s);
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .prev-next-links {
    display: flex;
    justify-content: space-between;
    max-width: 800px;
    margin: 0 auto;
  }

  .prev-link, .next-link {
    padding: var(--space-xs);
    color: var(--color-accent);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
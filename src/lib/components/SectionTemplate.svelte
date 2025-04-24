<script lang="ts">
  import { currentSection } from '$lib/stores/appState';
  import Footer from '$lib/components/Footer.svelte';
  import PageNav from '$lib/components/PageNav.svelte';
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

  // Get previous and next chapter objects for navigation
  $: prevChapterObj = prevChapterSlug ? { slug: prevChapterSlug, title: getChapterBySlug(prevChapterSlug)?.title || 'Previous Chapter' } : null;
  $: nextChapterObj = nextChapterSlug ? { slug: nextChapterSlug, title: getChapterBySlug(nextChapterSlug)?.title || 'Next Chapter' } : null;
</script>

<svelte:options namespace="html" />

<svelte:head>
  <title>{section?.title || 'Section'} | {chapter?.title || 'Chapter'} | VistaKine</title>
</svelte:head>

<div class="section {themeClass}">
  <div class="container">
    <!-- Top navigation -->
    <PageNav
      prevSection={prevSection}
      nextSection={nextSection}
      prevChapter={prevChapterObj}
      nextChapter={nextChapterObj}
      currentChapterSlug={chapterSlug}
    />

    <article class="section-content">
      <h1>{section?.title || 'Section'}</h1>

      <slot></slot>
    </article>

    <!-- Bottom navigation - same as top -->
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
    padding: var(--space-s);
  }
</style>
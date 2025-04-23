<script lang="ts">
  import { currentSection } from '$lib/stores/appState';
  import PageNav from '$lib/components/PageNav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ChapterHeaderNav from '$lib/components/ChapterHeaderNav.svelte';
  import '$lib/styles/chapter-styles.scss';

  interface Chapter {
    slug: string;
    title: string;
  }

  export let chapterTitle: string;
  export let chapterSections: Array<any>;
  export let prevChapter: string | Chapter | null = null;
  export let nextChapter: string | Chapter | null = null;
  export let currentChapterSlug: string;
  export let themeClass: string = '';

  // Get the first section to direct users there
  $: firstSection = chapterSections.length > 0 ? chapterSections[0] : null;
</script>

<svelte:options namespace="html" />

<svelte:head>
  <title>{chapterTitle} | VistaKine</title>
</svelte:head>

<div class="chapter {themeClass}">
  <div class="container">
    <div class="chapter-intro">
      <h1>{chapterTitle}</h1>

      {#if firstSection}
        <a href="/chapter/{currentChapterSlug}/{firstSection.slug}" class="start-reading-btn">
          Start Reading
        </a>
      {/if}

      <h2>Sections</h2>
      <ul class="section-list">
        {#each chapterSections as section}
          <li>
            <a href="/chapter/{currentChapterSlug}/{section.slug}">
              {section.title}
            </a>
          </li>
        {/each}
      </ul>
    </div>
    <slot></slot>
  </div>
  <!-- <PageNav /> -->
  <Footer />
</div>


<style lang="scss">
  .chapter {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    /* padding: var(--space-xl) 0; */
    color: var(--color-text-primary);
  }

  .chapter-content {
    color: var(--color-text-primary);
  }

  .chapter-intro {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-l);
    text-align: center;
  }

  .start-reading-btn {
    display: inline-block;
    padding: var(--space-s) var(--space-m);
    margin: var(--space-m) 0;
    background-color: var(--color-accent);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;

    &:hover {
      background-color: var(--color-accent-dark, rgba(50, 100, 220, 1));
      filter: brightness(0.9);
    }
  }

  .section-list {
    list-style: none;
    padding: 0;
    margin: var(--space-m) 0;
    text-align: left;

    li {
      margin-bottom: var(--space-xs);

      a {
        color: var(--color-accent);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>

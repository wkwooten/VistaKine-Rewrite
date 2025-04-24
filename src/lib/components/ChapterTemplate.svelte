<script lang="ts">
  import { currentSection } from '$lib/stores/appState';
  import PageNav from '$lib/components/PageNav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ChapterHeaderNav from '$lib/components/ChapterHeaderNav.svelte';
  import Keyword from '$lib/components/Keyword.svelte';
  import { ArrowRight } from 'lucide-svelte';
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
  export let chapterIntro: string = '';
  export let chapterNumber: string = '';

  // Get the first section to direct users there
  $: firstSection = chapterSections.length > 0 ? chapterSections[0] : null;

  // Format chapter objects if they're strings
  $: prevChapterObj = typeof prevChapter === 'string'
    ? { slug: prevChapter, title: 'Previous Chapter' }
    : prevChapter;

  $: nextChapterObj = typeof nextChapter === 'string'
    ? { slug: nextChapter, title: 'Next Chapter' }
    : nextChapter;
</script>

<svelte:options namespace="html" />

<svelte:head>
  <title>{chapterTitle} | VistaKine</title>
</svelte:head>

<div class="chapter {themeClass}">

  <div class="container">
    <PageNav
    prevChapter={prevChapterObj}
    nextChapter={nextChapterObj}
  />

    <div class="chapter-wrapper">
      <header class="chapter-header">
        <h1>{chapterNumber ? `${chapterNumber}: ` : ''}<br> {chapterTitle}</h1>
        {#if chapterIntro}
          <p class="chapter-intro">
            {@html chapterIntro}
          </p>
        {/if}
      </header>

      <div class="chapter-overview">
        <p class="section-intro">This chapter covers the following topics:</p>
        <div class="section-list">
          {#each chapterSections as section, index}
            <a href="/chapter/{currentChapterSlug}/{section.slug}" class="section-card">
              <div class="section-content">
                <h2>{section.title}</h2>
                {#if section.description}
                  <p>{section.description}</p>
                {:else}
                  <p>Explore this section to learn more about {section.title.toLowerCase()}.</p>
                {/if}
                <span class="section-link">
                  Explore Section
                  <ArrowRight size={16} class="arrow-icon" />
                </span>
              </div>
            </a>
          {/each}
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
  <Footer />
</div>


<style lang="scss">
  .chapter {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    color: var(--color-text-primary);
  }

  /* Consistent Chapter Spacing */
  .chapter-header {
    margin-bottom: var(--space-xl);
  }

  .chapter-intro {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-m) 0;
  }

  .chapter-overview {
    margin-top: var(--space-xl);
    text-align: center;
  }

  .section-intro {
    margin-bottom: var(--space-m);
    font-size: var(--step-0);
    opacity: 0.8;
  }

  .section-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--space-l);
    margin-top: var(--space-l);
  }

  .section-card {
    border: 1px solid var(--color-border);
    padding-bottom: var(--space-s);
    border-radius: var(--radius-m);
    background-color: var(--color-surface);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    overflow: hidden;
    text-decoration: none;
    color: inherit;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  .section-content {
    padding: var(--space-m);
    display: flex;
    flex-direction: column;
    text-align: left;
    width: 100%;
  }

  h2 {
    font-size: var(--step-0); /* Smaller title */
    margin-bottom: var(--space-s);
    color: var(--primary-color);
    line-height: 1.2;
    transition: color 0.2s ease;
  }

  p {
    margin-bottom: var(--space-m);
    flex-grow: 1;
    font-size: var(--step--1);
    line-height: 1.4;
  }

  .section-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2xs);
    color: var(--primary-color);
    font-weight: 500;
    margin-top: auto;
    transition: transform 0.2s ease;
  }

  .arrow-icon {
    transition: transform 0.2s ease;
  }

  .section-card:hover .section-link {
    text-decoration: underline;
  }

  .section-card:hover .arrow-icon {
    transform: translateX(4px);
  }

  .section-card:hover h2 {
    color: var(--color-accent, #4a7bff);
  }
</style>

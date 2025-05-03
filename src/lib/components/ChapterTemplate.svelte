<svelte:options namespace="html" />

<script lang="ts">
  import { currentSection } from "$lib/stores/appState";
  import Footer from "$lib/components/Footer.svelte";
  import Keyword from "$lib/components/Keyword.svelte";
  import { ArrowRight } from "lucide-svelte";
  import "$lib/styles/chapter-styles.scss";
  import PageNav from "$lib/components/PageNav.svelte";

  interface Chapter {
    slug: string;
    title: string;
  }

  // ADD ChapterLink type for consistency
  type ChapterLink = { slug: string; title: string } | null;
  // ADD SectionLink type for consistency
  type SectionLink = {
    slug: string;
    title: string;
    number?: string;
    chapterSlug?: string;
  } | null;

  export let chapterTitle: string;
  export let chapterSections: Array<any>;
  // UPDATE prop types to use ChapterLink
  export let prevChapter: ChapterLink = null;
  export let nextChapter: ChapterLink = null;
  // ADD props for prev/next section data from loader
  export let prevSection: SectionLink = null;
  export let nextSection: SectionLink = null;
  export let currentChapterSlug: string;
  export let themeClass: string = "";
  export let chapterIntro: string = "";
  export let chapterNumber: string = "";

  // Get the first section to direct users there
  $: firstSection =
    Array.isArray(chapterSections) && chapterSections.length > 0
      ? chapterSections[0]
      : null;
</script>

<svelte:head>
  <title>{chapterTitle} | VistaKine</title>
</svelte:head>

<div class="chapter {themeClass}">
  <div class="container">
    <div class="chapter-wrapper">
      <header class="chapter-header">
        <h1>
          {chapterNumber ? `${chapterNumber}: ` : ""}<br />
          {chapterTitle}
        </h1>
        {#if chapterIntro}
          <p class="chapter-intro">
            {@html chapterIntro}
          </p>
        {/if}
      </header>

      <div class="chapter-overview">
        <p class="section-intro">This chapter covers the following topics:</p>
        <div class="section-list">
          {#each chapterSections || [] as section, index}
            <a
              href="/chapter/{currentChapterSlug}/{section.slug}"
              class="section-card"
            >
              <div class="section-content">
                <h2>{section.title}</h2>
                {#if section.description}
                  <p>{section.description}</p>
                {:else}
                  <p>
                    Explore this section to learn more about {section.title.toLowerCase()}.
                  </p>
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

  <PageNav
    {prevChapter}
    {nextChapter}
    {currentChapterSlug}
    currentChapterTitle={chapterTitle}
    currentChapterNumber={chapterNumber}
    {nextSection}
    {prevSection}
  />

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
    color: var(--chapter-color);
  }

  .chapter-intro {
    margin: 0 auto;
    padding: var(--space-m) 0;
  }

  .chapter-overview {
    margin-top: var(--space-xl);
    text-align: center;
    margin-bottom: var(--space-xl);
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
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
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
    color: var(--chapter-color);
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
    color: var(--chapter-color);
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

  .section-card:hover h2 {
    color: var(--color-accent);
  }

  .chapter-nav {
    display: flex;
    margin-top: var(--space-lg);
    padding: var(--space-xs) var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
  }

  .chapter-link {
    flex: 1;
    padding: var(--space-xs) var(--space-md);
    text-decoration: none;
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    border-radius: var(--radius-sm);
    transition: background-color 0.2s;
  }

  .previous {
    justify-content: flex-start;
  }

  .next {
    justify-content: flex-end;
  }

  .chapter-link:hover {
    background-color: var(--color-accent);
    color: white;
  }
</style>

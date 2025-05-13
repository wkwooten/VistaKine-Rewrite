<svelte:options namespace="html" />

<script lang="ts">
  import { currentSection } from "$lib/stores/appState.js";
  import { getChapterBySlug } from "$lib/data/chapters";
  import { onMount } from "svelte";
  import PageNav from "$lib/components/PageNav.svelte";
  import {
    getAdjacentSections,
    getAdjacentChapters,
  } from "$lib/utils/navigationUtils";
  import SectionMap from "$lib/components/ui/SectionMap.svelte";
  import { sectionMapOpen } from "$lib/stores/uiStores";

  // Define props using $props
  type SectionTemplateProps = {
    chapterSlug: string;
    sectionSlug: string;
    themeClass?: string;
    currentChapterTitle?: string | null; // Can be derived if not passed
    currentChapterSlug: string;
    chapterNumber?: number | string | undefined; // Can be derived if not passed
    children: any; // Add children prop for default slot content
  };

  let {
    chapterSlug,
    sectionSlug,
    themeClass = "",
    currentChapterSlug, // Keep this as required from the route
    children, // Add children prop for default slot content
    // currentChapterTitle is now derived from chapter object
    // chapterNumber is now derived from chapter object
  }: SectionTemplateProps = $props();

  console.log("[SectionTemplate] Received themeClass prop:", themeClass);

  // Derive chapter and section data
  const chapter = $derived(getChapterBySlug(chapterSlug));
  const section = $derived(
    chapter?.sections.find((s) => s.slug === sectionSlug)
  );

  // Derive adjacent sections/chapters for PageNav
  const { prevSection, nextSection } = $derived(
    getAdjacentSections(chapterSlug, sectionSlug)
  );
  const { prevChapter, nextChapter } = $derived(
    getAdjacentChapters(chapterSlug)
  );
</script>

<svelte:head>
  <title
    >{section?.title || "Section"} | {chapter?.title || "Chapter"} | VistaKine</title
  >
</svelte:head>

<div class="section-container {themeClass}">
  <main class="main-content-area">
    <div class="section-layout-wrapper">
      <div class="section-content-column">
        <div class="section-content-wrapper">
          <!-- Standardized Section Title -->
          {#if section}
            <div class="section-title">
              <span class="section-number-prefix"
                >Section {section.number}:</span
              >
              <br /> <span class="section-title-main">{section.title}</span>
            </div>
          {/if}

          <article class="section-content">
            <!-- Content from specific section .svelte file goes here -->
            {@render children()}
          </article>

          <!-- Page Navigation (within main content area) -->
          <PageNav
            {prevSection}
            {nextSection}
            {prevChapter}
            {nextChapter}
            {currentChapterSlug}
            currentSectionSlug={sectionSlug}
            currentChapterTitle={chapter?.title}
            currentChapterNumber={chapter?.number}
          />
        </div>
      </div>

      <!-- SectionMap now positioned absolutely -->
      <SectionMap {sectionSlug} />
    </div>
  </main>
</div>

<style lang="scss">
  @use "$lib/styles/variables" as vars;

  .section-container {
    width: 100%;
    min-height: calc(100vh - var(--footer-height, 100px));
    color: var(--color-text-primary);
    display: flex;
    flex-direction: column;
  }

  .section-title {
    color: var(--chapter-color);
    border-bottom: 3px solid var(--chapter-color);
    margin-top: 0;
    background: var(--color-background);
    margin-bottom: var(--space-l);
    padding: var(--space-s);
    font-size: var(--step-4);
    font-weight: 700;
    text-align: center;
    text-wrap: balance;
    line-height: 1.2;

    .section-number-prefix {
      display: block;
      font-size: var(--step-3);
      font-weight: 500;
      opacity: 0.85;
      margin-bottom: var(--space-3xs);
    }

    .section-title-main {
      display: block;
    }
  }

  .main-content-area {
    display: flex;
    /* flex-direction: column; */
    width: 100%;
    min-width: 0;
    flex-grow: 1;
    padding: var(--space-s) 0;
    gap: var(--space-l);

    @media (max-width: var(--breakpoint-lg)) {
      padding: var(--space-s);
    }
  }

  .section-content {
    width: 100%;
    display: flex;
    flex-direction: column;

    max-width: var(--readable-max-width, 75ch);
    margin-inline: auto;
    padding-inline: var(--space-m);
    box-sizing: border-box;

    @media (max-width: vars.$breakpoint-lg) {
      padding-inline: var(--space-s);
    }

    @media (max-width: vars.$breakpoint-sm) {
      padding-inline: 0;
    }
  }

  /* Default styles for figures/figcaptions used within slotted content */
  /* Note: Uses :global() as these classes originate in slotted components/markdown */
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

  /* Generic heading styles for slotted content (typically section sub-headings) */
  :global(h2) {
    font-size: var(--step-2);
    margin-bottom: var(--space-m);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--color-border);
  }

  /* Generic text/list styles for slotted content */
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

  /* Specific adjustments for review blocks (which are activity blocks) */
  /* :global(.activity-block.-review) {
    margin-top: var(--space-xl);
  }

  :global(.content-card.activity-block.-review) {
    margin-top: var(--space-xl);
  } */

  :global(.content-card.explanation-block) {
    background-color: var(--color-background);
    text-align: center;

    & ol,
    & ul {
      text-align: left;
      display: inline-block;
      max-width: 100%;
    }
    & h4 {
      margin-top: 0;
      margin-bottom: var(--space-m);
      color: var(--color-accent);
    }
  }

  :global(.definition-list) {
    margin: var(--space-m) 0;
    padding-left: var(--space-l);
    border-left: 3px solid var(--color-accent-secondary);
    background-color: var(--color-surface-100);
    padding-top: var(--space-xs);
    padding-bottom: var(--space-xs);
    border-radius: 0 var(--radius-2) var(--radius-2) 0;
  }

  :global(.definition-list dt) {
    font-weight: 600;
  }

  :global(.definition-list dd) {
    margin-left: 0;
    margin-bottom: var(--space-s);
    padding-left: var(--space-s);
  }

  :global(.definition-list dd:last-child) {
    margin-bottom: 0;
  }

  :global(app-footer) {
    width: 100%;
    margin-top: auto;
  }

  /* Ensure PageNav is placed correctly */
  :global(app-page-nav) {
    margin-top: var(--space-xl);
    margin-bottom: var(--space-l);
  }

  /* Apply scroll margin to nav targets */
  :global([data-nav-target="true"]) {
    scroll-margin-top: calc(var(--navbar-height, 80px) + 4rem);
  }

  .section-layout-wrapper {
    display: flex;
    flex-direction: row;
    /* margin-left: var(--sidebar-width); */
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
    position: relative; /* Add position relative for absolutely positioned SectionMap */

    @media (max-width: vars.$breakpoint-xl) {
      flex-direction: column;
      margin-left: var(--sidebar-collapsed-width);
      gap: 0;
    }

    @media (max-width: vars.$breakpoint-lg) {
      margin-left: 0;
    }
  }

  .section-content-column {
    flex: 1;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
    margin: 0 auto;
  }

  /* Update SectionMap positioning to match new layout structure */
  :global(.section-map-container) {
    @media (min-width: calc(vars.$breakpoint-xl + 1px)) {
      position: fixed;
      right: max(
        calc(
          (100% - var(--max-content-width, 1400px)) / 2 - var(
              --section-map-width,
              220px
            ) - var(--space-l)
        ),
        var(--space-m)
      );
      top: calc(var(--navbar-height, 80px) + var(--space-m));
    }
  }

  // --- Styles moved from chapter-styles.scss ---
  :global(.section-core) {
    margin-bottom: var(--space-l);

    p,
    ul,
    ol,
    li,
    blockquote,
    figure,
    pre {
      margin-bottom: var(--space-m);
      line-height: 1.7;
    }
  }

  :global(.section-review) {
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-m);
    margin-top: var(--space-xl);

    p,
    ul,
    ol,
    li,
    blockquote,
    figure,
    pre {
      margin-bottom: var(--space-m);
      line-height: 1.7;
    }
  }
  // --- End moved styles ---
</style>

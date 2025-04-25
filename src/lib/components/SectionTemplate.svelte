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
    gap: var(--space-l);
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

  /* Styles for the standardized section title generated by this template */
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

  /* Generic heading styles for slotted content (typically section sub-headings) */
  :global(h2) {
    font-size: var(--step-2);
    /* color: var(--chapter-color-dark, var(--color-text-primary)); */ // Commented out color override
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

  /* Generic subsection title styles for slotted content */
  :global(.subsection-title) {
    font-size: var(--step-1);
    font-weight: bold;
    text-wrap: balance;
    margin-top: var(--space-l);
    margin-bottom: var(--space-s);
  }

  /* Specific adjustments for review blocks (which are activity blocks) */
  :global(.activity-block.-review) {
    /* Border/padding handled by base .activity-block card style */
    margin-top: var(--space-xl); /* Keep margin */
  }

  /* Constrains width for prose content within slotted blocks */
  :global(.readable-content) {
    display: flex;
    flex-direction: column;
    gap: var(--space-l);
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


  /* Apply card styling to semantic content blocks passed via slot */

  :global(.section-header-block) {
    margin-bottom: var(--space-xl);
		background-color: var(--color-surface); /* Use raised if available */
		border-radius: var(--radius-md);
		padding: var(--space-l);
		box-shadow: var(--shadow-sm);
		margin-top: var(--space-l); /* Add space below main title */
    transition: box-shadow var(--transition-normal) var(--transition-bezier), transform var(--transition-normal) var(--transition-bezier);

    &:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-3px);
    }

    /* Placeholder description style */
    & p:first-of-type {
      font-style: italic;
      color: var(--color-text-secondary);
      border-left: 3px solid var(--chapter-color);
      padding-left: var(--space-s);
      margin-bottom: var(--space-l);
    }
  }

  :global(.concept-block) {
    margin-top: var(--space-l);
    margin-bottom: var(--space-xl);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-lg);
    border-radius: var(--radius-md);
    padding: var(--space-l);
    transition: box-shadow var(--transition-normal) var(--transition-bezier), transform var(--transition-normal) var(--transition-bezier);

    &:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-3px);
    }
  }

  :global(.visualization-block) {
    margin-top: var(--space-xl);
    margin-bottom: var(--space-xl);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-l);
    box-shadow: var(--shadow-lg);
    transition: box-shadow var(--transition-normal) var(--transition-bezier), transform var(--transition-normal) var(--transition-bezier);

    &:hover {
        box-shadow: var(--shadow-xl);
        transform: translateY(-3px);
    }

    @media (max-width: vars.$breakpoint-md) {
      border-radius: 0;
      border-left: none;
      border-right: none;
      padding-inline: var(--space-s);
    }

    /* Specific adjustments for exercise blocks */
    &.-exercise {
      /* Ensure inner elements like exercise description align well */
      & .exercise-description {
        font-size: var(--step-0);
        margin-bottom: var(--space-m);
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin-left: 0;
        margin-right: 0;
      }

      /* Prevent double borders/padding if exercise component has its own wrapper */
      &.visualization-card { // TODO: Review if visualization-card class is still needed here
        background-color: transparent;
        border: none;
        padding: 0;
        box-shadow: none;
        margin: var(--space-xl) 0; /* Keep margin */
      }
    }
  }

  :global(.activity-block) {
    margin-top: var(--space-xl);
    margin-bottom: var(--space-xl);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-lg);
    border-radius: var(--radius-md);
    padding: var(--space-l);
    transition: box-shadow var(--transition-normal) var(--transition-bezier), transform var(--transition-normal) var(--transition-bezier);

    &:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-3px);
    }
  }

  /* Global styling for Definition List used in slotted content */
  :global(.definition-list) {
    margin: var(--space-m) 0;
    padding-left: var(--space-l); /* Indent the list slightly */
    border-left: 3px solid var(--color-accent-secondary); /* Add a visual marker */
    background-color: var(--color-surface-100); /* Slight background distinction */
    padding-top: var(--space-xs);
    padding-bottom: var(--space-xs);
    border-radius: 0 var(--radius-2) var(--radius-2) 0; /* Optional: slightly round the inner corners */
  }

  :global(.definition-list dt) {
    font-weight: 600; /* Make the term stand out */
    /* color: var(--color-accent); Optional: Use accent color */
  }

  :global(.definition-list dd) {
    margin-left: 0; /* Reset default margin */
    margin-bottom: var(--space-s); /* Space below definition */
    padding-left: var(--space-s); /* Indent definition relative to term */
  }

  :global(.definition-list dd:last-child) {
    margin-bottom: 0;
  }

  /* Global styling for Explanation Blocks used in slotted content */
  :global(.explanation-block) {
    background-color: var(--color-background); /* Subtle background */
    border-radius: var(--radius-md);
    padding: var(--space-l);
    margin-block: var(--space-l); /* Vertical spacing */
    text-align: center; /* Center heading and potentially inline text */
    box-shadow: var(--shadow-lg);
    transition: box-shadow var(--transition-normal) var(--transition-bezier), transform var(--transition-normal) var(--transition-bezier);

    &:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-3px);
    }
  }

  /* Keep list items left-aligned within the centered block */
  :global(.explanation-block ol),
  :global(.explanation-block ul) {
    text-align: left;
    display: inline-block; /* Helps with centering the list block itself if needed */
    max-width: 100%; /* Prevent overflow */
  }

  :global(.explanation-block h4) {
    margin-top: 0; /* Adjust heading margin if needed */
    margin-bottom: var(--space-m);
    color: var(--color-accent); /* Optional: Use accent color for heading */
  }
</style>
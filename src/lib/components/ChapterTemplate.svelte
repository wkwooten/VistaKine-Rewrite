<script lang="ts">
  import { onMount } from 'svelte';
  import { currentChapter, currentSection } from '$lib/stores/appState';
  import { intersect } from '$lib/utils/intersection';
  import { Canvas } from '@threlte/core';
  import ThrelteTest from '$lib/components/visualization/scenes/ThrelteTest.svelte';
  import VisContainer from '$lib/components/visualization/VisContainer.svelte';
  import { slide } from 'svelte/transition';
  // import '$lib/styles/chapter1.scss';
  import PageNav from '$lib/components/PageNav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ChapterHeaderNav from '$lib/components/ChapterHeaderNav.svelte';
  import '$lib/styles/chapter-styles.scss';

  // Import new components
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import GuidedCalculation from '$lib/components/GuidedCalculation.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';

  // Set the current chapter in the store
  onMount(() => {
    return () => {
      // Cleanup when component unmounts
    };
  });

  // Handle section intersection
  function handleSectionIntersect(event: any, sectionId: string) {
    if (event.detail.isIntersecting && event.detail.intersectionRatio > 0.3) {
      currentSection.set(sectionId);
    }
  }

  // Use a type assertion for sections to silence TypeScript errors
  const chapter1Sections = [
    { id: "coordinate-systems", title: "1.1 Coordinate Systems" },
    { id: "vectors-in-space", title: "1.2 Vectors in 3D Space" },
    { id: "reference-frames", title: "1.3 Reference Frames" }
  ];

  const currentSectionIndex = 0;

  // For Chapter 1, prevSection is the TOC page URL
  const prevSection = '/chapter/toc';
  const nextSection = currentSectionIndex < chapter1Sections.length - 1 ? chapter1Sections[currentSectionIndex + 1] : null;


  interface Chapter {
    slug: string;
    title: string;
  }

  // --- Add props for chapter data ---
  export let chapterTitle: string;
  export let chapterSections: Array<any>;

  export let currentChapterSlug: string;
  export let themeClass: string = '';
</script>

<svelte:options namespace="html" />

<svelte:head>
  <title>{chapterTitle} | VistaKine</title>
</svelte:head>

<div class="chapter {themeClass}">
  <div class="chapter-header-separator"></div>
  <slot></slot>
</div>

<style lang="scss">
  .chapter {
    display: flex;
    flex-direction: column;
    align-items: stretch; // Default to stretch for full width sections
    min-height: 100vh; // Ensure chapter takes at least full viewport height
    padding: var(--space-xl) 0; // Top and bottom padding for chapter content
    /* background-color: var(--chapter-bg);  */
    color: var(--text-color);

    @media (max-width: 768px) {
      padding: var(--space-l) 0; // Adjust padding for smaller screens
    }
  }

  /* .chapter-header-separator {
    height: 4px;
    background-color: var(--chapter-color-dark);
    margin-bottom: var(--space-s);
    border-radius: 2px;
  } */
</style>

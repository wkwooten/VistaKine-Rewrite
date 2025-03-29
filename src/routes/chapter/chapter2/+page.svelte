<script lang="ts">
  import { onMount } from 'svelte';
  import { currentChapter, currentSection } from '$lib/stores/appState';
  import { intersect } from '$lib/utils/intersection';
  import { Canvas } from '@threlte/core';
  import ThrelteTest from '$lib/components/visualization/scenes/ThrelteTest.svelte';
  import VisContainer from '$lib/components/visualization/VisContainer.svelte';
  import { slide } from 'svelte/transition';
  import PageNav from '$lib/components/PageNav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ChapterHeaderNav from '$lib/components/ChapterHeaderNav.svelte';
  import '$lib/styles/chapter-styles.scss';
  import ChapterTemplate from '$lib/components/ChapterTemplate.svelte';

  // Import new components
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import GuidedCalculation from '$lib/components/GuidedCalculation.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';

  // Set the current chapter in the store
  onMount(() => {
    currentChapter.set('kinematics');
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

  // Chapter 2 Sections Data
  const chapterSections = [
    { id: "displacement-velocity-acceleration", title: "2.1 Displacement, Velocity, and Acceleration" },
    { id: "uniform-motion", title: "2.2 Uniform Motion" },
    { id: "non-uniform-motion", title: "2.3 Non-Uniform Motion" },
    { id: "projectile-motion", title: "2.4 Projectile Motion" },
  ];

  // Navigation Data
  const prevChapter = { slug: 'chapter1', title: 'Understanding 3D Space' };
  const nextChapter = { slug: 'chapter3', title: 'Forces and Motion' };
</script>

<svelte:options namespace="html" />

<svelte:head>
  <title>Kinematics | VistaKine</title>
</svelte:head>

<ChapterTemplate
  themeClass="chapter-2-theme"
  chapterTitle="Chapter 2: Kinematics"
  {chapterSections}
  {prevChapter}
  {nextChapter}
  currentChapterSlug="kinematics"
>
  <div class="chapter-wrapper">

    <header class="chapter-header">
      <h1>Chapter 2: <br> Kinematics</h1>
        <p class="chapter-intro">
          In this chapter, we will explore the study of motion, known as kinematics.
        </p>
        <ChapterHeaderNav chapterSections={chapterSections} />
      </header>
    <div class="page-content">
      <!-- Section 2.1 -->
      <!-- @ts-ignore -->
      <section
        id="displacement-velocity-acceleration"
        class="content-section section-header"
        use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
        on:intersect={(e) => handleSectionIntersect(e, 'displacement-velocity-acceleration')}
      >
        <div class="section-content">
          <h2 class="section-title">2.1 Displacement, Velocity, and Acceleration</h2>
          // ... rest of chapter 2.1 content ...
        </div>
      </section>
      // ... rest of chapter 2 sections ...
    </div>
  </div>

  <PageNav {prevChapter} {nextChapter} />
  <Footer />
</ChapterTemplate>

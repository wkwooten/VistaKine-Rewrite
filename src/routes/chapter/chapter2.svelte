<script>
  import ChapterNavigation from '$lib/components/ChapterNavigation.svelte';
  import { onMount } from 'svelte';
  import { currentChapter, currentSection } from '$lib/stores/appState';
  import { intersect } from '$lib/utils/intersection';

  // Set the current chapter in the store
  onMount(() => {
    currentChapter.set('understanding-3d-space');
    return () => {
      // Cleanup when component unmounts
    };
  });

  // Handle section intersection
  function handleSectionIntersect(event, sectionId) {
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
</script>

<svelte:options namespace="html" />

<svelte:head>
  <title>Understanding 3D Space | VistaKine</title>
</svelte:head>

<div class="chapter">
  <header class="chapter-header">
    <h1>Understanding 3D Space</h1>
    <p class="chapter-intro">
      This chapter introduces the fundamental concepts of three-dimensional space and
      coordinate systems, essential for understanding kinematics and dynamics.
    </p>
  </header>

  <aside class="chapter-navigation">
    <ChapterNavigation sections={chapter1Sections} />
  </aside>

  <div class="sections-content">
    <!-- @ts-ignore -->
    <section
      id="coordinate-systems"
      class="content-section"
      use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
      on:intersect={(e) => handleSectionIntersect(e, 'coordinate-systems')}
    >
      <h2>1.1 Coordinate Systems</h2>
      <div class="section-content">
        <p>
          Coordinate systems provide a framework for describing positions and movements in space.
          The most common system used in physics is the Cartesian coordinate system, which uses
          three perpendicular axes: x, y, and z.
        </p>
        <p>
          In this section, we'll explore different coordinate systems and how they relate to one another.
          Understanding these systems is crucial for describing motion and applying the principles of kinematics.
        </p>
      </div>

      <div class="visualization-container">
        <!-- Placeholder for 3D visualization -->
        <div class="placeholder-viz">
          [Coordinate System Visualization]
        </div>
      </div>
    </section>

    <!-- @ts-ignore -->
    <section
      id="vectors-in-space"
      class="content-section"
      use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
      on:intersect={(e) => handleSectionIntersect(e, 'vectors-in-space')}
    >
      <h2>1.2 Vectors in 3D Space</h2>
      <div class="section-content">
        <p>
          Vectors are mathematical objects that have both magnitude and direction. In 3D space,
          vectors can be represented as arrows pointing from one point to another.
        </p>
        <p>
          This section introduces vector notation, operations, and their geometric interpretation
          in three-dimensional space.
        </p>
      </div>

      <div class="visualization-container">
        <!-- Placeholder for 3D visualization -->
        <div class="placeholder-viz">
          [Vector Visualization]
        </div>
      </div>
    </section>

    <!-- @ts-ignore -->
    <section
      id="reference-frames"
      class="content-section"
      use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
      on:intersect={(e) => handleSectionIntersect(e, 'reference-frames')}
    >
      <h2>1.3 Reference Frames</h2>
      <div class="section-content">
        <p>
          A reference frame is a coordinate system attached to an observer, providing a perspective
          from which to measure position, velocity, and other physical quantities.
        </p>
        <p>
          This section explores how measurements change when observed from different reference frames,
          laying the groundwork for understanding relative motion in kinematics.
        </p>
      </div>

      <div class="visualization-container">
        <!-- Placeholder for 3D visualization -->
        <div class="placeholder-viz">
          [Reference Frame Visualization]
        </div>
      </div>
    </section>
  </div>
</div>

<style lang="scss">
  .chapter {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: var(--space-l);
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-s) 0;
  }

  .chapter-header {
    grid-column: 1 / 3;
    margin-bottom: var(--space-xl);

    h1 {
      font-size: var(--step-4);
      margin-bottom: var(--space-s);
      color: var(--text-color);
    }

    .chapter-intro {
      font-size: var(--step-1);
      color: var(--text-color);
      opacity: 0.8;
      max-width: 800px;
    }
  }

  .chapter-navigation {
    padding-right: var(--space-l);
  }

  .sections-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
  }

  .content-section {
    scroll-margin-top: 2rem;
    padding: var(--space-m) 0;
    border-bottom: 1px solid var(--border-color);

    &:last-child {
      border-bottom: none;
    }

    h2 {
      font-size: var(--step-2);
      margin-bottom: var(--space-m);
      color: var(--text-color);
    }
  }

  .section-content {
    margin-bottom: var(--space-l);

    p {
      margin-bottom: var(--space-m);
      line-height: 1.6;
    }
  }

  .visualization-container {
    background-color: var(--sidebar-background);
    border-radius: 8px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .placeholder-viz {
    color: var(--text-color);
    opacity: 0.5;
    font-style: italic;
    padding: var(--space-xl);
    text-align: center;
  }

  @media (min-width: 768px) {
    .content-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-l);
      align-items: start;
    }

    .visualization-container {
      min-height: 400px;
    }
  }

  @media (max-width: 767px) {
    .visualization-container {
      margin-top: var(--space-m);
    }
  }
</style>

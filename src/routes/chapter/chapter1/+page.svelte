<script lang="ts">
  import { onMount } from 'svelte';
  import { currentChapter, currentSection } from '$lib/stores/appState';
  import { intersect } from '$lib/utils/intersection';
  import { Canvas } from '@threlte/core';
  import Scene from '$lib/components/visualization/scenes/Scene.svelte';
  import VisContainer from '$lib/components/visualization/VisContainer.svelte';
  import { slide } from 'svelte/transition';
  import '$lib/styles/chapter-styles.scss';
  import PageNav from '$lib/components/PageNav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ChapterHeaderNav from '$lib/components/ChapterHeaderNav.svelte';
  import ChapterTemplate from '$lib/components/ChapterTemplate.svelte';
  import { browser } from '$app/environment';

  // Import new components
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import GuidedCalculation from '$lib/components/GuidedCalculation.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';

  // Set the current chapter in the store
  onMount(() => {
    if (browser) { // Only run on the client-side
      const chapterSlug = 'understanding-3d-space';
      currentChapter.set(chapterSlug);
      return () => {
        currentChapter.set(''); // Reset to a default/empty value.  Important!
      }
    }
  });

  // Handle section intersection
  function handleSectionIntersect(event: any, sectionId: string) {
    if (event.detail.isIntersecting && event.detail.intersectionRatio > 0.3) {
      currentSection.set(sectionId);
    }
  }

  // Chapter 1 Sections Data
  const chapterSections = [
    { id: "coordinate-systems", title: "1.1 Coordinate Systems" },
    { id: "vectors-in-space", title: "1.2 Vectors in 3D Space" },
    { id: "reference-frames", title: "1.3 Reference Frames" }
  ];

  // Navigation Data
  const prevChapter = '/chapter/toc';
  const nextChapter = { slug: 'chapter2', title: 'Kinematics' };

</script>

<svelte:options namespace="html" />

<svelte:head>
  <title>Understanding 3D Space | VistaKine</title>
</svelte:head>

<ChapterTemplate
  themeClass="chapter-1-theme"
  chapterTitle="Chapter 1: Understanding 3D Space"
  {chapterSections}
  {prevChapter}
  {nextChapter}
  currentChapterSlug="understanding-3d-space"

>

<!--
{chapterColor}
{chapterColorLight}
{chapterColorDark}
{chapterSectionBg}
{chapterHeaderBg}
{chapterBg} -->

  <header class="chapter-header">
    <h1>Chapter 1: <br> Understanding 3D Space</h1>
    <p class="chapter-intro">
      This chapter introduces the fundamental concepts of three-dimensional space and
      coordinate systems, essential for understanding kinematics and dynamics.
    </p>

    <!-- Add the optional header navigation -->
    <ChapterHeaderNav chapterSections={chapterSections} />
  </header>
  <div class="chapter-wrapper">
    <div class="sections-content">
      <!-- @ts-ignore -->
      <section
        id="coordinate-systems"
        class="content-section section-header"
        use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
        on:intersect={(e) => handleSectionIntersect(e, 'coordinate-systems')}
      >
        <div class="readable-content">
          <h2 class="section-title">1.1 Coordinate Systems</h2>

          <div class="section-intro">
            <Scenario>
              <p><strong>Surya:</strong> Hey Leo, I'm trying to set up this new 3D printer, but I'm confused about how to tell it where to print.</p>
              <p><strong>Leo:</strong> That's where coordinate systems come in! They're like a map for 3D space.</p>
            </Scenario>

            <p>
              Coordinate systems are essential tools that allow us to precisely define the position of objects in space.  They provide a framework for describing locations using numerical coordinates.
            </p>
            <p>
              We encounter simplified versions of coordinate systems in everyday life, such as when we use a map to navigate. A map uses a grid (latitude and longitude) to specify locations on the Earth's surface.
            </p>
            <p>
              In three-dimensional space, we extend this concept by adding a third axis, allowing us to describe locations not just on a surface, but also above or below it.
            </p>
          </div>

          <div class="section-core">
            <FormulaAccordion>
              <p>Formulas will go here.</p>
            </FormulaAccordion>

            <VisContainer {currentSection}>
              <Scene />
            </VisContainer>

            <p>
              Think of a 3D printer. It uses three axes (x, y, and z) to pinpoint any location within its printing area. The intersection of these three axes is called the origin, typically represented as (0, 0, 0).
            </p>
            <p>
              The x-axis usually represents horizontal movement, the y-axis represents vertical movement, and the z-axis represents depth, forming a right-handed coordinate system.
            </p>
            <p>
              By combining coordinates along these axes – positive or negative distances from the origin – we can specify any point in 3D space, giving us a powerful way to describe and manipulate objects.
            </p>
          </div>

          <SectionReview>
            <Quiz>
              <p>Which axis represents depth in a 3D Cartesian coordinate system?</p>
              <form>
                <label><input type="radio" name="q1" value="a"> x</label>
                <label><input type="radio" name="q1" value="b"> y</label>
                <label><input type="radio" name="q1" value="c"> z</label>
              </form>
              <p>If you move a point only along the y-axis, what changes?</p>
              <form>
                <label><input type="radio" name="q2" value="a"> Its horizontal position</label>
                <label><input type="radio" name="q2" value="b"> Its vertical position</label>
                <label><input type="radio" name="q2" value="c"> Its depth</label>
              </form>
            </Quiz>
          </SectionReview>
        </div>
      </section>

      <!-- @ts-ignore -->
      <section
        id="vectors-in-space"
        class="content-section"
        use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
        on:intersect={(e) => handleSectionIntersect(e, 'vectors-in-space')}
      >
        <div class="readable-content">
          <h2 class="section-title">1.2 Vectors in 3D Space</h2>

          <div class="section-intro">
            <Scenario>
              <p><strong>Surya:</strong> I'm trying to program this robot arm to move to a specific point, but it needs instructions in terms of vectors.</p>
              <p><strong>Leo:</strong> Vectors are perfect for that! They tell the arm both how far to move and in what direction.</p>
            </Scenario>

            <p>Imagine you're kicking a soccer ball. How can we describe its motion?</p>
            <p>Vectors show us both how *hard* you kick (magnitude) and *where* you kick it (direction).</p>
          </div>

          <div class="section-core">
            <FormulaAccordion>
              <p>Formulas will go here.</p>
            </FormulaAccordion>

            <VisContainer {currentSection}>
              <Scene />
            </VisContainer>

            <p>
              A vector in 3D space can be represented by its components along the x, y, and z axes.
            </p>
            <p>
              For example, a vector pointing from the origin to the point (2, 3, 4) has components x=2, y=3, and z=4.
            </p>
            <p>
              The magnitude of the vector represents its length, and can be calculated using the Pythagorean theorem in 3D.
            </p>

            <GuidedCalculation>
              <p>The initial velocity of the soccer ball is 50 m/s at an angle of 30 degrees above the horizontal.</p>
              <form>
                <label>
                  1. What is the horizontal component of the velocity? (Vx = V * cos(θ))<br>
                  Vx = <input type="number" name="vx"> m/s
                </label>
                <label>
                  2. What is the vertical component of the velocity? (Vy = V * sin(θ))<br>
                  Vy = <input type="number" name="vy"> m/s
                </label>
                <label>
                  3. Assuming no air resistance, how long will the ball be in the air? (t = 2 * Vy / g, where g = 9.8 m/s²)<br>
                  t = <input type="number" name="t"> s
                </label>
                <label>
                  4. How far will the ball travel horizontally? (Range = Vx * t)<br>
                  Range = <input type="number" name="range"> m
                </label>
              </form>
            </GuidedCalculation>
          </div>

          <SectionReview>
            <Quiz>
              <p>A vector pointing directly upwards has:</p>
              <form>
                <label><input type="radio" name="q3" value="a"> Only magnitude</label>
                <label><input type="radio" name="q3" value="b"> Only direction</label>
                <label><input type="radio" name="q3" value="c"> Both magnitude and direction</label>
              </form>
              <p>If you double the magnitude of a vector, what happens to its length?</p>
              <form>
                <label><input type="radio" name="q4" value="a"> It halves</label>
                <label><input type="radio" name="q4" value="b"> It doubles</label>
                <label><input type="radio" name="q4" value="c"> It stays the same</label>
              </form>
            </Quiz>
          </SectionReview>
        </div>
      </section>

      <!-- @ts-ignore -->
      <section
        id="reference-frames"
        class="content-section"
        use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
        on:intersect={(e) => handleSectionIntersect(e, 'reference-frames')}
      >
        <div class="readable-content">
          <h2 class="section-title">1.3 Reference Frames</h2>

          <div class="section-intro">
            <Scenario>
              <p><strong>Surya:</strong> I'm watching a video of a car moving, but it's hard to tell how fast it's actually going.</p>
              <p><strong>Leo:</strong> That's because you're seeing it from a different reference frame! It's like watching someone walk on a moving train.</p>
            </Scenario>

            <FormulaAccordion>
              <p>Formulas will go here.</p>
            </FormulaAccordion>
          </div>

          <div class="section-core">
            <p>
              A reference frame is a coordinate system attached to an observer, providing a perspective
              from which to measure position, velocity, and other physical quantities.
            </p>
            <p>
              This section explores how measurements change when observed from different reference frames,
              laying the groundwork for understanding relative motion in kinematics.
            </p>

            <VisContainer {currentSection}>
              <Scene/>
            </VisContainer>

            <p>
              Imagine you're standing still and watching a car drive by. You measure its speed relative to your position.
            </p>
            <p>
              But if you were inside another car moving alongside it, the first car's speed would appear different.
            </p>
            <p>
              Understanding reference frames is crucial for correctly interpreting motion in different situations.
            </p>
          </div>

          <SectionReview>
            <!-- Empty for now, will be filled in later -->
          </SectionReview>
        </div>
      </section>
    </div>
  </div>
  <PageNav {prevChapter} {nextChapter} />
  <Footer />
</ChapterTemplate>

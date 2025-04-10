<script lang="ts">
  import { currentSection } from '$lib/stores/appState.js';
  import { intersect } from '$lib/utils/intersection';
  import VisContainer from '$lib/components/visualization/VisContainer.svelte';
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import GuidedCalculation from '$lib/components/GuidedCalculation.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte'
  import Scenario from '$lib/components/Scenario.svelte';
  import ChapterHeaderNav from '$lib/components/ChapterHeaderNav.svelte';
  import extractKeywords from '$lib/utils/keywordExtractor.js';
  import PrinterCalibrationExercise from '$lib/components/visualization/interactions/printer-calibration/PrinterCalibrationExercise.svelte';

  // The callback function definition remains the same, but now receives the detail object directly
  function handleSectionIntersect(detail: { isIntersecting: boolean; intersectionRatio: number; }, sectionId: string) {
    if (detail.isIntersecting && detail.intersectionRatio > 0.3) {
      currentSection.set(sectionId);
    }
  }

  // Props using Svelte 5 runes
  let { chapterSections = [] } = $props<{ chapterSections?: any[] }>(); // Assuming chapterSections is optional array, adjust type as needed

  // --- Printer Boundaries (Constants could be moved to store if needed elsewhere) ---
  const MIN_X = 0;
  const MAX_X = 12;
  const MIN_Y = 0;
  const MAX_Y = 10;
  const MIN_Z = 0;
  const MAX_Z = 12;

  // Define Stage 1 target points (relative to corner origin)
  const stage1Targets = [
    { id: 't0', x: 0, y: 0, z: 0 }, // Default corner target
    { id: 't1', x: 12, y: 0, z: 0 },
    { id: 't2', x: 2, y: 0, z: 4 },
    { id: 't3', x: 7, y: 0, z: 10 }
  ];

  // Define Stage 2 target points (relative to corner origin)
  const stage2Targets = [
    { id: 't4', x: 1, y: 3, z: 1 },
    { id: 't5', x: 8, y: 5, z: 8 },
    { id: 't6', x: 11, y: 2, z: 11 }
  ];

  // State for current stage
  let currentStage = 1;

  // Derived variable for active targets
  let activeTargets = $derived((currentStage === 1) ? stage1Targets : stage2Targets);

  // State for completion
  let isCalibrationComplete = false;

  // State for fullscreen
  let isFullscreen = false;

  // Ref for positioning wrapper
  let visWrapperElement: HTMLDivElement;

  // Function to advance to the next stage - Dialog handled by child
  function goToStage2() {
    if (currentStage === 1) {
      console.log("[Parent] Stage 1 Complete event received! Starting Stage 2.");
      currentStage = 2;
      // No dialog logic here anymore
    }
  }

  // Function to mark completion - Dialog handled by child
  function handleCalibrationComplete() {
    console.log("[Parent] Calibration Complete event received!");
    isCalibrationComplete = true;
    // No dialog logic here anymore
  }

</script>

<div class="chapter-wrapper">
  <header class="chapter-header">
    <h1>Chapter 1: <br> Understanding 3D Space</h1>
    <p class="chapter-intro">
      This chapter introduces the fundamental concepts of <span class="keyword">three-dimensional space</span> and
      <span class="keyword">coordinate systems</span>, essential for understanding <span class="keyword">kinematics</span> and <span class="keyword">dynamics</span>.
    </p>

    <!-- Add the optional header navigation -->
    <ChapterHeaderNav {chapterSections} />
  </header>

  <div class="page-content">
    <section
      id="coordinate-systems"
      class="content-section section-header"
      data-section="1.1"
      use:intersect={{
        threshold: [0.1, 0.3, 0.5],
        onIntersect: (detail) => handleSectionIntersect(detail, '1.1')
      }}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <h2 class="section-title">1.1 Coordinate Systems</h2>
        <div class="section-intro">
          <Scenario>
            <p><strong>Surya:</strong> Hey Leo, I'm trying to set up this new 3D printer, but I'm confused about how to tell it where to print.</p>
            <p><strong>Leo:</strong> That's where <span class="keyword">coordinate systems</span> come in! They're like a map for <span class="keyword">3D space</span>.</p>
          </Scenario>

          <p>
            <span class="keyword">Coordinate systems</span> are essential tools that allow us to precisely define the position of objects in <span class="keyword">space</span>.  They provide a framework for describing locations using numerical <span class="keyword">coordinates</span>.
          </p>
          <p>
            We encounter simplified versions of <span class="keyword">coordinate systems</span> in everyday life, such as when we use a map to navigate. A map uses a grid (latitude and longitude) to specify locations on the Earth's surface.
          </p>
          <p>
            In three-dimensional space, we extend this concept by adding a third <span class="keyword">axis</span>, allowing us to describe locations not just on a surface, but also above or below it.
          </p>
        </div>

        <div class="section-core">
          <FormulaAccordion>
            <p>Formulas will go here.</p>
          </FormulaAccordion>

          <h3 class="subsection-title">Visualize it: Calibrating the 3D printer</h3>

          <div style="position: relative;">
             <PrinterCalibrationExercise />
          </div>

          <p>
            Think of a 3D printer. It uses three <span class="keyword">axes</span> (<span class="keyword">x</span>, <span class="keyword">y</span>, and <span class="keyword">z</span>) to pinpoint any location within its printing area. The intersection of these three <span class="keyword">axes</span> is called the <span class="keyword">origin</span>, typically represented as (0, 0, 0).
          </p>
          <p>
            The <span class="keyword">x-axis</span> usually represents <span class="keyword">horizontal</span> movement, the <span class="keyword">y-axis</span> represents <span class="keyword">vertical</span> movement, and the <span class="keyword">z-axis</span> represents <span class="keyword">depth</span>, forming a <span class="keyword">right-handed coordinate system</span>.
          </p>
          <p>
            By combining <span class="keyword">coordinates</span> along these <span class="keyword">axes</span> – positive or negative distances from the <span class="keyword">origin</span> – we can specify any point in <span class="keyword">3D space</span>, giving us a powerful way to describe and manipulate objects.
          </p>
        </div>

        <SectionReview>
          <Quiz>
            <div class="quiz-question-group">
              <p>Which <span class="keyword">axis</span> represents <span class="keyword">depth</span> in a 3D Cartesian <span class="keyword">coordinate system</span>?</p>
              <form class="multiple-choice-question">
                <label><input type="radio" name="q1" value="a"> <span class="keyword">x</span></label>
                <label><input type="radio" name="q1" value="b"> <span class="keyword">y</span></label>
                <label><input type="radio" name="q1" value="c"> <span class="keyword">z</span></label>
              </form>
            </div>

            <div class="quiz-question-group">
              <p>If you move a point only along the <span class="keyword">y-axis</span>, what changes?</p>
              <form>
                <label><input type="radio" name="q2" value="a"> Its <span class="keyword">horizontal</span> position</label>
                <label><input type="radio" name="q2" value="b"> Its <span class="keyword">vertical</span> position</label>
                <label><input type="radio" name="q2" value="c"> Its <span class="keyword">depth</span></label>
              </form>
            </div>
          </Quiz>
        </SectionReview>
      </div>
    </section>

    <section
      id="vectors-in-space"
      class="content-section"
      data-section="1.2"
      use:intersect={{
        threshold: [0.1, 0.3, 0.5],
        onIntersect: (detail) => handleSectionIntersect(detail, '1.2')
      }}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <h2 class="section-title">1.2 Vectors in 3D Space</h2>

        <div class="section-intro">
          <Scenario>
            <p><strong>Surya:</strong> I'm trying to program this robot arm to move to a specific point, but it needs instructions in terms of <span class="keyword">vectors</span>.</p>
            <p><strong>Leo:</strong> <span class="keyword">Vectors</span> are perfect for that! They tell the arm both how far to move and in what <span class="keyword">direction</span>.</p>
          </Scenario>

          <p>Imagine you're kicking a soccer ball. How can we describe its motion?</p>
          <p><span class="keyword">Vectors</span> show us both how *hard* you kick (<span class="keyword">magnitude</span>) and *where* you kick it (<span class="keyword">direction</span>).</p>
        </div>

        <div class="section-core">
          <FormulaAccordion>
            <p>Formulas will go here.</p>
          </FormulaAccordion>

          <VisContainer currentSection={currentSection}>
            <slot />
          </VisContainer>

          <p>
            A <span class="keyword">vector</span> in <span class="keyword">3D space</span> can be represented by its <span class="keyword">components</span> along the <span class="keyword">x</span>, <span class="keyword">y</span>, and <span class="keyword">z axes</span>.
          </p>
          <p>
            For example, a <span class="keyword">vector</span> pointing from the <span class="keyword">origin</span> to the point (2, 3, 4) has <span class="keyword">components</span> <span class="keyword">x</span>=2, <span class="keyword">y</span>=3, and <span class="keyword">z</span>=4.
          </p>
          <p>
            The <span class="keyword">magnitude</span> of the <span class="keyword">vector</span> represents its length, and can be calculated using the <span class="keyword">Pythagorean theorem</span> in 3D.
          </p>

          <GuidedCalculation>
            <p>The initial <span class="keyword">velocity</span> of the soccer ball is 50 m/s at an <span class="keyword">angle</span> of 30 degrees above the <span class="keyword">horizontal</span>.</p>
            <form>
              <label>
                1. What is the <span class="keyword">horizontal</span> component of the <span class="keyword">velocity</span>? (Vx = V * cos(θ))<br>
                Vx = <input type="number" name="vx"> m/s
              </label>
              <label>
                2. What is the <span class="keyword">vertical</span> component of the <span class="keyword">velocity</span>? (Vy = V * sin(θ))<br>
                Vy = <input type="number" name="vy"> m/s
              </label>
              <label>
                3. Assuming no air resistance, how long will the ball be in the air? (t = 2 * Vy / g, where g = 9.8 m/s²)<br>
                t = <input type="number" name="t"> s
              </label>
              <label>
                4. How far will the ball travel <span class="keyword">horizontally</span>? (Range = Vx * t)<br>
                Range = <input type="number" name="range"> m
              </label>
            </form>
          </GuidedCalculation>
        </div>

        <SectionReview>
          <Quiz>
            <div class="quiz-question-group">
              <p>A <span class="keyword">vector</span> pointing directly upwards has:</p>
              <form class="multiple-choice-question">
                <label><input type="radio" name="q3" value="a"> Only <span class="keyword">magnitude</span></label>
                <label><input type="radio" name="q3" value="b"> Only <span class="keyword">direction</span></label>
                <label><input type="radio" name="q3" value="c"> Both <span class="keyword">magnitude</span> and <span class="keyword">direction</span></label>
              </form>
            </div>

            <div class="quiz-question-group">
              <p>If you double the <span class="keyword">magnitude</span> of a <span class="keyword">vector</span>, what happens to its length?</p>
              <form class="multiple-choice-question">
                <label><input type="radio" name="q4" value="a"> It halves</label>
                <label><input type="radio" name="q4" value="b"> It doubles</label>
                <label><input type="radio" name="q4" value="c"> It stays the same</label>
              </form>
            </div>
          </Quiz>
        </SectionReview>
      </div>
    </section>

    <section
      id="reference-frames"
      class="content-section"
      data-section="1.3"
      use:intersect={{
        threshold: [0.1, 0.3, 0.5],
        onIntersect: (detail) => handleSectionIntersect(detail, '1.3')
      }}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <h2 class="section-title">1.3 Reference Frames</h2>

        <div class="section-intro">
          <Scenario>
            <p><strong>Surya:</strong> I'm watching a video of a car moving, but it's hard to tell how fast it's actually going.</p>
            <p><strong>Leo:</strong> That's because you're seeing it from a different <span class="keyword">reference frame</span>! It's like watching someone walk on a moving train.</p>
          </Scenario>

          <FormulaAccordion>
            <p>Formulas will go here.</p>
          </FormulaAccordion>
        </div>

        <div class="section-core">
          <p>
            A <span class="keyword">reference frame</span> is a <span class="keyword">coordinate system</span> attached to an observer, providing a perspective
            from which to measure position, <span class="keyword">velocity</span>, and other physical quantities.
          </p>
          <p>
            This section explores how measurements change when observed from different <span class="keyword">reference frames</span>,
            laying the groundwork for understanding relative motion in <span class="keyword">kinematics</span>.
          </p>
        </div>
      </div>
    </section>
  </div>
</div>

<style lang="scss">
  /* Styles for Quiz questions - scoped to understanding-3d-space.svelte */
  .quiz { // Keep quiz container styles here if needed for understanding-3d-space context
    counter-reset: question-counter; /* Keep counter reset here as it's quiz-specific */
  }

  .quiz-question-group {
    margin-bottom: var(--space-l);
    padding-left: var(--space-s);
    border-left: 2px solid var(--color-accent);
  }

  .quiz-question-group > p { /* More specific selector for question text */
    font-weight: 700;
    margin-bottom: var(--space-xs);
    &::before {
      counter-increment: question-counter;
      content: counter(question-counter) ". ";
      display: inline-block;
      margin-right: var(--space-2xs);
      font-weight: 800;
      color: var(--color-accent);
      /* background-color: red; // Removed test style */
    }
  }

  .multiple-choice-question {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
    margin-left: var(--space-s);
  }

  /* Removed general p style - causing global font-weight change */
  /* p {
    font-weight: 600;
    margin-bottom: var(--space-xs);
  } */

  /* More specific form and label styles - targeting quiz forms */
  .quiz form {
    margin-top: var(--space-2xs);
    margin-bottom: 0;
  }

  .quiz label {
    display: block;
    margin-bottom: var(--space-2xs);
    padding: var(--space-m);
    border-radius: var(--radius-md);
    background-color: var(--bg-secondary);

    &:hover {
      background-color: var(--bg-hover);
    }
  }

  .quiz input[type="radio"] { /* More specific input style */
    margin-right: var(--space-xs);
  }

  .keyword {
    font-weight: 800; /* Make keywords bold */
    color: var(--color-accent); /* Give keywords the accent color */
    /* You could also add a background color if you like, e.g., */
    /* background-color: rgba(var(--color-accent-rgb), 0.15); */
    /* padding: 0.1em 0.3em; */
    /* border-radius: var(--radius-sm); */
  }

  /* Styles for wrapper and fullscreen behavior */
  .vis-hud-wrapper {
		margin-block: var(--space-m);

    /* Basic positioning is set inline */
    &.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      background-color: var(--bg-primary);
      z-index: 9990;

      /* Make direct child VisContainer fill the fullscreen wrapper */
      :global(> .visualization-container) {
        width: 100%;
        height: 100%;
        max-height: 100vh;
        border-radius: 0;
        border: none;
        aspect-ratio: auto;
        box-sizing: border-box;
      }
    }
  }
</style>
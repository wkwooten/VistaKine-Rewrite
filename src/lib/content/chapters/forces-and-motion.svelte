<script lang="ts">
  import { currentSection } from '$lib/stores/appState';
  import { intersect } from '$lib/utils/intersection';
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import GuidedCalculation from '$lib/components/GuidedCalculation.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';
  import ChapterHeaderNav from '$lib/components/ChapterHeaderNav.svelte';

  // Handle section intersection
  function handleSectionIntersect(event: any, sectionId: string) {
    if (event.detail.isIntersecting && event.detail.intersectionRatio > 0.3) {
      currentSection.set(sectionId);
    }
  }

  // Export the sections for this chapter
  export let chapterSections;
</script>

<div class="chapter-wrapper">
  <header class="chapter-header">
    <h1>Chapter 3: <br> Dynamics: Forces and Motion</h1>
    <p class="chapter-intro">
      This chapter explores the relationship between forces and motion, building on the foundation of kinematics
      to understand why objects move the way they do.
    </p>

    <!-- Add the optional header navigation -->
    <ChapterHeaderNav {chapterSections} />
  </header>

  <div class="page-content">
    <section
      id="newtons-laws"
      class="content-section section-header"
      data-section="3.1"
      use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
      on:intersect={(e) => handleSectionIntersect(e, 'newtons-laws')}
    >
      <div class="readable-content">
        <h2 class="section-title">3.1 Newton's Laws</h2>
        <div class="section-intro">
          <Scenario>
            <p><strong>Surya:</strong> I'm trying to understand why a heavy box is harder to move than a light one.</p>
            <p><strong>Leo:</strong> Newton's laws will help explain that! They describe the relationship between forces and motion.</p>
          </Scenario>

          <p>
            Isaac Newton's three laws of motion form the foundation of classical mechanics and explain how forces affect motion.
          </p>
        </div>

        <div class="section-core">
          <FormulaAccordion>
            <p><strong>First Law (Law of Inertia):</strong> An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.</p>
            <p><strong>Second Law:</strong> Force equals mass times acceleration (F = ma).</p>
            <p><strong>Third Law:</strong> For every action, there is an equal and opposite reaction.</p>
          </FormulaAccordion>

          <p>
            These laws explain why a heavy box requires more force to accelerate than a lighter one (Second Law),
            why objects continue moving in the absence of friction (First Law),
            and why rockets can propel forward by ejecting mass backward (Third Law).
          </p>
        </div>

        <SectionReview>
          <Quiz>
            <p>According to Newton's First Law, an object in motion will:</p>
            <form>
              <label><input type="radio" name="q1" value="a"> Always slow down and stop</label>
              <label><input type="radio" name="q1" value="b"> Continue moving with constant velocity unless acted upon by a force</label>
              <label><input type="radio" name="q1" value="c"> Speed up over time</label>
            </form>
            <p>If the mass of an object doubles, but the force remains constant, what happens to acceleration?</p>
            <form>
              <label><input type="radio" name="q2" value="a"> It doubles</label>
              <label><input type="radio" name="q2" value="b"> It remains the same</label>
              <label><input type="radio" name="q2" value="c"> It is halved</label>
            </form>
          </Quiz>
        </SectionReview>
      </div>
    </section>

    <section
      id="newtons-laws-of-motion"
      class="content-section"
      use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
      on:intersect={(e) => handleSectionIntersect(e, 'newtons-laws-of-motion')}
    >
      <div class="readable-content">
        <h2 class="section-title">3.2 Newton's Laws of Motion</h2>

        <div class="section-intro">
          <Scenario>
            <p><strong>Surya:</strong> When I push on a wall, why doesn't it move even though I'm applying force?</p>
            <p><strong>Leo:</strong> That's because forces come in balanced pairs - you push on the wall, and the wall pushes back with equal force!</p>
          </Scenario>

          <p>
            This section explores practical applications of Newton's laws in everyday scenarios and clinical settings.
          </p>
        </div>

        <div class="section-core">
          <p>
            In biomechanics, Newton's laws help explain how muscles generate force to move the body, how impact forces
            affect joints during activities like running, and how external forces influence balance and stability.
          </p>

          <GuidedCalculation>
            <p>A 70 kg person applies a horizontal force of 210 N to push a 30 kg box on a frictionless surface.</p>
            <form>
              <label>
                1. What is the acceleration of the box? (F = ma)<br>
                a = <input type="number" name="boxAccel"> m/s²
              </label>
              <label>
                2. According to Newton's Third Law, what is the magnitude of the force exerted by the box on the person?<br>
                F = <input type="number" name="reactionForce"> N
              </label>
            </form>
          </GuidedCalculation>
        </div>
      </div>
    </section>
  </div>
</div>
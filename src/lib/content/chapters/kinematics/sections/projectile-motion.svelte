<script lang="ts">
  import { currentSection } from '$lib/stores/appState';
  import { intersect } from '$lib/utils/intersection';
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';
  import Katex from 'svelte-katex';
  import { projectileMotionQuizData } from '$lib/content/chapters/data/kinematics-quiz-data';

  // Handle section intersection for navigation
  function handleSectionIntersect(detail: { isIntersecting: boolean; intersectionRatio: number; }) {
    if (detail.isIntersecting && detail.intersectionRatio > 0.3) {
      currentSection.set('projectile-motion');
    }
  }
</script>

<!-- Section 2.3: Projectile Motion -->
<section
  id="projectile-motion"
  data-section="2.3"
  use:intersect={{
    threshold: [0.1, 0.3, 0.5],
    onIntersect: handleSectionIntersect
  }}
>
  <div class="section-line" aria-hidden="true"></div>
  <div class="readable-content">
    <div class="section-header-block">
      <h2>Section Introduction</h2>
      <p>_Placeholder: Describe what this section will cover and the introductory scenario._</p>
      <Scenario>
        <p><strong>Surya:</strong> In basketball, how can I predict where my shot will land?</p>
        <p><strong>Leo:</strong> That's <span class="keyword">projectile motion</span>! We analyze the horizontal (constant velocity) and vertical (constant acceleration due to gravity) components separately.</p>
      </Scenario>
      <p>
        <span class="keyword">Projectile motion</span> is a type of two-dimensional motion where an object is projected into the air and moves under the influence of gravity alone (ignoring air resistance).
      </p>
    </div>

    <div class="concept-block">
      <h2>Projectile Motion Formulas</h2>
      <FormulaAccordion>
        <p class="description">Key equations, assuming launch from origin (x<sub>0</sub>=0, y<sub>0</sub>=0), initial velocity v<sub>0</sub> at angle θ to horizontal, and gravity g:</p>
        <p class="formula-label">Horizontal Position:</p>
        <Katex displayMode>{'\\textcolor{blue}{x} = (\\textcolor{red}{v_0} \\cos \\textcolor{orange}{\\theta}) \\textcolor{purple}{t}'}</Katex>
        <p class="formula-label">Vertical Position:</p>
        <Katex displayMode>{'\\textcolor{blue}{y} = (\\textcolor{red}{v_0} \\sin \\textcolor{orange}{\\theta}) \\textcolor{purple}{t} - \\frac{1}{2} \\textcolor{teal}{g} \\textcolor{purple}{t^2}'}</Katex>
        <p class="formula-label">Maximum Height:</p>
        <Katex displayMode>{'\\textcolor{blue}{h} = \\frac{(\\textcolor{red}{v_0} \\sin \\textcolor{orange}{\\theta})^2}{2\\textcolor{teal}{g}}'}</Katex>
        <p class="formula-label">Range (Horizontal Distance):</p>
        <Katex displayMode>{'\\textcolor{blue}{R} = \\frac{\\textcolor{red}{v_0^2} \\sin(2\\textcolor{orange}{\\theta})}{\\textcolor{teal}{g}}'}</Katex>
      </FormulaAccordion>

      <p>
        Examples include a basketball shot, a thrown baseball, or a long jump in athletics. Maximum range is achieved at a launch angle of 45°.
      </p>
    </div>

    <div class="activity-block -review">
      <SectionReview>
        <Quiz questions={projectileMotionQuizData} showFeedback={true} />
      </SectionReview>
    </div>

  </div>
</section>
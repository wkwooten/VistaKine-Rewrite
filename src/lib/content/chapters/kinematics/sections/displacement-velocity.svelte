<script lang="ts">
  import { currentSection } from '$lib/stores/appState';
  import { intersect } from '$lib/utils/intersection';
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import GuidedCalculation from '$lib/components/GuidedCalculation.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';
  import Katex from 'svelte-katex';
  import { displacementQuizData, velocityQuizData } from '$lib/content/chapters/data/kinematics-quiz-data';

  // Handle section intersection for navigation
  function handleSectionIntersect(detail: { isIntersecting: boolean; intersectionRatio: number; }) {
    if (detail.isIntersecting && detail.intersectionRatio > 0.3) {
      currentSection.set('displacement-velocity');
    }
  }

  // Combine the quiz data for this section
  const combinedQuizData = [...displacementQuizData, ...velocityQuizData];
</script>

<!-- Section 2.1: Displacement & Velocity -->
<section
  id="displacement-velocity"
  data-section="2.1"
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
        <p><strong>Surya:</strong> I'm tracking a runner in a marathon. How do I describe how fast they're going and where they are?</p>
        <p><strong>Leo:</strong> We can use displacement to pinpoint their position change and velocity to describe how fast they're running in a specific direction.</p>
      </Scenario>
      <p>
        <span class="keyword">Displacement</span> (<Katex>\Delta x</Katex>) is the change in position, describing how far an object has moved from its starting point in a straight line and in what direction. It's a vector quantity.
      </p>
      <p>
        <span class="keyword">Velocity</span> (<Katex>v</Katex>) represents the rate of change of position (displacement) with respect to time, including both speed and direction. It's also a vector.
      </p>
    </div>

    <div class="concept-block">
      <h2>Displacement and Velocity Formulas</h2>
      <FormulaAccordion>
        <p class="formula-label">Displacement:</p>
        <Katex displayMode>{'\\textcolor{blue}{\\Delta x} = \\textcolor{red}{x_f} - \\textcolor{green}{x_i}'}</Katex>
        <p class="description">Where Δx is displacement, x<sub>f</sub> is final position, and x<sub>i</sub> is initial position.</p>

        <p class="formula-label">Average Velocity:</p>
        <Katex displayMode>{'\\textcolor{blue}{v_{avg}} = \\frac{\\textcolor{purple}{\\Delta x}}{\\textcolor{green}{\\Delta t}}'}</Katex>
        <p class="description">Where v<sub>avg</sub> is average velocity, Δx is displacement, and Δt is the time interval.</p>
      </FormulaAccordion>
      <p>
        Understanding these is the first step to analyzing any motion.
      </p>
    </div>

    <div class="activity-block -review">
      <SectionReview>
        <Quiz questions={combinedQuizData} showFeedback={true} />
      </SectionReview>
    </div>

  </div>
</section>
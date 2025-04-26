<script lang="ts">
  import { currentSection } from '$lib/stores/appState.js';
  import { intersect } from '$lib/utils/intersection';
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import GuidedCalculation from '$lib/components/GuidedCalculation.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';
  import Katex from 'svelte-katex';
  import { displacementQuizData, velocityQuizData } from '$lib/content/chapters/data/kinematics-quiz-data';
  import Keyword from '$lib/components/Keyword.svelte';
  import ContentCard from '$lib/components/ContentCard.svelte';

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

    <ContentCard blockType="section-header-block">
      <h2>Section Introduction</h2>
      <p>_Placeholder: Introduce displacement & velocity, distinguishing from distance & speed._</p>
      <Scenario>
        <p data-speaker="Surya">Okay, Leo, the robot arm moved 50cm. That's the distance, right?</p>
        <p data-speaker="Leo">It *is* the distance, Surya, but not the full picture! Did it move 50cm straight forward, or 50cm in a circle back to where it started? For precise motion, we need <Keyword term="displacement" /> – the *change in position* including direction.</p>
        <p data-speaker="Surya">Ah, so displacement is a vector, distance is just a number?</p>
        <p data-speaker="Leo">Exactly! Same idea for <Keyword term="velocity" /> versus <Keyword term="speed" />. Velocity tells us how fast *and* in what direction.</p>
      </Scenario>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>Displacement vs. Distance</h2>
      <dl class="definition-list">
        <dt><strong><Keyword term="Distance" /> (Scalar):</strong></dt>
        <dd>The total path length covered during motion. Example: Walking 5 meters east then 5 meters west covers a distance of 10 meters.</dd>
        <dt><strong><Keyword term="Displacement" /> (Vector):</strong></dt>
        <dd>The straight-line change in position from the starting point (<Katex>{"`\\vec{r}_i`"}</Katex>) to the ending point (<Katex>{"`\\vec{r}_f`"}</Katex>). It includes direction. Formula: <Katex displayMode>{"`\\Delta \\vec{r} = \\vec{r}_f - \\vec{r}_i`"}</Katex> Example: In the same walk, the displacement is 0 meters because you ended where you started.</dd>
      </dl>
      <p>In 3D, displacement is calculated using position vectors: <Katex>{"`\\Delta \\vec{r} = \\langle x_f - x_i, y_f - y_i, z_f - z_i \\rangle`"}</Katex>.</p>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>Velocity vs. Speed</h2>
        <dl class="definition-list">
            <dt><strong><Keyword term="Speed" /> (Scalar):</strong></dt>
            <dd>How fast an object is moving; the magnitude of velocity. Calculated as total distance divided by total time.</dd>
            <dt><strong><Keyword term="Velocity" /> (Vector):</strong></dt>
            <dd>The rate of change of displacement; includes speed and direction. </dd>
        </dl>
        <FormulaAccordion>
            <p><strong>Average Velocity:</strong></p>
            <Katex displayMode>{"`\\vec{v}_{avg} = \\frac{\\Delta \\vec{r}}{\\Delta t} = \\frac{\\vec{r}_f - \\vec{r}_i}{t_f - t_i}`"}</Katex>
            <p><strong>Instantaneous Velocity:</strong> Velocity at a specific moment (requires calculus - the derivative of position with respect to time).</p>
            <Katex displayMode>{"`\\vec{v}(t) = \\lim_{\\Delta t \\to 0} \\frac{\\Delta \\vec{r}}{\\Delta t} = \\frac{d\\vec{r}}{dt}`"}</Katex>
        </FormulaAccordion>
        <p>Units for both are typically meters per second (m/s).</p>
    </ContentCard>

    <ContentCard blockType="activity-block" class="-review">
       <h2>Section Review</h2>
       <SectionReview>
         <Quiz questions={combinedQuizData} showFeedback={true} />
       </SectionReview>
    </ContentCard>

  </div>
</section>
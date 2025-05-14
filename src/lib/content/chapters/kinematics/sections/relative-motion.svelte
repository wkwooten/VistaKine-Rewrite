<script lang="ts">
  import { currentSection } from "$lib/stores/appState.ts";
  import { intersect } from "$lib/utils/intersection";
  import FormulaAccordion from "$lib/components/FormulaAccordion.svelte";
  import SectionReview from "$lib/components/SectionReview.svelte";
  import Quiz from "$lib/components/Quiz.svelte";
  import Scenario from "$lib/components/Scenario.svelte";
  import Katex from "svelte-katex";
  import { relativeMotionQuizData } from "$lib/content/chapters/data/quizzes/kinematics-quiz-data";
  import ContentCard from "$lib/components/ContentCard.svelte";
  import Keyword from "$lib/components/Keyword.svelte";

  // Handle section intersection for navigation
  function handleSectionIntersect(detail: {
    isIntersecting: boolean;
    intersectionRatio: number;
  }) {
    if (detail.isIntersecting && detail.intersectionRatio > 0.3) {
      currentSection.set("relative-motion");
    }
  }
</script>

<!-- Section 2.4: Relative Motion -->
<section
  id="relative-motion"
  data-section="2.4"
  use:intersect={{
    threshold: [0.1, 0.3, 0.5],
    onIntersect: handleSectionIntersect,
  }}
>
  <div class="section-line" aria-hidden="true"></div>
  <div class="readable-content">
    <ContentCard blockType="section-header-block">
      <h2>Section Introduction</h2>
      <p>
        _Placeholder: Describe what this section will cover and the introductory
        scenario._
      </p>
      <Scenario>
        <p>
          <strong>Surya:</strong> If I'm walking forward on a moving train, how fast
          am I moving relative to someone standing on the ground?
        </p>
        <p>
          <strong>Leo:</strong> Your velocity relative to the ground is the sum
          of your velocity relative to the train and the train's velocity
          relative to the ground! That's
          <span class="keyword">relative motion</span>.
        </p>
      </Scenario>
      <p>
        Motion is always described relative to a <span class="keyword"
          >frame of reference</span
        >. <span class="keyword">Relative motion</span> analysis helps us understand
        how the motion of an object appears from different viewpoints (different
        reference frames).
      </p>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>Relative Velocity Formulas</h2>
      <FormulaAccordion>
        <p class="formula-label">Relative Velocity (1D):</p>
        <Katex displayMode
          >{"\\vec{v}_{P/A} = \\vec{v}_{P/B} + \\vec{v}_{B/A}"}</Katex
        >
        <p class="description">
          The velocity of P relative to frame A (v<sub>P/A</sub>) is the vector
          sum of the velocity of P relative to frame B (v<sub>P/B</sub>) and the
          velocity of frame B relative to frame A (v<sub>B/A</sub>).
        </p>
        <p class="description">Note: v<sub>A/B</sub> = -v<sub>B/A</sub></p>
      </FormulaAccordion>
      <p>
        This concept is crucial in navigation (e.g., airplanes dealing with
        wind) and understanding observations in physics.
      </p>
    </ContentCard>

    <ContentCard blockType="activity-block" class="-review">
      <h2>Section Review</h2>
      <SectionReview>
        <Quiz questions={relativeMotionQuizData} showFeedback={true} />
      </SectionReview>
    </ContentCard>
  </div>
</section>

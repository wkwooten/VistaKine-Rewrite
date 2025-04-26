<script lang="ts">
  import { currentSection } from '$lib/stores/appState.js';
  import { intersect } from '$lib/utils/intersection';
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import GuidedCalculation from '$lib/components/GuidedCalculation.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';
  import Katex from 'svelte-katex';
  import { accelerationQuizData } from '$lib/content/chapters/data/kinematics-quiz-data';
  import ContentCard from '$lib/components/ContentCard.svelte';
  import Keyword from '$lib/components/Keyword.svelte';

  // Handle section intersection for navigation
  function handleSectionIntersect(detail: { isIntersecting: boolean; intersectionRatio: number; }) {
    if (detail.isIntersecting && detail.intersectionRatio > 0.3) {
      currentSection.set('acceleration');
    }
  }
</script>

<!-- Section 2.2: Acceleration -->
<section
  id="acceleration"
  data-section="2.2"
  use:intersect={{
    threshold: [0.1, 0.3, 0.5],
    onIntersect: handleSectionIntersect
  }}
>
  <div class="section-line" aria-hidden="true"></div>
  <div class="readable-content">
    <ContentCard blockType="section-header-block">
      <h2>Section Introduction</h2>
      <p>_Placeholder: Describe what this section will cover and the introductory scenario._</p>
      <Scenario>
        <p><strong>Surya:</strong> What's the difference between a car driving at a constant speed and one that's speeding up or braking?</p>
        <p><strong>Leo:</strong> The difference is <span class="keyword">acceleration</span>! It measures how quickly the car's velocity is changing. Constant speed means zero acceleration.</p>
      </Scenario>
      <p>
        <span class="keyword">Acceleration</span> (<Katex>a</Katex>) is the rate of change of velocity with respect to time. It indicates how quickly an object is speeding up, slowing down (deceleration), or changing direction. Like velocity, it's a vector quantity.
      </p>
      <p>
        If acceleration is zero, the object moves with constant velocity (uniform motion). If acceleration is constant and non-zero, the object's velocity changes at a steady rate (uniformly accelerated motion).
      </p>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>Acceleration Formulas & Calculation</h2>
      <FormulaAccordion>
        <p class="formula-label">Average Acceleration:</p>
        <Katex displayMode>{'\\textcolor{blue}{a_{avg}} = \\frac{\\textcolor{purple}{\\Delta v}}{\\textcolor{green}{\\Delta t}}'}</Katex>
        <p class="description">Where a<sub>avg</sub> is average acceleration, Δv is the change in velocity, and Δt is the time interval.</p>

        <p class="formula-label">Equations for Constant Acceleration:</p>
        <Katex displayMode>{'\\textcolor{blue}{v} = \\textcolor{green}{v_0} + \\textcolor{red}{a}\\textcolor{purple}{t}'}</Katex>
        <Katex displayMode>{'\\textcolor{blue}{x} = \\textcolor{green}{x_0} + \\textcolor{green}{v_0} \\textcolor{purple}{t} + \\frac{1}{2} \\textcolor{red}{a} \\textcolor{purple}{t^2}'}</Katex>
        <Katex displayMode>{'\\textcolor{blue}{v^2} = \\textcolor{green}{v_0^2} + 2\\textcolor{red}{a}(\\textcolor{blue}{x} - \\textcolor{green}{x_0})'}</Katex>
        <p class="description">Where v is final velocity, v<sub>0</sub> is initial velocity, a is constant acceleration, t is time, x is final position, and x<sub>0</sub> is initial position.</p>
      </FormulaAccordion>

      <GuidedCalculation>
        <p>A car is traveling at 20 m/s (<Katex>v_0</Katex>) when the driver applies the brakes, causing a constant deceleration of 5 m/s² (<Katex>a = -5 \, m/s^2</Katex>).</p>
        <form>
          <label>
            1. How long will it take for the car to stop (<Katex>v = 0</Katex>)? Use <Katex>v = v_0 + at</Katex>.<br>
            t = <input type="number" name="stopTime"> s
          </label>
          <label>
            2. How far will the car travel before stopping? Use <Katex>v^2 = v_0^2 + 2a(x - x_0)</Katex>, assuming <Katex>x_0 = 0</Katex>.<br>
            Distance (<Katex>x</Katex>) = <input type="number" name="stopDistance"> m
          </label>
        </form>
        <!-- Answers: t=4s, d=40m -->
      </GuidedCalculation>
    </ContentCard>

    <ContentCard blockType="activity-block" class="-review">
      <SectionReview>
        <Quiz questions={accelerationQuizData} showFeedback={true} />
      </SectionReview>
    </ContentCard>
  </div>
</section>
<script lang="ts">
  import { currentSection } from "$lib/stores/appState.ts";
  import FormulaAccordion from "$lib/components/FormulaAccordion.svelte";
  import GuidedCalculation from "$lib/components/GuidedCalculation.svelte";
  import SectionReview from "$lib/components/SectionReview.svelte";
  import Quiz from "$lib/components/Quiz.svelte";
  import Scenario from "$lib/components/Scenario.svelte";
  import Katex from "svelte-katex";
  import {
    displacementQuizData,
    velocityQuizData,
  } from "$lib/content/chapters/data/quizzes/kinematics-quiz-data";
  import Keyword from "$lib/components/Keyword.svelte";
  import ContentCard from "$lib/components/ContentCard.svelte";
  import DisplacementVelocityExercise from "$lib/components/visualization/interactions/displacement-velocity/DisplacementVelocityExercise.svelte";

  // Combine the quiz data for this section
  const combinedQuizData = [...displacementQuizData, ...velocityQuizData];
</script>

<!-- Section 2.1: Displacement & Velocity -->
<section id="displacement-velocity" data-section="2.1">
  <div class="section-line" aria-hidden="true"></div>
  <ContentCard blockType="section-header-block">
    <h2>2.1 Introduction: Describing Motion Precisely</h2>
    <p>
      Welcome to Kinematics! Our first step is learning to describe *how* things
      move. It might seem simple, but physics requires precision. Just saying
      something moved "fast" or "far" isn't enough. We need to distinguish
      between the total path covered and the net change in location, and between
      raw speed and speed *with direction*. This section introduces the
      fundamental concepts of <Keyword term="Displacement" /> vs.
      <Keyword term="Distance" />, and <Keyword term="Velocity" /> vs. <Keyword
        term="Speed"
      />.
    </p>
    <Scenario>
      <p data-speaker="Prof. Astra">
        Right then, Ben! Imagine our little drone here. It zipped 10 meters
        across the lab, then 10 meters straight back. How far did it travel?
      </p>
      <p data-speaker="Ben">Easy, Professor! 20 meters total.</p>
      <p data-speaker="Prof. Astra">
        Indeed! That's its <Keyword term="Distance" /> traveled – the total length
        of its path. But... where did it *end up* compared to where it started?
      </p>
      <p data-speaker="Ben">Umm... back where it began?</p>
      <p data-speaker="Prof. Astra">
        Precisely! Its net change in position, its <Keyword
          term="Displacement"
        />, is zero! See the difference? One is just length, the other includes
        direction and tells us the *overall* change in location. We need both
        concepts, along with their time-based cousins, Speed and Velocity, to
        truly understand motion.
      </p>
    </Scenario>
    <p>
      Mastering these distinctions is the first step towards analyzing more
      complex motions in the upcoming sections.
    </p>
    <SectionReview>
      <Quiz questions={combinedQuizData} showFeedback={true} />
    </SectionReview>
  </ContentCard>

  <ContentCard blockType="concept-block">
    <h2>Displacement vs. Distance</h2>
    <p>
      Understanding the difference between how far something traveled and its
      overall change in position is crucial.
    </p>
    <dl class="definition-list">
      <dt>
        <strong><Keyword term="Distance" /> (<Katex>d</Katex>):</strong>
      </dt>
      <dd>
        A <Keyword term="Scalar" /> quantity representing the total path length covered
        by an object during its motion. It only has magnitude (e.g., 10 meters).
        Think of the odometer in a car – it only counts up, regardless of direction.
      </dd>
      <dt>
        <strong
          ><Keyword term="Displacement" /> (<Katex>{"`\\Delta \\vec{r}`"}</Katex
          >):</strong
        >
      </dt>
      <dd>
        A <Keyword term="Vector" /> quantity representing the straight-line change
        in an object's position from its initial point (<Katex
          >{"`\\vec{r}_i`"}</Katex
        >) to its final point (<Katex>{"`\\vec{r}_f`"}</Katex>). It has both
        magnitude and direction. It's calculated as the difference between the
        final and initial <Keyword term="Position Vector" />s.
      </dd>
    </dl>
    <FormulaAccordion title="Displacement Formula">
      <p>
        The displacement vector <Katex>{"`\\Delta \\vec{r}`"}</Katex> is found by
        subtracting the initial position vector <Katex>{"`\\vec{r}_i`"}</Katex> from
        the final position vector <Katex>{"`\\vec{r}_f`"}</Katex>:
      </p>
      <Katex displayMode>{"`\\Delta \\vec{r} = \\vec{r}_f - \\vec{r}_i`"}</Katex
      >
      <p>In three dimensions, using Cartesian coordinates:</p>
      <Katex>{"`\\vec{r}_i = \\langle x_i, y_i, z_i \\rangle`"}</Katex>
      <Katex>{"`\\vec{r}_f = \\langle x_f, y_f, z_f \\rangle`"}</Katex>
      <p>The displacement vector becomes:</p>
      <Katex displayMode
        >{"`\\Delta \\vec{r} = \\langle x_f - x_i, y_f - y_i, z_f - z_i \\rangle = \\langle \\Delta x, \\Delta y, \\Delta z \\rangle`"}</Katex
      >
      <p>
        The magnitude of the displacement vector (<Katex
          >{"`|\\Delta \\vec{r}|`"}</Katex
        >) gives the straight-line distance between the start and end points,
        which is often different from the total distance traveled.
      </p>
    </FormulaAccordion>
    <p>
      <strong>Example Revisited:</strong> The drone flying 10m out and 10m back
      covers a distance <Katex>d = 20</Katex> m. However, since <Katex
        >{"`\\vec{r}_f = \\vec{r}_i`"}</Katex
      >, its displacement is <Katex
        >{"`\\Delta \\vec{r} = \\vec{r}_f - \\vec{r}_i = \\vec{0}`"}</Katex
      > (the zero vector).
    </p>
  </ContentCard>

  <ContentCard blockType="concept-block">
    <h2>Velocity vs. Speed</h2>
    <p>
      Just as we distinguish between distance and displacement, we must
      distinguish between how fast an object is moving and how fast its position
      is changing *in a specific direction*.
    </p>
    <dl class="definition-list">
      <dt>
        <strong
          ><Keyword term="Speed" /> (<Katex>v</Katex> or <Katex>s</Katex
          >):</strong
        >
      </dt>
      <dd>
        A <Keyword term="Scalar" /> quantity representing how fast an object is moving.
        Average speed is calculated as total distance divided by total time (<Katex
          >{"`\\Delta t`"}</Katex
        >). Instantaneous speed is the magnitude of the instantaneous velocity
        vector.
      </dd>
      <dt>
        <strong
          ><Keyword term="Velocity" /> (<Katex>{"`\\vec{v}`"}</Katex>):</strong
        >
      </dt>
      <dd>
        A <Keyword term="Vector" /> quantity representing the rate of change of an
        object's displacement. It includes both speed (its magnitude) and direction.
      </dd>
    </dl>
    <FormulaAccordion title="Velocity Formulas">
      <p>
        <strong>Average Velocity (<Katex>{"`\\vec{v}_{avg}`"}</Katex>):</strong>
        The total displacement divided by the total time interval.
      </p>
      <Katex displayMode
        >{"`\\vec{v}_{avg} = \\frac{\\Delta \\vec{r}}{\\Delta t} = \\frac{\\vec{r}_f - \\vec{r}_i}{t_f - t_i}`"}</Katex
      >
      <p>In 3D, this becomes:</p>
      <Katex displayMode
        >{"`\\vec{v}_{avg} = \\left\\langle \\frac{\\Delta x}{\\Delta t}, \\frac{\\Delta y}{\\Delta t}, \\frac{\\Delta z}{\\Delta t} \\right\\rangle`"}</Katex
      >
      <p>
        <strong
          >Instantaneous Velocity (<Katex>{"`\\vec{v}(t)`"}</Katex>):</strong
        >
        The velocity of an object at a specific moment in time (<Katex>t</Katex
        >). It's the limit of the average velocity as the time interval <Katex
          >{"`\\Delta t`"}</Katex
        > approaches zero. This is formally defined using calculus as the time derivative
        of the position vector.
      </p>
      <Katex displayMode
        >{"`\\vec{v}(t) = \\lim_{\\Delta t \\to 0} \\frac{\\Delta \\vec{r}}{\\Delta t} = \\frac{d\\vec{r}}{dt}`"}</Katex
      >
      <p>In 3D, this means taking the derivative of each component:</p>
      <Katex displayMode
        >{"`\\vec{v}(t) = \\left\\langle \\frac{dx}{dt}, \\frac{dy}{dt}, \\frac{dz}{dt} \\right\\rangle = \\langle v_x(t), v_y(t), v_z(t) \\rangle`"}</Katex
      >
      <p>
        While understanding the calculus definition is helpful, for many
        problems in introductory kinematics, we'll focus on average velocity or
        cases where instantaneous velocity is constant.
      </p>
    </FormulaAccordion>
    <p>
      <strong>Units:</strong> The standard SI unit for both speed and velocity is
      meters per second (m/s).
    </p>
    <p>
      <strong>Key Distinction:</strong> An object can have a constant speed but a
      changing velocity if its direction changes (like a car driving in a circle
      at a steady 30 km/h).
    </p>
  </ContentCard>

  <ContentCard blockType="exercise-block" layoutWidth="full">
    <DisplacementVelocityExercise />
  </ContentCard>

  <ContentCard blockType="conclusion-block">
    <h2>Section Summary</h2>
    <p>
      In this section, we established the crucial differences between scalar and
      vector descriptions of motion:
    </p>
    <ul>
      <li>
        <Keyword term="Distance" /> (scalar) measures total path length, while
        <Keyword term="Displacement" /> (vector, <Katex
          >{"`\\Delta \\vec{r} = \\vec{r}_f - \\vec{r}_i`"}</Katex
        >) measures the net change in position, including direction.
      </li>
      <li>
        <Keyword term="Speed" /> (scalar) measures how fast an object moves, while
        <Keyword term="Velocity" /> (vector, <Katex
          >{"`\\vec{v} = d\\vec{r}/dt`"}</Katex
        >) measures the rate of change of displacement, including direction.
      </li>
      <li>
        <Keyword term="Average Velocity" /> (<Katex
          >{"`\\vec{v}_{avg} = \\Delta \\vec{r} / \\Delta t`"}</Katex
        >) describes motion over an interval, while <Keyword
          term="Instantaneous Velocity"
        /> describes motion at a specific moment.
      </li>
    </ul>
    <p>
      These distinctions are fundamental for accurately analyzing motion in
      physics.
    </p>
  </ContentCard>
</section>

<style lang="scss">
  // ... existing code ...
</style>

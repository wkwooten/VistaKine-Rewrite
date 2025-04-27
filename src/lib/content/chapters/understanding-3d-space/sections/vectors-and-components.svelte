<!-- Added back handleSectionIntersect function definition -->
<script context="module" lang="ts">
  // Handle section intersection for navigation (Placeholder - needs implementation)
  function handleSectionIntersect(detail: {
    isIntersecting: boolean;
    intersectionRatio: number;
  }) {
    if (detail.isIntersecting && detail.intersectionRatio > 0.3) {
      // Assuming the store expects the slug 'vectors-and-components'
      // currentSection.set('vectors-and-components'); // Re-enable when store/sidebar is ready
    }
  }
</script>

<script lang="ts">
  import { currentSection } from "$lib/stores/appState.js";
  import { intersect, type IntersectDetail } from "$lib/utils/intersection";
  import FormulaAccordion from "$lib/components/FormulaAccordion.svelte";
  import SectionReview from "$lib/components/SectionReview.svelte";
  import Quiz from "$lib/components/Quiz.svelte";
  import Scenario from "$lib/components/Scenario.svelte";
  import extractKeywords from "$lib/utils/keywordExtractor.js";
  import VectorBuilderExercise from "$lib/components/visualization/interactions/vector-builder/VectorBuilderExercise.svelte";
  import { vectorQuizData } from "$lib/content/chapters/data/quizzes/understanding-3d-space-quiz-data";
  import Katex from "svelte-katex";
  import Keyword from "$lib/components/Keyword.svelte";
  import VectorAnatomy from "$lib/components/visualization/elements/constructs/VectorAnatomy.svelte";
  import ContentCard from "$lib/components/ContentCard.svelte";
  import { onMount } from "svelte";
  import type Vector1dComponentType from "$lib/components/Vector1d.svelte";
  import type Vector2dComponentType from "$lib/components/Vector2d.svelte";

  let Vector1dComponent: typeof Vector1dComponentType | null = null;
  let Vector2dComponent: typeof Vector2dComponentType | null = null;

  onMount(async () => {
    [Vector1dComponent, Vector2dComponent] = await Promise.all([
      import("$lib/components/Vector1d.svelte").then((mod) => mod.default),
      import("$lib/components/Vector2d.svelte").then((mod) => mod.default),
    ]);
  });
</script>

<section
  id="vectors-and-components"
  data-section="1.2"
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
        <p data-speaker="Surya">
          <span class="speaker"><strong>Surya:</strong></span> Okay, I get coordinates
          – like (3, 2, 5). But how do I tell a robot arm to *move*? Knowing the
          start and end isn't enough, right?
        </p>
        <p data-speaker="Leo">
          <span class="speaker"><strong>Leo:</strong></span> Exactly! That's
          where <Keyword term="vectors" /> come in. Think of kicking a ball: you
          need both *how hard* (magnitude) and *in what direction*. A vector captures
          both.
        </p>
        <p data-speaker="Surya">
          <span class="speaker"><strong>Surya:</strong></span> So, coordinates =
          location, vectors = movement, force, or velocity (speed + direction)?
        </p>
        <p data-speaker="Leo">
          <span class="speaker"><strong>Leo:</strong></span> You got it! Coordinates
          are map pins. Vectors are arrows showing the journey or force.
        </p>
      </Scenario>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>What are Vectors? Scalar vs. Vector</h2>
      <p>
        Sometimes, location isn't the whole story. We often need quantities with
        both size (<Keyword term="magnitude" />) and direction.
      </p>
      <dl class="definition-list">
        <dt><strong><Keyword term="Scalar" />:</strong></dt>
        <dd>Has magnitude only (e.g., temperature: 25°C).</dd>
        <dt><strong><Keyword term="Vector" />:</strong></dt>
        <dd>
          Has magnitude and direction (e.g., pushing a box: strength +
          direction).
        </dd>
      </dl>
      <p>
        Examples of vectors include <Keyword term="force" />, <Keyword
          term="velocity"
        /> (speed in a specific direction), and <Keyword term="displacement" /> (change
        in position).
      </p>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>Vectors in One Dimension (1D)</h2>
      <p>
        Imagine a number line. A 1D vector simply represents movement or
        quantity along that line.
      </p>
      <ul>
        <li>
          <Keyword term="Magnitude" />: The absolute value of the number (e.g.,
          |+5| = 5, |-3| = 3).
        </li>
        <li>
          <Keyword term="Direction" />: Indicated by the sign (+ for positive
          direction, - for negative).
        </li>
      </ul>
      <p>
        Example: A vector <Katex>{"+6"}</Katex> means moving 6 units in the positive
        direction.
      </p>
      {#if Vector1dComponent}
        <figure>
          <svelte:component this={Vector1dComponent} />
          <figcaption>Drag the vector to change its value.</figcaption>
        </figure>
      {:else}
        <p>Loading 1D Canvas...</p>
      {/if}
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>Extending to Two Dimensions (2D)</h2>
      <p>
        In 2D (like a flat plane), we need two pieces of information to describe
        a vector's direction and magnitude, typically using the X and Y axes. We
        break the vector down into <Keyword term="components" />:
      </p>
      <ul>
        <li>
          <Katex>{"\\textcolor{#EF5350}{V_x}"}</Katex>: How far the vector
          extends along the X-axis.
        </li>
        <li>
          <Katex>{"\\textcolor{#66BB6A}{V_y}"}</Katex>: How far the vector
          extends along the Y-axis.
        </li>
      </ul>
      <p>
        The magnitude (length) in 2D is found using the standard Pythagorean
        theorem:
      </p>
      <FormulaAccordion summary="2D Magnitude Formula">
        <p>
          <Katex displayMode
            >{"||\\vec{V}|| = \\sqrt{\\textcolor{#EF5350}{V_x}^2 + \\textcolor{#66BB6A}{V_y}^2}"}</Katex
          >
        </p>
        <p>
          This calculates the hypotenuse of a right triangle formed by the
          vector's components.
        </p>
      </FormulaAccordion>
      <p>Visually, it's an arrow on a 2D coordinate plane:</p>
      {#if Vector2dComponent}
        <svelte:component this={Vector2dComponent} />
      {:else}
        <p>Loading 2D Canvas...</p>
      {/if}
    </ContentCard>

    <p class="transition-text">
      Now that we've seen how vectors work in 1D and 2D, let's add the third
      dimension (Z-axis) to fully understand vectors in 3D space.
    </p>

    <ContentCard blockType="visualization-block" class="visualization-card">
      <h2>Anatomy of a Vector (3D)</h2>
      <VectorAnatomy />
      <p>
        In 3D space, a vector is still represented by an arrow. Its <strong
          >Tail</strong
        >
        marks the starting point, and the <strong>Head</strong> (tip) marks the
        ending point. The arrow's <strong>Length</strong> represents the
        vector's <strong>Magnitude</strong> (size, strength, or speed), and its
        <strong>Orientation</strong>
        in space indicates its <strong>Direction</strong>.
      </p>
      <p>
        Changing the arrow's start or end points alters its length and
        direction. This visual helps, but for precision, we need numbers: <Keyword
          term="components"
        />.
      </p>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>Describing 3D Vectors Precisely: Components & Notation</h2>
      <p>
        To work with 3D vectors mathematically, we break them into <Keyword
          term="components"
        /> along the X, Y, and Z axes. These components (<Katex
          >{"\\textcolor{#EF5350}{V_x}"}</Katex
        >, <Katex>{"\\textcolor{#66BB6A}{V_y}"}</Katex>, <Katex
          >{"\\textcolor{#2C8FFF}{V_z}"}</Katex
        >) tell us how much the vector extends along each axis.
      </p>
      <FormulaAccordion>
        <p>
          To calculate the components of a 3D vector with tail at <Katex
            >{"P_1(x_1, y_1, z_1)"}</Katex
          > and head at <Katex>{"P_2(x_2, y_2, z_2)"}</Katex>:
        </p>
        <ul>
          <li>
            <Katex>{"\\textcolor{#EF5350}{V_x} = x_2 - x_1"}</Katex> (Change in X)
          </li>
          <li>
            <Katex>{"\\textcolor{#66BB6A}{V_y} = y_2 - y_1"}</Katex> (Change in Y)
          </li>
          <li>
            <Katex>{"\\textcolor{#2C8FFF}{V_z} = z_2 - z_1"}</Katex> (Change in Z)
          </li>
        </ul>
      </FormulaAccordion>
      <p>You may also encounter vectors written like this:</p>
      <ul>
        <li>
          Angle Bracket Notation: <Katex
            >{"\\vec{V} = \\langle \\textcolor{#EF5350}{V_x}, \\textcolor{#66BB6A}{V_y}, \\textcolor{#2C8FFF}{V_z} \\rangle"}</Katex
          >
        </li>
        <li>
          Parentheses Notation: <Katex
            >{"\\vec{V} = (\\textcolor{#EF5350}{V_x}, \\textcolor{#66BB6A}{V_y}, \\textcolor{#2C8FFF}{V_z})"}</Katex
          >
        </li>
      </ul>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>Vector Magnitude in 3D: Measuring Length</h2>
      <p>
        The <Keyword term="magnitude" /> (length) of a 3D vector <Katex
          >{"\\vec{V}"}</Katex
        > with components <Katex
          >{"\\textcolor{#EF5350}{V_x}, \\textcolor{#66BB6A}{V_y}, \\textcolor{#2C8FFF}{V_z}"}</Katex
        > extends the 2D concept using the 3D Pythagorean theorem:
      </p>
      <FormulaAccordion>
        Where:
        <ul>
          <li>
            <Katex>{"||\\vec{V}||"}</Katex>: Represents the
            <strong>magnitude</strong>
            (or length) of the vector <Katex>{"\\vec{V}"}</Katex>.
          </li>
          <li>
            <Katex>{"\\textcolor{#EF5350}{V_x}"}</Katex>: The component of the
            vector along the X-axis.
          </li>
          <li>
            <Katex>{"\\textcolor{#66BB6A}{V_y}"}</Katex>: The component of the
            vector along the Y-axis.
          </li>
          <li>
            <Katex>{"\\textcolor{#2C8FFF}{V_z}"}</Katex>: The component of the
            vector along the Z-axis.
          </li>
        </ul>
        <p>
          <Katex displayMode
            >{"||\\vec{V}|| = \\sqrt{\\textcolor{#EF5350}{V_x}^2 + \\textcolor{#66BB6A}{V_y}^2 + \\textcolor{#2C8FFF}{V_z}^2}"}</Katex
          >
        </p>
      </FormulaAccordion>
      <p>
        This formula calculates the vector's overall length by combining its
        individual extensions along the X, Y, and Z axes. Think of it as finding
        the diagonal length of a 3D box defined by the vector's components.
      </p>
      <ContentCard blockType="explanation-block">
        <h4>How it works (Extending Pythagoras):</h4>
        <ol>
          <li>
            In 2D, the squared distance in the XY plane is: <Katex displayMode
              >{"d_{xy}^2 = \\textcolor{#EF5350}{V_x}^2 + \\textcolor{#66BB6A}{V_y}^2"}</Katex
            >
          </li>
          <li>
            In 3D, the squared magnitude uses the 2D distance and the Z
            component: <Katex displayMode
              >{"||\\vec{V}||^2 = d_{xy}^2 + \\textcolor{#2C8FFF}{V_z}^2"}</Katex
            >
          </li>
          <li>
            Substituting the first equation into the second gives: <Katex
              displayMode
              >{"||\\vec{V}||^2 = (\\textcolor{#EF5350}{V_x}^2 + \\textcolor{#66BB6A}{V_y}^2) + \\textcolor{#2C8FFF}{V_z}^2"}</Katex
            >
          </li>
          <li>Taking the square root yields the final magnitude formula.</li>
        </ol>
      </ContentCard>
    </ContentCard>

    <ContentCard blockType="visualization-block" class="-exercise">
      <h2>Hands-On: Build-A-Vector</h2>
      <p class="exercise-description">
        Adjust the start and end points of the vector using the controls.
        Observe how the vector's components (Vx, Vy, Vz) and its angle bracket
        notation change in real-time.
      </p>
      <VectorBuilderExercise />
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>An Alternative Language: Unit Vector Notation</h2>
      <p>
        Another common way to write vectors, especially in physics/engineering,
        uses <Keyword term="unit vectors" />.
      </p>
      <p>
        A <Keyword term="unit vector" /> has a magnitude of exactly 1 and indicates
        direction. The <Keyword term="standard basis vectors" /> point along the
        positive axes:
      </p>
      <ul>
        <li>
          <Katex
            >{"\\textcolor{#EF5350}{\\hat{\\mathbf{i}}} = \\langle 1, 0, 0 \\rangle"}</Katex
          > (Positive X-axis direction)
        </li>
        <li>
          <Katex
            >{"\\textcolor{#66BB6A}{\\hat{\\mathbf{j}}} = \\langle 0, 1, 0 \\rangle"}</Katex
          > (Positive Y-axis direction)
        </li>
        <li>
          <Katex
            >{"\\textcolor{#2C8FFF}{\\hat{\\mathbf{k}}} = \\langle 0, 0, 1 \\rangle"}</Katex
          > (Positive Z-axis direction)
        </li>
      </ul>
      <p>
        (Note: Sometimes written as bold **i**, **j**, **k** without the hat <Katex
          >{"\\hat{}"}</Katex
        >.)
      </p>
      <p>
        Any vector <Katex>{"\\vec{V}"}</Katex> can be written as a sum ("linear combination")
        of components times their corresponding unit vectors:
      </p>
      <p>
        <Katex displayMode
          >{"\\vec{V} = \\textcolor{#EF5350}{V_x}\\textcolor{#EF5350}{\\hat{\\mathbf{i}}} + \\textcolor{#66BB6A}{V_y}\\textcolor{#66BB6A}{\\hat{\\mathbf{j}}} + \\textcolor{#2C8FFF}{V_z}\\textcolor{#2C8FFF}{\\hat{\\mathbf{k}}}"}</Katex
        >
      </p>
      <p>
        This clearly shows the vector's extent along each axis. <br /> Example:
        <br />
        <Katex>{"\\langle 2, -3, 5 \\rangle"}</Katex> is also <Katex
          >{"2\\textcolor{#EF5350}{\\hat{\\mathbf{i}}} - 3\\textcolor{#66BB6A}{\\hat{\\mathbf{j}}} + 5\\textcolor{#2C8FFF}{\\hat{\\mathbf{k}}}"}</Katex
        >.
      </p>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>Comparing Vector Notations</h2>
      <h4>Notation in Different Fields</h4>
      <p>Vector representation varies by field:</p>
      <ul>
        <li>
          <strong>Physics & Engineering:</strong> Often use <Katex
            >{"\\hat{\\mathbf{i}}, \\hat{\\mathbf{j}}, \\hat{\\mathbf{k}}"}</Katex
          > notation (good for forces, velocities).
        </li>
        <li>
          <strong>Computer Science & Graphics:</strong> Often use component form <Katex
            >{"\\langle x, y, z \\rangle"}</Katex
          > or <Katex>{"(x, y, z)"}</Katex> (good for points, directions in code).
        </li>
      </ul>
      <p>
        Both notations represent the same concept: a quantity with magnitude and
        direction. Familiarity with both is useful.
      </p>
    </ContentCard>

    <ContentCard blockType="activity-block" class="-review">
      <SectionReview>
        <Quiz questions={vectorQuizData} showFeedback={true} />
      </SectionReview>
    </ContentCard>
  </div>
</section>

<style lang="scss">
  /* Remove article-specific styles as they should be handled by SectionTemplate/chapter-styles */

  /* Keep styles truly specific to THIS section if any */
  /* For example, if h3/h4 need different spacing ONLY here */
  /* h3, h4 {
    margin-top: var(--space-l);
    margin-bottom: var(--space-s);
  } */

  /* If no section-specific styles remain, this style block can be removed */
</style>

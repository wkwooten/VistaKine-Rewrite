<!-- Added back handleSectionIntersect function definition -->
<script context="module" lang="ts">
  // REMOVE: handleSectionIntersect function definition - no longer needed
  // function handleSectionIntersect(detail: {
  //   isIntersecting: boolean;
  //   intersectionRatio: number;
  // }) {
  //   if (detail.isIntersecting && detail.intersectionRatio > 0.3) {
  //     // Assuming the store expects the slug 'vectors-and-components'
  //     // currentSection.set('vectors-and-components'); // Re-enable when store/sidebar is ready
  //   }
  // }
</script>

<script lang="ts">
  import { currentSection } from "$lib/stores/appState.ts";
  // REMOVE: import { intersect, type IntersectDetail } from "$lib/utils/intersection"; // No longer needed
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
  import katex from "katex"; // Import katex directly
  import EquationDisplay from "$lib/components/EquationDisplay.svelte";

  let Vector1dComponent: typeof Vector1dComponentType | null = null;
  let Vector2dComponent: typeof Vector2dComponentType | null = null;

  onMount(async () => {
    [Vector1dComponent, Vector2dComponent] = await Promise.all([
      import("$lib/components/Vector1d.svelte").then((mod) => mod.default),
      import("$lib/components/Vector2d.svelte").then((mod) => mod.default),
    ]);
  });
</script>

<section id="vectors-and-components-section" data-section="1.2">
  <ContentCard
    blockType="section-header-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vectors-and-components_intro"
  >
    <h2
      class="content-card-title"
      id="vector-section-introduction"
      data-nav-target="true"
    >
      Section Introduction
    </h2>
    <p>
      _Placeholder: Describe what this section will cover and the introductory
      scenario._
    </p>
    <Scenario>
      <p data-speaker="Surya">
        <span class="speaker"><strong>Surya:</strong></span> Okay, I get coordinates
        – like (3, 2, 5). But how do I tell a robot arm to *move*? Knowing the start
        and end isn't enough, right?
      </p>
      <p data-speaker="Leo">
        <span class="speaker"><strong>Leo:</strong></span> Exactly! That's where <Keyword
          term="vectors"
        /> come in. Think of kicking a ball: you need both *how hard* (magnitude)
        and *in what direction*. A vector captures both.
      </p>
      <p data-speaker="Surya">
        <span class="speaker"><strong>Surya:</strong></span> So, coordinates = location,
        vectors = movement, force, or velocity (speed + direction)?
      </p>
      <p data-speaker="Leo">
        <span class="speaker"><strong>Leo:</strong></span> You got it! Coordinates
        are map pins. Vectors are arrows showing the journey or force.
      </p>
    </Scenario>
  </ContentCard>

  <ContentCard
    blockType="concept-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vectors-and-components_what-are-vectors"
  >
    <h2 class="content-card-title" id="what-are-vectors" data-nav-target="true">
      What are Vectors? Scalar vs. Vector
    </h2>
    <p>
      Sometimes, location isn't the whole story. We often need quantities with
      both size (<Keyword term="magnitude" />) and direction.
    </p>
    <dl class="definition-list">
      <dt><strong><Keyword term="Scalar" />:</strong></dt>
      <dd>Has magnitude only (e.g., temperature: 25°C).</dd>
      <dt><strong><Keyword term="Vector" />:</strong></dt>
      <dd>
        Has magnitude and direction (e.g., pushing a box: strength + direction).
      </dd>
    </dl>
    <p>
      Examples of vectors include <Keyword term="force" />, <Keyword
        term="velocity"
      /> (speed in a specific direction), and <Keyword term="displacement" /> (change
      in position).
    </p>
  </ContentCard>

  <ContentCard
    blockType="concept-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vectors-and-components_vectors-in-1d"
  >
    <h2 class="content-card-title" id="vectors-in-1d" data-nav-target="true">
      Vectors in One Dimension (1D)
    </h2>
    <p>
      Imagine a number line. A 1D vector simply represents movement or quantity
      along that line.
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
      Example: A vector {@html katex.renderToString("+6")} means moving 6 units in
      the positive direction.
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

  <ContentCard
    blockType="concept-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vectors-and-components_vectors-in-2d"
  >
    <h2 class="content-card-title" id="vectors-in-2d" data-nav-target="true">
      Extending to Two Dimensions (2D)
    </h2>
    <p>
      In 2D (like a flat plane), we need two pieces of information to describe a
      vector's direction and magnitude, typically using the X and Y axes. We
      break the vector down into <Keyword term="components" />:
    </p>
    <ul>
      <li>
        <span class="katex-axis-x">{@html katex.renderToString("V_x")}</span>:
        How far the vector extends along the X-axis.
      </li>
      <li>
        <span class="katex-axis-y">{@html katex.renderToString("V_y")}</span>:
        How far the vector extends along the Y-axis.
      </li>
    </ul>
    <p>
      The magnitude (length) in 2D is found using the standard Pythagorean
      theorem:
    </p>
    <FormulaAccordion summary="2D Magnitude Formula">
      <p>
        {@html katex.renderToString("\\|\\vec{V}\\| = \\sqrt{V_x^2 + V_y^2}", {
          displayMode: true,
        })}
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

  <ContentCard
    blockType="visualization-block"
    class="visualization-card"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vectors-and-components_vector-anatomy-vis"
  >
    <h2 class="content-card-title" id="vector-anatomy" data-nav-target="true">
      Anatomy of a Vector (3D)
    </h2>
    <VectorAnatomy />
    <p>
      In 3D space, a vector is still represented by an arrow. Its <strong
        >Tail</strong
      >
      marks the starting point, and the <strong>Head</strong> (tip) marks the
      ending point. The arrow's <strong>Length</strong> represents the vector's
      <strong>Magnitude</strong>
      (size, strength, or speed), and its
      <strong>Orientation</strong>
      in space indicates its <strong>Direction</strong>.
    </p>
    <p>
      Changing the arrow's start or end points alters its length and direction.
      This visual helps, but for precision, we need numbers: <Keyword
        term="components"
      />.
    </p>
  </ContentCard>

  <ContentCard
    blockType="concept-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vectors-and-components_describing-3d-vectors"
  >
    <h2
      class="content-card-title"
      id="describing-3d-vectors"
      data-nav-target="true"
    >
      Describing 3D Vectors Precisely: Components & Notation
    </h2>
    <p>
      To work with 3D vectors mathematically, we break them into <Keyword
        term="components"
      /> along the X, Y, and Z axes. These components (<span
        class="katex-axis-x">{@html katex.renderToString("V_x")}</span
      >,
      <span class="katex-axis-y">{@html katex.renderToString("V_y")}</span>,
      <span class="katex-axis-z">{@html katex.renderToString("V_z")}</span>)
      tell us how much the vector extends along each axis.
    </p>
    <FormulaAccordion>
      <p>
        To calculate the components of a 3D vector with tail at {@html katex.renderToString(
          "P_1(x_1, y_1, z_1)"
        )}
        and head at {@html katex.renderToString("P_2(x_2, y_2, z_2)")}:
      </p>
      <ul>
        <p>Change in X:</p>
        <li>
          <span class="katex-axis-x"
            >{@html katex.renderToString("V_x = x_2 - x_1 = \\Delta x")}</span
          >
        </li>
        <p>Change in Y:</p>
        <li>
          <span class="katex-axis-y"
            >{@html katex.renderToString("V_y = y_2 - y_1 = \\Delta y")}</span
          >
        </li>
        <p>Change in Z:</p>
        <li>
          <span class="katex-axis-z"
            >{@html katex.renderToString("V_z = z_2 - z_1 = \\Delta z")}</span
          >
        </li>
      </ul>
    </FormulaAccordion>
    <p>You may also encounter vectors written like this:</p>
    <ul>
      <p>Angle Bracket Notation:</p>
      <li>
        <EquationDisplay>
          {@html katex.renderToString(
            "\\vec{V} = \\langle V_x, V_y, V_z \\rangle"
          )}
        </EquationDisplay>
      </li>
      <p>Parentheses Notation:</p>
      <li>
        <EquationDisplay
          >{@html katex.renderToString("\\vec{V} = (V_x, V_y, V_z)")}
        </EquationDisplay>
      </li>
    </ul>
  </ContentCard>

  <ContentCard
    blockType="concept-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vectors-and-components_vector-magnitude-3d"
  >
    <h2 id="vector-magnitude-3d" data-nav-target="true">
      Vector Magnitude in 3D: Measuring Length
    </h2>
    <p>
      The <Keyword term="magnitude" /> (length) of a 3D vector {@html katex.renderToString(
        "\\vec{V}"
      )}
      with components
      <span class="katex-axis-x">{@html katex.renderToString("V_x")}</span>,
      <span class="katex-axis-y">{@html katex.renderToString("V_y")}</span>,
      <span class="katex-axis-z">{@html katex.renderToString("V_z")}</span> extends
      the 2D concept using the 3D Pythagorean theorem:
    </p>
    <FormulaAccordion>
      Where:
      <ul>
        <li>
          <span class="katex-axis-x"
            >{@html katex.renderToString("\\|\\vec{V}\\|")}</span
          >: Represents the
          <strong>magnitude</strong>
          (or length) of the vector {@html katex.renderToString("\\vec{V}")}.
        </li>
        <li>
          <span class="katex-axis-x">{@html katex.renderToString("V_x")}</span>:
          The component of the vector along the X-axis.
        </li>
        <li>
          <span class="katex-axis-y">{@html katex.renderToString("V_y")}</span>:
          The component of the vector along the Y-axis.
        </li>
        <li>
          <span class="katex-axis-z">{@html katex.renderToString("V_z")}</span>:
          The component of the vector along the Z-axis.
        </li>
      </ul>
      <p>
        {@html katex.renderToString(
          "\\|\\vec{V}\\| = \\sqrt{V_x^2 + V_y^2 + V_z^2}",
          { displayMode: true }
        )}
      </p>
    </FormulaAccordion>
    <p>
      This formula calculates the vector's overall length by combining its
      individual extensions along the X, Y, and Z axes. Think of it as finding
      the diagonal length of a 3D box defined by the vector's components.
    </p>
  </ContentCard>

  <ContentCard
    blockType="visualization-block"
    class="-exercise"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vectors-and-components_vector-builder-exercise"
  >
    <h2
      class="content-card-title"
      id="vector-builder-exercise"
      data-nav-target="true"
    >
      Hands-On: Vector Builder
    </h2>
    <p class="exercise-description">
      Adjust the start and end points of the vector using the controls. Observe
      how the vector's components (Vx, Vy, Vz) and its angle bracket notation
      change in real-time.
    </p>
    <VectorBuilderExercise />
  </ContentCard>

  <ContentCard
    blockType="concept-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vectors-and-components_unit-vector-notation"
  >
    <h2
      id="unit-vector-notation"
      data-nav-target="true"
      class="content-card-title"
    >
      An Alternative Language: Unit Vector Notation
    </h2>
    <p>
      Another common way to write vectors, especially in physics/engineering,
      uses <Keyword term="unit vectors" />.
    </p>
    <p>
      A <Keyword term="unit vector" /> has a magnitude of exactly 1 and indicates
      direction. The <Keyword term="standard basis vectors" /> point along the positive
      axes:
    </p>
    <ul>
      <li>
        <span class="katex-axis-x"
          >{@html katex.renderToString(
            "\\hat{\\mathbf{i}} = \\langle 1, 0, 0 \\rangle"
          )}</span
        >
        (Positive X-axis direction)
      </li>
      <li>
        <span class="katex-axis-y"
          >{@html katex.renderToString(
            "\\hat{\\mathbf{j}} = \\langle 0, 1, 0 \\rangle"
          )}</span
        >
        (Positive Y-axis direction)
      </li>
      <li>
        <span class="katex-axis-z"
          >{@html katex.renderToString(
            "\\hat{\\mathbf{k}} = \\langle 0, 0, 1 \\rangle"
          )}</span
        >
        (Positive Z-axis direction)
      </li>
    </ul>
    <p>
      (Note: Sometimes written as bold {@html katex.renderToString("i, j, k")}
      without the hat.)
    </p>
    <p>
      Unit vector {@html katex.renderToString("\\vec{V}")} can be written as a sum
      ("linear combination") of components times their corresponding unit vectors:
    </p>
    <EquationDisplay>
      {@html katex.renderToString(
        "\\vec{V} = V_x\\hat{\\mathbf{i}} + V_y\\hat{\\mathbf{j}} + V_z\\hat{\\mathbf{k}}",
        { displayMode: true }
      )}
    </EquationDisplay>
    <p>
      This clearly shows the vector's extent along each axis. <br /> Example:
      <br />
      {@html katex.renderToString("\\langle 2, -3, 5 \\rangle")} is also {@html katex.renderToString(
        "2\\hat{\\mathbf{i}} - 3\\hat{\\mathbf{j}} + 5\\hat{\\mathbf{k}}"
      )}.
    </p>
  </ContentCard>

  <ContentCard
    blockType="concept-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vectors-and-components_comparing-vector-notations"
  >
    <h2
      id="comparing-vector-notations"
      data-nav-target="true"
      class="content-card-title"
    >
      Comparing Vector Notations
    </h2>
    <h4>Notation in Different Fields</h4>
    <p>Vector representation varies by field:</p>
    <ul>
      <li>
        <strong>Physics & Engineering:</strong> Often use {@html katex.renderToString(
          "\\hat{\\mathbf{i}}, \\hat{\\mathbf{j}}, \\hat{\\mathbf{k}}"
        )}
        notation (good for forces, velocities).
      </li>
      <li>
        <strong>Computer Science & Graphics:</strong> Often use component form {@html katex.renderToString(
          "\\langle x, y, z \\rangle"
        )}
        or {@html katex.renderToString("(x, y, z)")} (good for points, directions
        in code).
      </li>
    </ul>
    <p>
      Both notations represent the same concept: a quantity with magnitude and
      direction. Familiarity with both is useful.
    </p>
  </ContentCard>

  <ContentCard
    blockType="activity-block"
    class="-review"
    layoutWidth="full"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vectors-and-components_section-review"
  >
    <h2
      class="content-card-title"
      id="vector-components-review"
      data-nav-target="true"
    >
      Section Review: Vectors and Components
    </h2>
    <SectionReview>
      <Quiz questions={vectorQuizData} showFeedback={true} />
    </SectionReview>
  </ContentCard>
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

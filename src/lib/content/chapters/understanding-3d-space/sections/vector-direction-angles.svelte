<!-- src/lib/content/chapters/understanding-3d-space/sections/vector-direction-angles.svelte -->
<script lang="ts">
  import ContentCard from "$lib/components/ContentCard.svelte";
  import Scenario from "$lib/components/Scenario.svelte";
  import Keyword from "$lib/components/Keyword.svelte";
  import EquationDisplay from "$lib/components/EquationDisplay.svelte";
  import FormulaAccordion from "$lib/components/FormulaAccordion.svelte";
  import SectionReview from "$lib/components/SectionReview.svelte";
  import Quiz from "$lib/components/Quiz.svelte";
  import katex from "katex";
  // import { newQuizData } from "$lib/content/chapters/data/quizzes/understanding-3d-space-quiz-data"; // Placeholder for new quiz data

  // Placeholder for any specific logic or imports for this section
</script>

<section id="vector-direction-angles-section" data-section="1.3">
  <ContentCard
    blockType="section-header-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vector-direction-angles_intro"
  >
    <h2
      class="content-card-title"
      id="vector-direction-intro"
      data-nav-target="true"
    >
      Section Introduction: Vector Direction and Angles
    </h2>
    <p>
      While components tell us how far a vector extends along each axis, often
      we need to describe its precise orientation in space using angles. In this
      section, we'll explore how to define a vector's direction using angles,
      introduce the concept of direction cosines in 3D, and look at unit vector
      notation as another way to represent vector direction.
    </p>
    <Scenario>
      <p data-speaker="Surya">
        <span class="speaker"><strong>Surya:</strong></span> Okay, so a vector
        has components like {@html katex.renderToString(
          "\\langle V_x, V_y, V_z \\rangle"
        )}. That tells me *how far* it goes along each axis. But what if I need
        to aim something precisely, like telling a satellite to orient itself
        towards a specific star? How do I describe that specific direction in
        space?
      </p>
      <p data-speaker="Leo">
        <span class="speaker"><strong>Leo:</strong></span> Great question!
        Components are one way, but often it's more intuitive or practical to
        describe a vector's direction using <Keyword term="angles" /> relative to
        the coordinate axes. This section will explore how we use trigonometry to
        relate a vector's magnitude and its directional angles to its components,
        and vice-versa.
      </p>
    </Scenario>
  </ContentCard>

  <ContentCard
    blockType="concept-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vector-direction-angles_2d-direction"
  >
    <h2
      class="content-card-title"
      id="vector-direction-2d"
      data-nav-target="true"
    >
      Direction in Two Dimensions (2D)
    </h2>
    <p>
      _Placeholder: Explain how direction is defined in 2D, typically with a
      single angle from a reference axis (e.g., positive x-axis). Introduce
      basic trigonometric relationships (sin, cos, tan) to find components from
      magnitude and angle, and vice-versa._
    </p>
    <FormulaAccordion summary="2D Components from Magnitude & Angle">
      <p>
        {@html katex.renderToString("V_x = |\\vec{V}| \\cos \\theta", {
          displayMode: true,
        })}
      </p>
      <p>
        {@html katex.renderToString("V_y = |\\vec{V}| \\sin \\theta", {
          displayMode: true,
        })}
      </p>
    </FormulaAccordion>
    <FormulaAccordion summary="2D Magnitude & Angle from Components">
      <p>
        {@html katex.renderToString("|\\vec{V}| = \\sqrt{V_x^2 + V_y^2}", {
          displayMode: true,
        })}
      </p>
      <p>
        {@html katex.renderToString(
          "\\theta = \\operatorname{atan2}(V_y, V_x)",
          { displayMode: true }
        )}
        (Using atan2 to get the correct quadrant)
      </p>
    </FormulaAccordion>
  </ContentCard>

  <ContentCard
    blockType="concept-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vector-direction-angles_3d-direction-cosines"
  >
    <h2
      class="content-card-title"
      id="vector-direction-3d"
      data-nav-target="true"
    >
      Direction in Three Dimensions (3D): Direction Cosines
    </h2>
    <p>
      _Placeholder: Explain how direction is defined in 3D. Introduce <Keyword
        term="direction cosines"
      /> (cos α, cos β, cos γ) and their relationship to unit vectors and components._
    </p>
    <FormulaAccordion summary="Direction Cosines">
      <p>
        {@html katex.renderToString("\\cos \\alpha = \\frac{V_x}{|\\vec{V}|}", {
          displayMode: true,
        })}
      </p>
      <p>
        {@html katex.renderToString("\\cos \\beta = \\frac{V_y}{|\\vec{V}|}", {
          displayMode: true,
        })}
      </p>
      <p>
        {@html katex.renderToString("\\cos \\gamma = \\frac{V_z}{|\\vec{V}|}", {
          displayMode: true,
        })}
      </p>
      <p>
        And the property: {@html katex.renderToString(
          "\\cos^2 \\alpha + \\cos^2 \\beta + \\cos^2 \\gamma = 1",
          { displayMode: true }
        )}
      </p>
    </FormulaAccordion>
  </ContentCard>

  <ContentCard
    blockType="concept-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vector-direction-angles_unit-vector-notation"
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
      uses <Keyword term="unit vectors" />. This notation clearly expresses a
      vector as a sum of scaled basis vectors, explicitly showing its extent
      along each coordinate axis.
    </p>
    <p>
      A <Keyword term="unit vector" /> has a magnitude of exactly 1 and indicates
      a pure direction. The <Keyword term="standard basis vectors" /> (or principal
      unit vectors) point along the positive axes:
    </p>
    <ul>
      <li>
        <span class="katex-axis-x"
          >{@html katex.renderToString(
            "\\hat{\\mathbf{i}} = \\langle 1, 0, 0 \\rangle"
          )}</span
        >
        (Points along the positive X-axis)
      </li>
      <li>
        <span class="katex-axis-y"
          >{@html katex.renderToString(
            "\\hat{\\mathbf{j}} = \\langle 0, 1, 0 \\rangle"
          )}</span
        >
        (Points along the positive Y-axis)
      </li>
      <li>
        <span class="katex-axis-z"
          >{@html katex.renderToString(
            "\\hat{\\mathbf{k}} = \\langle 0, 0, 1 \\rangle"
          )}</span
        >
        (Points along the positive Z-axis)
      </li>
    </ul>
    <p>
      (Note: Sometimes written as bold {@html katex.renderToString(
        "\\mathbf{i}, \\mathbf{j}, \\mathbf{k}"
      )}
      without the hat, or even {@html katex.renderToString(
        "\\mathbf{e}_x, \\mathbf{e}_y, \\mathbf{e}_z"
      )}).
    </p>
    <p>
      Any vector {@html katex.renderToString("\\vec{V}")} with components {@html katex.renderToString(
        "V_x, V_y, V_z"
      )} can be written as a sum (a "linear combination") of these components multiplying
      their corresponding unit vectors:
    </p>
    <EquationDisplay>
      {@html katex.renderToString(
        "\\vec{V} = V_x\\hat{\\mathbf{i}} + V_y\\hat{\\mathbf{j}} + V_z\\hat{\\mathbf{k}}",
        { displayMode: true }
      )}
    </EquationDisplay>
    <p>
      Example: The vector {@html katex.renderToString(
        "\\langle 2, -3, 5 \\rangle"
      )} can also be written as {@html katex.renderToString(
        "2\\hat{\\mathbf{i}} - 3\\hat{\\mathbf{j}} + 5\\hat{\\mathbf{k}}"
      )}.
    </p>
  </ContentCard>

  <ContentCard
    blockType="concept-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vector-direction-angles_comparing-vector-notations"
  >
    <h2
      id="comparing-vector-notations"
      data-nav-target="true"
      class="content-card-title"
    >
      Comparing Vector Notations
    </h2>
    <p>
      We've now seen several ways to represent a vector {@html katex.renderToString(
        "\\vec{V}"
      )}:
    </p>
    <ul>
      <li>
        <strong>Component Form (Angle Brackets):</strong>
        {@html katex.renderToString("\\langle V_x, V_y, V_z \\rangle")}
      </li>
      <li>
        <strong>Component Form (Parentheses):</strong>
        {@html katex.renderToString("(V_x, V_y, V_z)")}
      </li>
      <li>
        <strong>Unit Vector Notation:</strong>
        {@html katex.renderToString(
          "V_x\\hat{\\mathbf{i}} + V_y\\hat{\\mathbf{j}} + V_z\\hat{\\mathbf{k}}"
        )}
      </li>
    </ul>
    <h4>Notation in Different Fields</h4>
    <p>The preferred notation often varies by discipline:</p>
    <ul>
      <li>
        <strong>Physics & Engineering:</strong> Frequently use the {@html katex.renderToString(
          "\\hat{\\mathbf{i}}, \\hat{\\mathbf{j}}, \\hat{\\mathbf{k}}"
        )}
        notation, as it's very clear for expressing forces, velocities, fields, etc.,
        as sums of axial contributions.
      </li>
      <li>
        <strong>Computer Science & Graphics:</strong> More commonly use the
        component form {@html katex.renderToString(
          "\\langle V_x, V_y, V_z \\rangle"
        )}
        or {@html katex.renderToString("(V_x, V_y, V_z)")}, as this maps
        directly to array or object structures in code.
      </li>
      <li>
        <strong>Mathematics:</strong> May use any of these, often preferring column
        vectors for matrix operations (which we'll see later).
      </li>
    </ul>
    <p>
      All these notations describe the exact same vector—a quantity with both
      magnitude and direction. Being comfortable converting between them and
      understanding their contexts is key.
    </p>
  </ContentCard>

  <ContentCard
    blockType="visualization-block"
    class="-exercise -placeholder"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vector-direction-angles_angle-explorer-vis"
  >
    <h2
      class="content-card-title"
      id="vector-angle-explorer"
      data-nav-target="true"
    >
      Interactive: Vector Angle Explorer (Placeholder)
    </h2>
    <p class="exercise-description">
      _Placeholder: This visualization will allow users to manipulate a vector
      and see its components, magnitude, and direction angles (α, β, γ for 3D, θ
      for 2D) update in real-time. It will demonstrate the trigonometric
      relationships._
    </p>
    <div
      style="height: 300px; border: 1px dashed var(--color-border); display:flex; align-items:center; justify-content:center; background-color: var(--color-surface-200);"
    >
      <p style="color: var(--color-text-secondary);">
        [Future Visualization: Vector Angle Explorer]
      </p>
    </div>
  </ContentCard>

  <ContentCard
    blockType="concept-block"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vector-direction-angles_unit-vectors-revisited"
  >
    <h2
      class="content-card-title"
      id="unit-vectors-direction"
      data-nav-target="true"
    >
      Unit Vectors and Direction
    </h2>
    <p>
      _Placeholder: Revisit unit vectors (i, j, k and general form) and
      explicitly show how they relate to direction cosines. Explain how a unit
      vector purely defines direction._
    </p>
    <EquationDisplay>
      {@html katex.renderToString(
        "\\hat{\\mathbf{v}} = \\frac{\\vec{V}}{|\\vec{V}|} = \\langle \\cos \\alpha, \\cos \\beta, \\cos \\gamma \\rangle",
        { displayMode: true }
      )}
    </EquationDisplay>
  </ContentCard>

  <ContentCard
    blockType="activity-block"
    class="-review"
    layoutWidth="full"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_vector-direction-angles_section-review"
  >
    <h2
      class="content-card-title"
      id="vector-direction-review"
      data-nav-target="true"
    >
      Section Review: Vector Direction and Angles
    </h2>
    <p>
      _Placeholder: Summarize key concepts: using angles for 2D/3D vector
      direction, trigonometric relationships between components, magnitude, and
      angles (direction cosines). Importance for practical applications._
    </p>
    <SectionReview>
      <!-- <Quiz questions={newQuizData} showFeedback={true} /> -->
      <p>_Placeholder: Quiz for this section will be added later._</p>
    </SectionReview>
  </ContentCard>
</section>

<style lang="scss">
  /* Styles specific to this section can be added here */
  /* For example, if h3/h4 need different spacing ONLY here */

  .visualization-card.-placeholder {
    /* Styles for placeholder visualization */
    background-color: var(--color-surface-100);
    border: 2px dashed var(--color-border-secondary);
    padding: var(--space-l);
    text-align: center;
  }
</style>

<script lang="ts">
  import { currentSection } from "$lib/stores/appState.js";
  import { intersect, type IntersectDetail } from "$lib/utils/intersection";
  import SectionReview from "$lib/components/SectionReview.svelte";
  import Quiz from "$lib/components/Quiz.svelte";
  import Scenario from "$lib/components/Scenario.svelte";
  import extractKeywords from "$lib/utils/keywordExtractor.js";
  // import Katex from "svelte-katex"; // Remove component import
  import Keyword from "$lib/components/Keyword.svelte";
  import ContentCard from "$lib/components/ContentCard.svelte";
  import { vectorOpsQuizData } from "$lib/content/chapters/data/quizzes/vector-operations-quiz"; // TODO: Adjust quiz data if needed
  import katex from "katex"; // Import katex directly

  // Determine the section number (Placeholder - will be set in chapter data)
  const sectionNumber = "1.3";

  // Handle section intersection for navigation
  function handleSectionIntersect(detail: {
    isIntersecting: boolean;
    intersectionRatio: number;
  }) {
    if (detail.isIntersecting && detail.intersectionRatio > 0.3) {
      currentSection.set("basic-vector-operations"); // Update slug
    }
  }
</script>

<section
  id="basic-vector-operations"
  data-section={sectionNumber}
  use:intersect={{
    threshold: [0.1, 0.3, 0.5],
    onIntersect: handleSectionIntersect,
  }}
>
  <div class="section-line" aria-hidden="true"></div>
  <div class="readable-content">
    <ContentCard blockType="section-header-block">
      <h2
        id="section-introduction-basic-ops"
        data-nav-target="true"
        aria-label="Section Introduction: Basic Vector Operations"
      >
        Section Introduction: Basic Vector Operations
      </h2>
      <p>
        Vectors, representing quantities like displacement, velocity, and force,
        often need to be combined or scaled to analyze physical situations. How
        do we find the total displacement after several moves? How does applying
        a force relate to the resulting acceleration? This section introduces
        the fundamental arithmetic operations for vectors: addition,
        subtraction, and multiplication by a scalar. We'll explore both
        graphical methods (head-to-tail) and component-based calculations.
      </p>
      <Scenario>
        <p data-speaker="Surya">
          <span class="speaker"><strong>Surya:</strong></span> So, vectors
          describe things like movement {@html katex.renderToString("\\vec{v}")}
          or pushes {@html katex.renderToString("\\vec{F}")}. But what if I move
          one way, then another? Or what if a force makes something speed up?
          How do we calculate that?
        </p>
        <p data-speaker="Leo">
          <span class="speaker"><strong>Leo:</strong></span> Exactly! That's where
          basic vector operations come in. They provide the tools to combine vectors,
          like adding displacements, or scale them, like relating force to acceleration
          using mass. Let's start with adding and subtracting.
        </p>
      </Scenario>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2
        id="vector-addition-and-subtraction"
        data-nav-target="true"
        aria-label="Vector Addition and Subtraction"
      >
        Vector Addition and Subtraction
      </h2>
      <p>
        These operations help us find the net effect of combining vectors or the
        difference between two vector states.
      </p>

      <h4>Addition</h4>
      <h5>Concept</h5>
      <p>
        Graphically, we combine vectors by placing them head-to-tail. The
        resulting vector (the "sum" or "resultant") goes from the tail of the
        first vector to the head of the last vector.
      </p>
      <p>
        Numerically, we add the corresponding components of the vectors:

        {@html katex.renderToString("\\vec{A} + \\vec{B} = \\langle ")}
        <span class="katex-axis-x"
          >{@html katex.renderToString("A_x + B_x")}</span
        >
        {@html katex.renderToString(", ")}
        <span class="katex-axis-y"
          >{@html katex.renderToString("A_y + B_y")}</span
        >
        {@html katex.renderToString(", ")}
        <span class="katex-axis-z"
          >{@html katex.renderToString("A_z + B_z")}</span
        >
        {@html katex.renderToString(" \\rangle")}
      </p>
      <h5>Use Cases</h5>
      <ul>
        <li>
          Finding the <Keyword term="resultant displacement" /> after multiple movements.
        </li>
        <li>
          Calculating the <Keyword term="net force" /> when multiple forces act on
          an object.
        </li>
        <li>
          Determining <Keyword term="relative velocity" /> (e.g., the velocity of
          an object relative to a moving observer).
        </li>
      </ul>

      <h4>Subtraction</h4>
      <h5>Concept</h5>
      <p>
        Subtracting a vector {@html katex.renderToString("\\vec{B}")} from {@html katex.renderToString(
          "\\vec{A}"
        )}
        is the same as adding the negative of {@html katex.renderToString(
          "\\vec{B}"
        )} (a vector with the same magnitude but opposite direction).
      </p>
      <p>
        Numerically, we subtract the corresponding components:

        {@html katex.renderToString("\\vec{A} - \\vec{B} = \\langle ")}
        <span class="katex-axis-x"
          >{@html katex.renderToString("A_x - B_x")}</span
        >
        {@html katex.renderToString(", ")}
        <span class="katex-axis-y"
          >{@html katex.renderToString("A_y - B_y")}</span
        >
        {@html katex.renderToString(", ")}
        <span class="katex-axis-z"
          >{@html katex.renderToString("A_z - B_z")}</span
        >
        {@html katex.renderToString(" \\rangle")}
      </p>
      <p>
        Graphically, subtraction {@html katex.renderToString(
          "\\vec{A} - \\vec{B}"
        )} is often visualized by placing the vectors tail-to-tail. The resultant
        vector points from the head of {@html katex.renderToString("\\vec{B}")} to
        the head of {@html katex.renderToString("\\vec{A}")}. This shows the
        change needed to get from {@html katex.renderToString("\\vec{B}")} to
        {@html katex.renderToString("\\vec{A}")} (since {@html katex.renderToString(
          "\\vec{B} + (\\vec{A} - \\vec{B}) = \\vec{A}"
        )}).
      </p>
      <h5>Use Cases</h5>
      <ul>
        <li>
          Finding the change in velocity (<Keyword term="acceleration" /> is related
          to this): {@html katex.renderToString(
            "\\Delta\\vec{v} = \\vec{v}_f - \\vec{v}_i"
          )}.
        </li>
        <li>Determining relative position vectors.</li>
      </ul>
    </ContentCard>

    <ContentCard
      blockType="visualization-block"
      class="visualization-card -placeholder"
    >
      <h2
        id="visualizing-addition-subtraction"
        data-nav-target="true"
        aria-label="Visualizing Addition & Subtraction"
      >
        Visualizing Addition & Subtraction
      </h2>
      <p>
        <em
          >(Interactive visualization demonstrating vector head-to-tail addition
          and tail-to-tail subtraction will be added here.)</em
        >
      </p>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2
        id="scalar-multiplication"
        data-nav-target="true"
        aria-label="Scalar Multiplication"
      >
        Scalar Multiplication
      </h2>
      <p>
        This operation scales a vector, changing its magnitude and potentially
        reversing its direction.
      </p>
      <h4>Concept</h4>
      <p>
        Multiplying a vector {@html katex.renderToString("\\vec{A}")} by a scalar
        (a regular number)
        {@html katex.renderToString("c")} multiplies each component by {@html katex.renderToString(
          "c"
        )}:

        {@html katex.renderToString("c\\vec{A} = \\langle ")}
        <span class="katex-axis-x">{@html katex.renderToString("cA_x")}</span>
        {@html katex.renderToString(", ")}
        <span class="katex-axis-y">{@html katex.renderToString("cA_y")}</span>
        {@html katex.renderToString(", ")}
        <span class="katex-axis-z">{@html katex.renderToString("cA_z")}</span>
        {@html katex.renderToString(" \\rangle")}
      </p>
      <ul>
        <li>
          If {@html katex.renderToString("c > 0")}, the vector's magnitude is
          scaled by {@html katex.renderToString("c")}, and its direction remains
          the same.
        </li>
        <li>
          If {@html katex.renderToString("c < 0")}, the vector's magnitude is
          scaled by {@html katex.renderToString("\\|c\\|")}, and its direction
          is reversed (flipped 180°).
        </li>
        <li>
          If {@html katex.renderToString("c = 0")}, the result is the zero
          vector {@html katex.renderToString("\\langle 0, 0, 0 \\rangle")}.
        </li>
      </ul>
      <h4>Utility</h4>
      <ul>
        <li>
          Relating <Keyword term="force" /> and <Keyword term="acceleration" /> via
          mass ({@html katex.renderToString("\\vec{F} = m\\vec{a}")}).
        </li>
        <li>
          Relating <Keyword term="velocity" /> and <Keyword term="momentum" /> via
          mass ({@html katex.renderToString("\\vec{p} = m\\vec{v}")}).
        </li>
        <li>
          Creating <Keyword term="unit vectors" />: A unit vector {@html katex.renderToString(
            "\\hat{u}"
          )}
          in the same direction as {@html katex.renderToString("\\vec{u}")} is found
          by {@html katex.renderToString(
            "\\hat{u} = \\frac{1}{\\|\\vec{u}\\|}\\vec{u}"
          )}. This involves scalar multiplication by {@html katex.renderToString(
            "1/\\|\\vec{u}\\|"
          )}.
        </li>
      </ul>
    </ContentCard>

    <ContentCard
      blockType="visualization-block"
      class="visualization-card -placeholder"
    >
      <h2
        id="visualizing-scalar-multiplication"
        data-nav-target="true"
        aria-label="Visualizing Scalar Multiplication"
      >
        Visualizing Scalar Multiplication
      </h2>
      <p>
        <em
          >(Interactive visualization showing how scalars change vector
          magnitude and direction will be added here.)</em
        >
      </p>
    </ContentCard>

    <ContentCard blockType="conclusion-block">
      <h2
        id="basic-ops-conclusion"
        data-nav-target="true"
        aria-label="Section Conclusion: Basic Operations"
      >
        Section Conclusion: Basic Operations
      </h2>
      <p>
        You've now learned the fundamental arithmetic for vectors: adding them
        to find a resultant, subtracting them to find a difference (like change
        in velocity), and scaling them using scalar multiplication to relate
        quantities like force and acceleration or to create unit vectors.
        Mastering these component-wise calculations and understanding the
        head-to-tail (addition) and scaling effects is crucial for applying
        vectors in physics.
      </p>
      <p>
        These operations form the building blocks for analyzing motion, forces,
        and many other physical concepts explored in later chapters.
      </p>
    </ContentCard>

    <!-- Added Section Review and Quiz -->
    <ContentCard blockType="activity-block" class="-review">
      <h2
        id="basic-ops-review"
        data-nav-target="true"
        aria-label="Section Review"
      >
        Section Review
      </h2>
      <SectionReview>
        <!-- TODO: May need to adjust or split quiz data -->
        <Quiz questions={vectorOpsQuizData} />
      </SectionReview>
    </ContentCard>
  </div>
</section>

<style lang="scss">
  /* Remove styles handled by global/template */
  /* Keep styles truly specific to this section if any */
</style>

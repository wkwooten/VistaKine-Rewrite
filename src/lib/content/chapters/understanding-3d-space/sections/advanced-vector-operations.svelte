<script lang="ts">
  import { currentSection } from "$lib/stores/appState.ts";
  import SectionReview from "$lib/components/SectionReview.svelte";
  import Quiz from "$lib/components/Quiz.svelte";
  import Scenario from "$lib/components/Scenario.svelte";
  import extractKeywords from "$lib/utils/keywordExtractor.js";
  import Katex from "svelte-katex";
  import Keyword from "$lib/components/Keyword.svelte";
  import ContentCard from "$lib/components/ContentCard.svelte";
  // TODO: Determine if a separate quiz is needed or if vectorOpsQuizData can be filtered/reused
  // import { advancedVectorProductsQuizData } from "$lib/content/chapters/data/quizzes/advanced-vector-products-quiz";

  // Determine the section number (Placeholder - will be set in chapter data)
  const sectionNumber = "1.4"; // Example number
</script>

<section id="advanced-vector-operations" data-section={sectionNumber}>
  <ContentCard blockType="section-header-block">
    <h2
      id="section-introduction-advanced-products"
      data-nav-target="true"
      aria-label="Section Introduction: Advanced Vector Products"
    >
      Section Introduction: Advanced Vector Operations
    </h2>
    <p>
      Beyond basic addition, subtraction, and scaling, there are two powerful
      ways to "multiply" vectors that yield physically meaningful results: the
      Dot Product and the Cross Product. These operations don't behave like
      standard multiplication but instead reveal relationships between vectors,
      such as alignment or perpendicularity, which are crucial for understanding
      concepts like work, torque, and magnetic forces. This section introduces
      these two advanced vector products.
    </p>
    <Scenario>
      <p data-speaker="Surya">
        <span class="speaker"><strong>Surya:</strong></span> We've added,
        subtracted, and scaled vectors. Is there a way to multiply them? Like,
        what's <Katex>{"\\vec{A} \\times \\vec{B}"}</Katex>?
      </p>
      <p data-speaker="Leo">
        <span class="speaker"><strong>Leo:</strong></span> Good question! Vector
        multiplication isn't quite like number multiplication. We have two special
        types: the Dot Product, which gives a scalar (a number) measuring how much
        vectors align, and the Cross Product, which gives a *new vector* perpendicular
        to the original two, related to rotation and area. They're essential tools
        for more advanced physics!
      </p>
    </Scenario>
    <p>This sets the stage for more complex vector manipulations.</p>
  </ContentCard>

  <ContentCard blockType="concept-block">
    <h2
      id="dot-product"
      data-nav-target="true"
      aria-label="Dot Product (Scalar Product)"
    >
      Dot Product (Scalar Product)
    </h2>
    <p>
      The dot product combines two vectors to produce a single scalar value. It
      relates to how much one vector points along the direction of another.
    </p>
    <h4>Concept</h4>
    <p>
      The dot product of vectors <Katex>{"\\vec{A}"}</Katex> and <Katex
        >{"\\vec{B}"}</Katex
      > is defined in two ways:
    </p>
    <ol>
      <li>
        Geometrically: <Katex
          >{"\\vec{A} \\cdot \\vec{B} = \\|\\vec{A}\\| \\|\\vec{B}\\| \\cos \\theta"}</Katex
        >, where <Katex>{"\\theta"}</Katex> is the angle between the vectors when
        placed tail-to-tail (<Katex>{"0 \\le \\theta \\le 180^\\circ"}</Katex>).
      </li>
      <li>
        Algebraically (using components): <Katex
          >{"\\vec{A} \\cdot \\vec{B} = \\color{red}{A_x B_x} + \\color{green}{A_y B_y} + \\color{blue}{A_z B_z}"}</Katex
        >.
      </li>
    </ol>
    <p>Key properties:</p>
    <ul>
      <li>
        If the vectors are perpendicular (<Katex>{"\\theta = 90^\\circ"}</Katex
        >), <Katex>{"\\cos 90^\\circ = 0"}</Katex>, so their dot product is 0.
      </li>
      <li>
        If the vectors are parallel (<Katex>{"\\theta = 0^\\circ"}</Katex>), <Katex
          >{"\\cos 0^\\circ = 1"}</Katex
        >, the dot product is the product of their magnitudes: <Katex
          >{"\\|\\vec{A}\\| \\|\\vec{B}\\|"}</Katex
        >.
      </li>
      <li>
        If they point in opposite directions (<Katex
          >{"\\theta = 180^\\circ"}</Katex
        >), <Katex>{"\\cos 180^\\circ = -1"}</Katex>, the dot product is <Katex
          >{"-\\|\\vec{A}\\| \\|\\vec{B}\\|"}</Katex
        >.
      </li>
      <li>
        The dot product is commutative: <Katex
          >{"\\vec{A} \\cdot \\vec{B} = \\vec{B} \\cdot \\vec{A}"}</Katex
        >.
      </li>
    </ul>
    <h4>Utility</h4>
    <p>
      The dot product is a crucial tool in physics for understanding
      relationships between vector quantities. We will explore its specific
      applications in later chapters, but its core uses include:
    </p>
    <ul>
      <li>
        Quantifying <Keyword term="Work" /> done by a force acting over a displacement.
      </li>
      <li>
        Determining the <Keyword term="projection" /> (or component) of one vector
        onto another.
      </li>
    </ul>
    <p>
      While it can also be used to find the angle between vectors, we are
      focusing on the fundamental definition here. Mastering the dot product
      concept now will be essential when we delve into energy and other advanced
      topics where these applications are vital.
    </p>
  </ContentCard>

  <ContentCard
    blockType="visualization-block"
    class="visualization-card -placeholder"
  >
    <h2
      id="visualizing-dot-product"
      data-nav-target="true"
      aria-label="Visualizing the Dot Product"
    >
      Visualizing the Dot Product
    </h2>
    <p>
      <em
        >(Optional visualization illustrating the geometric meaning of the dot
        product, perhaps showing projections, might be added here.)</em
      >
    </p>
  </ContentCard>

  <ContentCard blockType="concept-block">
    <h2
      id="cross-product"
      data-nav-target="true"
      aria-label="Cross Product (Vector Product)"
    >
      Cross Product (Vector Product)
    </h2>
    <p>
      The cross product combines two vectors in 3D space to produce a new
      *vector* that is perpendicular to both original vectors. This operation is
      inherently three-dimensional.
    </p>
    <h4>Concept</h4>
    <p>
      The cross product of <Katex>{"\\vec{A}"}</Katex> and <Katex
        >{"\\vec{B}"}</Katex
      >, denoted <Katex>{"\\vec{A} \\times \\vec{B}"}</Katex>, results in a
      vector <Katex>{"\\vec{C}"}</Katex>.
    </p>
    <ul>
      <li>
        <strong>Magnitude:</strong> The magnitude of the resulting vector is <Katex
          >{"\\|\\vec{A} \\times \\vec{B}\\| = \\|\\vec{A}\\| \\|\\vec{B}\\| \\sin \\theta"}</Katex
        >, where <Katex>{"\\theta"}</Katex> is the angle between <Katex
          >{"\\vec{A}"}</Katex
        > and <Katex>{"\\vec{B}"}</Katex> (<Katex
          >{"0 \\le \\theta \\le 180^\\circ"}</Katex
        >). This magnitude is equal to the area of the parallelogram formed by <Katex
          >{"\\vec{A}"}</Katex
        > and <Katex>{"\\vec{B}"}</Katex>.
      </li>
      <li>
        <strong>Direction:</strong> The direction of <Katex
          >{"\\vec{C} = \\vec{A} \\times \\vec{B}"}</Katex
        > is perpendicular to the plane containing <Katex>{"\\vec{A}"}</Katex>
        and <Katex>{"\\vec{B}"}</Katex>, determined by the <Keyword
          term="Right-Hand Rule"
        />. (Point fingers of right hand along <Katex>{"\\vec{A}"}</Katex>, curl
        towards <Katex>{"\\vec{B}"}</Katex>; thumb points in direction of <Katex
          >{"\\vec{A} \\times \\vec{B}"}</Katex
        >).
      </li>
    </ul>
    <p>Key properties:</p>
    <ul>
      <li>
        The cross product is zero if the vectors are parallel or anti-parallel (<Katex
          >{"\\sin 0^\\circ = \\sin 180^\\circ = 0"}</Katex
        >).
      </li>
      <li>
        The cross product is anti-commutative: <Katex
          >{"\\vec{A} \\times \\vec{B} = -(\\vec{B} \\times \\vec{A})"}</Katex
        >. Switching the order reverses the direction of the resulting vector.
      </li>
      <li>
        The component calculation is more complex and involves determinants. We
        will introduce the full component formula when its specific applications
        arise in later chapters.
      </li>
    </ul>
    <h4>Utility</h4>
    <p>
      The cross product is fundamental in physics for describing rotational
      effects and phenomena involving perpendicularity. We will use it
      extensively when studying:
    </p>
    <ul>
      <li><Keyword term="Torque" /> (the rotational equivalent of force).</li>
      <li>
        <Keyword term="Angular Momentum" /> (the rotational equivalent of linear
        momentum).
      </li>
      <li>Magnetic forces acting on moving charges.</li>
    </ul>
    <p>
      Understanding the magnitude (area of parallelogram) and direction
      (Right-Hand Rule) conceptually is the main goal for this section. This
      foundation will be crucial for tackling rotational dynamics and
      electromagnetism later.
    </p>
  </ContentCard>

  <ContentCard
    blockType="visualization-block"
    class="visualization-card -placeholder"
  >
    <h2
      id="visualizing-cross-product"
      data-nav-target="true"
      aria-label="Visualizing the Cross Product"
    >
      Visualizing the Cross Product
    </h2>
    <p>
      <em
        >(Optional visualization demonstrating the Right-Hand Rule and the
        resulting perpendicular vector might be added here.)</em
      >
    </p>
  </ContentCard>

  <ContentCard blockType="conclusion-block">
    <h2
      id="advanced-products-conclusion"
      data-nav-target="true"
      aria-label="Section Conclusion: Advanced Products"
    >
      Section Conclusion: Advanced Products
    </h2>
    <p>
      This section introduced the Dot Product and Cross Product, two essential
      forms of vector multiplication used throughout physics. The Dot Product
      (yielding a scalar) helps quantify the alignment between vectors and is
      key to understanding concepts like Work. The Cross Product (yielding a
      perpendicular vector) is fundamental to rotational motion (Torque, Angular
      Momentum) and magnetism, capturing the idea of perpendicular interaction
      and orientation in 3D space.
    </p>
    <p>
      While we focused on the definitions and geometric interpretations here,
      remember their properties (commutativity for dot, anti-commutativity for
      cross, conditions for zero results) and the Right-Hand Rule for the cross
      product's direction. These concepts will be applied frequently in later
      chapters.
    </p>
  </ContentCard>

  <!-- TODO: Add Section Review / Quiz for advanced products -->
  <!-- <ContentCard blockType="activity-block" class="-review">
    <h2 id="advanced-products-review" data-nav-target="true" aria-label="Section Review">
      Section Review
    </h2>
    <SectionReview>
      <Quiz questions={advancedVectorProductsQuizData} />
    </SectionReview>
  </ContentCard> -->
</section>

<style lang="scss">
  /* Keep styles truly specific to this section if any */
</style>

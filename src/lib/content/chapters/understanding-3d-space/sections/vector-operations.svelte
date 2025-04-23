<script lang="ts">
  import { currentSection } from '$lib/stores/appState.js';
  import { intersect } from '$lib/utils/intersection';
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';
  import extractKeywords from '$lib/utils/keywordExtractor.js';
  import Katex from 'svelte-katex';
  import Keyword from '$lib/components/Keyword.svelte';
</script>

<article>
  <div class="section-intro">
    <h3>Introduction: Why Operate on Vectors?</h3>
    <p>
      Vectors often need to be combined or manipulated to understand physical situations. For example, how do multiple forces acting on an object combine? Or how do we describe a change in velocity? This section introduces the fundamental operations used to work with vectors. We'll look at both the visual intuition (graphical methods) and the precise calculations using components.
    </p>
    <!-- Scenario kept, content can be adjusted later if needed -->
    <Scenario>
      <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> Okay, vectors describe movement like <Katex>{"\\vec{v}"}</Katex> or forces like <Katex>{"\\vec{F}"}</Katex>. But what if there are *multiple* forces, or something changes speed *and* direction?</p>
      <p data-speaker="Leo"><span class="speaker"><strong>Leo:</strong></span> Great question! That's exactly why we need vector operations. They give us the mathematical tools to combine vectors (like adding forces) or scale them (like relating force to acceleration).</p>
    </Scenario>
  </div>

  <div class="section-core">
    <h3>Vector Addition and Subtraction</h3>
    <p>These operations help us find the net effect of combining vectors or the difference between two vector states.</p>

    <h4>Addition</h4>
    <h5>Concept</h5>
    <p>
      Graphically, we combine vectors by placing them head-to-tail. The resulting vector (the "sum" or "resultant") goes from the tail of the first vector to the head of the last vector.
    </p>
    <p>
       Numerically, we add the corresponding components of the vectors:
       <Katex displayMode>
         {"\\vec{A} + \\vec{B} = \\langle A_x + B_x, A_y + B_y, A_z + B_z \\rangle"}
       </Katex>
    </p>
    <h5>Utility</h5>
     <ul>
       <li>Finding the <Keyword term="resultant displacement" /> after multiple movements.</li>
       <li>Calculating the <Keyword term="net force" /> when multiple forces act on an object.</li>
       <li>Determining <Keyword term="relative velocity" /> (e.g., the velocity of an object relative to a moving observer).</li>
     </ul>

    <h4>Subtraction</h4>
    <h5>Concept</h5>
     <p>
       Subtracting a vector <Katex>{"\\vec{B}"}</Katex> from <Katex>{"\\vec{A}"}</Katex> is the same as adding the negative of <Katex>{"\\vec{B}"}</Katex> (a vector with the same magnitude but opposite direction).
     </p>
    <p>
      Numerically, we subtract the corresponding components:
      <Katex displayMode>
        {"\\vec{A} - \\vec{B} = \\langle A_x - B_x, A_y - B_y, A_z - B_z \\rangle"}
      </Katex>
    </p>
     <p>
       Graphically, subtraction <Katex>{"\\vec{A} - \\vec{B}"}</Katex> is often visualized by placing the vectors tail-to-tail. The resultant vector points from the head of <Katex>{"\\vec{B}"}</Katex> to the head of <Katex>{"\\vec{A}"}</Katex>. This shows the change needed to get from <Katex>{"\\vec{B}"}</Katex> to <Katex>{"\\vec{A}"}</Katex> (since <Katex>{"\\vec{B} + (\\vec{A} - \\vec{B}) = \\vec{A}"}</Katex>).
     </p>
    <h5>Utility</h5>
    <ul>
      <li>Finding the change in velocity (<Keyword term="acceleration" /> is related to this): <Katex>{"\\Delta\\vec{v} = \\vec{v}_f - \\vec{v}_i"}</Katex>.</li>
      <li>Determining relative position vectors.</li>
    </ul>

    <!-- Placeholder for Addition/Subtraction Visualization -->
    <!--
      <VectorOperationVisualization type="addition-subtraction">
        Allows users to define two vectors A and B.
        Visualizes A, B (head-to-tail for sum), and Resultant A+B.
        Shows component calculations.
        Toggle to visualize A-B (tail-to-tail or adding -B).
      </VectorOperationVisualization>
    -->
     <p><em>(Interactive visualization for vector addition/subtraction will be added here.)</em></p>


    <h3>Scalar Multiplication</h3>
    <p>This operation scales a vector, changing its magnitude and potentially reversing its direction.</p>
    <h4>Concept</h4>
    <p>
      Multiplying a vector <Katex>{"\\vec{A}"}</Katex> by a scalar (a regular number) <Katex>c</Katex> multiplies each component by <Katex>c</Katex>:
      <Katex displayMode>
        {"c\\vec{A} = \\langle cA_x, cA_y, cA_z \\rangle"}
      </Katex>
    </p>
    <ul>
       <li>If <Katex>{"c > 0"}</Katex>, the vector's magnitude is scaled by <Katex>c</Katex>, and its direction remains the same.</li>
       <li>If <Katex>{"c < 0"}</Katex>, the vector's magnitude is scaled by <Katex>{"|c|"}</Katex>, and its direction is reversed (flipped 180°).</li>
       <li>If <Katex>{"c = 0"}</Katex>, the result is the zero vector <Katex>{"\\langle 0, 0, 0 \\rangle"}</Katex>.</li>
    </ul>
    <h4>Utility</h4>
    <ul>
       <li>Relating <Keyword term="force" /> and <Keyword term="acceleration" /> via mass (<Katex>{"\\vec{F} = m\\vec{a}"}</Katex>).</li>
       <li>Relating <Keyword term="velocity" /> and <Keyword term="momentum" /> via mass (<Katex>{"\\vec{p} = m\\vec{v}"}</Katex>).</li>
       <li>Creating <Keyword term="unit vectors" />: A unit vector <Katex>{"\\hat{u}"}</Katex> in the same direction as <Katex>{"\\vec{u}"}</Katex> is found by <Katex>{"\\hat{u} = \\frac{1}{\\|\\vec{u}\\|}\\vec{u}"}</Katex>. This involves scalar multiplication by <Katex>{"1/\\|\\vec{u}\\|"}</Katex>.</li>
    </ul>

    <!-- Placeholder for Scalar Multiplication Visualization -->
    <!--
      <VectorOperationVisualization type="scalar-multiplication">
        Shows a base vector A.
        Slider/input for scalar c.
        Visualizes c*A, showing scaling and direction flip.
        Displays component calculation.
      </VectorOperationVisualization>
    -->
     <p><em>(Interactive visualization for scalar multiplication will be added here.)</em></p>


    <h3>Dot Product (Scalar Product)</h3>
    <p>The dot product combines two vectors to produce a single scalar value. It relates to how much one vector points along the direction of another.</p>
    <h4>Concept</h4>
    <p>
      The dot product of vectors <Katex>{"\\vec{A}"}</Katex> and <Katex>{"\\vec{B}"}</Katex> is defined in two ways:
    </p>
    <ol>
       <li>Geometrically: <Katex>{"\\vec{A} \\cdot \\vec{B} = \\|\\vec{A}\\| \\|\\vec{B}\\| \\cos \\theta"}</Katex>, where <Katex>{"\\theta"}</Katex> is the angle between the vectors when placed tail-to-tail (<Katex>{"0 \\le \\theta \\le 180^\\circ"}</Katex>).</li>
       <li>Algebraically (using components): <Katex>{"\\vec{A} \\cdot \\vec{B} = A_x B_x + A_y B_y + A_z B_z"}</Katex>.</li>
    </ol>
     <p>Key properties:</p>
     <ul>
       <li>If the vectors are perpendicular (<Katex>{"\\theta = 90^\\circ"}</Katex>), <Katex>{"\\cos 90^\\circ = 0"}</Katex>, so their dot product is 0.</li>
       <li>If the vectors are parallel (<Katex>{"\\theta = 0^\\circ"}</Katex>), <Katex>{"\\cos 0^\\circ = 1"}</Katex>, the dot product is the product of their magnitudes: <Katex>{"\\|\\vec{A}\\| \\|\\vec{B}\\|"}</Katex>.</li>
       <li>If they point in opposite directions (<Katex>{"\\theta = 180^\\circ"}</Katex>), <Katex>{"\\cos 180^\\circ = -1"}</Katex>, the dot product is <Katex>{"-\\|\\vec{A}\\| \\|\\vec{B}\\|"}</Katex>.</li>
       <li>The dot product is commutative: <Katex>{"\\vec{A} \\cdot \\vec{B} = \\vec{B} \\cdot \\vec{A}"}</Katex>.</li>
     </ul>
    <h4>Utility</h4>
    <p>Brief examples of where the dot product is used:</p>
    <ul>
       <li>Calculating <Keyword term="Work" /> done by a constant force: <Katex>{"W = \\vec{F} \\cdot \\vec{d}"}</Katex>.</li>
       <li>Finding the angle between two vectors: <Katex>{"\\theta = \\arccos\\left(\\frac{\\vec{A} \\cdot \\vec{B}}{\\|\\vec{A}\\| \\|\\vec{B}\\|}\\right)"}</Katex>.</li>
       <li>Determining the <Keyword term="projection" /> of one vector onto another (finding the component of one vector along the direction of another).</li>
    </ul>

    <!-- Placeholder for Dot Product Visualization -->
     <p><em>(Optional visualization for the dot product concept might be added here.)</em></p>


    <h3>Cross Product (Vector Product)</h3>
    <p>The cross product combines two vectors in 3D space to produce a new *vector* that is perpendicular to both original vectors. This operation is inherently three-dimensional.</p>
    <h4>Concept</h4>
     <p>
       The cross product of <Katex>{"\\vec{A}"}</Katex> and <Katex>{"\\vec{B}"}</Katex>, denoted <Katex>{"\\vec{A} \\times \\vec{B}"}</Katex>, results in a vector <Katex>{"\\vec{C}"}</Katex>.
     </p>
     <ul>
       <li><strong>Magnitude:</strong> The magnitude of the resulting vector is <Katex>{"\\|\\vec{A} \\times \\vec{B}\\| = \\|\\vec{A}\\| \\|\\vec{B}\\| \\sin \\theta"}</Katex>, where <Katex>{"\\theta"}</Katex> is the angle between <Katex>{"\\vec{A}"}</Katex> and <Katex>{"\\vec{B}"}</Katex> (<Katex>{"0 \\le \\theta \\le 180^\\circ"}</Katex>). This magnitude is equal to the area of the parallelogram formed by <Katex>{"\\vec{A}"}</Katex> and <Katex>{"\\vec{B}"}</Katex>.</li>
       <li><strong>Direction:</strong> The direction of <Katex>{"\\vec{C} = \\vec{A} \\times \\vec{B}"}</Katex> is perpendicular to the plane containing <Katex>{"\\vec{A}"}</Katex> and <Katex>{"\\vec{B}"}</Katex>, determined by the <Keyword term="Right-Hand Rule" />. (Point fingers of right hand along <Katex>{"\\vec{A}"}</Katex>, curl towards <Katex>{"\\vec{B}"}</Katex>; thumb points in direction of <Katex>{"\\vec{A} \\times \\vec{B}"}</Katex>).</li>
     </ul>
     <p>Key properties:</p>
     <ul>
       <li>The cross product is zero if the vectors are parallel or anti-parallel (<Katex>{"\\sin 0^\\circ = \\sin 180^\\circ = 0"}</Katex>).</li>
       <li>The cross product is anti-commutative: <Katex>{"\\vec{A} \\times \\vec{B} = -(\\vec{B} \\times \\vec{A})"}</Katex>. Switching the order reverses the direction of the resulting vector.</li>
       <li>The component calculation is more complex: <br>
         <Katex displayMode>
           {"\\vec{A} \\times \\vec{B} = \\langle (A_y B_z - A_z B_y), (A_z B_x - A_x B_z), (A_x B_y - A_y B_x) \\rangle"}
         </Katex>
         (Often computed using determinants, but we'll focus on the geometric meaning here).
       </li>
     </ul>
    <h4>Utility</h4>
    <p>Brief examples of where the cross product is used:</p>
    <ul>
      <li>Calculating <Keyword term="Torque" />: <Katex>{"\\vec{\\tau} = \\vec{r} \\times \\vec{F}"}</Katex>.</li>
      <li>Calculating <Keyword term="Angular Momentum" />: <Katex>{"\\vec{L} = \\vec{r} \\times \\vec{p}"}</Katex>.</li>
      <li>Calculating the magnetic force on a moving charge: <Katex>{"\\vec{F}_B = q(\\vec{v} \\times \\vec{B})"}</Katex>.</li>
      <li>Finding a vector normal (perpendicular) to a plane defined by two vectors.</li>
    </ul>

    <!-- Placeholder for Cross Product Visualization -->
    <p><em>(Optional visualization for the cross product concept, possibly including the Right-Hand Rule, might be added here.)</em></p>

    <h3>Conclusion</h3>
    <p>
       Vector addition, subtraction, scalar multiplication, the dot product, and the cross product are the fundamental mathematical tools for working with vector quantities. Understanding how to combine and manipulate vectors numerically and conceptually is crucial for analyzing motion, forces, and other physical phenomena in 3D space, which we will explore further in subsequent chapters.
    </p>
  </div>

  <!-- Formula Accordion kept, content can be added later -->
  <FormulaAccordion>
     <p>Key formulas for vector operations will be summarized here.</p>
  </FormulaAccordion>

  <!-- Section Review can be added later -->
  <!--
  <SectionReview>
    <Quiz questions={vectorOpsQuizData} />
  </SectionReview>
  -->
</article>

<style lang="scss">
  article {
    display: flex;
    flex-direction: column;
    gap: var(--space-l);
  }

  .section-intro, .section-core {
    /* Apply medium margin-top to ANY element following another element */
    & > * + * {
      margin-top: var(--space-m);
    }
  }

  h3, h4, h5 {
    margin-top: var(--space-l);
    margin-bottom: var(--space-s);
  }

  h5 {
    margin-top: var(--space-m);
  }
</style>
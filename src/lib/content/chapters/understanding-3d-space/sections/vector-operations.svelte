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

  // Determine the section number
  const sectionNumber = "1.3"; // Adjust if this is incorrect

  // Handle section intersection for navigation
  function handleSectionIntersect(detail: { isIntersecting: boolean; intersectionRatio: number; }) {
    // Example: Set currentSection, adjust threshold as needed
    if (detail.isIntersecting && detail.intersectionRatio > 0.3) {
      // Assuming the store expects the slug 'vector-operations'
      currentSection.set('vector-operations');
    }
  }
</script>

<section
  id="vector-operations"
  data-section="1.3"
  use:intersect={{
    threshold: [0.1, 0.3, 0.5],
    onIntersect: handleSectionIntersect
  }}
>
  <div class="section-line" aria-hidden="true"></div>
  <div class="readable-content">

    <!-- Block 1: Section Header & Intro -->
    <div class="section-header-block">
      <h2>Section Introduction</h2>
      <p>
        Vectors often need to be combined or manipulated to understand physical situations. For example, how do multiple forces acting on an object combine? Or how do we describe a change in velocity? This section introduces the fundamental operations used to work with vectors. We'll look at both the visual intuition (graphical methods) and the precise calculations using components.
      </p>
      <Scenario>
        <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> Okay, vectors describe movement like <Katex>{"\\vec{v}"}</Katex> or forces like <Katex>{"\\vec{F}"}</Katex>. But what if there are *multiple* forces, or something changes speed *and* direction?</p>
        <p data-speaker="Leo"><span class="speaker"><strong>Leo:</strong></span> Great question! That's exactly why we need vector operations. They give us the mathematical tools to combine vectors (like adding forces) or scale them (like relating force to acceleration).</p>
      </Scenario>
    </div>

    <!-- Block 2: Concept - Addition & Subtraction -->
    <div class="concept-block">
      <h2>Vector Addition and Subtraction</h2>
      <p>These operations help us find the net effect of combining vectors or the difference between two vector states.</p>

      <h4>Addition</h4>
      <h5>Concept</h5>
      <p>
        Graphically, we combine vectors by placing them head-to-tail. The resulting vector (the "sum" or "resultant") goes from the tail of the first vector to the head of the last vector.
      </p>
      <FormulaAccordion>
        <p>
           Numerically, we add the corresponding components of the vectors:
           <Katex displayMode>
             {"\\vec{A} + \\vec{B} = \\langle A_x + B_x, A_y + B_y, A_z + B_z \\rangle"}
           </Katex>
        </p>
      </FormulaAccordion>
      <h5>Use Cases</h5>
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
      <FormulaAccordion>
        <p>
          Numerically, we subtract the corresponding components:
          <Katex displayMode>
            {"\\vec{A} - \\vec{B} = \\langle A_x - B_x, A_y - B_y, A_z - B_z \\rangle"}
          </Katex>
        </p>
      </FormulaAccordion>
       <p>
         Graphically, subtraction <Katex>{"\\vec{A} - \\vec{B}"}</Katex> is often visualized by placing the vectors tail-to-tail. The resultant vector points from the head of <Katex>{"\\vec{B}"}</Katex> to the head of <Katex>{"\\vec{A}"}</Katex>. This shows the change needed to get from <Katex>{"\\vec{B}"}</Katex> to <Katex>{"\\vec{A}"}</Katex> (since <Katex>{"\\vec{B} + (\\vec{A} - \\vec{B}) = \\vec{A}"}</Katex>).
       </p>
      <h5>Utility</h5>
      <ul>
        <li>Finding the change in velocity (<Keyword term="acceleration" /> is related to this): <Katex>{"\\Delta\\vec{v} = \\vec{v}_f - \\vec{v}_i"}</Katex>.</li>
        <li>Determining relative position vectors.</li>
      </ul>
    </div>

    <!-- Block 3: Placeholder Visualization - Addition/Subtraction -->
    <!--
      <VectorOperationVisualization type="addition-subtraction">
        Allows users to define two vectors A and B.
        Visualizes A, B (head-to-tail for sum), and Resultant A+B.
        Shows component calculations.
        Toggle to visualize A-B (tail-to-tail or adding -B).
      </VectorOperationVisualization>
    -->
     <div class="visualization-block visualization-card -placeholder">
       <h2>Visualizing Addition & Subtraction</h2>
       <p><em>(Interactive visualization for vector addition/subtraction will be added here.)</em></p>
     </div>

    <!-- Block 4: Concept - Scalar Multiplication -->
    <div class="concept-block">
      <h2>Scalar Multiplication</h2>
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
         <li>If <Katex>{"c < 0"}</Katex>, the vector's magnitude is scaled by <Katex>{"\\|c\\|"}</Katex>, and its direction is reversed (flipped 180°).</li>
         <li>If <Katex>{"c = 0"}</Katex>, the result is the zero vector <Katex>{"\\langle 0, 0, 0 \\rangle"}</Katex>.</li>
      </ul>
      <h4>Utility</h4>
      <ul>
         <li>Relating <Keyword term="force" /> and <Keyword term="acceleration" /> via mass (<Katex>{"\\vec{F} = m\\vec{a}"}</Katex>).</li>
         <li>Relating <Keyword term="velocity" /> and <Keyword term="momentum" /> via mass (<Katex>{"\\vec{p} = m\\vec{v}"}</Katex>).</li>
         <li>Creating <Keyword term="unit vectors" />: A unit vector <Katex>{"\\hat{u}"}</Katex> in the same direction as <Katex>{"\\vec{u}"}</Katex> is found by <Katex>{"\\hat{u} = \\frac{1}{\\|\\vec{u}\\|}\\vec{u}"}</Katex>. This involves scalar multiplication by <Katex>{"1/\\|\\vec{u}\\|"}</Katex>.</li>
      </ul>
    </div>

    <!-- Block 5: Placeholder Visualization - Scalar Multiplication -->
    <!--
      <VectorOperationVisualization type="scalar-multiplication">
        Shows a base vector A.
        Slider/input for scalar c.
        Visualizes c*A, showing scaling and direction flip.
        Displays component calculation.
      </VectorOperationVisualization>
    -->
     <div class="visualization-block visualization-card -placeholder">
       <h2>Visualizing Scalar Multiplication</h2>
       <p><em>(Interactive visualization for scalar multiplication will be added here.)</em></p>
     </div>

    <!-- Block 6: Concept - Dot Product -->
    <div class="concept-block">
      <h2>Dot Product (Scalar Product)</h2>
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
      <p>The dot product is an essential tool in physics with multiple applications that we'll explore in later chapters:</p>
      <ul>
         <li>Calculating <Keyword term="Work" /> done by a force.</li>
         <li>Finding the angle between vectors.</li>
         <li>Determining the <Keyword term="projection" /> of one vector onto another.</li>
      </ul>
      <p>We'll see how these applications become important when we study energy, motion, and more complex physical systems.</p>
    </div>

    <!-- Placeholder for Dot Product Visualization -->
     <p><em>(Optional visualization for the dot product concept might be added here.)</em></p>

    <!-- Block 7: Concept - Cross Product -->
    <div class="concept-block">
      <h2>Cross Product (Vector Product)</h2>
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
         <li>The component calculation is more complex than other vector operations and will be covered in detail when needed in later chapters.</li>
       </ul>
      <h4>Utility</h4>
      <p>The cross product is a powerful tool in physics that we'll explore in depth when we study:</p>
      <ul>
        <li><Keyword term="Torque" /> in rotational motion.</li>
        <li><Keyword term="Angular Momentum" /> in spinning systems.</li>
        <li>Magnetic forces in electromagnetics.</li>
        <li>Other applications requiring vectors perpendicular to a plane.</li>
      </ul>
      <p>For now, simply understanding its conceptual meaning will prepare you for these more advanced topics.</p>
    </div>

    <!-- Placeholder for Cross Product Visualization -->
    <p><em>(Optional visualization for the cross product concept, possibly including the Right-Hand Rule, might be added here.)</em></p>

    <!-- Block 8: Conclusion -->
    <div class="concept-block">
      <h2>Conclusion</h2>
      <p>
         Vector addition, subtraction, scalar multiplication, the dot product, and the cross product are the fundamental mathematical tools for working with vector quantities. Understanding how to combine and manipulate vectors numerically and conceptually is crucial for analyzing motion, forces, and other physical phenomena in 3D space, which we will explore further in subsequent chapters.
      </p>
    </div>

    <!-- Block 9: Optional Formula Summary -->
    <div class="concept-block">
      <FormulaAccordion>
         <div class="formulas-container">
           <div class="formula-section">
             <div class="formula-label">Vector Addition</div>
             <Katex displayMode>
               {"\\vec{A} + \\vec{B} = \\langle A_x + B_x, A_y + B_y, A_z + B_z \\rangle"}
             </Katex>
           </div>

           <div class="formula-section">
             <div class="formula-label">Vector Subtraction</div>
             <Katex displayMode>
               {"\\vec{A} - \\vec{B} = \\langle A_x - B_x, A_y - B_y, A_z - B_z \\rangle"}
             </Katex>
           </div>

           <div class="formula-section">
             <div class="formula-label">Scalar Multiplication</div>
             <Katex displayMode>
               {"c\\vec{A} = \\langle cA_x, cA_y, cA_z \\rangle"}
             </Katex>
           </div>

           <div class="formula-section">
             <div class="formula-label">Dot Product</div>
             <Katex displayMode>
               {"\\text{Geometric definition: } \\vec{A} \\cdot \\vec{B} = \\|\\vec{A}\\| \\|\\vec{B}\\| \\cos \\theta"}
             </Katex>
             <Katex displayMode>
               {"\\text{Component form: } \\vec{A} \\cdot \\vec{B} = A_x B_x + A_y B_y + A_z B_z"}
             </Katex>
           </div>

           <div class="formula-section">
             <div class="formula-label">Cross Product</div>
             <Katex displayMode>
               {"\\text{Magnitude: } \\|\\vec{A} \\times \\vec{B}\\| = \\|\\vec{A}\\| \\|\\vec{B}\\| \\sin \\theta"}
             </Katex>
             <p>Direction: Perpendicular to both vectors, determined by the Right-Hand Rule</p>
           </div>
         </div>
      </FormulaAccordion>
    </div>

    <!-- Block 10: Optional Quiz Placeholder -->
    <!--
    <div class="activity-block -review">
      <SectionReview>
        <Quiz questions={vectorOpsQuizData} />
      </SectionReview>
    </div>
    -->

  </div>
</section>

<style lang="scss">
  /* Remove styles handled by global/template */
  /* Keep styles truly specific to this section if any */
</style>
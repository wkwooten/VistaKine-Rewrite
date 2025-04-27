<script lang="ts">
  import { currentSection } from '$lib/stores/appState.js';
  import { intersect, type IntersectDetail } from '$lib/utils/intersection';
  // import FormulaAccordion from '$lib/components/FormulaAccordion.svelte'; // Removed as it's no longer used directly here
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';
  import extractKeywords from '$lib/utils/keywordExtractor.js';
  import Katex from 'svelte-katex';
  import Keyword from '$lib/components/Keyword.svelte';
  import ContentCard from '$lib/components/ContentCard.svelte';
  import { vectorOpsQuizData } from '$lib/content/chapters/data/quizzes/vector-operations-quiz'; // Import quiz data

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

    <ContentCard blockType="section-header-block">
      <h2>Section Introduction: Manipulating Vectors</h2>
      <p>
        Vectors often need to be combined or manipulated to understand physical situations. For example, how do multiple forces acting on an object combine? Or how do we describe a change in velocity? This section introduces the fundamental operations used to work with vectors: addition, subtraction, scalar multiplication, and the concepts of the dot and cross products. We'll look at both the visual intuition and the precise calculations using components.
      </p>
      <Scenario>
        <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> Okay, vectors describe movement like <Katex>{"\\vec{v}"}</Katex> or forces like <Katex>{"\\vec{F}"}</Katex>. But what if there are *multiple* forces, or something changes speed *and* direction?</p>
        <p data-speaker="Leo"><span class="speaker"><strong>Leo:</strong></span> Great question! That's exactly why we need vector operations. They give us the mathematical tools to combine vectors (like adding forces) or scale them (like relating force to acceleration), and even explore relationships *between* vectors.</p>
      </Scenario>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>Vector Addition and Subtraction</h2>
      <p>These operations help us find the net effect of combining vectors or the difference between two vector states.</p>

      <h4>Addition</h4>
      <h5>Concept</h5>
      <p>
        Graphically, we combine vectors by placing them head-to-tail. The resulting vector (the "sum" or "resultant") goes from the tail of the first vector to the head of the last vector.
      </p>
      <!-- Removed FormulaAccordion wrapper -->
      <p>
         Numerically, we add the corresponding components of the vectors:
         <Katex displayMode>
           {"\\vec{A} + \\vec{B} = \\langle \\color{red}{A_x} + \\color{red}{B_x}, \\color{green}{A_y} + \\color{green}{B_y}, \\color{blue}{A_z} + \\color{blue}{B_z} \\rangle"}
         </Katex>
      </p>
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
      <!-- Removed FormulaAccordion wrapper -->
      <p>
        Numerically, we subtract the corresponding components:
        <Katex displayMode>
          {"\\vec{A} - \\vec{B} = \\langle \\color{red}{A_x} - \\color{red}{B_x}, \\color{green}{A_y} - \\color{green}{B_y}, \\color{blue}{A_z} - \\color{blue}{B_z} \\rangle"}
        </Katex>
      </p>
       <p>
         Graphically, subtraction <Katex>{"\\vec{A} - \\vec{B}"}</Katex> is often visualized by placing the vectors tail-to-tail. The resultant vector points from the head of <Katex>{"\\vec{B}"}</Katex> to the head of <Katex>{"\\vec{A}"}</Katex>. This shows the change needed to get from <Katex>{"\\vec{B}"}</Katex> to <Katex>{"\\vec{A}"}</Katex> (since <Katex>{"\\vec{B} + (\\vec{A} - \\vec{B}) = \\vec{A}"}</Katex>).
       </p>
      <h5>Use Cases</h5>
      <ul>
        <li>Finding the change in velocity (<Keyword term="acceleration" /> is related to this): <Katex>{"\\Delta\\vec{v} = \\vec{v}_f - \\vec{v}_i"}</Katex>.</li>
        <li>Determining relative position vectors.</li>
      </ul>
    </ContentCard>

    <ContentCard blockType="visualization-block" class="visualization-card -placeholder">
      <h2>Visualizing Addition & Subtraction</h2>
      <p><em>(Interactive visualization demonstrating vector head-to-tail addition and tail-to-tail subtraction will be added here.)</em></p>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>Scalar Multiplication</h2>
      <p>This operation scales a vector, changing its magnitude and potentially reversing its direction.</p>
      <h4>Concept</h4>
      <p>
        Multiplying a vector <Katex>{"\\vec{A}"}</Katex> by a scalar (a regular number) <Katex>c</Katex> multiplies each component by <Katex>c</Katex>:
        <Katex displayMode>
          {"c\\vec{A} = \\langle \\color{red}{cA_x}, \\color{green}{cA_y}, \\color{blue}{cA_z} \\rangle"}
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
    </ContentCard>

    <ContentCard blockType="visualization-block" class="visualization-card -placeholder">
      <h2>Visualizing Scalar Multiplication</h2>
      <p><em>(Interactive visualization showing how scalars change vector magnitude and direction will be added here.)</em></p>
    </ContentCard>

    <ContentCard blockType="concept-block">
      <h2>Dot Product (Scalar Product)</h2>
      <p>The dot product combines two vectors to produce a single scalar value. It relates to how much one vector points along the direction of another.</p>
      <h4>Concept</h4>
      <p>
        The dot product of vectors <Katex>{"\\vec{A}"}</Katex> and <Katex>{"\\vec{B}"}</Katex> is defined in two ways:
      </p>
      <ol>
         <li>Geometrically: <Katex>{"\\vec{A} \\cdot \\vec{B} = \\|\\vec{A}\\| \\|\\vec{B}\\| \\cos \\theta"}</Katex>, where <Katex>{"\\theta"}</Katex> is the angle between the vectors when placed tail-to-tail (<Katex>{"0 \\le \\theta \\le 180^\\circ"}</Katex>).</li>
         <li>Algebraically (using components): <Katex>{"\\vec{A} \\cdot \\vec{B} = \\color{red}{A_x B_x} + \\color{green}{A_y B_y} + \\color{blue}{A_z B_z}"}</Katex>.</li>
      </ol>
       <p>Key properties:</p>
       <ul>
         <li>If the vectors are perpendicular (<Katex>{"\\theta = 90^\\circ"}</Katex>), <Katex>{"\\cos 90^\\circ = 0"}</Katex>, so their dot product is 0.</li>
         <li>If the vectors are parallel (<Katex>{"\\theta = 0^\\circ"}</Katex>), <Katex>{"\\cos 0^\\circ = 1"}</Katex>, the dot product is the product of their magnitudes: <Katex>{"\\|\\vec{A}\\| \\|\\vec{B}\\|"}</Katex>.</li>
         <li>If they point in opposite directions (<Katex>{"\\theta = 180^\\circ"}</Katex>), <Katex>{"\\cos 180^\\circ = -1"}</Katex>, the dot product is <Katex>{"-\\|\\vec{A}\\| \\|\\vec{B}\\|"}</Katex>.</li>
         <li>The dot product is commutative: <Katex>{"\\vec{A} \\cdot \\vec{B} = \\vec{B} \\cdot \\vec{A}"}</Katex>.</li>
       </ul>
      <h4>Utility</h4>
      <p>The dot product is a crucial tool in physics for understanding relationships between vector quantities. We will explore its specific applications in later chapters, but its core uses include:</p>
      <ul>
         <li>Quantifying <Keyword term="Work" /> done by a force acting over a displacement.</li>
         <li>Determining the <Keyword term="projection" /> (or component) of one vector onto another.</li>
      </ul>
      <p>While it can also be used to find the angle between vectors, we are focusing on the fundamental definition here. Mastering the dot product concept now will be essential when we delve into energy and other advanced topics where these applications are vital.</p>
    </ContentCard>

    <ContentCard blockType="visualization-block" class="visualization-card -placeholder">
      <h2>Visualizing the Dot Product</h2>
      <p><em>(Optional visualization illustrating the geometric meaning of the dot product, perhaps showing projections, might be added here.)</em></p>
    </ContentCard>

    <ContentCard blockType="concept-block">
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
         <li>The component calculation is more complex and involves determinants. We will introduce the full component formula when its specific applications arise in later chapters.</li>
       </ul>
      <h4>Utility</h4>
      <p>The cross product is fundamental in physics for describing rotational effects and phenomena involving perpendicularity. We will use it extensively when studying:</p>
      <ul>
        <li><Keyword term="Torque" /> (the rotational equivalent of force).</li>
        <li><Keyword term="Angular Momentum" /> (the rotational equivalent of linear momentum).</li>
        <li>Magnetic forces acting on moving charges.</li>
      </ul>
      <p>Understanding the magnitude (area of parallelogram) and direction (Right-Hand Rule) conceptually is the main goal for this section. This foundation will be crucial for tackling rotational dynamics and electromagnetism later.</p>
    </ContentCard>

    <ContentCard blockType="visualization-block" class="visualization-card -placeholder">
      <h2>Visualizing the Cross Product</h2>
      <p><em>(Optional visualization demonstrating the Right-Hand Rule and the resulting perpendicular vector might be added here.)</em></p>
    </ContentCard>

    <ContentCard blockType="conclusion-block">
      <h2>Section Conclusion</h2>
      <p>
        Mastering vector addition, subtraction, and scalar multiplication is essential for combining and scaling physical quantities like displacement, velocity, and force. This section has laid the groundwork for these core operations.
      </p>
      <p>
        We also introduced the concepts of the Dot Product (yielding a scalar related to parallel alignment) and the Cross Product (yielding a vector related to perpendicularity and area). While we've touched upon their definitions and properties, their true power and detailed applications in calculating Work, Torque, Angular Momentum, and more will be explored in subsequent chapters. For now, focus on the component-wise calculations for addition, subtraction, and scalar multiplication, and the geometric meanings of all operations.
      </p>
    </ContentCard>

    <!-- Removed the FormulaAccordion ContentCard -->

    <!-- Added Section Review and Quiz -->
    <ContentCard blockType="activity-block" class="-review">
      <h2>Section Review</h2>
       <SectionReview>
         <Quiz questions={vectorOpsQuizData} />
       </SectionReview>
     </ContentCard>

  </div>
</section>

<style lang="scss">
  /* Remove styles handled by global/template */
  /* Keep styles truly specific to this section if any */
</style>
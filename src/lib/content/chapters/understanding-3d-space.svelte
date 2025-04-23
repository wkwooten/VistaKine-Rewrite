<script lang="ts">
  import { currentSection } from '$lib/stores/appState.js';
  import { intersect } from '$lib/utils/intersection';
  import VisContainer from '$lib/components/visualization/VisContainer.svelte';
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import GuidedCalculation from '$lib/components/GuidedCalculation.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte'
  import Scenario from '$lib/components/Scenario.svelte';
  import ChapterHeaderNav from '$lib/components/ChapterHeaderNav.svelte';
  import extractKeywords from '$lib/utils/keywordExtractor.js';
  import PrinterCalibrationExercise from '$lib/components/visualization/interactions/printer-calibration/PrinterCalibrationExercise.svelte';
  import VectorBuilderExercise from '$lib/components/visualization/interactions/vector-builder/VectorBuilderExercise.svelte';
  import { coordinateQuizData, vectorQuizData } from '$lib/content/chapters/data/understanding-3d-space-quiz-data';
  import Katex from 'svelte-katex';
  import Keyword from '$lib/components/Keyword.svelte';
  import AxisExplorer from '$lib/components/visualization/AxisExplorer.svelte';
  import VectorAnatomy from '$lib/components/visualization/elements/constructs/VectorAnatomy.svelte';

  // The callback function definition remains the same, but now receives the detail object directly
  function handleSectionIntersect(detail: { isIntersecting: boolean; intersectionRatio: number; }, sectionId: string) {
    if (detail.isIntersecting && detail.intersectionRatio > 0.3) {
      currentSection.set(sectionId);
    }
  }

  // Props using Svelte 5 runes
  let { chapterSections = [] } = $props<{ chapterSections?: any[] }>(); // Assuming chapterSections is optional array, adjust type as needed

  // State for completion
  let isCalibrationComplete = false;

  // State for fullscreen
  let isFullscreen = false;

  // Ref for positioning wrapper
  let visWrapperElement: HTMLDivElement;

  // Function to mark completion - Dialog handled by child
  function handleCalibrationComplete() {
    console.log("[Parent] Calibration Complete event received!");
    isCalibrationComplete = true;
    // No dialog logic here anymore
  }
</script>

<div class="chapter-wrapper">
  <header class="chapter-header">
    <h1>Chapter 1: <br> Understanding 3D Space</h1>
    <p class="chapter-intro">
      This chapter introduces the fundamental concepts of <Keyword term="3D Space" /> and
      <Keyword term="coordinate systems" />, essential for understanding <Keyword term="kinematics" /> and <Keyword term="dynamics" />.
    </p>

    <!-- Add the optional header navigation -->
    <ChapterHeaderNav {chapterSections} />
  </header>

  <div class="page-content">
    <section
      id="coordinate-systems"
      class="content-section section-header"
      data-section="1.1"
      use:intersect={{
        threshold: [0.1, 0.3, 0.5],
        onIntersect: (detail) => handleSectionIntersect(detail, '1.1')
      }}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <div class="section-header-content"> <h2 class="section-title">1.1 Coordinate Systems</h2> <p class="section-description"> Learn how coordinate systems (X, Y, Z axes, origin) provide a universal language to define precise locations in 3D space, crucial for tasks like 3D printing, 3d modeling, and more. </p> </div>
        <div class="section-intro">
          <Scenario>
            <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> Ugh, Leo, this printer manual keeps talking about X, Y, and Z coordinates. Why can't I just point and tell it 'print right there'?</p>
            <p data-speaker="Leo"><span class="speaker"><strong>Leo:</strong></span> Ah, but 'right there' isn't precise enough for a machine, Surya! It needs a common language, a <Keyword term="coordinate system" />, to know exactly where 'there' is in <Keyword term="3D space" />.</p>
            <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> So, like the grid lines on the build plate?</p>
            <p data-speaker="Leo"><span class="speaker"><strong>Leo:</strong></span> Precisely! Think of it as a map. We use three perpendicular <Keyword term="axes" /> – usually X for width, Z for depth, and Y for height – all meeting at a starting point called the <Keyword term="origin" /> (0, 0, 0). Every point in the printer's volume has a unique X, Y, Z address.</p>
          </Scenario>

          <p>
            Giving simple directions like "5 steps forward, 3 steps left" works well on a flat surface (2D). But how do you describe reaching for a high shelf or pinpointing a drone? You need a third dimension – height!
          </p>
          <p>
            To map locations precisely in the space around us, we use three reference lines, or <Keyword term="axes" /> (<Keyword term="X" />, <Keyword term="Y" />, and <Keyword term="Z" />), which meet at a single point called the <Keyword term="origin" />. This <Keyword term="Cartesian coordinate system" /> is the standard map for <Keyword term="3D space" />. Engineers typically orient these using a <Keyword term="right-handed coordinate system" /> convention.
          </p>
          <p>
            Let's explore this system:
          </p>
          <figure>
            <AxisExplorer />
            <figcaption>
              Use your mouse to rotate (left-click drag), pan (right-click drag), and zoom (scroll wheel) the view.
            </figcaption>
          </figure>
          <p>
              Notice how the <span style="color: var(--axis-color-x);">X (Red)</span>, <span style="color: var(--axis-color-y);">Y (Green)</span>, and <span style="color: var(--axis-color-z);">Z (Blue)</span> axes represent the three dimensions, all meeting at the <Keyword term="Origin"/> at (0,0,0).
          </p>
          <p>
            Now, let's see this system in action with a 3D printer. Imagine a device with a small nozzle that needs to move *very precisely* to build objects layer by layer. How does it know where to go? It uses those same axes!
          </p>
          <ul>
            <li>The <Keyword term="X-axis" /> guides movement left and right (width).</li>
            <li>The <Keyword term="Z-axis" /> guides movement forward and backward (depth).</li>
            <li>The <Keyword term="Y-axis" /> guides movement up and down (height).</li>
          </ul>
          <p>
             The point where these axes meet is known as the <Keyword term="origin" />, it is often denoted by the letter <strong>O</strong> and is the reference point (0, 0, 0).
          </p>
          <p>
            By telling the printer exactly how far to travel along each axis from this origin (e.g., "move 50 units along X, 20 units along Y, 30 units along Z"), it reaches a unique point in its workspace. These axes typically form a <Keyword term="right-handed coordinate system" />, a standard orientation used in engineering. This precise control is key!
          </p>
        </div>

        <div class="section-core">
          <PrinterCalibrationExercise
            on:calibrationComplete={handleCalibrationComplete}
          />
          <p>
             In the calibration exercise, by inputting specific <Keyword term="X" />, <Keyword term="Y" />, and <Keyword term="Z" /> coordinates, you directed the printer nozzle to precise locations within its 3D workspace. You saw firsthand how the <Keyword term="X-axis" /> controls horizontal movement (width), the <Keyword term="Y-axis" /> controls vertical movement (height), and the <Keyword term="Z-axis" /> controls movement in depth, all relative to the starting <Keyword term="origin" /> (0, 0, 0). Understanding how each coordinate uniquely contributes to defining a point is crucial!
          </p>
        </div>

        <SectionReview>
          <Quiz questions={coordinateQuizData} />
        </SectionReview>
      </div>
    </section>

    <section
      id="vectors-and-components"
      class="content-section"
      data-section="1.2"
      use:intersect={{
        threshold: [0.1, 0.3, 0.5],
        onIntersect: (detail) => handleSectionIntersect(detail, '1.2')
      }}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <div class="section-header-content"> <h2 class="section-title">1.2 Vectors and Components</h2> <p class="section-description"> Discover vectors, quantities with both magnitude and direction, and how we represent them visually (arrows) and numerically (components, unit vectors) to describe movement, forces, and more. </p> </div>

        <div class="section-intro">
          <Scenario>
            <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> Okay, I get coordinates – like (3, 2, 5). But how do I tell a robot arm to *move*? Knowing the start and end isn't enough, right?</p>
            <p data-speaker="Leo"><span class="speaker"><strong>Leo:</strong></span> Exactly! That's where <Keyword term="vectors" /> come in. Think of kicking a ball: you need both *how hard* (magnitude) and *in what direction*. A vector captures both.</p>
             <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> So, coordinates = location, vectors = movement, force, or velocity (speed + direction)?</p>
             <p data-speaker="Leo"><span class="speaker"><strong>Leo:</strong></span> You got it! Coordinates are map pins. Vectors are arrows showing the journey or force.</p>
          </Scenario>

          <p>
            Sometimes, location isn't the whole story. We often need quantities with both size (<Keyword term="magnitude" />) and direction.
          </p>
          <ul>
              <li><strong><Keyword term="Scalar" />:</strong> Has magnitude only (e.g., temperature: 25°C).</li>
              <li><strong><Keyword term="Vector" />:</strong> Has magnitude and direction (e.g., pushing a box: strength + direction).</li>
          </ul>
           <p>
            Examples of vectors include <Keyword term="force" />, <Keyword term="velocity" /> (speed in a specific direction), and <Keyword term="displacement" /> (change in position).
           </p>
        </div>

        <div class="section-core">
          <h3>Anatomy of a Vector</h3>
          <VectorAnatomy />
          <p>
            As you can see, a vector is represented by an arrow. Its <strong>Tail</strong> marks the starting point, and the <strong>Head</strong> (tip) marks the ending point. The arrow's <strong>Length</strong> represents the vector's <strong>Magnitude</strong> (size, strength, or speed), and its <strong>Orientation</strong> in space indicates its <strong>Direction</strong>.
          </p>

          <FormulaAccordion>
            <p>The <Keyword term="magnitude" /> (length) of a vector <Katex>{'\\\\vec{V}'}</Katex> with components <Katex>{'\\\\textcolor{#EF5350}{V_x}, \\\\textcolor{#66BB6A}{V_y}, \\\\textcolor{#2C8FFF}{V_z}'}</Katex> uses the 3D Pythagorean theorem:</p>
            <p>
                <Katex displayMode>{'\\\\|\\\\vec{V}\\\\| = \\\\sqrt{{\\\\textcolor{#EF5350}{V_x}}^2 + {\\\\textcolor{#66BB6A}{V_y}}^2 + {\\\\textcolor{#2C8FFF}{V_z}}^2}'}</Katex>
            </p>
            <p>(Calculation details coming soon!)</p>
          </FormulaAccordion>


          <p>
            Changing the arrow's start or end points alters its length and direction. This visual helps, but for precision, we need numbers: <Keyword term="components" />.
          </p>

          <h3>Describing Vectors Precisely: Components & Notation</h3>
          <p>
            To work with vectors mathematically, we break them into <Keyword term="components" /> along the X, Y, and Z axes. These components (<Katex>{'\\\\textcolor{#EF5350}{V_x}'}</Katex>, <Katex>{'\\\\textcolor{#66BB6A}{V_y}'}</Katex>, <Katex>{'\\\\textcolor{#2C8FFF}{V_z}'}</Katex>) tell us how much the vector extends along each axis.
          </p>
          <p>
            Calculate components using the tail <Katex>{'P_1(x_1, y_1, z_1)'}</Katex> and head <Katex>{'P_2(x_2, y_2, z_2)'}</Katex> coordinates:
          </p>
          <ul>
            <li><Katex>{'\\\\textcolor{#EF5350}{V_x} = x_2 - x_1'}</Katex> (Change in X)</li>
            <li><Katex>{'\\\\textcolor{#66BB6A}{V_y} = y_2 - y_1'}</Katex> (Change in Y)</li>
            <li><Katex>{'\\\\textcolor{#2C8FFF}{V_z} = z_2 - z_1'}</Katex> (Change in Z)</li>
          </ul>
          <p>
            Common notations for vector <Katex>{'\\\\vec{V}'}</Katex> using components:
          </p>
          <ul>
            <li>Angle Bracket Notation: <Katex>{'\\\\vec{V} = \\\\langle \\\\textcolor{#EF5350}{V_x}, \\\\textcolor{#66BB6A}{V_y}, \\\\textcolor{#2C8FFF}{V_z} \\\\rangle'}</Katex></li>
            <li>Parentheses Notation: <Katex>{'\\\\vec{V} = (\\\\textcolor{#EF5350}{V_x}, \\\\textcolor{#66BB6A}{V_y}, \\\\textcolor{#2C8FFF}{V_z})'}</Katex></li>
          </ul>
          <p>
            The <Keyword term="Vector Builder" /> exercise shows these components and notation update as you adjust the vector. This numerical form is vital for calculations.
          </p>

          <VectorBuilderExercise />

          <h3>An Alternative Language: Unit Vector Notation</h3>
          <p>
            Another common way to write vectors, especially in physics/engineering, uses <Keyword term="unit vectors" />.
          </p>
          <p>
            A <Keyword term="unit vector" /> has a magnitude of exactly 1 and indicates direction. The <Keyword term="standard basis vectors" /> point along the positive axes:
          </p>
          <ul>
            <li><Katex>{'\\\\textcolor{#EF5350}{\\\\hat{\\\\mathbf{i}}} = \\\\langle 1, 0, 0 \\\\rangle'}</Katex> (Positive X-axis direction)</li>
            <li><Katex>{'\\\\textcolor{#66BB6A}{\\\\hat{\\\\mathbf{j}}} = \\\\langle 0, 1, 0 \\\\rangle'}</Katex> (Positive Y-axis direction)</li>
            <li><Katex>{'\\\\textcolor{#2C8FFF}{\\\\hat{\\\\mathbf{k}}} = \\\\langle 0, 0, 1 \\\\rangle'}</Katex> (Positive Z-axis direction)</li>
          </ul>
          <p>
             (Note: Sometimes written as bold **i**, **j**, **k** without the hat <Katex>{'\\\\hat{}'}</Katex>.)
          </p>
          <p>
            Any vector <Katex>{'\\\\vec{V}'}</Katex> can be written as a sum ("linear combination") of components times their corresponding unit vectors:
          </p>
          <p>
             <Katex displayMode>{'\\\\vec{V} = \\\\textcolor{#EF5350}{V_x}\\\\textcolor{#EF5350}{\\\\hat{\\\\mathbf{i}}} + \\\\textcolor{#66BB6A}{V_y}\\\\textcolor{#66BB6A}{\\\\hat{\\\\mathbf{j}}} + \\\\textcolor{#2C8FFF}{V_z}\\\\textcolor{#2C8FFF}{\\\\hat{\\\\mathbf{k}}}'}</Katex>
          </p>
          <p>
            This clearly shows the vector's extent along each axis. Example: <Katex>{'\\\\langle 2, -3, 5 \\\\rangle'}</Katex> is also <Katex>{'2\\\\textcolor{#EF5350}{\\\\hat{\\\\mathbf{i}}} - 3\\\\textcolor{#66BB6A}{\\\\hat{\\\\mathbf{j}}} + 5\\\\textcolor{#2C8FFF}{\\\\hat{\\\\mathbf{k}}}'}</Katex>.
          </p>

          <h4>Notation in Different Fields</h4>
          <p>
            Vector representation varies by field:
          </p>
          <ul>
            <li><strong>Physics & Engineering:</strong> Often use <Katex>{'\\\\hat{\\\\mathbf{i}}, \\\\hat{\\\\mathbf{j}}, \\\\hat{\\\\mathbf{k}}'}</Katex> notation (good for forces, velocities).</li>
            <li><strong>Computer Science & Graphics:</strong> Often use component form <Katex>{'\\\\langle x, y, z \\\\rangle'}</Katex> or <Katex>{'(x, y, z)'}</Katex> (good for points, directions in code).</li>
          </ul>
          <p>
            Both notations represent the same concept: a quantity with magnitude and direction. Familiarity with both is useful.
          </p>
          <p>
            The <Keyword term="Vector Builder" /> shows component form; imagine it could also show the equivalent unit vector notation.
          </p>
        </div>

        <SectionReview>
          <Quiz questions={vectorQuizData} />
        </SectionReview>
      </div>
    </section>

    <section
      id="vector-operations"
      class="content-section"
      data-section="1.3"
      use:intersect={{
        threshold: [0.1, 0.3, 0.5],
        onIntersect: (detail) => handleSectionIntersect(detail, '1.3')
      }}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <div class="section-header-content"> <h2 class="section-title">1.3 Vector Operations</h2> <p class="section-description"> Explore fundamental operations like vector addition, subtraction, and scalar multiplication, essential tools for combining and manipulating vector quantities in kinematic analysis. </p> </div>

        <div class="section-intro">
          <h3>Introduction: Why Operate on Vectors?</h3>
          <p>
            Vectors often need to be combined or manipulated to understand physical situations. For example, how do multiple forces acting on an object combine? Or how do we describe a change in velocity? This section introduces the fundamental operations used to work with vectors. We'll look at both the visual intuition (graphical methods) and the precise calculations using components.
          </p>
          <!-- Scenario kept, content can be adjusted later if needed -->
          <Scenario>
            <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> Okay, vectors describe movement like <Katex>{"\\\\vec{v}"}</Katex> or forces like <Katex>{"\\\\vec{F}"}</Katex>. But what if there are *multiple* forces, or something changes speed *and* direction?</p>
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
               {"\\\\vec{A} + \\\\vec{B} = \\\\langle A_x + B_x, A_y + B_y, A_z + B_z \\rangle"}
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
             Subtracting a vector <Katex>{"\\\\vec{B}"}</Katex> from <Katex>{"\\\\vec{A}"}</Katex> is the same as adding the negative of <Katex>{"\\\\vec{B}"}</Katex> (a vector with the same magnitude but opposite direction).
           </p>
          <p>
            Numerically, we subtract the corresponding components:
            <Katex displayMode>
              {"\\\\vec{A} - \\\\vec{B} = \\\\langle A_x - B_x, A_y - B_y, A_z - B_z \\rangle"}
            </Katex>
          </p>
           <p>
             Graphically, subtraction <Katex>{"\\\\vec{A} - \\\\vec{B}"}</Katex> is often visualized by placing the vectors tail-to-tail. The resultant vector points from the head of <Katex>{"\\\\vec{B}"}</Katex> to the head of <Katex>{"\\\\vec{A}"}</Katex>. This shows the change needed to get from <Katex>{"\\\\vec{B}"}</Katex> to <Katex>{"\\\\vec{A}"}</Katex> (since <Katex>{"\\\\vec{B} + (\\\\vec{A} - \\\\vec{B}) = \\\\vec{A}"}</Katex>).
           </p>
          <h5>Utility</h5>
          <ul>
            <li>Finding the change in velocity (<Keyword term="acceleration" /> is related to this): <Katex>{"\\\\Delta\\\\vec{v} = \\\\vec{v}_f - \\\\vec{v}_i"}</Katex>.</li>
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
            Multiplying a vector <Katex>{"\\\\vec{A}"}</Katex> by a scalar (a regular number) <Katex>c</Katex> multiplies each component by <Katex>c</Katex>:
            <Katex displayMode>
              {"c\\\\vec{A} = \\\\langle cA_x, cA_y, cA_z \\rangle"}
            </Katex>
          </p>
          <ul>
             <li>If <Katex>{"c > 0"}</Katex>, the vector's magnitude is scaled by <Katex>c</Katex>, and its direction remains the same.</li>
             <li>If <Katex>{"c < 0"}</Katex>, the vector's magnitude is scaled by <Katex>{"|c|"}</Katex>, and its direction is reversed (flipped 180°).</li>
             <li>If <Katex>{"c = 0"}</Katex>, the result is the zero vector <Katex>{"\\\\langle 0, 0, 0 \\rangle"}</Katex>.</li>
          </ul>
          <h4>Utility</h4>
          <ul>
             <li>Relating <Keyword term="force" /> and <Keyword term="acceleration" /> via mass (<Katex>{"\\\\vec{F} = m\\\\vec{a}"}</Katex>).</li>
             <li>Relating <Keyword term="velocity" /> and <Keyword term="momentum" /> via mass (<Katex>{"\\\\vec{p} = m\\\\vec{v}"}</Katex>).</li>
             <li>Creating <Keyword term="unit vectors" />: A unit vector <Katex>{"\\\\hat{u}"}</Katex> in the same direction as <Katex>{"\\\\vec{u}"}</Katex> is found by <Katex>{"\\\\hat{u} = \\\\frac{1}{\\\\||\\\\vec{u}\\\\||}\\\\vec{u}"}</Katex>. This involves scalar multiplication by <Katex>{"1/\\\\||\\\\vec{u}\\\\||"}</Katex>.</li>
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
            The dot product of vectors <Katex>{"\\\\vec{A}"}</Katex> and <Katex>{"\\\\vec{B}"}</Katex> is defined in two ways:
          </p>
          <ol>
             <li>Geometrically: <Katex>{"\\\\vec{A} \\\\cdot \\\\vec{B} = \\\\||\\\\vec{A}\\\\|| \\\\||\\\\vec{B}\\\\|| \\\\cos \\\\theta"}</Katex>, where <Katex>{"\\\\theta"}</Katex> is the angle between the vectors when placed tail-to-tail (<Katex>{"0 \\\\le \\\\theta \\\\le 180^\\\\circ"}</Katex>).</li>
             <li>Algebraically (using components): <Katex>{"\\\\vec{A} \\\\cdot \\\\vec{B} = A_x B_x + A_y B_y + A_z B_z"}</Katex>.</li>
          </ol>
           <p>Key properties:</p>
           <ul>
             <li>If the vectors are perpendicular (<Katex>{"\\\\theta = 90^\\\\circ"}</Katex>), <Katex>{"\\\\cos 90^\\\\circ = 0"}</Katex>, so their dot product is 0.</li>
             <li>If the vectors are parallel (<Katex>{"\\\\theta = 0^\\\\circ"}</Katex>), <Katex>{"\\\\cos 0^\\\\circ = 1"}</Katex>, the dot product is the product of their magnitudes: <Katex>{"\\\\||\\\\vec{A}\\\\|| \\\\||\\\\vec{B}\\\\||"}</Katex>.</li>
             <li>If they point in opposite directions (<Katex>{"\\\\theta = 180^\\\\circ"}</Katex>), <Katex>{"\\\\cos 180^\\\\circ = -1"}</Katex>, the dot product is <Katex>{"-\\\\||\\\\vec{A}\\\\|| \\\\||\\\\vec{B}\\\\||"}</Katex>.</li>
             <li>The dot product is commutative: <Katex>{"\\\\vec{A} \\\\cdot \\\\vec{B} = \\\\vec{B} \\\\cdot \\\\vec{A}"}</Katex>.</li>
           </ul>
          <h4>Utility</h4>
          <p>Brief examples of where the dot product is used:</p>
          <ul>
             <li>Calculating <Keyword term="Work" /> done by a constant force: <Katex>{"W = \\\\vec{F} \\\\cdot \\\\vec{d}"}</Katex>.</li>
             <li>Finding the angle between two vectors: <Katex>{"\\\\theta = \\\\arccos\\\\left(\\\\frac{\\\\vec{A} \\\\cdot \\\\vec{B}}{\\\\||\\\\vec{A}\\\\|| \\\\||\\\\vec{B}\\\\||}\\\\right)"}</Katex>.</li>
             <li>Determining the <Keyword term="projection" /> of one vector onto another (finding the component of one vector along the direction of another).</li>
          </ul>

          <!-- Placeholder for Dot Product Visualization -->
           <p><em>(Optional visualization for the dot product concept might be added here.)</em></p>


          <h3>Cross Product (Vector Product)</h3>
          <p>The cross product combines two vectors in 3D space to produce a new *vector* that is perpendicular to both original vectors. This operation is inherently three-dimensional.</p>
          <h4>Concept</h4>
           <p>
             The cross product of <Katex>{"\\\\vec{A}"}</Katex> and <Katex>{"\\\\vec{B}"}</Katex>, denoted <Katex>{"\\\\vec{A} \\\\times \\\\vec{B}"}</Katex>, results in a vector <Katex>{"\\\\vec{C}"}</Katex>.
           </p>
           <ul>
             <li><strong>Magnitude:</strong> The magnitude of the resulting vector is <Katex>{"\\\\||\\\\vec{A} \\\\times \\\\vec{B}\\\\|| = \\\\||\\\\vec{A}\\\\|| \\\\||\\\\vec{B}\\\\|| \\\\sin \\\\theta"}</Katex>, where <Katex>{"\\\\theta"}</Katex> is the angle between <Katex>{"\\\\vec{A}"}</Katex> and <Katex>{"\\\\vec{B}"}</Katex> (<Katex>{"0 \\\\le \\\\theta \\\\le 180^\\\\circ"}</Katex>). This magnitude is equal to the area of the parallelogram formed by <Katex>{"\\\\vec{A}"}</Katex> and <Katex>{"\\\\vec{B}"}</Katex>.</li>
             <li><strong>Direction:</strong> The direction of <Katex>{"\\\\vec{C} = \\\\vec{A} \\\\times \\\\vec{B}"}</Katex> is perpendicular to the plane containing <Katex>{"\\\\vec{A}"}</Katex> and <Katex>{"\\\\vec{B}"}</Katex>, determined by the <Keyword term="Right-Hand Rule" />. (Point fingers of right hand along <Katex>{"\\\\vec{A}"}</Katex>, curl towards <Katex>{"\\\\vec{B}"}</Katex>; thumb points in direction of <Katex>{"\\\\vec{A} \\\\times \\\\vec{B}"}</Katex>).</li>
           </ul>
           <p>Key properties:</p>
           <ul>
             <li>The cross product is zero if the vectors are parallel or anti-parallel (<Katex>{"\\\\sin 0^\\\\circ = \\\\sin 180^\\\\circ = 0"}</Katex>).</li>
             <li>The cross product is anti-commutative: <Katex>{"\\\\vec{A} \\\\times \\\\vec{B} = -(\\\\vec{B} \\\\times \\\\vec{A})"}</Katex>. Switching the order reverses the direction of the resulting vector.</li>
             <li>The component calculation is more complex: <br>
               <Katex displayMode>
                 {"\\\\vec{A} \\\\times \\\\vec{B} = \\\\langle (A_y B_z - A_z B_y), (A_z B_x - A_x B_z), (A_x B_y - A_y B_x) \\\\rangle"}
               </Katex>
               (Often computed using determinants, but we'll focus on the geometric meaning here).
             </li>
           </ul>
          <h4>Utility</h4>
          <p>Brief examples of where the cross product is used:</p>
          <ul>
            <li>Calculating <Keyword term="Torque" />: <Katex>{"\\\\vec{\\\\tau} = \\\\vec{r} \\\\times \\\\vec{F}"}</Katex>.</li>
            <li>Calculating <Keyword term="Angular Momentum" />: <Katex>{"\\\\vec{L} = \\\\vec{r} \\\\times \\\\vec{p}"}</Katex>.</li>
            <li>Calculating the magnetic force on a moving charge: <Katex>{"\\\\vec{F}_B = q(\\\\vec{v} \\\\times \\\\vec{B})"}</Katex>.</li>
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
      </div>
    </section>
  </div>
</div>

<style lang="scss">
    /* Consistent Chapter Spacing */
    .chapter-header { margin-bottom: var(--space-xl); }
    .content-section + .content-section { margin-top: var(--space-2xl); }
    .page-content > .content-section:first-child { margin-top: 0; }

    .readable-content {
        /* Spacing between major blocks (intro, core, review) */
        & > * + * { margin-top: var(--space-l); }
        & > .section-intro + .section-core { margin-top: var(--space-xl); }
        & > .section-core + .section-review { margin-top: var(--space-xl); }

        /* --- Spacing WITHIN intro and core --- */
        .section-intro,
        .section-core {
            /* Apply medium margin-top to ANY element following another element */
            & > * + * {
                margin-top: var(--space-m);
            }

            /* REMOVED all other specific rules from here */
        }
    }
</style>
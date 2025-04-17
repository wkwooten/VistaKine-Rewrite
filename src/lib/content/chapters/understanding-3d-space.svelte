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
      This chapter introduces the fundamental concepts of <span class="keyword">three-dimensional space</span> and
      <span class="keyword">coordinate systems</span>, essential for understanding <span class="keyword">kinematics</span> and <span class="keyword">dynamics</span>.
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
        <h2 class="section-title">1.1 Coordinate Systems</h2>
        <div class="section-intro">
          <Scenario>
            <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> Ugh, Leo, this printer manual keeps talking about X, Y, and Z coordinates. Why can't I just point and tell it 'print right there'?</p>
            <p data-speaker="Leo"><span class="speaker"><strong>Leo:</strong></span> Ah, but 'right there' isn't precise enough for a machine, Surya! It needs a common language, a <span class="keyword">coordinate system</span>, to know exactly where 'there' is in <span class="keyword">3D space</span>.</p>
            <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> So, like the grid lines on the build plate?</p>
            <p data-speaker="Leo"><span class="speaker"><strong>Leo:</strong></span> Precisely! Think of it as a map. We use three perpendicular <span class="keyword">axes</span> – usually X for width, Z for depth, and Y for height – all meeting at a starting point called the <span class="keyword">origin</span> (0, 0, 0). Every point in the printer's volume has a unique X, Y, Z address.</p>
          </Scenario>

          <p>
            Leo's right. Just like Surya discovered with her printer, simply pointing or saying "there" isn't enough when we need precision. How <em>do</em> we tell a machine, or even another person, exactly where something is located in space?
          </p>
          <p>
            That's the job of <span class="keyword">coordinate systems</span>. They act like a universal address book for space, providing a clear, mathematical framework to define any position using numerical <span class="keyword">coordinates</span>.
          </p>
          <p>
            We use simpler, 2D versions constantly, like map grids (latitude/longitude) pinpointing locations on Earth. For <span class="keyword">3D space</span>, like inside Surya's printer, we just add a third <span class="keyword">axis</span> (usually <span class="keyword">Y</span> for height) to describe positions fully – left/right (<span class="keyword">X</span>), forward/backward (<span class="keyword">Z</span>), and up/down (<span class="keyword">Y</span>).
          </p>
          <p>
            We'll put this into practice shortly by helping Surya and Leo calibrate that 3D printer, precisely guiding its nozzle using these very coordinates.
          </p>
        </div>

        <div class="section-core">
          <PrinterCalibrationExercise
            on:calibrationComplete={handleCalibrationComplete}
          />
          <p>
            Think of a 3D printer. It uses three <span class="keyword">axes</span> (<span class="keyword">x</span>, <span class="keyword">y</span>, and <span class="keyword">z</span>) to pinpoint any location within its printing area. The intersection of these three <span class="keyword">axes</span> is called the <span class="keyword">origin</span>, typically represented as (0, 0, 0).
          </p>
          <p>
            The <span class="keyword">x-axis</span> usually represents <span class="keyword">horizontal</span> movement, the <span class="keyword">y-axis</span> represents <span class="keyword">vertical</span> movement, and the <span class="keyword">z-axis</span> represents <span class="keyword">depth</span>, forming a <span class="keyword">right-handed coordinate system</span>.
          </p>
          <p>
            By combining <span class="keyword">coordinates</span> along these <span class="keyword">axes</span> – positive or negative distances from the <span class="keyword">origin</span> – we can specify any point in <span class="keyword">3D space</span>, giving us a powerful way to describe and manipulate objects.
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
        <h2 class="section-title">1.2 Vectors and Components</h2>

        <div class="section-intro">
          <Scenario>
            <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> Okay, I get the coordinates from last section – like (3, 2, 5). But now I'm trying to program this robot arm to *move* from one point to another. Just knowing the destination coordinates isn't enough, is it? It needs to know the *path* or the *push*.</p>
            <p data-speaker="Leo"><span class="speaker"><strong>Leo:</strong></span> Exactly! You've hit on why we need <span class="keyword">vectors</span>. Think about kicking a soccer ball. You don't just care *where* it lands; you care about *how hard* you kicked it and *in what direction*. That combination – magnitude (how hard) and direction (where) – is what a vector describes.</p>
             <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> So, coordinates tell us a location, like a spot on the printer bed. Vectors tell us how to *get* somewhere, or how much force to apply, or how fast something is moving and in what direction?</p>
             <p data-speaker="Leo"><span class="speaker"><strong>Leo:</strong></span> You got it! Coordinates are like pins on a map. Vectors are like the arrows drawn on the map showing a specific journey or force.</p>
          </Scenario>

          <p>
            Leo's right. Sometimes just knowing a location isn't enough. We often need to describe quantities that have both a size (or <span class="keyword">magnitude</span>) and a direction. Think about temperature – it's just a number (like 25°C). That's called a <span class="keyword">scalar</span>. But think about pushing a box – you push with a certain strength (<span class="keyword">magnitude</span>) in a specific direction. That push is a <span class="keyword">force</span>, a perfect example of a <span class="keyword">vector</span>. Other examples include <span class="keyword">velocity</span> (speed in a direction) and <span class="keyword">displacement</span> (change in position).
          </p>
        </div>

        <div class="section-core">
          <h3>Visualizing Vectors: Arrows in Space</h3>
          <p>
            So, how do we picture these vectors? The most common way is using an arrow in our 3D coordinate system (like the one we saw with the printer calibration).
          </p>
          <ul>
            <li>The <strong>length</strong> of the arrow represents the vector's <span class="keyword">magnitude</span> (how big it is – e.g., how strong the push, how fast the speed).</li>
            <li>The <strong>orientation</strong> of the arrow (which way it points) represents the vector's <span class="keyword">direction</span>.</li>
            <li>The arrow starts at a point called the <strong>tail</strong> (or origin of the vector) and ends at the <strong>head</strong> (or terminal point).</li>
          </ul>

          <FormulaAccordion>
            <p>The length, or <span class="keyword">magnitude</span>, of a vector <Katex>{'\\vec{V}'}</Katex> with components <Katex>{'\\textcolor{#EF5350}{V_x}, \\textcolor{#66BB6A}{V_y}, \\textcolor{#2C8FFF}{V_z}'}</Katex> is found using the 3D Pythagorean theorem:</p>
            <p>
                <Katex displayMode>{'||\\vec{V}|| = \\sqrt{\\textcolor{#EF5350}{V_x}^2 + \\textcolor{#66BB6A}{V_y}^2 + \\textcolor{#2C8FFF}{V_z}^2}'}</Katex>
            </p>
            <p>(We'll explore how to calculate this soon!)</p>
          </FormulaAccordion>

          <VectorBuilderExercise />

          <p>
            Notice how changing the start or end points changes both the length (magnitude) and orientation (direction) of the arrow. This arrow gives us a clear visual intuition for a vector. But how do we describe it precisely using numbers? That's where <span class="keyword">components</span> come in.
          </p>

          <h3>Describing Vectors Precisely: Components & Notation</h3>
          <p>
            While the arrow gives us a visual, we need numbers to work with vectors mathematically or in code. We do this by breaking the vector down into its <span class="keyword">components</span> along the X, Y, and Z axes.
          </p>
          <p>
            Imagine drawing lines from the vector's head straight down (or up) to the xy-plane, and then from that point parallel to the axes back to the origin. The distances traveled along each axis represent the vector's components: <Katex>{'\\textcolor{#EF5350}{V_x}'}</Katex>, <Katex>{'\\textcolor{#66BB6A}{V_y}'}</Katex>, and <Katex>{'\\textcolor{#2C8FFF}{V_z}'}</Katex>. They tell us "how much" of the vector points along each respective axis.
          </p>
          <p>
            If you know the coordinates of the vector's tail <Katex>{'P_1(x_1, y_1, z_1)'}</Katex> and its head <Katex>{'P_2(x_2, y_2, z_2)'}</Katex>, you can easily calculate the components:
          </p>
          <ul>
            <li><Katex>{'\\textcolor{#EF5350}{V_x} = x_2 - x_1'}</Katex> (Change in X)</li>
            <li><Katex>{'\\textcolor{#66BB6A}{V_y} = y_2 - y_1'}</Katex> (Change in Y)</li>
            <li><Katex>{'\\textcolor{#2C8FFF}{V_z} = z_2 - z_1'}</Katex> (Change in Z)</li>
          </ul>
          <p>
            The standard way to write a vector using its components is with angle brackets or parentheses. Both are common:
          </p>
          <ul>
            <li>Angle Bracket Notation: <Katex>{'\\vec{V} = \\langle \\textcolor{#EF5350}{V_x}, \\textcolor{#66BB6A}{V_y}, \\textcolor{#2C8FFF}{V_z} \\rangle'}</Katex></li>
            <li>Parentheses Notation: <Katex>{'\\vec{V} = (\\textcolor{#EF5350}{V_x}, \\textcolor{#66BB6A}{V_y}, \\textcolor{#2C8FFF}{V_z})'}</Katex></li>
          </ul>
          <p>
            In the <span class="keyword">Vector Builder</span> exercise above, look at the output panel. As you move the vector's start and end points, you'll see the <Katex>{'\\textcolor{#EF5350}{V_x}'}</Katex>, <Katex>{'\\textcolor{#66BB6A}{V_y}'}</Katex>, and <Katex>{'\\textcolor{#2C8FFF}{V_z}'}</Katex> components update automatically, along with the vector shown in component notation. This numerical representation is crucial for calculations.
          </p>

          <h3>An Alternative Language: Unit Vector Notation</h3>
          <p>
            Besides component form <Katex>{'\\langle V_x, V_y, V_z \\rangle'}</Katex>, there's another very common and useful way to write vectors, especially in physics and engineering. This method uses <span class="keyword">unit vectors</span>.
          </p>
          <p>
            A <span class="keyword">unit vector</span> is simply a vector with a magnitude (length) of exactly 1. They are incredibly useful for indicating direction. We have three special standard unit vectors, often called the <span class="keyword">standard basis vectors</span>, that point along the positive X, Y, and Z axes:
          </p>
          <ul>
            <li><Katex>{'\\textcolor{#EF5350}{\\hat{\\mathbf{i}}} = \\langle 1, 0, 0 \\rangle'}</Katex> (Points 1 unit along the positive X-axis)</li>
            <li><Katex>{'\\textcolor{#66BB6A}{\\hat{\\mathbf{j}}} = \\langle 0, 1, 0 \\rangle'}</Katex> (Points 1 unit along the positive Y-axis)</li>
            <li><Katex>{'\\textcolor{#2C8FFF}{\\hat{\\mathbf{k}}} = \\langle 0, 0, 1 \\rangle'}</Katex> (Points 1 unit along the positive Z-axis)</li>
          </ul>
          <p>
             (Note: Sometimes you'll see these written as bold letters **i**, **j**, **k** without the "hat" <Katex>{'\\hat{}'}</Katex> symbol.)
          </p>
          <p>
            Using these basis vectors, we can express *any* vector <Katex>{'\\vec{V}'}</Katex> as a sum (a "linear combination") of its components multiplied by their corresponding unit vectors:
          </p>
          <p>
             <Katex displayMode>{'\\vec{V} = \\textcolor{#EF5350}{V_x}\\textcolor{#EF5350}{\\hat{\\mathbf{i}}} + \\textcolor{#66BB6A}{V_y}\\textcolor{#66BB6A}{\\hat{\\mathbf{j}}} + \\textcolor{#2C8FFF}{V_z}\\textcolor{#2C8FFF}{\\hat{\\mathbf{k}}}'}</Katex>
          </p>
          <p>
            This form clearly shows how much of the vector <Katex>{'\\vec{V}'}</Katex> extends along each primary axis direction. For example, the vector <Katex>{'\\langle 2, -3, 5 \\rangle'}</Katex> can also be written as <Katex>{'2\\textcolor{#EF5350}{\\hat{\\mathbf{i}}} - 3\\textcolor{#66BB6A}{\\hat{\\mathbf{j}}} + 5\\textcolor{#2C8FFF}{\\hat{\\mathbf{k}}}'}</Katex>.
          </p>

          <h4>Notation in Different Fields</h4>
          <p>
            You might encounter vectors represented differently depending on the context:
          </p>
          <ul>
            <li><strong>Physics & Engineering:</strong> Often favor the <Katex>{'\\hat{\\mathbf{i}}, \\hat{\\mathbf{j}}, \\hat{\\mathbf{k}}'}</Katex> notation. It's great for expressing physical quantities like forces, velocities, or electric fields where direction is paramount and breaking things down by axis is common.</li>
            <li><strong>Computer Science & Graphics:</strong> Frequently use the component form <Katex>{'\\langle x, y, z \\rangle'}</Katex> or <Katex>{'(x, y, z)'}</Katex>. Here, vectors are often treated as data structures representing points, directions, or offsets in 3D space for calculations in games, simulations, or data visualization.</li>
          </ul>
          <p>
            It's important to remember that these are just different ways of writing down the <strong>same mathematical concept</strong>: a quantity with both magnitude and direction. Being comfortable with both notations is helpful!
          </p>
          <p>
            The <span class="keyword">Vector Builder</span> visualization can help you see this connection. While it currently shows component form, imagine a toggle that could also display the equivalent unit vector notation for the vector you build.
          </p>

          <!-- Content for Magnitude calculation details will go here -->
          <!-- ... -->
          <!-- Guided Calculation for Magnitude -->
          <!-- ... -->
          <!-- Content for Looking Ahead will go here -->
          <!-- ... -->
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
        <h2 class="section-title">1.3 Vector Operations</h2>

        <div class="section-intro">
          <Scenario>
            <p data-speaker="Surya"><span class="speaker"><strong>Surya:</strong></span> I'm watching a video of a car moving, but it's hard to tell how fast it's actually going.</p>
            <p data-speaker="Leo"><span class="speaker"><strong>Leo:</strong></span> That's because you're seeing it from a different <span class="keyword">reference frame</span>! It's like watching someone walk on a moving train.</p>
          </Scenario>

          <FormulaAccordion>
            <p>Formulas will go here.</p>
          </FormulaAccordion>
        </div>

        <div class="section-core">
          <p>
            A <span class="keyword">reference frame</span> is a <span class="keyword">coordinate system</span> attached to an observer, providing a perspective
            from which to measure position, <span class="keyword">velocity</span>, and other physical quantities.
          </p>
          <p>
            This section explores how measurements change when observed from different <span class="keyword">reference frames</span>,
            laying the groundwork for understanding relative motion in <span class="keyword">kinematics</span>.
          </p>
        </div>
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
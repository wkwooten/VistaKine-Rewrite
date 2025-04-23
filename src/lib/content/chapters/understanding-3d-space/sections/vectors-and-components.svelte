<script lang="ts">
  import { currentSection } from '$lib/stores/appState.js';
  import { intersect } from '$lib/utils/intersection';
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';
  import extractKeywords from '$lib/utils/keywordExtractor.js';
  import VectorBuilderExercise from '$lib/components/visualization/interactions/vector-builder/VectorBuilderExercise.svelte';
  import { vectorQuizData } from '$lib/content/chapters/data/understanding-3d-space-quiz-data';
  import Katex from 'svelte-katex';
  import Keyword from '$lib/components/Keyword.svelte';
  import VectorAnatomy from '$lib/components/visualization/elements/constructs/VectorAnatomy.svelte';
</script>

<article>
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
      <p>The <Keyword term="magnitude" /> (length) of a vector <Katex>{'\vec{V}'}</Katex> with components <Katex>{'\textcolor{#EF5350}{V_x}, \textcolor{#66BB6A}{V_y}, \textcolor{#2C8FFF}{V_z}'}</Katex> uses the 3D Pythagorean theorem:</p>
      <p>
          <Katex displayMode>{'||\vec{V}|| = \sqrt{\textcolor{#EF5350}{V_x}^2 + \textcolor{#66BB6A}{V_y}^2 + \textcolor{#2C8FFF}{V_z}^2}'}</Katex>
      </p>
      <p>(Calculation details coming soon!)</p>
    </FormulaAccordion>

    <VectorBuilderExercise />

    <p>
      Changing the arrow's start or end points alters its length and direction. This visual helps, but for precision, we need numbers: <Keyword term="components" />.
    </p>

    <h3>Describing Vectors Precisely: Components & Notation</h3>
    <p>
      To work with vectors mathematically, we break them into <Keyword term="components" /> along the X, Y, and Z axes. These components (<Katex>{'\textcolor{#EF5350}{V_x}'}</Katex>, <Katex>{'\textcolor{#66BB6A}{V_y}'}</Katex>, <Katex>{'\textcolor{#2C8FFF}{V_z}'}</Katex>) tell us how much the vector extends along each axis.
    </p>
    <p>
      Calculate components using the tail <Katex>{'P_1(x_1, y_1, z_1)'}</Katex> and head <Katex>{'P_2(x_2, y_2, z_2)'}</Katex> coordinates:
    </p>
    <ul>
      <li><Katex>{'\textcolor{#EF5350}{V_x} = x_2 - x_1'}</Katex> (Change in X)</li>
      <li><Katex>{'\textcolor{#66BB6A}{V_y} = y_2 - y_1'}</Katex> (Change in Y)</li>
      <li><Katex>{'\textcolor{#2C8FFF}{V_z} = z_2 - z_1'}</Katex> (Change in Z)</li>
    </ul>
    <p>
      Common notations for vector <Katex>{'\vec{V}'}</Katex> using components:
    </p>
    <ul>
      <li>Angle Bracket Notation: <Katex>{'\vec{V} = \langle \textcolor{#EF5350}{V_x}, \textcolor{#66BB6A}{V_y}, \textcolor{#2C8FFF}{V_z} \rangle'}</Katex></li>
      <li>Parentheses Notation: <Katex>{'\vec{V} = (\textcolor{#EF5350}{V_x}, \textcolor{#66BB6A}{V_y}, \textcolor{#2C8FFF}{V_z})'}</Katex></li>
    </ul>
    <p>
      The <Keyword term="Vector Builder" /> exercise shows these components and notation update as you adjust the vector. This numerical form is vital for calculations.
    </p>

    <h3>An Alternative Language: Unit Vector Notation</h3>
    <p>
      Another common way to write vectors, especially in physics/engineering, uses <Keyword term="unit vectors" />.
    </p>
    <p>
      A <Keyword term="unit vector" /> has a magnitude of exactly 1 and indicates direction. The <Keyword term="standard basis vectors" /> point along the positive axes:
    </p>
    <ul>
      <li><Katex>{'\textcolor{#EF5350}{\hat{\mathbf{i}}} = \langle 1, 0, 0 \rangle'}</Katex> (Positive X-axis direction)</li>
      <li><Katex>{'\textcolor{#66BB6A}{\hat{\mathbf{j}}} = \langle 0, 1, 0 \rangle'}</Katex> (Positive Y-axis direction)</li>
      <li><Katex>{'\textcolor{#2C8FFF}{\hat{\mathbf{k}}} = \langle 0, 0, 1 \rangle'}</Katex> (Positive Z-axis direction)</li>
    </ul>
    <p>
       (Note: Sometimes written as bold **i**, **j**, **k** without the hat <Katex>{'\hat{}'}</Katex>.)
    </p>
    <p>
      Any vector <Katex>{'\vec{V}'}</Katex> can be written as a sum ("linear combination") of components times their corresponding unit vectors:
    </p>
    <p>
       <Katex displayMode>{'\vec{V} = \textcolor{#EF5350}{V_x}\textcolor{#EF5350}{\hat{\mathbf{i}}} + \textcolor{#66BB6A}{V_y}\textcolor{#66BB6A}{\hat{\mathbf{j}}} + \textcolor{#2C8FFF}{V_z}\textcolor{#2C8FFF}{\hat{\mathbf{k}}}'}</Katex>
    </p>
    <p>
      This clearly shows the vector's extent along each axis. Example: <Katex>{'\langle 2, -3, 5 \rangle'}</Katex> is also <Katex>{'2\textcolor{#EF5350}{\hat{\mathbf{i}}} - 3\textcolor{#66BB6A}{\hat{\mathbf{j}}} + 5\textcolor{#2C8FFF}{\hat{\mathbf{k}}}'}</Katex>.
    </p>

    <h4>Notation in Different Fields</h4>
    <p>
      Vector representation varies by field:
    </p>
    <ul>
      <li><strong>Physics & Engineering:</strong> Often use <Katex>{'\hat{\mathbf{i}}, \hat{\mathbf{j}}, \hat{\mathbf{k}}'}</Katex> notation (good for forces, velocities).</li>
      <li><strong>Computer Science & Graphics:</strong> Often use component form <Katex>{'\langle x, y, z \rangle'}</Katex> or <Katex>{'(x, y, z)'}</Katex> (good for points, directions in code).</li>
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

  h3, h4 {
    margin-top: var(--space-l);
    margin-bottom: var(--space-s);
  }
</style>
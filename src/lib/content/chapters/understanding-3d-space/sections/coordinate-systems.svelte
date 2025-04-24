<script lang="ts">
  import { currentSection } from '$lib/stores/appState.js';
  import { intersect } from '$lib/utils/intersection';
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';
  import extractKeywords from '$lib/utils/keywordExtractor.js';
  import PrinterCalibrationExercise from '$lib/components/visualization/interactions/printer-calibration/PrinterCalibrationExercise.svelte';
  import { coordinateQuizData } from '$lib/content/chapters/data/understanding-3d-space-quiz-data';
  import Keyword from '$lib/components/Keyword.svelte';
  import AxisExplorer from '$lib/components/visualization/AxisExplorer.svelte';

  // State for completion
  let isCalibrationComplete = false;

  // Function to mark completion - Dialog handled by child
  function handleCalibrationComplete() {
    console.log("[Parent] Calibration Complete event received!");
    isCalibrationComplete = true;
  }
</script>

<article>
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
    <Quiz questions={coordinateQuizData} showFeedback={true} />
  </SectionReview>
</article>

<style lang="scss">

</style>
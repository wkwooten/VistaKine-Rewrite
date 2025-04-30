<script lang="ts">
  import { currentSection } from "$lib/stores/appState.js";
  import { intersect, type IntersectDetail } from "$lib/utils/intersection";
  import FormulaAccordion from "$lib/components/FormulaAccordion.svelte";
  import SectionReview from "$lib/components/SectionReview.svelte";
  import Quiz from "$lib/components/Quiz.svelte";
  import Scenario from "$lib/components/Scenario.svelte";
  import extractKeywords from "$lib/utils/keywordExtractor.js";
  import PrinterCalibrationExercise from "$lib/components/visualization/interactions/printer-calibration/PrinterCalibrationExercise.svelte";
  import { coordinateQuizData } from "$lib/content/chapters/data/quizzes/understanding-3d-space-quiz-data";
  import Keyword from "$lib/components/Keyword.svelte";
  import AxisExplorer from "$lib/components/visualization/AxisExplorer.svelte";
  import { onMount } from "svelte"; // Import onMount if needed for intersection observer
  import ContentCard from "$lib/components/ContentCard.svelte"; // Import the new component

  // State for completion
  let isCalibrationComplete = false;

  // Function to mark completion - Dialog handled by child
  function handleCalibrationComplete() {
    console.log("[Parent] Calibration Complete event received!");
    isCalibrationComplete = true;
  }

  // Determine the section number (Assuming this is the first section of chapter 1)
  const sectionNumber = "1.1"; // Adjust if this is incorrect

  // Handle section intersection for navigation (Add this if needed for sidebar highlighting)
  function handleSectionIntersect(detail: {
    isIntersecting: boolean;
    intersectionRatio: number;
  }) {
    // Example: Set currentSection, adjust threshold as needed
    if (detail.isIntersecting && detail.intersectionRatio > 0.3) {
      // Assuming the store expects the slug 'coordinate-systems'
      currentSection.set("coordinate-systems");
    }
  }
</script>

<section
  id="coordinate-systems-section"
  data-section={sectionNumber}
  use:intersect={{
    threshold: [0.1, 0.3, 0.5],
    onIntersect: handleSectionIntersect,
  }}
>
  <div class="section-line" aria-hidden="true"></div>
  <div class="readable-content">
    <!-- Block 1: Section Introduction -->
    <ContentCard blockType="section-header-block" layoutWidth="full">
      <h2 id="coordinate-systems" data-nav-target="true">
        Section Introduction
      </h2>
      <p>
        _Placeholder: Describe what this section will cover and the introductory
        scenario._
      </p>
      <Scenario>
        <p data-speaker="Surya">
          <span class="speaker"><strong>Surya:</strong></span> Ugh, Leo, this printer
          manual keeps talking about X, Y, and Z coordinates. Why can't I just point
          and tell it 'print right there'?
        </p>
        <p data-speaker="Leo">
          <span class="speaker"><strong>Leo:</strong></span> Ah, but 'right
          there' isn't precise enough for a machine, Surya! It needs a common
          language, a <Keyword term="coordinate system" />, to know exactly
          where 'there' is in <Keyword term="3D space" />.
        </p>
        <p data-speaker="Surya">
          <span class="speaker"><strong>Surya:</strong></span> So, like the grid
          lines on the build plate?
        </p>
        <p data-speaker="Leo">
          <span class="speaker"><strong>Leo:</strong></span> Precisely! Think of
          it as a map. We use three perpendicular <Keyword term="axes" /> – usually
          X for width, Z for depth, and Y for height – all meeting at a starting
          point called the <Keyword term="origin" /> (0, 0, 0). Every point in the
          printer's volume has a unique X, Y, Z address.
        </p>
      </Scenario>
    </ContentCard>

    <!-- Block 2: Concept - Need for 3D -->
    <ContentCard blockType="concept-block" layoutWidth="full">
      <h2 id="why-three-dimensions" data-nav-target="true">
        Why Three Dimensions?
      </h2>
      <p>
        Giving simple directions like "5 steps forward, 3 steps left" works well
        on a flat surface (2D). But how do you describe reaching for a high
        shelf or pinpointing a drone? You need a third dimension – height!
      </p>
      <p>
        To map locations precisely in the space around us, we use three
        reference lines, or <strong>axes</strong> (<strong>X</strong>,
        <strong>Y</strong>, and <strong>Z</strong>), which meet at a single
        point called the <strong>origin</strong>. This <Keyword
          term="Cartesian coordinate system"
        /> is the standard map for <Keyword term="3D space" />. Engineers
        typically orient these using a <Keyword
          term="right-handed coordinate system"
        /> convention.
      </p>
    </ContentCard>

    <!-- Block 3: Visualization - Axis Explorer -->
    <ContentCard
      blockType="visualization-block"
      class="visualization-card"
      layoutWidth="condensed"
    >
      <h2 id="axis-explorer" data-nav-target="true">Exploring the Axes</h2>
      <figure>
        <AxisExplorer />
        <figcaption>
          Use your mouse to rotate (left-click drag), pan (right-click drag),
          and zoom (scroll wheel) the view.
        </figcaption>
      </figure>
      <p>
        Notice how the <span style="color: var(--axis-color-x);">X (Red)</span>,
        <span style="color: var(--axis-color-y);">Y (Green)</span>, and
        <span style="color: var(--axis-color-z);">Z (Blue)</span>
        axes represent the three dimensions, all meeting at the
        <strong>Origin</strong> at (0,0,0).
      </p>
    </ContentCard>

    <!-- Block 4: Concept - Application to 3D Printing -->
    <ContentCard blockType="concept-block" layoutWidth="full">
      <h2 id="coordinates-in-3d-space" data-nav-target="true">
        Coordinates in 3D Space
      </h2>
      <p>
        Now, let's see this system in action with a 3D printer. Imagine a device
        with a small nozzle that needs to move *very precisely* to build objects
        layer by layer. How does it know where to go? It uses those same axes!
      </p>
      <ul>
        <li>
          The <strong>X-axis</strong> guides movement left and right (width).
        </li>
        <li>
          The <strong>Z-axis</strong> guides movement forward and backward (depth).
        </li>
        <li>
          The <strong>Y-axis</strong> guides movement up and down (height).
        </li>
      </ul>
      <p>
        The point where these axes meet is known as the <strong>origin</strong>,
        some times it is called the zero point. When someone refers to 'zeroing'
        the printer, they are referring to setting the origin to the current
        position of the nozzle.
      </p>
      <p>
        By telling the printer exactly how far to travel along each axis from
        this origin (e.g., "move 50 units along X, 20 units along Y, 30 units
        along Z"), it reaches a unique point in its workspace. These axes
        typically form a <Keyword term="right-handed coordinate system" />, a
        standard orientation used in engineering. This precise control is key!
      </p>
    </ContentCard>

    <!-- Block 5: Activity - Printer Calibration -->
    <ContentCard blockType="visualization-block" class="-exercise">
      <h2 id="printer-calibration" data-nav-target="true">
        Hands-On: Printer Calibration
      </h2>

      <p class="exercise-description">
        Help Surya calibrate her 3D printer by moving the nozzle to the target
        points. Use the control panel to enter X, Y, and Z coordinates, then
        press the "Move" button to position the nozzle. Try to hit all the
        targets to complete the calibration.
      </p>

      <PrinterCalibrationExercise
        on:calibrationComplete={handleCalibrationComplete}
      />

      <p>
        In the calibration exercise, by inputting specific <strong>X</strong>,
        <strong>Y</strong>, and <strong>Z</strong> coordinates, you directed the
        printer nozzle to precise locations within its 3D workspace. You saw
        firsthand how the <strong>X-axis</strong> controls horizontal movement
        (width), the <strong>Y-axis</strong> controls vertical movement
        (height), and the <strong>Z-axis</strong> controls movement in depth,
        all relative to the starting <strong>origin</strong> (0, 0, 0). Understanding
        how each coordinate uniquely contributes to defining a point is crucial!
      </p>
    </ContentCard>

    <!-- Block 6: Activity - Review/Quiz -->
    <ContentCard blockType="activity-block" class="-review" layoutWidth="full">
      <h2 id="section-review" data-nav-target="true">Section Review</h2>
      <SectionReview>
        <Quiz questions={coordinateQuizData} showFeedback={true} />
      </SectionReview>
    </ContentCard>
  </div>
</section>

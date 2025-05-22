<script lang="ts">
  import { currentSection } from "$lib/stores/appState.ts";
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
  import FullCoordinateExplorerExercise from "$lib/components/visualization/interactions/full-coordinate-explorer/FullCoordinateExplorerExercise.svelte"; // Added import

  // State for completion
  let isCalibrationComplete = false;

  // Function to mark completion - Dialog handled by child
  function handleCalibrationComplete() {
    console.log("[Parent] Calibration Complete event received!");
    isCalibrationComplete = true;
  }

  // Determine the section number (Assuming this is the first section of chapter 1)
  const sectionNumber = "1.1"; // Adjust if this is incorrect
</script>

<section id="coordinate-systems-section" data-section={sectionNumber}>
  <div class="section-line" aria-hidden="true"></div>
  <!-- Block 1: Section Introduction -->
  <ContentCard
    blockType="section-header-block"
    layoutWidth="full"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_coordinate-systems_intro"
  >
    <h2
      class="content-card-title"
      id="coordinate-systems"
      data-nav-target="true"
    >
      Section Introduction
    </h2>
    <p>
      Welcome to the world of 3D space! Ever wonder how a 3D printer knows
      exactly where to place material, or how a GPS pinpoints your location? It
      all relies on a fundamental concept: the <Keyword
        term="coordinate system"
      />. In this section, we'll break down how we use three dimensions (X, Y,
      and Z) to map out space, define precise locations using coordinates, and
      understand key terms like the origin and axes. We'll see how crucial this
      system is, especially when giving instructions to machines, as our
      characters Surya and Leo are about to discover.
    </p>
    <Scenario>
      <p data-speaker="Surya">
        <span class="speaker"><strong>Surya:</strong></span> Ugh, Leo, this printer
        manual keeps talking about X, Y, and Z coordinates. Why can't I just point
        and tell it 'print right there'?
      </p>
      <p data-speaker="Leo">
        <span class="speaker"><strong>Leo:</strong></span> Ah, but 'right there'
        isn't precise enough for a machine, Surya! It needs a common language, a <Keyword
          term="coordinate system"
        />, to know exactly where 'there' is in <Keyword term="3D space" />.
      </p>
      <p data-speaker="Surya">
        <span class="speaker"><strong>Surya:</strong></span> So, like the grid lines
        on the build plate?
      </p>
      <p data-speaker="Leo">
        <span class="speaker"><strong>Leo:</strong></span> Precisely! Think of
        it as a map. We use three perpendicular <Keyword term="axes" /> – usually
        X for width, Z for depth, and Y for height – all meeting at a starting point
        called the <Keyword term="origin" /> (0, 0, 0). Every point in the printer's
        volume has a unique X, Y, Z address.
      </p>
    </Scenario>
  </ContentCard>

  <!-- Block 2: Visualization - Axis Explorer -->
  <ContentCard
    blockType="visualization-block"
    class="visualization-card"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_coordinate-systems_axis-explorer-vis"
  >
    <h2 class="content-card-title" id="axis-explorer" data-nav-target="true">
      Exploring the Axes
    </h2>
    <p>
      To map locations precisely in the space around us, we use three reference
      lines, or <strong>axes</strong> (yes, the plural of axis is axes). Each
      line points in a different direction, and all axes meet at a single point
      called the <strong>origin</strong>. This <Keyword
        term="Cartesian coordinate system"
      /> is the standard map for <Keyword term="3D space" />. Engineers
      typically orient these using a <Keyword
        term="right-handed coordinate system"
      /> convention. Take a look at the visualization below to see how these three
      axes meet at the origin.
    </p>
    <figure>
      <AxisExplorer />
      <figcaption>
        Use your mouse to rotate (left-click drag), pan (right-click drag), and
        zoom (scroll wheel) the view.
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

  <!-- Block 3: Concept - Why Three Dimensions? & Your Choice of Reference -->
  <ContentCard
    blockType="concept-block"
    layoutWidth="full"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_coordinate-systems_why-three-dimensions"
  >
    <h2
      class="content-card-title"
      id="why-three-dimensions"
      data-nav-target="true"
    >
      Why Three Dimensions? Your Choice of Reference
    </h2>
    <p>
      Why do we need three dimensions? Simple directions like "5 steps forward,
      3 steps left" work on a flat surface (2D). But to describe reaching for a
      high shelf, or navigating a drone, you need a third dimension: height!
      This is why we map space using three perpendicular <strong>axes</strong>
      (like X, Y, Z) that meet at a central <strong>origin</strong>.
    </p>
    <p>
      Crucially, this system is your **frame of reference**. You get to choose
      where the <strong>origin</strong> (the zero point) is and which way your
      <strong>axes</strong>
      point. While conventions like the <strong>right-handed system</strong>
      exist, the fundamental frame is yours to define! Picking the right frame can
      make complex problems much simpler – like choosing Earth's center as the origin
      for tracking satellites. Remember, the <em>coordinates</em>
      change with your choice, but the <strong>actual physical location</strong>
      in space remains the same.
    </p>
  </ContentCard>

  <!-- Block 4: Interactive Full Coordinate Explorer -->
  <ContentCard
    blockType="visualization-block"
    class="-exercise"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_coordinate-systems_full-coordinate-explorer-exercise"
  >
    <h2
      class="content-card-title"
      id="full-coordinate-explorer"
      data-nav-target="true"
    >
      Interactive: Full Coordinate Explorer
    </h2>
    <figure>
      <FullCoordinateExplorerExercise />
      <figcaption>
        Use the input fields to change the X, Y, and Z coordinates and see the
        point move in the 3D space.
      </figcaption>
    </figure>
    <p>
      This interactive exercise allows you to explore the full Cartesian
      coordinate system, including negative values. Input different values for
      X, Y, and Z to understand how they define a point's position.
    </p>
  </ContentCard>

  <!-- Block 5: Concept - Application to 3D Printing -->
  <ContentCard
    blockType="concept-block"
    layoutWidth="full"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_coordinate-systems_application-3d-printing"
  >
    <h2
      class="content-card-title"
      id="coordinates-in-3d-space"
      data-nav-target="true"
    >
      Coordinates in 3D Space
    </h2>
    <p>
      Now, let's see this system in action with a 3D printer. Imagine a device
      with a small nozzle that needs to move <em>very precisely</em> to build objects
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
      By telling the printer exactly how far to travel along each axis from this
      origin (e.g., "move 50 units along X, 20 units along Y, 30 units along
      Z"), it reaches a unique point in its workspace. These axes typically form
      a <Keyword term="right-handed coordinate system" />, a standard
      orientation used in engineering. This precise control is key!
    </p>
  </ContentCard>

  <!-- Block 6: Activity - Printer Calibration -->
  <ContentCard
    blockType="visualization-block"
    class="-exercise"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_coordinate-systems_printer-calibration-exercise"
  >
    <h2
      class="content-card-title"
      id="printer-calibration"
      data-nav-target="true"
    >
      Hands-On: Printer Calibration
    </h2>

    <p class="exercise-description">
      Help Surya calibrate her 3D printer by moving the nozzle to the target
      points. Use the control panel to enter X, Y, and Z coordinates. Try to hit
      all the targets to complete the calibration.
    </p>

    <PrinterCalibrationExercise
      onCalibrationComplete={handleCalibrationComplete}
    />

    <p>
      In the calibration exercise, by inputting specific <strong>X</strong>,
      <strong>Y</strong>, and <strong>Z</strong> coordinates, you directed the
      printer nozzle to precise locations within its 3D workspace. You saw
      firsthand how the <strong>X-axis</strong> controls horizontal movement
      (width), the <strong>Y-axis</strong> controls vertical movement (height),
      and the <strong>Z-axis</strong> controls movement in depth, all relative
      to the starting <strong>origin</strong> (0, 0, 0). Understanding how each coordinate
      uniquely contributes to defining a point is crucial!
    </p>
  </ContentCard>

  <!-- Block 7: Activity - Review/Quiz -->
  <ContentCard
    blockType="activity-block"
    class="-review"
    layoutWidth="full"
    showBookmarkFeature={true}
    contentId="understanding-3d-space_coordinate-systems_section-review"
  >
    <h2 class="content-card-title" id="section-review" data-nav-target="true">
      Section Review
    </h2>
    <p>
      This section introduced the fundamental concepts of 3D coordinate systems.
      We learned why three dimensions (X, Y, Z) are necessary to precisely
      locate points in space, unlike 2D systems. Key terms included the <strong
        >axes</strong
      >
      (the reference lines), the
      <strong>origin</strong>
      (where axes meet, 0,0,0), and
      <strong>coordinates</strong> (the unique (x, y, z) address of a point).
    </p>
    <p>
      We saw how this system applies directly to 3D printing, guiding the
      nozzle's movement, and explored the common
      <strong>right-handed coordinate system</strong> convention. Now, let's test
      your understanding with a quick quiz!
    </p>
    <SectionReview>
      <Quiz questions={coordinateQuizData} showFeedback={true} />
    </SectionReview>
  </ContentCard>
</section>

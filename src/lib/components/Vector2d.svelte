<script lang="ts">
  import P5 from "p5-svelte";
  import type P5Instance from "p5";

  let container: HTMLDivElement;

  // Helper function to get CSS variable value (similar to Vector1d)
  const getCSSVar = (
    varName: string,
    element: HTMLElement | null = container,
  ): string => {
    if (typeof window !== "undefined" && element) {
      return getComputedStyle(element).getPropertyValue(varName).trim();
    }
    // Provide fallbacks for SSR or if element isn't ready
    switch (varName) {
      case "--color-surface":
        return "#fefeff";
      case "--color-text-primary":
        return "#1f2937";
      case "--color-text-secondary":
        return "#37474F";
      case "--color-error": // Vector color
        return "#d32f2f";
      case "--color-accent-hover": // Potential hover color
        return "#1565C0";
      default:
        return "#000000";
    }
  };

  const sketch = (p5: P5Instance) => {
    let canvasSize = 400; // Initial size, can be made responsive

    // --- Vector State ---
    let vectorX = 4; // Example X component
    let vectorY = -3; // Example Y component (negative Y is up in p5)

    // --- Theming --- (Populated in setup)
    let bgColor: string;
    let primaryTextColor: string;
    let secondaryTextColor: string;
    let vectorColor: string;

    let pixelsPerUnit = 20; // Scale factor
    let originX: number;
    let originY: number;

    p5.setup = () => {
      if (container) {
        // Make it square based on width, or use fixed size
        canvasSize = container.clientWidth;
        // Min size to prevent issues
        canvasSize = Math.max(canvasSize, 200);
      } else {
        console.warn(
          "P5 container not found during setup, using fallback size and colors.",
        );
        canvasSize = 400;
      }

      // Read theme colors
      bgColor = getCSSVar("--color-surface");
      primaryTextColor = getCSSVar("--color-text-primary");
      secondaryTextColor = getCSSVar("--color-text-secondary");
      vectorColor = getCSSVar("--color-error");

      p5.createCanvas(canvasSize, canvasSize);
      p5.background(bgColor);
      originX = p5.width / 2;
      originY = p5.height / 2;

      // Calculate scale based on initial size to fit roughly -10 to +10
      pixelsPerUnit = p5.width / 25;

      p5.noLoop(); // Static drawing for now
    };

    p5.draw = () => {
      // Update origin and scale based on current dimensions
      originX = p5.width / 2;
      originY = p5.height / 2;
      pixelsPerUnit = p5.width / 25; // Keep scale consistent with canvas size

      // --- Redraw background and axes ---
      p5.background(bgColor);
      p5.stroke(secondaryTextColor);
      p5.strokeWeight(1);
      p5.fill(primaryTextColor);
      p5.textSize(12);
      p5.textAlign(p5.CENTER, p5.CENTER);

      // Draw Grid Lines (optional, but helpful)
      p5.stroke(secondaryTextColor + "40"); // Lighter grid lines
      for (let x = -10; x <= 10; x++) {
        const gridX = originX + x * pixelsPerUnit;
        p5.line(gridX, 0, gridX, p5.height);
      }
      for (let y = -10; y <= 10; y++) {
        const gridY = originY + y * pixelsPerUnit;
        p5.line(0, gridY, p5.width, gridY);
      }

      // Draw Axes (thicker)
      p5.stroke(secondaryTextColor);
      p5.strokeWeight(2);
      p5.line(0, originY, p5.width, originY); // X-axis
      p5.line(originX, 0, originX, p5.height); // Y-axis

      // Axis Labels (X, Y)
      p5.fill(primaryTextColor);
      p5.noStroke();
      p5.text("X", p5.width - 10, originY - 10);
      p5.text("Y", originX + 10, 10);

      // --- Draw Vector ---
      const vectorEndX = originX + vectorX * pixelsPerUnit;
      // In p5, positive Y is down, so subtract vectorY for standard math coords
      const vectorEndY = originY - vectorY * pixelsPerUnit;
      const arrowSize = 8;

      p5.stroke(vectorColor);
      p5.strokeWeight(3);
      p5.fill(vectorColor);

      // Vector Line
      p5.line(originX, originY, vectorEndX, vectorEndY);

      // Arrowhead (using vector math for direction)
      let angle = p5.atan2(vectorEndY - originY, vectorEndX - originX);
      p5.push(); // Isolate transformations
      p5.translate(vectorEndX, vectorEndY);
      p5.rotate(angle);
      p5.line(0, 0, -arrowSize, -arrowSize / 2);
      p5.line(0, 0, -arrowSize, arrowSize / 2);
      p5.pop(); // Restore previous drawing state

      // --- Display Value ---
      p5.noStroke();
      p5.fill(primaryTextColor);
      p5.textSize(20);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.text(
        `Vector: (${vectorX}, ${vectorY})`,
        10, // Position text at top-left
        10,
      );

      p5.noLoop(); // Stop loop after first draw
    };

    p5.windowResized = () => {
      if (container) {
        canvasSize = container.clientWidth;
        canvasSize = Math.max(canvasSize, 200);
        p5.resizeCanvas(canvasSize, canvasSize);
        p5.background(getCSSVar("--color-surface"));
        p5.redraw(); // Redraw on resize
      }
    };
  };
</script>

<div class="p5-container" bind:this={container}>
  <P5 {sketch} />
</div>

<style>
  .p5-container {
    width: 100%;
    max-width: 500px; /* Optional: Limit max size */
    margin: var(--space-m) auto; /* Center the container */
  }

  .p5-container :global(canvas) {
    display: block;
    border: 1px solid var(--color-border);
    /* Make width responsive, height matches width for square aspect */
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
  }
</style>

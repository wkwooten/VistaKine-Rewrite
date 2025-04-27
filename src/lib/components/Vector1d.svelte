<script lang="ts">
  import P5 from "p5-svelte";
  import type P5Instance from "p5";

  let container: HTMLDivElement;

  // Helper function to get CSS variable value
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
      case "--color-error":
        return "#d32f2f";
      case "--color-accent-hover": // Fallback hover color added
        return "#1565C0";
      default:
        return "#000000"; // Default fallback
    }
  };

  const sketch = (p5: P5Instance) => {
    const canvasHeight = 150; // Adjusted height for interaction space
    let currentCanvasWidth = 0;

    // --- State for Interactivity ---
    let vectorValue = 6; // Initial value
    let isDragging = false; // Is the user currently dragging the arrowhead?
    let isHovering = false; // Is the mouse hovering over the arrowhead?
    const arrowheadHitRadius = 20; // Clickable area around the arrowhead tip (pixels)
    let pixelsPerUnit = 30; // Keep this, recalculate in draw

    // --- Theme Colors (will be updated in setup) ---
    let bgColor: string;
    let primaryTextColor: string;
    let secondaryTextColor: string;
    let vectorColor: string;
    let vectorHoverColor: string; // Color for hover/drag state

    p5.setup = () => {
      if (container) {
        currentCanvasWidth = container.clientWidth;
        bgColor = getCSSVar("--color-surface");
        primaryTextColor = getCSSVar("--color-text-primary");
        secondaryTextColor = getCSSVar("--color-text-secondary");
        vectorColor = getCSSVar("--color-error");
        vectorHoverColor = getCSSVar("--color-accent-hover"); // Read hover color
      } else {
        currentCanvasWidth = 400;
        console.warn(
          "P5 container not found during setup, using fallback width and colors.",
        );
        bgColor = "#fefeff";
        primaryTextColor = "#1f2937";
        secondaryTextColor = "#37474F";
        vectorColor = "#d32f2f";
        vectorHoverColor = "#1565C0"; // Use fallback hover color
      }
      p5.createCanvas(currentCanvasWidth, canvasHeight);
      // No p5.noLoop() here - we need continuous updates for interaction
    };

    p5.draw = () => {
      // Recalculate dimensions and scale dynamically
      const axisY = p5.height / 2;
      const axisPadding = 20;
      const axisLength = p5.width - 2 * axisPadding;
      const originX = axisPadding + axisLength / 2;
      pixelsPerUnit = axisLength / 20; // Recalculate scale based on current width (-10 to +10 range)

      // Calculate current vector end position
      const vectorEndX = originX + vectorValue * pixelsPerUnit;
      const vectorStartY = axisY;
      const arrowSize = 10;

      // --- Check Hover State ---
      let distToArrowhead = p5.dist(
        p5.mouseX,
        p5.mouseY,
        vectorEndX,
        vectorStartY,
      );
      isHovering = distToArrowhead < arrowheadHitRadius;

      // --- Update Cursor ---
      if (isHovering || isDragging) {
        p5.cursor(p5.HAND);
      } else {
        p5.cursor(p5.ARROW);
      }

      // --- Drawing ---
      // Update colors in case they changed (less critical now loop runs)
      bgColor = getCSSVar("--color-background");
      primaryTextColor = getCSSVar("--color-text-primary");
      secondaryTextColor = getCSSVar("--color-text-secondary");
      vectorColor = getCSSVar("--color-error");
      vectorHoverColor = getCSSVar("--color-accent-hover");

      p5.background(bgColor);
      p5.stroke(secondaryTextColor);
      p5.strokeWeight(1);
      p5.fill(primaryTextColor);
      p5.textSize(20); // Adjusted text size
      p5.textAlign(p5.CENTER, p5.TOP);

      // Axis
      p5.line(axisPadding, axisY, axisPadding + axisLength, axisY);

      // --- Draw Tick Marks and Labels ---
      const tickLength = 5;
      p5.stroke(secondaryTextColor); // Use secondary color for ticks
      p5.fill(primaryTextColor); // Use primary color for labels
      p5.textSize(16); // Smaller text size for labels
      p5.textAlign(p5.CENTER, p5.TOP);

      for (let i = -10; i <= 10; i += 2) {
        const x = originX + i * pixelsPerUnit;
        p5.line(x, axisY - tickLength, x, axisY + tickLength); // Draw tick line

        // Draw label, but skip 0 because we have "Origin"
        if (i !== 0) {
          p5.text(i.toString(), x, axisY + tickLength + 15); // Position label below tick
        }
      }

      // Reset text size for other elements if needed (Origin label already uses 20)
      p5.textSize(20);
      p5.textAlign(p5.CENTER, p5.TOP); // Reset alignment for Origin label

      // Origin Tick & Label (Keep this specific label)
      p5.stroke(secondaryTextColor); // Ensure stroke is set correctly for origin tick
      p5.strokeWeight(1); // Ensure stroke weight is reset
      p5.line(originX, axisY - 5, originX, axisY + 5); // Draw origin tick slightly longer or same
      p5.fill(primaryTextColor); // Ensure fill is set for text
      p5.text("Origin", originX, axisY + 15);

      // --- Draw Vector ---
      let currentVectorColor =
        isHovering || isDragging ? vectorHoverColor : vectorColor;
      p5.stroke(currentVectorColor);
      p5.strokeWeight(4);
      p5.fill(currentVectorColor);

      // Vector Line
      p5.line(originX, vectorStartY, vectorEndX, vectorStartY);

      // Arrowhead
      if (vectorValue > 0) {
        p5.line(
          vectorEndX,
          vectorStartY,
          vectorEndX - arrowSize,
          vectorStartY - arrowSize / 2,
        );
        p5.line(
          vectorEndX,
          vectorStartY,
          vectorEndX - arrowSize,
          vectorStartY + arrowSize / 2,
        );
      } else if (vectorValue < 0) {
        p5.line(
          vectorEndX,
          vectorStartY,
          vectorEndX + arrowSize,
          vectorStartY - arrowSize / 2,
        );
        p5.line(
          vectorEndX,
          vectorStartY,
          vectorEndX + arrowSize,
          vectorStartY + arrowSize / 2,
        );
      }

      // Visual cue for hover/drag area (optional circle)
      if (isHovering || isDragging) {
        p5.noFill();
        p5.stroke(vectorHoverColor);
        p5.strokeWeight(1);
        p5.ellipse(
          vectorEndX,
          vectorStartY,
          arrowheadHitRadius * 2,
          arrowheadHitRadius * 2,
        );
      }

      // Value Display
      p5.noStroke();
      p5.fill(primaryTextColor);
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      // Round the displayed value for neatness
      p5.text(
        `Vector: ${vectorValue >= 0 ? "+" : ""}${vectorValue.toFixed(1)}`, // Show + for positive/zero
        originX,
        axisY - 30,
      );

      // No p5.noLoop() at the end of draw
    };

    p5.mousePressed = () => {
      // Recalculate vector end position for accurate check
      const axisY = p5.height / 2;
      const axisPadding = 20;
      const axisLength = p5.width - 2 * axisPadding;
      const originX = axisPadding + axisLength / 2;
      // Use the current pixelsPerUnit calculated in draw
      const vectorEndX = originX + vectorValue * pixelsPerUnit;
      const vectorStartY = axisY;

      // Check if the click is within the hit radius of the arrowhead
      if (
        p5.dist(p5.mouseX, p5.mouseY, vectorEndX, vectorStartY) <
        arrowheadHitRadius
      ) {
        isDragging = true;
      }
    };

    p5.mouseDragged = () => {
      if (isDragging) {
        // Recalculate necessary values inside drag
        const axisPadding = 20;
        const axisLength = p5.width - 2 * axisPadding;
        const originX = axisPadding + axisLength / 2;
        // Use the current pixelsPerUnit
        if (pixelsPerUnit === 0) return; // Avoid division by zero if width is too small

        // Calculate the new value based on mouse X relative to origin
        let newValue = (p5.mouseX - originX) / pixelsPerUnit;

        // Clamp the value to the visible range (-10 to +10)
        newValue = p5.constrain(newValue, -10, 10);

        vectorValue = newValue;
      }
    };

    p5.mouseReleased = () => {
      isDragging = false;
      // Optional: Could add p5.noLoop() here and p5.loop() in mousePressed/Dragged
      // if you want to optimize and only redraw during interaction.
    };

    p5.windowResized = () => {
      if (container) {
        currentCanvasWidth = container.clientWidth;
        p5.resizeCanvas(currentCanvasWidth, canvasHeight);
        // Background will be redrawn in the next draw() call, no need to explicitly call background/redraw here
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
    margin-block: var(--space-s);
    /* Remove padding if you want canvas border flush with container */
    /* padding: var(--space-s); */
  }

  .p5-container :global(canvas) {
    display: block;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    cursor: default; /* Default cursor, will be changed by p5 */
  }
</style>

<script lang="ts">
  // Correct import path
  import P5 from "p5-svelte";
  import type P5Instance from "p5"; // p5 type import remains the same

  const sketch = (p5: P5Instance) => {
    const canvasWidth = 400;
    const canvasHeight = 75; // Reduced height
    const axisY = canvasHeight / 2;
    const axisPadding = 20;
    const axisLength = canvasWidth - 2 * axisPadding;

    let vectorValue = 6; // Example vector value (+6 units)
    let pixelsPerUnit = 30; // How many pixels represent 1 unit

    p5.setup = () => {
      p5.createCanvas(canvasWidth, canvasHeight);
      p5.background(245); // Light background
    };

    p5.draw = () => {
      p5.background(245); // Redraw background each frame (optional, useful if animating later)
      p5.stroke(0); // Black lines
      p5.strokeWeight(1);
      p5.fill(0); // Black text
      p5.textSize(12);
      p5.textAlign(p5.CENTER, p5.TOP);

      // --- Draw Axis ---
      p5.line(axisPadding, axisY, axisPadding + axisLength, axisY);

      // --- Draw Origin Tick and Label ---
      const originX = axisPadding + axisLength / 2; // Center the origin
      p5.line(originX, axisY - 5, originX, axisY + 5);
      p5.text("0", originX, axisY + 8);

      // --- Draw Vector ---
      const vectorEndX = originX + vectorValue * pixelsPerUnit;
      const vectorStartY = axisY; // Vector starts on the axis
      const arrowSize = 6;

      p5.stroke(255, 0, 0); // Red vector
      p5.strokeWeight(2);
      p5.fill(255, 0, 0);

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
      // If vectorValue is 0, no arrow is drawn

      // --- Display Value ---
      p5.noStroke();
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.text(
        `Vector: ${vectorValue > 0 ? "+" : ""}${vectorValue}`,
        originX,
        axisY - 15,
      );

      p5.noLoop(); // Since it's static for now, stop the draw loop
    };

    // Optional: Could add interaction later to change vectorValue
    // p5.mousePressed = () => {
    //   vectorValue =
    // p5.random(-10, 10); // Example random value on click
    //   p5.loop(); // Redraw once
    //   p5.noLoop();
    // };
  };
</script>

<div class="p5-container">
  <!-- The component usage remains the same -->
  <P5 {sketch} />
</div>

<style>
  /* Styles remain the same */
  .p5-container :global(canvas) {
    display: block;
    width: 100%;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    margin-top: var(--space-s);
  }
  .p5-container {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
  }
</style>

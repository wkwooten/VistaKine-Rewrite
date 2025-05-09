# Vector Printer Exercise Plan

## Overall Goal

Create an interactive 3D exercise to teach basic vector operations (addition, subtraction, and scalar multiplication) using a 3D printer nozzle metaphor. The exercise will guide users through defining vectors to "print" a simple path or shape, visually demonstrating the outcome of each operation.

## Core Components (to be created/adapted from @printer-calibration)

- **`VectorPrinterExercise.svelte`**: The main wrapper component, orchestrating the scene, HUD, and controls. (Analogous to `PrinterCalibrationExercise.svelte`)
- **`VectorPrinterScene.svelte`**: The Threlte-based 3D scene displaying the printer nozzle, the "printed" path/segments, and visual representations of vectors. (Analogous to `PrinterCalibrationScene.svelte`)
- **`VectorPrinterHud.svelte`**: Displays information such as current nozzle position, vector components being defined, results of operations, and instructional prompts. (Analogous to `PrinterCalibrationHud.svelte`)
- **`VectorOperationControls.svelte`**: UI panel for users to input vector components, select operations, and trigger actions (e.g., "Print Segment", "Apply Scalar"). This will be adapted from `NozzleControlPanel.svelte` or created anew if significantly different.
- **`DialogBox.svelte`**: (Existing component) To be integrated for providing contextual instructions, feedback, and narrative elements from characters (Surya, Leo).

## Current Status

The core components (`VectorPrinterExercise.svelte`, `VectorPrinterScene.svelte`, `VectorPrinterHud.svelte`, `VectorOperationControls.svelte`) have been created in the `src/lib/components/visualization/interactions/vector-printer/` directory.

A generic `Button.svelte` component has been created at `src/lib/components/ui/Button.svelte` and is used by `VectorOperationControls.svelte`. Standard HTML `<input type="number">` elements are being used for vector component inputs for now, as a dedicated `NumberInput.svelte` component was not found/created.

`VectorPrinterScene.svelte` has been configured to use the existing `CoordinateAxes.svelte` component for static axes and `ThreeArrowHelper` (from `three`) for dynamically displaying the vector currently being defined. It correctly imports specific color stores from `themeColors.ts`.

`VectorPrinterExercise.svelte` has been integrated into `src/lib/content/chapters/understanding-3d-space/sections/basic-vector-operations.svelte`, replacing the visualization placeholder. Basic structural linter errors across the components have been resolved, and the project should now be in a runnable state for development.

We are ready to proceed with implementing the specific interaction logic for Phase 1 (Vector Addition).

## Phased Implementation

### Phase 1: Vector Addition

- **Concept:** Understand head-to-tail vector addition and the calculation of resultant vectors.
- **Task:** Guide the user to print a simple multi-segment path (e.g., an 'L' shape or the base of a small square).
- **Interaction:**
  1.  User defines `Vector A` (e.g., `⟨Ax, Ay, Az⟩`) via the `VectorOperationControls.svelte`.
  2.  User action (e.g., "Print Segment") moves the nozzle according to `Vector A`, and a visual representation of the segment is rendered.
  3.  User defines `Vector B`, with its origin implicitly at the head of `Vector A`.
  4.  User action moves the nozzle by `Vector B`, printing the next segment.
- **Visuals in `VectorPrinterScene.svelte`:**
  - Display the 3D printer nozzle.
  - Render "extruded" blocks or cylinders for each printed segment.
  - Show graphical representations (arrows) for `Vector A`, `Vector B`, and the resultant vector from the start of A to the end of B.
- **Information in `VectorPrinterHud.svelte`:**
  - Current nozzle coordinates.
  - Components of the currently defined vector.
  - Display the calculation for the resultant: `R = A + B`.
- **Dialog Integration:** Introduce the concept of vector addition through character dialogue.

### Phase 2: Vector Subtraction

- **Concept:** Understand vector subtraction as finding the difference between two vector states or as adding the negative of a vector.
- **Task Examples:**
  1.  **Finding Change:** "The nozzle moved from point P1 (defined by `Vector P1_origin`) to P2 (defined by `Vector P2_origin`). What vector `V_change` represents this displacement (i.e., `V_change = P2_origin - P1_origin`)?"
  2.  **Correction/Return:** "The last segment printed was `Vector B`. What vector is needed to return the nozzle to its position _before_ `Vector B` was printed (i.e., calculate `-B`)?"
- **Interaction:** User inputs components for the target vector based on prompts.
- **Visuals:** Show the vectors involved (e.g., `P1_origin`, `P2_origin`, `V_change` or `B` and `-B`).
- **Dialog Integration:** Explain subtraction scenarios.

### Phase 3: Scalar Multiplication

- **Concept:** Understand how multiplying a vector by a scalar changes its magnitude and potentially reverses its direction.
- **Task Examples:**
  1.  Define a base `Vector C`.
  2.  "Print a segment that is `2 * Vector C`."
  3.  "Now, print a segment that is `-0.5 * Vector C` from the current position."
- **Interaction:** User inputs the scalar value and applies it to a pre-defined or user-defined vector.
- **Visuals:** Show the original vector `C` and the resulting scaled vector (e.g., `2C` being twice as long, `-0.5C` being half as long and pointing opposite).
- **Dialog Integration:** Explain how scalars affect vectors.

## UI/UX Considerations

- **Reduce Input Fatigue:**
  - Start with guided inputs for specific components.
  - Potentially introduce interactive 3D gizmos for vector manipulation later, if feasible.
- **Clarity and Feedback:**
  - Ensure clear visual distinction between defined vectors, resultant vectors, and printed segments.
  - Provide immediate feedback in the HUD and scene upon user actions.
- **Progression:** Structure the exercise with increasing complexity, starting with simple addition.
- **Control Panel Design:** `VectorOperationControls.svelte` should be intuitive for defining components and selecting operations without overwhelming the user. Consider dynamically showing relevant inputs based on the current operation.

## Dialog System Integration (`DialogBox.svelte`)

- A state machine or sequence manager within `VectorPrinterExercise.svelte` will control the flow of dialog turns.
- Dialog turns will be passed as props to `DialogBox.svelte`.
- Content for dialog turns will be defined, likely as an array of objects, providing context and instructions for each step of the exercise.

## Future Enhancements (Post-MVP)

- More complex shapes to print.
- "Challenge modes" with less guidance.
- Free-form "sandbox mode."
- Integration of interactive 3D gizmos for vector manipulation.

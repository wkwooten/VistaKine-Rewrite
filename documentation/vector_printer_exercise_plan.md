# Vector Printer Exercise Plan

## Overall Goal

Create an interactive 3D exercise to teach basic vector operations (addition, subtraction, and scalar multiplication) using a 3D printer nozzle metaphor. The exercise will guide users through defining vectors to "print" a simple path or shape, visually demonstrating the outcome of each operation.

## Core Components (to be created/adapted from @printer-calibration)

- **`VectorPrinterExercise.svelte`**: The main wrapper component, orchestrating the scene, HUD, and controls. (Analogous to `PrinterCalibrationExercise.svelte`)
- **`VectorPrinterScene.svelte`**: The Threlte-based 3D scene displaying the printer nozzle, the "printed" path/segments, and visual representations of vectors. (Analogous to `PrinterCalibrationScene.svelte`)
- **`VectorPrinterHud.svelte`**: Displays information such as current nozzle position, vector components being defined, results of operations, and instructional prompts. (Analogous to `PrinterCalibrationHud.svelte`)
- **`VectorOperationControls.svelte`**: UI panel for users to input vector components, select operations, and trigger actions (e.g., "Print Segment", "Apply Scalar"). This will be adapted from `NozzleControlPanel.svelte` or created anew if significantly different.
- **`DialogBox.svelte`**: (Existing component) To be integrated for providing contextual instructions, feedback, and narrative elements from characters (Surya, Leo).

## Current Status & Debugging Log

The core components (`VectorPrinterExercise.svelte`, `VectorPrinterScene.svelte`, `VectorPrinterHud.svelte`, `VectorOperationControls.svelte`) have been created and integrated. The primary focus has been on implementing Phase 1: Vector Addition.

**Key Developments & Debugging Steps:**

- **State Management:**
  - `VectorPrinterExercise.svelte` manages `nozzlePosition`, `definedVectors` (array of printed vector objects), and `resultantVector`.
  - `currentDefiningVectorStore` (Svelte store) holds the vector components being input by the user.
  - Props are passed down to `VectorPrinterScene.svelte` including `definedVectors`, `resultantVector`, `currentVectorOrigin` (current nozzle position), and `sequenceStartOrigin` (initial nozzle position).
- **Reactivity and Scene Updates:**
  - Initial attempts to use a single `useTask` hook in `VectorPrinterScene.svelte` to manage all dynamic `ArrowHelper` instances (for current defining vector, printed vectors A/B, and resultant R) led to excessive re-runs and issues with persistent arrows not appearing.
  - The logic was refactored into three separate `$effect` blocks in `VectorPrinterScene.svelte`:
    1.  One for the `currentDisplayVectorHelper` (reacting to `$currentDefiningVectorStore` and `currentVectorOrigin`).
    2.  One for `definedVectorArrows` (reacting to `definedVectors` and `sequenceStartOrigin` props).
    3.  One for `resultantVectorArrow` (reacting to `resultantVector` and `sequenceStartOrigin` props).
  - This separation significantly reduced console noise from rapid effect execution.
- **Input Handling:**
  - An issue in `AxisInput.svelte` preventing `onValueChange` from firing on keyboard input (only steppers worked) was identified and fixed by adding an `oninput` handler. Keyboard input now correctly updates `currentDefiningVectorStore`.
- **Prop Flow:**
  - A missing `sequenceStartOrigin` prop in `sceneProps` (passed from `VectorPrinterExercise.svelte` to `VectorPrinterScene.svelte`) was identified and added. This ensures helper arrows are positioned relative to the correct starting point of the entire vector sequence.
- **Rendering `ArrowHelper` Objects:**
  - **Current Core Issue:** Dynamically created `THREE.ArrowHelper` instances are not rendering in the scene, even when logs indicate their backing instances (`_currentHelperInstance`, etc.) are created, visible, and have correct parameters.
  - The Threlte declarative syntax `<T is={arrowHelperInstance} />` was initially suspected.
  - **Debugging Imperative Approach:** The `$effect` for `currentDisplayVectorHelper` was modified to manage its `ArrowHelper` instance imperatively:
    - Using `useThrelte().scene` to get a scene reference.
    - Calling `scene.add(_currentHelperInstance)` upon creation.
    - Setting `_currentHelperInstance.visible = true/false` directly.
    - The corresponding `<T is={currentDisplayVectorHelper} />` was removed from the template.
  - **Debug Test with Hardcoded Arrow:** To further isolate the problem, the imperative logic for `_currentHelperInstance` was modified to create a hardcoded, bright red `ArrowHelper` at the world origin on its first run (`_currentHelperInstance.userData.isDebug = true`).
  - **Outcome of Debug Test (Pending):** The immediate next step is to verify if this hardcoded debug arrow appears.
    - If it _does_ appear, the issue likely lies in the parameters (origin, direction, length, color) being fed to the `ArrowHelper` constructor in the original, non-debug logic, or how these are updated.
    - If it does _not_ appear, the problem is more fundamental, possibly related to `scene.add()` not working in this context, camera setup, or the Threlte render loop failing to pick up these imperative scene changes for `ArrowHelper` objects.

The plan for Phase 1 (Vector Addition) remains the target, but resolving the rendering of `ArrowHelper` objects is the current blocker.

## Phased Implementation

### Phase 1: Vector Addition

- **Concept:** Understand head-to-tail vector addition and the calculation of resultant vectors.
- **Task:** Guide the user to print a simple multi-segment path (e.g., an 'L' shape). The exercise will involve defining Vector A, then Vector B.
- **Mode:** Exclusively "Tip-to-Tail" for this exercise. Vectors are added sequentially, with the origin of the next vector starting at the head of the previous one.
- **State Management (`VectorPrinterExercise.svelte`):**
  - `nozzlePosition`: `Vector3` - Current position of the printer nozzle (origin for the _next_ vector to be defined). Initialized to align with `CoordinateAxes` origin on the `PrinterBed`.
  - `definedVectors`: `Array<{ vector: Vector3, name: string, color: ColorRepresentation, id: string }>` - Stores vectors that have been "printed". Each object includes the vector, a display name (e.g., "A", "B"), its color, and a unique ID for Svelte's keyed `{#each}` blocks.
  - `resultantVector`: `Vector3 | null` - Represents the sum of all `definedVectors`. Calculated and becomes non-null after at least two vectors are defined.
  - `currentDefiningVectorStore`: (Svelte store, `Vector3`) - The vector currently being input by the user via `VectorOperationControls.svelte`.
- **Interaction & Workflow (Example for A + B = R):**
  1.  Initial state: `nozzlePosition` at start. `currentDefiningVectorStore` is `(0,0,0)`. `definedVectors` is empty. `resultantVector` is null.
  2.  User inputs components for the first vector (intended as `Vector A`) into `VectorOperationControls.svelte`. The scene shows a temporary arrow for `currentDefiningVectorStore` originating from `nozzlePosition`.
  3.  User clicks "Print Current Vector".
      - A new vector object (e.g., `{ vector: $currentDefiningVectorStore.clone(), name: "A", color: COLOR_A, id: uniqueId() }`) is added to `definedVectors`.
      - `nozzlePosition` updates to `nozzlePosition.add($currentDefiningVectorStore)`.
      - `$currentDefiningVectorStore` is reset to `(0,0,0)`.
      - The temporary arrow for definition is removed (or becomes zero length).
      - A persistent visual representation of Vector A is rendered in the scene, originating from its starting point.
  4.  User inputs components for the second vector (intended as `Vector B`). The scene shows a temporary arrow for `currentDefiningVectorStore` originating from the new `nozzlePosition` (which is the head of A).
  5.  User clicks "Print Current Vector".
      - A new vector object for Vector B is added to `definedVectors`.
      - `nozzlePosition` updates to the head of B.
      - `$currentDefiningVectorStore` is reset.
      - Persistent Vector B is rendered, tip-to-tail with A.
      - `resultantVector` is calculated by summing vectors in `definedVectors`.
      - A persistent visual representation of `resultantVector` (R) is rendered, originating from the tail of the first vector (A) to the head of the last defined vector (B).
- **Visuals in `VectorPrinterScene.svelte`:**
  - Display the 3D printer nozzle at `nozzlePosition`.
  - Render "extruded" blocks or cylinders for each "printed" segment represented in `definedVectors`.
  - Show persistent graphical arrows for each vector in `definedVectors` (e.g., Vector A, Vector B).
  - Show a persistent graphical arrow for the `resultantVector` (R) when it's calculated.
  - Display a dynamic `ArrowHelper` for `currentDefiningVectorStore` when its magnitude is greater than zero, originating from the current `nozzlePosition`.
  - Use `SceneLabel.svelte` to display 3D labels "A", "B", and "R" near their respective persistent arrows.
- **Information in `VectorPrinterHud.svelte`:**
  - Current `nozzlePosition`.
  - Display for `currentDefiningVectorStore`: Show its components (ΔX, ΔY, ΔZ). The label should be generic, e.g., "Current Input:" or "Defining Vector Components:", similar in style to `VectorOutputPanel.svelte` rather than a fixed "Vector A = ...".
  - Once printed, the HUD should list/display information for each vector in `definedVectors` (e.g., "Vector A: ⟨Ax, Ay, Az⟩") and for `resultantVector` ("Resultant R: ⟨Rx, Ry, Rz⟩").
  - Display the calculation for the resultant (e.g., "R = A + B") when R is visible.
- **`VectorOperationControls.svelte`:**
  - Button label remains "Print Current Vector".
- **Colors:** (Specifics to be refined later, ensure contrast with axes)
  - Vector A: A distinct color (e.g., a shade of red/orange).
  - Vector B: Another distinct color (e.g., a shade of blue/purple).
  - Resultant R: A third distinct color (e.g., a shade of green).
  - `currentDefiningVectorStore` arrow: `themeColors.primaryColor` (current behavior, often a theme accent color).
- **Dialog Integration:** Introduce the concept of vector addition and the "tip-to-tail" method through character dialogue, guiding the user through defining Vector A and Vector B.

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
- **Formula Display:** TODO: Create a dedicated, more robust formula display component to show vector equations (e.g., R = A + B). The simple text display was removed from the HUD to sidestep KaTeX issues for now.

## Dialog System Integration (`DialogBox.svelte`)

- A state machine or sequence manager within `VectorPrinterExercise.svelte` will control the flow of dialog turns.
- Dialog turns will be passed as props to `DialogBox.svelte`.
- Content for dialog turns will be defined, likely as an array of objects, providing context and instructions for each step of the exercise.

## Future Enhancements (Post-MVP)

- More complex shapes to print.
- "Challenge modes" with less guidance.
- Free-form "sandbox mode."
- Integration of interactive 3D gizmos for vector manipulation.

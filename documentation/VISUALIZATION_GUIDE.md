# Visualization Component Architecture Guide

This guide outlines the standard architecture, conventions, and best practices for creating interactive 3D visualizations within the VistaKine project.

## I. Overview

Interactive visualizations are a core part of VistaKine. They are built using Svelte 5, Threlte (for Three.js), and optionally @threlte/rapier for physics. The architecture is designed to be modular, allowing for the reuse of common UI elements and patterns.

A typical visualization consists of several coordinated Svelte components:

1.  An **Exercise Component**: The main container and orchestrator.
2.  A **Scene Component**: Handles all 3D rendering and logic.
3.  A **HUD Component**: Provides a 2D overlay for UI controls and information.
4.  **Control/Input Panel(s)**: Allow users to interact with and modify the visualization's parameters.
5.  A **VisContainer**: A common wrapper for the Threlte canvas.

## II. Core Components & Their Roles

### 1. `[ExerciseName]Exercise.svelte`

- **Location:** `src/lib/components/visualization/interactions/[exercise-name]/[ExerciseName]Exercise.svelte`
- **Responsibilities:**
  - Top-level component for the specific interactive exercise.
  - Manages the overall layout, particularly the distinction between normal (windowed) view and fullscreen view.
  - Integrates the Scene, HUD, and primary Control/Input Panel(s).
  - Handles fullscreen toggling logic.
  - Conditionally renders UI elements (e.g., main control panel, dialogs) based on the view mode:
    - **Normal View:** Control panels and dialogs are typically rendered _outside_ the `VisContainer` for better layout flow with page content.
    - **Fullscreen View:** Control panels and dialogs are typically rendered _inside_ the `HUD` component, which overlays the `VisContainer`.

### 2. `[ExerciseName]Scene.svelte`

- **Location:** `src/lib/components/visualization/interactions/[exercise-name]/[ExerciseName]Scene.svelte`
- **Responsibilities:**
  - Contains all Threlte/Three.js objects, lighting, camera setup, and 3D-specific logic.
  - Renders the core visual elements of the exercise.
  - Receives dynamic data either via props from the `Exercise` component or from dedicated Svelte stores.
  - Manages 3D interactions (e.g., raycasting, object manipulation, collision detection if using physics).
  - May dispatch Svelte events (e.g., `stageComplete`, `interactionLogged`) or update Svelte stores based on 3D events.

### 3. `[ExerciseName]Hud.svelte`

- **Location:** `src/lib/components/visualization/interactions/[exercise-name]/[ExerciseName]Hud.svelte`
- **Responsibilities:**
  - Provides a 2D Heads-Up Display (HUD) that overlays the 3D scene.
  - Contains common UI controls like `ResetButton`, `FullscreenButton`.
  - Conditionally renders and positions the `DialogBox` and the main Control Panel(s) when the visualization is in fullscreen mode.
  - Manages the layout of these elements within the HUD overlay.

### 4. Control/Input Panel(s)

- **Location:** `src/lib/components/visualization/interactions/[exercise-name]/[Specific]Panel.svelte` (e.g., `NozzleControlPanel.svelte`, `VectorInputPanel.svelte`)
- **Responsibilities:**
  - Provide the primary user interface for inputting data or controlling visualization parameters (e.g., coordinates, settings).
  - Often feature a repeating UI pattern for X, Y, Z inputs: a label, increment/decrement buttons (with long-press), and a number input field.
  - State management can vary:
    - **Prop-based:** Using `$bindable` props to achieve two-way binding with a parent component (typically the `Exercise` or `HUD` component).
    - **Store-based:** Directly reading from and writing to Svelte stores.
  - Should include input validation and clamping logic.

### 5. `VisContainer.svelte`

- **Location:** `src/lib/components/visualization/VisContainer.svelte`
- **Responsibilities:**
  - A reusable wrapper component that sets up the Threlte `<Canvas>` and, if needed, the `@threlte/rapier <World>`.
  - Provides a consistent HTML structure and base styling (background, border, aspect ratio) for the 3D scene area.
  - Includes a `<slot />` where the specific `Scene` component's content is injected.
  - Can have visual states, e.g., a `complete` class for styling when an exercise is finished.

### 6. Common UI Elements

- **`DialogBox.svelte`**: (`src/lib/components/visualization/elements/ui/DialogBox.svelte`) For displaying narrative or instructional text. Managed via Svelte stores for content and visibility.
- **`FullscreenButton.svelte`**: (`src/lib/components/visualization/elements/ui/FullscreenButton.svelte`) Toggles fullscreen mode for the exercise.
- **`ResetButton.svelte`**: (`src/lib/components/visualization/elements/ui/ResetButton.svelte`) Resets the exercise to its initial state, typically by updating Svelte stores.
- **`SceneLabel.svelte`**: (`src/lib/components/visualization/helpers/SceneLabel.svelte`) Displays text labels within the 3D scene, often attached to objects.

## III. Layout & Styling

### Standard HTML Structure (`Exercise` component)

A common pattern for the `[ExerciseName]Exercise.svelte` template:
\`\`\`html

<div class="exercise-wrapper" class:fullscreen={isFullscreen}>
  <!-- Panels/Dialogs for NON-FULLSCREEN view -->
  {#if !isFullscreen}
    <div class="dialog-above-vis">...</div>
    <div class="control-panel-outside-vis">...</div>
  {/if}

  <div class="vis-area-wrapper">
    <div class="ui-overlay">
      <!-- HUD Component hosts panels/dialogs in FULLSCREEN view -->
      <[ExerciseName]Hud bind:isFullscreen ... />
    </div>
    <VisContainer>
      <[ExerciseName]Scene ... />
    </VisContainer>
  </div>
</div>
\`\`\`

### Fullscreen vs. Non-fullscreen

- **Non-fullscreen:** Control panels and dialogs are generally placed directly within the `exercise-wrapper` (e.g., above or beside the `vis-area-wrapper`) to integrate smoothly with surrounding page content.
- **Fullscreen:** The `exercise-wrapper` expands to fill the viewport. Control panels and dialogs are then typically rendered by the `HUD` component, making them part of the UI overlay on top of the 3D scene. CSS classes like `.fullscreen` are used to manage these layout changes.

### HUD Overlay

- The `ui-overlay` div within `vis-area-wrapper` is positioned absolutely to cover the `VisContainer`.
- The `HUD` component within this overlay uses `position: absolute` for its internal elements (buttons, panels) to place them at specific locations (e.g., top-left, bottom-right).
- `pointer-events: none;` is often used on containers within the overlay if they should not block interactions with the 3D canvas, while specific interactive elements (buttons, inputs) will have `pointer-events: auto;`.

### CSS Variables

- Utilize global CSS variables (defined in `_variables.scss` and `themeColors.ts` store) for consistent theming (colors, spacing, fonts) across all visualizations.

## IV. State Management

### Svelte 5 Runes

- Use `$state` for reactive local component state.
- Use `$derived` for values computed from other state.
- Use `$effect` for side effects, DOM interactions, or reactions to state changes that don't directly render output (e.g., updating Three.js objects, validation).

### Svelte Stores

- **Global/Shared State:** Theme colors (`themeColors.ts`), global settings.
- **Dialog Management:** Stores like `calibrationState.ts` or `vectorBuilderState.ts` manage:
  - `showDialog` (boolean flags for visibility).
  - `dialogTurns` (array of dialog content).
  - Helper functions to update these (`showCalibrationDialog(...)`).
- **Cross-component Communication:**
  - Resetting exercises (e.g., `resetSceneRequested` in `calibrationState`).
  - Sharing data between non-hierarchically related components (e.g., `vectorData` in `vectorBuilderState` is updated by `VectorInputPanel` and read by `VectorBuilderScene`).
- **Exercise-Specific Data:**
  - **Prop-based flow:** Data owned by the `Exercise` component, passed down to `Scene`, `HUD`, and `Panels` via props (often `$bindable` for two-way updates with panels). Example: `PrinterCalibrationExercise` manages nozzle coordinates.
  - **Store-based flow:** Data owned by a dedicated store for that exercise. Components like `Panels` and `Scene` directly subscribe and update this store. Example: `VectorBuilderExercise` relies on `vectorBuilderState` for vector start/end points.
  - **Guidance:** For state tightly coupled to a single exercise and primarily flowing between its main sub-components, prop-drilling (especially with `$bindable`) can be explicit and easier to trace. For state that needs to be accessed or modified by deeply nested children without passing through many layers, or by components outside the main exercise flow, stores are more appropriate.

## V. Creating New Visualizations

1.  **Directory Structure:** Create a new folder under `src/lib/components/visualization/interactions/` (e.g., `my-new-exercise/`).
2.  **Core Files:**
    - `MyNewExerciseExercise.svelte`
    - `MyNewExerciseScene.svelte`
    - `MyNewExerciseHud.svelte`
    - One or more `PanelNamePanel.svelte` files.
3.  **State Store (if needed):** Create `myNewExerciseState.ts` in `src/lib/stores/` if using a store-centric approach for its data or for complex dialog/reset logic. Consider placing exercise-specific stores within the exercise's own folder (e.g., `src/lib/components/visualization/interactions/my-new-exercise/myNewExerciseStore.ts`) for better encapsulation.
4.  **Follow Patterns:**
    - Implement the fullscreen logic in the `Exercise` component (or use the forthcoming reusable solution).
    - Structure the HTML layout as described in "Layout & Styling."
    - Place common controls (Reset, Fullscreen) in the `HUD`.
    - Use `VisContainer` to wrap your `Scene`.
    - Decide on prop-based or store-based data flow for your exercise's core logic.
5.  **Reusable Components:** Utilize existing common elements (DialogBox, Buttons, etc.) and look for opportunities to create new ones.

## VI. Identified Areas for Refactoring & Reusable Components

_(This section will be updated as common elements are formally extracted)_

- Fullscreen toggling logic (Action: `useFullscreen.ts`).
- Axis input UI (Component: `AxisInput.svelte`).
- Base layout for `Exercise` components (Potential Component: `InteractiveExerciseLayout.svelte`).

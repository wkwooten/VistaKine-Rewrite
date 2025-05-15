# Visualization Component Architecture Guide

This guide outlines the standard architecture, conventions, and best practices for creating interactive 3D visualizations within the VistaKine project.

## I. Overview

Interactive visualizations are a core part of VistaKine. They are built with Svelte 5 (Runes), Threlte (for Three.js), and optionally @threlte/rapier for physics. The architecture is designed to be modular and reusable.

A typical visualization, especially when built using the generic `InteractiveExercise.svelte` component, involves coordinating several Svelte components:

1.  An **`InteractiveExercise.svelte` Component (Generic Wrapper)**: The main container and orchestrator.
2.  A **Custom Scene Component**: Handles all 3D rendering and logic, passed to `InteractiveExercise`.
3.  A **Custom HUD Component**: Provides a 2D overlay for UI controls, passed to `InteractiveExercise`.
4.  One or more **Custom Control/Input Panel(s)**: Allow user interaction, often slotted into the HUD or managed by `InteractiveExercise`.
5.  The **`VisContainer.svelte` Component**: A common wrapper for the Threlte canvas, used internally by `InteractiveExercise`.

Alternatively, for highly custom needs, an exercise-specific main component (e.g., `[ExerciseName]Exercise.svelte`) can be created, following similar principles but with more direct control.

## II. Core Components & Their Roles

### 1. `InteractiveExercise.svelte` (Generic Exercise Wrapper)

- **Location:** `src/lib/components/visualization/InteractiveExercise.svelte`
- **Responsibilities:**
  - Serves as a generic, reusable top-level component for most interactive exercises.
  - Manages the overall layout and integrates the Scene, HUD, and Control Panel components passed to it as props.
  - Handles fullscreen toggling logic internally using the `useFullscreen.ts` Svelte action.
  - Manages a `resetKey` to allow for re-initialization of the visualization.
  - Provides slots for content, particularly for control panels within the HUD.
  - Uses placeholder components (`PlaceholderScene.svelte`, `PlaceholderHud.svelte`, `PlaceholderControls.svelte`) from `src/lib/components/visualization/generic-exercise-parts/` if custom components are not provided.
- **Key Props:** `SceneComponent`, `HudComponent`, `ControlPanelComponent`, `sceneProps`, `hudProps`, `controlPanelProps`, `exerciseTitle`.

### 2. Custom Scene Component (e.g., `MyExerciseScene.svelte`)

- **Passed to:** `InteractiveExercise.svelte` via the `SceneComponent` prop.
- **Responsibilities:**
  - Contains all Threlte/Three.js objects, lighting, camera setup, and 3D-specific logic.
  - Renders the core visual elements of the exercise.
  - Receives dynamic data via props (from `sceneProps` passed to `InteractiveExercise`) or from dedicated Svelte stores.
  - Manages 3D interactions (e.g., raycasting, object manipulation, collision detection if using physics).
  - May dispatch Svelte events or update Svelte stores based on 3D events.

### 3. Custom HUD Component (e.g., `MyExerciseHud.svelte`)

- **Passed to:** `InteractiveExercise.svelte` via the `HudComponent` prop.
- **Responsibilities:**
  - Provides a 2D Heads-Up Display (HUD) that overlays the 3D scene.
  - Typically contains common UI controls like reset and fullscreen buttons.
  - **Crucially, it must accept `onrequestToggleFullscreen: () => void` and `onrequestReset: () => void` as props** from `InteractiveExercise.svelte` and call these functions when its respective buttons are clicked to trigger the desired actions in the parent.
  - Often provides a `<slot name="controls">` where `InteractiveExercise` will place the `ControlPanelComponent`.
  - An example implementation is `PlaceholderHud.svelte`.
  - The root element of the `HudComponent` (or any specific interactive areas within it) should have `pointer-events: auto;` applied (often via a class or inline style if not default for the element). This works in conjunction with `InteractiveExercise.svelte`'s `.hud-layer { pointer-events: none; }` styling, which allows click-through to the 3D scene by default, while `pointer-events: auto;` on HUD elements re-enables interaction for them.

### 4. Custom Control/Input Panel(s) (e.g., `MyExercisePanel.svelte`)

- **Passed to:** `InteractiveExercise.svelte` via the `ControlPanelComponent` prop, usually rendered into the HUD's "controls" slot.
- **Responsibilities:**
  - Provide the primary user interface for inputting data or controlling visualization parameters.
  - **Recommended Component:** Utilize `src/lib/components/visualization/elements/ui/AxisInput.svelte` for numerical X, Y, Z style inputs, as it provides consistent styling, value stepping, and long-press functionality.
  - State management can vary:
    - **Prop-based:** Receiving data via props (from `controlPanelProps`) and emitting changes.
    - **Store-based:** Directly reading from and writing to Svelte stores.
  - Should include input validation and clamping logic as needed.

### 5. `VisContainer.svelte`

- **Location:** `src/lib/components/visualization/VisContainer.svelte`
- **Used by:** `InteractiveExercise.svelte` internally.
- **Responsibilities:**
  - A reusable wrapper component that sets up the Threlte `<Canvas>` and, if needed (via the `withPhysics` prop), the `@threlte/rapier <World>`.
  - Provides a consistent HTML structure and base styling for the 3D scene area.
  - Receives a `resetKey` prop from `InteractiveExercise` to force re-rendering of its contents when the key changes.
  - Receives an `isFullscreen` prop for potential style adjustments.
  - Uses a `children` prop (Svelte Snippet) passed by `InteractiveExercise` (which is the `SceneComponent`) and renders it using `{@render children()}`.

### 6. Common UI Elements

- **`DialogBox.svelte`**: (`src/lib/components/visualization/elements/ui/DialogBox.svelte`) For displaying narrative or instructional text.
- **`FullscreenButton.svelte` / `ResetButton.svelte`**: These are typically integrated into a custom HUD, which then calls the appropriate functions passed by `InteractiveExercise`.
- **`SceneLabel.svelte`**: (`src/lib/components/visualization/helpers/SceneLabel.svelte`) Displays text labels within the 3D scene.
- **`AxisInput.svelte`**: (`src/lib/components/visualization/elements/ui/AxisInput.svelte`) Preferred component for numerical axis inputs.

## III. Layout & Styling

### Layout with `InteractiveExercise.svelte`

- `InteractiveExercise.svelte` uses CSS Grid to manage the layering of the HUD over the visualization (`VisContainer`).
- The `.hud-layer` within `InteractiveExercise.svelte` is styled with `pointer-events: none;`. The `HudComponent` (or specific interactive elements within it) should ensure `pointer-events: auto;` is set on its interactive parts so they can be used, while allowing non-interactive parts of the HUD area to pass pointer events to the 3D scene below.
- The `HudComponent` is responsible for the layout of its internal elements (buttons, control panels via slot).
- `VisContainer` handles the aspect ratio and basic styling of the 3D canvas area.

### CSS Variables

- Utilize global CSS variables (defined in `_variables.scss` and `themeColors.ts` store) for consistent theming.

## IV. State Management

### Svelte 5 Runes

- Use `$state` for reactive local component state.
- Use `$derived` for values computed from other state.
- Use `$effect` for side effects.

### Svelte Stores

- **Global/Shared State:** Theme colors, global settings.
- **Dialog Management:** Stores can manage dialog visibility and content.
- **Cross-component Communication / Exercise-Specific Data:**
  - For state passed to `InteractiveExercise` (e.g., `hudProps`, `controlPanelProps`), these props are the primary mechanism for data flow _into_ the constituent parts, especially for initial configuration or less frequently changing data.
  - For `sceneProps`, while it can be used for initial setup or configuration, **dynamic and frequently updated data for the `SceneComponent` (e.g., object positions, animation states, current stage of an exercise) is often best managed using dedicated Svelte stores.** The `SceneComponent` would then subscribe to these stores directly. The `sceneProps` can then focus on passing down callbacks (e.g., `onStageComplete`, `onAllStagesComplete`) or relatively static configuration. This pattern was successfully used in the `PrinterCalibration` exercise.
  - **Exercise-Specific Store Location:** For better encapsulation, place stores specific to a single exercise within that exercise's interaction folder (e.g., `src/lib/components/visualization/interactions/my-new-exercise/myNewExerciseStore.ts`).

## V. Creating New Visualizations

1.  **Directory Structure:** Create a new folder under `src/lib/components/visualization/interactions/` (e.g., `my-new-exercise/`).
2.  **Core Custom Components:** Inside this folder, create:
    - `MyNewExerciseScene.svelte`
    - `MyNewExerciseHud.svelte` (ensure it accepts and uses `onrequestToggleFullscreen` and `onrequestReset` props, and provides a `<slot name="controls">` if applicable).
    - One or more `MyNewExercisePanel.svelte` files (consider using `AxisInput.svelte` internally).
3.  **State Store (if needed):** Create `myNewExerciseStore.ts` within the exercise's folder if complex state management is required.
4.  **Integration:**

    - Import these custom components into the Svelte route or page where the visualization will be used.
    - Use the `<InteractiveExercise>` component, passing your custom components to its `SceneComponent`, `HudComponent`, and `ControlPanelComponent` props. Provide any necessary data via `sceneProps`, `hudProps`, and `controlPanelProps`.
    - Example:

      ```svelte
      <script lang="ts">
        import InteractiveExercise from '$lib/components/visualization/InteractiveExercise.svelte';
        import MyCustomScene from './my-new-exercise/MyNewExerciseScene.svelte';
        import MyCustomHud from './my-new-exercise/MyNewExerciseHud.svelte';
        import MyCustomControls from './my-new-exercise/MyNewExercisePanel.svelte';
        // Import any exercise-specific stores if scene data is managed there
        // import { myDataStore1, myDataStore2 } from './my-new-exercise/myNewExerciseStore.ts';

        // Props for HUD and ControlPanel can still be passed directly
        const myHudData = { title: "My Awesome Exercise" };
        const myControlsData = { settings: $state({}) }; // Example: control panel specific settings

        // Scene props might now primarily be for callbacks or initial, static config
        // if dynamic data is handled by stores subscribed to within MyCustomScene.svelte
        function handleStageCompletion() {
          console.log("A stage was completed in the scene!");
        }
        const mySceneCallbacks = {
          onCustomStageComplete: handleStageCompletion
        };
      </script>

      <InteractiveExercise
        exerciseTitle="My Awesome Exercise"
        SceneComponent={MyCustomScene}
        sceneProps={mySceneCallbacks} // Pass callbacks or static config
        HudComponent={MyCustomHud}
        hudProps={myHudData}
        ControlPanelComponent={MyCustomControls}
        controlPanelProps={myControlsData}
        onResetRequestedByHudCallback={() => console.log('Exercise reset requested via HUD')}
        onFullscreenStatusChangeCallback={(isFs) => console.log('Fullscreen status:', isFs)}
      />
      ```

5.  **Highly Custom Exercises:** If `InteractiveExercise.svelte` is not suitable, you can create a main `MyNewExerciseExercise.svelte` component and manage the integration of Scene, HUD, VisContainer, and fullscreen logic (using `useFullscreen.ts`) manually, following the patterns established in older exercises if necessary.

## VI. Key Reusable Components & Abstractions

- **`InteractiveExercise.svelte`**: Generic wrapper for exercises.
- **`useFullscreen.ts`**: Svelte action for managing browser fullscreen state. (Used by `InteractiveExercise`)
- **`AxisInput.svelte`**: Standardized UI component for numerical axis inputs.
- **`VisContainer.svelte`**: Standardized wrapper for Threlte Canvas and Rapier World. (Used by `InteractiveExercise`)
- **Placeholder Components**: `PlaceholderScene.svelte`, `PlaceholderHud.svelte`, `PlaceholderControls.svelte` serve as defaults for `InteractiveExercise` and examples for custom implementations.

This guide should help in developing new visualizations consistently and efficiently.

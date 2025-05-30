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
  - Manages the overall layout using CSS. This includes a dedicated **dialog area** (typically for introductory text), the main **visualization area** (`VisContainer`), a dedicated **instruction area** (for instructional text related to the exercise controls or interaction), and a dedicated **controls area** (for primary exercise controls). The dialog, instruction, and controls areas are typically visible in the normal view and hidden in fullscreen mode.
  - Integrates the Scene, HUD, and Control Panel components passed to it as props.
  - Handles fullscreen toggling logic internally using `FullscreenWrapper.svelte`.
  - Manages a `resetKey` to allow for re-initialization of the visualization.
  - Uses Svelte Snippets extensively for content projection:
    - Accepts optional `dialogAreaSnippet?: Snippet<[{ isFullscreen: boolean }]>` for the dialog/introductory content.
    - Accepts optional `controlsAreaSnippet?: Snippet<[{ isFullscreen: boolean }]>` for the main exercise controls.
    - Accepts optional `instructionSnippet?: Snippet<[{ isFullscreen: boolean }]>` for instructional text, typically appearing below the visualization. Receives `{ isFullscreen: boolean }` as a parameter.
    - Passes a `controlsSnippet` (derived from `ControlPanelComponent` and `controlPanelProps`) _to_ the `HudComponent`. This snippet is for controls that should be _within_ the HUD, often relevant in fullscreen mode.
  - Uses placeholder components (`PlaceholderScene.svelte`, `PlaceholderHud.svelte`, `PlaceholderControls.svelte`) from `src/lib/components/visualization/generic-exercise-parts/` if custom components are not provided.
- **Key Props:**
  - `SceneComponent`: The Svelte component for the 3D scene.
  - `HudComponent`: The Svelte component for the 2D HUD overlay.
  - `ControlPanelComponent`: The Svelte component for controls that will be rendered _inside_ the HUD (via the `controlsSnippet` passed to the HUD).
  - `dialogAreaSnippet` (Optional): A Svelte Snippet to render content in the designated dialog area. Receives `{ isFullscreen: boolean }` as a parameter.
  - `controlsAreaSnippet` (Optional): A Svelte Snippet to render content in the designated main controls area. Receives `{ isFullscreen: boolean }` as a parameter.
  - `instructionSnippet` (Optional): A Svelte Snippet to render instructional text. Receives `{ isFullscreen: boolean }` as a parameter.
  - `sceneProps`: Props to pass to the `SceneComponent`.
  - `hudProps`: Props to pass to the `HudComponent`.
  - `controlPanelProps`: Props to pass to the `ControlPanelComponent` (rendered within the HUD).
  - `exerciseTitle`: A title for the exercise, often used by the HUD.
  - `onResetRequestedByHudCallback`: Callback for when the HUD's reset mechanism is triggered.
  - `onFullscreenStatusChangeCallback`: Callback for when fullscreen status changes.

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
  - **Must accept an optional `controlsSnippet?: Snippet<[{ isFullscreen: boolean }]>` prop (note: `InteractiveExercise` will pass `{ isFullscreen }` to it) and render it using `{@render controlsSnippet({ isFullscreen })}`.** This is the standard way for `InteractiveExercise` to pass the control panel UI (intended for display _within_ the HUD, especially in fullscreen) to the HUD.
  - An example implementation is `PlaceholderHud.svelte`, which has been updated to accept and render the `controlsSnippet` prop.
  - The root element of the `HudComponent` (or any specific interactive areas within it) should have `pointer-events: auto;` applied (often via a class or inline style if not default for the element). This works in conjunction with `InteractiveExercise.svelte`'s `.hud-layer { pointer-events: none; }` styling, which allows click-through to the 3D scene by default, while `pointer-events: auto;` on HUD elements re-enables interaction for them.

### 4. Custom Control/Input Panel(s) (e.g., `MyExercisePanel.svelte`)

- **Usage:**
  - **Primary Controls (Non-Fullscreen View):** A control panel intended for the main, non-fullscreen controls area should be defined within the exercise-specific component (e.g., `MyExerciseExercise.svelte`) and passed to `InteractiveExercise.svelte` via the `controlsAreaSnippet` prop.
  - **HUD-Embedded Controls (Often for Fullscreen):** A control panel intended to be displayed _within_ the HUD (e.g., for quick access in fullscreen) is passed to `InteractiveExercise.svelte` via the `ControlPanelComponent` prop. `InteractiveExercise` then makes an instance of this component (with `controlPanelProps`) available to the `HudComponent` via the `controlsSnippet` prop that the HUD renders.
- **Responsibilities:**
  - Provide the primary user interface for inputting data or controlling visualization parameters.
  - **Recommended Component:** Utilize `src/lib/components/visualization/elements/ui/AxisInput.svelte` for numerical X, Y, Z style inputs, as it provides consistent styling, value stepping, and long-press functionality.
  - State management can vary:
    - **Prop-based:** Receiving data via props (from `controlPanelProps`) and emitting changes.
    - **Store-based:** Directly reading from and writing to Svelte stores.
  - Should include input validation and clamping logic as needed.
  - For state passed to `InteractiveExercise` (e.g., `hudProps`, `controlPanelProps`), these props are the primary mechanism for data flow _into_ the constituent parts, especially for initial configuration or less frequently changing data. Note that dynamic state for Control Panels should now primarily be managed via Svelte stores.
  - **Importance of Stores for Complex Reactivity:** For intricate visualizations where multiple components (Scene, HUD, Controls) need to react to shared, dynamic state (like lists of rendered objects, calculated results, etc.), relying solely on prop drilling can lead to reactivity issues or overly complex prop chains. Employing Svelte stores for such shared state (e.g., a store for `definedVectors`, `resultantVector`, or control panel inputs like nozzle position) ensures that all subscribed components update reliably when the store changes, significantly simplifying state management and preventing common pitfalls associated with deep prop drilling. The `PrinterCalibration`, `VectorBuilder`, and `VectorPrinter` exercises, for instance, transitioned to stores for managing their primary control panel states and other dynamic data to resolve such reactivity challenges and streamline the architecture.
  - **Exercise-Specific Store Location:** For better encapsulation, place stores specific to a single exercise within that exercise's interaction folder (e.g., `src/lib/components/visualization/interactions/my-new-exercise/myNewExerciseStore.ts`).

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

- `InteractiveExercise.svelte` uses a CSS Flexbox column layout for its main structure:
  1.  **Dialog Area**: Renders the content from `dialogAreaSnippet`. Typically hidden in fullscreen.
  2.  **Visualization Area**: Contains `VisContainer` (which renders the `SceneComponent`) and the `HudComponent` layered on top.
  3.  **Instruction Area**: Renders the content from `instructionSnippet`. Typically hidden in fullscreen and usually appears below the visualization area.
  4.  **Controls Area**: Renders the content from `controlsAreaSnippet`. Typically hidden in fullscreen.
- The layering of the `HudComponent` over the `VisContainer` is managed by CSS Grid within the visualization area.
- The `.hud-layer` within `InteractiveExercise.svelte` (which wraps the `HudComponent`) is styled with `pointer-events: none;`. The `HudComponent` (or specific interactive elements within it) should ensure `pointer-events: auto;` is set on its interactive parts so they can be used, while allowing non-interactive parts of the HUD area to pass pointer events to the 3D scene below.
- The `HudComponent` is responsible for the layout of its internal elements (buttons, and the content from the `controlsSnippet` it receives).
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
  - **Importance of Stores for Complex Reactivity:** For intricate visualizations where multiple components (Scene, HUD, Controls) need to react to shared, dynamic state (like lists of rendered objects, calculated results, etc.), relying solely on prop drilling can lead to reactivity issues or overly complex prop chains. Employing Svelte stores for such shared state (e.g., a store for `definedVectors`, `resultantVector`, or control panel inputs like nozzle position) ensures that all subscribed components update reliably when the store changes, significantly simplifying state management and preventing common pitfalls associated with deep prop drilling. The `PrinterCalibration`, `VectorBuilder`, and `VectorPrinter` exercises, for instance, transitioned to stores for managing their primary control panel states and other dynamic data to resolve such reactivity challenges and streamline the architecture.
  - **Exercise-Specific Store Location:** For better encapsulation, place stores specific to a single exercise within that exercise's interaction folder (e.g., `src/lib/components/visualization/interactions/my-new-exercise/myNewExerciseStore.ts`).

## V. Creating New Visualizations

1.  **Directory Structure:** Create a new folder under `src/lib/components/visualization/interactions/` (e.g., `my-new-exercise/`).
2.  **Core Custom Components:** Inside this folder, create:
    - `MyNewExerciseScene.svelte`
    - `MyNewExerciseHud.svelte` (ensure it accepts and uses `onrequestToggleFullscreen` and `onrequestReset` props, and **accepts and renders the `controlsSnippet?: Snippet` prop**).
    - One or more `MyNewExercisePanel.svelte` files (consider using `AxisInput.svelte` internally).
3.  **State Store (if needed):** Create `myNewExerciseStore.ts` within the exercise's folder if complex state management is required.
4.  **Integration:**

    - Create an exercise-specific main Svelte component (e.g., `MyNewExerciseExercise.svelte`) in its directory. This component will _use_ `InteractiveExercise.svelte`.
    - Inside `MyNewExerciseExercise.svelte`:
      - Import your custom Scene, HUD, and any Control Panel components.
      - Define Svelte Snippets for the `dialogArea`, `controlsArea`, and `instructionArea` content. These snippets will typically render components like `DialogBox` for the dialog, your primary control panels for the controls area, and potentially an `<Instruction>` component (like `src/lib/components/ui/Instruction.svelte`) for the instruction area.
      - Pass these snippets, along with your Scene, HUD, and (HUD-specific) Control Panel components and their respective props, to `<InteractiveExercise>`.
    - Example (`MyNewExerciseExercise.svelte`):

      ```svelte
      <script lang="ts">
        import type { Snippet, ComponentType } from "svelte"; // For snippet typing
        import InteractiveExercise from '$lib/components/visualization/InteractiveExercise.svelte';
        import MyCustomScene from './MyNewExerciseScene.svelte';
        import MyCustomHud from './MyNewExerciseHud.svelte';
        import MyPrimaryControlsPanel from './MyPrimaryControlsPanel.svelte'; // For controlsAreaSnippet
        import MyHudEmbeddedControls from './MyHudEmbeddedControls.svelte'; // For ControlPanelComponent (inside HUD)
        import DialogBox from "$lib/components/visualization/elements/ui/DialogBox.svelte"; // Example for dialog
        import Instruction from "$lib/components/ui/Instruction.svelte"; // Example for instruction

        // Props for HUD, Scene, etc.
        const myHudData = { title: "My Awesome Exercise HUD" };
        const mySceneCallbacks = { onCustomEvent: () => console.log("Scene event!") };
        const myHudEmbeddedControlsData = { settingA: $state(true) };
        const myPrimaryControlsData = { inputX: $state(0), inputY: $state(0) };

        let exerciseTitle = "My Awesome Exercise";
        let dialogContent = "Welcome to this exercise. Follow the instructions to learn cool stuff!";
        let instructionContent = "Use the controls to interact with the visualization. T-key for translate, R-key for rotate.";

        function handleReset() {
          console.log('MyNewExerciseExercise: Resetting internal state if any.');
          // Reset any local state specific to MyNewExerciseExercise
          myPrimaryControlsData.inputX = 0;
          myPrimaryControlsData.inputY = 0;
        }
      </script>

      {#snippet dialogArea(data)}
        {#if !data.isFullscreen}
          <DialogBox title={exerciseTitle} showCloseButton={false}>
            <p>{dialogContent}</p>
          </DialogBox>
        {/if}
      {/snippet}

      {#snippet controlsArea(data)}
        {#if !data.isFullscreen}
          <MyPrimaryControlsPanel {...myPrimaryControlsData} />
        {/if}
      {/snippet}

      {#snippet instructionArea(data)}
        {#if !data.isFullscreen}
          <Instruction>
            <p>{instructionContent}</p>
          </Instruction>
        {/if}
      {/snippet}

      <InteractiveExercise
        {exerciseTitle}
        SceneComponent={MyCustomScene as ComponentType<any>}
        sceneProps={mySceneCallbacks}
        HudComponent={MyCustomHud as ComponentType<any>}
        hudProps={myHudData}
        ControlPanelComponent={MyHudEmbeddedControls as ComponentType<any>}
        controlPanelProps={myHudEmbeddedControlsData}
        dialogAreaSnippet={dialogArea}
        controlsAreaSnippet={controlsArea}
        instructionSnippet={instructionArea}
        onResetRequestedByHudCallback={handleReset}
        onFullscreenStatusChangeCallback={(isFs) => console.log('Fullscreen status:', isFs)}
      />
      ```

    - The Svelte route or page where the visualization is used will then just instantiate `MyNewExerciseExercise.svelte`:

      ```svelte
      <script lang="ts">
        import MyNewExerciseExercise from '$lib/components/visualization/interactions/my-new-exercise/MyNewExerciseExercise.svelte';
      </script>

      <MyNewExerciseExercise />
      ```

5.  **Highly Custom Exercises:** If the new structure of `InteractiveExercise.svelte` is still not suitable, you can create a main `MyNewExerciseExercise.svelte` component and manage the integration of Scene, HUD, VisContainer, dialogs, controls, and fullscreen logic manually. However, the snippet-based approach with `InteractiveExercise.svelte` is preferred for consistency.

## VI. Key Reusable Components & Abstractions

- **`InteractiveExercise.svelte`**: Generic wrapper for exercises. Manages overall layout (dialog, visualization, instruction, controls) and uses snippet props (`dialogAreaSnippet`, `controlsAreaSnippet`, `instructionSnippet`) for main content areas, and passes a `controlsSnippet` to the HUD for its internal controls.
- **`FullscreenWrapper.svelte`**: Component for managing browser fullscreen state (used by `InteractiveExercise`).
- **`AxisInput.svelte`**: Standardized UI component for numerical axis inputs.
- **`VisContainer.svelte`**: Standardized wrapper for Threlte Canvas and Rapier World. (Used by `InteractiveExercise`)
- **`Instruction.svelte`**: UI component for displaying formatted instructional text, often used with `instructionSnippet`.
- **Placeholder Components**: `PlaceholderScene.svelte`, `PlaceholderHud.svelte`, `PlaceholderControls.svelte` serve as defaults for `InteractiveExercise` and examples for custom implementations.

This guide should help in developing new visualizations consistently and efficiently.

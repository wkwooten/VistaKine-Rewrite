<script lang="ts">
  import InteractiveExercise from "$lib/components/visualization/InteractiveExercise.svelte";
  import DisplacementVelocityScene from "./DisplacementVelocityScene.svelte";
  import DisplacementVelocityHud from "./DisplacementVelocityHud.svelte";
  import type { Component } from "svelte"; // Import Component for correct typing

  // Props for the DisplacementVelocityExercise shell itself, if any are needed in the future
  // let { /* exampleProp */ } = $props<{ /* exampleProp?: boolean */ }>();

  // Props to pass down to InteractiveExercise and its children
  const sceneProps = {}; // Empty for now, can be expanded
  const hudProps = {};

  // ControlPanelComponent is optional and defaults in InteractiveExercise.
  // We can omit it or pass undefined.
  const controlPanelProps = {};

  function handleReset() {
    console.log(
      "[DisplacementVelocityExercise] Reset requested. Implement reset via store."
    );
    // Example: import { resetState } from './displacementVelocityState'; resetState();
  }

  function handleFullscreenChange(isFullscreen: boolean) {
    console.log(
      `[DisplacementVelocityExercise] Fullscreen status changed to: ${isFullscreen}`
    );
  }
</script>

<div class="displacement-velocity-exercise-shell">
  <InteractiveExercise
    exerciseTitle="Displacement, Velocity, & Speed"
    SceneComponent={DisplacementVelocityScene as unknown as Component<any>}
    HudComponent={DisplacementVelocityHud as unknown as Component<any>}
    ControlPanelComponent={undefined}
    {sceneProps}
    {hudProps}
    {controlPanelProps}
    onResetRequestedByHudCallback={handleReset}
    onFullscreenStatusChangeCallback={handleFullscreenChange}
  />
</div>

<style lang="scss">
  .displacement-velocity-exercise-shell {
    width: 100%;
    height: 100%;
    display: flex; /* Use flex to make InteractiveExercise fill space */
    flex-direction: column;
    overflow: hidden; /* Prevent scrollbars on the shell itself */

    & > :global(.interactive-exercise-component) {
      flex-grow: 1; /* Allows InteractiveExercise to take remaining space */
      min-height: 300px; /* Or some other sensible minimum height for the visualization */
    }
  }
</style>

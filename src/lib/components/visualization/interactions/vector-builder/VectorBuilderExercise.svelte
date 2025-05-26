<script lang="ts">
  import type { SvelteComponent, ComponentType } from "svelte";
  import InteractiveExercise from "../../InteractiveExercise.svelte";
  import VectorBuilderScene from "./VectorBuilderScene.svelte";
  import VectorBuilderHud from "./VectorBuilderHud.svelte";
  import VectorInputPanel from "./VectorInputPanel.svelte";
  import DialogBox from "../../elements/ui/DialogBox.svelte";
  import {
    showVectorBuilderDialog,
    vectorBuilderDialogTurns,
    startCoordsRaw,
    endCoordsRaw,
  } from "$lib/components/visualization/interactions/vector-builder/vectorBuilderState";
  import { onMount } from "svelte"; // Still needed for initial dialogKey increment if desired

  // --- Props for VectorBuilderExercise itself (if any) ---
  // let { someProp } = $props<{ someProp?: type }>();

  // --- State for VectorBuilderExercise Layout & Dialog ---
  let isFullscreenForVBELayout = $state(false);
  let dialogKey = $state(0);

  onMount(() => {
    dialogKey += 1;
    // Any other onMount logic for VBE can go here.
  });

  // --- Reset Logic for this Exercise ---
  function handleActualReset(): void {
    console.log("[VectorBuilderExercise] Resetting exercise state.");
    // Reset vector coordinates via stores (already handled by HUD, but good for explicit VBE reset)
    startCoordsRaw.set({ x: "0", y: "0", z: "0" });
    endCoordsRaw.set({ x: "0", y: "0", z: "0" });
    dialogKey++; // Re-key dialog box if necessary
    // Potentially reset other states from vectorBuilderState.ts if needed
    // For example, if dialog content needs to be reset to an initial state:
    // showVectorBuilderDialog.set(false); or showVectorDialog([...initialTurns]);
  }

  // --- Props for Child Components (managed by InteractiveExercise) ---
  // SceneComponent (VectorBuilderScene) does not seem to take explicit props in its current form.
  const sceneProps = $derived({});

  // HudComponent (VectorBuilderHud) will receive isFullscreen from InteractiveExercise automatically.
  // It doesn't seem to need other specific props from VBE at this stage.
  const hudProps = $derived({});

  // ControlPanelComponent (VectorInputPanel) is passed to InteractiveExercise,
  // which will then slot it into the HUD when the HUD is fullscreen.
  const controlPanelProps = $derived({}); // VectorInputPanel takes no props, it uses stores
</script>

<div class="vector-builder-exercise-shell">
  <!-- Render DialogBox OUTSIDE InteractiveExercise when NOT in VBE's fullscreen layout -->
  {#if $showVectorBuilderDialog && !isFullscreenForVBELayout}
    <div class="dialog-above-vis">
      {#key dialogKey}
        <DialogBox
          turns={$vectorBuilderDialogTurns}
          bind:show={$showVectorBuilderDialog}
        />
      {/key}
    </div>
  {/if}

  <!-- InteractiveExercise now manages Scene, HUD, and ControlPanel (which HUD displays in FS) -->
  <InteractiveExercise
    class="interactive-exercise-component"
    exerciseTitle="Vector Builder"
    SceneComponent={VectorBuilderScene as unknown as ComponentType<SvelteComponent>}
    HudComponent={VectorBuilderHud as unknown as ComponentType<SvelteComponent>}
    ControlPanelComponent={VectorInputPanel as unknown as ComponentType<SvelteComponent>}
    {sceneProps}
    {hudProps}
    {controlPanelProps}
    onResetRequestedByHudCallback={handleActualReset}
    onFullscreenStatusChangeCallback={(isFs: boolean) =>
      (isFullscreenForVBELayout = isFs)}
  />

  <!-- Render VectorInputPanel directly when NOT in VBE's fullscreen layout -->
  {#if !isFullscreenForVBELayout}
    <div class="control-panel-outside-vis">
      <VectorInputPanel />
    </div>
  {/if}
</div>

<style lang="scss">
  .vector-builder-exercise-shell {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    // Ensure InteractiveExercise takes available space when other elements are present
    // This might need adjustment based on how height: 100% behaves on children
    // when the parent (shell) is also height: 100% and a flex container.
    & > :global(.interactive-exercise-component) {
      flex-grow: 1; // Allows InteractiveExercise to take remaining space
      min-height: 300px; // Or some other sensible minimum height for the visualization
    }
  }

  .dialog-above-vis {
    width: 100%;
    box-sizing: border-box;
    min-height: 110px;
    margin-bottom: var(--space-s);
    position: relative;
    order: 1; // Dialog first
  }

  // The InteractiveExercise component will be order 2 implicitly or explicitly if needed.
  // For example, if .interactive-exercise-component is given order: 2;

  .control-panel-outside-vis {
    width: 100%;
    box-sizing: border-box;
    margin-block-start: var(--space-s); // Space above the panel
    order: 3; // Control panel last
  }
</style>

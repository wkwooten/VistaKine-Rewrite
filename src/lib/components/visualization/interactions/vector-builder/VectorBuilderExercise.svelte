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

{#snippet dialogArea(data: { isFullscreen: boolean })}
  {#if $showVectorBuilderDialog}
    {#key dialogKey}
      <DialogBox
        turns={$vectorBuilderDialogTurns}
        bind:show={$showVectorBuilderDialog}
        isFullscreen={data.isFullscreen}
      />
    {/key}{/if}
{/snippet}

{#snippet controlsArea(data: { isFullscreen: boolean })}
  <VectorInputPanel />
{/snippet}

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
  dialogAreaSnippet={dialogArea}
  controlsAreaSnippet={controlsArea}
  onFullscreenStatusChangeCallback={(isFs: boolean) => {
    // isFullscreenForVBELayout = isFs; // No longer needed
  }}
/>

<style lang="scss">
  /* Removed .vector-builder-exercise-shell styles */
  /* Removed .dialog-above-vis styles */
  /* Removed .control-panel-outside-vis styles */

  /* Optional: global style if InteractiveExercise itself needs to fill a parent in some specific context */
  /* :global(.interactive-exercise-component) {} */
</style>

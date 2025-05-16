<script lang="ts">
  import FullscreenButton from "./../../elements/ui/FullscreenButton.svelte";
  import ResetButton from "../../elements/ui/ResetButton.svelte";
  import type { Vector3, ColorRepresentation } from "three";
  import katex from "katex";
  import AddButton from "$lib/components/visualization/elements/ui/AddButton.svelte";
  import {
    currentDefiningVectorStore, // Existing import
    definedVectorsStore, // Import store
    resultantVectorStore, // Import store
  } from "./vectorPrinterState";

  // Props no longer include definedVectors or resultantVector
  let {
    nozzlePosition,
    dialogMessage,
    dialogSpeaker,
    isFullscreen = false,
    onrequestToggleFullscreen,
    onrequestReset,
  } = $props<{
    nozzlePosition: Vector3;
    dialogMessage?: string;
    dialogSpeaker?: string;
    isFullscreen?: boolean;
    onrequestToggleFullscreen?: () => void;
    onrequestReset?: () => void;
  }>();

  const formatVector = (
    v: Vector3 | undefined | null,
    defaultText = "⟨0,0,0⟩"
  ) => {
    if (!v || v.lengthSq() === 0) return defaultText;
    return `⟨${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)}⟩`;
  };

  function handleRequestToggle() {
    onrequestToggleFullscreen?.();
  }

  function handleRequestReset() {
    onrequestReset?.();
  }

  // Use $derived with the stores for the formula
  let resultantFormula = $derived(() => {
    const currentResultant = $resultantVectorStore;
    const currentDefined = $definedVectorsStore;
    if (currentResultant && currentDefined && currentDefined.length >= 2) {
      const vectorNames = currentDefined
        .map((v: { name: string }) => v.name)
        .join(" + ");
      return `R = ${vectorNames}`;
    }
    return "";
  });
</script>

<div class="vector-printer-hud-overlay" class:fullscreen-active={isFullscreen}>
  <div class="hud-items-top-left">
    <ResetButton onclick={handleRequestReset} />
    <FullscreenButton
      {isFullscreen}
      onRequestToggleCallback={handleRequestToggle}
    />
    <AddButton />
  </div>

  <div class="hud-panel bottom-right">
    <div class="hud-item">
      <span class="label">Nozzle Position:</span>
      <span class="value">{formatVector(nozzlePosition)}</span>
    </div>

    {#if $currentDefiningVectorStore && $currentDefiningVectorStore.lengthSq() > 0}
      <div class="hud-item">
        <span class="label">Current Input:</span>
        <span class="value">{formatVector($currentDefiningVectorStore)}</span>
      </div>
    {/if}

    <!-- Use $definedVectorsStore here -->
    {#each $definedVectorsStore as defVec (defVec.id)}
      <div class="hud-item">
        <span class="label">Vector {defVec.name}:</span>
        <span class="value">{formatVector(defVec.vector)}</span>
      </div>
    {/each}

    <!-- Use $resultantVectorStore here -->
    {#if $resultantVectorStore}
      <div class="hud-item resultant">
        <span class="label">Resultant R:</span>
        <span class="value">{formatVector($resultantVectorStore)}</span>
      </div>
    {/if}
  </div>

  {#if isFullscreen}
    <div class="controls-panel-slot-container">
      <slot name="controls"></slot>
    </div>
  {/if}
</div>

<style lang="scss">
  .vector-printer-hud-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--space-xs);
    font-family: var(--font-mono);
    font-size: var(--step--1);
    color: var(--color-text-hud, white);
  }

  .hud-items-top-left {
    display: flex;
    gap: var(--space-xs);
    pointer-events: auto;
    width: fit-content;
  }

  .hud-panel {
    background-color: var(--color-surface-transparent, rgba(0, 0, 0, 0.5));
    padding: var(--space-xs);
    border-radius: var(--radius-sm);
    pointer-events: auto;
    box-shadow: var(--shadow-sm);
    max-width: 300px;
    align-self: flex-end;
  }

  .hud-item {
    display: flex;
    justify-content: space-between;
    gap: var(--space-m);

    .label {
      font-weight: bold;
      color: var(--color-text-hud-secondary, lightgrey);
    }

    .value {
      color: var(--color-text-hud, white);
    }
  }

  .hud-item.resultant .value {
    color: var(--color-accent, lightgreen); /* Or a specific resultant color */
  }

  .hud-item.formula .value {
    font-style: italic;
  }

  .controls-panel-slot-container {
    position: absolute;
    bottom: var(--space-s);
    left: 50%;
    transform: translateX(-50%);
    pointer-events: auto;
    width: clamp(300px, 80%, 500px); /* Responsive width */
    z-index: 10; /* Ensure it's above other HUD elements if necessary */
  }

  /* Ensure consistent styling for slotted controls */
  :global(.vector-printer-hud-overlay .controls-panel-slot-container > *) {
    background-color: var(--color-surface-alt, #222);
    padding: var(--space-s);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
  }
</style>

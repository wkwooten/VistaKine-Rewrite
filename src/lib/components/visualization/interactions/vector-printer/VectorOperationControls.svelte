<script lang="ts">
  import { Vector3 } from "three";
  import Button from "$lib/components/ui/Button.svelte";
  import katex from "katex";
  import { currentDefiningVectorStore } from "./vectorPrinterState"; // Import the store
  import AxisInput from "$lib/components/visualization/elements/ui/AxisInput.svelte"; // Import AxisInput
  import {
    xAxisColor as xAxisColorStore,
    yAxisColor as yAxisColorStore,
    zAxisColor as zAxisColorStore,
  } from "$lib/stores/themeColors"; // Import color stores

  let {
    // vectorToDefine = $bindable(new Vector3(0, 0, 0)), // Removed prop
    onPrintVector,
    onReset,
  } = $props<{
    // vectorToDefine?: Vector3; // Removed prop type
    onPrintVector?: () => void;
    onReset?: () => void;
  }>();

  // Helper reactive variables for input binding, derived from store
  // Svelte 5 allows direct binding to store properties in many cases,
  // but for complex objects like Vector3 within a store, it's often clearer
  // to manage updates explicitly or through intermediate $state if needed.

  // Function to update a component of the vector in the store
  function updateVectorComponentInStore(
    component: "x" | "y" | "z",
    newValue: number // Changed from event: Event
  ) {
    let value = newValue;
    if (isNaN(value)) {
      value = 0; // Default to 0 if input is not a valid number
    }
    currentDefiningVectorStore.update((vec) => {
      const newVec = vec.clone(); // Clone to ensure reactivity if store holds mutable object instance
      newVec[component] = value;
      return newVec;
    });
  }
</script>

<div class="vector-operation-controls">
  <fieldset class="vector-definition-fieldset">
    <legend>Define Next Vector Components</legend>
    <div class="input-row">
      <AxisInput
        label={"ΔX"}
        value={$currentDefiningVectorStore.x}
        onValueChange={(newValue) =>
          updateVectorComponentInStore("x", newValue)}
        step={0.1}
        axisColor={$xAxisColorStore}
      />
      <AxisInput
        label={"ΔY"}
        value={$currentDefiningVectorStore.y}
        onValueChange={(newValue) =>
          updateVectorComponentInStore("y", newValue)}
        step={0.1}
        axisColor={$yAxisColorStore}
      />
      <AxisInput
        label={"ΔZ"}
        value={$currentDefiningVectorStore.z}
        onValueChange={(newValue) =>
          updateVectorComponentInStore("z", newValue)}
        step={0.1}
        axisColor={$zAxisColorStore}
      />
    </div>
    {#if onPrintVector}
      <Button onclick={onPrintVector} variant="primary" fullWidth>
        Print Current Vector
      </Button>
    {/if}
  </fieldset>

  {#if onReset}
    <Button onclick={onReset} variant="danger" fullWidth>Reset Exercise</Button>
  {/if}
</div>

<style lang="scss">
  .vector-operation-controls {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
  }

  .vector-definition-fieldset {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-s);
    display: flex;
    flex-direction: column;
    gap: var(--space-s);

    legend {
      font-weight: bold;
      padding: 0 var(--space-xs);
      color: var(--color-text-secondary);
      :global(.katex) {
        font-size: var(--step-0) !important;
      }
    }
  }

  .input-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: var(--space-s);
    align-items: end;
  }

  .input-label {
    display: flex;
    flex-direction: column;
    font-size: var(--step--1);
    color: var(--color-text-secondary);
    gap: var(--space-2xs);
  }

  .coord-input {
    width: 100%;
    padding: var(--space-xs);
    font-size: var(--step-0);
    background-color: var(--color-surface-input, var(--color-surface));
    border-radius: var(--radius-sm);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow:
        inset 0 1px 2px rgba(0, 0, 0, 0.05),
        0 0 0 2px var(--color-accent-transparent);
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &[type="number"] {
      -moz-appearance: textfield;
      appearance: textfield;
    }
  }

  .actions-row {
    margin-top: var(--space-m);
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  /* Ensure KaTeX in buttons is styled appropriately */
  :global(button .katex) {
    font-size: 1em !important; /* Match button text size */
    margin-left: 0.25em;
  }
</style>

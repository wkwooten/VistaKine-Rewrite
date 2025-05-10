<script lang="ts">
  import { Vector3 } from "three";
  import Button from "$lib/components/ui/Button.svelte";
  import katex from "katex";

  let {
    vectorToDefine = $bindable(new Vector3(0, 0, 0)),
    onPrintVector,
    onReset,
  } = $props<{
    vectorToDefine?: Vector3;
    onPrintVector?: () => void;
    onReset?: () => void;
  }>();

  // Function to ensure input values are treated as numbers
  // and to provide a default if parsing fails (e.g. empty input)
  function updateVectorComponent(
    vector: Vector3,
    component: "x" | "y" | "z",
    event: Event
  ) {
    const target = event.target as HTMLInputElement;
    let value = parseFloat(target.value);
    if (isNaN(value)) {
      value = 0; // Default to 0 if input is not a valid number
    }
    vector[component] = value;
  }
</script>

<div class="vector-operation-controls">
  <fieldset class="vector-definition-fieldset">
    <legend>Define Next Vector Components</legend>
    <div class="input-row">
      <label class="input-label">
        {@html katex.renderToString("\\Delta X")}:
        <input
          type="number"
          value={vectorToDefine.x}
          oninput={(e) => updateVectorComponent(vectorToDefine, "x", e)}
          step="0.1"
          class="coord-input"
        />
      </label>
      <label class="input-label">
        {@html katex.renderToString("\\Delta Y")}:
        <input
          type="number"
          value={vectorToDefine.y}
          oninput={(e) => updateVectorComponent(vectorToDefine, "y", e)}
          step="0.1"
          class="coord-input"
        />
      </label>
      <label class="input-label">
        {@html katex.renderToString("\\Delta Z")}:
        <input
          type="number"
          value={vectorToDefine.z}
          oninput={(e) => updateVectorComponent(vectorToDefine, "z", e)}
          step="0.1"
          class="coord-input"
        />
      </label>
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

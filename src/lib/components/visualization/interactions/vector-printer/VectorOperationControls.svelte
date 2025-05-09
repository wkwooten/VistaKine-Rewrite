<script lang="ts">
  import { Vector3 } from "three";
  import Button from "$lib/components/ui/Button.svelte";
  import katex from "katex";

  let {
    vectorA = $bindable(new Vector3(1, 0, 0)),
    vectorB = $bindable(new Vector3(0, 1, 0)),
    onDefineVectorA,
    onDefineVectorB,
    onReset,
  } = $props<{
    vectorA?: Vector3;
    vectorB?: Vector3;
    onDefineVectorA?: () => void;
    onDefineVectorB?: () => void;
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
    <legend>{@html katex.renderToString("\\vec{A}")} Components</legend>
    <div class="input-row">
      <label class="input-label">
        X:
        <input
          type="number"
          value={vectorA.x}
          oninput={(e) => updateVectorComponent(vectorA, "x", e)}
          step="0.1"
          class="coord-input"
        />
      </label>
      <label class="input-label">
        Y:
        <input
          type="number"
          value={vectorA.y}
          oninput={(e) => updateVectorComponent(vectorA, "y", e)}
          step="0.1"
          class="coord-input"
        />
      </label>
      <label class="input-label">
        Z:
        <input
          type="number"
          value={vectorA.z}
          oninput={(e) => updateVectorComponent(vectorA, "z", e)}
          step="0.1"
          class="coord-input"
        />
      </label>
    </div>
    {#if onDefineVectorA}
      <Button onclick={onDefineVectorA} variant="primary" fullWidth>
        Define & Print {@html katex.renderToString("\\vec{A}")}
      </Button>
    {/if}
  </fieldset>

  <fieldset class="vector-definition-fieldset">
    <legend>{@html katex.renderToString("\\vec{B}")} Components</legend>
    <div class="input-row">
      <label class="input-label">
        X:
        <input
          type="number"
          value={vectorB.x}
          oninput={(e) => updateVectorComponent(vectorB, "x", e)}
          step="0.1"
          class="coord-input"
        />
      </label>
      <label class="input-label">
        Y:
        <input
          type="number"
          value={vectorB.y}
          oninput={(e) => updateVectorComponent(vectorB, "y", e)}
          step="0.1"
          class="coord-input"
        />
      </label>
      <label class="input-label">
        Z:
        <input
          type="number"
          value={vectorB.z}
          oninput={(e) => updateVectorComponent(vectorB, "z", e)}
          step="0.1"
          class="coord-input"
        />
      </label>
    </div>
    {#if onDefineVectorB}
      <Button onclick={onDefineVectorB} variant="secondary" fullWidth>
        Define & Print {@html katex.renderToString("\\vec{B}")}
      </Button>
    {/if}
  </fieldset>

  <!-- Placeholders for future operations -->
  <!--
	<fieldset>
		<legend>Scalar Multiplication</legend>
		...
	</fieldset>
	 -->
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

<script lang="ts">
  import {
    startCoordsRaw,
    endCoordsRaw,
    vectorData,
    traceVectorRequested,
    resetVectorBuilderRequested,
    // Import MIN/MAX for validation if needed
    MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_Z, MAX_Z
  } from '$lib/stores/vectorBuilderState';
  import { get } from 'svelte/store';

  // Function to handle triggering the trace
  function handleTrace() {
    // TODO: Add input validation (ensure numbers, maybe check bounds)
    if (get(vectorData)) { // Only trace if vector is valid
        traceVectorRequested.set(true);
    }
  }

  // Function to handle reset
  function handleReset() {
    // Reset raw inputs
    startCoordsRaw.set({ x: '0', y: '0', z: '0' });
    endCoordsRaw.set({ x: null, y: null, z: null });
    // Trigger scene reset
    resetVectorBuilderRequested.set(true);
  }

  // Helper to format numbers
  function formatNum(num: number | undefined | null, precision = 2): string {
    if (num === null || num === undefined) return '--';
    return num.toFixed(precision);
  }

</script>

<div class="hud-container">
  <h4>Define Vector</h4>

  <div class="input-section">
    <fieldset class="point-fieldset">
      <legend>Start Point (X1, Y1, Z1)</legend>
      <div class="coord-inputs">
        <label>X: <input type="number" step="0.1" bind:value={$startCoordsRaw.x} placeholder="0" /></label>
        <label>Y: <input type="number" step="0.1" bind:value={$startCoordsRaw.y} placeholder="0" /></label>
        <label>Z: <input type="number" step="0.1" bind:value={$startCoordsRaw.z} placeholder="0" /></label>
      </div>
    </fieldset>

    <fieldset class="point-fieldset">
      <legend>End Point (X2, Y2, Z2)</legend>
      <div class="coord-inputs">
        <label>X: <input type="number" step="0.1" bind:value={$endCoordsRaw.x} placeholder="X" /></label>
        <label>Y: <input type="number" step="0.1" bind:value={$endCoordsRaw.y} placeholder="Y" /></label>
        <label>Z: <input type="number" step="0.1" bind:value={$endCoordsRaw.z} placeholder="Z" /></label>
      </div>
    </fieldset>
  </div>

  <div class="output-section">
    <h4>Vector Properties</h4>
    {#if $vectorData}
      <p>Components: (ΔX: {formatNum($vectorData.components.dx)}, ΔY: {formatNum($vectorData.components.dy)}, ΔZ: {formatNum($vectorData.components.dz)})</p>
      <p>Magnitude: {formatNum($vectorData.magnitude)}</p>
    {:else}
      <p>Components: (Enter valid points)</p>
      <p>Magnitude: --</p>
    {/if}
  </div>

  <div class="controls-section">
    <button on:click={handleTrace} disabled={!$vectorData}>Create & Trace Vector</button>
    <button on:click={handleReset}>Reset</button>
  </div>
</div>

<style lang="scss">
  .hud-container {
    padding: var(--space-s);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface-overlay);
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    font-size: 0.9em;
  }

  h4 {
    margin-bottom: var(--space-xs);
    color: var(--color-text-secondary);
    font-weight: 600;
  }

  .input-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-s);
  }

  .point-fieldset {
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-sm);
    padding: var(--space-xs);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);

    legend {
        padding: 0 var(--space-xs);
        font-size: 0.9em;
        color: var(--color-text-tertiary);
    }
  }

  .coord-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: var(--space-xs);

    label {
      display: flex;
      align-items: center;
      gap: var(--space-2xs);
      font-size: 0.95em;
    }

    input[type="number"] {
        width: 100%;
        padding: var(--space-2xs);
        font-size: 1em;
        background-color: var(--color-background);
        border: 1px solid var(--color-border-subtle);
        border-radius: var(--radius-xs);
        color: var(--color-text-primary);
        text-align: right;
        /* Remove spinner buttons */
        -moz-appearance: textfield;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
  }

  .output-section p {
    margin: 0 0 var(--space-2xs) 0;
    color: var(--color-text-primary);
    line-height: 1.4;
  }

  .controls-section {
    display: flex;
    gap: var(--space-s);
    justify-content: flex-end;

    button {
        padding: var(--space-xs) var(--space-s);
    }
  }

</style>
<script lang="ts">
  import {
    vectorData,
    // Import the delta visibility states
    showDeltaX,
    showDeltaY,
    showDeltaZ,
  } from "$lib/stores/vectorBuilderState";
  import { xAxisColor, yAxisColor, zAxisColor } from "$lib/stores/themeColors"; // Import colors from correct store
  import Katex from "svelte-katex"; // Import Katex

  // Use $props() for runes mode
  let { extraClass = "" } = $props<{ extraClass?: string }>();

  // --- State for Notation Toggle ---
  let useIjkNotation = $state(false);

  // Helper to format numbers
  function formatNum(num: number | undefined | null, precision = 2): string {
    if (num === null || num === undefined) return "--";
    return num.toFixed(precision);
  }

  // --- Derived State for Formatted Vector String ---
  let vectorString = $derived(() => {
    if (!$vectorData) return "--";
    const { dx, dy, dz } = $vectorData.components;

    if (useIjkNotation) {
      let parts = [];
      if (dx !== 0) parts.push(`${formatNum(dx)}\hat{\mathbf{i}}`);
      if (dy !== 0)
        parts.push(
          `${dy >= 0 && parts.length > 0 ? "+" : ""}${formatNum(dy)}\hat{\mathbf{j}}`
        );
      if (dz !== 0)
        parts.push(
          `${dz >= 0 && parts.length > 0 ? "+" : ""}${formatNum(dz)}\hat{\mathbf{k}}`
        );
      return parts.length > 0 ? parts.join(" ") : "0"; // Return "0" if all components are zero
    } else {
      // Angle bracket notation
      return `\langle ${formatNum(dx)}, ${formatNum(dy)}, ${formatNum(dz)} \rangle`;
    }
  });
</script>

<div class="vector-output-panel {extraClass}">
  <div class="output-section">
    <h4>Vector Properties</h4>
    {#if $vectorData}
      <!-- Display components vertically with toggles -->
      <p class="component">
        <span class="label" style="color: {$xAxisColor}">ΔX:</span>
        <span class="value" style="color: {$xAxisColor}"
          >{formatNum($vectorData.components.dx)}</span
        >
        <input
          type="checkbox"
          class="delta-toggle"
          bind:checked={$showDeltaX}
          title="Toggle ΔX visibility"
          style="accent-color: {$xAxisColor};"
        />
      </p>
      <p class="component">
        <span class="label" style="color: {$yAxisColor}">ΔY:</span>
        <span class="value" style="color: {$yAxisColor}"
          >{formatNum($vectorData.components.dy)}</span
        >
        <input
          type="checkbox"
          class="delta-toggle"
          bind:checked={$showDeltaY}
          title="Toggle ΔY visibility"
          style="accent-color: {$yAxisColor};"
        />
      </p>
      <p class="component">
        <span class="label" style="color: {$zAxisColor}">ΔZ:</span>
        <span class="value" style="color: {$zAxisColor}"
          >{formatNum($vectorData.components.dz)}</span
        >
        <input
          type="checkbox"
          class="delta-toggle"
          bind:checked={$showDeltaZ}
          title="Toggle ΔZ visibility"
          style="accent-color: {$zAxisColor};"
        />
      </p>

      <!-- Vector Notation Display -->
      <div class="vector-notation">
        <span class="label">Vector:</span>
        <span class="value katex-value"><Katex>{vectorString}</Katex></span>
      </div>

      <!-- Magnitude Display -->
      <p class="magnitude">
        <span class="label">Magnitude:</span>
        <span class="value">{formatNum($vectorData.magnitude)}</span>
      </p>
    {:else}
      <!-- Mirror the structure of the 'if' block for consistency -->
      <p class="component">
        <span class="label" style="color: {$xAxisColor}">ΔX:</span>
        <span class="value" style="color: {$xAxisColor}">--</span>
      </p>
      <p class="component">
        <span class="label" style="color: {$yAxisColor}">ΔY:</span>
        <span class="value" style="color: {$yAxisColor}">--</span>
      </p>
      <p class="component">
        <span class="label" style="color: {$zAxisColor}">ΔZ:</span>
        <span class="value" style="color: {$zAxisColor}">--</span>
      </p>
      <div class="vector-notation">
        <span class="label">Vector:</span>
        <span class="value">--</span>
      </div>
      <p class="magnitude">
        <span class="label">Magnitude:</span>
        <span class="value">--</span>
      </p>
    {/if}
  </div>

  <!-- Notation Toggle UI -->
  <div class="controls-section">
    <label class="toggle-label">
      <input type="checkbox" bind:checked={useIjkNotation} />
      Use îĵk̂ Notation
    </label>
  </div>
</div>

<style lang="scss">
  .vector-output-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-xs);
    /* border: 1px solid var(--color-border); */
    border-radius: var(--radius-md);
    background-color: var(--color-surface-overlay);
    pointer-events: auto;
    user-select: none; /* Disable text selection */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE/Edge */
  }

  h4 {
    margin-bottom: var(--space-2xs);
    color: var(--color-text-secondary);
    font-weight: 600;
    font-size: 1.1em;
  }

  .output-section p,
  .output-section .vector-notation {
    // Apply to new div as well
    margin: 0 0 var(--space-2xs) 0;
    color: var(--color-text-primary);
    line-height: 1.4;
    font-size: 0.95em;
    display: flex; // Use flex for alignment
    align-items: center;
    gap: var(--space-2xs);
    flex-wrap: wrap; // Allow wrapping if needed
  }

  .output-section .label {
    font-weight: 600;
    white-space: nowrap; // Prevent label wrapping
    flex-shrink: 0; // Prevent label from shrinking
  }

  .output-section .value {
    margin-left: var(--space-3xs);
    display: inline-block;
    min-width: 3em;
    text-align: right;
    font-family: var(--font-mono, monospace);
    flex-grow: 1; // Allow value to take remaining space
  }

  .katex-value {
    text-align: left; // Align Katex left for better readability
    min-width: fit-content;
  }

  .component .value {
    /* Keep component value alignment to right if preferred */
    text-align: right;
  }

  /* Styles for the component line */
  .component {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
  }

  /* Styles for the checkbox toggle */
  .delta-toggle {
    margin-left: auto; /* Push checkbox to the right */
    cursor: pointer;
  }

  .controls-section {
    border-top: 1px solid var(--color-border-light);
    padding-top: var(--space-xs);
    margin-top: var(--space-2xs);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .toggle-label {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
    cursor: pointer;
    font-size: 0.9em;
  }

  .toggle-label input[type="checkbox"] {
    cursor: pointer;
    accent-color: var(--color-accent);
  }
</style>

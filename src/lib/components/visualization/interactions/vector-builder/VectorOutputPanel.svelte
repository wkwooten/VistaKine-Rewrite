<script lang="ts">
  import {
    vectorData,
    xAxisColor, yAxisColor, zAxisColor,
    // Import the delta visibility states
    showDeltaX, showDeltaY, showDeltaZ
  } from '$lib/stores/vectorBuilderState';

  // Use $props() for runes mode
  let { extraClass = '' } = $props<{ extraClass?: string }>();

  // Helper to format numbers
  function formatNum(num: number | undefined | null, precision = 2): string {
    if (num === null || num === undefined) return '--';
    return num.toFixed(precision);
  }

</script>

<div class="vector-output-panel {extraClass}">
  <div class="output-section">
		<h4>Vector Properties</h4>
    {#if $vectorData}
      <!-- Display components vertically with toggles -->
      <p class="component">
        <span class="label" style="color: {$xAxisColor}">ΔX:</span>
        <span class="value" style="color: {$xAxisColor}">{formatNum($vectorData.components.dx)}</span>
        <input type="checkbox" class="delta-toggle" bind:checked={$showDeltaX} title="Toggle ΔX visibility" style="accent-color: {$xAxisColor};" />
      </p>
      <p class="component">
        <span class="label" style="color: {$yAxisColor}">ΔY:</span>
        <span class="value" style="color: {$yAxisColor}">{formatNum($vectorData.components.dy)}</span>
        <input type="checkbox" class="delta-toggle" bind:checked={$showDeltaY} title="Toggle ΔY visibility" style="accent-color: {$yAxisColor};" />
      </p>
      <p class="component">
        <span class="label" style="color: {$zAxisColor}">ΔZ:</span>
        <span class="value" style="color: {$zAxisColor}">{formatNum($vectorData.components.dz)}</span>
        <input type="checkbox" class="delta-toggle" bind:checked={$showDeltaZ} title="Toggle ΔZ visibility" style="accent-color: {$zAxisColor};" />
      </p>
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
      <p class="magnitude">
        <span class="label">Magnitude:</span>
        <span class="value">--</span>
      </p>
    {/if}
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

  .output-section p {
    margin: 0 0 var(--space-2xs) 0;
    color: var(--color-text-primary);
    line-height: 1.4;
    font-size: 0.95em;
  }

  .output-section .label {
    font-weight: 600;
  }
  .output-section .value {
    /* Add styles if needed, e.g., specific font-weight or slight offset */
    margin-left: var(--space-3xs);
    display: inline-block; /* Ensure it takes space */
    min-width: 3em; /* Give some space for the value */
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

</style>
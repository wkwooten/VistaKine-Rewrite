<script lang="ts">
  import {
    vectorData,
    // Import the delta visibility states
    showDeltaX,
    showDeltaY,
    showDeltaZ,
    useIjkNotation, // Import from store
  } from "$lib/components/visualization/interactions/vector-builder/vectorBuilderState";
  import { xAxisColor, yAxisColor, zAxisColor } from "$lib/stores/themeColors"; // Import colors from correct store
  import { ChevronDown } from "lucide-svelte";
  import Katex from "svelte-katex"; // Import Katex
  import { slide } from "svelte/transition";

  // Use $props() for runes mode
  let { extraClass = "" } = $props<{ extraClass?: string }>();

  // --- State for Notation Toggle ---
  let katexMathString = $state("--"); // New state variable for the final string
  let isCollapsed = $state(false); // State for collapsing, initially expanded

  // --- Unique ID for ARIA ---
  const contentId = `vop-content-${Math.random().toString(36).substring(2, 9)}`;
  const headerId = `vop-header-${Math.random().toString(36).substring(2, 9)}`;

  // Helper to format numbers
  function formatNum(num: number | undefined | null, precision = 2): string {
    if (num === null || num === undefined) return "--";
    return num.toFixed(precision);
  }

  // --- Effect to Compute KaTeX String ---
  $effect(() => {
    const currentVectorData = $vectorData; // Read store value
    const currentUseIjk = $useIjkNotation; // Read store value

    if (!currentVectorData) {
      katexMathString = "--";
      return;
    }

    const { dx, dy, dz } = currentVectorData.components;
    let newString = "";

    if (currentUseIjk) {
      let parts = [];
      // Ensure dx, dy, dz are treated as numbers for comparison
      const numDx = Number(dx) || 0;
      const numDy = Number(dy) || 0;
      const numDz = Number(dz) || 0;

      if (numDx !== 0) parts.push(`${formatNum(numDx)}î`); // Unicode î
      if (numDy !== 0)
        parts.push(
          `${numDy >= 0 && parts.length > 0 ? "+" : ""}${formatNum(numDy)}ĵ` // Unicode ĵ
        );
      if (numDz !== 0)
        parts.push(
          `${numDz >= 0 && parts.length > 0 ? "+" : ""}${formatNum(numDz)}k̂` // Unicode k with combining circumflex
        );
      newString = parts.length > 0 ? parts.join(" ") : "0";
    } else {
      // Use Unicode characters directly
      newString = `⟨${formatNum(dx)}, ${formatNum(dy)}, ${formatNum(dz)}⟩`;
    }

    katexMathString = newString;
    // Re-add debug log
    console.log(
      `[VectorOutputPanel Effect] useIjkNotation: ${currentUseIjk}, katexMathString updated to: '${newString}'`
    );
  });

  // Removed derived state for vectorString

  // Removed previous debug effect
</script>

<div class="vector-output-panel {extraClass}">
  <!-- Collapsible Header -->
  <div
    class="panel-header"
    id={headerId}
    role="button"
    tabindex="0"
    aria-expanded={!isCollapsed}
    aria-controls={contentId}
    on:click={() => (isCollapsed = !isCollapsed)}
    on:keydown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        isCollapsed = !isCollapsed;
      }
    }}
  >
    <h4>Vector Properties</h4>
    <div class="chevron" class:collapsed={isCollapsed}>
      <ChevronDown size={20} />
    </div>
  </div>

  <!-- Collapsible Content -->
  {#if !isCollapsed}
    <div
      class="panel-content"
      id={contentId}
      role="region"
      aria-labelledby={headerId}
      transition:slide={{ duration: 250 }}
    >
      <div class="output-section">
        <!-- Display components vertically with toggles -->
        <p class="component">
          <span class="label" style="color: {$xAxisColor}"> ΔX: </span>
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
          <span class="label" style="color: {$yAxisColor}"> ΔY: </span>
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
          <span class="label" style="color: {$zAxisColor}"> ΔZ: </span>
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
          <span class="value katex-value">{katexMathString}</span>
        </div>

        <!-- Magnitude Display -->
        <p class="magnitude">
          <span class="label">Magnitude:</span>
          <span class="value">{formatNum($vectorData.magnitude)}</span>
        </p>
      </div>

      <!-- Notation Toggle UI -->
      <div class="controls-section">
        <label class="toggle-label">
          <input type="checkbox" bind:checked={$useIjkNotation} />
          Use îĵk̂ Notation
        </label>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .vector-output-panel {
    display: flex;
    width: 250px;
    flex-direction: column;
    gap: 0; // Remove gap, manage spacing internally
    padding: 0; // Remove padding, manage internally
    /* border: 1px solid var(--color-border); */
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    pointer-events: auto;
    user-select: none; /* Disable text selection */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE/Edge */
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xs); // Add padding to header
    cursor: pointer;
    border-bottom: 1px solid var(--color-border-light); // Separator when expanded

    &:hover {
      background-color: var(--color-surface-hover); // Use theme hover
    }

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
  }

  .panel-header h4 {
    margin: 0; // Remove default margin from h4
    color: var(--color-text-secondary);
    font-weight: 600;
    font-size: 1.1em;
  }

  .chevron {
    transition: transform 0.25s ease-out;
  }
  .chevron.collapsed {
    transform: rotate(-90deg);
  }

  .panel-content {
    padding: var(--space-xs); // Add padding to content area
    overflow: hidden; // Needed for slide transition
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

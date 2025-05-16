<script lang="ts">
  import {
    currentDefiningVectorStore,
    definedVectorsStore,
    resultantVectorStore,
  } from "$lib/components/visualization/interactions/vector-printer/vectorPrinterState";
  import { xAxisColor, yAxisColor, zAxisColor } from "$lib/stores/themeColors";
  import { ChevronDown } from "lucide-svelte";
  import Katex from "svelte-katex";
  import { slide } from "svelte/transition";
  import { Vector3 } from "three";

  let { nozzlePosition = new Vector3(0, 0, 0), extraClass = "" } = $props<{
    nozzlePosition?: Vector3; // Make nozzlePosition optional to allow default
    extraClass?: string;
  }>();

  let useIjkNotation = $state(true);
  let isCollapsed = $state(false);

  const contentId = `vpop-content-${Math.random().toString(36).substring(2, 9)}`;
  const headerId = `vpop-header-${Math.random().toString(36).substring(2, 9)}`;

  function formatNum(num: number | undefined | null, precision = 2): string {
    if (num === null || num === undefined) return "--";
    return num.toFixed(precision);
  }

  function formatVectorToKatex(
    vector: Vector3 | null | undefined,
    useIjk: boolean
  ): string {
    if (!vector) return "--";

    const { x, y, z } = vector;
    let newString = "";

    if (useIjk) {
      let parts = [];
      const numX = Number(x) || 0;
      const numY = Number(y) || 0;
      const numZ = Number(z) || 0;

      if (Math.abs(numX) > 0.001) parts.push(`${formatNum(numX)}î`);
      if (Math.abs(numY) > 0.001)
        parts.push(
          `${numY >= 0 && parts.length > 0 && numX !== 0 ? "+" : ""}${formatNum(numY)}ĵ`
        );
      if (Math.abs(numZ) > 0.001)
        parts.push(
          `${numZ >= 0 && parts.length > 0 && (numX !== 0 || numY !== 0) ? "+" : ""}${formatNum(numZ)}k̂`
        );
      newString = parts.length > 0 ? parts.join(" ") : "0";
    } else {
      newString = `⟨${formatNum(x)}, ${formatNum(y)}, ${formatNum(z)}⟩`;
    }
    return newString;
  }
</script>

<div class="vector-printer-output-panel {extraClass}">
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
    <h4>Vector Monitor</h4>
    <div class="chevron" class:collapsed={isCollapsed}>
      <ChevronDown size={20} />
    </div>
  </div>

  {#if !isCollapsed}
    <div
      class="panel-content"
      id={contentId}
      role="region"
      aria-labelledby={headerId}
      transition:slide={{ duration: 250 }}
    >
      <div class="output-section">
        <!-- Nozzle Position -->
        <div class="data-item">
          <span class="label">Nozzle:</span>
          <span class="value katex-value">
            {formatVectorToKatex(nozzlePosition, useIjkNotation)}
          </span>
        </div>

        <!-- Current Defining Vector -->
        {#if $currentDefiningVectorStore && $currentDefiningVectorStore.lengthSq() > 0.00001}
          <div class="data-item current-input-item">
            <span class="label">Input:</span>
            <div class="component-details">
              <p class="component">
                <span class="sub-label" style="color: {$xAxisColor}">ΔX:</span>
                <span class="sub-value" style="color: {$xAxisColor}">
                  {formatNum($currentDefiningVectorStore.x)}
                </span>
                <input
                  type="checkbox"
                  class="delta-toggle"
                  checked
                  disabled
                  style="accent-color: {$xAxisColor};"
                />
              </p>
              <p class="component">
                <span class="sub-label" style="color: {$yAxisColor}">ΔY:</span>
                <span class="sub-value" style="color: {$yAxisColor}">
                  {formatNum($currentDefiningVectorStore.y)}
                </span>
                <input
                  type="checkbox"
                  class="delta-toggle"
                  checked
                  disabled
                  style="accent-color: {$yAxisColor};"
                />
              </p>
              <p class="component">
                <span class="sub-label" style="color: {$zAxisColor}">ΔZ:</span>
                <span class="sub-value" style="color: {$zAxisColor}">
                  {formatNum($currentDefiningVectorStore.z)}
                </span>
                <input
                  type="checkbox"
                  class="delta-toggle"
                  checked
                  disabled
                  style="accent-color: {$zAxisColor};"
                />
              </p>
              <div class="vector-notation">
                <span class="sub-label">Vector:</span>
                <span class="value katex-value">
                  {formatVectorToKatex(
                    $currentDefiningVectorStore,
                    useIjkNotation
                  )}
                </span>
              </div>
              <p class="magnitude">
                <span class="sub-label">Magnitude:</span>
                <span class="value"
                  >{formatNum($currentDefiningVectorStore.length())}</span
                >
              </p>
            </div>
          </div>
        {/if}

        <!-- Defined Vectors -->
        {#each $definedVectorsStore as defVec (defVec.id)}
          <div class="data-item">
            <span class="label" style="color: {defVec.color};"
              >Vector {defVec.name}:</span
            >
            <span class="value katex-value" style="color: {defVec.color};">
              {formatVectorToKatex(defVec.vector, useIjkNotation)}
            </span>
          </div>
        {/each}

        <!-- Resultant Vector -->
        {#if $resultantVectorStore && $resultantVectorStore.lengthSq() > 0.00001}
          <div class="data-item resultant-item">
            <span class="label">Resultant R:</span>
            <span class="value katex-value">
              {formatVectorToKatex($resultantVectorStore, useIjkNotation)}
            </span>
          </div>
        {/if}
      </div>

      <div class="controls-section">
        <label class="toggle-label">
          <input type="checkbox" bind:checked={useIjkNotation} />
          Use îĵk̂ Notation
        </label>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .vector-printer-output-panel {
    display: flex;
    width: 280px; // Slightly wider to accommodate content
    flex-direction: column;
    gap: 0;
    padding: 0;
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    pointer-events: auto;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    box-shadow: var(--shadow-md);
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xs) var(--space-s);
    cursor: pointer;
    border-bottom: 1px solid var(--color-border-light);

    &:hover {
      background-color: var(--color-surface-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
  }

  .panel-header h4 {
    margin: 0;
    color: var(--color-text-secondary);
    font-weight: 600;
    font-size: var(--step-0);
  }

  .chevron {
    transition: transform 0.25s ease-out;
    color: var(--color-text-secondary);
  }
  .chevron.collapsed {
    transform: rotate(-90deg);
  }

  .panel-content {
    padding: var(--space-xs) var(--space-s);
    overflow-y: auto; // Enable vertical scrolling
    max-height: 300px; // Fixed max height
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  .output-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .data-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-xs);
    line-height: 1.5;
    font-size: var(--step--1);

    &.resultant-item .label,
    &.resultant-item .value {
      color: var(--color-success); // Or a specific green
      font-weight: bold;
    }
  }

  .current-input-item {
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid var(--color-border-light);
    padding: var(--space-xs);
    border-radius: var(--radius-sm);

    .label {
      // Label for "Input:"
      font-weight: 600;
      margin-bottom: var(--space-2xs);
      display: block; // Make it block to take full width before details
    }
  }

  .component-details {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-3xs);
    padding-left: var(--space-xs); // Indent details slightly
  }

  .component {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
    width: 100%;
  }

  .label,
  .sub-label {
    font-weight: 500;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .sub-label {
    min-width: 30px; // Ensure alignment for DX, DY, DZ labels
  }

  .value,
  .sub-value {
    font-family: "IBM Plex Mono", var(--font-mono, monospace);
    text-align: right;
    flex-grow: 1;
  }

  .katex-value {
    font-family: "IBM Plex Mono", var(--font-mono, monospace);
    text-align: left;
    min-width: fit-content;
    font-size: var(--step-0);
  }

  .delta-toggle {
    margin-left: auto;
    cursor: pointer;
    transform: scale(0.9);
  }

  .magnitude {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
    width: 100%;
    margin-top: var(--space-3xs);
  }

  .vector-notation {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
    width: 100%;
    margin-top: var(--space-3xs);
  }

  .controls-section {
    border-top: 1px solid var(--color-border-light);
    padding-top: var(--space-s);
    margin-top: var(--space-xs);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .toggle-label {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
    cursor: pointer;
    font-size: var(--step--1);
    color: var(--color-text-secondary);
  }

  .toggle-label input[type="checkbox"] {
    cursor: pointer;
    accent-color: var(--color-accent);
    transform: scale(0.9);
  }
</style>

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
        <!-- REMOVE THIS and integrate into table
        <div class="data-item">
          <span class="label">Nozzle:</span>
          <span class="value katex-value">
            {formatVectorToKatex(nozzlePosition, useIjkNotation)}
          </span>
        </div>
        -->

        <!-- Current Defining Vector -->
        <!-- {#if $currentDefiningVectorStore && $currentDefiningVectorStore.lengthSq() > 0.00001}
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
        {/if} -->

        <!-- Defined Vectors -->
        <!-- REMOVE THIS and integrate into table
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
        -->

        <!-- Resultant Vector -->
        <!-- REMOVE THIS and integrate into table
        {#if $resultantVectorStore && $resultantVectorStore.lengthSq() > 0.00001}
          <div class="data-item resultant-item">
            <span class="label">Resultant R:</span>
            <span class="value katex-value">
              {formatVectorToKatex($resultantVectorStore, useIjkNotation)}
            </span>
          </div>
        {/if}
        -->

        <!-- NEW TABLE STRUCTURE -->
        <div class="table-container">
          <table class="vector-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>X</th>
                <th>Y</th>
                <th>Z</th>
                <th>Magnitude</th>
              </tr>
            </thead>
            <tbody>
              <!-- Nozzle Position Row -->
              <tr>
                <td>Nozzle</td>
                <td>{formatNum(nozzlePosition?.x)}</td>
                <td>{formatNum(nozzlePosition?.y)}</td>
                <td>{formatNum(nozzlePosition?.z)}</td>
                <td>{formatNum(nozzlePosition?.length())}</td>
              </tr>

              <!-- Defined Vectors Rows -->
              {#each $definedVectorsStore as defVec (defVec.id)}
                <tr style="color: {defVec.color};">
                  <td>Vector {defVec.name}</td>
                  <td>{formatNum(defVec.vector.x)}</td>
                  <td>{formatNum(defVec.vector.y)}</td>
                  <td>{formatNum(defVec.vector.z)}</td>
                  <td>{formatNum(defVec.vector.length())}</td>
                </tr>
              {/each}

              <!-- Resultant Vector Row -->
              {#if $resultantVectorStore && $resultantVectorStore.lengthSq() > 0.00001}
                <tr class="resultant-row">
                  <td>Resultant R</td>
                  <td>{formatNum($resultantVectorStore.x)}</td>
                  <td>{formatNum($resultantVectorStore.y)}</td>
                  <td>{formatNum($resultantVectorStore.z)}</td>
                  <td>{formatNum($resultantVectorStore.length())}</td>
                </tr>
              {/if}
            </tbody>
          </table>
        </div>

        <!-- Optional: Display for full vector notation if desired, e.g., for Resultant -->
        {#if $resultantVectorStore && $resultantVectorStore.lengthSq() > 0.00001}
          <div class="vector-notation-summary">
            <span class="label"
              >Resultant R ({useIjkNotation ? "îĵk̂" : "⟨⟩"}):</span
            >
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
    width: 100%;
    flex-direction: column;
    gap: 0;
    padding: 0;
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-light);
    padding: var(--space-s);
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

  /* REMOVE OLD STYLES FOR .data-item, .current-input-item, etc. */
  /* .data-item { ... } */
  /* .current-input-item { ... } */
  /* .component-details { ... } */
  /* .component { ... } */
  /* .label, .sub-label { ... } */
  /* .sub-label { ... } */
  /* .value, .sub-value { ... } */
  /* .katex-value { ... } */
  /* .delta-toggle { ... } */
  /* .magnitude { ... } */
  /* .vector-notation { ... } */

  /* NEW TABLE STYLES */
  .table-container {
    /* ADDED for horizontal scrolling */
    overflow-x: auto;
    width: 100%; /* Ensure it takes available width */
  }

  .vector-data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--step--1);

    th,
    td {
      border: 1px solid var(--color-border-subtle);
      padding: var(--space-3xs) var(--space-2xs);
      text-align: right;
      vertical-align: middle;
    }

    th {
      background-color: var(--color-surface-alt);
      color: var(--color-text-secondary);
      font-weight: 600;
      text-align: center;
    }

    td:first-child {
      /* Name column */
      text-align: left;
      font-weight: 500;
    }

    .resultant-row td {
      color: var(--color-success);
      font-weight: bold;
    }

    /* Alternating row colors for readability */
    tbody tr:nth-child(odd) {
      /* background-color: var(--color-surface-alt); // Optional: if more distinction is needed */
    }
  }

  .vector-notation-summary {
    margin-top: var(--space-s);
    padding: var(--space-xs);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-sm);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--step-0);
    .label {
      font-weight: 500;
    }
    .value.katex-value {
      font-family: "IBM Plex Mono", var(--font-mono, monospace);
    }
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

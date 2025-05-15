<script lang="ts">
  import {
    startCoordsRaw,
    endCoordsRaw,
    // vectorData, // Not directly used in this component for binding
    MIN_X,
    MAX_X,
    MIN_Y,
    MAX_Y,
    MIN_Z,
    MAX_Z,
  } from "$lib/stores/vectorBuilderState";
  import { xAxisColor, yAxisColor, zAxisColor } from "$lib/stores/themeColors";
  import { get, type Writable } from "svelte/store";
  import AxisInput from "../../elements/ui/AxisInput.svelte";

  let { extraClass = "" } = $props<{ extraClass?: string }>();

  type RawCoord = { x: string | null; y: string | null; z: string | null };
  type AxisKey = keyof RawCoord;

  // Helper to parse string from store to number, defaulting to 0
  function parseStoreVal(val: string | null | undefined): number {
    const num = parseFloat(val ?? "0");
    return isNaN(num) ? 0 : num;
  }

  // Initialize local $state variables from stores
  let startX_num = $state(parseStoreVal(get(startCoordsRaw).x));
  let startY_num = $state(parseStoreVal(get(startCoordsRaw).y));
  let startZ_num = $state(parseStoreVal(get(startCoordsRaw).z));
  let endX_num = $state(parseStoreVal(get(endCoordsRaw).x));
  let endY_num = $state(parseStoreVal(get(endCoordsRaw).y));
  let endZ_num = $state(parseStoreVal(get(endCoordsRaw).z));

  // Effects to update STORES when local NUMERIC $state changes
  $effect(() => {
    let clamped = Math.max(MIN_X, Math.min(MAX_X, startX_num));
    if (clamped !== startX_num) startX_num = clamped; // Update local if clamped
    startCoordsRaw.update((s) => ({ ...s, x: String(clamped) }));
  });
  $effect(() => {
    let clamped = Math.max(MIN_Y, Math.min(MAX_Y, startY_num));
    if (clamped !== startY_num) startY_num = clamped;
    startCoordsRaw.update((s) => ({ ...s, y: String(clamped) }));
  });
  $effect(() => {
    let clamped = Math.max(MIN_Z, Math.min(MAX_Z, startZ_num));
    if (clamped !== startZ_num) startZ_num = clamped;
    startCoordsRaw.update((s) => ({ ...s, z: String(clamped) }));
  });

  $effect(() => {
    let clamped = Math.max(MIN_X, Math.min(MAX_X, endX_num));
    if (clamped !== endX_num) endX_num = clamped;
    endCoordsRaw.update((s) => ({ ...s, x: String(clamped) }));
  });
  $effect(() => {
    let clamped = Math.max(MIN_Y, Math.min(MAX_Y, endY_num));
    if (clamped !== endY_num) endY_num = clamped;
    endCoordsRaw.update((s) => ({ ...s, y: String(clamped) }));
  });
  $effect(() => {
    let clamped = Math.max(MIN_Z, Math.min(MAX_Z, endZ_num));
    if (clamped !== endZ_num) endZ_num = clamped;
    endCoordsRaw.update((s) => ({ ...s, z: String(clamped) }));
  });

  // Effects to update local NUMERIC $state when STORES change externally
  $effect(() => {
    const storeVal = parseStoreVal($startCoordsRaw.x);
    if (storeVal !== startX_num) startX_num = storeVal;
  });
  $effect(() => {
    const storeVal = parseStoreVal($startCoordsRaw.y);
    if (storeVal !== startY_num) startY_num = storeVal;
  });
  $effect(() => {
    const storeVal = parseStoreVal($startCoordsRaw.z);
    if (storeVal !== startZ_num) startZ_num = storeVal;
  });

  $effect(() => {
    const storeVal = parseStoreVal($endCoordsRaw.x);
    if (storeVal !== endX_num) endX_num = storeVal;
  });
  $effect(() => {
    const storeVal = parseStoreVal($endCoordsRaw.y);
    if (storeVal !== endY_num) endY_num = storeVal;
  });
  $effect(() => {
    const storeVal = parseStoreVal($endCoordsRaw.z);
    if (storeVal !== endZ_num) endZ_num = storeVal;
  });
</script>

<div class="vector-input-panel {extraClass}">
  <h4>Define Vector</h4>
  <div class="input-section">
    <fieldset class="point-fieldset">
      <legend>Start Point (X1, Y1, Z1)</legend>
      <div class="coord-inputs">
        <AxisInput
          label="X"
          bind:value={startX_num}
          min={MIN_X}
          max={MAX_X}
          step={1}
          axisColor={$xAxisColor}
        />
        <AxisInput
          label="Y"
          bind:value={startY_num}
          min={MIN_Y}
          max={MAX_Y}
          step={1}
          axisColor={$yAxisColor}
        />
        <AxisInput
          label="Z"
          bind:value={startZ_num}
          min={MIN_Z}
          max={MAX_Z}
          step={1}
          axisColor={$zAxisColor}
        />
      </div>
    </fieldset>

    <fieldset class="point-fieldset">
      <legend>End Point (X2, Y2, Z2)</legend>
      <div class="coord-inputs">
        <AxisInput
          label="X"
          bind:value={endX_num}
          min={MIN_X}
          max={MAX_X}
          step={1}
          axisColor={$xAxisColor}
        />
        <AxisInput
          label="Y"
          bind:value={endY_num}
          min={MIN_Y}
          max={MAX_Y}
          step={1}
          axisColor={$yAxisColor}
        />
        <AxisInput
          label="Z"
          bind:value={endZ_num}
          min={MIN_Z}
          max={MAX_Z}
          step={1}
          axisColor={$zAxisColor}
        />
      </div>
    </fieldset>
  </div>
</div>

<style lang="scss">
  .vector-input-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-xs);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    margin-block: var(--space-s);
    background-color: var(--color-surface);
    pointer-events: auto;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    touch-action: manipulation;
  }

  h4 {
    margin-bottom: var(--space-2xs);
    color: var(--color-text-secondary);
    font-weight: 600;
    font-size: 1.1em;
    text-align: center;
  }

  .input-section {
    display: grid;
    gap: var(--space-xs);
  }

  .point-fieldset {
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-sm);
    padding: var(--space-2xs);
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);

    legend {
      background-color: var(--color-surface);
      color: var(--color-text-secondary);
      border-radius: var(--radius-pill);
      padding: var(--space-2xs) var(--space-s);
      margin-left: var(--space-xs);
      margin-bottom: var(--space-3xs);
      line-height: 1.2;
      display: inline-block;
      max-width: max-content;
      font-weight: 500;
      font-size: 0.9em;
      border: 1px solid var(--color-border-light);
    }
  }

  .coord-inputs {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: var(--space-xs);
    justify-content: center;
  }

  /* Styles for .axis-input-group, .axis-label, .input-stepper, .stepper-button are in AxisInput.svelte */
  /* Remove old styles for these elements if they were here */
</style>

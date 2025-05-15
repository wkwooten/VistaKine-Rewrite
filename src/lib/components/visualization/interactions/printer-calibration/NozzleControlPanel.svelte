<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    showCalibrationDialog,
    MIN_X,
    MAX_X,
    MIN_Y,
    MAX_Y,
    MIN_Z,
    MAX_Z,
  } from "$lib/stores/calibrationState";
  import { onDestroy } from "svelte";
  import AxisInput from "../../elements/ui/AxisInput.svelte";

  // --- Props ---
  let {
    x = $bindable<number>(MIN_X),
    y = $bindable<number>(5),
    z = $bindable<number>(MIN_Z),
  } = $props<{ x?: number; y?: number; z?: number }>();

  // --- Validation Effect ---
  $effect(() => {
    x = Number(x);
    y = Number(y);
    z = Number(z);

    if (x < MIN_X || x > MAX_X) {
      showCalibrationDialog([
        {
          speaker: "Leo",
          message: `Careful, Surya! My calculations show that X value is outside the physical print area. It needs to be between ${MIN_X} and ${MAX_X}.`,
        },
      ]);
      x = Math.max(MIN_X, Math.min(MAX_X, x));
      return;
    }
    if (y < MIN_Y || y > MAX_Y) {
      showCalibrationDialog([
        {
          speaker: "Surya",
          message: `Whoa, whoa! The Y-axis limit is ${MAX_Y}. We need to stay between ${MIN_Y} and ${MAX_Y}. We don't want to break my printer, its fragile!`,
        },
      ]);
      y = Math.max(MIN_Y, Math.min(MAX_Y, y));
      return;
    }
    if (z < MIN_Z || z > MAX_Z) {
      showCalibrationDialog([
        {
          speaker: "Leo",
          message: `That Z coordinate is problematic. We must remain within the ${MIN_Z} to ${MAX_Z} range for proper bed adhesion.`,
        },
      ]);
      z = Math.max(MIN_Z, Math.min(MAX_Z, z));
      return;
    }
  });
</script>

<div class="nozzle-control-panel">
  <h4>Nozzle Control Panel</h4>
  <div class="coord-inputs">
    <AxisInput
      label="X"
      bind:value={x}
      min={MIN_X}
      max={MAX_X}
      step={1}
      axisColor="var(--axis-color-x)"
    />
    <AxisInput
      label="Y"
      bind:value={y}
      min={MIN_Y}
      max={MAX_Y}
      step={1}
      axisColor="var(--axis-color-y)"
    />
    <AxisInput
      label="Z"
      bind:value={z}
      min={MIN_Z}
      max={MAX_Z}
      step={1}
      axisColor="var(--axis-color-z)"
    />
  </div>
</div>

<style lang="scss">
  .nozzle-control-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-xs);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface-overlay);
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

  .coord-inputs {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: var(--space-xs);
    justify-content: center;
    align-items: start;
  }
</style>

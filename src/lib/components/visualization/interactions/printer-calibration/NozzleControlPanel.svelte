<script lang="ts">
  // import { createEventDispatcher } from "svelte"; // Removed unused import
  import {
    showCalibrationDialog,
    MIN_X,
    MAX_X,
    MIN_Y,
    MAX_Y,
    MIN_Z,
    MAX_Z,
    // Import the stores for nozzle coordinates
    relativeNozzleXStore,
    relativeNozzleYStore,
    relativeNozzleZStore,
  } from "./calibrationState"; // Updated import path
  import { get } from "svelte/store"; // Import get for initial store value reading
  // import { onDestroy } from "svelte"; // Removed unused import
  import AxisInput from "../../elements/ui/AxisInput.svelte";

  // --- No longer using $bindable props for x, y, z ---
  // let {
  //   x = $bindable<number>(MIN_X),
  //   y = $bindable<number>(5),
  //   z = $bindable<number>(MIN_Z),
  // } = $props<{ x?: number; y?: number; z?: number }>();

  // --- Local state, initialized from stores ---
  let localX = $state(get(relativeNozzleXStore));
  let localY = $state(get(relativeNozzleYStore));
  let localZ = $state(get(relativeNozzleZStore));

  // --- Effects to sync local state with stores (two-way) ---

  // Local -> Store
  $effect(() => {
    console.log(
      `[NozzleControlPanel] Updating relativeNozzleXStore to: ${localX}`
    );
    relativeNozzleXStore.set(localX);
  });
  $effect(() => {
    console.log(
      `[NozzleControlPanel] Updating relativeNozzleYStore to: ${localY}`
    );
    relativeNozzleYStore.set(localY);
  });
  $effect(() => {
    console.log(
      `[NozzleControlPanel] Updating relativeNozzleZStore to: ${localZ}`
    );
    relativeNozzleZStore.set(localZ);
  });

  // Store -> Local
  $effect(() => {
    const storeX = $relativeNozzleXStore;
    if (storeX !== localX) {
      console.log(
        `[NozzleControlPanel] Store changed relativeNozzleXStore to: ${storeX}, updating localX.`
      );
      localX = storeX;
    }
  });
  $effect(() => {
    const storeY = $relativeNozzleYStore;
    if (storeY !== localY) {
      console.log(
        `[NozzleControlPanel] Store changed relativeNozzleYStore to: ${storeY}, updating localY.`
      );
      localY = storeY;
    }
  });
  $effect(() => {
    const storeZ = $relativeNozzleZStore;
    if (storeZ !== localZ) {
      console.log(
        `[NozzleControlPanel] Store changed relativeNozzleZStore to: ${storeZ}, updating localZ.`
      );
      localZ = storeZ;
    }
  });

  // --- Validation Effect (operates on localX, localY, localZ) ---
  $effect(() => {
    // Ensure local values are numbers before validation, though AxisInput should maintain numbers.
    let numX = Number(localX);
    let numY = Number(localY);
    let numZ = Number(localZ);

    let clamped = false;

    if (numX < MIN_X || numX > MAX_X) {
      showCalibrationDialog([
        {
          speaker: "Leo",
          message: `Careful, Surya! My calculations show that X value is outside the physical print area. It needs to be between ${MIN_X} and ${MAX_X}.`,
        },
      ]);
      numX = Math.max(MIN_X, Math.min(MAX_X, numX));
      clamped = true;
    }
    if (numY < MIN_Y || numY > MAX_Y) {
      showCalibrationDialog([
        {
          speaker: "Surya",
          message: `Whoa, whoa! The Y-axis limit is ${MAX_Y}. We need to stay between ${MIN_Y} and ${MAX_Y}. We don\'t want to break my printer, its fragile!`,
        },
      ]);
      numY = Math.max(MIN_Y, Math.min(MAX_Y, numY));
      clamped = true;
    }
    if (numZ < MIN_Z || numZ > MAX_Z) {
      showCalibrationDialog([
        {
          speaker: "Leo",
          message: `That Z coordinate is problematic. We must remain within the ${MIN_Z} to ${MAX_Z} range for proper bed adhesion.`,
        },
      ]);
      numZ = Math.max(MIN_Z, Math.min(MAX_Z, numZ));
      clamped = true;
    }

    // If any value was clamped, update the local state.
    // The effects syncing local to store will then propagate the clamped values.
    if (clamped) {
      if (localX !== numX) localX = numX;
      if (localY !== numY) localY = numY;
      if (localZ !== numZ) localZ = numZ;
    }
  });
</script>

<div class="nozzle-control-panel">
  <h4>Nozzle Control Panel</h4>
  <div class="coord-inputs">
    <AxisInput
      label="X"
      bind:value={localX}
      min={MIN_X}
      max={MAX_X}
      step={1}
      axisColor="var(--axis-color-x)"
    />
    <AxisInput
      label="Y"
      bind:value={localY}
      min={MIN_Y}
      max={MAX_Y}
      step={1}
      axisColor="var(--axis-color-y)"
    />
    <AxisInput
      label="Z"
      bind:value={localZ}
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

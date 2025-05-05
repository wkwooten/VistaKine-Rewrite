<script lang="ts">
  import {
    startCoordsRaw,
    endCoordsRaw,
    vectorData,
    traceVectorRequested,
    // Import MIN/MAX constants for clamping
    MIN_X,
    MAX_X,
    MIN_Y,
    MAX_Y,
    MIN_Z,
    MAX_Z,
  } from "$lib/stores/vectorBuilderState";
  import { xAxisColor, yAxisColor, zAxisColor } from "$lib/stores/themeColors"; // Import colors from correct store
  import { get } from "svelte/store";
  import { onDestroy } from "svelte";
  // Import a Toggle component if available, otherwise use checkbox
  // Assuming a simple checkbox for now
  // import Toggle from '$lib/components/ui/Toggle.svelte'; // Example path

  // Use $props() for runes mode
  let { extraClass = "" } = $props<{ extraClass?: string }>();

  // --- Constants for Long Press ---
  const step = 1;
  const HOLD_DELAY = 400; // ms before repeat starts
  const HOLD_INTERVAL = 100; // ms between repeated steps

  // --- State for Long Press ---
  let holdTimers = $state<{ [key: string]: any | null }>({});
  let holdIntervals = $state<{ [key: string]: any | null }>({});

  // --- Input Sanitization ---
  function handleIntegerInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Allow only digits and an optional leading minus sign
    input.value = input.value.replace(/[^-\d]/g, "").replace(/(?!^)-/g, "");
    // Note: bind:value will automatically update the store with the sanitized value
  }

  // --- Core Value Change Logic (Adapted) ---
  function changeValue(
    point: "start" | "end",
    axis: "x" | "y" | "z",
    direction: 1 | -1
  ) {
    const storeToUpdate = point === "start" ? startCoordsRaw : endCoordsRaw;
    const currentRaw = get(storeToUpdate);
    const currentValueStr = currentRaw[axis] ?? "0"; // Default to '0' if null/undefined
    let currentValue = parseFloat(currentValueStr);
    if (isNaN(currentValue)) currentValue = 0; // Default to 0 if parsing fails

    let newValue = currentValue + direction * step;
    let min: number, max: number;

    switch (axis) {
      case "x":
        min = MIN_X;
        max = MAX_X;
        break;
      case "y":
        min = MIN_Y;
        max = MAX_Y;
        break;
      case "z":
        min = MIN_Z;
        max = MAX_Z;
        break;
    }

    // Clamp the value
    newValue = Math.max(min, Math.min(max, newValue));

    // Update the store with the new string value
    storeToUpdate.update((current) => ({
      ...current,
      [axis]: String(newValue),
    }));
  }

  // --- Long Press Handlers (Adapted) ---
  function startHolding(
    point: "start" | "end",
    axis: "x" | "y" | "z",
    direction: 1 | -1
  ) {
    const key = `${point}-${axis}-${direction}`;
    stopHolding(point, axis, direction); // Clear existing timers/intervals

    changeValue(point, axis, direction); // Initial single step

    holdTimers[key] = setTimeout(() => {
      holdIntervals[key] = setInterval(() => {
        changeValue(point, axis, direction);
      }, HOLD_INTERVAL);
      holdTimers[key] = null;
    }, HOLD_DELAY) as any;

    holdTimers = { ...holdTimers };
    holdIntervals = { ...holdIntervals };
  }

  function stopHolding(
    point: "start" | "end",
    axis: "x" | "y" | "z",
    direction: 1 | -1
  ) {
    const key = `${point}-${axis}-${direction}`;
    if (holdTimers[key]) {
      clearTimeout(holdTimers[key]);
      holdTimers[key] = null;
    }
    if (holdIntervals[key]) {
      clearInterval(holdIntervals[key]);
      holdIntervals[key] = null;
    }
    holdTimers = { ...holdTimers };
    holdIntervals = { ...holdIntervals };
  }

  // --- Trace Logic (Keep existing) ---
  function handleTrace() {
    // TODO: Add input validation (ensure numbers, maybe check bounds)
    if (get(vectorData)) {
      // Only trace if vector is valid
      traceVectorRequested.set(true);
    }
  }

  // --- Clamping Effects ---
  // Effect for Start Point Clamping
  $effect(() => {
    const raw = $startCoordsRaw;
    const x = parseFloat(raw.x ?? "");
    const y = parseFloat(raw.y ?? "");
    const z = parseFloat(raw.z ?? "");

    if (!isNaN(x) && (x < MIN_X || x > MAX_X)) {
      startCoordsRaw.update((current) => ({
        ...current,
        x: String(Math.max(MIN_X, Math.min(MAX_X, x))),
      }));
    }
    if (!isNaN(y) && (y < MIN_Y || y > MAX_Y)) {
      startCoordsRaw.update((current) => ({
        ...current,
        y: String(Math.max(MIN_Y, Math.min(MAX_Y, y))),
      }));
    }
    if (!isNaN(z) && (z < MIN_Z || z > MAX_Z)) {
      startCoordsRaw.update((current) => ({
        ...current,
        z: String(Math.max(MIN_Z, Math.min(MAX_Z, z))),
      }));
    }
  });

  // Effect for End Point Clamping
  $effect(() => {
    const raw = $endCoordsRaw;
    const x = parseFloat(raw.x ?? "");
    const y = parseFloat(raw.y ?? "");
    const z = parseFloat(raw.z ?? "");

    if (!isNaN(x) && (x < MIN_X || x > MAX_X)) {
      endCoordsRaw.update((current) => ({
        ...current,
        x: String(Math.max(MIN_X, Math.min(MAX_X, x))),
      }));
    }
    if (!isNaN(y) && (y < MIN_Y || y > MAX_Y)) {
      endCoordsRaw.update((current) => ({
        ...current,
        y: String(Math.max(MIN_Y, Math.min(MAX_Y, y))),
      }));
    }
    if (!isNaN(z) && (z < MIN_Z || z > MAX_Z)) {
      endCoordsRaw.update((current) => ({
        ...current,
        z: String(Math.max(MIN_Z, Math.min(MAX_Z, z))),
      }));
    }
  });

  // --- Cleanup ---
  onDestroy(() => {
    Object.values(holdTimers).forEach(
      (timerId) => timerId && clearTimeout(timerId)
    );
    Object.values(holdIntervals).forEach(
      (intervalId) => intervalId && clearInterval(intervalId)
    );
  });
</script>

<div class="vector-input-panel {extraClass}">
  <h4>Define Vector</h4>
  <div class="input-section">
    <fieldset class="point-fieldset">
      <legend>Start Point (X1, Y1, Z1)</legend>
      <div class="coord-inputs">
        <!-- X Input Group -->
        <div class="axis-input-group" style="border-color: {$xAxisColor};">
          <span class="axis-label" style="color: {$xAxisColor};">X</span>
          <div class="input-stepper">
            <button
              class="stepper-button"
              onpointerdown={() => startHolding("start", "x", 1)}
              onpointerup={() => stopHolding("start", "x", 1)}
              onpointerleave={() => stopHolding("start", "x", 1)}
              aria-label="Increase Start X">+</button
            >
            <input
              type="number"
              bind:value={$startCoordsRaw.x}
              oninput={handleIntegerInput}
              placeholder="0"
              min={MIN_X}
              max={MAX_X}
              onfocus={(e) => (e.target as HTMLInputElement)?.select()}
            />
            <button
              class="stepper-button"
              onpointerdown={() => startHolding("start", "x", -1)}
              onpointerup={() => stopHolding("start", "x", -1)}
              onpointerleave={() => stopHolding("start", "x", -1)}
              aria-label="Decrease Start X">-</button
            >
          </div>
        </div>
        <!-- Y Input Group -->
        <div class="axis-input-group" style="border-color: {$yAxisColor};">
          <span class="axis-label" style="color: {$yAxisColor};">Y</span>
          <div class="input-stepper">
            <button
              class="stepper-button"
              onpointerdown={() => startHolding("start", "y", 1)}
              onpointerup={() => stopHolding("start", "y", 1)}
              onpointerleave={() => stopHolding("start", "y", 1)}
              aria-label="Increase Start Y">+</button
            >
            <input
              type="number"
              bind:value={$startCoordsRaw.y}
              oninput={handleIntegerInput}
              placeholder="0"
              min={MIN_Y}
              max={MAX_Y}
              onfocus={(e) => (e.target as HTMLInputElement)?.select()}
            />
            <button
              class="stepper-button"
              onpointerdown={() => startHolding("start", "y", -1)}
              onpointerup={() => stopHolding("start", "y", -1)}
              onpointerleave={() => stopHolding("start", "y", -1)}
              aria-label="Decrease Start Y">-</button
            >
          </div>
        </div>
        <!-- Z Input Group -->
        <div class="axis-input-group" style="border-color: {$zAxisColor};">
          <span class="axis-label" style="color: {$zAxisColor};">Z</span>
          <div class="input-stepper">
            <button
              class="stepper-button"
              onpointerdown={() => startHolding("start", "z", 1)}
              onpointerup={() => stopHolding("start", "z", 1)}
              onpointerleave={() => stopHolding("start", "z", 1)}
              aria-label="Increase Start Z">+</button
            >
            <input
              type="number"
              bind:value={$startCoordsRaw.z}
              oninput={handleIntegerInput}
              placeholder="0"
              min={MIN_Z}
              max={MAX_Z}
              onfocus={(e) => (e.target as HTMLInputElement)?.select()}
            />
            <button
              class="stepper-button"
              onpointerdown={() => startHolding("start", "z", -1)}
              onpointerup={() => stopHolding("start", "z", -1)}
              onpointerleave={() => stopHolding("start", "z", -1)}
              aria-label="Decrease Start Z">-</button
            >
          </div>
        </div>
      </div>
    </fieldset>

    <fieldset class="point-fieldset">
      <legend>End Point (X2, Y2, Z2)</legend>
      <div class="coord-inputs">
        <!-- X Input Group -->
        <div class="axis-input-group" style="border-color: {$xAxisColor};">
          <span class="axis-label" style="color: {$xAxisColor};">X</span>
          <div class="input-stepper">
            <button
              class="stepper-button"
              onpointerdown={() => startHolding("end", "x", 1)}
              onpointerup={() => stopHolding("end", "x", 1)}
              onpointerleave={() => stopHolding("end", "x", 1)}
              aria-label="Increase End X">+</button
            >
            <input
              type="number"
              bind:value={$endCoordsRaw.x}
              oninput={handleIntegerInput}
              placeholder="0"
              min={MIN_X}
              max={MAX_X}
              onfocus={(e) => (e.target as HTMLInputElement)?.select()}
            />
            <button
              class="stepper-button"
              onpointerdown={() => startHolding("end", "x", -1)}
              onpointerup={() => stopHolding("end", "x", -1)}
              onpointerleave={() => stopHolding("end", "x", -1)}
              aria-label="Decrease End X">-</button
            >
          </div>
        </div>
        <!-- Y Input Group -->
        <div class="axis-input-group" style="border-color: {$yAxisColor};">
          <span class="axis-label" style="color: {$yAxisColor};">Y</span>
          <div class="input-stepper">
            <button
              class="stepper-button"
              onpointerdown={() => startHolding("end", "y", 1)}
              onpointerup={() => stopHolding("end", "y", 1)}
              onpointerleave={() => stopHolding("end", "y", 1)}
              aria-label="Increase End Y">+</button
            >
            <input
              type="number"
              bind:value={$endCoordsRaw.y}
              oninput={handleIntegerInput}
              placeholder="0"
              min={MIN_Y}
              max={MAX_Y}
              onfocus={(e) => (e.target as HTMLInputElement)?.select()}
            />
            <button
              class="stepper-button"
              onpointerdown={() => startHolding("end", "y", -1)}
              onpointerup={() => stopHolding("end", "y", -1)}
              onpointerleave={() => stopHolding("end", "y", -1)}
              aria-label="Decrease End Y">-</button
            >
          </div>
        </div>
        <!-- Z Input Group -->
        <div class="axis-input-group" style="border-color: {$zAxisColor};">
          <span class="axis-label" style="color: {$zAxisColor};">Z</span>
          <div class="input-stepper">
            <button
              class="stepper-button"
              onpointerdown={() => startHolding("end", "z", 1)}
              onpointerup={() => stopHolding("end", "z", 1)}
              onpointerleave={() => stopHolding("end", "z", 1)}
              aria-label="Increase End Z">+</button
            >
            <input
              type="number"
              bind:value={$endCoordsRaw.z}
              oninput={handleIntegerInput}
              placeholder="0"
              min={MIN_Z}
              max={MAX_Z}
              onfocus={(e) => (e.target as HTMLInputElement)?.select()}
            />
            <button
              class="stepper-button"
              onpointerdown={() => startHolding("end", "z", -1)}
              onpointerup={() => stopHolding("end", "z", -1)}
              onpointerleave={() => stopHolding("end", "z", -1)}
              aria-label="Decrease End Z">-</button
            >
          </div>
        </div>
      </div>
    </fieldset>
  </div>

  <!-- Moved controls-section here -->
  <div class="controls-section">
    <button onclick={handleTrace} disabled={!$vectorData}
      >Create & Trace Vector</button
    >
  </div>
</div>

<style lang="scss">
  /* Styles specific to this panel - copy relevant styles from VectorBuilderHud */
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
    user-select: none; /* Disable text selection */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE/Edge */
    touch-action: manipulation; // Prevent double-tap zoom on mobile
  }

  h4 {
    margin-bottom: var(--space-2xs);
    color: var(--color-text-secondary);
    font-weight: 600;
    font-size: 1.1em;
    text-align: center; // Center title
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
      /* --- Updated Styles --- */
      background-color: var(--color-surface); /* Use theme surface color */
      color: var(--color-text-secondary); /* Use secondary text color */
      border-radius: var(
        --radius-pill
      ); /* Use theme variable for capsule shape */
      padding: var(--space-2xs) var(--space-s); /* Adjust padding (vertical, horizontal) */
      margin-left: var(--space-xs); /* Indent slightly from the left edge */
      margin-bottom: var(--space-3xs); /* Add a little space below the legend */
      line-height: 1.2; /* Adjust line height for padding */
      display: inline-block; /* Treat as block for background/padding */
      max-width: max-content; /* Prevent stretching */
      font-weight: 500; /* Slightly bolder */
      font-size: 0.9em; /* Keep font size */
      border: 1px solid var(--color-border-light); /* Add a subtle border for definition */
      /* --- End Updated Styles --- */
    }
  }

  .coord-inputs {
    display: grid;
    grid-template-columns: repeat(3, max-content); /* Arrange X, Y, Z groups */
    gap: var(--space-xs); /* Gap between X, Y, Z groups */
    justify-content: center; /* Center the groups if space allows */
  }

  /* New styles for the input group */
  .axis-input-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-3xs); // Reduce gap
    padding: var(--space-3xs) var(--space-2xs);
    border-radius: var(--radius-md); /* Rounded corners for the group */
    border: 2px solid; /* Base border, now solid - color set inline */
    background-color: transparent; /* Ensure background is transparent */
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .axis-label {
    font-weight: 600;
    font-size: 0.9em;
    min-width: 1em; /* Ensure label takes some space */
    text-align: center;
    margin-bottom: var(--space-3xs); // Add space below label
  }

  /* Remove old label styles */
  /* Remove input border styling that conflicts */
  .axis-input-group input[type="number"] {
    width: 4.5ch; // Match NozzleControlPanel
    padding: var(--space-3xs) var(--space-2xs); // Match
    font-size: 1em;
    background-color: var(--color-surface); /* Grey background */
    border-radius: var(--radius-sm); /* Rounded corners for input */
    color: var(--color-text-primary);
    text-align: right;
    border: none; /* Remove default border */
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1); /* Subtle inset shadow */
    transition: box-shadow 0.2s ease;
    order: 2; // Place input between buttons

    /* Hide spinners for Webkit browsers */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    /* Hide spinners for Firefox */
    -moz-appearance: textfield;
  }

  /* Styling for focus state - apply to group */
  .axis-input-group:focus-within {
    /* border-color: var(--color-accent-light); /* Optional: change border color */
    box-shadow: 0 0 3px 1px var(--color-accent-light); /* Add focus shadow to group */
  }

  /* Styling for invalid state - apply to group */
  .axis-input-group.invalid {
    border-color: var(
      --color-error
    ) !important; /* Use !important to override inline style */
    box-shadow: 0 0 0 1px var(--color-error);
  }

  /* Focus style when invalid */
  .axis-input-group.invalid:focus-within {
    box-shadow: 0 0 3px 1px var(--color-error); /* Keep error shadow on focus */
  }

  /* NEW: Stepper layout */
  .input-stepper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3xs);
  }

  /* NEW: Stepper button styles (adapted from NozzleControlPanel) */
  .stepper-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4.5ch; // Match input width
    height: auto;
    padding: var(--space-3xs);
    font-size: 1.1em;
    font-weight: bold;
    line-height: 1;
    color: var(--color-text-secondary);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition:
      background-color 0.1s ease,
      color 0.1s ease,
      transform 0.1s ease;

    &:first-child {
      order: 1; /* '+' button on top */
    }

    &:last-child {
      order: 3; /* '-' button on bottom */
    }

    &:hover {
      background-color: var(
        --color-surface-hover,
        var(--color-accent-hover-bg)
      );
      color: var(--color-text-primary);
    }

    &:active {
      background-color: var(
        --color-surface-active,
        var(--color-accent-active-bg)
      );
      transform: scale(0.95);
    }
  }

  /* Add styles for controls-section (copied from old VectorOutputPanel) */
  .controls-section {
    display: flex;
    gap: var(--space-xs);
    justify-content: flex-end;

    button {
      padding: var(--space-2xs) var(--space-s);
      font-size: 0.95em;
    }
  }
</style>

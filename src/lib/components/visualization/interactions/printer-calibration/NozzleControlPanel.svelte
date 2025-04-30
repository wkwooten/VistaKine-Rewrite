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
  // Axis colors are assumed to be global CSS variables (--axis-color-x, etc.)

  // --- Props ---
  // Use $bindable for two-way binding with the parent
  // Add explicit types
  let {
    x = $bindable<number>(MIN_X),
    y = $bindable<number>(5),
    z = $bindable<number>(MIN_Z),
  } = $props<{ x?: number; y?: number; z?: number }>();

  // --- Event Dispatcher (Potentially remove if direct binding handles everything) ---
  // Define the type for the dispatched event detail
  // const dispatch = createEventDispatcher<{ requestMove: { x: number; y: number; z: number } }>(); // Keep if needed for other actions

  // --- Input step value ---
  const step = 1; // Adjust this value as needed

  // --- Constants ---
  const HOLD_DELAY = 400; // ms before repeat starts
  const HOLD_INTERVAL = 100; // ms between repeated steps

  // --- State for Long Press ---
  let holdTimers = $state<{ [key: string]: any | null }>({});
  let holdIntervals = $state<{ [key: string]: any | null }>({});

  // --- Increment/Decrement Logic ---
  function changeValue(axis: "x" | "y" | "z", direction: 1 | -1) {
    let newValue: number;
    let min: number;
    let max: number;

    switch (axis) {
      case "x":
        newValue = x + direction * step;
        min = MIN_X;
        max = MAX_X;
        break;
      case "y":
        newValue = y + direction * step;
        min = MIN_Y;
        max = MAX_Y;
        break;
      case "z":
        newValue = z + direction * step;
        min = MIN_Z;
        max = MAX_Z;
        break;
    }

    // Clamp the value within boundaries
    newValue = Math.max(min, Math.min(max, newValue));

    // Update the bound prop
    if (axis === "x") x = newValue;
    else if (axis === "y") y = newValue;
    else if (axis === "z") z = newValue;
  }

  // --- Long Press Handlers ---
  function startHolding(axis: "x" | "y" | "z", direction: 1 | -1) {
    const key = `${axis}-${direction}`;

    // Clear any existing timers/intervals for this button
    stopHolding(axis, direction);

    // Initial single step
    changeValue(axis, direction);

    // Start timer for repeating interval
    holdTimers[key] = setTimeout(() => {
      holdIntervals[key] = setInterval(() => {
        changeValue(axis, direction);
      }, HOLD_INTERVAL);
      holdTimers[key] = null; // Timer fulfilled its purpose
    }, HOLD_DELAY) as any; // Cast to any

    // Ensure reactivity for state updates
    holdTimers = { ...holdTimers };
    holdIntervals = { ...holdIntervals };
  }

  function stopHolding(axis: "x" | "y" | "z", direction: 1 | -1) {
    const key = `${axis}-${direction}`;

    if (holdTimers[key]) {
      clearTimeout(holdTimers[key]);
      holdTimers[key] = null;
    }
    if (holdIntervals[key]) {
      clearInterval(holdIntervals[key]);
      holdIntervals[key] = null;
    }
    // Ensure reactivity for state updates
    holdTimers = { ...holdTimers };
    holdIntervals = { ...holdIntervals };
  }

  // --- Validation Effect ---
  // Runs whenever x, y, or z changes due to binding or button clicks
  $effect(() => {
    // Ensure value is a number before validation
    x = Number(x);
    y = Number(y);
    z = Number(z);

    // Validate X
    if (x < MIN_X || x > MAX_X) {
      showCalibrationDialog([
        {
          speaker: "Leo",
          message: `Careful, Surya! My calculations show that X value is outside the physical print area. It needs to be between ${MIN_X} and ${MAX_X}.`,
        },
      ]);
      x = Math.max(MIN_X, Math.min(MAX_X, x));
      return; // Stop further checks if one fails
    }
    // Validate Y
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
    // Validate Z
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

    // Optional: If validation passes and we still needed dispatch for some reason
    // console.log(`[NozzleControlPanel] Values updated via binding: X=${x}, Y=${y}, Z=${z}`);
    // dispatch('requestMove', { x: x, y: y, z: z });
  });

  // --- Cleanup ---
  // Ensure all intervals/timers are cleared when the component is destroyed
  onDestroy(() => {
    Object.values(holdTimers).forEach(
      (timerId) => timerId && clearTimeout(timerId)
    );
    Object.values(holdIntervals).forEach(
      (intervalId) => intervalId && clearInterval(intervalId)
    );
  });

  // Removed handleMoveRequest and handleKeydown functions
</script>

<!-- Replicate structure from VectorInputPanel -->
<div class="nozzle-control-panel">
  <h4>Nozzle Control Panel</h4>
  <div class="coord-inputs">
    <!-- X Input Group -->
    <div class="axis-input-group" style="border-color: var(--axis-color-x);">
      <span class="axis-label" style="color: var(--axis-color-x);">X</span>
      <div class="input-stepper">
        <button
          class="stepper-button"
          onpointerdown={() => startHolding("x", 1)}
          onpointerup={() => stopHolding("x", 1)}
          onpointerleave={() => stopHolding("x", 1)}
          aria-label="Increase X">+</button
        >
        <input
          type="number"
          bind:value={x}
          min={MIN_X}
          max={MAX_X}
          placeholder="X"
          onfocus={(e) => (e.target as HTMLInputElement)?.select()}
        />
        <button
          class="stepper-button"
          onpointerdown={() => startHolding("x", -1)}
          onpointerup={() => stopHolding("x", -1)}
          onpointerleave={() => stopHolding("x", -1)}
          aria-label="Decrease X">-</button
        >
      </div>
    </div>
    <!-- Y Input Group -->
    <div class="axis-input-group" style="border-color: var(--axis-color-y);">
      <span class="axis-label" style="color: var(--axis-color-y);">Y</span>
      <div class="input-stepper">
        <button
          class="stepper-button"
          onpointerdown={() => startHolding("y", 1)}
          onpointerup={() => stopHolding("y", 1)}
          onpointerleave={() => stopHolding("y", 1)}
          aria-label="Increase Y">+</button
        >
        <input
          type="number"
          bind:value={y}
          min={MIN_Y}
          max={MAX_Y}
          placeholder="Y"
          onfocus={(e) => (e.target as HTMLInputElement)?.select()}
        />
        <button
          class="stepper-button"
          onpointerdown={() => startHolding("y", -1)}
          onpointerup={() => stopHolding("y", -1)}
          onpointerleave={() => stopHolding("y", -1)}
          aria-label="Decrease Y">-</button
        >
      </div>
    </div>
    <!-- Z Input Group -->
    <div class="axis-input-group" style="border-color: var(--axis-color-z);">
      <span class="axis-label" style="color: var(--axis-color-z);">Z</span>
      <div class="input-stepper">
        <button
          class="stepper-button"
          onpointerdown={() => startHolding("z", 1)}
          onpointerup={() => stopHolding("z", 1)}
          onpointerleave={() => stopHolding("z", 1)}
          aria-label="Increase Z">+</button
        >
        <input
          type="number"
          bind:value={z}
          min={MIN_Z}
          max={MAX_Z}
          placeholder="Z"
          onfocus={(e) => (e.target as HTMLInputElement)?.select()}
        />
        <button
          class="stepper-button"
          onpointerdown={() => startHolding("z", -1)}
          onpointerup={() => stopHolding("z", -1)}
          onpointerleave={() => stopHolding("z", -1)}
          aria-label="Decrease Z">-</button
        >
      </div>
    </div>
  </div>
  <!-- Removed controls-section with the button -->
  <!-- Removed validation message display, dialog handles it -->
</div>

<style lang="scss">
  /* Adapted styles from VectorInputPanel */
  .nozzle-control-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-xs);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface-overlay);
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
  }
  /* Copied/Adapted from VectorInputPanel */
  .coord-inputs {
    display: grid;
    margin-bottom: var(--space-s);
    grid-template-columns: repeat(3, max-content); /* Arrange X, Y, Z groups */
    gap: var(--space-xs); /* Gap between X, Y, Z groups */
    justify-content: center; /* Center the groups if space allows */
    align-items: start; /* Align wrapped groups to the top */
  }

  .axis-input-group {
    display: flex;
    flex-direction: column; // Stack label and stepper vertically
    align-items: center;
    // flex-wrap: wrap; /* Allow label and stepper to wrap */
    justify-content: center; /* Center items when wrapped */
    border-radius: var(--radius-md);
    padding: var(--space-3xs) var(--space-2xs);
    gap: var(--space-3xs); // Reduced gap
    border: 2px solid; /* Color set inline via style */
    background-color: transparent;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .axis-label {
    font-weight: 600;
    font-size: 0.9em;
    min-width: 1em;
    text-align: center;
    /* Color set inline via style */
    // flex-basis: 100%; /* Encourage label to take full width when wrapped */
    margin-bottom: var(--space-3xs); // Space below label
  }

  .input-stepper {
    display: flex;
    flex-direction: column; /* Stack buttons and input vertically */
    align-items: center; /* Center items horizontally */
    gap: var(--space-3xs); /* Gap between buttons and input */
  }

  /* Input field styling */
  .input-stepper input[type="number"] {
    width: 4.5ch; /* Slightly wider input */
    padding: var(--space-3xs) var(--space-2xs); /* Padding */
    font-size: 1em;
    background-color: var(--color-background);
    border-radius: var(--radius-sm);
    color: var(--color-text-primary);
    text-align: center; /* Center text */
    border: none;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease;
    order: 2; /* Place input between buttons */

    /* Hide spinners */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    -moz-appearance: textfield;
  }

  /* Stepper button styling */
  .stepper-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* Make button width match input width exactly */
    width: 4.5ch; // Match input width
    height: auto; /* Adjust height based on content/padding */
    padding: var(--space-3xs); /* Padding for touch area */
    font-size: 1.1em; /* Make +/- slightly larger */
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
      transform 0.1s ease; // Faster transition

    &:first-child {
      order: 1; /* Place '+' button on top */
    }

    &:last-child {
      order: 3; /* Place '-' button on bottom */
    }

    &:hover {
      background-color: var(
        --color-surface-hover,
        var(--color-accent-hover-bg)
      ); // Add fallback
      color: var(--color-text-primary);
    }

    &:active {
      background-color: var(
        --color-surface-active,
        var(--color-accent-active-bg)
      ); // Add fallback
      transform: scale(0.95); // Add active feedback
    }
  }

  /* Focus state */
  .axis-input-group:focus-within {
    box-shadow: 0 0 3px 1px var(--color-accent-light);
  }

  /* Removed specific vertical stepper styles */

  /* Removed controls-section styles */
</style>

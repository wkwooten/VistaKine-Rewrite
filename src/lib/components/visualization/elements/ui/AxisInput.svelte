<script lang="ts">
  import { onDestroy } from "svelte";

  let {
    label = "",
    value = $bindable(0),
    min = -Infinity,
    max = Infinity,
    step = 1,
    axisColor = "var(--color-text-primary)",
    onValueChange, // Optional: callback
  } = $props<{
    label?: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    axisColor?: string;
    onValueChange?: (newValue: number) => void;
  }>();

  const HOLD_DELAY = 400; // ms before repeat starts
  const HOLD_INTERVAL = 100; // ms between repeated steps

  let holdTimer: any = null;
  let holdInterval: any = null;

  function modifyValue(direction: 1 | -1) {
    let numericValue = Number(value);
    if (isNaN(numericValue)) numericValue = 0; // Default if current value is not a number

    let numericStep = Number(step);
    if (isNaN(numericStep)) numericStep = 1; // Default step

    let newValue = numericValue + direction * numericStep;

    let numericMin = Number(min);
    let numericMax = Number(max);
    if (isNaN(numericMin)) numericMin = -Infinity;
    if (isNaN(numericMax)) numericMax = Infinity;

    newValue = Math.max(numericMin, Math.min(numericMax, newValue));

    value = newValue; // Update bindable prop

    if (onValueChange) {
      onValueChange(newValue);
    }
  }

  function startHolding(direction: 1 | -1) {
    stopHolding(); // Clear any existing timers/intervals
    modifyValue(direction); // Initial single step

    holdTimer = setTimeout(() => {
      holdInterval = setInterval(() => {
        modifyValue(direction);
      }, HOLD_INTERVAL);
      holdTimer = null; // Timer fulfilled its purpose
    }, HOLD_DELAY);
  }

  function stopHolding() {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
    if (holdInterval) {
      clearInterval(holdInterval);
      holdInterval = null;
    }
  }

  onDestroy(() => {
    stopHolding(); // Ensure timers are cleared when component is destroyed
  });
</script>

<div class="axis-input-group" style:--axis-input-color={axisColor}>
  <span class="axis-label">{label}</span>
  <div class="input-stepper">
    <button
      class="stepper-button plus-button"
      onpointerdown={() => startHolding(1)}
      onpointerup={stopHolding}
      onpointerleave={stopHolding}
      aria-label="Increase {label || 'value'}">+</button
    >
    <input
      type="number"
      bind:value
      {min}
      {max}
      {step}
      placeholder={label || "Value"}
      onfocus={(e) => (e.target as HTMLInputElement)?.select()}
    />
    <button
      class="stepper-button minus-button"
      onpointerdown={() => startHolding(-1)}
      onpointerup={stopHolding}
      onpointerleave={stopHolding}
      aria-label="Decrease {label || 'value'}">-</button
    >
  </div>
</div>

<style lang="scss">
  .axis-input-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: var(--radius-md);
    padding: var(--space-3xs) var(--space-2xs);
    gap: var(--space-3xs);
    border: 2px solid var(--axis-input-color, var(--color-border)); // Use CSS variable for color
    background-color: transparent;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    width: max-content; // Shrink to content
  }

  .axis-label {
    font-weight: 600;
    font-size: 0.9em;
    min-width: 1em;
    text-align: center;
    color: var(
      --axis-input-color,
      var(--color-text-secondary)
    ); // Use CSS variable for color
    margin-bottom: var(--space-3xs);
  }

  .input-stepper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3xs);
  }

  input[type="number"] {
    width: 4.5ch;
    padding: var(--space-3xs) var(--space-2xs);
    font-size: 1em;
    background-color: var(--color-background, #fff);
    border-radius: var(--radius-sm);
    color: var(--color-text-primary, #000);
    text-align: center;
    border: 1px solid var(--color-border, #ccc); // Added border for better visibility
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease;
    order: 2; // Place input between buttons

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    -moz-appearance: textfield;

    &:focus {
      outline: none;
      border-color: var(
        --axis-input-color,
        var(--color-accent)
      ); // Highlight with axis or accent color
      box-shadow: 0 0 0 2px var(--axis-input-color, var(--color-accent-light));
    }
  }

  .stepper-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4.5ch;
    height: auto;
    padding: var(--space-3xs);
    font-size: 1.1em;
    font-weight: bold;
    line-height: 1;
    color: var(--axis-input-color, var(--color-text-secondary));
    background-color: var(--color-surface, #f0f0f0);
    border: 1px solid var(--color-border, #ccc);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition:
      background-color 0.1s ease,
      color 0.1s ease,
      transform 0.1s ease;

    &.plus-button {
      order: 1;
    }

    &.minus-button {
      order: 3;
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

  .axis-input-group:focus-within {
    // Optional: if input focus style is not enough
    // box-shadow: 0 0 3px 1px var(--axis-input-color, var(--color-accent-light));
  }
</style>

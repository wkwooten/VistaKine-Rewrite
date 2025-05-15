<script lang="ts">
  let {
    label,
    value = $bindable(0), // Bindable value, default to 0
    axisColor = "var(--text-1)", // Default color
    stepAmount = 1,
    min = undefined, // Optional min
    max = undefined, // Optional max
    "aria-label": ariaLabel = undefined, // Added to satisfy linter for passthrough
  } = $props<{
    label: string;
    value?: number;
    axisColor?: string;
    stepAmount?: number;
    min?: number | undefined;
    max?: number | undefined;
    "aria-label"?: string | undefined;
  }>();

  function changeValue(direction: 1 | -1) {
    let newValue = value + direction * stepAmount;

    // Clamp value if min/max are provided
    if (min !== undefined) {
      newValue = Math.max(min, newValue);
    }
    if (max !== undefined) {
      newValue = Math.min(max, newValue);
    }
    value = newValue;
  }

  // Debugging (optional, can be removed)
  $effect(() => {
    console.log(`[StyledAxisInput ${label}] Value updated: ${value}`);
  });
</script>

<div class="axis-input-group" style="border-color: {axisColor};">
  <span class="axis-label" style="color: {axisColor};">{label}</span>
  <div class="input-stepper">
    <button
      class="stepper-button"
      onclick={() => changeValue(1)}
      aria-label="Increase {label}">+</button
    >
    <input
      type="number"
      bind:value
      step={stepAmount}
      {min}
      {max}
      placeholder={label}
      onfocus={(e) => (e.target as HTMLInputElement)?.select()}
    />
    <button
      class="stepper-button"
      onclick={() => changeValue(-1)}
      aria-label="Decrease {label}">-</button
    >
  </div>
</div>

<style lang="scss">
  // Styles adapted from NozzleControlPanel.svelte and CoordinateInputPanel.svelte
  .axis-input-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: var(--radius-md);
    padding: var(--space-3xs) var(--space-2xs);
    gap: var(--space-3xs);
    border: 2px solid; /* Color is set inline via prop */
    background-color: transparent;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .axis-label {
    font-weight: 600;
    font-size: 1em;
    min-width: 1em;
    text-align: center;
    margin-bottom: var(--space-3xs);
    /* Color is set inline via prop */
  }

  .input-stepper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3xs);
  }

  .input-stepper input[type="number"] {
    width: 6ch;
    padding: var(--space-2xs) var(--space-xs);
    font-size: 1em;
    background-color: var(--color-background, var(--surface-1));
    border-radius: var(--radius-sm);
    color: var(--color-text-primary, var(--text-1));
    text-align: center;
    border: 1px solid var(--color-border, var(--border-color));
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease;
    order: 2;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    -moz-appearance: textfield;

    &:focus {
      outline: 2px solid var(--focus-ring-color);
      outline-offset: 1px;
      border-color: var(--focus-ring-color);
    }
  }

  .stepper-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 6ch;
    height: auto;
    padding: var(--space-3xs);
    font-size: 1.2em;
    font-weight: bold;
    line-height: 1;
    color: var(--color-text-secondary, var(--text-2));
    background-color: var(--color-surface, var(--surface-1));
    border: 1px solid var(--color-border, var(--border-color));
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
        var(--accent-hover-bg, var(--surface-hover))
      );
      color: var(--color-text-primary, var(--text-1));
    }

    &:active {
      background-color: var(
        --color-surface-active,
        var(--accent-active-bg, var(--surface-active))
      );
      transform: scale(0.95);
    }
  }

  .axis-input-group:focus-within {
    box-shadow: 0 0 3px 1px var(--color-accent-light, var(--focus-ring-color));
  }
</style>

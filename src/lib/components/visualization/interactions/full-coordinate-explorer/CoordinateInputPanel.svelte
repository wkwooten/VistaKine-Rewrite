<script lang="ts">
  import StyledAxisInput from "$lib/components/ui/StyledAxisInput.svelte"; // Import the new component

  // Define props, making x, y, and z bindable from the parent
  let {
    x = $bindable(1),
    y = $bindable(1),
    z = $bindable(1),
  } = $props<{
    // Explicitly type props
    x?: number;
    y?: number;
    z?: number;
  }>();

  const step = 1; // Step amount for the inputs

  // Debugging: Log prop changes (can be commented out later)
  $effect(() => {
    console.log(`[CoordinateInputPanel.svelte] Bound x updated: ${x}`);
  });
  $effect(() => {
    console.log(`[CoordinateInputPanel.svelte] Bound y updated: ${y}`);
  });
  $effect(() => {
    console.log(`[CoordinateInputPanel.svelte] Bound z updated: ${z}`);
  });
</script>

<div class="coordinate-input-panel">
  <StyledAxisInput
    label="X"
    bind:value={x}
    axisColor="var(--axis-color-x)"
    stepAmount={step}
    aria-label="X Coordinate Input"
  />
  <StyledAxisInput
    label="Y"
    bind:value={y}
    axisColor="var(--axis-color-y)"
    stepAmount={step}
    aria-label="Y Coordinate Input"
  />
  <StyledAxisInput
    label="Z"
    bind:value={z}
    axisColor="var(--axis-color-z)"
    stepAmount={step}
    aria-label="Z Coordinate Input"
  />
</div>

<style lang="scss">
  // Styles for the panel that CONTAINS the StyledAxisInput components
  .coordinate-input-panel {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, max-content);
    justify-content: center; // Center the grid items (the 3 input groups)
    gap: var(--space-xs);
    padding: var(--space-xs);
    border: 1px solid var(--color-border, var(--border-color));
    border-radius: var(--radius-md);
    background-color: var(--color-surface-overlay, var(--surface-2));
    pointer-events: auto;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    touch-action: manipulation;
  }

  /*
  All styles related to .axis-input-group, .axis-label, .input-stepper,
  input[type="number"], and .stepper-button have been moved to StyledAxisInput.svelte
  */
</style>

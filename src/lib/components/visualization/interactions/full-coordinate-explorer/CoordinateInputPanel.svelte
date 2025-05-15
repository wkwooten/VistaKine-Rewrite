<script lang="ts">
  import AxisInput from "$lib/components/visualization/elements/ui/AxisInput.svelte";

  let {
    x = $bindable(1),
    y = $bindable(1),
    z = $bindable(1),
    min,
    max,
  } = $props<{
    x?: number;
    y?: number;
    z?: number;
    min?: number | undefined;
    max?: number | undefined;
  }>();

  const stepAmount = 1;

  // Debugging logs (can be removed)
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
  <AxisInput
    label="X"
    bind:value={x}
    axisColor="var(--axis-color-x)"
    step={stepAmount}
    {min}
    {max}
  />
  <AxisInput
    label="Y"
    bind:value={y}
    axisColor="var(--axis-color-y)"
    step={stepAmount}
    {min}
    {max}
  />
  <AxisInput
    label="Z"
    bind:value={z}
    axisColor="var(--axis-color-z)"
    step={stepAmount}
    {min}
    {max}
  />
</div>

<style lang="scss">
  .coordinate-input-panel {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, max-content);
    justify-content: center;
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
  input[type="number"], and .stepper-button are now in AxisInput.svelte
  */
</style>

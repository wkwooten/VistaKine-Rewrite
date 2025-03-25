<script>
  import { slide } from 'svelte/transition';
  let showCalculation = false;
</script>

<details open on:toggle={() => showCalculation = !showCalculation}>
  <summary>Guided Calculation</summary>
  <div class="calculation" transition:slide={showCalculation ? {} : {}}>
    <slot />  <!-- Slot for the content of the calculation -->
  </div>
</details>

<style lang="scss">
  /* Styles for guided calculation */
  .calculation {
    margin-top: var(--space-s);
    padding: var(--space-s);
    border-radius: var(--radius-sm);
    background-color: var(--bg-secondary);

    form {
      margin-top: var(--space-s);
    }

    label {
      display: block;
      margin-bottom: var(--space-m);
    }

    input {
      margin: 0 var(--space-xs);
      width: 60px;
    }
  }
</style>
<script>
  import { slide } from 'svelte/transition';
  let showFormulas = false; // Local state for this component
</script>

<details class="formula-accordion" open on:toggle={() => showFormulas = !showFormulas}>
  <summary>Key Formulas</summary>
  <div class="formula-content" transition:slide>
    <slot />
  </div>
</details>

<style lang="scss">
  /* Styles for the formula accordion */
  .formula-accordion {
    margin-bottom: var(--space-m);
    border-left: 3px solid var(--primary-color);
    padding-left: var(--space-s);
  }

  .formula-content {
    padding: var(--space-s);
    margin-top: var(--space-xs);
    border-radius: var(--radius-sm);
    background-color: var(--bg-secondary);
  }
</style>
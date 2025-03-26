<script>
  import { slide } from 'svelte/transition';
  let showFormulas = false; // Local state for this component
</script>

<details class="formula-accordion" open on:toggle={() => showFormulas = !showFormulas}>
  <summary class="formula-header">Key Formulas</summary>
  <div class="formula-content" transition:slide>
    <slot />
  </div>
</details>

<style lang="scss">
  /* Styles for the formula accordion */
  .formula-accordion {
    margin-bottom: var(--space-m);
    border-left: 3px solid var(--chapter-color, var(--primary-color));
    padding-left: var(--space-s);
  }

  .formula-content {
    padding: var(--space-m);
    margin-top: var(--space-xs);
    border-radius: var(--radius-md);
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
  }

  .formula-header {
    font-size: var(--step-1);
    font-weight: 600;
  }
</style>
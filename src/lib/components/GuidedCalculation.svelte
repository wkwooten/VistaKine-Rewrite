<script lang="ts">
  import Accordion from './Accordion.svelte'; // Import the generic Accordion
</script>

<Accordion initiallyOpen={false}>
  <span slot="header">Guided Calculation</span>
  <div slot="content" class="calculation-inner-content">
    <slot />
  </div>
</Accordion>

<style lang="scss">
  /* Styles for guided calculation */
  .calculation {
    margin-top: var(--space-s);
    padding: var(--space-s);
    border-radius: var(--radius-sm);
    background-color: var(--bg-secondary);

    p {
      margin-bottom: var(--space-xs);
    }

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

  /* Remove styles related to the old .calculation container */
  /* as the Accordion component handles the outer styling */
</style>
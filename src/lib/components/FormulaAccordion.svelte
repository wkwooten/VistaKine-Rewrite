<script lang="ts">
  import Accordion from './Accordion.svelte';
</script>

<Accordion initiallyOpen={true}>
  <span slot="header">Key Formulas</span>
  <div slot="content">
    <slot />
  </div>
</Accordion>

<style lang="scss">
  /*
   * Use :global() here because the .formula-label element
   * is defined in the parent component (e.g., kinematics.svelte)
   * and passed into the <slot />. Svelte's default scoped styles
   * wouldn't normally affect slotted content from outside.
   */
  :global(.formula-label) {
    font-size: 1.2em; /* Slightly larger than body, adjust as needed */
    font-weight: 600; /* Increased font weight */
    margin-bottom: var(--space-3xs); /* Add a small space below the label */
    color: var(--text-color); /* Ensure consistent text color */
  }

  /* Add other styles specific only to FormulaAccordion if needed */
</style>
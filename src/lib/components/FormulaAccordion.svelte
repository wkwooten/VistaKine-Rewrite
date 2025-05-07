<script lang="ts">
  import Accordion from "./Accordion.svelte";
</script>

<Accordion initiallyOpen={true}>
  <span slot="header">
    <!-- Replace Sigma component with raw SVG -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="accordion-icon lucide lucide-sigma-icon lucide-sigma"
      ><path
        d="M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2"
      /></svg
    >
    Key Formulas
  </span>
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
    color: var(--color-text-primary); /* Ensure consistent text color */
  }

  /* Style for the icon within the accordion header */
  .accordion-icon {
    margin-right: var(--space-2xs);
    vertical-align: middle;
    display: inline-block; // Ensure inline-block for SVG
  }

  /* Add other styles specific only to FormulaAccordion if needed */
  button {
    text-align: left;
    color: var(--color-text-primary); /* Ensure consistent text color */
  }
</style>

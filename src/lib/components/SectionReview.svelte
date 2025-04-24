<script lang="ts">
  import Accordion from './Accordion.svelte';
  // import { GraduationCap } from 'lucide-svelte'; // Remove lucide import
</script>

<div class="section-review">
  <Accordion initiallyOpen={true}>
    <span slot="header">
      <!-- Replace GraduationCap component with raw SVG -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-icon lucide lucide-book-check-icon lucide-book-check"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="m9 9.5 2 2 4-4"/></svg>
      Check Your Understanding
    </span>
    <div slot="content">
      <slot />
    </div>
  </Accordion>
</div>

<style lang="scss">
  .section-review {
    /* Removed margin-top: var(--space-m); */
    /* Removed margin-bottom: var(--space-m); */
  }

  /* Style for the icon within the accordion header - reuse existing class */
  .accordion-icon {
    margin-right: var(--space-2xs);
    vertical-align: middle;
    display: inline-block; // Ensure inline-block for SVG
  }
</style>
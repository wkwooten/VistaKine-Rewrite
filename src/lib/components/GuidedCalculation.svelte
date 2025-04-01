<script lang="ts">
  import Accordion from './Accordion.svelte'; // Import the generic Accordion
  // import { Calculator } from 'lucide-svelte'; // Remove lucide import
</script>

<Accordion initiallyOpen={false}>
  <span slot="header">
    <!-- Calculator SVG with adjusted size -->
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-icon lucide lucide-calculator-icon lucide-calculator">
      <rect width="16" height="20" x="4" y="2" rx="2"/>
      <line x1="8" x2="16" y1="6" y2="6"/>
      <line x1="16" x2="16" y1="14" y2="18"/>
      <path d="M16 10h.01"/>
      <path d="M12 10h.01"/>
      <path d="M8 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M8 14h.01"/>
      <path d="M12 18h.01"/>
      <path d="M8 18h.01"/>
    </svg>
    Guided Calculation
  </span>
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

  /* Style for the icon within the accordion header */
  .accordion-icon {
    margin-right: var(--space-2xs);
    vertical-align: middle; /* Ensure vertical alignment */
    display: inline-block; // Ensure inline-block for SVG
  }

  /* Remove styles related to the old .calculation container */
  /* as the Accordion component handles the outer styling */
</style>
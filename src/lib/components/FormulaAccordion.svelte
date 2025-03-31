<script lang="ts">
  import Accordion from './Accordion.svelte';
</script>

<Accordion initiallyOpen={true}>
  <span slot="header">Key Formulas</span>
  <div slot="content">
    <slot />
  </div>
</Accordion>

<!-- No <style> block needed here anymore unless you have -->
<!-- styles *specific* only to the FormulaAccordion variant -->
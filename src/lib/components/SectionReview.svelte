<script lang="ts">
  import Accordion from './Accordion.svelte';
</script>

<div class="section-review">
  <Accordion initiallyOpen={true}>
    <span slot="header">Test Your Knowledge</span>
    <div slot="content">
      <slot />
    </div>
  </Accordion>
</div>

<style lang="scss">
  .section-review {
    margin-top: var(--space-m);
    margin-bottom: var(--space-m);
  }
</style>
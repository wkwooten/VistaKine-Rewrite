<script>
  import { slide } from 'svelte/transition';
  let showReview = true;
</script>

<div class="section-review">
  <details open on:toggle={() => showReview = !showReview}>
    <summary>Test Your Knowledge</summary>
    <div class="review-content" transition:slide={showReview ? {} : {}}>
      <slot />  <!-- Slot for the quiz or review content -->
    </div>
  </details>
</div>

<style lang="scss">
  /* Styles for section review */
  .section-review {
    margin-top: var(--space-m);
    border-left: 3px solid var(--chapter-color);
    padding-left: var(--space-s);
    margin-bottom: var(--space-m); /* Added to match FormulaAccordion */
  }

  details {
    margin-block: 0; /* Changed to 0 to reduce extra spacing */
    padding: 0; /* Changed to 0 to remove padding from details */
    margin-bottom: 0; /* Changed to 0 to reduce extra spacing */
  }

  summary {
    cursor: pointer;
    font-weight: 600;
    margin-bottom: var(--space-s);
    font-size: var(--step-1);
    color: var(--primary-color);

    &:hover {
      color: var(--primary-color);
    }
  }

  .review-content {
    padding: var(--space-m);
    margin-top: var(--space-xs);
    border-radius: var(--radius-md);
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
  }
</style>
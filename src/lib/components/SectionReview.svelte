<script>
  import { slide } from 'svelte/transition';
  let showReview = false;
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
    margin-top: var(--space-l);
    padding-top: var(--space-m);
    border-top: 1px solid var(--border-color);
  }

  details {
    margin-block: var(--space-m);
    padding: var(--space-m);
    margin-bottom: var(--space-m);
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

    &::before {
      content: "+ ";
      margin-right: var(--space-xs);
    }
  }

  .review-content {
    margin-top: var(--space-s);
    padding: var(--space-s);
  }
</style>
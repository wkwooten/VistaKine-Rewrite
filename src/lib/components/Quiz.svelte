<div class="quiz">
  <slot /> <!-- Slot for quiz questions and form -->
</div>

<style lang="scss">
  /* Styles for quiz */
  .quiz {
    margin-top: var(--space-m);
    padding: var(--space-s);
    background-color: var(--bg-secondary);
    counter-reset: question-counter;
  }

</style>
<div class="quiz">
  <slot /> <!-- Slot for quiz questions and form -->
</div>

<style lang="scss">
  /* Styles for quiz */
  .quiz {
    margin-top: var(--space-m);
    padding: var(--space-s);
    background-color: var(--bg-secondary);
  }

  .quiz-question-group {
    margin-bottom: var(--space-m);
  }

  .multiple-choice-question {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  p {
    font-weight: 600;
  }

  form {
    margin-top: var(--space-2xs);
    margin-bottom: 0;
  }

  label {
    display: block;
    margin-bottom: var(--space-2xs);
    padding: var(--space-m);
    border-radius: var(--radius-md);
    background-color: var(--bg-secondary);

    &:hover {
      background-color: var(--bg-hover);
    }
  }

  input[type="radio"] {
    margin-right: var(--space-xs);
  }

</style>
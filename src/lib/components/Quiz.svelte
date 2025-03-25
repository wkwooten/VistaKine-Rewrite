<div class="quiz">
  <slot /> <!-- Slot for quiz questions and form -->
</div>

<style lang="scss">
  /* Styles for quiz */
  .quiz {
    margin-top: var(--space-s);

    p {
      margin-bottom: var(--space-xs);
      font-weight: 500;
    }

    form {
      margin-bottom: var(--space-m);
    }

    label {
      display: block;
      margin-bottom: var(--space-xs);
      padding: var(--space-xs);
      border-radius: var(--radius-sm);

      &:hover {
        background-color: var(--bg-hover);
      }
    }

    input[type="radio"] {
      margin-right: var(--space-xs);
    }
  }
</style>
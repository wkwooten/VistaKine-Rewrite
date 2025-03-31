<div class="quiz">
  <slot /> <!-- Slot for quiz questions and form -->
</div>

<style lang="scss">
  /* Styles for quiz */
  .quiz {
    margin-top: var(--space-m); /* Added top margin to give quiz some space from surrounding content */
    padding: var(--space-s); /* Added padding around the quiz container for better visual separation */
    border-radius: var(--radius-md); /* Added border-radius to the quiz container */
    background-color: var(--bg-secondary); /* Added background color to the quiz container */
    border: 1px solid var(--border-color); /* Added border to the quiz container */
  }

  p {
    margin-bottom: var(--space-xs); /* Reduced bottom margin for questions to tighten spacing */
    font-weight: 600; /* Increased font weight for questions */
  }

  form {
    margin-top: var(--space-2xs); /* Reduced top margin to pull form closer to question */
    margin-bottom: var(--space-m); /* Increased bottom margin to separate questions */
  }

  label {
    display: block;
    margin-bottom: var(--space-2xs); /* Reduced bottom margin between labels for tighter spacing */
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
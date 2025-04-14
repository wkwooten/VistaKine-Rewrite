<div class="scenario">
  <slot /> <!-- Slot for scenario content (paragraphs) -->
</div>

<style lang="scss">
  /* Styles for scenario */
  .scenario {
    margin-bottom: var(--space-m);
    padding: var(--space-s) var(--space-m);
    border: 1px solid var(--color-border);
    background-color: var(--bg-alt);
    border-radius: var(--radius-md);

    p {
      margin-bottom: var(--space-xs);
      font-style: italic;
      color: var(--color-text-secondary);

      strong {
        font-weight: 600;
        font-style: normal;
        /* color: var(--highlight-color); Removed generic highlight */
      }
    }

    /* Apply speaker-specific colors using data attributes */
    :global(p[data-speaker="Surya"] strong) {
      color: var(--surya-color, var(--color-accent)); /* Fallback to accent */
    }

    :global(p[data-speaker="Leo"] strong) {
      color: var(--leo-color, var(--secondary-color)); /* Fallback to secondary */
    }
  }

  .scenario-description {
    font-size: var(--step-0);
    line-height: 1.6;
    color: var(--color-text-secondary);
    max-width: var(--readable-max-width);
    margin: var(--space-m) auto;
  }
</style>
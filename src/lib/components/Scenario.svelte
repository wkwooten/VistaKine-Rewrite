<div class="scenario">
  <slot /> <!-- Slot for scenario content (paragraphs) -->
</div>

<style lang="scss">
  /* Styles for scenario */
  .scenario {
    margin-bottom: var(--space-m);
    padding: var(--space-s) var(--space-m);
    border-left: 3px solid var(--secondary-color);
    background-color: var(--bg-alt);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;

    p {
      margin-bottom: var(--space-xs);
      font-style: italic;

      strong {
        font-weight: 600;
        font-style: normal;
        color: var(--highlight-color);
      }
    }
  }
</style>
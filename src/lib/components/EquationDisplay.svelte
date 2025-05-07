<script lang="ts">
  // Props can be added here if needed in the future, e.g., for specific equation types or numbering.
</script>

<div class="equation-display">
  <slot />
</div>

<style lang="scss">
  .equation-display {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: var(--space-s);
    margin-bottom: var(--space-s);
    padding: var(--space-xs);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background-color: var(--color-background);
    overflow-x: scroll;
  }

  :global(.equation-display .katex-display) {
    margin: 0;
  }
  :global(.equation-display .katex) {
    font-size: var(--step-1); // Example: Slightly larger font for equations
    text-align: center; // Ensure the text itself is centered if it's multi-line
  }
</style>

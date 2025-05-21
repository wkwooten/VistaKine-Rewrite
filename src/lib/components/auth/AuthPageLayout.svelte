<script lang="ts">
  let { title = "", children } = $props(); // Combined $props and correct children access
</script>

<div class="auth-page-container">
  {#if title}
    <h1>{title}</h1>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="scss">
  .auth-page-container {
    max-width: 600px;
    margin: var(--space-xl) auto;
    padding: var(--space-l);
    background-color: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);

    h1 {
      text-align: center;
      margin-bottom: var(--space-l);
      font-size: var(--step-3);
    }

    // Decided against :global styles for p and a here to give more control to the slotted content.
    // Specific link/text components can be made if needed later.
  }
</style>

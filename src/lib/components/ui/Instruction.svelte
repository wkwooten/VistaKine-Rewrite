<script lang="ts">
  import { Info } from "lucide-svelte";
  import type { Snippet } from "svelte";

  // Props for colors are removed, will use direct CSS variables from _variables.scss
  let { children }: { children?: Snippet<[]> } = $props();
</script>

<div class="instruction-container">
  <Info size={24} class="icon" />
  <div class="content-wrapper">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style lang="scss">
  .instruction-container {
    display: flex;
    align-items: flex-start; // Align icon to the top of the text
    gap: var(--space-xs);
    padding: var(--space-s);
    background-color: var(
      --color-surface-alt
    ); // Directly use variable from _variables.scss
    color: var(
      --color-text-secondary
    ); // Directly use variable from _variables.scss
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-light); // Uses variable from _variables.scss
    margin-block: var(--space-s); // Add some space around the component
  }

  .icon {
    flex-shrink: 0;
    display: inline-flex; // Helps with alignment
    padding-top: 0.15em; // Fine-tune icon vertical alignment with text
    color: var(
      --brand
    ); // Directly use variable from _variables.scss (or global/chapter theme)
    width: 1.25em; // Relative to font size
    height: 1.25em; // Relative to font size
  }

  .content-wrapper {
    flex-grow: 1;
    font-size: var(--step--1); // Slightly smaller text for instructions
    line-height: 1.6;

    :global(strong) {
      color: var(
        --brand
      ); // Highlight strong text with brand color (assuming --brand exists)
    }

    :global(code) {
      background-color: var(
        --color-surface-alt
      ); // Changed from --surface-3 to --color-surface-alt
      padding: 0.1em 0.3em;
      border-radius: var(--radius-md);
      font-size: 0.9em;
    }
  }
</style>

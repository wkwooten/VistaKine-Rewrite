<script lang="ts">
  type ButtonType = "button" | "submit" | "reset";
  type ButtonVariant = "primary" | "secondary" | "google" | "apple";

  let {
    type = "button" as ButtonType,
    variant = "primary" as ButtonVariant,
    disabled = false,
    loading = false,
    children = undefined, // For button text or inner elements like icons
    class: extraClass = undefined, // Capture user-provided class separately
    // Allow any other props to be spread onto the button element
    ...restProps
  } = $props();

  const baseClass = "btn";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    google: "btn-google",
    apple: "btn-apple",
  };

  // Reactive statement to compute the full class string
  let computedClass = $derived(
    `${baseClass} ${variantClasses[variant]} ${extraClass || ""} ${loading ? "loading" : ""}`.trim()
  );
</script>

<button {type} class={computedClass} {disabled} {...restProps}>
  {#if loading}
    <div class="spinner"></div>
    <span>Loading...</span>
  {:else if children}
    {@render children()}
  {:else}
    <span><!-- Default empty span if no children and not loading --></span>
  {/if}
</button>

<style lang="scss">
  .btn {
    padding: var(--space-s) var(--space-m);
    border: none;
    border-radius: var(--radius-sm);
    font-size: var(--step-0);
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;
    width: 100%; // Common style for auth buttons
    display: flex; // To center content and handle loading spinner
    align-items: center;
    justify-content: center;
    gap: var(--space-xs); // Gap between icon/spinner and text

    &:disabled {
      background-color: var(
        --color-disabled,
        #ccc
      ); // Ensure --color-disabled is defined
      color: var(
        --color-disabled-text,
        #666
      ); // Ensure --color-disabled-text is defined
      cursor: not-allowed;
      border-color: var(--color-disabled, #ccc);
    }

    &.btn-primary {
      background-color: var(--color-accent);
      color: var(--color-background);
      &:hover:not(:disabled) {
        background-color: var(--color-accent-dark);
      }
    }

    &.btn-secondary {
      // Example, can be adjusted
      background-color: var(--color-surface-raised);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
      &:hover:not(:disabled) {
        background-color: var(--color-surface-hover);
      }
    }

    &.btn-google {
      background-color: var(--color-google-blue);
      color: white;
      border: none; // Or a subtle border

      &:hover:not(:disabled) {
        background-color: var(--color-google-blue-hover);
      }

      // Styles for the icon and text within the Google button if needed globally
      // For instance, if the icon and text are always structured the same way.
      // However, this is better handled by passing the icon and text via the children snippet.
      :global(.google-icon) {
        margin-right: var(--space-xs);
      }
    }

    &.btn-apple {
      background-color: var(--color-bg-btn-apple, #000000); // Typically black
      color: var(--color-text-btn-apple, #ffffff); // Typically white
      border: 1px solid var(--color-border-btn-apple, #000000); // Or a subtle border

      &:hover:not(:disabled) {
        background-color: var(
          --color-bg-btn-apple-hover,
          #333333
        ); // Darker gray
      }

      // Consistent icon spacing for apple button
      :global(.apple-icon) {
        margin-right: var(--space-xs);
      }
    }

    &.loading {
      // Basic Loading Spinner (can be replaced with an SVG or more complex animation)
      .spinner {
        display: inline-block;
        width: 1em; // Adjust size relative to font
        height: 1em;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.75s linear infinite;
        margin-right: var(--space-xs); // Removed as flex gap should handle it
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    }
  }
</style>

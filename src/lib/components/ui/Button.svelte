<script lang="ts">
  let {
    onclick = () => {},
    variant = "primary", // 'primary', 'secondary', 'danger', 'ghost', 'link'
    size = "md", // 'sm', 'md', 'lg'
    disabled = false,
    fullWidth = false,
    extraClass = "",
    children, // Declare children prop for the default slot
  } = $props<{
    onclick?: (event: MouseEvent) => void;
    variant?: "primary" | "secondary" | "danger" | "ghost" | "link" | "outline";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    fullWidth?: boolean;
    extraClass?: string;
    children?: any; // Type for the default slot snippet
  }>();

  // Base classes
  const baseClasses = "btn";

  // Variant classes
  const variantClasses: Record<typeof variant, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    ghost: "btn-ghost",
    link: "btn-link",
    outline: "btn-outline",
  };

  // Size classes
  const sizeClasses: Record<typeof size, string> = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
  };

  let buttonClasses = $derived(
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "btn-block" : ""} ${extraClass}`.trim()
  );
</script>

<button class={buttonClasses} {disabled} {onclick} type="button">
  {#if children}
    {@render children()}
  {/if}
</button>

<style lang="scss">
  /* Minimalistic button styling - to be expanded based on project design system */
  /* These would ideally come from a global stylesheet or a more robust system */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2xs, 0.5rem);
    font-weight: var(--font-weight-semibold, 600);
    text-decoration: none;
    white-space: nowrap;
    border-radius: var(--radius-md, 0.375rem);
    border: 1px solid transparent;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;
    user-select: none;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.65;
    }
  }

  .btn-block {
    width: 100%;
  }

  /* Sizes */
  .btn-sm {
    padding: var(--space-xs, 0.5rem) var(--space-s, 0.75rem);
    font-size: var(--step--1, 0.875rem);
    line-height: 1.25rem;
  }
  .btn-md {
    padding: var(--space-s, 0.75rem) var(--space-m, 1rem);
    font-size: var(--step-0, 1rem);
    line-height: 1.5rem;
  }
  .btn-lg {
    padding: var(--space-m, 1rem) var(--space-l, 1.25rem);
    font-size: var(--step-1, 1.125rem);
    line-height: 1.75rem;
  }

  /* Variants (Example styling - theme variables should be used) */
  .btn-primary {
    background-color: var(--color-primary, #007bff);
    color: var(--color-on-primary, white);
    border-color: var(--color-primary, #007bff);
    &:hover:not(:disabled) {
      background-color: var(--color-primary-hover, #0056b3);
      border-color: var(--color-primary-hover, #0056b3);
    }
    &:active:not(:disabled) {
      background-color: var(--color-primary-active, #004085);
      border-color: var(--color-primary-active, #004085);
    }
    &:focus-visible {
      outline: 2px solid var(--color-primary-focus-ring, #007bff);
      outline-offset: 2px;
    }
  }

  .btn-secondary {
    background-color: var(--color-secondary, #6c757d);
    color: var(--color-on-secondary, white);
    border-color: var(--color-secondary, #6c757d);
    &:hover:not(:disabled) {
      background-color: var(--color-secondary-hover, #545b62);
      border-color: var(--color-secondary-hover, #545b62);
    }
    &:active:not(:disabled) {
      background-color: var(--color-secondary-active, #474e54);
      border-color: var(--color-secondary-active, #474e54);
    }
    &:focus-visible {
      outline: 2px solid var(--color-secondary-focus-ring, #6c757d);
      outline-offset: 2px;
    }
  }

  .btn-danger {
    background-color: var(--color-danger, #dc3545);
    color: var(--color-on-danger, white);
    border-color: var(--color-danger, #dc3545);
    &:hover:not(:disabled) {
      background-color: var(--color-danger-hover, #c82333);
      border-color: var(--color-danger-hover, #c82333);
    }
    &:active:not(:disabled) {
      background-color: var(--color-danger-active, #bd2130);
      border-color: var(--color-danger-active, #bd2130);
    }
    &:focus-visible {
      outline: 2px solid var(--color-danger-focus-ring, #dc3545);
      outline-offset: 2px;
    }
  }

  .btn-outline {
    background-color: transparent;
    color: var(--color-primary, #007bff);
    border-color: var(--color-primary, #007bff);
    &:hover:not(:disabled) {
      background-color: var(--color-primary-hover-bg, rgba(0, 123, 255, 0.1));
      color: var(--color-primary-hover, #0056b3);
      border-color: var(--color-primary-hover, #0056b3);
    }
    &:active:not(:disabled) {
      background-color: var(--color-primary-active-bg, rgba(0, 123, 255, 0.2));
    }
    &:focus-visible {
      outline: 2px solid var(--color-primary-focus-ring, #007bff);
      outline-offset: 2px;
    }
  }

  .btn-ghost {
    background-color: transparent;
    border-color: transparent;
    color: var(--color-text-link, var(--color-primary, #007bff));
    &:hover:not(:disabled) {
      background-color: var(--color-surface-hover, rgba(0, 0, 0, 0.05));
      color: var(--color-text-link-hover, var(--color-primary-hover, #0056b3));
    }
    &:active:not(:disabled) {
      background-color: var(--color-surface-active, rgba(0, 0, 0, 0.1));
    }
  }

  .btn-link {
    background-color: transparent;
    border-color: transparent;
    color: var(--color-text-link, var(--color-primary, #007bff));
    text-decoration: underline;
    padding-left: var(--space-3xs);
    padding-right: var(--space-3xs);
    &:hover:not(:disabled) {
      color: var(--color-text-link-hover, var(--color-primary-hover, #0056b3));
      text-decoration-color: var(
        --color-text-link-hover,
        var(--color-primary-hover, #0056b3)
      );
    }
  }
</style>

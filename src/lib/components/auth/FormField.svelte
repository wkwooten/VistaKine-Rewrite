<script lang="ts">
  let {
    id,
    label,
    type = "text",
    value = $bindable(),
    required = false,
    errorMessage = "",
    placeholder = undefined,
    autocomplete = undefined,
    // Event handlers - these will be passed directly to the input
    oninput = undefined,
    onblur = undefined,
    onkeyup = undefined,
    onfocus = undefined,
    // For more complex content within the form field, like password toggles or requirement lists
    children = undefined,
  } = $props();

  // Svelte 5 runes for component-specific state if ever needed, but for now props cover it.
</script>

<div class="form-field">
  <label for={id}>{label}</label>
  <input
    {type}
    {id}
    bind:value
    {required}
    {oninput}
    {onblur}
    {onkeyup}
    {onfocus}
    {placeholder}
    {autocomplete}
    class={errorMessage ? "invalid-input" : ""}
  />
  {#if children}
    {@render children()}
  {/if}
  {#if errorMessage}
    <small class="error-message">{errorMessage}</small>
  {/if}
</div>

<style lang="scss">
  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    position: relative; // Important for any absolutely positioned children if added later

    label {
      font-size: var(--step-0);
      color: var(--color-text-secondary);
    }

    input {
      padding: var(--space-s);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: var(--step-0);
      background-color: var(--color-background);
      color: var(--color-text-primary);

      &:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: 0 0 0 2px var(--color-accent-translucent);
      }

      // Style for invalid input, can be triggered by parent via prop or internal validation
      &.invalid-input {
        border-color: var(--color-error, #d32f2f); // Fallback red
        box-shadow: 0 0 0 2px
          var(--color-error-translucent, rgba(211, 47, 47, 0.2)); // Fallback translucent red
        // Ensure --color-error and --color-error-translucent are in _variables.scss
      }
    }
  }

  .error-message {
    color: var(--color-error, #d32f2f); // Fallback red
    font-size: var(--step--2);
    margin-top: var(--space-3xs);
  }
</style>

<script lang="ts">
  import EyeIcon from "$lib/components/icons/EyeIcon.svelte";
  import EyeOffIcon from "$lib/components/icons/EyeOffIcon.svelte";

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
    children = undefined, // Keep this for general content
    // Specific prop for password visibility toggle
    showPasswordToggle = false,
    isPasswordVisible = $bindable(false), // Bindable state for password visibility
    childrenPosition = "inside", // New prop: "inside" (default) or "before"
  } = $props();

  let hasFocus = $state(false);
  let inputElement: HTMLInputElement | undefined = $state();

  function togglePasswordVisibility() {
    isPasswordVisible = !isPasswordVisible;
  }

  // Reactive properties to control label position
  const isLabelActive = $derived(
    hasFocus ||
      (value && value.length > 0) ||
      (inputElement && placeholder && inputElement.placeholder !== "")
  );
</script>

<div
  class="form-field"
  class:focused={hasFocus}
  class:active={isLabelActive}
  class:has-error={!!errorMessage}
>
  {#if children && childrenPosition === "before"}
    <div class="children-before">
      {@render children()}
    </div>
  {/if}
  <label for={id}>{label}</label>
  <div class="input-wrapper">
    <input
      bind:this={inputElement}
      {type}
      {id}
      bind:value
      {required}
      {placeholder}
      {autocomplete}
      onfocus={() => {
        hasFocus = true;
        onfocus?.();
      }}
      onblur={() => {
        hasFocus = false;
        onblur?.();
      }}
      {oninput}
      {onkeyup}
      class={errorMessage ? "invalid-input" : ""}
    />
    {#if showPasswordToggle}
      <button
        type="button"
        class="password-toggle"
        onclick={togglePasswordVisibility}
        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
      >
        {#if isPasswordVisible}
          <EyeOffIcon />
        {:else}
          <EyeIcon />
        {/if}
      </button>
    {/if}
    {#if children && childrenPosition === "inside"}
      <div class="slotted-content">
        {@render children()}
      </div>
    {/if}
  </div>
  {#if errorMessage}
    <small class="error-message">{errorMessage}</small>
  {/if}
</div>

<style lang="scss">
  .form-field {
    position: relative;
    display: flex;
    flex-direction: column;
    // gap: var(--space-xs); // Gap handled by margin/padding now

    // New style for children positioned before
    .children-before {
      margin-bottom: var(--space-xs); // Add some space before the input field
      // Any other specific styling for this container can go here
    }

    label {
      position: absolute;
      left: var(--space-s);
      background: var(--color-surface);
      top: 0; // Always at the top
      transform: translateY(-50%) scale(0.85); // Always scaled and moved up
      transform-origin: left center; // For better scaling alignment
      font-size: var(--step-0); // Base font size before scaling
      color: var(--color-text-secondary); // Default color for non-active
      pointer-events: none;
      transition:
        color 0.2s ease-out,
        background-color 0.2s ease-out; // Specific transitions
      padding: 0 var(--space-3xs);
      z-index: 1; // Ensure label is above the input field for the notch effect
    }

    // When field has content/placeholder OR is focused, label gets notch background & appropriate text color.
    &.active label,
    &.focused label {
      background-color: var(--color-surface);
      // Text color will be determined by focus and error status below.
    }

    // Focused (and not error) state text color
    &.focused:not(.has-error) label {
      color: var(--color-accent);
    }

    // Error state text color (takes precedence if also focused or active)
    // The background-color for the notch in error state is handled by the .active or .focused rules above.
    &.has-error label {
      color: var(--color-error);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      transition: border-color 0.2s ease-out;
    }

    // When form field is focused, input-wrapper border changes
    &.focused .input-wrapper {
      border-color: var(--color-accent);
    }
    &.focused.has-error .input-wrapper {
      border-color: var(--color-error);
    }
    // When form field has an error but is not focused, input-wrapper border also changes
    &.has-error:not(.focused) .input-wrapper {
      border-color: var(--color-error);
    }

    input {
      flex-grow: 1;
      padding: var(--space-s);
      padding-right: var(--space-xl); // Make space for the icon if present
      border: none;
      border-radius: 0;
      font-size: var(--step-0);
      background-color: transparent;
      color: var(--color-text-primary);
      line-height: 1.5; // Added for better vertical alignment of text
      min-height: calc(
        var(--step-0) * 1.5 + var(--space-s) * 2 + 2px
      ); // Ensure consistent height

      &:focus {
        outline: none;
      }

      &.invalid-input {
        // border-color: var(--color-error, #d32f2f); // Border is now on wrapper
        // The invalid state visual cue is primarily the border on the wrapper and label color
        &:focus {
          // border-color: var(
          //   --color-error,
          //   #d32f2f
          // ); // Border is now on wrapper
        }
      }
    }

    .password-toggle {
      position: absolute;
      right: var(--space-s);
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--color-text-secondary);
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover,
      &:focus {
        color: var(--color-accent);
        outline: none;
      }

      :global(svg) {
        // Target the SVG within the icon components
        width: var(--step-1);
        height: var(--step-1);
      }
    }
    .slotted-content {
      margin-top: var(--space-xs); // Add some space above the slotted content
      width: 100%; // Ensure it takes full width if needed
    }
  }

  .error-message {
    color: var(--color-error, #d32f2f);
    font-size: var(--step--2);
    margin-top: var(--space-3xs);
    padding-left: var(--space-xs);
  }
</style>

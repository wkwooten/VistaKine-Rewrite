<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { goto } from "$app/navigation";
  import AuthPageLayout from "$lib/components/auth/AuthPageLayout.svelte";
  import FormField from "$lib/components/auth/FormField.svelte";
  import Button from "$lib/components/auth/Button.svelte";

  let email = $state("");
  let message = $state("");
  let errorMessage = $state("");
  let emailError = $state("");
  let loading = $state(false);

  function validateEmail() {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email) {
      emailError = "Email is required.";
    } else if (!emailRegex.test(email)) {
      emailError = "Invalid email format.";
    } else {
      emailError = "";
    }
  }

  async function handlePasswordReset(event: SubmitEvent) {
    event.preventDefault();
    validateEmail();
    if (emailError) return;

    loading = true;
    message = "";
    errorMessage = "";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    loading = false;
    if (error) {
      console.error("Error sending password reset email:", error.message);
      errorMessage = `Error: ${error.message}`;
    } else {
      message =
        "Password reset email sent. Please check your inbox (and spam folder) for a link to reset your password.";
    }
  }
</script>

<AuthPageLayout title="Forgot Password">
  {#snippet children()}
    <form onsubmit={handlePasswordReset} class="auth-form">
      <p class="info-text">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
      <FormField
        id="email"
        label="Email"
        type="email"
        bind:value={email}
        oninput={validateEmail}
        onblur={validateEmail}
        errorMessage={emailError}
        required
      />

      {#if message && !errorMessage}
        <p class="success-message">{message}</p>
      {/if}
      {#if errorMessage}
        <p class="error-message">{errorMessage}</p>
      {/if}

      <Button
        type="submit"
        variant="primary"
        disabled={loading || !!emailError}
      >
        {#if loading}Sending...{:else}Send Reset Link{/if}
      </Button>
    </form>
    <p class="back-link"><a href="/login">Back to Sign In</a></p>
  {/snippet}
</AuthPageLayout>

<style lang="scss">
  // .auth-page-container styles are now in AuthPageLayout.svelte

  // Styles for the content provided to AuthPageLayout
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
  }

  .info-text {
    // For the introductory paragraph
    text-align: center;
    margin-bottom: var(--space-m);
    font-size: var(--step-0);
    color: var(--color-text-secondary);
  }

  .form-field {
    // Basic styling for the email field container, if not using FormField.svelte for it yet.
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);

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
    }
  }

  .success-message {
    color: var(--color-success, green);
    font-size: var(--step--1);
    text-align: center;
    background-color: var(--color-success-background, #e6fffa);
    padding: var(--space-s);
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-success-border, var(--color-success, green));
  }

  .error-message {
    color: var(--color-error, red);
    font-size: var(--step--1);
    text-align: center;
    background-color: var(--color-error-background, #ffe6e6);
    padding: var(--space-s);
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-error-border, var(--color-error, red));
  }

  .back-link {
    // For the "Back to Sign In" link
    text-align: center;
    margin-top: var(--space-l); // Adjusted margin
    font-size: var(--step--1);
    a {
      color: var(--color-accent);
      text-decoration: underline;
      &:hover {
        text-decoration: none;
      }
    }
  }
</style>

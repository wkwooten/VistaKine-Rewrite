<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  // Remove the now non-existent exports
  // import { authState, login as authLogin, type User } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  // Import the Supabase client
  import { supabase } from "$lib/supabaseClient";
  import SocialSignInButtons from "$lib/components/auth/SocialSignInButtons.svelte"; // Import new component
  import FormField from "$lib/components/auth/FormField.svelte";
  import AuthPageLayout from "$lib/components/auth/AuthPageLayout.svelte"; // Import the layout component
  import Button from "$lib/components/auth/Button.svelte"; // Import the new Button component

  let email = $state("");
  let password = $state("");

  let showPassword = $state(false);
  let capsLockOn = $state(false);

  // Validation states
  let emailError = $state("");
  let passwordError = $state("");

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

  function validatePassword() {
    if (!password) {
      passwordError = "Password is required.";
    } else {
      passwordError = "";
    }
  }

  function checkCapsLock(event: KeyboardEvent | FocusEvent) {
    if (typeof (event as KeyboardEvent).getModifierState === "function") {
      capsLockOn = (event as KeyboardEvent).getModifierState("CapsLock");
    } else if (event.type === "focus") {
      // Potentially clear or re-evaluate, for now, rely on keyup for active indication
      // capsLockOn = false; // Example: clear on focus if not a key event, or fetch global state
    }
  }

  async function handleLogin(event: SubmitEvent) {
    event.preventDefault();
    validateEmail();
    validatePassword();

    if (emailError || passwordError) {
      // alert("Please correct the errors in the form."); // Optional general alert
      return;
    }

    loading = true; // Set loading to true
    // Call Supabase signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    loading = false; // Reset loading to false

    if (error) {
      console.error("Login error:", error.message);
      alert(error.message); // Display error to the user
    } else if (data.user) {
      console.log("User signed in:", data.user);
      // Supabase automatically updates the authState store via the listener
      goto("/"); // Redirect to home page on successful login
    } else {
      // This case might occur if email confirmation is required but not implemented
      console.log(
        "Sign-in initiated, but no user data received. Check email for confirmation if required."
      );
      alert("Please check your email to confirm your account."); // Example for email confirmation flow
    }
  }
</script>

<AuthPageLayout title="Sign In">
  {#snippet children()}
    <form onsubmit={handleLogin} class="auth-form">
      <SocialSignInButtons mode="login" />
      <div class="divider">
        <span>OR</span>
      </div>
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
      <FormField
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        bind:value={password}
        oninput={validatePassword}
        onblur={(e: FocusEvent) => {
          validatePassword();
          capsLockOn = false;
        }}
        onkeyup={checkCapsLock}
        onfocus={checkCapsLock}
        errorMessage={passwordError}
        required
        showPasswordToggle={true}
        bind:isPasswordVisible={showPassword}
      >
        {#snippet children()}
          {#if capsLockOn}
            <small class="caps-lock-warning">Caps Lock is ON</small>
          {/if}
        {/snippet}
      </FormField>
      <div class="form-field remember-me-field">
        <input type="checkbox" id="remember-me" />
        <label for="remember-me" class="remember-me-label">Remember Me</label>
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={!!(emailError || passwordError) || loading}
      >
        {#if loading}Loading...{:else}Sign In{/if}
      </Button>
    </form>
    <p>Don't have an account? <a href="/signup">Sign Up</a></p>
    <p class="forgot-password-link">
      <a href="/forgot-password">Forgot Password?</a>
    </p>
  {/snippet}
</AuthPageLayout>

<style lang="scss">
  // .auth-page-container styles are now in AuthPageLayout.svelte

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
  }

  .remember-me-field {
    flex-direction: row;
    align-items: center;
    gap: var(--space-2xs);
  }

  .remember-me-label {
    font-size: var(--step--1);
    color: var(--color-text-primary);
  }

  .toggle-password {
    background: none;
    border: none;
    color: var(--color-accent);
    cursor: pointer;
    font-size: var(--step--1);
    padding: var(--space-2xs) 0;
    margin-top: var(--space-3xs);
    align-self: flex-end;
  }

  .caps-lock-warning {
    color: var(--color-warning);
    font-size: var(--step--2);
    margin-top: var(--space-3xs);
  }

  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: var(--space-m) 0;
    color: var(--color-text-secondary);
    font-size: var(--step--1);

    &::before,
    &::after {
      content: "";
      flex: 1;
      border-bottom: 1px solid var(--color-border);
    }

    span {
      padding: 0 var(--space-s);
    }
  }

  .auth-form + p {
    text-align: center;
    margin-top: var(--space-l);
    font-size: var(--step--1);
    a {
      color: var(--color-accent);
      text-decoration: underline;
      &:hover {
        text-decoration: none;
      }
    }
  }

  .forgot-password-link {
    text-align: center;
    margin-top: var(--space-s);
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

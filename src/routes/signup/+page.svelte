<!-- src/routes/signup/+page.svelte -->
<script lang="ts">
  // Remove the now non-existent exports
  // import { authState, login as authLogin, type User } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  // Import the Supabase client
  import { supabase } from "$lib/supabaseClient";
  import SocialSignInButtons from "$lib/components/auth/SocialSignInButtons.svelte"; // Import new component
  import FormField from "$lib/components/auth/FormField.svelte"; // Import the new component
  import AuthPageLayout from "$lib/components/auth/AuthPageLayout.svelte"; // Import the layout component
  import Button from "$lib/components/auth/Button.svelte"; // Import the Button component

  let email = $state("");
  let password = $state("");

  let showPassword = $state(false);
  let capsLockOnPassword = $state(false);

  // Validation states
  let emailError = $state("");
  let passwordError = $state("");

  const passwordRequirements = $state([
    { regex: /.{8,}/, text: "At least 8 characters", valid: false },
    { regex: /[A-Z]/, text: "At least one uppercase letter", valid: false },
    { regex: /[a-z]/, text: "At least one lowercase letter", valid: false },
    { regex: /[0-9]/, text: "At least one number", valid: false },
    {
      regex: /[^A-Za-z0-9]/,
      text: "At least one special character",
      valid: false,
    },
  ]);

  let loading = $state(false); // Ensure loading state is present for signup button

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
    passwordError = "";
    let allValid = true;
    passwordRequirements.forEach((req) => {
      req.valid = req.regex.test(password);
      if (!req.valid) allValid = false;
    });
    if (!allValid && password) {
      // Show general error if any requirement fails and password is not empty
      passwordError = "Password does not meet all requirements.";
    }
  }

  function checkCapsLock(event: KeyboardEvent | FocusEvent, field: "password") {
    // Check if getModifierState exists and is a function, as it's specific to KeyboardEvent
    if (typeof (event as KeyboardEvent).getModifierState === "function") {
      const capsLockActive = (event as KeyboardEvent).getModifierState(
        "CapsLock"
      );
      if (field === "password") {
        capsLockOnPassword = capsLockActive;
      }
    } else if (event.type === "focus") {
      // For focus events, we might want to re-check or ensure it doesn't clear a valid caps lock state
      // For now, let's ensure we don't error and only truly act on keyup for caps lock state.
      // Alternatively, we could try to get the keyboard state globally on focus, but that's more complex.
      // We could also remove onfocus for caps lock detection if it's problematic and rely on keyup.
      // For this iteration, if it's a focus event and not a keyboard event, we can choose to do nothing
      // or try a different way to assess CapsLock. For simplicity, we'll make sure Password field clears its own caps lock warning if it's just a focus event without key state
      if (field === "password") {
        // capsLockOnPassword = false; // Or fetch current global state if possible, for now, let keyup handle it.
      }
    }
  }

  async function handleSignUp(event: SubmitEvent) {
    event.preventDefault();
    validateEmail();
    validatePassword();

    // Clear previous email error related to "already registered"
    if (emailError === "This email is already registered. Please sign in.") {
      emailError = "";
    }

    if (emailError || passwordError) {
      return;
    }
    loading = true; // Set loading true before async operation
    // Call Supabase signUp
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    loading = false; // Reset loading after operation

    if (error) {
      // Check for specific error indicating user already exists
      if (error.message.includes("User already registered")) {
        emailError = "This email is already registered. Please sign in.";
      } else {
        console.error("Sign up error:", error.message);
        // Fallback to a generic error or display the specific one if it's not the "already registered" case
        alert(error.message);
      }
    } else if (data.user) {
      console.log("User signed up:", data.user);
      // Supabase automatically updates the authState store via the listener
      // Redirect to home or a confirmation page
      alert(
        "Sign up successful! Please check your email to confirm your account."
      ); // Assuming email confirmation is enabled
      goto("/"); // Redirect after informing the user to check email
    } else if (data.session) {
      // This case might occur if auto-confirm is off but no error occurred
      console.log("Sign-up successful, but email confirmation is required.");
      alert(
        "Sign up successful! Please check your email to confirm your account."
      );
      goto("/");
    } else {
      // Generic success message if data.user and data.session are null (e.g., for email confirmation flows)
      console.log("Sign-up successful. Check email for confirmation.");
      alert(
        "Sign up successful! Please check your email to confirm your account."
      );
      goto("/");
    }
  }
</script>

<AuthPageLayout title="Sign Up">
  {#snippet children()}
    <form onsubmit={handleSignUp} class="auth-form">
      <SocialSignInButtons mode="signup" />
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
          capsLockOnPassword = false;
        }}
        onkeyup={(e: KeyboardEvent) => checkCapsLock(e, "password")}
        onfocus={(e: KeyboardEvent | FocusEvent) =>
          checkCapsLock(e, "password")}
        errorMessage={passwordError}
        required
        showPasswordToggle={true}
        bind:isPasswordVisible={showPassword}
      />
      <!-- Password requirements and caps lock warning moved here -->
      <div class="password-extras-container">
        <div class="password-requirements">
          <small>Password must contain:</small>
          <ul>
            {#each passwordRequirements as req}
              <li class:valid={req.valid} class:invalid={!req.valid}>
                <small>{req.text}</small>
              </li>
            {/each}
          </ul>
        </div>
        {#if capsLockOnPassword}
          <small class="caps-lock-warning">Caps Lock is ON</small>
        {/if}
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={!!(emailError || passwordError) || loading}
      >
        {#if loading}Loading...{:else}Sign Up{/if}
      </Button>
    </form>
    <p>Already have an account? <a href="/login">Sign In</a></p>
  {/snippet}
</AuthPageLayout>

<style lang="scss">
  // .auth-page-container styles are now in AuthPageLayout.svelte

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
  }

  // Styles for the moved password requirements and caps lock warning
  .password-extras-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    // margin-top: var(--space-xs); // Or adjust as needed if FormField doesn't have enough bottom margin
  }

  .password-requirements {
    font-size: var(--step--1);
    color: var(--color-text-secondary);
    margin-top: var(--space-xs); // Adjusted margin
    ul {
      list-style-type: none;
      padding-left: 0;
      margin-top: var(--space-3xs);
      li {
        margin-bottom: var(--space-4xs);
        &.valid::before {
          content: "✓ ";
          color: var(--color-success, var(--color-success));
        }
        &.invalid::before {
          content: "✗ ";
          color: var(--color-error, var(--color-error));
        }
      }
    }
  }

  .toggle-password {
    background: none;
    border: none;
    color: var(--color-accent);
    cursor: pointer;
    font-size: var(--step--1);
    padding: var(--space-2xs) 0;
    align-self: flex-end;
  }

  .caps-lock-warning {
    color: var(--color-warning);
    font-size: var(--step--2);
    // margin for caps-lock warning is handled by .password-extras gap
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

  // Styling for the "Already have an account?" link
  .auth-form + p {
    // Targets the paragraph immediately after the form
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
</style>

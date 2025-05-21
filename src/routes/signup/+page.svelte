<!-- src/routes/signup/+page.svelte -->
<script lang="ts">
  // Remove the now non-existent exports
  // import { authState, login as authLogin, type User } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  // Import the Supabase client
  import { supabase } from "$lib/supabaseClient";
  import GoogleIcon from "$lib/components/icons/GoogleIcon.svelte"; // Import the icon

  let email = "";
  let password = "";
  let confirmPassword = "";

  async function handleSignUp(event: SubmitEvent) {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Call Supabase signUp
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Sign up error:", error.message);
      alert(error.message); // Display error to the user
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

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Error signing in with Google:", error.message);
      alert(`Error signing in with Google: ${error.message}`);
    }
    // No need to handle success here, onAuthStateChange in auth.ts will take care of it
  }
</script>

<div class="auth-page-container">
  <h1>Sign Up</h1>
  <form onsubmit={handleSignUp} class="auth-form">
    <button class="google-signin-button" onclick={signInWithGoogle}>
      <GoogleIcon /> Sign Up with Google
    </button>
    <div class="divider">
      <span>OR</span>
    </div>
    <div class="form-field">
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} required />
    </div>
    <div class="form-field">
      <label for="password">Password</label>
      <input type="password" id="password" bind:value={password} required />
    </div>
    <div class="form-field">
      <label for="confirmPassword">Confirm Password</label>
      <input
        type="password"
        id="confirmPassword"
        bind:value={confirmPassword}
        required
      />
    </div>
    <button type="submit" class="submit-button">Sign Up</button>
  </form>
  <p>Already have an account? <a href="/login">Sign In</a></p>
</div>

<!-- Using existing styles from login page, so no <style> block needed if they are global or if we extract to a shared component/style -->
<!-- For simplicity, we'll assume the styles from login will apply or you'll manage shared auth form styles -->
<style lang="scss">
  // Styles are identical to login page for consistency
  // In a real app, you might extract these to a shared CSS module or component
  .auth-page-container {
    max-width: 400px;
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
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
  }

  .form-field {
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

  .submit-button,
  .google-signin-button {
    // Added .google-signin-button here
    padding: var(--space-s) var(--space-m);
    border: none;
    border-radius: var(--radius-sm);
    font-size: var(--step-0);
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%; // Make buttons full width
  }

  .submit-button {
    background-color: var(--color-accent);
    color: var(--color-background);
    &:hover {
      background-color: var(--color-accent-dark);
    }
  }

  .google-signin-button {
    background-color: var(--color-surface-raised); // Or Google's blue: #4285F4;
    color: var(--color-text-primary); // Or white if using Google's blue
    border: 1px solid var(--color-border);
    margin-top: var(--space-s); // Add some space above if it's after the form
    display: flex; // To align icon and text
    align-items: center;
    justify-content: center;
    gap: var(--space-xs); // Space between icon and text

    &:hover {
      background-color: var(
        --color-surface-hover
      ); // Or darken Google blue: #357ae8;
    }
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

  p {
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

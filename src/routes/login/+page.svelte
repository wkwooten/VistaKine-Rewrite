<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  // Remove the now non-existent exports
  // import { authState, login as authLogin, type User } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  // Import the Supabase client
  import { supabase } from "$lib/supabaseClient";

  let email = "";
  let password = "";

  async function handleLogin(event: SubmitEvent) {
    event.preventDefault();

    // Call Supabase signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

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

<div class="auth-page-container">
  <h1>Sign In</h1>
  <form onsubmit={handleLogin} class="auth-form">
    <div class="form-field">
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} required />
    </div>
    <div class="form-field">
      <label for="password">Password</label>
      <input type="password" id="password" bind:value={password} required />
    </div>
    <button type="submit" class="submit-button">Sign In</button>
  </form>
  <p>Don't have an account? <a href="/signup">Sign Up</a></p>
</div>

<style lang="scss">
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

  .submit-button {
    padding: var(--space-s) var(--space-m);
    background-color: var(--color-accent);
    color: var(--color-background);
    border: none;
    border-radius: var(--radius-sm);
    font-size: var(--step-0);
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-accent-dark);
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

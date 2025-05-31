<script lang="ts">
  import { authState } from "$lib/stores/auth";
  import { supabase } from "$lib/supabaseClient";
  import { User as UserIcon } from "lucide-svelte";
  import { openModal } from "$lib/stores/authModalStore.svelte.ts";
  // import { goto } from '$app/navigation'; // Uncomment if you want to redirect after logout

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      // Consider a more user-friendly error display than alert
      alert(error.message);
    } else {
      console.log("User signed out");
      // authState store updates automatically via onAuthStateChange listener in auth.ts
      // goto('/'); // Optional: redirect to home or login page
    }
  }

  function showLoginModal() {
    openModal({
      defaultView: "login",
      reasonMessage: "Sign in to access your account.",
    });
  }

  function showSignupModal() {
    openModal({
      defaultView: "signup",
      reasonMessage: "Create an account to continue.",
    });
  }
</script>

<div class="auth-widget-component">
  {#if $authState.isAuthenticated && $authState.user}
    {@const user = $authState.user}
    <div class="user-profile">
      <div class="avatar-container">
        {#if user.avatar_url}
          <img src={user.avatar_url} alt="User avatar" class="avatar-image" />
        {:else}
          <UserIcon size={24} class="avatar-placeholder" />
        {/if}
      </div>
      <div class="user-details">
        <span class="username">{user.username}</span>
        <button class="sign-out-button" onclick={handleLogout}>Sign out</button>
      </div>
    </div>
  {:else if $authState.isAuthenticated && !$authState.user && !$authState.loading}
    <!-- User is authenticated, but no profile data (and not loading) -->
    <div class="user-profile minimal-profile">
      <div class="avatar-container">
        <UserIcon size={24} class="avatar-placeholder" />
      </div>
      <div class="user-details">
        {#if $authState.session?.user?.email}
          <span class="username">{$authState.session.user.email}</span>
        {:else}
          <span class="username">Logged In</span>
        {/if}
        <button class="sign-out-button" onclick={handleLogout}>Sign out</button>
        <!-- Optional: Add a message or button to prompt profile completion -->
        <!-- <p class="complete-profile-prompt">Please complete your profile.</p> -->
      </div>
    </div>
  {:else if !$authState.loading}
    <!-- Not authenticated and not loading -->
    <div class="auth-buttons">
      <button
        type="button"
        onclick={showSignupModal}
        class="auth-button sign-up-button">Sign Up</button
      >
      <button
        type="button"
        onclick={showLoginModal}
        class="auth-button sign-in-button">Sign In</button
      >
    </div>
  {:else}
    <!-- Still loading initial auth state -->
    <div class="auth-fallback-loading">
      <div class="spinner"></div>
      <span>Authenticating...</span>
    </div>
  {/if}
</div>

<style lang="scss">
  /* Styles for this component - can be copied/adapted from +layout.svelte's .auth-widget and related classes */
  /* Ensure these styles match the visual requirements of your Figma mockup */

  .auth-widget-component {
    display: flex;
    align-items: center;
  }

  .auth-buttons {
    display: flex;
    padding: var(--space-2xs) var(--space-xs);
    gap: var(--space-xs, 8px);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);
  }

  .auth-button {
    padding: var(--space-xs) var(--space-s);
    border: 1px solid var(--color-border);
    color: var(--color-text-primary);
    text-decoration: none;
    background-color: var(--color-surface);
    border-radius: var(--radius-sm);
    font-size: var(--step--1);
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      background-color: var(--color-surface-hover);
      border-color: var(--color-border-hover);
    }
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    padding: var(--space-xs) var(--space-s);
    /* border-radius: var(--radius-md); */
    border-left: 1px solid var(--color-border);
  }

  .avatar-container {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--color-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    color: var(--color-text-secondary);
  }

  .user-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: var(--step--1);
  }

  .username {
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .sign-out-button {
    background: none;
    border: none;
    padding: 0;
    color: var(--color-text-secondary);
    text-decoration: underline;
    cursor: pointer;
    font-size: var(--step--2);

    &:hover {
      color: var(--color-accent);
    }
  }

  /* Styles for auth-loading if you uncomment it in the markup */
  /* .auth-loading {
    padding: var(--space-xs) var(--space-s);
    font-size: var(--step--1);
    color: var(--color-text-secondary);
  } */

  /* Added style for minimal profile display */
  .minimal-profile .username {
    font-style: italic;
    color: var(--color-text-secondary); /* Make it look a bit different */
  }
  .minimal-profile .avatar-container {
    /* Optional: slightly different style for placeholder when profile is minimal */
    background-color: var(--color-surface);
  }

  .auth-fallback-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-xs) var(--space-s);
    font-size: var(--step--1);
    color: var(--color-text-secondary);
    gap: var(--space-xs);
  }

  .spinner {
    width: 1.2em; /* Adjust size as needed */
    height: 1.2em;
    border: 2px solid currentColor; /* Use text color for border */
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>

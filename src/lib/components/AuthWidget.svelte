<script lang="ts">
  import { authState } from "$lib/stores/auth";
  import { supabase } from "$lib/supabaseClient";
  import { User as UserIcon } from "lucide-svelte";
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
</script>

<div class="auth-widget-component">
  {#if $authState.isAuthenticated && $authState.user}
    {@const user = $authState.user}
    <div
      class="user-profile"
      style="border: 1px solid blue; background-color: rgba(0,0,255,0.1); min-width: 50px; min-height:20px;"
    >
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
  {:else if !$authState.loading}
    <div
      class="auth-buttons"
      style="border: 1px solid green; background-color: rgba(0,255,0,0.1); min-width: 50px; min-height:20px;"
    >
      <a href="/signup" class="auth-button sign-up-button">Sign Up</a>
      <a href="/login" class="auth-button sign-in-button">Sign In</a>
    </div>
  {:else}
    <!-- This block will render if isAuthenticated is false AND loading is true -->
    <div
      class="auth-fallback-loading"
      style="border: 1px solid purple; padding: 5px; color: purple;"
    >
      Auth Loading...
    </div>
  {/if}
</div>

<style lang="scss">
  /* Styles for this component - can be copied/adapted from +layout.svelte's .auth-widget and related classes */
  /* Ensure these styles match the visual requirements of your Figma mockup */

  .auth-widget-component {
    border: 1px solid orange;
    background-color: rgba(255, 165, 0, 0.1);
    min-width: 5px;
    min-height: 5px;
    display: flex;
    align-items: center;
  }

  .auth-buttons {
    display: flex;
    padding: var(--space-2xs) var(--space-xs);
    background-color: var(--color-background);
    gap: var(--space-xs, 8px);
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
  }

  .auth-button {
    padding: var(--space-xs) var(--space-s);
    border: 1px solid var(--color-border);
    color: var(--color-text-primary);
    text-decoration: none;
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
    background-color: var(--color-surface-raised);
    padding: var(--space-xs) var(--space-s);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .avatar-container {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--color-surface-strong);
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
</style>

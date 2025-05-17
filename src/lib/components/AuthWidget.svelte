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
  {:else if !$authState.loading}
    <!-- Only show login/signup if not loading initial state -->
    <div class="auth-buttons">
      <a href="/signup" class="auth-button sign-up-button">Sign Up</a>
      <a href="/login" class="auth-button sign-in-button">Sign In</a>
    </div>
  {:else}
    <!-- Optional: You can add a subtle loading indicator here if desired -->
    <!-- <div class="auth-loading">Loading...</div> -->
  {/if}
</div>

<style lang="scss">
  /* Styles for this component - can be copied/adapted from +layout.svelte's .auth-widget and related classes */
  /* Ensure these styles match the visual requirements of your Figma mockup */

  .auth-widget-component {
    /* This class is the root of your component.
       Its styles should ensure it behaves like the original .auth-widget div in the layout
       (e.g., for positioning if it was fixed/absolute in the layout)
       For now, keeping it simple as a flex container.
       The parent in +layout.svelte (.auth-widget) will handle positioning.
    */
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

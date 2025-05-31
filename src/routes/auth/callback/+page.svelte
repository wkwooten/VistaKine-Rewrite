<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  onMount(() => {
    const queryParams = $page.url.searchParams;
    const redirectTo = queryParams.get("redirectTo");

    if (redirectTo) {
      goto(redirectTo, { replaceState: true });
    } else {
      goto("/", { replaceState: true }); // Fallback to homepage
    }
  });
</script>

<div class="callback-container">
  <p>Please wait, you are being redirected...</p>
  <div class="spinner"></div>
</div>

<style lang="scss">
  .callback-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    text-align: center;
    gap: var(--space-m);

    p {
      font-size: var(--step-1);
      color: var(--color-text-secondary);
    }
  }

  .spinner {
    width: 3em;
    height: 3em;
    border: 4px solid var(--color-surface-strong);
    border-left-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>

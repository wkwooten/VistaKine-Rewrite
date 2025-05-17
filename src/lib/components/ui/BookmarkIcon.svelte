<script lang="ts">
  import { authState } from "$lib/stores/auth";
  import { supabase } from "$lib/supabaseClient";

  let {
    contentId,
    contentType, // e.g., "card", "keyword"
    class: klass = "", // Allow passing additional classes
  } = $props<{
    contentId: string;
    contentType: string;
    class?: string;
  }>();

  // Correctly derive properties from the authState store
  const authStoreValue = $derived(authState); // This gets the AuthState object reactively
  let isAuthenticated = $derived(authStoreValue.isAuthenticated); // This derives isAuthenticated from the reactive AuthState object
  let currentUser = $derived(authStoreValue.user); // This derives user from the reactive AuthState object

  let isBookmarked = $state(false);
  let bookmarkLoading = $state(true); // Start as true to fetch initial status

  async function fetchBookmarkStatus() {
    if (!isAuthenticated || !currentUser?.id || !contentId || !contentType) {
      isBookmarked = false;
      bookmarkLoading = false;
      return;
    }
    bookmarkLoading = true;
    try {
      const { data, error, count } = await supabase
        .from("user_bookmarks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", currentUser.id)
        .eq("content_id", contentId)
        .eq("content_type", contentType);

      if (error) throw error;
      isBookmarked = (count || 0) > 0;
    } catch (error) {
      console.error(
        `Error fetching bookmark status for ${contentType} (${contentId}):`,
        error
      );
      isBookmarked = false;
    } finally {
      bookmarkLoading = false;
    }
  }

  async function toggleBookmark() {
    if (
      !isAuthenticated ||
      !currentUser?.id ||
      !contentId ||
      !contentType ||
      bookmarkLoading
    )
      return;

    bookmarkLoading = true;
    const currentlyBookmarked = isBookmarked;
    try {
      if (currentlyBookmarked) {
        const { error } = await supabase
          .from("user_bookmarks")
          .delete()
          .eq("user_id", currentUser.id)
          .eq("content_id", contentId)
          .eq("content_type", contentType);
        if (error) throw error;
        isBookmarked = false;
      } else {
        const { error } = await supabase.from("user_bookmarks").insert({
          user_id: currentUser.id,
          content_id: contentId,
          content_type: contentType,
        });
        if (error) throw error;
        isBookmarked = true;
      }
    } catch (error) {
      console.error(
        `Error toggling bookmark for ${contentType} (${contentId}):`,
        error
      );
      // Re-fetch to ensure UI consistency on error
      await fetchBookmarkStatus();
    } finally {
      bookmarkLoading = false;
    }
  }

  // Use $effect to react to changes in authentication status or relevant props
  $effect(() => {
    if (isAuthenticated && currentUser?.id && contentId && contentType) {
      fetchBookmarkStatus();
    } else {
      isBookmarked = false;
      bookmarkLoading = false;
    }
  });
</script>

{#if isAuthenticated}
  <button
    class="bookmark-icon-button {klass}"
    onclick={toggleBookmark}
    disabled={bookmarkLoading}
    aria-label={isBookmarked
      ? `Remove bookmark from ${contentType}`
      : `Add bookmark to ${contentType}`}
    title={isBookmarked
      ? `Remove bookmark from ${contentType}`
      : `Add bookmark to ${contentType}`}
  >
    {#if bookmarkLoading}
      ⏳
    {:else if isBookmarked}
      ★
    {:else}
      ☆
    {/if}
  </button>
{/if}

<style lang="scss">
  .bookmark-icon-button {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: var(--step-1); // Default size, can be overridden by parent
    color: var(--color-accent);
    padding: var(--space-3xs);
    line-height: 1;
    border-radius: var(--radius-sm);
    display: inline-flex; // Helps with alignment
    align-items: center;
    justify-content: center;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      color: var(--color-accent-hover);
      background-color: var(--color-accent-hover-bg);
    }
  }
</style>

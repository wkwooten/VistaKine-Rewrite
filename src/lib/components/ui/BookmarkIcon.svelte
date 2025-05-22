<script lang="ts">
  import { authState } from "$lib/stores/auth";
  import { supabase } from "$lib/supabaseClient";
  import { Bookmark } from "lucide-svelte";
  import { openModal } from "$lib/stores/authModalStore.svelte.ts";

  let {
    contentId,
    contentType,
    class: klass = "",
  } = $props<{
    contentId: string;
    contentType: string;
    class?: string;
  }>();

  let isAuthenticated = $derived($authState.isAuthenticated);
  let currentUser = $derived($authState.user);

  let isBookmarked = $state(false);
  let bookmarkLoading = $state(false);

  const reasonForModalOpening =
    "You need an account to bookmark this content. Please sign up or sign in below.";

  async function fetchBookmarkStatus() {
    if (!isAuthenticated || !currentUser?.id || !contentId || !contentType) {
      isBookmarked = false;
      bookmarkLoading = false;
      return;
    }
    bookmarkLoading = true;
    try {
      const { error, count } = await supabase
        .from("user_bookmarks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", currentUser.id)
        .eq("content_id", contentId)
        .eq("content_type", contentType);

      if (error) throw error;
      isBookmarked = (count || 0) > 0;
    } catch (err) {
      console.error(
        `Error fetching bookmark status for ${contentType} (${contentId}):`,
        err
      );
      isBookmarked = false;
    } finally {
      bookmarkLoading = false;
    }
  }

  async function handleBookmarkClick() {
    if (!isAuthenticated) {
      openModal({
        reasonMessage: reasonForModalOpening,
        defaultView: "signup",
      });
      console.log("[BookmarkIcon] openModal called from store");
      return;
    }

    if (!currentUser?.id || !contentId || !contentType || bookmarkLoading) {
      return;
    }

    bookmarkLoading = true;
    const targetBookmarkState = !isBookmarked;

    try {
      if (targetBookmarkState) {
        const { error } = await supabase.from("user_bookmarks").insert({
          user_id: currentUser.id,
          content_id: contentId,
          content_type: contentType,
        });
        if (error) throw error;
        isBookmarked = true;
      } else {
        const { error } = await supabase
          .from("user_bookmarks")
          .delete()
          .eq("user_id", currentUser.id)
          .eq("content_id", contentId)
          .eq("content_type", contentType);
        if (error) throw error;
        isBookmarked = false;
      }
    } catch (err) {
      console.error(
        `Error toggling bookmark for ${contentType} (${contentId}):`,
        err
      );
    } finally {
      bookmarkLoading = false;
    }
  }

  $effect(() => {
    if (isAuthenticated && currentUser?.id && contentId && contentType) {
      fetchBookmarkStatus();
    } else {
      isBookmarked = false;
      bookmarkLoading = false;
    }
  });
</script>

<button
  class="bookmark-icon-button {klass}"
  class:not-authenticated={!isAuthenticated}
  onclick={handleBookmarkClick}
  disabled={bookmarkLoading && isAuthenticated}
  aria-label={isAuthenticated
    ? isBookmarked
      ? `Remove bookmark from ${contentType}`
      : `Add bookmark to ${contentType}`
    : `Sign in to bookmark ${contentType}`}
  title={isAuthenticated
    ? isBookmarked
      ? `Remove bookmark from ${contentType}`
      : `Add bookmark to ${contentType}`
    : `Sign in to bookmark ${contentType}`}
>
  {#if bookmarkLoading && isAuthenticated}
    ⏳
  {:else if isAuthenticated && isBookmarked}
    <Bookmark fill="currentColor" size={32} />
  {:else}
    <Bookmark size={32} />
  {/if}
</button>

<style lang="scss">
  .bookmark-icon-button {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    cursor: pointer;
    font-size: var(--step-1);
    padding: var(--space-xs) var(--space-3xs);
    color: var(--color-accent);
    box-shadow: var(--shadow-md);
    line-height: 1;
    border-radius: var(--radius-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &:not(.not-authenticated):hover:not(:disabled),
    &:not(.not-authenticated):focus-visible:not(:disabled) {
      color: var(--color-accent-hover);
      background-color: var(--color-accent-hover-bg);
    }

    &.not-authenticated {
    }
  }
</style>

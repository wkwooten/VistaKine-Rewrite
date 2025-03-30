<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import { currentChapter } from '$lib/stores/appState';
  import { browser } from '$app/environment';

  afterNavigate((navigation) => {
    // Log details about the navigation event and page store
    console.log('%cLayout afterNavigate triggered', 'color: orange; font-weight: bold;');
    console.log('Navigation details:', navigation);
    console.log('Current $page store:', $page);

    if (browser) {
      const routeId = $page.route.id;
      const chapterSlug = $page.params.slug; // Get slug from route parameters

      console.log(`%cLayout afterNavigate: Route ID = ${routeId}`, 'color: gray;');
      console.log(`%cLayout afterNavigate: Params Slug = ${chapterSlug}`, 'color: gray;'); // Log the extracted slug

      // Check if we are on a chapter page that should have a slug parameter
      if (routeId?.startsWith('/chapter/') && chapterSlug) {
        console.log(`%cLayout afterNavigate: Setting currentChapter to '${chapterSlug}'`, 'color: purple; font-weight: bold;');
        currentChapter.set(chapterSlug);
      } else {
        // Handle cases like /chapter/toc or other non-chapter-specific routes within /chapter/
        console.log(`%cLayout afterNavigate: No valid slug found for this route (${routeId}), setting currentChapter to ''`, 'color: purple; font-weight: bold;');
        currentChapter.set('');
      }
    } else {
      console.log('%cLayout afterNavigate: Not in browser, skipping store update.', 'color: gray;');
    }
  });

  // You might have other layout logic here (e.g., imports for shared components)
</script>

<!-- The slot renders the actual page component (+page.svelte) -->
<slot />
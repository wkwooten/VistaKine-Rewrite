<script lang="ts">
  import ChapterTemplate from '$lib/components/ChapterTemplate.svelte';
  import { currentSection } from '$lib/stores/appState';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // Import the data from the load function
  export let data;

  // Function to handle using "svelte:component" with TypeScript
  function assertComponent(component: any): any {
    return component;
  }
</script>

<svelte:head>
  <title>{data.title} | VistaKine</title>
</svelte:head>

<ChapterTemplate
  themeClass={data.themeClass}
  chapterTitle={data.title}
  chapterNumber={`Chapter ${data.chapterNumber ?? ''}`}
  chapterIntro={data.intro ?? ''}
  chapterSections={data.sections}
  prevChapter={data.prevChapter}
  nextChapter={data.nextChapter}
  currentChapterSlug={data.slug}
>
  <!-- Dynamically render the chapter content component -->
  <svelte:component
    this={assertComponent(data.ChapterContent)}
    chapterSections={data.sections}
  />
</ChapterTemplate>
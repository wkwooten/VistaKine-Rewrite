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
  <title>{data.chapterTitle} | VistaKine</title>
</svelte:head>

<ChapterTemplate
  themeClass={data.themeClass}
  chapterTitle={data.chapterTitle}
  chapterNumber={data.chapterNumber ? `Chapter ${data.chapterNumber}` : ''}
  chapterIntro={data.chapterIntro}
  chapterSections={data.chapterSections}
  prevChapter={data.prevChapter}
  nextChapter={data.nextChapter}
  currentChapterSlug={data.currentChapterSlug}
>
</ChapterTemplate>
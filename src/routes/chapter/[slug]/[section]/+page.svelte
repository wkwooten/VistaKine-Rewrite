<script lang="ts">
  import SectionTemplate from "$lib/components/SectionTemplate.svelte";
  import { currentSection } from "$lib/stores/appState.ts";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  // Import the data from the load function
  export let data;
</script>

<SectionTemplate
  themeClass={data.themeClass}
  chapterSlug={data.chapterSlug}
  sectionSlug={data.sectionSlug}
  currentChapterSlug={data.currentChapterSlug}
  currentChapterTitle={data.chapterTitle}
  chapterNumber={data.chapterNumber}
>
  <!-- Dynamically render the section content component -->
  <svelte:component this={data.SectionContent} />
</SectionTemplate>

<script lang="ts">
  import { currentSection } from '$lib/stores/appState';
  import PageNav from '$lib/components/PageNav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ChapterHeaderNav from '$lib/components/ChapterHeaderNav.svelte';
  import '$lib/styles/chapter-styles.scss';

  interface Chapter {
    slug: string;
    title: string;
  }

  export let chapterTitle: string;
  export let chapterSections: Array<any>;
  export let prevChapter: string | Chapter | null = null;
  export let nextChapter: string | Chapter | null = null;
  export let currentChapterSlug: string;
  export let themeClass: string = '';
</script>

<svelte:options namespace="html" />

<svelte:head>
  <title>{chapterTitle} | VistaKine</title>
</svelte:head>

<div class="chapter {themeClass}">
  <div class="container">
    <slot></slot>
  </div>
</div>

<style lang="scss">
  .chapter {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: var(--space-xl) 0;
    color: var(--text-color);

    @media (max-width: 768px) {
      padding: var(--space-l) 0;
    }
  }
</style>

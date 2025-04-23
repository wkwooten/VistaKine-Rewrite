import { error } from '@sveltejs/kit';
import { getChapterBySlug } from '$lib/data/chapters';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const chapter = getChapterBySlug(params.slug);

  if (!chapter) {
    throw error(404, `Chapter not found: ${params.slug}`);
  }

  // Remove the dynamic import for chapterContent
  // let chapterContent = null;
  // try {
  //   const module = await import(/* @vite-ignore */ `../../../lib/content/chapters/${params.slug}.svelte`);
  //   chapterContent = module.default;
  // } catch (e) {
  //   console.error(`Failed to load chapter content for ${params.slug}:`, e);
  //   // Keep chapterContent as null, the ChapterTemplate will handle the intro display
  // }

  return {
    chapter,
    // chapterContent, // Remove chapterContent from the return value
    chapterNumber: chapter.chapterNumber, // Use chapterNumber instead of number
    chapterTitle: chapter.title,
    chapterIntro: chapter.intro, // Pass the intro text
    chapterSections: chapter.sections,
    currentChapterSlug: params.slug,
    // Explicitly pass prev/next chapter data if it exists on the chapter object
    prevChapter: chapter.prevChapter || null,
    nextChapter: chapter.nextChapter || null,
    // Calculate and add themeClass based on chapter number
    themeClass: `chapter-${chapter.chapterNumber}-theme`
  };
};
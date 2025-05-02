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

  // --- FIX PROPERTY ACCESS ---
  const chapterNumber = chapter.number; // Use .number
  if (typeof chapterNumber !== 'number') {
     console.error(`Invalid chapter number found for slug ${params.slug}: ${chapterNumber}`);
     // Handle error or default?
  }

  return {
    chapter,
    // chapterContent, // Remove chapterContent from the return value
    chapterNumber: chapterNumber, // Pass the correct number
    chapterTitle: chapter.title,
    chapterIntro: (chapter as any).intro ?? '', // Access safely or remove if not used
    chapterSections: chapter.sections,
    currentChapterSlug: params.slug,
    prevChapter: (chapter as any).prevChapter || null, // Access safely or remove
    nextChapter: (chapter as any).nextChapter || null, // Access safely or remove
    themeClass: `chapter-${chapterNumber ?? 'default'}-theme` // Use .number (with fallback)
  };
};
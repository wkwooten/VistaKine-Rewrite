import { error } from '@sveltejs/kit';
import { chapters, getChapterBySlug } from '$lib/data/chapters';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const { slug } = params;
  const chapterData = getChapterBySlug(slug);

  // If chapter not found, throw 404 error
  if (!chapterData) {
    throw error(404, 'Chapter not found');
  }

  // Find the index of the current chapter in the main array
  const chapterIndex = chapters.findIndex(ch => ch.slug === slug);
  // Generate theme class based on index (add 1 because arrays are 0-indexed)
  // Add a fallback class just in case, though the 404 should prevent index -1
  const themeClass = chapterIndex !== -1
    ? `chapter-${chapterIndex + 1}-theme`
    : 'chapter-default-theme';

  try {
    // Dynamically import the chapter content component
    // Alternatively, this could be a Markdown file if that approach is preferred
    const chapterContentModule = await import(`../../../lib/content/chapters/${slug}.svelte`);
    const ChapterContent = chapterContentModule.default;

    return {
      slug,
      title: chapterData.title,
      sections: chapterData.sections,
      prevChapter: chapterData.prevChapter,
      nextChapter: chapterData.nextChapter,
      themeClass: themeClass,
      ChapterContent
    };
  } catch (e) {
    console.error(`Failed to load chapter content for ${slug}:`, e);
    throw error(500, 'Failed to load chapter content');
  }
};
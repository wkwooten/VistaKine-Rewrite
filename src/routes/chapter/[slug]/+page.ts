import { error } from '@sveltejs/kit';
import { getChapterBySlug } from '$lib/data/chapters';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const { slug } = params;
  const chapterData = getChapterBySlug(slug);

  // If chapter not found, throw 404 error
  if (!chapterData) {
    throw error(404, 'Chapter not found');
  }

  // Add a check for the new property for safety
  if (typeof chapterData.chapterNumber !== 'number') {
    console.error(`Chapter data for slug "${slug}" is missing 'chapterNumber'.`);
    // You could throw an error here or assign a default theme
    throw error(500, `Chapter data for slug "${slug}" is misconfigured.`);
  }

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
      // Use the reliable chapterNumber property
      themeClass: `chapter-${chapterData.chapterNumber}-theme`,
      ChapterContent,
      chapterNumber: chapterData.chapterNumber,
      intro: chapterData.intro || '' // Add intro data
    };
  } catch (e) {
    console.error(`Failed to load chapter content for ${slug}:`, e);
    throw error(500, 'Failed to load chapter content');
  }
};
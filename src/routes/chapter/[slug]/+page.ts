import { error } from '@sveltejs/kit';
import { getChapterBySlug, chapters, type Section } from '$lib/data/chapters';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const chapterIndex = chapters.findIndex(ch => ch.slug === params.slug);

  if (chapterIndex === -1) {
    throw error(404, `Chapter not found: ${params.slug}`);
  }

  const chapter = chapters[chapterIndex];

  // Determine previous chapter and its last section
  let prevSectionLinkData: (Section & { chapterSlug: string }) | null = null;
  const prevChapterData = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  if (prevChapterData && prevChapterData.sections.length > 0) {
    const lastSection = prevChapterData.sections[prevChapterData.sections.length - 1];
    prevSectionLinkData = {
      ...lastSection,
      chapterSlug: prevChapterData.slug // Add chapterSlug for URL construction
    };
  }

  // Determine next chapter
  const nextChapterData = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  // Determine first section of the current chapter for 'Next' link
  const firstSection = chapter.sections.length > 0 ? chapter.sections[0] : null;

  const chapterNumber = chapter.number;
  if (typeof chapterNumber !== 'number') {
     console.error(`Invalid chapter number found for slug ${params.slug}: ${chapterNumber}`);
  }

  return {
    chapterNumber: chapterNumber,
    chapterTitle: chapter.title,
    chapterIntro: (chapter as any).intro ?? '',
    chapterSections: chapter.sections,
    currentChapterSlug: params.slug,
    prevSection: prevSectionLinkData,
    nextSection: firstSection,
    prevChapter: prevChapterData ? { slug: prevChapterData.slug, title: prevChapterData.title } : null,
    nextChapter: nextChapterData ? { slug: nextChapterData.slug, title: nextChapterData.title } : null,
    themeClass: `chapter-${chapterNumber ?? 'default'}-theme`
  };
};
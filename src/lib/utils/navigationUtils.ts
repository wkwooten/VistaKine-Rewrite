// src/lib/utils/navigationUtils.ts

import { chapters, getChapterBySlug, getSectionBySlugs } from '$lib/data/chapters';
import type { Chapter, Section } from '$lib/data/chapters';

// Define the link types expected by PageNav
type ChapterLink = { slug: string; title: string } | null;
type SectionLink = { slug: string; title: string, number?: string, id?: string } | null;

/**
 * Finds the previous and next chapters relative to the current chapter slug.
 * @param currentChapterSlug The slug of the currently viewed chapter.
 * @returns An object containing the previous and next chapter links (slug and title), or null if they don't exist.
 */
export function getAdjacentChapters(currentChapterSlug: string): {
  prevChapter: ChapterLink;
  nextChapter: ChapterLink;
} {
  const currentIndex = chapters.findIndex(chapter => chapter.slug === currentChapterSlug);

  if (currentIndex === -1) {
    // Chapter not found, should ideally not happen if slugs are correct
    console.error(`[navigationUtils] Chapter slug not found: ${currentChapterSlug}`);
    return { prevChapter: null, nextChapter: null };
  }

  const prevChapterData = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapterData = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return {
    prevChapter: prevChapterData ? { slug: prevChapterData.slug, title: prevChapterData.title } : null,
    nextChapter: nextChapterData ? { slug: nextChapterData.slug, title: nextChapterData.title } : null,
  };
}

/**
 * Finds the previous and next sections within a chapter relative to the current section slug.
 * @param chapterSlug The slug of the chapter containing the sections.
 * @param currentSectionSlug The slug of the currently viewed section.
 * @returns An object containing the previous and next section links (slug, title, number, id), or null if they don't exist.
 */
export function getAdjacentSections(chapterSlug: string, currentSectionSlug: string): {
  prevSection: SectionLink;
  nextSection: SectionLink;
} {
  const chapter = getChapterBySlug(chapterSlug);

  if (!chapter || !chapter.sections || chapter.sections.length === 0) {
    // Chapter or sections not found
    return { prevSection: null, nextSection: null };
  }

  const currentSectionIndex = chapter.sections.findIndex(section => section.slug === currentSectionSlug);

  if (currentSectionIndex === -1) {
    // Section not found within the chapter
    console.warn(`[navigationUtils] Section slug not found in chapter ${chapterSlug}: ${currentSectionSlug}`);
    return { prevSection: null, nextSection: null };
  }

  const prevSectionData = currentSectionIndex > 0 ? chapter.sections[currentSectionIndex - 1] : null;
  const nextSectionData = currentSectionIndex < chapter.sections.length - 1 ? chapter.sections[currentSectionIndex + 1] : null;

  // Helper to format Section to SectionLink
  const formatSectionLink = (section: Section | null): SectionLink => {
    if (!section) return null;
    return {
      slug: section.slug,
      title: section.title,
      number: section.number,
      id: section.id
    };
  };


  return {
    prevSection: formatSectionLink(prevSectionData),
    nextSection: formatSectionLink(nextSectionData),
  };
}
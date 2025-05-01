// src/lib/utils/navigationUtils.ts

// Placeholder types - replace with actual imports if they exist elsewhere
type SectionLink = { slug: string; title: string; number?: string } | null;
type ChapterLink = { slug: string; title: string } | null;

/**
 * Finds the previous and next sections within the same chapter.
 * Placeholder implementation.
 */
export function getAdjacentSections(
  chapterSlug: string,
  sectionSlug: string
): { prevSection: SectionLink; nextSection: SectionLink } {
  console.warn(
    `Placeholder: getAdjacentSections called for ${chapterSlug}/${sectionSlug}`
  );
  // TODO: Implement actual logic using chapter data
  return { prevSection: null, nextSection: null };
}

/**
 * Finds the previous and next chapters.
 * Placeholder implementation.
 */
export function getAdjacentChapters(chapterSlug: string): {
  prevChapter: ChapterLink;
  nextChapter: ChapterLink;
} {
  console.warn(`Placeholder: getAdjacentChapters called for ${chapterSlug}`);
  // TODO: Implement actual logic using chapter data
  return { prevChapter: null, nextChapter: null };
}
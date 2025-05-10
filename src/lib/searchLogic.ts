import { chapters as allChaptersFromData, getChapterBySlug, type Section } from "./data/chapters";
import globalGlossaryData from "./data/glossary-data";

// Interface for a searchable item (chapter, section, or glossary term)
export interface SearchableItem {
  id: string;
  type: "chapter" | "section" | "glossary";
  title: string;
  href: string;
  context?: string;
  chapterSlug?: string; // Add chapter slug for potential filtering/grouping on results page
}

// Generates the full list of searchable items from all data sources
export function getSearchableData(): SearchableItem[] {
  const items: SearchableItem[] = [];

  // 1. Chapters
  allChaptersFromData.forEach((chapter) => {
    items.push({
      id: `chapter-${chapter.slug}`,
      type: "chapter",
      title: chapter.title,
      href: `/chapter/${chapter.slug}`,
      context: `Chapter ${chapter.number}`,
      chapterSlug: chapter.slug,
    });

    // 2. Sections within this chapter
    chapter.sections.forEach((section) => {
      items.push({
        id: `section-${chapter.slug}-${section.slug}`,
        type: "section",
        title: section.title,
        href: `/chapter/${chapter.slug}/${section.slug}`,
        context: `Section in: ${chapter.title}`,
        chapterSlug: chapter.slug,
      });
    });
  });

  // 3. Glossary Terms
  globalGlossaryData.forEach((glossaryChapter) => {
    const sourceChapterForContext = getChapterBySlug(
      glossaryChapter.chapterSlug
    );
    const chapterContextTitle =
      sourceChapterForContext?.title ?? glossaryChapter.chapterTitle;

    glossaryChapter.glossaryTerms.forEach((term) => {
      let href = `/glossary#${encodeURIComponent(term.term.toLowerCase().replace(/\s+/g, "-"))}`;
      let context = `Glossary Term (in ${chapterContextTitle})`;
      let termChapterSlug = glossaryChapter.chapterSlug;

      if (term.sectionRef && glossaryChapter.chapterSlug) {
        const sourceChapter = getChapterBySlug(glossaryChapter.chapterSlug);
        if (sourceChapter) {
          href = `/chapter/${glossaryChapter.chapterSlug}/${term.sectionRef}`; // Link to section if referenced
          const referencedSection = sourceChapter.sections.find(
            (s: Section) => s.slug === term.sectionRef
          );
          context = `Term related to: ${referencedSection ? referencedSection.title : term.sectionRef} (in ${sourceChapter.title})`;
           termChapterSlug = glossaryChapter.chapterSlug; // Still link back to the chapter slug
        }
      }

      items.push({
        id: `glossary-${glossaryChapter.chapterSlug}-${encodeURIComponent(term.term)}`,
        type: "glossary",
        title: term.term,
        href: href,
        context: context,
        chapterSlug: termChapterSlug,
      });
    });
  });
  return items;
}

// Filters the list of searchable items based on a query
export function filterSearchableData(
  query: string,
  items: SearchableItem[]
): SearchableItem[] {
  if (!query.trim()) {
    return [];
  }
  const lowerQuery = query.toLowerCase().trim();

  // Log the query being processed
  // console.log(`Filtering for query: "${lowerQuery}"`);

  const results = items.filter((item) => {
    const titleMatch = item.title && item.title.toLowerCase().includes(lowerQuery);
    const contextMatch = item.context && item.context.toLowerCase().includes(lowerQuery);

    // If query is "wa" and no results, log item details for inspection
    // if (lowerQuery.startsWith("wa") && !(titleMatch || contextMatch)) {
    //   console.log(`No match for "${lowerQuery}" in item:`, JSON.stringify(item));
    // }

    return titleMatch || contextMatch;
  });

  // If query starts with "wa" and results are empty, log it.
  // This might indicate the point of failure more clearly.
  // if (lowerQuery.startsWith("wa") && results.length === 0 && items.length > 0) {
  //   console.warn(`Query "${lowerQuery}" yielded 0 results from ${items.length} items.`)
  //   // You could also log the first few items to see their structure if needed
  //   // console.log("First few items:", items.slice(0,3).map(i => ({title: i.title, context: i.context})))
  // }

  return results;
}

// You could add more complex filtering/scoring logic here later
import { error } from '@sveltejs/kit';
import { getChapterBySlug } from '$lib/data/chapters';
import type { PageLoad } from './$types';

// Create a type-safe mapping for dynamic imports
type SectionImports = {
  [chapter: string]: {
    [section: string]: () => Promise<any>;
  };
};

// Component imports with type safety
const sectionComponents: SectionImports = {
  'understanding-3d-space': {
    'coordinate-systems': () => import('$lib/content/chapters/understanding-3d-space/sections/coordinate-systems.svelte'),
    'vectors-and-components': () => import('$lib/content/chapters/understanding-3d-space/sections/vectors-and-components.svelte'),
    'vector-operations': () => import('$lib/content/chapters/understanding-3d-space/sections/vector-operations.svelte')
  }
};

export const load: PageLoad = async ({ params }) => {
  const { slug, section } = params;
  console.log(`Loading chapter: ${slug}, section: ${section}`);

  const chapterData = getChapterBySlug(slug);

  // If chapter not found, throw 404 error
  if (!chapterData) {
    console.error(`Chapter not found: ${slug}`);
    throw error(404, 'Chapter not found');
  }

  // Find the section in the chapter
  const sectionData = chapterData.sections.find(s => s.slug === section);

  // If section not found, throw 404 error
  if (!sectionData) {
    console.error(`Section not found: ${section} in chapter ${slug}`);
    throw error(404, 'Section not found');
  }

  console.log(`Found section: ${sectionData.title}`);

  try {
    // Check if we have a component loader for this chapter/section
    if (!sectionComponents[slug] || !sectionComponents[slug][section]) {
      console.error(`No component loader found for ${slug}/${section}`);
      throw new Error(`No component loader found for ${slug}/${section}`);
    }

    // Load the component
    const sectionContentModule = await sectionComponents[slug][section]();
    const SectionContent = sectionContentModule.default;

    if (!SectionContent) {
      console.error(`Module imported but no default export found for section ${section}`);
      throw error(500, 'Failed to load section content - no default export');
    }

    return {
      chapterSlug: slug,
      sectionSlug: section,
      title: sectionData.title,
      themeClass: `chapter-${chapterData.chapterNumber}-theme`,
      SectionContent
    };
  } catch (error: any) {
    // More detailed error logging
    console.error(`Failed to load section content for ${slug}/${section}:`, error);
    console.error(`Error name: ${error.name}, message: ${error.message}`);
    if (error.stack) console.error(`Stack trace: ${error.stack}`);

    throw error(500, `Failed to load section content: ${error.message}`);
  }
};
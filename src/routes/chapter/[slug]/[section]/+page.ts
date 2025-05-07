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
    'basic-vector-operations': () => import('$lib/content/chapters/understanding-3d-space/sections/basic-vector-operations.svelte'),
    'advanced-vector-operations': () => import('$lib/content/chapters/understanding-3d-space/sections/advanced-vector-operations.svelte')
  },
  'kinematics': {
    'displacement-velocity': () => import('$lib/content/chapters/kinematics/sections/displacement-velocity.svelte'),
    'acceleration': () => import('$lib/content/chapters/kinematics/sections/acceleration.svelte'),
    'projectile-motion': () => import('$lib/content/chapters/kinematics/sections/projectile-motion.svelte'),
    'relative-motion': () => import('$lib/content/chapters/kinematics/sections/relative-motion.svelte')
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

  // Find the current section index and data
  const currentSectionIndex = chapterData.sections.findIndex(s => s.slug === section);

  // If section not found in the array, throw 404 error
  if (currentSectionIndex === -1) {
    console.error(`Section slug not found in chapter data: ${section} in chapter ${slug}`);
    throw error(404, 'Section not found');
  }

  const sectionData = chapterData.sections[currentSectionIndex];
  console.log(`Found section: ${sectionData.title} at index ${currentSectionIndex}`);

  // Determine previous and next sections
  const prevSectionData = currentSectionIndex > 0 ? chapterData.sections[currentSectionIndex - 1] : null;
  const nextSectionData = currentSectionIndex < chapterData.sections.length - 1 ? chapterData.sections[currentSectionIndex + 1] : null;

  // Prepare simplified section objects for PageNav (ensure number is included)
  const prevSection = prevSectionData ? {
    slug: prevSectionData.slug,
    title: prevSectionData.title,
    number: (prevSectionData as any).number // Cast to access number
  } : null;

  const nextSection = nextSectionData ? {
    slug: nextSectionData.slug,
    title: nextSectionData.title,
    number: (nextSectionData as any).number // Cast to access number
  } : null;

  console.log('Prev Section:', prevSection);
  console.log('Next Section:', nextSection);

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

    const chapterNumber = chapterData.number;
    if (typeof chapterNumber !== 'number') {
      console.error(`Invalid chapter number found for slug ${slug}: ${chapterNumber}`);
    }

    const returnData = {
      chapterSlug: slug,
      chapterTitle: chapterData.title,
      currentChapterSlug: slug,
      sectionSlug: section,
      title: sectionData.title,
      themeClass: `chapter-${chapterNumber ?? 'default'}-theme`,
      SectionContent,
      prevSection,
      nextSection,
      chapterNumber: chapterNumber
    };
    console.log('[section/+page.ts] Returning data:', returnData);
    return returnData;
  } catch (error: any) {
    // More detailed error logging
    console.error(`Failed to load section content for ${slug}/${section}:`, error);
    console.error(`Error name: ${error.name}, message: ${error.message}`);
    if (error.stack) console.error(`Stack trace: ${error.stack}`);

    throw error(500, `Failed to load section content: ${error.message}`);
  }
};
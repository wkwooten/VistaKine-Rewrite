export interface Section {
  id: string;
  title: string;
}

export interface Chapter {
  title: string;
  slug: string;
  sections: Section[];
  prevChapter: { slug: string; title: string } | null;
  nextChapter: { slug: string; title: string } | null;
  chapterNumber: number;
}

// Define all chapters with their data
export const chapters: Chapter[] = [
  {
    title: 'Introduction',
    slug: 'understanding-3d-space',
    sections: [
      { id: "coordinate-systems", title: "1.1 Coordinate Systems" },
      { id: "vectors-in-space", title: "1.2 Vectors in 3D Space" },
      { id: "reference-frames", title: "1.3 Reference Frames" }
    ],
    prevChapter: null,
    nextChapter: null, // Filled in by initialize function
    chapterNumber: 1
  },
  {
    title: 'Kinematics',
    slug: 'kinematics',
    sections: [
      { id: "displacement-velocity-acceleration", title: "2.1 Displacement, Velocity, and Acceleration" },
      { id: "uniform-motion", title: "2.2 Uniform Motion" },
      { id: "non-uniform-motion", title: "2.3 Non-Uniform Motion" },
      { id: "projectile-motion", title: "2.4 Projectile Motion" }
    ],
    prevChapter: null, // Filled in by initialize function
    nextChapter: null,  // Filled in by initialize function
    chapterNumber: 2
  },
  {
    title: 'Dynamics',
    slug: 'forces-and-motion',
    sections: [
      { id: "newtons-laws", title: "3.1 Newton's Laws" },
      { id: "newtons-laws-of-motion", title: "3.2 Newton's Laws of Motion" }
    ],
    prevChapter: null, // Filled in by initialize function
    nextChapter: null,  // Filled in by initialize function
    chapterNumber: 3
  },
  {
    title: 'Advanced Topics',
    slug: 'advanced-topics',
    sections: [
      { id: "advanced-section1", title: "4.1 Advanced Topic 1 - Placeholder" },
      { id: "advanced-section2", title: "4.2 Advanced Topic 2 - Placeholder" }
    ],
    prevChapter: null, // Filled in by initialize function
    nextChapter: null,  // Filled in by initialize function
    chapterNumber: 4
  },
  {
    title: 'Motion Analysis',
    slug: 'motion-analysis',
    sections: [
      { id: "motion-analysis-section1", title: "5.1 Motion Analysis 1 - Placeholder" },
      { id: "motion-analysis-section2", title: "5.2 Motion Analysis 2 - Placeholder" }
    ],
    prevChapter: null, // Filled in by initialize function
    nextChapter: null,  // Filled in by initialize function
    chapterNumber: 5
  },
  {
    title: 'Biomechanics',
    slug: 'biomechanics',
    sections: [
      { id: "biomechanics-section1", title: "6.1 Biomechanics 1 - Placeholder" },
      { id: "biomechanics-section2", title: "6.2 Biomechanics 2 - Placeholder" }
    ],
    prevChapter: null, // Filled in by initialize function
    nextChapter: null,  // Filled in by initialize function
    chapterNumber: 6
  },
  {
    title: 'Clinical Applications',
    slug: 'clinical-applications',
    sections: [
      { id: "clinical-section1", title: "7.1 Clinical Applications 1 - Placeholder" },
      { id: "clinical-section2", title: "7.2 Clinical Applications 2 - Placeholder" }
    ],
    prevChapter: null, // Filled in by initialize function
    nextChapter: null,  // Filled in by initialize function
    chapterNumber: 7
  },
  {
    title: 'Research Methods',
    slug: 'research-methods',
    sections: [
      { id: "research-section1", title: "8.1 Research Methods 1 - Placeholder" },
      { id: "research-section2", title: "8.2 Research Methods 2 - Placeholder" }
    ],
    prevChapter: null, // Filled in by initialize function
    nextChapter: null,  // Filled in by initialize function
    chapterNumber: 8
  }
];

// Initialize the previous and next chapter references
function initializeChapterNavigation() {
  for (let i = 0; i < chapters.length; i++) {
    // Set previous chapter (null for first chapter)
    chapters[i].prevChapter = i > 0
      ? { slug: chapters[i-1].slug, title: chapters[i-1].title }
      : null;

    // Set next chapter (null for last chapter)
    chapters[i].nextChapter = i < chapters.length - 1
      ? { slug: chapters[i+1].slug, title: chapters[i+1].title }
      : null;
  }
}

// Initialize navigation on module load
initializeChapterNavigation();

// Helper functions to get chapter data
export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find(chapter => chapter.slug === slug);
}

export function getAllChapters() {
  return chapters;
}

// For simplified navigation needs (sidebar, TOC)
export function getChapterList() {
  return chapters.map(({ title, slug, sections }) => ({ title, slug, sections }));
}
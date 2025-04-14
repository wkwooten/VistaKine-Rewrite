// Define the structure for a section within a chapter
export interface Section {
  id: string;
  title: string;
}

// Define the structure for a chapter
export interface Chapter {
  title: string;
  slug: string;
  description: string;
  sections: Section[];
  prevChapter: string | null; // Store slugs for prev/next
  nextChapter: string | null;
  chapterNumber: number;
}

// Define all chapters with their data
export const chapters: Chapter[] = [
  {
    title: 'Understanding 3D Space',
    slug: 'understanding-3d-space',
    description: 'Introduction to coordinate systems and vectors.',
    sections: [
      { id: "introduction", title: "Introduction" },
      { id: "coordinate-systems", title: "1.1 Coordinate Systems" },
      { id: "vectors-and-components", title: "1.2 Vectors and Components" },
      { id: "vector-operations", title: "1.3 Vector Operations" },
      { id: "physical-vectors", title: "1.4 Physical Vector Quantities" }
    ],
    prevChapter: null,
    nextChapter: 'kinematics',
    chapterNumber: 1
  },
  {
    title: 'Kinematics',
    slug: 'kinematics',
    description: 'Describing motion in 1D, 2D, and 3D.',
    sections: [
      // Add section IDs for Kinematics later
      // Example: { id: "displacement-velocity", title: "2.1 Displacement & Velocity" }
    ],
    prevChapter: 'understanding-3d-space',
    nextChapter: 'dynamics',
    chapterNumber: 2
  },
  {
    title: 'Dynamics',
    slug: 'dynamics',
    description: "Newton's Laws, Forces, and Free Body Diagrams.",
    sections: [
      // Add section IDs for Dynamics later
      // Example: { id: "newtons-laws", title: "3.1 Newton's Laws" }
    ],
    prevChapter: 'kinematics',
    nextChapter: 'energy',
    chapterNumber: 3
  },
  {
    title: 'Work, Energy, and Power',
    slug: 'energy',
    description: 'Understanding energy conservation and transfer.',
    sections: [
      // Add section IDs for Energy later
    ],
    prevChapter: 'dynamics',
    nextChapter: 'momentum',
    chapterNumber: 4
  },
  {
    title: 'Momentum and Collisions',
    slug: 'momentum',
    description: 'Exploring momentum conservation and collisions.',
    sections: [
      // Add section IDs for Momentum later
    ],
    prevChapter: 'energy',
    nextChapter: 'circular-motion',
    chapterNumber: 5
  },
  {
    title: 'Circular Motion and Gravitation',
    slug: 'circular-motion',
    description: 'Analyzing circular paths and gravitational forces.',
    sections: [
      // Add section IDs for Circular Motion later
    ],
    prevChapter: 'momentum',
    nextChapter: 'rotational-motion',
    chapterNumber: 6
  },
  {
    title: 'Rotational Motion',
    slug: 'rotational-motion',
    description: 'Introduction to torque and angular momentum.',
    sections: [
      // Add section IDs for Rotational Motion later
    ],
    prevChapter: 'circular-motion',
    nextChapter: null, // This is the last chapter for now
    chapterNumber: 7
  }
  // Add more chapters as needed
];

// Function to initialize next/prev chapter links - uncomment and adapt if needed
// function initializeChapterLinks(): void {
//   for (let i = 0; i < chapters.length; i++) {
//     if (i > 0) {
//       chapters[i].prevChapter = chapters[i - 1].slug;
//     }
//     if (i < chapters.length - 1) {
//       chapters[i].nextChapter = chapters[i + 1].slug;
//     }
//   }
// }

// // Initialize the links when the module loads
// initializeChapterLinks();

// Helper functions to get chapter data
export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find(chapter => chapter.slug === slug);
}

export function getChapterByNumber(chapterNumber: number): Chapter | undefined {
  return chapters.find(chapter => chapter.chapterNumber === chapterNumber);
}

// For simplified navigation needs (sidebar, TOC) - returns a structure Navigation.svelte can use
export function getChapterList() {
  // Note: This returns a slightly different structure than the main Chapter interface
  // It maps sections to {id, title} which Navigation.svelte expects
  return chapters.map(({ title, slug, sections, description }) => ({
    title,
    slug,
    sections: sections.map(sec => ({ id: sec.id, title: sec.title })),
    description // Include description if needed by the component
  }));
}
// Define the structure for a section within a chapter
export interface Section {
  id: string;
  title: string;
  slug: string; // Add a URL-friendly slug for routing
  description?: string; // Optional description of the section
  number?: string; // ADDED: Optional section number
}

// Define the structure for a chapter
export interface Chapter {
  title: string;
  slug: string;
  description: string;
  intro?: string; // HTML intro content for the chapter overview
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
    intro: 'This chapter introduces the fundamental concepts of <span class="keyword">3D Space</span> and <span class="keyword">coordinate systems</span>, essential for understanding <span class="keyword">kinematics</span> and <span class="keyword">dynamics</span>.',
    sections: [
      { id: "coordinate-systems", title: "Coordinate Systems", slug: "coordinate-systems", number: "1.1" },
      { id: "vectors-and-components", title: "Vectors and Components", slug: "vectors-and-components", number: "1.2" },
      { id: "vector-operations", title: "Vector Operations", slug: "vector-operations", number: "1.3" }
    ],
    prevChapter: null,
    nextChapter: 'kinematics',
    chapterNumber: 1
  },
  {
    title: 'Kinematics',
    slug: 'kinematics',
    description: 'Describing motion in 1D, 2D, and 3D.',
    intro: 'This chapter introduces the fundamental concepts of <span class="keyword">kinematics</span>, the study of motion.',
    sections: [
        { id: "displacement-velocity", title: "Displacement & Velocity", slug: "displacement-velocity", description: "Learn about position changes and the rate at which objects move in specific directions.", number: "2.1" },
        { id: "acceleration", title: "Acceleration", slug: "acceleration", description: "Understand how velocity changes over time and the equations that describe uniformly accelerated motion.", number: "2.2" },
        { id: "projectile-motion", title: "Projectile Motion", slug: "projectile-motion", description: "Analyze the parabolic paths of objects moving under the influence of gravity alone.", number: "2.3" },
        { id: "relative-motion", title: "Relative Motion", slug: "relative-motion", description: "Explore how motion appears different from various reference frames and how to convert between them.", number: "2.4" }
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
  // It maps sections to {id, title, slug} which Navigation.svelte expects
  return chapters.map(({ title, slug, sections, description }) => ({
    title,
    slug,
    sections: sections.map(sec => ({ id: sec.id, title: sec.title, slug: sec.slug })),
    description // Include description if needed by the component
  }));
}
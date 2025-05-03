// Define the structure for a section within a chapter
export interface Section {
  id: string;
  title: string;
  slug: string; // Add a URL-friendly slug for routing
  number: string; // Section number as string (e.g., "1.1")
  description?: string; // Optional short description
  component?: ConstructorOfATypedSvelteComponent; // Component to render (Optional)
}

// Define the structure for a chapter
export interface Chapter {
  slug: string;
  title: string;
  number: number; // Changed to required number for theme class
  description: string;
  themeColor?: string; // Optional theme color
  sections: Section[];
  component?: ConstructorOfATypedSvelteComponent; // For chapter intro page
}

// Define all chapters with their data
export const chapters: Chapter[] = [
  {
    title: 'Understanding 3D Space',
    slug: 'understanding-3d-space',
    number: 1,
    description: 'Introduction to coordinate systems and vectors.',
    sections: [
      { id: "coordinate-systems", title: "Coordinate Systems", slug: "coordinate-systems", number: "1.1" },
      { id: "vectors-and-components", title: "Vectors and Components", slug: "vectors-and-components", number: "1.2" },
      { id: "basic-vector-operations", title: "Basic Vector Operations", slug: "basic-vector-operations", number: "1.3" },
      { id: "advanced-vector-products", title: "Advanced Vector Products", slug: "advanced-vector-products", number: "1.4" }
    ],
    component: undefined
  },
  {
    title: 'Kinematics',
    slug: 'kinematics',
    number: 2,
    description: 'Describing motion in 1D, 2D, and 3D.',
    sections: [
        { id: "displacement-velocity", title: "Displacement & Velocity", slug: "displacement-velocity", description: "Learn about position changes and the rate at which objects move in specific directions.", number: "2.1" },
        { id: "acceleration", title: "Acceleration", slug: "acceleration", description: "Understand how velocity changes over time and the equations that describe uniformly accelerated motion.", number: "2.2" },
        { id: "projectile-motion", title: "Projectile Motion", slug: "projectile-motion", description: "Analyze the parabolic paths of objects moving under the influence of gravity alone.", number: "2.3" },
        { id: "relative-motion", title: "Relative Motion", slug: "relative-motion", description: "Explore how motion appears different from various reference frames and how to convert between them.", number: "2.4" }
    ],
    component: undefined
  },
  {
    title: 'Dynamics',
    slug: 'dynamics',
    number: 3,
    description: "Newton's Laws, Forces, and Free Body Diagrams.",
    sections: [
      // Add section IDs for Dynamics later
      // Example: { id: "newtons-laws", title: "3.1 Newton's Laws" }
    ],
    component: undefined
  },
  {
    title: 'Work, Energy, and Power',
    slug: 'energy',
    number: 4,
    description: 'Understanding energy conservation and transfer.',
    sections: [
      // Add section IDs for Energy later
    ],
    component: undefined
  },
  {
    title: 'Momentum and Collisions',
    slug: 'momentum',
    number: 5,
    description: 'Exploring momentum conservation and collisions.',
    sections: [
      // Add section IDs for Momentum later
    ],
    component: undefined
  },
  {
    title: 'Circular Motion and Gravitation',
    slug: 'circular-motion',
    number: 6,
    description: 'Analyzing circular paths and gravitational forces.',
    sections: [
      // Add section IDs for Circular Motion later
    ],
    component: undefined
  },
  {
    title: 'Rotational Motion',
    slug: 'rotational-motion',
    number: 7,
    description: 'Introduction to torque and angular momentum.',
    sections: [
      // Add section IDs for Rotational Motion later
    ],
    component: undefined
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
  return chapters.find(chapter => chapter.number === chapterNumber);
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

// Helper function to get a section by chapter and section slugs
export function getSectionBySlugs(
  chapterSlug: string,
  sectionSlug: string
): Section | undefined {
  const chapter = getChapterBySlug(chapterSlug);
  return chapter?.sections.find((section) => section.slug === sectionSlug);
}
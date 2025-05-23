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
      { id: "coordinate-systems", title: "Coordinate Systems", slug: "coordinate-systems", number: "1.1", description: "Learn about different ways to define and locate points in 2D and 3D space, including Cartesian, cylindrical, and spherical systems." },
      { id: "vector-fundamentals", title: "Vector Fundamentals", slug: "vector-fundamentals", number: "1.2", description: "Understand what vectors are, how they represent physical quantities, and how to break them down into their components and different notations." },
      { id: "vector-direction-angles", title: "Vector Direction and Angles", slug: "vector-direction-angles", number: "1.3", description: "Explore how to define vector direction using angles and trigonometric relationships." },
      { id: "basic-vector-operations", title: "Basic Vector Operations", slug: "basic-vector-operations", number: "1.4", description: "Explore fundamental vector operations such as addition, subtraction, and scalar multiplication." },
      { id: "advanced-vector-operations", title: "Advanced Vector Operations", slug: "advanced-vector-operations", number: "1.5", description: "Delve into more complex vector operations like the dot product and cross product and their applications." }
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
      { id: "section-1", title: "Newton's First Law: Inertia", slug: "section-1", number: "3.1", description: "Explore the concept of inertia and how objects in motion stay in motion unless acted upon by a force." },
      { id: "section-2", title: "Newton's Second Law: Force and Acceleration", slug: "section-2", number: "3.2", description: "Understand the relationship between force, mass, and acceleration (F=ma) and how to apply it." },
      { id: "section-3", title: "Newton's Third Law: Action and Reaction", slug: "section-3", number: "3.3", description: "Learn about equal and opposite forces and how they apply to interactions between objects." },
      { id: "section-4", title: "Free Body Diagrams and Force Analysis", slug: "section-4", number: "3.4", description: "Master the technique of drawing free body diagrams to analyze forces acting on an object." }
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
      { id: "section-1", title: "Work Done by Forces", slug: "section-1", number: "4.1", description: "Define work in physics and calculate work done by constant and variable forces." },
      { id: "section-2", title: "Kinetic Energy and the Work-Energy Theorem", slug: "section-2", number: "4.2", description: "Understand kinetic energy and how work changes an object's kinetic energy." },
      { id: "section-3", title: "Potential Energy and Conservation of Energy", slug: "section-3", number: "4.3", description: "Explore gravitational and elastic potential energy and the principle of energy conservation." },
      { id: "section-4", title: "Power", slug: "section-4", number: "4.4", description: "Define power as the rate of doing work and calculate power in various scenarios." }
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
      { id: "section-1", title: "Momentum and Impulse", slug: "section-1", number: "5.1", description: "Understand momentum as mass in motion and impulse as the change in momentum." },
      { id: "section-2", title: "Conservation of Momentum", slug: "section-2", number: "5.2", description: "Learn the principle of conservation of momentum and apply it to isolated systems." },
      { id: "section-3", title: "Elastic and Inelastic Collisions", slug: "section-3", number: "5.3", description: "Analyze different types of collisions, including elastic and inelastic interactions." },
      { id: "section-4", title: "Collisions in Two Dimensions", slug: "section-4", number: "5.4", description: "Extend momentum conservation and collision analysis to two-dimensional problems." }
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
      { id: "section-1", title: "Uniform Circular Motion", slug: "section-1", number: "6.1", description: "Describe objects moving in a circle at constant speed and the forces involved." },
      { id: "section-2", title: "Non-Uniform Circular Motion", slug: "section-2", number: "6.2", description: "Analyze objects moving in a circle with changing speed." },
      { id: "section-3", title: "Newton's Law of Universal Gravitation", slug: "section-3", number: "6.3", description: "Learn about the force of gravity between any two objects with mass." },
      { id: "section-4", title: "Orbits and Kepler's Laws", slug: "section-4", number: "6.4", description: "Apply gravitational principles to understand planetary orbits and Kepler's laws." }
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
      { id: "section-1", title: "Rotational Kinematics", slug: "section-1", number: "7.1", description: "Describe rotational motion using angular displacement, velocity, and acceleration." },
      { id: "section-2", title: "Torque", slug: "section-2", number: "7.2", description: "Understand torque as the rotational equivalent of force and how it causes angular acceleration." },
      { id: "section-3", title: "Moment of Inertia", slug: "section-3", number: "7.3", description: "Learn about moment of inertia as rotational inertia and calculate it for various objects." },
      { id: "section-4", title: "Rotational Dynamics and Work-Energy", slug: "section-4", number: "7.4", description: "Apply Newton's laws to rotational motion and understand rotational kinetic energy and work." }
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
  // It maps sections to {id, title, slug, number} which Navigation.svelte expects
  return chapters.map(({ title, slug, sections, description, number }) => ({
    title,
    slug,
    number, // Include the chapter number
    sections: sections.map(sec => ({ id: sec.id, title: sec.title, slug: sec.slug, number: sec.number, description: sec.description })),
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
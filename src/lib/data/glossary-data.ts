export interface GlossaryTerm {
  term: string;
  definition: string;
  sectionRef: string | null;
}

export interface GlossaryChapter {
  chapterSlug: string;
  chapterTitle: string;
  glossaryTerms: GlossaryTerm[];
}

export type GlossaryData = GlossaryChapter[];

const glossaryData: GlossaryData = [
  {
    chapterSlug: "understanding-3d-space",
    chapterTitle: "Chapter 1: Understanding 3D Space",
    glossaryTerms: [
      {
        term: "3D Space",
        definition: "Three-dimensional space is the world we live in, having length, width, and height.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Coordinate System",
        definition: "A framework to define positions in space using coordinates.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Axis",
        definition: "A reference line in a coordinate system.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Axes",
        definition: "Plural of Axis. The reference lines used in a coordinate system.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Vector",
        definition: "A quantity with both magnitude and direction.",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Origin",
        definition: "Definition needed.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Coordinates",
        definition: "Definition needed.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "X-Axis",
        definition: "Definition needed.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Horizontal",
        definition: "Definition needed.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Y-Axis",
        definition: "Definition needed.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Vertical",
        definition: "Definition needed.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Z-Axis",
        definition: "Definition needed.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Depth",
        definition: "Definition needed.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Right-Handed Coordinate System",
        definition: "Definition needed.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Magnitude",
        definition: "Definition needed.",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Scalar",
        definition: "Definition needed.",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Direction",
        definition: "Definition needed.",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Components",
        definition: "Definition needed.",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Unit Vectors",
        definition: "Definition needed.",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Standard Basis Vectors",
        definition: "Definition needed.",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Reference Frame",
        definition: "Definition needed.",
        sectionRef: "vector-operations"
      }
    ]
  },
  {
    chapterSlug: "kinematics",
    chapterTitle: "Chapter 2: Kinematics",
    glossaryTerms: [
      {
        term: "Displacement",
        definition: "Change in position of an object.",
        sectionRef: "displacement-velocity-acceleration"
      },
      {
        term: "Velocity",
        definition: "Rate of change of position with time.",
        sectionRef: "displacement-velocity-acceleration"
      },
      {
        term: "Acceleration",
        definition: "Rate of change of velocity with time.",
        sectionRef: "displacement-velocity-acceleration"
      },
    ]
  },
  {
    chapterSlug: "forces-and-motion",
    chapterTitle: "Chapter 3: Dynamics: Forces and Motion",
    glossaryTerms: [
      {
        term: "Force",
        definition: "An interaction that can change an object's motion.",
        sectionRef: "newtons-laws"
      },
      {
        term: "Newton's First Law",
        definition: "Object at rest stays at rest, object in motion stays in motion.",
        sectionRef: "newtons-laws"
      },
      {
        term: "Newton's Second Law",
        definition: "Force equals mass times acceleration (F=ma).",
        sectionRef: "newtons-laws"
      },
    ]
  }
];

export default glossaryData;
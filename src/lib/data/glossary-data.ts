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
        term: "Vector",
        definition: "A quantity with both magnitude and direction.",
        sectionRef: "vectors-in-space"
      },
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
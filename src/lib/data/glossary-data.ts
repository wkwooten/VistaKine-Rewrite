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
        term: "Cartesian coordinate system",
        definition: "A coordinate system in which the position of a point in space is determined by the signed distances to three mutually perpendicular planes whose intersection defines the origin and whose axes are defined by the intersection lines of the planes.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Vector",
        definition: "A quantity with both magnitude (size or length) and direction.",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Origin",
        definition: "The reference point (0,0,0) where the X, Y, and Z axes intersect in a coordinate system.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Coordinates",
        definition: "A set of numerical values (e.g., x, y, z) that specify the exact position of a point in space relative to the origin and axes.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "X-Axis",
        definition: "The horizontal axis in a standard 3D Cartesian system, typically representing width or side-to-side movement.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Horizontal",
        definition: "Parallel to the plane of the horizon; level. In 3D graphics, often refers to the plane defined by the X and Z axes.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Y-Axis",
        definition: "The vertical axis in a standard 3D Cartesian system, typically representing height.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Vertical",
        definition: "Perpendicular to the horizontal plane; upright. Associated with the Y-axis.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Z-Axis",
        definition: "The axis representing depth in a standard 3D Cartesian system, perpendicular to the X-Y plane.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Depth",
        definition: "The distance from front to back or away from the viewer; often associated with the Z-axis.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Right-Handed Coordinate System",
        definition: "A standard orientation for 3D axes where if the fingers of the right hand curl from the positive X-axis toward the positive Y-axis, the thumb points along the positive Z-axis. Common in physics and 3D graphics.",
        sectionRef: "coordinate-systems"
      },
      {
        term: "Magnitude",
        definition: "The size, length, or strength of a vector, often denoted by ||V||. It represents 'how much' of the quantity the vector describes.",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Scalar",
        definition: "A quantity that has only magnitude (size) but no direction (e.g., temperature, mass, speed).",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Direction",
        definition: "The orientation or course of a vector in space, indicating 'which way' it points.",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Components",
        definition: "The projections of a vector onto the coordinate axes (e.g., Vx, Vy, Vz in 3D). They represent the vector's extent along each axis.",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Unit Vectors",
        definition: "A vector with a magnitude (length) of exactly 1. Used primarily to indicate direction.",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Standard Basis Vectors",
        definition: "Unit vectors pointing along the positive directions of the coordinate axes. In 3D Cartesian coordinates, these are î (X-axis), ĵ (Y-axis), and k̂ (Z-axis).",
        sectionRef: "vectors-and-components"
      },
      {
        term: "Reference Frame",
        definition: "A coordinate system used as a basis for describing the position, orientation, and motion of objects. Essentially, the perspective from which observations are made.",
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
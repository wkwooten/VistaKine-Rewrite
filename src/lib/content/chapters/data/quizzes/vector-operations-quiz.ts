// import type { QuizQuestion } from '$lib/types'; // Removing type for now to resolve import error

export const vectorOpsQuizData /* : QuizQuestion[] */ = [
  {
    id: 'vecOps_q1',
    text: 'Given \\(\\vec{A} = \\langle 2, 3, -1 \\rangle\\) and \\(\\vec{B} = \\langle -1, 1, 4 \\rangle\\), what is \\(\\vec{A} + \\vec{B}\\)?',
    options: [
      { value: '\\(\\langle 1, 4, 3 \\rangle\\)', label: '\\(\\langle 1, 4, 3 \\rangle\\)' },
      { value: '\\(\\langle 3, 2, -5 \\rangle\\)', label: '\\(\\langle 3, 2, -5 \\rangle\\)' },
      { value: '\\(\\langle 1, 4, -5 \\rangle\\)', label: '\\(\\langle 1, 4, -5 \\rangle\\)' },
      { value: '\\(\\langle -2, 3, -4 \\rangle\\)', label: '\\(\\langle -2, 3, -4 \\rangle\\)' }
    ],
    correctAnswer: '\\(\\langle 1, 4, 3 \\rangle\\)',
    explanation: 'Vector addition is performed component-wise: \\(\\langle A_x + B_x, A_y + B_y, A_z + B_z \\rangle = \\langle 2+(-1), 3+1, -1+4 \\rangle = \\langle 1, 4, 3 \\rangle\\).',
    tags: ['vector-addition', 'components'],
  },
  {
    id: 'vecOps_q2',
    text: 'If \\(\\vec{C} = \\langle 4, -6, 2 \\rangle\\) and \\(s = -2\\), what is \\(s\\vec{C}\\)?',
    options: [
      { value: '\\(\\langle 2, -8, 0 \\rangle\\)', label: '\\(\\langle 2, -8, 0 \\rangle\\)' },
      { value: '\\(\\langle -8, 12, -4 \\rangle\\)', label: '\\(\\langle -8, 12, -4 \\rangle\\)' },
      { value: '\\(\\langle 8, -12, 4 \\rangle\\)', label: '\\(\\langle 8, -12, 4 \\rangle\\)' },
      { value: '\\(\\langle 6, -4, 4 \\rangle\\)', label: '\\(\\langle 6, -4, 4 \\rangle\\)' }
    ],
    correctAnswer: '\\(\\langle -8, 12, -4 \\rangle\\)',
    explanation: 'Scalar multiplication involves multiplying each component by the scalar: \\(s\\vec{C} = \\langle sC_x, sC_y, sC_z \\rangle = \\langle (-2)(4), (-2)(-6), (-2)(2) \\rangle = \\langle -8, 12, -4 \\rangle\\).',
    tags: ['scalar-multiplication', 'components'],
  },
  // Add more questions as needed
];
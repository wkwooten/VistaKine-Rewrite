// Define the types (optional but good practice)
interface QuizOption {
  value: string;
  label: string;
}
interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctAnswer: string;
}

export const coordinateQuizData: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'Which axis represents <em>depth</em> in a 3D Cartesian <em>coordinate system</em>?',
    options: [
      { value: 'a', label: '<strong>x</strong>' },
      { value: 'b', label: '<strong>y</strong>' },
      { value: 'c', label: '<strong>z</strong>' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q2',
    text: 'If you move a point only along the y-axis, what changes?',
    options: [
      { value: 'a', label: 'Its <em>horizontal position</em>' },
      { value: 'b', label: 'Its <em>vertical position</em>' },
      { value: 'c', label: 'Its <em>depth</em>' }
    ],
    correctAnswer: 'b'
  }
];

export const vectorQuizData: QuizQuestion[] = [
  {
    id: 'q3',
    text: 'A <strong>vector</strong> pointing directly upwards has:',
    options: [
      { value: 'a', label: 'Only <em>magnitude</em>' },
      { value: 'b', label: 'Only <em>direction</em>' },
      { value: 'c', label: 'Both <em>magnitude</em> and <em>direction</em>' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q4',
    text: 'If you double the <em>magnitude</em> of a <strong>vector</strong>, what happens to its length?',
    options: [
      { value: 'a', label: 'It halves' },
      { value: 'b', label: 'It doubles' },
      { value: 'c', label: 'It stays the same' }
    ],
    correctAnswer: 'b'
  }
];
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
    text: 'Which <span class="keyword">axis</span> represents <span class="keyword">depth</span> in a 3D Cartesian <span class="keyword">coordinate system</span>?',
    options: [
      { value: 'a', label: '<span class="keyword">x</span>' },
      { value: 'b', label: '<span class="keyword">y</span>' },
      { value: 'c', label: '<span class="keyword">z</span>' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q2',
    text: 'If you move a point only along the <span class="keyword">y-axis</span>, what changes?',
    options: [
      { value: 'a', label: 'Its <span class="keyword">horizontal</span> position' },
      { value: 'b', label: 'Its <span class="keyword">vertical</span> position' },
      { value: 'c', label: 'Its <span class="keyword">depth</span>' }
    ],
    correctAnswer: 'b'
  }
];

export const vectorQuizData: QuizQuestion[] = [
  {
    id: 'q3',
    text: 'A <span class="keyword">vector</span> pointing directly upwards has:',
    options: [
      { value: 'a', label: 'Only <span class="keyword">magnitude</span>' },
      { value: 'b', label: 'Only <span class="keyword">direction</span>' },
      { value: 'c', label: 'Both <span class="keyword">magnitude</span> and <span class="keyword">direction</span>' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q4',
    text: 'If you double the <span class="keyword">magnitude</span> of a <span class="keyword">vector</span>, what happens to its length?',
    options: [
      { value: 'a', label: 'It halves' },
      { value: 'b', label: 'It doubles' },
      { value: 'c', label: 'It stays the same' }
    ],
    correctAnswer: 'b'
  }
];
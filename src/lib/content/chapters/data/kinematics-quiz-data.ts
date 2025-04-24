// Define the types (consistent with understanding-3d-space-quiz-data.ts)
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

export const displacementQuizData: QuizQuestion[] = [
  {
    id: 'displace-q1',
    text: 'What is <span class="keyword">displacement</span>?',
    options: [
      { value: 'a', label: 'The total distance traveled by an object' },
      { value: 'b', label: 'The change in position of an object from its starting point to its final position' },
      { value: 'c', label: 'The speed of an object in a given direction' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'displace-q2',
    text: 'If an object moves in a complete circle and returns to its starting point, what is its total <span class="keyword">displacement</span>?',
    options: [
      { value: 'a', label: 'Equal to the circumference of the circle' },
      { value: 'b', label: 'Equal to the diameter of the circle' },
      { value: 'c', label: 'Zero' }
    ],
    correctAnswer: 'c'
  }
];

export const velocityQuizData: QuizQuestion[] = [
  {
    id: 'vel-q1',
    text: 'Which of the following is the correct definition of <span class="keyword">velocity</span>?',
    options: [
      { value: 'a', label: 'The rate of change of distance with respect to time' },
      { value: 'b', label: 'The rate of change of displacement with respect to time' },
      { value: 'c', label: 'The rate of change of speed with respect to time' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'vel-q2',
    text: 'An object moving with a constant non-zero <span class="keyword">velocity</span>:',
    options: [
      { value: 'a', label: 'Must be moving in a straight line' },
      { value: 'b', label: 'Could be moving in a circle' },
      { value: 'c', label: 'Must be speeding up or slowing down' }
    ],
    correctAnswer: 'a'
  }
];

export const accelerationQuizData: QuizQuestion[] = [
  {
    id: 'accel-q1',
    text: '<span class="keyword">Acceleration</span> is:',
    options: [
      { value: 'a', label: 'The rate of change of displacement with respect to time' },
      { value: 'b', label: 'The rate of change of velocity with respect to time' },
      { value: 'c', label: 'Always in the same direction as velocity' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'accel-q2',
    text: 'An object with a constant <span class="keyword">acceleration</span> of 10 m/s² starting from rest will have a velocity after 5 seconds of:',
    options: [
      { value: 'a', label: '2 m/s' },
      { value: 'b', label: '50 m/s' },
      { value: 'c', label: '25 m/s' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'accel-q3',
    text: 'When an object moves in a circle at a constant speed, is it accelerating?',
    options: [
      { value: 'a', label: 'No, because its speed is constant' },
      { value: 'b', label: 'Yes, because its direction is changing (centripetal acceleration)' },
      { value: 'c', label: 'It depends on whether the circle is perfect' }
    ],
    correctAnswer: 'b'
  }
];

export const projectileMotionQuizData: QuizQuestion[] = [
  {
    id: 'proj-q1',
    text: 'For a projectile launched on Earth (ignoring air resistance), which component of velocity remains constant during flight?',
    options: [
      { value: 'a', label: 'Vertical velocity' },
      { value: 'b', label: 'Horizontal velocity' },
      { value: 'c', label: 'Both vertical and horizontal velocity' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'proj-q2',
    text: 'What launch angle maximizes the range of a projectile on level ground (ignoring air resistance)?',
    options: [
      { value: 'a', label: '30°' },
      { value: 'b', label: '45°' },
      { value: 'c', label: '60°' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'proj-q3',
    text: 'At the highest point of a projectile\'s trajectory:',
    options: [
      { value: 'a', label: 'Both horizontal and vertical velocity are zero' },
      { value: 'b', label: 'Vertical velocity is zero, horizontal velocity is unchanged' },
      { value: 'c', label: 'Horizontal velocity is zero, vertical velocity is unchanged' }
    ],
    correctAnswer: 'b'
  }
];

export const relativeMotionQuizData: QuizQuestion[] = [
  {
    id: 'rel-q1',
    text: 'If a passenger walks at 2 m/s toward the front of a train moving at 25 m/s, what is the passenger\'s velocity relative to the ground?',
    options: [
      { value: 'a', label: '23 m/s' },
      { value: 'b', label: '27 m/s' },
      { value: 'c', label: '25 m/s' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'rel-q2',
    text: 'A boat can travel at 5 m/s in still water. If it travels directly across a river with a 3 m/s current, what is the boat\'s resultant velocity?',
    options: [
      { value: 'a', label: '5 m/s at an angle downstream' },
      { value: 'b', label: '8 m/s downstream' },
      { value: 'c', label: 'sqrt(34) m/s (approximately 5.83 m/s) at an angle downstream' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'rel-q3',
    text: 'What is a frame of reference in <span class="keyword">relative motion</span>?',
    options: [
      { value: 'a', label: 'A physical object used to take measurements' },
      { value: 'b', label: 'A coordinate system relative to which motion is measured' },
      { value: 'c', label: 'The starting point of any motion' }
    ],
    correctAnswer: 'b'
  }
];
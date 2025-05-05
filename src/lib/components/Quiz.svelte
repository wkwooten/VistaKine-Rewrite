<script lang="ts">
  // Define the expected structure for a question
  interface QuizOption {
    value: string;
    label: string; // Contains HTML
  }
  interface QuizQuestion {
    id: string;
    text: string; // Contains HTML
    options: QuizOption[];
    correctAnswer?: string; // Optional to allow for questions without predefined answers
  }

  // Accept the questions data as a prop
  let { questions = [], showFeedback = false } = $props<{
    questions?: QuizQuestion[];
    showFeedback?: boolean;
  }>();

  // Track user answers
  let userAnswers = $state<Record<string, string>>({});
  let submitted = $state(false);
  let score = $state(0);

  // Submit the quiz and calculate score
  function submitQuiz() {
    submitted = true;

    if (!showFeedback) return;

    // Calculate score
    let correct = 0;
    for (const question of questions) {
      if (
        question.correctAnswer &&
        userAnswers[question.id] === question.correctAnswer
      ) {
        correct++;
      }
    }
    score = correct;
  }

  // Reset the quiz
  function resetQuiz() {
    userAnswers = {};
    submitted = false;
    score = 0;
  }

  // Check if a specific answer is correct
  function isCorrect(questionId: string) {
    const question = questions.find((q) => q.id === questionId);
    return (
      question?.correctAnswer &&
      userAnswers[questionId] === question.correctAnswer
    );
  }
</script>

<div class="quiz">
  {#each questions as question (question.id)}
    <div class="quiz-question-group">
      <!-- Use @html to render spans inside text -->
      <p>{@html question.text}</p>
      <form class="multiple-choice-question">
        {#each question.options as option (option.value)}
          <label
            class:selected={userAnswers[question.id] === option.value}
            class:correct={submitted &&
              showFeedback &&
              question.correctAnswer === option.value}
            class:incorrect={submitted &&
              showFeedback &&
              userAnswers[question.id] === option.value &&
              question.correctAnswer !== option.value}
          >
            <input
              type="radio"
              name={question.id}
              value={option.value}
              disabled={submitted}
              on:change={() => (userAnswers[question.id] = option.value)}
            />
            <!-- Use @html to render spans inside label -->
            {@html option.label}
          </label>
        {/each}
      </form>
    </div>
  {/each}

  <div class="quiz-controls">
    {#if !submitted}
      <button class="quiz-submit" on:click={submitQuiz}>Submit Answers</button>
    {:else if showFeedback}
      <div class="quiz-results">
        <p>
          You got <strong>{score}</strong> out of
          <strong>{questions.length}</strong> correct!
        </p>
        <button class="quiz-reset" on:click={resetQuiz}>Try Again</button>
      </div>
    {:else}
      <div class="quiz-results">
        <p>Thank you for submitting your answers!</p>
        <button class="quiz-reset" on:click={resetQuiz}>Try Again</button>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  /* Styles for quiz */
  .quiz {
    padding: var(--space-s);
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    counter-reset: question-counter;
  }

  /* Styles moved from understanding-3d-space.svelte */
  .quiz-question-group {
    margin-bottom: var(--space-l);
    padding-left: var(--space-s);
    border-left: 2px solid var(--color-accent);

    /* Remove bottom margin from the last question group */
    &:last-child {
      margin-bottom: 0;
    }
  }

  .quiz-question-group > p {
    /* Styling the question text */
    font-weight: 700;
    margin-bottom: var(--space-xs);
    &::before {
      counter-increment: question-counter;
      content: counter(question-counter) ". ";
      display: inline-block;
      margin-right: var(--space-2xs);
      font-weight: 800;
      color: var(--color-accent);
    }
  }

  .multiple-choice-question {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
    margin-left: var(--space-s);
  }

  form {
    /* Reset default form margin if any */
    margin: 0;
  }

  label {
    display: block;
    margin-bottom: var(--space-2xs);
    padding: var(--space-s); /* Adjusted padding */
    border-radius: var(--radius-md);
    background-color: var(
      --bg-primary
    ); /* Slightly different background for options */
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--bg-hover);
    }

    /* Remove bottom margin from the last label in a group */
    &:last-child {
      margin-bottom: 0;
    }
  }

  input[type="radio"] {
    margin-right: var(--space-xs);
    accent-color: var(--color-accent); /* Style the radio button itself */
  }

  /* Styling for selected, correct and incorrect answers */
  .selected {
    border: 1px solid var(--color-accent);
  }

  .correct {
    background-color: rgba(75, 181, 67, 0.15);
    border: 1px solid rgb(75, 181, 67);
  }

  .incorrect {
    background-color: rgba(224, 49, 49, 0.15);
    border: 1px solid rgb(224, 49, 49);
  }

  /* Quiz controls */
  .quiz-controls {
    margin-top: var(--space-l);
    display: flex;
    justify-content: center;
  }

  .quiz-submit,
  .quiz-reset {
    padding: var(--space-s) var(--space-m);
    background-color: var(--color-accent);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-accent-dark, #0056b3);
    }
  }

  .quiz-results {
    text-align: center;

    p {
      margin-bottom: var(--space-s);
      font-size: 1.1rem;
    }
  }

  /* Styling for the keyword span if needed within the Quiz context */
  /* Although keywords are likely styled globally, you could add scoped overrides */
  :global(.keyword) {
    /* Example: override global keyword style just within quiz if needed */
    /* color: blue; */
  }
</style>

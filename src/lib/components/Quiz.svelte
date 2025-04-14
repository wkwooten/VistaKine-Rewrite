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
  }

  // Accept the questions data as a prop
  let { questions = [] } = $props<{ questions?: QuizQuestion[] }>();
</script>

<div class="quiz">
  {#each questions as question (question.id)}
    <div class="quiz-question-group">
       <!-- Use @html to render spans inside text -->
       <p>{@html question.text}</p>
       <form class="multiple-choice-question">
          {#each question.options as option (option.value)}
             <label>
                <input type="radio" name={question.id} value={option.value}>
                <!-- Use @html to render spans inside label -->
                {@html option.label}
             </label>
          {/each}
       </form>
    </div>
  {/each}
</div>

<style lang="scss">
  /* Styles for quiz */
  .quiz {
    margin-top: var(--space-m);
    padding: var(--space-l); /* Increased padding a bit */
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

  .quiz-question-group > p { /* Styling the question text */
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

  form { /* Reset default form margin if any */
      margin: 0;
  }

  label {
    display: block;
    margin-bottom: var(--space-2xs);
    padding: var(--space-s); /* Adjusted padding */
    border-radius: var(--radius-md);
    background-color: var(--bg-primary); /* Slightly different background for options */
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

  /* Styling for the keyword span if needed within the Quiz context */
  /* Although keywords are likely styled globally, you could add scoped overrides */
  :global(.keyword) {
     /* Example: override global keyword style just within quiz if needed */
     /* color: blue; */
   }

</style>
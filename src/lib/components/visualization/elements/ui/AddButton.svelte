<script lang="ts">
  import { Plus } from "lucide-svelte";
</script>

<button class="add-button" title="Add">
  <Plus size={24} />
</button>

<style>
  .add-button {
    padding: var(--space-s); /* Use Utopia fluid spacing */
    border: 1px solid var(--color-accent);
    border-radius: 50%; /* Use variable for radius */
    color: var(--color-accent); /* Use appropriate text color */
    cursor: pointer;
    /* Update transition to match ResetButton */
    transition:
      transform 0.1s ease,
      background-color 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;
    display: flex; /* Use flex to center the icon */
    align-items: center;
    justify-content: center;
    margin: var(--space-s);
    background-color: var(--color-surface); /* Set background color */
    box-shadow: var(--shadow-sm);

    /* Add hover state from ResetButton */
    &:hover {
      background-color: var(--color-accent-hover-bg);
      color: var(--color-accent-light);
      transform: translateY(-1px);
      /* Optional: Add border on hover if desired, or keep none */
      /* border: 1px solid var(--color-accent-light); */
    }

    /* Add active state from ResetButton */
    &:active {
      background-color: var(--color-accent-active-bg);
      transform: translateY(0);
      /* Optional: Adjust active border if needed */
    }
  }
</style>

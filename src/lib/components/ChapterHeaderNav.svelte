<script lang="ts">
  import { ChevronsRight } from 'lucide-svelte';
  // Props definition
  export let chapterSections: { id: string; title: string }[] = [];
</script>

<div class="chapter-header-nav">
  <nav>
    <p>Jump to a section</p>
    <ul>
      {#each chapterSections as section}
        <li>
          <ChevronsRight size={20} />
          <a href={`#${section.id}`}>{section.title}</a>
        </li>
      {/each}
    </ul>
  </nav>
</div>

<style lang="scss">
  .chapter-header-nav {
    margin-top: var(--space-m);
    padding: var(--space-s);
    /* border-top: 1px solid var(--color-background); */
  }

  nav {


    p {
      color: var(--color-text-inverted);
      font-size: var(--step-1);
      margin-bottom: var(--space-xs);
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-s);
      list-style: none;
      padding-inline: var(--space-s);
      margin: 0;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: var(--space-xs);
      }
    }

    li {
      display: flex;
      align-items: center;
      gap: var(--space-3xs);
      padding: var(--space-xs) var(--space-s);
      margin: 0;
      border-radius: var(--radius-sm);
      transition: background-color 0.2s ease;
      &:hover {
        background-color: var(--color-accent-hover-bg, rgba(0, 0, 0, 0.05));
      }
    }

    a {
      color: var(--color-text-inverted);
      text-decoration: underline;
      border-radius: var(--radius-sm, 4px);
      font-size: var(--step-0, 0.875rem);


    }
  }
</style>
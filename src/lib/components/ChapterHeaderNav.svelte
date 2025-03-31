<script>
  // Props definition
  export let chapterSections = [];
</script>

<div class="chapter-header-nav">
  <nav>
    <p>Jump to section</p>
    <ul>
      {#each chapterSections as section}
        <li>
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
    /* border-top: 1px solid var(--background-color); */
  }

  nav {
    p {
      color: var(--background-color);
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
      margin: 0;
      border-radius: var(--radius-sm);
    }

    a {
      color: var(--background-color);
      text-decoration: underline;
      padding: var(--space-xs) var(--space-s);
      border-radius: var(--radius-sm, 4px);
      transition: background-color 0.2s ease;
      font-size: var(--step-0, 0.875rem);

      &:hover {
        background-color: var(--brand-hover-bg, rgba(0, 0, 0, 0.05));
      }
    }
  }
</style>
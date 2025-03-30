<script>
  import { getAllChapters } from '$lib/data/chapters';

  // Use centralized chapter data
  const chapters = getAllChapters();
</script>

<svelte:head>
  <title>Table of Contents | VistaKine</title>
</svelte:head>

<div class="toc-container">
  <h1>Table of Contents</h1>

  <div class="chapters">
    {#each chapters as chapter}
      <div class="chapter">
        <h2>
          <a href={`/chapter/${chapter.slug}`}>{chapter.title}</a>
        </h2>

        {#if chapter.sections && chapter.sections.length > 0}
          <ul class="sections">
            {#each chapter.sections as section}
              <li>
                <a href={`/chapter/${chapter.slug}#${section.id}`}>
                  {section.title}
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .toc-container {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-l) var(--space-m);

    h1 {
      color: var(--primary-color);
      margin-bottom: var(--space-l);
      font-size: var(--step-3);
    }
  }

  .chapters {
    display: flex;
    flex-direction: column;
    gap: var(--space-l);
  }

  .chapter {
    h2 {
      font-size: var(--step-2);
      margin-bottom: var(--space-s);

      a {
        color: var(--text-color);
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
          color: var(--primary-color);
        }
      }
    }
  }

  .sections {
    list-style: none;
    padding-left: var(--space-m);
    margin: 0;

    li {
      margin-bottom: var(--space-xs);

      a {
        color: var(--text-color);
        text-decoration: none;
        font-size: var(--step-0);
        transition: color 0.2s ease;

        &:hover {
          color: var(--primary-color);
        }
      }
    }
  }
</style>
<script>
  import { getChapterList } from '$lib/data/chapters';

  // Use centralized chapter data
  const chapters = getChapterList();
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
        {#if chapter.description}
          <p class="description">{chapter.description}</p>
        {/if}

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
      color: var(--color-accent);
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
          color: var(--color-accent);
        }
      }
    }
  }

  .sections {
    list-style: none;
    padding-left: var(--space-m);
    margin: 0;

    li {
      margin-bottom: var(--space-xxs);
      color: var(--color-text-primary);

      a {
        text-decoration: none;
        font-size: var(--step-1);
        font-weight: 600;
        color: var(--color-text-primary);
        border-bottom: 1px solid var(--color-border-light);
        padding-bottom: var(--space-xs);
        transition: color 0.2s ease;

        &:hover {
          color: var(--color-accent);
        }
      }
    }
  }

  .description {
    font-size: var(--step-0);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-m);
    line-height: 1.6;
  }
</style>
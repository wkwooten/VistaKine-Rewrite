<script lang="ts">
  import { getChapterList } from "$lib/data/chapters";
  import ContentCard from "$lib/components/ContentCard.svelte";
  import type { Snippet } from "svelte";
  import { sectionMapOpen } from "$lib/stores/uiStores";

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
      <ContentCard class="chapter-card">
        {#snippet children()}
          <h2
            style={`color: var(--chapter-color-${chapter.number}, var(--chapter-color-default));`}
          >
            <a href={`/chapter/${chapter.slug}`}>
              Chapter {chapter.number} <br />
              {chapter.title}
            </a>
          </h2>
          {#if chapter.description}
            <p class="description">{chapter.description}</p>
          {/if}

          {#if chapter.sections && chapter.sections.length > 0}
            <ul class="sections">
              {#each chapter.sections as section}
                <li>
                  <a href={`/chapter/${chapter.slug}/${section.slug}`}>
                    <span class="section-number">{section.number}</span
                    >{section.title}
                  </a>
                  {#if section.description}
                    <p class="section-description">{section.description}</p>
                  {/if}
                </li>
              {/each}
            </ul>
          {/if}
        {/snippet}
      </ContentCard>
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

  :global(.chapter-card h2) {
    font-size: var(--step-2);
    margin-bottom: var(--space-s);

    a {
      color: inherit;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: var(--color-accent);
      }
    }
  }

  .sections {
    list-style: none;
    padding-left: 0;
    margin-top: var(--space-s);
    margin-bottom: 0;

    li {
      margin-bottom: var(--space-s);

      a {
        text-decoration: none;
        font-size: var(--step-1);
        font-weight: 600;
        color: var(--color-text-primary);
        display: block;
        margin-bottom: var(--space-3xs);

        .section-number {
          margin-right: var(--space-xs);
          color: var(--color-accent);
          font-weight: bold;
        }

        &:hover {
          color: var(--color-accent);
          .section-number {
            color: var(--color-accent-hover);
          }
        }
      }
    }
  }

  .section-description {
    font-size: var(--step-0);
    color: var(--color-text-secondary);
    line-height: 1.5;
    padding-left: var(--space-m);
    margin-top: 0;
    margin-bottom: 0;
  }

  :global(.chapter-card .description) {
    font-size: var(--step-0);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-m);
    line-height: 1.6;
  }
</style>

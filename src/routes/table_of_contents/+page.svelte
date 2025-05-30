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
      <ContentCard class="chapter-card" showBookmarkFeature={false}>
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
                    <div>
                      <span class="section-number">{section.number}</span
                      >{section.title}
                    </div>
                    {#if section.description}
                      <p class="section-description">{section.description}</p>
                    {/if}
                  </a>
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
        color: var(--color-text-primary);
        display: block;
        padding: var(--space-xs) var(--space-s);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-s);
        transition:
          background-color 0.2s ease,
          border-color 0.2s ease;

        &:hover,
        &:focus {
          background-color: var(--color-surface-hover);
          border-color: var(--color-accent);
          outline: none;
        }

        &:focus-visible {
          box-shadow: 0 0 0 2px var(--color-accent-focus);
        }

        .section-number {
          margin-right: var(--space-xs);
          color: var(--color-accent);
          font-weight: bold;
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

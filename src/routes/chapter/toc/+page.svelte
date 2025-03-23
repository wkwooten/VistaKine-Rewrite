<script>
  import { page } from '$app/stores';

  // This matches the structure from Navigation.svelte
  const chapters = [
    {
      title: 'Introduction',
      slug: 'chapter1',
      sections: [
        { id: "coordinate-systems", title: "1.1 Coordinate Systems" },
        { id: "vectors-in-space", title: "1.2 Vectors in 3D Space" },
        { id: "reference-frames", title: "1.3 Reference Frames" }
      ]
    },
    {
      title: 'Kinematics',
      slug: 'chapter2',
      sections: [
        { id: "kinematics-section1", title: "2.1 Kinematics Section 1" },
        { id: "kinematics-section2", title: "2.2 Kinematics Section 2" }
      ]
    },
    {
      title: 'Dynamics',
      slug: 'chapter3',
      sections: [
        { id: "dynamics-section1", title: "3.1 Dynamics Section 1" }
      ]
    }
  ];
</script>

<div class="toc-container">
  <h1>Table of Contents</h1>

  <div class="chapters">
    {#each chapters as chapter}
      <div class="chapter">
        <h2>
          <a href="/chapter/{chapter.slug}">{chapter.title}</a>
        </h2>

        <ul class="sections">
          {#each chapter.sections as section}
            <li>
              <a href="/chapter/{chapter.slug}#{section.id}">
                {section.title}
              </a>
            </li>
          {/each}
        </ul>
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
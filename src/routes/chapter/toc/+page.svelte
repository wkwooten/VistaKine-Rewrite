<script>
  // import { page } from '$app/stores';

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
    },
    {
      title: 'Advanced Topics',
      slug: 'chapter4',
      sections: [
        { id: "advanced-section1", title: "4.1 Advanced Topic 1 - Placeholder" },
        { id: "advanced-section2", title: "4.2 Advanced Topic 2 - Placeholder" }
      ]
    },
    {
      title: 'Motion Analysis',
      slug: 'chapter5',
      sections: [
        { id: "motion-analysis-section1", title: "5.1 Motion Analysis 1 - Placeholder" },
        { id: "motion-analysis-section2", title: "5.2 Motion Analysis 2 - Placeholder" }
      ]
    },
    {
      title: 'Biomechanics',
      slug: 'chapter6',
      sections: [
        { id: "biomechanics-section1", title: "6.1 Biomechanics 1 - Placeholder" },
        { id: "biomechanics-section2", title: "6.2 Biomechanics 2 - Placeholder" }
      ]
    },
    {
      title: 'Clinical Applications',
      slug: 'chapter7',
      sections: [
        { id: "clinical-section1", title: "7.1 Clinical Applications 1 - Placeholder" },
        { id: "clinical-section2", title: "7.2 Clinical Applications 2 - Placeholder" }
      ]
    },
    {
      title: 'Research Methods',
      slug: 'chapter8',
      sections: [
        { id: "research-section1", title: "8.1 Research Methods 1 - Placeholder" },
        { id: "research-section2", title: "8.2 Research Methods 2 - Placeholder" }
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
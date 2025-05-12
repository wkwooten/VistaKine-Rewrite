<script lang="ts">
  // Import the ContentCard component
  // import ContentCard from "$lib/components/ContentCard.svelte"; // Removed ContentCard import
</script>

<section id="about" class="about">
  <!-- Use ContentCard for the intro block -->
  <!-- <ContentCard blockType="about-intro-block" layoutWidth="full"> -->
  <h2>About VistaKine</h2>
  <div class="about-content">
    <p>
      VistaKine combines educational content with interactive 3D visualizations
      and physics simulations to create an engaging learning experience.
    </p>
    <p>
      By integrating powerful 3D rendering with physics simulations, VistaKine
      allows students to explore complex kinematic and dynamic concepts through
      hands-on interaction.
    </p>
    <div class="visual-placeholder main-about-visual">
      <p>Placeholder for Main About Visual (e.g., GIF/Screenshot)</p>
    </div>
  </div>
  <!-- </ContentCard> -->

  <!-- <ContentCard blockType="about-differentiators" layoutWidth="full"> -->
  <div class="about-section">
    <h3>What Makes VistaKine Different?</h3>
    <div class="differentiators-grid">
      <div>
        <div class="visual-placeholder small">
          <p>Icon</p>
        </div>
        <h4 class="differentiator-title">A Bridge to Higher Learning</h4>
        <p>
          Master foundational 3D vector concepts and mechanics, building a solid
          base for success in advanced university physics and engineering
          courses.
        </p>
      </div>
      <div>
        <div class="visual-placeholder small">
          <p>Icon</p>
        </div>
        <h4 class="differentiator-title">Intuition First, Mastery Follows</h4>
        <p>
          We focus on building deep conceptual understanding. Manipulate 3D
          models, experiment with physics parameters, and see instant results to
          grasp core principles intuitively.
        </p>
      </div>
      <div>
        <div class="visual-placeholder small">
          <p>Icon</p>
        </div>
        <h4 class="differentiator-title">Explore & Discover</h4>
        <p>
          Our interactive exercises are your playground. Experiment freely with
          concepts like forces and motion, and discover physics principles for
          yourself in a hands-on way.
        </p>
      </div>
    </div>
  </div>
  <!-- </ContentCard> -->

  <!-- Keep the features grid container, but wrap each feature in a ContentCard -->
  <div class="features about-section">
    <!-- <ContentCard blockType="feature-block" layoutWidth="full"> -->
    <div class="feature-block">
      <div class="visual-placeholder med">
        <p>Placeholder for Interactive Visual</p>
      </div>
      <div class="feature-text-content">
        <h3>Interactive 3D Visualizations</h3>
        <p>
          Understand complex concepts through manipulable 3D models and
          simulations, like visualizing vector components in space or observing
          projectile motion.
        </p>
      </div>
    </div>
    <!-- </ContentCard> -->

    <!-- <ContentCard blockType="feature-block" layoutWidth="full"> -->
    <div class="feature-block">
      <div class="visual-placeholder med">
        <p>Placeholder for Physics Sim Visual</p>
      </div>
      <div class="feature-text-content">
        <h3>Physics-Based Simulations</h3>
        <p>
          Experiment with physical properties like forces and masses, change
          initial conditions, and see how systems respond in real-time.
        </p>
      </div>
    </div>
    <!-- </ContentCard> -->

    <!-- <ContentCard blockType="feature-block" layoutWidth="full"> -->
    <div class="feature-block">
      <div class="visual-placeholder med">
        <p>Placeholder for Learn by Doing Visual</p>
      </div>
      <div class="feature-text-content">
        <h3>Learn by Doing</h3>
        <p>
          Engage with the material through interactive examples and experiments,
          such as solving 3D printer calibration challenges or building vectors
          in space.
        </p>
      </div>
    </div>
    <!-- </ContentCard> -->
  </div>
  <!-- Removed the outer .container div as ContentCard handles width/centering -->
</section>

<style lang="scss">
  .about {
    display: flex;
    flex-direction: column;
    margin-top: var(--space-3xl); // Added top margin for separation
    min-height: auto; // Let content define height
    padding: var(--space-xl) var(--space-m);
    gap: var(--space-xl);
    /* Remove background-color, ContentCards handle their own */
  }

  .about-section {
    margin-block: var(--space-xl);
    // Responsive spacing for mobile
    @media (max-width: 768px) {
      margin-block: var(--space-l);
      padding-inline: var(--space-s);
    }
  }

  .about-content {
    @media (max-width: 768px) {
      padding-inline: var(--space-s);
      text-align: center;
    }
  }

  .main-about-visual {
    @media (max-width: 768px) {
      margin-inline: auto;
      width: 100%;
      max-width: 100%;
    }
  }

  .differentiators-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-m);
    margin-top: var(--space-m);
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: var(--space-s);
    }
  }

  .features {
    display: flex;
    flex-direction: column;
    gap: var(--space-l); // Increased gap
    max-width: var(--wide-content-width);
    margin: var(--space-xl) auto 0;
    @media (max-width: 768px) {
      gap: var(--space-m);
      padding-inline: var(--space-s);
    }
  }

  .feature-block {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--space-l);
    max-width: 100%;
    &:nth-child(even) {
      flex-direction: row-reverse;
    }
    @media (max-width: 768px) {
      flex-direction: column;
      gap: var(--space-s);
      &:nth-child(even) {
        flex-direction: column;
      }
      .visual-placeholder,
      .feature-text-content {
        width: 100%;
        max-width: 100%;
      }
      .visual-placeholder {
        margin-bottom: var(--space-s);
        max-width: 400px;
        min-width: 0;
        align-self: center;
      }
    }
  }

  .feature-text-content {
    flex: 1;
    min-width: 0;
    @media (max-width: 768px) {
      text-align: center;
    }
  }

  .differentiator-title {
  }

  .visual-placeholder {
    background-color: var(--color-surface);
    border: 1px dashed var(--color-border);
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--space-s);
    margin-bottom: 0; // Removed margin-bottom as gap is handled by flex OR stacked visual
    border-radius: var(--radius-sm);
    flex: 1; // Allow visual to take space, adjust basis if needed e.g., flex: 0 0 40%;
    max-width: 350px;
    min-width: 0;
    box-sizing: border-box;
    // Consider adding max-width to prevent placeholders from becoming too large
    // max-width: 300px; // Example max-width

    p {
      color: var(--color-text-secondary);
      font-size: var(--step--1);
    }

    &.small {
      min-height: 80px;
      margin-bottom: var(--space-xs);
      aspect-ratio: 1/1;
    }

    &.med {
      min-height: 150px;
      margin-bottom: var(--space-xs);
      aspect-ratio: 1/1;
    }

    &.main-about-visual {
      margin-top: var(--space-m);
      min-height: 200px; // Larger placeholder for the main visual
      aspect-ratio: 16/9;
      margin-inline: auto; // Centering the main visual
      max-width: 100%;
    }
  }
</style>

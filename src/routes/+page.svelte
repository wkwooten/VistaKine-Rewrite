<script lang="ts">
  // Scroll function for the About section
  function scrollToAbout() {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Import the SearchBar component
  // Note: Linter might show an error here, but the path is correct. It's likely a language server issue.
  import SearchBar from "$lib/components/ui/SearchBar.svelte";
  // Import the ContentCard component
  import ContentCard from "$lib/components/ContentCard.svelte";
</script>

<section class="hero">
  <!-- Wrap hero content in a ContentCard -->
  <ContentCard
    blockType="hero-block"
    layoutWidth="full"
    class="hero-content-card"
  >
    <div class="hero-content-inner">
      <h1 class="hero-title">VistaKine</h1>
      <p class="tagline">
        Bringing Physics Learning into a New Dimension <br />
        Explore interactive 3D visualizations that bring kinematics to life.
      </p>

      <!-- Add the SearchBar component -->
      <SearchBar
        placeholder="Search topics like 'vectors', 'kinematics', 'forces'..."
      />

      <div class="hero-buttons">
        <a
          href="/chapter/understanding-3d-space/coordinate-systems"
          class="btn primary">Begin Learning</a
        >
        <button class="btn secondary" onclick={scrollToAbout}
          >About VistaKine</button
        >
      </div>
    </div>
  </ContentCard>
</section>

<section id="about" class="about">
  <!-- Use ContentCard for the intro block -->
  <ContentCard blockType="about-intro-block" layoutWidth="full">
    <h2>About VistaKine</h2>
    <div class="about-content">
      <p>
        VistaKine combines educational content with interactive 3D
        visualizations and physics simulations to create an engaging learning
        experience.
      </p>
      <p>
        By integrating powerful 3D rendering with physics simulations, VistaKine
        allows students to explore complex kinematic and dynamic concepts
        through hands-on interaction.
      </p>
    </div>
  </ContentCard>

  <!-- Keep the features grid container, but wrap each feature in a ContentCard -->
  <div class="features">
    <ContentCard blockType="feature-block" layoutWidth="full">
      <h3>Interactive 3D Visualizations</h3>
      <p>
        Understand complex concepts through manipulable 3D models and
        simulations.
      </p>
    </ContentCard>

    <ContentCard blockType="feature-block" layoutWidth="full">
      <h3>Physics-Based Simulations</h3>
      <p>
        Experiment with physical properties and see how systems respond in
        real-time.
      </p>
    </ContentCard>

    <ContentCard blockType="feature-block" layoutWidth="full">
      <h3>Learn by Doing</h3>
      <p>
        Engage with the material through interactive examples and experiments.
      </p>
    </ContentCard>
  </div>
  <!-- Removed the outer .container div as ContentCard handles width/centering -->
</section>

<style lang="scss">
  .hero {
    min-height: 100vh; // Use min-height instead of height for flexibility
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    overflow: hidden;
    padding: var(--space-xl) var(--space-m); // Add padding to the section itself
  }

  .hero-title {
    font-size: var(
      --step-6
    ); // Reverted from clamp for testing, adjust as needed
    line-height: 1.1;
    margin-bottom: var(--space-m);
  }

  /* Target the ContentCard used in the hero */
  .hero-content-card {
    /* Override default ContentCard background/shadow for hero transparency */
    background-color: transparent; // Rely on backdrop-filter
    aspect-ratio: var(--pertensious_ratio);
    backdrop-filter: blur(5px);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); // Keep custom shadow for now
    border: 1px solid var(--color-border-light); // Use defined light border variable
    padding: var(--space-l); // Keep padding consistent
    margin-top: 0; // Remove default top margin for hero placement
    max-width: 600px; // Allow hero card to be slightly wider
  }

  /* Styles for the inner content div if needed, mainly for text alignment */
  .hero-content-inner {
    text-align: center; // Ensure inner elements are centered
  }

  /* Remove styles previously applied to .hero-content div */
  /* .hero-content { ... } */

  .hero-content-card .tagline {
    /* Target tagline within the hero card */
    font-size: var(--step-1);
    margin-bottom: var(--space-l);
    color: var(--color-text-primary);
    opacity: 0.9; // Slightly less opacity than before for better contrast
  }

  .hero-buttons {
    display: flex;
    gap: var(--space-s);
    justify-content: center;
    margin-top: var(--space-l); // Increased margin-top

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: center;
    }
  }

  .btn {
    // Keep button styles
    display: inline-block;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    text-align: center;
    color: var(--color-text-primary);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    text-decoration: none;
    border: 1px solid transparent; // Add base border for layout consistency

    &.primary {
      background-color: var(--color-accent);
      color: white;
      border-color: var(--color-accent);

      &:hover {
        background-color: var(
          --color-accent-hover
        ); // Use defined hover variable
        text-decoration: none;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(var(--color-accent-rgb), 0.3); // Attempt using accent RGB - NEEDS TESTING if var(--color-accent-rgb) is defined elsewhere or if we need hardcoded value
      }
    }

    &.secondary {
      background-color: transparent;
      color: var(--color-accent);
      border: 1px solid var(--color-accent);

      &:hover {
        background-color: var(
          --color-accent-hover-bg
        ); // Use defined hover background variable
        text-decoration: none;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(var(--color-accent-rgb), 0.2); // Attempt using accent RGB - NEEDS TESTING
      }
    }
  }

  .about {
    min-height: auto; // Let content define height
    padding: var(--space-xl) var(--space-m);
    /* Remove background-color, ContentCards handle their own */
  }

  /* Target the intro card in the about section */
  .about-intro-block {
    h2 {
      font-size: var(--step-4);
      text-align: center;
      margin-bottom: var(--space-l);
      color: var(--color-accent);
    }
    .about-content p {
      margin-bottom: var(--space-m);
      font-size: var(--step-0); // Adjusted from step-1 for better fit
      line-height: 1.7; // Slightly increased line-height
    }
  }

  /* Keep the features grid layout */
  .features {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(280px, 1fr)
    ); // Slightly larger min size
    gap: var(--space-l); // Increased gap
    max-width: var(
      --wide-content-width
    ); // Use wide content width for the grid container
    margin: var(--space-xl) auto 0; // Add top margin, center grid
  }

  /* Target the feature cards */
  .feature-block {
    /* Styles previously in .feature are now handled by ContentCard defaults or here */
    /* Example: Add specific padding or border if needed */
    padding: var(--space-m);
    background-color: var(
      --color-surface
    ); // Explicitly set background for feature cards if needed
    border-radius: var(
      --radius-lg
    ); // Ensure feature cards have consistent radius

    h3 {
      color: var(--color-accent);
      margin-bottom: var(--space-s); // Adjusted margin
      font-size: var(--step-1); // Adjusted font size
    }

    p {
      font-size: var(--step-0);
      line-height: 1.6;
    }
  }

  /* Remove original .feature styles */
  /* .feature { ... } */

  /* Remove original .container styles from about section */
  /* .container { ... } */
</style>

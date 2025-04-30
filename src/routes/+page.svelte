<script lang="ts">
  import { onMount } from "svelte";
  // Removed animejs imports

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
  // Import the new AnimatedLogo component
  import AnimatedLogo from "$lib/components/ui/AnimatedLogo.svelte";
</script>

<section class="hero">
  <!-- Wrap hero content in a ContentCard -->
  <div class="hero-content-card">
    <div class="hero-content-inner">
      <!-- Branding Section -->
      <div class="hero-branding">
        <AnimatedLogo />
        <hr class="branding-separator" />
        <p class="tagline">
          Bringing Physics Learning into a New Dimension <br />
          Explore interactive 3D visualizations that bring kinematics to life.
        </p>
        <!-- SearchBar moved back to hero-actions -->
      </div>

      <!-- Actions Section -->
      <div class="hero-actions">
        <!-- Add the SearchBar component here -->
        <SearchBar
          placeholder="Search topics like 'vectors', 'kinematics', 'forces'..."
        />

        <div class="hero-buttons">
          <a
            href="/chapter/understanding-3d-space/coordinate-systems"
            class="btn primary">Begin Learning</a
          >
          <!-- Placeholder Sign In button -->
          <button class="btn secondary">Sign In</button>
          <!-- Using secondary style for now -->
        </div>
      </div>
    </div>
  </div>
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
    position: relative;
    overflow: hidden;
    padding: var(--space-xl) var(--space-m); // Changed from var(--space-xl) var(--space-m)
  }

  .hero-content-card {
    background-color: var(--color-accent);
    border: 2px solid var(--color-border-light);
    padding: var(--space-xl) var(--space-m); // Increased bottom padding to 60px
    margin-top: 0;
    max-width: 720px;
    margin-inline: 20px;
    width: 100%;
  }

  /* Styles for the inner content div - Now a single column */
  .hero-content-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 40px; // Keep overall gap for now
  }

  .hero-branding {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px; // Reduced gap between logo, separator, and tagline
    width: 100%;
  }

  .tagline {
    border-top: 1px solid var(--color-accent);
    width: 100%;
    padding: var(--space-s) 0;
  }

  .hero-content-card .tagline {
    /* Target tagline within the hero card */
    font-size: var(--step-0);
    margin-bottom: 0;
    color: var(--color-surface);
    opacity: 0.8;
    line-height: 1.5;
    max-width: 60ch; // Limit tagline width for readability
    width: 100%; // Ensure tagline takes full width up to max-width
  }

  .hero-actions {
    display: flex;
    flex-direction: column;
    gap: 30px; // Adjusted gap between search and buttons
    align-items: center; // Center items horizontally
    width: 100%; // Ensure actions container takes full width

    /* Removed media query for alignment */
  }

  /* Adjust SearchBar width and remove margin override */
  .hero-actions :global(.search-bar-wrapper) {
    width: 100%; /* Search bar takes full width of actions container */
    /* margin-bottom: 20px; // Removed, gap handled by parent flex */
  }

  .hero-buttons {
    display: flex;
    flex-wrap: wrap; // Allow buttons to wrap on smaller screens if needed
    gap: 20px;
    justify-content: center;
    margin-top: 0;
    width: 100%;

    /* Removed media query for column layout, flex-wrap handles responsiveness */
  }

  .btn {
    // Keep button styles
    display: inline-block;
    padding: 1rem 1.5rem; // Keep padding
    font-size: var(--step-0); // Ensure consistent button text size
    border-radius: 8px;
    text-align: center;
    color: var(--color-text-primary);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    text-decoration: none;
    border: 1px solid transparent; // Add base border for layout consistency
    white-space: nowrap; // Prevent buttons breaking line

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

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
  // Import the new AboutSection component
  import AboutSection from "$lib/components/layout/AboutSection.svelte";
  // Import the new Footer component
</script>

<div class="hero-container">
  <section class="hero">
    <!-- Wrap hero content in a ContentCard -->
    <div class="hero-content-card">
      <div class="hero-content-inner">
        <!-- Branding Section -->
        <div class="hero-branding">
          <AnimatedLogo />
          <p class="tagline">
            Where <span class="tagline-highlight">Physics</span> meets
            <span class="tagline-highlight">Fun</span>
            <br />
            Explore interactive 3D visualizations that bring kinematics to life.
          </p>
          <!-- SearchBar moved back to hero-actions -->
        </div>

        <!-- Actions Section -->
        <div class="hero-actions">
          <!-- Add the SearchBar component here -->
          <SearchBar />

          <div class="hero-buttons">
            <a
              href="/chapter/understanding-3d-space/coordinate-systems"
              class="btn primary">Begin Learning</a
            >
            <!-- Placeholder Sign In button -->
            <button class="btn secondary">Sign Up</button>
            <!-- Using secondary style for now -->
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
<AboutSection />

<style lang="scss">
  .hero-container {
    max-width: var(--max-content-width);
    margin-inline: auto;
    padding: 0;
  }

  .hero {
    min-height: 100vh; // Use min-height instead of height for flexibility
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    @media (max-width: 768px) {
    }
  }

  .hero-content-card {
    background-color: var(--color-background);
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
    font-size: var(--step-1);
    padding: var(--space-s) 0;
  }

  .tagline-highlight {
    color: var(--color-accent);
    font-weight: 600;
  }

  .hero-content-card .tagline {
    /* Target tagline within the hero card */
    font-size: var(--step-0);
    margin-bottom: 0;
    color: var(--color-text-primary);
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

  /* Target the feature cards */

  /* Remove original .feature styles */
  /* .feature { ... } */
</style>

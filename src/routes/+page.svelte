<script>
  // Scroll function for the About section
  function scrollToAbout() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

<section class="hero">
  <div class="hero-content">
    <h1>VistaKine</h1>
    <p class="tagline">An interactive 3D engineering textbook for learning kinematics and dynamics</p>

    <div class="hero-buttons">
      <a href="/chapter/chapter1" class="btn primary">Learn Now</a>
      <button class="btn secondary" on:click={scrollToAbout}>About VistaKine</button>
    </div>
  </div>
</section>

<section id="about" class="about">
  <div class="container">
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
    </div>

    <div class="features">
      <div class="feature">
        <h3>Interactive 3D Visualizations</h3>
        <p>Understand complex concepts through manipulable 3D models and simulations.</p>
      </div>

      <div class="feature">
        <h3>Physics-Based Simulations</h3>
        <p>Experiment with physical properties and see how systems respond in real-time.</p>
      </div>

      <div class="feature">
        <h3>Learn by Doing</h3>
        <p>Engage with the material through interactive examples and experiments.</p>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  .hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(135deg, var(--background-color) 0%, var(--sidebar-background) 100%);
  }

  .hero-content {
    max-width: 800px;
    padding: var(--space-m);

    h1 {
      font-size: var(--step-5);
      margin-bottom: var(--space-xs);
      color: var(--primary-color);
    }

    .tagline {
      font-size: var(--step-1);
      margin-bottom: var(--space-l);
      color: var(--text-color);
      opacity: 0.8;
    }
  }

  .hero-buttons {
    display: flex;
    gap: var(--space-s);
    justify-content: center;
    margin-top: var(--space-m);

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: center;
    }
  }

  .btn {
    display: inline-block;
    padding: var(--space-xs) var(--space-l);
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
    font-size: var(--step-0);
    text-decoration: none;

    &.primary {
      background-color: var(--primary-color);
      color: white;
      border: none;

      &:hover {
        background-color: darken(#3b82f6, 10%);
        text-decoration: none;
      }
    }

    &.secondary {
      background-color: transparent;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);

      &:hover {
        background-color: rgba(59, 130, 246, 0.1);
        text-decoration: none;
      }
    }
  }

  .about {
    min-height: 100vh;
    padding: var(--space-xl) var(--space-m);
    background-color: var(--background-color);

    h2 {
      font-size: var(--step-4);
      text-align: center;
      margin-bottom: var(--space-l);
      color: var(--primary-color);
    }

    .about-content {
      max-width: 800px;
      margin: 0 auto var(--space-xl);

      p {
        margin-bottom: var(--space-m);
        font-size: var(--step-1);
        line-height: 1.6;
      }
    }
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-m);
    max-width: 1200px;
    margin: 0 auto;
  }

  .feature {
    padding: var(--space-m);
    background-color: var(--sidebar-background);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

    h3 {
      color: var(--primary-color);
      margin-bottom: var(--space-xs);
      font-size: var(--step-2);
    }

    p {
      font-size: var(--step-0);
      line-height: 1.5;
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-m);
  }
</style>

<script lang="ts">
  import { currentSection } from '$lib/stores/appState';
  import { intersect } from '$lib/utils/intersection';
  import FormulaAccordion from '$lib/components/FormulaAccordion.svelte';
  import GuidedCalculation from '$lib/components/GuidedCalculation.svelte';
  import SectionReview from '$lib/components/SectionReview.svelte';
  import Quiz from '$lib/components/Quiz.svelte';
  import Scenario from '$lib/components/Scenario.svelte';
  import ChapterHeaderNav from '$lib/components/ChapterHeaderNav.svelte';
  import Katex from 'svelte-katex';
  import PageNav from '$lib/components/PageNav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  // Handle section intersection
  function handleSectionIntersect(event: any, sectionId: string) {
    if (event.detail.isIntersecting && event.detail.intersectionRatio > 0.3) {
      currentSection.set(sectionId);
    }
  }

  // Export the sections for this chapter
  export let chapterSections;
</script>

<div class="chapter-wrapper">
  <header class="chapter-header">
    <h1>Chapter 2: <br> Kinematics</h1>
    <p class="chapter-intro">
      This chapter introduces the fundamental concepts of kinematics, the study of motion without considering the causes of motion.
    </p>

    <!-- Add the optional header navigation -->
    <ChapterHeaderNav {chapterSections} />
  </header>

  <div class="page-content">
    <section
      id="displacement-velocity-acceleration"
      class="content-section section-header"
      data-section="2.1"
      use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
      on:intersect={(e) => handleSectionIntersect(e, 'displacement-velocity-acceleration')}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <h2 class="section-title">2.1 Displacement, Velocity, and Acceleration</h2>
        <div class="section-intro">
          <Scenario>
            <p><strong>Surya:</strong> I'm tracking a runner in a marathon. How do I describe how fast they're going?</p>
            <p><strong>Leo:</strong> We can use velocity and acceleration to describe both how fast they're running and if they're speeding up or slowing down.</p>
          </Scenario>

          <p>
            Displacement is the change in position, describing how far an object has moved from its starting point in a straight line.
          </p>
          <p>
            Velocity represents the rate of change of position (displacement) with respect to time, including both speed and direction.
          </p>
          <p>
            Acceleration is the rate of change of velocity with respect to time, indicating how quickly an object is speeding up, slowing down, or changing direction.
          </p>
        </div>

        <div class="section-core">
          <FormulaAccordion>
            <p class="formula-label">Displacement:</p>
            <Katex displayMode>{'\\textcolor{blue}{\\Delta x} = \\textcolor{red}{x_f} - \\textcolor{green}{x_i}'}</Katex>

            <p class="formula-label">Average Velocity:</p>
            <Katex displayMode>{'\\textcolor{blue}{v_{avg}} = \\frac{\\textcolor{purple}{\\Delta x}}{\\textcolor{green}{\\Delta t}}'}</Katex>

            <p class="formula-label">Average Acceleration:</p>
            <Katex displayMode>{'\\textcolor{blue}{a_{avg}} = \\frac{\\textcolor{purple}{\\Delta v}}{\\textcolor{green}{\\Delta t}}'}</Katex>
          </FormulaAccordion>

          <p>
            Understanding these concepts is crucial for analyzing motion in fields ranging from sports science to robotics.
          </p>
        </div>
      </div>
    </section>

    <section
      id="uniform-motion"
      class="content-section"
      data-section="2.2"
      use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
      on:intersect={(e) => handleSectionIntersect(e, 'uniform-motion')}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <h2 class="section-title">2.2 Uniform Motion</h2>

        <div class="section-intro">
          <Scenario>
            <p><strong>Surya:</strong> What's the difference between a car driving at a constant speed and one that's speeding up?</p>
            <p><strong>Leo:</strong> The car at constant speed has uniform motion - its position changes at a steady rate with zero acceleration.</p>
          </Scenario>

          <p>Uniform motion occurs when an object moves with constant velocity - maintaining the same speed and direction.</p>
        </div>

        <div class="section-core">
          <FormulaAccordion>
            <Katex displayMode>{'\\textcolor{blue}{x} = \\textcolor{green}{x_0} + \\textcolor{red}{v}\\textcolor{purple}{t}'}</Katex>
            <p>Where x is position, x₀ is initial position, v is velocity, and t is time.</p>
          </FormulaAccordion>

          <p>
            Examples of approximately uniform motion include a car on cruise control on a straight highway or a satellite in stable orbit.
          </p>
        </div>
      </div>
    </section>

    <section
      id="non-uniform-motion"
      class="content-section"
      data-section="2.3"
      use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
      on:intersect={(e) => handleSectionIntersect(e, 'non-uniform-motion')}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <h2 class="section-title">2.3 Non-Uniform Motion</h2>

        <div class="section-intro">
          <Scenario>
            <p><strong>Surya:</strong> How do I calculate how far a car will travel while braking to a stop?</p>
            <p><strong>Leo:</strong> That's non-uniform motion! We need to account for the changing velocity as the car slows down.</p>
          </Scenario>

          <p>
            Non-uniform motion occurs when an object's velocity changes over time, resulting in acceleration or deceleration.
          </p>
        </div>

        <div class="section-core">
          <FormulaAccordion>
            <p>For motion with constant acceleration:</p>
            <Katex displayMode>{'\\textcolor{blue}{v} = \\textcolor{green}{v_0} + \\textcolor{red}{a}\\textcolor{purple}{t}'}</Katex>
            <Katex displayMode>{'\\textcolor{blue}{x} = \\textcolor{green}{x_0} + \\textcolor{green}{v_0} \\textcolor{purple}{t} + \\frac{1}{2} \\textcolor{red}{a} \\textcolor{purple}{t^2}'}</Katex>
            <Katex displayMode>{'\\textcolor{blue}{v^2} = \\textcolor{green}{v_0^2} + 2\\textcolor{red}{a}(\\textcolor{blue}{x} - \\textcolor{green}{x_0})'}</Katex>
          </FormulaAccordion>

          <GuidedCalculation>
            <p>A car is traveling at 20 m/s when the driver applies the brakes, causing a constant deceleration of 5 m/s².</p>
            <form>
              <label>
                1. How long will it take for the car to stop?<br>
                t = <input type="number" name="stopTime"> s
              </label>
              <label>
                2. How far will the car travel before stopping?<br>
                d = <input type="number" name="stopDistance"> m
              </label>
            </form>
          </GuidedCalculation>
        </div>
      </div>
    </section>

    <section
      id="projectile-motion"
      class="content-section"
      data-section="2.4"
      use:intersect={{ threshold: [0.1, 0.3, 0.5] }}
      on:intersect={(e) => handleSectionIntersect(e, 'projectile-motion')}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <h2 class="section-title">2.4 Projectile Motion</h2>

        <div class="section-intro">
          <Scenario>
            <p><strong>Surya:</strong> In basketball, how can I predict where my shot will land?</p>
            <p><strong>Leo:</strong> That's projectile motion! We analyze horizontal and vertical components separately.</p>
          </Scenario>

          <p>
            Projectile motion is a type of two-dimensional motion where an object is projected into the air and moves under the influence of gravity.
          </p>
        </div>

        <div class="section-core">
          <FormulaAccordion>
            <Katex displayMode>{'\\textcolor{blue}{x} = \\textcolor{green}{x_0} + \\textcolor{red}{v_0} \\cos \\textcolor{orange}{\\theta} \\cdot \\textcolor{purple}{t}'}</Katex>
            <Katex displayMode>{'\\textcolor{blue}{y} = \\textcolor{green}{y_0} + \\textcolor{red}{v_0} \\sin \\textcolor{orange}{\\theta} \\cdot \\textcolor{purple}{t} - \\frac{1}{2} \\textcolor{teal}{g} \\textcolor{purple}{t^2}'}</Katex>
            <Katex displayMode>{'\\textcolor{blue}{h} = \\frac{(\\textcolor{red}{v_0} \\sin \\textcolor{orange}{\\theta})^2}{2\\textcolor{teal}{g}}'}</Katex>
            <Katex displayMode>{'\\textcolor{blue}{R} = \\frac{\\textcolor{red}{v_0^2} \\sin(2\\textcolor{orange}{\\theta})}{\\textcolor{teal}{g}}'}</Katex>
          </FormulaAccordion>

          <p>
            Examples include a basketball shot, a thrown baseball, or a long jump in athletics.
          </p>

          <SectionReview>
            <Quiz>
              <p>In projectile motion, the horizontal component of velocity:</p>
              <form>
                <label><input type="radio" name="q1" value="a"> Decreases over time</label>
                <label><input type="radio" name="q1" value="b"> Increases over time</label>
                <label><input type="radio" name="q1" value="c"> Remains constant (ignoring air resistance)</label>
              </form>
              <p>For maximum range, at what angle should a projectile be launched?</p>
              <form>
                <label><input type="radio" name="q2" value="a"> 30 degrees</label>
                <label><input type="radio" name="q2" value="b"> 45 degrees</label>
                <label><input type="radio" name="q2" value="c"> 60 degrees</label>
              </form>
            </Quiz>
          </SectionReview>
        </div>
      </div>
    </section>
  </div>
</div>


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
  function handleSectionIntersect(detail: { isIntersecting: boolean; intersectionRatio: number; }, sectionId: string) {
    if (detail.isIntersecting && detail.intersectionRatio > 0.3) {
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
    <!-- Section 2.1: Displacement & Velocity -->
    <section
      id="displacement-velocity"
      class="content-section section-header"
      data-section="2.1"
      use:intersect={{
        threshold: [0.1, 0.3, 0.5],
        onIntersect: (detail) => handleSectionIntersect(detail, 'displacement-velocity')
      }}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <h2 class="section-title">2.1 Displacement & Velocity</h2>
        <div class="section-intro">
          <Scenario>
            <p><strong>Surya:</strong> I'm tracking a runner in a marathon. How do I describe how fast they're going and where they are?</p>
            <p><strong>Leo:</strong> We can use displacement to pinpoint their position change and velocity to describe how fast they're running in a specific direction.</p>
          </Scenario>

          <p>
            <span class="keyword">Displacement</span> (<Katex>\Delta x</Katex>) is the change in position, describing how far an object has moved from its starting point in a straight line and in what direction. It's a vector quantity.
          </p>
          <p>
            <span class="keyword">Velocity</span> (<Katex>v</Katex>) represents the rate of change of position (displacement) with respect to time, including both speed and direction. It's also a vector.
          </p>
        </div>

        <div class="section-core">
          <FormulaAccordion>
            <p class="formula-label">Displacement:</p>
            <Katex displayMode>{'\\textcolor{blue}{\\Delta x} = \\textcolor{red}{x_f} - \\textcolor{green}{x_i}'}</Katex>
            <p class="description">Where Δx is displacement, x<sub>f</sub> is final position, and x<sub>i</sub> is initial position.</p>

            <p class="formula-label">Average Velocity:</p>
            <Katex displayMode>{'\\textcolor{blue}{v_{avg}} = \\frac{\\textcolor{purple}{\\Delta x}}{\\textcolor{green}{\\Delta t}}'}</Katex>
            <p class="description">Where v<sub>avg</sub> is average velocity, Δx is displacement, and Δt is the time interval.</p>
          </FormulaAccordion>
          <p>
            Understanding these is the first step to analyzing any motion.
          </p>
        </div>
      </div>
    </section>

    <!-- Section 2.2: Acceleration -->
    <section
      id="acceleration"
      class="content-section"
      data-section="2.2"
      use:intersect={{
        threshold: [0.1, 0.3, 0.5],
        onIntersect: (detail) => handleSectionIntersect(detail, 'acceleration')
      }}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <h2 class="section-title">2.2 Acceleration</h2>
        <div class="section-intro">
          <Scenario>
            <p><strong>Surya:</strong> What's the difference between a car driving at a constant speed and one that's speeding up or braking?</p>
            <p><strong>Leo:</strong> The difference is <span class="keyword">acceleration</span>! It measures how quickly the car's velocity is changing. Constant speed means zero acceleration.</p>
          </Scenario>
          <p>
            <span class="keyword">Acceleration</span> (<Katex>a</Katex>) is the rate of change of velocity with respect to time. It indicates how quickly an object is speeding up, slowing down (deceleration), or changing direction. Like velocity, it's a vector quantity.
          </p>
          <p>
            If acceleration is zero, the object moves with constant velocity (uniform motion). If acceleration is constant and non-zero, the object's velocity changes at a steady rate (uniformly accelerated motion).
          </p>
        </div>

        <div class="section-core">
          <FormulaAccordion>
            <p class="formula-label">Average Acceleration:</p>
            <Katex displayMode>{'\\textcolor{blue}{a_{avg}} = \\frac{\\textcolor{purple}{\\Delta v}}{\\textcolor{green}{\\Delta t}}'}</Katex>
            <p class="description">Where a<sub>avg</sub> is average acceleration, Δv is the change in velocity, and Δt is the time interval.</p>

            <p class="formula-label">Equations for Constant Acceleration:</p>
            <Katex displayMode>{'\\textcolor{blue}{v} = \\textcolor{green}{v_0} + \\textcolor{red}{a}\\textcolor{purple}{t}'}</Katex>
            <Katex displayMode>{'\\textcolor{blue}{x} = \\textcolor{green}{x_0} + \\textcolor{green}{v_0} \\textcolor{purple}{t} + \\frac{1}{2} \\textcolor{red}{a} \\textcolor{purple}{t^2}'}</Katex>
            <Katex displayMode>{'\\textcolor{blue}{v^2} = \\textcolor{green}{v_0^2} + 2\\textcolor{red}{a}(\\textcolor{blue}{x} - \\textcolor{green}{x_0})'}</Katex>
            <p class="description">Where v is final velocity, v<sub>0</sub> is initial velocity, a is constant acceleration, t is time, x is final position, and x<sub>0</sub> is initial position.</p>
          </FormulaAccordion>

          <GuidedCalculation>
            <p>A car is traveling at 20 m/s (<Katex>v_0</Katex>) when the driver applies the brakes, causing a constant deceleration of 5 m/s² (<Katex>a = -5 \, m/s^2</Katex>).</p>
            <form>
              <label>
                1. How long will it take for the car to stop (<Katex>v = 0</Katex>)? Use <Katex>v = v_0 + at</Katex>.<br>
                t = <input type="number" name="stopTime"> s
              </label>
              <label>
                2. How far will the car travel before stopping? Use <Katex>v^2 = v_0^2 + 2a(x - x_0)</Katex>, assuming <Katex>x_0 = 0</Katex>.<br>
                Distance (<Katex>x</Katex>) = <input type="number" name="stopDistance"> m
              </label>
            </form>
            <!-- Answers: t=4s, d=40m -->
          </GuidedCalculation>
        </div>
      </div>
    </section>

    <!-- Section 2.3: Projectile Motion -->
    <section
      id="projectile-motion"
      class="content-section"
      data-section="2.3"
      use:intersect={{
        threshold: [0.1, 0.3, 0.5],
        onIntersect: (detail) => handleSectionIntersect(detail, 'projectile-motion')
      }}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <h2 class="section-title">2.3 Projectile Motion</h2>
        <div class="section-intro">
          <Scenario>
            <p><strong>Surya:</strong> In basketball, how can I predict where my shot will land?</p>
            <p><strong>Leo:</strong> That's <span class="keyword">projectile motion</span>! We analyze the horizontal (constant velocity) and vertical (constant acceleration due to gravity) components separately.</p>
          </Scenario>
          <p>
            <span class="keyword">Projectile motion</span> is a type of two-dimensional motion where an object is projected into the air and moves under the influence of gravity alone (ignoring air resistance).
          </p>
        </div>

        <div class="section-core">
          <FormulaAccordion>
            <p class="description">Key equations, assuming launch from origin (x<sub>0</sub>=0, y<sub>0</sub>=0), initial velocity v<sub>0</sub> at angle θ to horizontal, and gravity g:</p>
            <p class="formula-label">Horizontal Position:</p>
            <Katex displayMode>{'\\textcolor{blue}{x} = (\\textcolor{red}{v_0} \\cos \\textcolor{orange}{\\theta}) \\textcolor{purple}{t}'}</Katex>
            <p class="formula-label">Vertical Position:</p>
            <Katex displayMode>{'\\textcolor{blue}{y} = (\\textcolor{red}{v_0} \\sin \\textcolor{orange}{\\theta}) \\textcolor{purple}{t} - \\frac{1}{2} \\textcolor{teal}{g} \\textcolor{purple}{t^2}'}</Katex>
            <p class="formula-label">Maximum Height:</p>
            <Katex displayMode>{'\\textcolor{blue}{h} = \\frac{(\\textcolor{red}{v_0} \\sin \\textcolor{orange}{\\theta})^2}{2\\textcolor{teal}{g}}'}</Katex>
            <p class="formula-label">Range (Horizontal Distance):</p>
            <Katex displayMode>{'\\textcolor{blue}{R} = \\frac{\\textcolor{red}{v_0^2} \\sin(2\\textcolor{orange}{\\theta})}{\\textcolor{teal}{g}}'}</Katex>
          </FormulaAccordion>

          <p>
            Examples include a basketball shot, a thrown baseball, or a long jump in athletics. Maximum range is achieved at a launch angle of 45°.
          </p>

          <SectionReview>
            <Quiz>
              <p>In projectile motion (ignoring air resistance), the horizontal component of velocity:</p>
              <form>
                <label><input type="radio" name="q1" value="a"> Decreases over time due to gravity</label>
                <label><input type="radio" name="q1" value="b"> Increases over time</label>
                <label><input type="radio" name="q1" value="c" checked> Remains constant</label>
              </form>
              <p>For maximum horizontal range on level ground, at what angle should a projectile ideally be launched?</p>
              <form>
                <label><input type="radio" name="q2" value="a"> 30 degrees</label>
                <label><input type="radio" name="q2" value="b" checked> 45 degrees</label>
                <label><input type="radio" name="q2" value="c"> 60 degrees</label>
              </form>
            </Quiz>
          </SectionReview>
        </div>
      </div>
    </section>

    <!-- Section 2.4: Relative Motion -->
    <section
      id="relative-motion"
      class="content-section"
      data-section="2.4"
      use:intersect={{
        threshold: [0.1, 0.3, 0.5],
        onIntersect: (detail) => handleSectionIntersect(detail, 'relative-motion')
      }}
    >
      <div class="section-line" aria-hidden="true"></div>
      <div class="readable-content">
        <h2 class="section-title">2.4 Relative Motion</h2>
        <div class="section-intro">
          <Scenario>
             <p><strong>Surya:</strong> If I'm walking forward on a moving train, how fast am I moving relative to someone standing on the ground?</p>
             <p><strong>Leo:</strong> Your velocity relative to the ground is the sum of your velocity relative to the train and the train's velocity relative to the ground! That's <span class="keyword">relative motion</span>.</p>
          </Scenario>
          <p>
            Motion is always described relative to a <span class="keyword">frame of reference</span>. <span class="keyword">Relative motion</span> analysis helps us understand how the motion of an object appears from different viewpoints (different reference frames).
          </p>
        </div>
        <div class="section-core">
          <FormulaAccordion>
            <p class="formula-label">Relative Velocity (1D):</p>
            <Katex displayMode>{'\\vec{v}_{P/A} = \\vec{v}_{P/B} + \\vec{v}_{B/A}'}</Katex>
            <p class="description">The velocity of P relative to frame A (v<sub>P/A</sub>) is the vector sum of the velocity of P relative to frame B (v<sub>P/B</sub>) and the velocity of frame B relative to frame A (v<sub>B/A</sub>).</p>
            <p class="description">Note: v<sub>A/B</sub> = -v<sub>B/A</sub></p>
          </FormulaAccordion>
          <p>
             This concept is crucial in navigation (e.g., airplanes dealing with wind) and understanding observations in physics.
          </p>
          <!-- Add GuidedCalculation or Quiz for Relative Motion later -->
        </div>
         <!-- Add SectionReview for Relative Motion later -->
      </div>
    </section>
  </div>
</div>

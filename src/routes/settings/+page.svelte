<script lang="ts">
  import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";
  import {
    performanceSetting,
    type PerformanceSetting,
  } from "$lib/stores/performanceStore";

  let currentSetting: PerformanceSetting;
  const unsubscribe = performanceSetting.subscribe((value) => {
    currentSetting = value;
  });

  // Ensure unsubscription on component destroy if this script block were in a component context
  // However, for a +page.svelte, this manual unsubscribe might be less critical than in a reusable component,
  // but good practice if state were more complex or if navigation didn't fully destroy/recreate.
  // import { onDestroy } from 'svelte';
  // onDestroy(unsubscribe);

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    performanceSetting.set(target.value as PerformanceSetting);
  }
</script>

<div class="settings-container">
  <h1>Settings</h1>
  <div class="settings-content">
    <section class="setting-group">
      <h2>Visual Performance</h2>
      <p>Adjust visual quality to optimize performance for your hardware.</p>
      <div class="radio-group">
        <label>
          <input
            type="radio"
            name="performance"
            value="low"
            bind:group={currentSetting}
            on:change={handleChange}
          />
          Low (Best Performance)
        </label>
        <label>
          <input
            type="radio"
            name="performance"
            value="medium"
            bind:group={currentSetting}
            on:change={handleChange}
          />
          Medium (Balanced)
        </label>
        <label>
          <input
            type="radio"
            name="performance"
            value="high"
            bind:group={currentSetting}
            on:change={handleChange}
          />
          High (Best Visuals)
        </label>
      </div>
      <p
        style="margin-top: var(--space-xs); font-size: var(--step--1); color: var(--color-text-secondary);"
      >
        Current selection: {currentSetting}
      </p>
    </section>

    <hr class="divider" />

    <section class="setting-group">
      <h2>Theme</h2>
      <ThemeSwitcher />
    </section>
  </div>
</div>

<style lang="scss">
  .settings-container {
    padding: var(--space-m);
    max-width: 800px;
    margin: var(--space-l) auto; // Added top/bottom margin
  }

  h1 {
    color: var(--color-accent);
    margin-bottom: var(--space-m);
    font-size: var(--step-3);
  }

  .settings-content {
    background: var(
      --color-surface
    ); // Changed from --card-background to --color-surface as per variables
    padding: var(--space-l);
    border-radius: var(--radius-lg); // Slightly larger radius
    box-shadow: var(--shadow-md); // Slightly more prominent shadow
  }

  .setting-group {
    margin-bottom: var(--space-xl);
    &:last-child {
      margin-bottom: 0;
    }
  }

  h2 {
    font-size: var(--step-1);
    color: var(--color-text-primary);
    margin-bottom: var(--space-s);
    border-bottom: 1px solid var(--color-border-light);
    padding-bottom: var(--space-xs);
  }

  .radio-group {
    display: flex;
    flex-direction: column; // Stack radio buttons vertically
    gap: var(--space-s);

    label {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--step-0);
      cursor: pointer;
      padding: var(--space-xs) var(--space-s);
      border-radius: var(--radius-md);
      transition: background-color var(--transition-fast)
        var(--transition-bezier);

      &:hover {
        background-color: var(--color-accent-hover-bg);
      }

      input[type="radio"] {
        accent-color: var(--color-accent);
        width: 1.2em;
        height: 1.2em;
      }
    }
  }

  .divider {
    border: none;
    border-top: 1px solid var(--color-border-light);
    margin: var(--space-xl) 0;
  }
</style>

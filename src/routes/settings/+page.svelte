<script>
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  // Settings page logic will go here
</script>

<div class="settings-container">
  <h1>Settings</h1>
  <div class="settings-content">
    <p>Settings page content will go here.</p>
  </div>
</div>

<ThemeSwitcher />

<style lang="scss">
  .settings-container {
    padding: var(--space-m);
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: var(--primary-color);
    margin-bottom: var(--space-m);
  }

  .settings-content {
    background: var(--card-background);
    padding: var(--space-m);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
  }
</style>
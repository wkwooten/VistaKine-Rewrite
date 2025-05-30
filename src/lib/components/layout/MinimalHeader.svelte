<script lang="ts">
  // No props needed for this version

  import AuthWidget from "../auth/AuthWidget.svelte";
</script>

<header class="minimal-header-container">
  <AuthWidget />
  <!-- Future: Could add a very subtle user icon or link here -->
</header>

<style lang="scss">
  @use "$lib/styles/variables" as vars;

  .minimal-header-container {
    display: flex;
    align-items: center;
    justify-content: end;
    background-color: var(--color-background); // Standard background
    border-bottom: 1px solid var(--color-border); // Standard border
    box-sizing: border-box;
    width: 100%;
    /* margin-left: var(--sidebar-collapsed-width); */
    padding-left: var(--sidebar-collapsed-width);
    height: vars.$navbar-height;

    @media (max-width: vars.$breakpoint-lg) {
      margin-left: 0;
    }
  }

  .logo {
    font-size: var(--step-1); // Utopia typography scale
    font-weight: 700;
    color: var(
      --color-text-logo,
      var(--color-accent)
    ); // Use a logo-specific color or fallback to accent
    text-decoration: none;
    font-family: var(
      --font-family-display,
      var(--font-family-heading, sans-serif)
    ); // Prefer display or heading font

    &:hover {
      color: var(
        --color-text-logo-hover,
        var(--color-accent-hover)
      ); // Hover color
    }
  }
</style>

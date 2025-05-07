<script>
  function setTheme(themeName) {
    document.documentElement.className = ""; // Remove existing theme classes
    if (themeName) {
      document.documentElement.classList.add(`theme-${themeName}`);
      localStorage.setItem("vistakine-theme", themeName); // Save to localStorage
    } else {
      localStorage.removeItem("vistakine-theme");
    }
  }

  // On component mount, check for a saved theme:
  import { onMount } from "svelte";

  onMount(() => {
    const savedTheme = localStorage.getItem("vistakine-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  });

  // Available themes (you can expand this)
  const themes = [
    { name: "Blueprint (light)", value: "blueprint (light)" }, // default theme
    { name: "Blueprint (dark)", value: "blueprint (dark)" },
    { name: "Engineering paper (light)", value: "engineering paper (light)" },
    { name: "Chalkboard (dark)", value: "chalkboard" },
    // Add more themes here
  ];
</script>

<div class="theme-switcher">
  <label for="theme-select">Select Theme:</label>
  <select
    id="theme-select"
    on:change={(event) => setTheme(event.currentTarget.value)}
  >
    {#each themes as theme}
      <option value={theme.value}>{theme.name}</option>
    {/each}
  </select>
</div>

<style>
  /*Basic styling for readability*/
  .theme-switcher {
    margin-bottom: 1rem;
  }
</style>

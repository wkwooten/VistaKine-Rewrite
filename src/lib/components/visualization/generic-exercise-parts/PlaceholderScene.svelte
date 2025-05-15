<script lang="ts">
  // Placeholder Scene
  let { text = "Placeholder Scene" } = $props<{ text?: string }>();
</script>

<div class="placeholder-scene">
  <p>{text}</p>
</div>

<style>
  .placeholder-scene {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    border: 1px dashed #ccc;
    color: #777;
    font-family: sans-serif;
  }
</style>

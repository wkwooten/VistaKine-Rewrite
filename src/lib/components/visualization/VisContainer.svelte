<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { World } from "@threlte/rapier";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import RendererSetup from "./helpers/RendererSetup.svelte";

  interface $$Props extends HTMLAttributes<HTMLDivElement> {
    isComplete?: boolean;
    resetKey?: any;
    isFullscreen?: boolean;
    withPhysics?: boolean;
    children?: Snippet<[]>; // Typed children for the default slot
  }

  let {
    isComplete = false,
    resetKey = 0,
    isFullscreen = false,
    withPhysics = false,
    children, // Destructure children from props
    ...restProps
  }: $$Props = $props();

  // State variables that were bound but not used in script can be removed if not needed elsewhere
  let width = $state(0);
  let height = $state(0);
  let containerElement: HTMLDivElement;
</script>

<div
  bind:this={containerElement}
  class="vis-container-wrapper"
  class:complete={isComplete}
  bind:clientWidth={width}
  bind:clientHeight={height}
  {...restProps}
>
  {#key resetKey}
    <Canvas>
      <RendererSetup />
      {#if withPhysics}
        <World>
          {#if children}
            {@render children()}
          {/if}
        </World>
      {:else if children}
        {@render children()}
      {/if}
    </Canvas>
  {/key}
</div>

<style lang="scss">
  .vis-container-wrapper {
    width: 100%;
    height: 100%;
    min-height: 300px;
    border: 1px solid var(--color-border);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--radius-sm);
    aspect-ratio: 16/9;
    transition: border-color 0.5s ease;
    overflow: hidden;
    background-color: var(--color-background);

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .vis-container-wrapper.complete {
    border: 3px solid var(--color-accent, mediumseagreen);
    box-shadow: 0 0 10px var(--color-accent-light, lightgreen);
  }
</style>

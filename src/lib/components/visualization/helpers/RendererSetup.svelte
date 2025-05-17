<script lang="ts">
  import { useThrelte } from "@threlte/core";
  import { onMount } from "svelte";
  import {
    ACESFilmicToneMapping,
    PCFSoftShadowMap,
    NoToneMapping,
  } from "three";
  import {
    performanceSetting,
    type PerformanceSetting,
  } from "$lib/stores/performanceStore";

  const { renderer } = useThrelte();
  let currentPerformance: PerformanceSetting;

  const unsubscribe = performanceSetting.subscribe((value) => {
    currentPerformance = value;
    if (renderer) applySettings(currentPerformance);
  });

  function applySettings(setting: PerformanceSetting) {
    if (!renderer) return;

    console.log(`Applying performance setting: ${setting}`);
    renderer.toneMapping = NoToneMapping;

    if (setting === "low") {
      renderer.shadowMap.enabled = false;
      console.log("Shadows disabled for low setting.");
    } else {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFSoftShadowMap;
      console.log("PCFSoftShadowMap enabled for medium/high setting.");
    }
  }

  onMount(() => {
    if (renderer) {
      applySettings(currentPerformance);
    } else {
      console.error("Renderer context not available in RendererSetup onMount");
    }
    return () => {
      unsubscribe();
    };
  });
</script>

<!-- This component renders nothing visually -->

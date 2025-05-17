<script lang="ts">
  import { T } from "@threlte/core";
  import { AutoColliders, RigidBody } from "@threlte/rapier";
  import { surfaceColor } from "$lib/stores/themeColors";
  // RadialGradientTexture is no longer needed
  // import { RadialGradientTexture, type GradientStop } from '@threlte/extras'
  // Remove onMount as it's no longer needed
  // import { onMount } from 'svelte'

  // Remove local state, color will come from the store
  // let stop1Color = $state('#e0e0e0'); // Default light ground center
  // stop2Color is no longer needed for flat color
  // let stop2Color = $state('#A9A9A9');

  // Remove onMount logic for fetching CSS variables
  /*
  onMount(() => {
    console.log('[Ground.svelte] Mounting, fetching colors...');
    const computedStyle = getComputedStyle(document.documentElement);

    // Fetch scene ground color for center
    const fetchedStop1 = computedStyle.getPropertyValue('--scene-ground-color').trim();
    console.log('[Ground.svelte] Fetched --scene-ground-color:', fetchedStop1);
    // stop1Color = fetchedStop1 || stop1Color; // No longer used

    // Fetch scene ground gradient edge color for edge (no longer needed for this material)
    // const fetchedStop2 = computedStyle.getPropertyValue('--scene-ground-gradient-edge-color').trim();
    // console.log('[Ground.svelte] Fetched --scene-ground-gradient-edge-color:', fetchedStop2);
    // stop2Color = fetchedStop2 || stop2Color;

    console.log('[Ground.svelte] Final color set - now using surfaceColor');
  });
  */
</script>

<RigidBody type="fixed">
  <T.Group position={[0, -0.5, 0]}>
    <AutoColliders shape={"cuboid"}>
      <T.Mesh receiveShadow>
        <T.BoxGeometry args={[5000, 0.95, 5000]} />
        <T.MeshStandardMaterial color={$surfaceColor} />
      </T.Mesh>
    </AutoColliders>
  </T.Group>
</RigidBody>

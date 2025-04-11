<script lang="ts">
  import { T } from '@threlte/core'
  import { AutoColliders, RigidBody } from '@threlte/rapier'
  // RadialGradientTexture is no longer needed
  // import { RadialGradientTexture, type GradientStop } from '@threlte/extras'
  import { onMount } from 'svelte'

  let stop1Color = $state('#e0e0e0'); // Default light ground center
  // stop2Color is no longer needed for flat color
  // let stop2Color = $state('#A9A9A9');

  onMount(() => {
    console.log('[Ground.svelte] Mounting, fetching colors...');
    const computedStyle = getComputedStyle(document.documentElement);

    // Fetch scene ground color for center
    const fetchedStop1 = computedStyle.getPropertyValue('--scene-ground-color').trim();
    console.log('[Ground.svelte] Fetched --scene-ground-color:', fetchedStop1);
    stop1Color = fetchedStop1 || stop1Color;

    // Fetch scene ground gradient edge color for edge (no longer needed for this material)
    // const fetchedStop2 = computedStyle.getPropertyValue('--scene-ground-gradient-edge-color').trim();
    // console.log('[Ground.svelte] Fetched --scene-ground-gradient-edge-color:', fetchedStop2);
    // stop2Color = fetchedStop2 || stop2Color;

    console.log('[Ground.svelte] Final color set:', stop1Color);
  });

</script>

<RigidBody type="fixed">
  <T.Group position={[0, -.5, 0]}>
    <AutoColliders shape={'cuboid'}>
      <T.Mesh receiveShadow>
        <T.BoxGeometry args={[5000, .95, 5000]} />
        <T.MeshBasicMaterial color={stop1Color} />
      </T.Mesh>
    </AutoColliders>
  </T.Group>
</RigidBody>

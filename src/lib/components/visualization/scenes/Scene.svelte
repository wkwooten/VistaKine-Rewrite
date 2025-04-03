<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { Environment, Grid, OrbitControls, SoftShadows, TransformControls } from '@threlte/extras'
  // Import the actual OrbitControls type from Three.js
  import type { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  // Import the dragging store
  import { isDragging } from '$lib/stores/draggingStore';
  // Import and initialize interactivity
  import { interactivity } from '@threlte/extras'
  interactivity()

  // import { Debug } from '@threlte/rapier'
  import Ground from '../elements/constructs/Ground.svelte'
	import Box from '../elements/constructs/Box.svelte'
  import { Vector3, Group } from 'three'
  // Removed SvelteComponent import and component ref variable
  // import type { SvelteComponent } from 'svelte'
  // let controlsComponentRef: SvelteComponent | undefined = undefined;
  // Removed incorrect imports
  // import { onBeforeRender } from '@threlte/core'
  // import { ref } from 'vue';

  // Prop to receive the control mode from the parent
  export let controlMode: 'drag' | 'translate' = 'drag';

  // State to hold the reference to the Box's group
  let boxGroupRef: Group | undefined = undefined;

  // Define your bounding box
  const minX = -100; // Example bounds, adjust as needed
  const maxX = 100;
  const minY = 5;
  const maxY = 50;
  const minZ = -100;
  const maxZ = 100;

  let controls: ThreeOrbitControls | undefined = undefined; // Use the correct Three.js type

  useTask((delta) => { // Corrected useTask call, added delta parameter
    if (!controls) return; // Check controls directly

    const camera = controls.object; // Access camera via controls.object

    // Clamp the camera position within the bounding box
    camera.position.x = Math.max(minX, Math.min(maxX, camera.position.x));
    camera.position.y = Math.max(minY, Math.min(maxY, camera.position.y));
    camera.position.z = Math.max(minZ, Math.min(maxZ, camera.position.z));

    // Clamp target position
    controls.target.x = Math.max(minX, Math.min(maxX, controls.target.x));
    controls.target.y = Math.max(minY, Math.min(maxY, controls.target.y));
    controls.target.z = Math.max(minZ, Math.min(maxZ, controls.target.z));

  }); // Removed incorrect options object

</script>

<T.PerspectiveCamera
  makeDefault
  position={[0, 2, 10]}
>
	<OrbitControls
    enableZoom={true}
    bind:ref={controls}
    enabled={!$isDragging}
    maxPolarAngle={Math.PI / 2}
  />
</T.PerspectiveCamera>

<!-- Remove Sky Component -->
<!-- <Sky /> -->

<!-- Add Fog -->
<T.Fog
  color={'#f0f8ff'}
  near={10}
  far={50}
/>

<T.AmbientLight intensity={1} />

<T.DirectionalLight
  castShadow
  position={[8, 20, -3]}
/>
<!--
<T.GridHelper args={[1000]} /> -->
<!-- infiniteGrid={true} -->

<Grid
  position.y={0.01}
  infiniteGrid={true}
  fadeOrigin={new Vector3(0, 0, 0)}
  sectionsSize={10}
  sectionThickness={1}
  cellColor='#ADD8E6'
  sectionColor='#64B5F6'
  fadeDistance={150}
/>

<Ground />
<!-- No need to pass controls prop -->

<Box bind:groupRef={boxGroupRef} {controlMode} />

{#if boxGroupRef}
	<TransformControls
		object={boxGroupRef}
		mode={'translate'}
		enabled={controlMode === 'translate'}
	/>
{/if}
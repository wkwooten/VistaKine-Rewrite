<script lang="ts">
  import { T } from '@threlte/core'
  import { Environment, Grid, OrbitControls, SoftShadows, transitions } from '@threlte/extras'
  // Import and initialize interactivity
  import { interactivity } from '@threlte/extras'
  interactivity()

  // import { Debug } from '@threlte/rapier'
  import Ground from '../elements/constructs/Ground.svelte'
	import Box from '../elements/constructs/Box.svelte'
  import { Vector3 } from 'three'
  // Removed SvelteComponent import and component ref variable
  // import type { SvelteComponent } from 'svelte'
  // let controlsComponentRef: SvelteComponent | undefined = undefined;

</script>

<T.PerspectiveCamera
  makeDefault
  position={[0, 2, 10]}
>

	<!-- <OrbitControls enableZoom={true} /> -->
</T.PerspectiveCamera>

<T.AmbientLight intensity={1} />

<T.DirectionalLight
  castShadow
  position={[8, 20, -3]}
/>

<!-- <T.GridHelper args={[100]} /> -->

<Grid
  gridSize={[100,100]}
  fadeDistance={100}
  fadeOrigin={new Vector3(0,0,0)}
  sectionsSize={10}
  sectionThickness={1}
  cellColor='#64B5F6'
  sectionColor='#64B5F6'
  />

<Ground />
<!-- No need to pass controls prop -->
<Box />

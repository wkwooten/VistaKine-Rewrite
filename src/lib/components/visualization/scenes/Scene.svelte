<script lang="ts">
  import { T } from '@threlte/core'
  import { OrbitControls, AudioListener } from '@threlte/extras'
  // import { Debug } from '@threlte/rapier'
  import Ground from '../elements/constructs/Ground.svelte'
	import Box from '../elements/constructs/Box.svelte'
</script>

<T.PerspectiveCamera
  makeDefault
  position={[10, 10, 10]}
>
  <AudioListener />
	<OrbitControls enableZoom={true} />
</T.PerspectiveCamera>

<T.DirectionalLight
  castShadow
  position={[8, 20, -3]}
/>

<T.GridHelper args={[50]} />

<Ground />
<Box />

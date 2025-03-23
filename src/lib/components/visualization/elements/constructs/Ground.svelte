<script lang="ts">
  import { T } from '@threlte/core'
  import { AutoColliders } from '@threlte/rapier'
	import { interactivity, useCursor } from '@threlte/extras'

	interactivity()

</script>

<T.Group position={[0, -0.5, 0]}>
	onpointerenter={() => {
    useCursor('grab')
  }}
  <AutoColliders shape={'cuboid'}>
    <T.Mesh receiveShadow >
      <T.BoxGeometry args={[10, 1, 10]} />
      <T.MeshStandardMaterial />
    </T.Mesh>
  </AutoColliders>
</T.Group>

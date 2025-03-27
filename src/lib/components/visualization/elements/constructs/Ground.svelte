<script lang="ts">
  import { T } from '@threlte/core'
  import { AutoColliders, RigidBody } from '@threlte/rapier'

</script>

<RigidBody type="fixed" position={[0, -0.5, 0]}>
	<AutoColliders shape={'cuboid'}>
		<T.Mesh receiveShadow position={[0, 0, 0]}>
			<T.BoxGeometry args={[50, 1, 50]} />
			<T.MeshStandardMaterial color={'#ffffff'} />
		</T.Mesh>
	</AutoColliders>
</RigidBody>

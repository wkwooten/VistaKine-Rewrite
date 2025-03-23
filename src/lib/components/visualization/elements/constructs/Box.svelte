<script lang="ts">
  import { T } from '@threlte/core'
  import { AutoColliders, RigidBody } from '@threlte/rapier'
</script>

<T.Group position={[0, 5, 0]}>
  <RigidBody>
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[1, 1, 1]} />
				<T.MeshStandardMaterial />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<script lang="ts">
	import { T } from '@threlte/core'
	import { AutoColliders, RigidBody } from '@threlte/rapier'
	// Import type for RigidBody instance
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat'

	// Props for visual state driven by Scene.svelte
	export let color: string = '#ffffff' // Default color
	export let scale: number = 1       // Default scale

	// Prop to bind and expose the RigidBody instance
	export let rigidBodyRef: RapierRigidBody | undefined = undefined;

	// Define initial position
	const initialPosition = [0, 2, 0]; // Start slightly above ground
</script>

<!-- Remove the outer T.Group -->
<!-- <T.Group position={[0, 5, 0]}> -->
	<!-- Add position prop and bind:rigidBody -->
	<RigidBody bind:rigidBody={rigidBodyRef} position={initialPosition}>
		<AutoColliders shape={'cuboid'}>
			<!-- Apply scale prop -->
			<T.Mesh receiveShadow {scale}>
				<T.BoxGeometry args={[1, 1, 1]} />
				<!-- Apply color prop -->
				<T.MeshStandardMaterial color={color} />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
<!-- </T.Group> -->
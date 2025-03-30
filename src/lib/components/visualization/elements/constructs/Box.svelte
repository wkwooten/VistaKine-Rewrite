<script lang="ts">
	import { T } from '@threlte/core'
	import { AutoColliders, RigidBody } from '@threlte/rapier'
	import { Edges } from '@threlte/extras'
	// Import type for RigidBody instance
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat'
	import { onMount } from 'svelte'
	export let color: string = '#ffffff'
	export let scale: number = 1

	// Prop to bind and expose the RigidBody instance
	export let rigidBodyRef: RapierRigidBody | undefined = undefined;

	onMount(() => {
    const computedStyle = getComputedStyle(document.documentElement)
    color = computedStyle.getPropertyValue('--sidebar-border-color').trim() || color
  })

	// Define initial position
	const initialPosition = [0, 0, 0]; // Start slightly above ground
</script>

<!-- Remove the outer T.Group -->
<!-- <T.Group position={[0, 5, 0]}> -->
	<!-- Add position prop and bind:rigidBody -->
	<RigidBody bind:rigidBody={rigidBodyRef}>
		<AutoColliders shape={'cuboid'}>
			<!-- Apply scale prop -->
			<T.Mesh receiveShadow {scale}>
				<T.BoxGeometry args={[1, 1, 1]} />
				<T.MeshBasicMaterial color={color} />
				<Edges color="black" />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
<!-- </T.Group> -->
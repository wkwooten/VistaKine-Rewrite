<script lang="ts">
	import { T, useThrelte } from '@threlte/core'
	import { AutoColliders, RigidBody } from '@threlte/rapier' // Restored physics
	import { Edges } from '@threlte/extras' // Remove useControlsContext import
	// Import type for RigidBody instance and the RigidBodyType enum
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat' // Restored physics
	import { RigidBodyType } from '@dimforge/rapier3d-compat' // Restored physics
	import { onMount, onDestroy } from 'svelte'
	import { Vector3, Plane, Raycaster, Vector2 } from 'three'
	// Removed SvelteComponent import
	// import type { SvelteComponent } from 'svelte'

	export let color: string = '#ffffff'
	export let scale: number = 1

	// Prop to bind and expose the RigidBody instance
	export let rigidBodyRef: RapierRigidBody | undefined = undefined // Restored physics
	// Removed controlsComponentRef prop
	// export let controlsComponentRef: SvelteComponent | undefined = undefined;

	const { camera, renderer, invalidate, scene } = useThrelte()
	// Removed orbitControlsStore
	// const orbitControlsStore = useThrelteUserContext('orbit-controls');

	// State for dragging
	let isDragging = false
	const dragPlane = new Plane()
	const dragOffset = new Vector3()
	let originalBodyType: RigidBodyType | undefined = undefined // Restored physics

	onMount(() => {
		const computedStyle = getComputedStyle(document.documentElement)
		color = computedStyle.getPropertyValue('--sidebar-border-color').trim() || color
	})

	onDestroy(() => {
		window.removeEventListener('pointermove', handlePointerMove)
		window.removeEventListener('pointerup', handlePointerUp)
	})


	// Handler for pointer down using interactivity prop
	const handlePointerDownProp = (event: any) => {
		// console.log('Box Pointer Down (interactivity prop)', event); // Keep commented unless needed

		// Removed controls check log
		// const controls = $orbitControlsStore;
		// console.log('--> OrbitControls from user context [orbit-controls]:', controls);

		if (!rigidBodyRef || !event.object || !event.point || !camera.current) {
			console.log('--> Drag start condition not met');
			return;
		}

		console.log('--> Starting Drag');
		isDragging = true
		originalBodyType = rigidBodyRef.bodyType()
		console.log(`--> Changing body type to Kinematic. Original: ${originalBodyType}`);
		rigidBodyRef.setBodyType(RigidBodyType.KinematicPositionBased, true)
		rigidBodyRef.setLinvel({ x: 0, y: 0, z: 0 }, true)
		rigidBodyRef.setAngvel({ x: 0, y: 0, z: 0 }, true)

		const intersectionPoint = event.point
		const currentPosition = new Vector3().copy(rigidBodyRef.translation() as Vector3)

		// --- Calculate Camera-Facing Drag Plane ---
		const cameraPosition = camera.current.position;
		const cameraDirection = new Vector3();
		camera.current.getWorldDirection(cameraDirection); // Get the direction camera is looking
		const initialDistance = cameraPosition.distanceTo(intersectionPoint);

		// Set plane normal to camera direction, positioned at initial distance
		dragPlane.setFromNormalAndCoplanarPoint(cameraDirection, intersectionPoint);
		// OR use distance (often more stable if camera moves/rotates during drag?)
		// dragPlane.set(cameraDirection, -initialDistance);
		// dragPlane.translate(cameraPosition); // Translate plane to camera position
		console.log('--> Using camera-facing drag plane'); // DEBUG
		// --- End Plane Calculation ---

		const intersectionOnPlane = new Vector3()
		if (event.ray) {
			event.ray.intersectPlane(dragPlane, intersectionOnPlane)
		} else {
			console.warn("Ray not available on event for offset calculation.");
			intersectionOnPlane.copy(intersectionPoint);
		}
		dragOffset.copy(intersectionOnPlane).sub(currentPosition)
		console.log(`--> Calculated Offset: ${dragOffset.x.toFixed(2)}, ${dragOffset.y.toFixed(2)}, ${dragOffset.z.toFixed(2)}`);

		// Removed OrbitControls disable logic
		/*
		if (controls) {
			console.log('--> Disabling OrbitControls via user context');
			controls.enabled = false
		} else {
			console.log('--> OrbitControls from user context was undefined, cannot disable');
		}
		*/
		renderer.domElement.style.cursor = 'grabbing'

		window.addEventListener('pointermove', handlePointerMove)
		window.addEventListener('pointerup', handlePointerUp, { once: true })
	}

	// Handler for pointer move (global listener)
	const handlePointerMove = (event: PointerEvent) => {
		if (!isDragging || !camera.current || !rigidBodyRef) return

		const { width, height, left, top } = renderer.domElement.getBoundingClientRect();
		const x = ((event.clientX - left) / width) * 2 - 1;
		const y = -((event.clientY - top) / height) * 2 + 1;
		const pointerCoordsVec2 = new Vector2(x, y);

		const raycaster = new Raycaster()
		raycaster.setFromCamera(pointerCoordsVec2, camera.current)

		const intersectionPoint = new Vector3()
		if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
			const newPosition = intersectionPoint.sub(dragOffset)

			// --- Clamp Y position to prevent going through ground ---
			const halfHeight = scale / 2;
			newPosition.y = Math.max(newPosition.y, halfHeight);
			// --- End Clamping ---

			console.log(`--> New Position Calculated (Clamped): ${newPosition.x.toFixed(2)}, ${newPosition.y.toFixed(2)}, ${newPosition.z.toFixed(2)}`); // Updated log
			rigidBodyRef.setNextKinematicTranslation(newPosition)

			invalidate()
		}
	}

	// Handler for pointer up (global listener)
	const handlePointerUp = () => {
		if (!isDragging || !rigidBodyRef) return

		console.log('--> Ending Drag');
		isDragging = false
		renderer.domElement.style.cursor = 'grab'

		if (originalBodyType !== undefined) {
			console.log(`--> Restoring body type to: ${originalBodyType}`);
			rigidBodyRef.setBodyType(originalBodyType, false)
			rigidBodyRef.wakeUp()
			// Give it a slight nudge downwards to ensure physics takes over
			const currentLinvel = rigidBodyRef.linvel(); // Get current velocity
			rigidBodyRef.setLinvel({ x: currentLinvel.x, y: -0.1, z: currentLinvel.z }, true);
			console.log('--> Applied small downward velocity nudge'); // DEBUG
		}
		originalBodyType = undefined

		// Removed OrbitControls enable logic
		/*
		const controls = $orbitControlsStore;
		if (controls) {
			console.log('--> Re-enabling OrbitControls via user context');
			controls.enabled = true
		} else {
			console.log('--> OrbitControls from user context was undefined on pointer up');
		}
		*/

		window.removeEventListener('pointermove', handlePointerMove)
	}

	const handlePointerEnter = (event: any) => {
		if (!isDragging) renderer.domElement.style.cursor = 'grab'
	}

	const handlePointerLeave = (event: any) => {
		if (!isDragging) renderer.domElement.style.cursor = 'auto'
	}

</script>

<!-- Restore physics components -->
<RigidBody bind:rigidBody={rigidBodyRef} type='dynamic'>
	<AutoColliders shape={'cuboid'}>
		<!-- Use interactivity props instead of on: handlers -->
		<T.Mesh
			receiveShadow
			{scale}
			onpointerdown={handlePointerDownProp}
			onpointerenter={handlePointerEnter}
			onpointerleave={handlePointerLeave}
		>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshToonMaterial color={color} />
			<Edges color="#64B5F6" />
		</T.Mesh>
	</AutoColliders>
</RigidBody>

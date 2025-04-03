<script lang="ts">
	import { T, useThrelte, useTask } from '@threlte/core'
	import { AutoColliders, RigidBody } from '@threlte/rapier' // Restored physics
	import { Edges, Text } from '@threlte/extras' // Import Text
	// Import type for RigidBody instance and the RigidBodyType enum
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat' // Restored physics
	// Import the dragging store
	import { isDragging as isDraggingStore } from '$lib/stores/draggingStore';
	// Remove TextMesh type import
	// import type { TextMesh } from 'troika-three-text'

	import { onMount, onDestroy } from 'svelte'
	import { Vector3, Plane, Raycaster, Vector2, ArrowHelper, Color } from 'three' // Keep Color import


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
	// Remove originalBodyType
	// let originalBodyType: RigidBodyType | undefined = undefined
	let originalGravityScale: number | undefined = undefined;
	let originalLinearDamping: number | undefined = undefined;
	const dragStiffness = 20; // Stiffness factor for drag velocity

	// Ref for the velocity vector helper
	let arrowHelperRef: ArrowHelper | undefined = undefined;
	// Ref for the text label
	let textRef: any | undefined = undefined; // Changed type to any

	// Reactive statement to set arrow color once ref is available
	$: if (arrowHelperRef) {
		arrowHelperRef.setColor(new Color('red'));
	}

	onMount(() => {
		const computedStyle = getComputedStyle(document.documentElement)
		color = computedStyle.getPropertyValue('--sidebar-border-color').trim() || color
	})

	onDestroy(() => {
		window.removeEventListener('pointermove', handlePointerMove)
		window.removeEventListener('pointerup', handlePointerUp)
	})

	// --- Update Arrow Helper and Text Label Task ---
	useTask(() => {
		if (!rigidBodyRef) return;

		const linvel = rigidBodyRef.linvel();
		const position = rigidBodyRef.translation();
		const linvelVec = new Vector3(linvel.x, linvel.y, linvel.z);
		const length = linvelVec.length();

		const isVisible = length > 0.01; // Determine visibility based on velocity

		// Update Arrow
		if (arrowHelperRef) {
			arrowHelperRef.position.set(position.x, position.y, position.z);
			arrowHelperRef.visible = isVisible;
			if (isVisible) {
				const direction = linvelVec.clone().normalize(); // Use clone to avoid modifying original
				arrowHelperRef.setDirection(direction);
				arrowHelperRef.setLength(length * 0.5, 0.2, 0.1); // Adjust multiplier as needed
			} else {
				arrowHelperRef.setLength(0.1, 0.2, 0.1); // Keep minimum size
			}
		}

		// Update Text Label
		if (textRef) {
			// Position slightly above and to the side of the arrow origin (adjust offset as needed)
			textRef.position.set(position.x + 0.2, position.y + 0.2, position.z);
			textRef.visible = isVisible; // Sync visibility with arrow
		}
	});
	// --- End Task ---

	// Handler for pointer down using interactivity prop
	const handlePointerDownProp = (event: any) => {
		if (!rigidBodyRef || !event.object || !event.point || !camera.current) {
			// console.log('--> Drag start condition not met');
			return;
		}

		if (!$isDraggingStore) { // Check store value
			console.log('--> Starting Dynamic Drag');
			originalGravityScale = rigidBodyRef.gravityScale();
			originalLinearDamping = rigidBodyRef.linearDamping();
			// console.log(`--> Storing Original gravityScale: ${originalGravityScale}, linearDamping: ${originalLinearDamping}`);
			isDraggingStore.set(true); // Set store to true
		} else {
			// console.log('--> PointerDown fired again during existing drag, ignoring store.');
			return;
		}

		rigidBodyRef.setGravityScale(0, true);
		rigidBodyRef.setLinearDamping(10);
		// console.log('--> Set gravityScale=0, linearDamping=1.0');

		rigidBodyRef.setLinvel({ x: 0, y: 0, z: 0 }, true)
		rigidBodyRef.setAngvel({ x: 0, y: 0, z: 0 }, true)

		// Offset and Plane calculation
		const intersectionPoint = event.point
		const currentPosition = new Vector3().copy(rigidBodyRef.translation() as Vector3)
		const cameraDirection = new Vector3();
		camera.current.getWorldDirection(cameraDirection);
		dragPlane.setFromNormalAndCoplanarPoint(cameraDirection, intersectionPoint);
		// console.log('--> Using camera-facing drag plane');
		const intersectionOnPlane = new Vector3()
		if (event.ray) {
			event.ray.intersectPlane(dragPlane, intersectionOnPlane)
		} else {
			// console.warn("Ray not available on event for offset calculation.");
			intersectionOnPlane.copy(intersectionPoint);
		}
		dragOffset.copy(intersectionOnPlane).sub(currentPosition)
		// console.log(`--> Calculated Offset: ${dragOffset.x.toFixed(2)}, ${dragOffset.y.toFixed(2)}, ${dragOffset.z.toFixed(2)}`);

		renderer.domElement.style.cursor = 'grabbing'
		window.addEventListener('pointermove', handlePointerMove)
		window.addEventListener('pointerup', handlePointerUp, { once: true })
	}

	// Handler for pointer move (global listener)
	const handlePointerMove = (event: PointerEvent) => {
		if (!$isDraggingStore || !camera.current || !rigidBodyRef) return // Check store value

		const { width, height, left, top } = renderer.domElement.getBoundingClientRect();
		const x = ((event.clientX - left) / width) * 2 - 1;
		const y = -((event.clientY - top) / height) * 2 + 1;
		const pointerCoordsVec2 = new Vector2(x, y);

		const raycaster = new Raycaster()
		raycaster.setFromCamera(pointerCoordsVec2, camera.current)

		const intersectionPoint = new Vector3()
		if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
			const targetPosition = intersectionPoint.sub(dragOffset)

			// --- Re-enable Y position clamping on the target position ---
			const halfHeight = scale / 2;
			targetPosition.y = Math.max(targetPosition.y, halfHeight);
			// --- End Clamping ---

			// Calculate velocity needed to reach target
			const currentPosition = rigidBodyRef.translation();
			const velocity = new Vector3()
				.copy(targetPosition)
				.sub(currentPosition)
				.multiplyScalar(dragStiffness); // Use constant

			rigidBodyRef.setLinvel(velocity, true);
			// console.log(`--> Target Vel: ${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}, ${velocity.z.toFixed(2)}`);

			// Remove invalidate() - physics engine should trigger updates
			// invalidate()
		}
	}

	// Handler for pointer up (global listener)
	const handlePointerUp = () => {
		if (!$isDraggingStore || !rigidBodyRef) return // Check store value
		const bodyRef = rigidBodyRef;

		console.log('--> Ending Dynamic Drag (Release/Throw)');
		isDraggingStore.set(false); // Set store to false
		renderer.domElement.style.cursor = 'grab'

		// Restore original physics properties
		if (originalGravityScale !== undefined) {
			bodyRef.setGravityScale(originalGravityScale, true);
			// console.log(`--> Restored gravityScale to: ${originalGravityScale}`);
		}

		// --- REMOVED Velocity Reset ---
		// Keep current velocity to allow throwing
		// bodyRef.setLinvel({ x: 0, y: 0, z: 0 }, true);
		// bodyRef.setAngvel({ x: 0, y: 0, z: 0 }, true);
		// console.log('--> Velocities NOT reset on release');
		// --- End Removal ---

		// Restore damping AFTER potential velocity is kept
		if (originalLinearDamping !== undefined) {
			bodyRef.setLinearDamping(originalLinearDamping);
			// console.log(`--> Restored linearDamping to: ${originalLinearDamping}`);
		}

		originalGravityScale = undefined;
		originalLinearDamping = undefined;

		window.removeEventListener('pointermove', handlePointerMove)
	}

	const handlePointerEnter = (event: any) => {
		if (!$isDraggingStore) renderer.domElement.style.cursor = 'grab' // Check store value
	}

	const handlePointerLeave = (event: any) => {
		if (!$isDraggingStore) renderer.domElement.style.cursor = 'auto' // Check store value
	}

</script>

<!-- Wrap RigidBody, ArrowHelper, and Text in a Group -->
<T.Group>
	<RigidBody bind:rigidBody={rigidBodyRef} type='dynamic'>
		<AutoColliders shape={'cuboid'}>
			<T.Mesh
				receiveShadow
				{scale}
				onpointerdown={handlePointerDownProp}
				onpointerenter={handlePointerEnter}
				onpointerleave={handlePointerLeave}
			>
				<T.BoxGeometry args={[1, 1, 1]} />
				<T.MeshBasicMaterial color={color} />
				<Edges color="#64B5F6" />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>

	<!-- ArrowHelper is now a SIBLING -->
	<T.ArrowHelper
		bind:ref={arrowHelperRef}
		dir={[0, 1, 0]}
		origin={[0, 0, 0]}
		length={1}
	/>

	<!-- Text Label -->
	<Text
		bind:ref={textRef}
		text="v"
		color="black"
		fontSize={1}
		anchorX="center"
		anchorY="middle"
		visible={false}
	/>
</T.Group>

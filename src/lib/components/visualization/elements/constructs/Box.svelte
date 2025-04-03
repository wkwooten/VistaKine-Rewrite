<script lang="ts">
	import { T, useThrelte, useTask } from '@threlte/core'
	import { AutoColliders, RigidBody } from '@threlte/rapier' // Restored physics
	import { Edges, Text, Outlines, Billboard } from '@threlte/extras' // Import Text & Billboard
	// Import type for RigidBody instance and the RigidBodyType enum
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat' // Restored physics
	import { RigidBodyType } from '@dimforge/rapier3d-compat' // <-- Import RigidBodyType
	// Import the dragging store
	import { isDragging as isDraggingStore } from '$lib/stores/draggingStore';
	// Remove TextMesh type import
	// import type { TextMesh } from 'troika-three-text'

	import { onMount, onDestroy } from 'svelte'
	import { Vector3, Plane, Raycaster, Vector2, ArrowHelper, Color, Group } from 'three' // Keep imported Mesh as ThreeMesh


	export let color: string = '#ffffff'
	export let scale: number = 1
	// Prop for the control mode ('drag' or 'translate')
	export let controlMode: 'drag' | 'translate' = 'drag';
	// Prop to bind the root group
	export let groupRef: Group | undefined = undefined;

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
	let velocityArrowHelperRef: ArrowHelper | undefined = undefined; // Renamed for clarity
	// Ref for the gravity vector helper
	let gravityArrowHelperRef: ArrowHelper | undefined = undefined;

	// Standard gravity constant (approximate)
	const GRAVITY_CONSTANT = 9.81;

	// Reactive state for Billboard positions and visibility
	let velocityBillboardPosition = new Vector3();
	let velocityBillboardVisible = false;
	let gravityBillboardPosition = new Vector3();
	let gravityBillboardVisible = false;

	// --- State for storing original physics properties ---
	let previousRigidBodyType: RigidBodyType = RigidBodyType.Dynamic; // Store original type
	let previousGravityScale: number = 1; // Store original gravity scale
	let physicsStateStored = false; // Flag to ensure we only store once per switch

	// --- Reactive statement to manage RigidBody type based on controlMode ---
	$: {
		if (rigidBodyRef) {
			if (controlMode === 'translate') {
				if (!physicsStateStored) {
					// Store current state before changing
					previousRigidBodyType = rigidBodyRef.bodyType();
					previousGravityScale = rigidBodyRef.gravityScale();
					physicsStateStored = true;
					// console.log('Storing physics state:', previousRigidBodyType, previousGravityScale);
				}
				// Set to Kinematic for TransformControls
				if (rigidBodyRef.bodyType() !== RigidBodyType.KinematicPositionBased) {
					rigidBodyRef.setBodyType(RigidBodyType.KinematicPositionBased, true);
				}
				if (rigidBodyRef.gravityScale() !== 0) {
					rigidBodyRef.setGravityScale(0, true);
				}
				// Ensure it stops moving from previous physics interactions
				rigidBodyRef.setLinvel({ x: 0, y: 0, z: 0 }, true);
        		rigidBodyRef.setAngvel({ x: 0, y: 0, z: 0 }, true);

			} else if (controlMode === 'drag') {
				if (physicsStateStored) {
					// Restore original state only if it was previously stored
					if (rigidBodyRef.bodyType() !== previousRigidBodyType) {
						rigidBodyRef.setBodyType(previousRigidBodyType, true);
					}
					if (rigidBodyRef.gravityScale() !== previousGravityScale) {
						rigidBodyRef.setGravityScale(previousGravityScale, true);
					}
					// console.log('Restoring physics state:', previousRigidBodyType, previousGravityScale);
					physicsStateStored = false; // Reset flag
				}
			}
		}
	}
	// --- End Reactive Statement ---

	// Reactive statement to set arrow color once ref is available
	$: if (velocityArrowHelperRef) {
		velocityArrowHelperRef.setColor(new Color('red'));
	}
	$: if (gravityArrowHelperRef) {
		gravityArrowHelperRef.setColor(new Color('green'));
	}

	onMount(() => {
		const computedStyle = getComputedStyle(document.documentElement)
		color = computedStyle.getPropertyValue('--sidebar-border-color').trim() || color
	})

	onDestroy(() => {
		window.removeEventListener('pointermove', handlePointerMove)
		window.removeEventListener('pointerup', handlePointerUp)
	})

	// --- Update Arrow Helpers and Text Labels Task ---
	useTask(() => {
		if (!rigidBodyRef) return;

		const worldPosition = new Vector3().copy(rigidBodyRef.translation() as Vector3); // Get position once

		// --- Velocity Vector ---
		const linvel = rigidBodyRef.linvel();
		const linvelVec = new Vector3(linvel.x, linvel.y, linvel.z);
		const velocityLength = linvelVec.length();
		const isVelocityVisible = velocityLength > 0.01;
		let velocityArrowTipPosition = new Vector3();

		if (velocityArrowHelperRef) {
			velocityArrowHelperRef.position.copy(worldPosition);
			velocityArrowHelperRef.visible = isVelocityVisible;
			if (isVelocityVisible) {
				const direction = linvelVec.clone().normalize();
				const visualLength = velocityLength * 0.5;
				velocityArrowHelperRef.setDirection(direction);
				velocityArrowHelperRef.setLength(visualLength, 0.2, 0.1);
				velocityArrowTipPosition.copy(worldPosition).add(direction.multiplyScalar(visualLength));
			} else {
				velocityArrowHelperRef.setLength(0.1, 0.2, 0.1);
				velocityArrowTipPosition.copy(worldPosition);
			}
		}

		// Update Velocity Billboard state
		velocityBillboardVisible = isVelocityVisible;
		if(isVelocityVisible){
			// Reassign to trigger reactivity
			velocityBillboardPosition = new Vector3(velocityArrowTipPosition.x, velocityArrowTipPosition.y + 0.4, velocityArrowTipPosition.z);
		} else {
			// Reassign to trigger reactivity
			velocityBillboardPosition = worldPosition.clone(); // Keep it near the box when invisible
		}

		// --- Gravity Vector ---
		const gravityScale = rigidBodyRef.gravityScale();
		const isGravityVisible = gravityScale > 0.01; // Visible if gravity is applied
		let gravityArrowTipPosition = new Vector3();
		const gravityDirection = new Vector3(0, -1, 0); // Gravity typically points down
		const visualGravityLength = gravityScale * GRAVITY_CONSTANT * 0.1; // Scale for visualization

		if (gravityArrowHelperRef) {
			gravityArrowHelperRef.position.copy(worldPosition);
			gravityArrowHelperRef.visible = isGravityVisible;
			if (isGravityVisible) {
				gravityArrowHelperRef.setDirection(gravityDirection);
				gravityArrowHelperRef.setLength(visualGravityLength, 0.2, 0.1);
				gravityArrowTipPosition.copy(worldPosition).add(gravityDirection.clone().multiplyScalar(visualGravityLength)); // Use clone
			} else {
				gravityArrowHelperRef.setLength(0.1, 0.2, 0.1); // Minimum size when not active
				gravityArrowTipPosition.copy(worldPosition);
			}
		}

		// Update Gravity Billboard state
		gravityBillboardVisible = isGravityVisible;
		if(isGravityVisible){
			// Reassign to trigger reactivity
			gravityBillboardPosition = new Vector3(gravityArrowTipPosition.x, gravityArrowTipPosition.y - 0.4, gravityArrowTipPosition.z); // Offset below
		} else {
			// Reassign to trigger reactivity
			gravityBillboardPosition = worldPosition.clone(); // Keep it near the box when invisible
		}
	});
	// --- End Task ---

	// Handler for pointer down using interactivity prop
	const handlePointerDownProp = (event: any) => {
		// Only allow dragging if in 'drag' mode
		if (controlMode !== 'drag') return;

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

<!-- Wrap RigidBody, ArrowHelper, Text, and Background in a Group -->
<T.Group bind:ref={groupRef}>
	<RigidBody bind:rigidBody={rigidBodyRef} type={RigidBodyType.Dynamic}>
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
				<Outlines thickness={0.1} color="#64B5F6" />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>

	<!-- Velocity ArrowHelper -->
	<T.ArrowHelper
		bind:ref={velocityArrowHelperRef}
		dir={[0, 1, 0]}
		origin={[0, 0, 0]}
		length={0.1}
		visible={false}
	/>

	<!-- Velocity Text Label -->
	<Billboard position={[velocityBillboardPosition.x, velocityBillboardPosition.y, velocityBillboardPosition.z]} visible={velocityBillboardVisible}>
		<Text
			text="v"
			font="/fonts/STIXTwoText-Regular.ttf"
			color="red"
			fontSize={1}
			outlineWidth={'1%'}
			outlineColor={'white'}
			anchorX="center"
			anchorY="middle"
		/>
	</Billboard>

	<!-- Gravity ArrowHelper -->
	<T.ArrowHelper
		bind:ref={gravityArrowHelperRef}
		dir={[0, -1, 0]}
		origin={[0, 0, 0]}
		length={0.1}
		visible={false}
	/>

	<!-- Gravity Text Label -->
	<Billboard position={[gravityBillboardPosition.x, gravityBillboardPosition.y, gravityBillboardPosition.z]} visible={gravityBillboardVisible}>
		<Text
			text="g"
			font="/fonts/STIXTwoText-Regular.ttf"
			color="green"
			fontSize={1}
			direction='ltr'
			outlineWidth={'1%'}
			outlineColor={'white'}
			anchorX="center"
			anchorY="middle"
		/>
	</Billboard>
</T.Group>

<script lang="ts">
	console.log('[Cube.svelte] Script Initializing');
	import { T, useThrelte, useTask } from '@threlte/core';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { Edges, Outlines, type ThreltePointerEvent } from '@threlte/extras'; /* Removed Billboard, Text */
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { RigidBodyType } from '@dimforge/rapier3d-compat';
	import { isDragging as isDraggingStore } from '$lib/stores/draggingStore';
	import { createDraggableHandlers } from '$lib/actions/draggable';
	import { writable } from 'svelte/store';
	import { onDestroy } from 'svelte';
	/* Removed ArrowHelper, Color */
	import { Vector3, Group, type Camera, type WebGLRenderer, Quaternion } from 'three';
	/* Import the new FBD component */
	import FBD from '$lib/components/visualization/helpers/FBD.svelte';
	import { selectedObject } from '$lib/stores/selectedObjectStore';
	import { followedObject } from '$lib/stores/followedObjectStore';

	// --- Use props for Runes mode ---
	let {
		color = '#2a2844',
		scale = 1,
		controlMode = 'drag',
		groupRef = $bindable(), // Use $bindable for two-way binding from parent
		rigidBodyRef = $bindable(), // Use $bindable for two-way binding from parent
		initialPosition = new Vector3(0, 0.5, 0)
	}: {
		color?: string;
		scale?: number;
		controlMode?: 'drag' | 'translate';
		groupRef?: Group | undefined;
		rigidBodyRef?: RapierRigidBody | undefined;
		initialPosition?: Vector3;
	} = $props();

	const { camera, renderer, invalidate, scene } = useThrelte();
	const mass = 1;

	let isHovering = $state(false); // Use $state for local component state

	// --- Intermediate Writable Stores for the Action ---
	// Initialize directly, update via $effect below
	const writableScale = writable(scale);
	const writableControlMode = writable(controlMode);
    const writableCamera = writable<Camera | undefined>($camera); // Initialize with current camera store value
    const writableRenderer = writable<WebGLRenderer | undefined>(renderer); // Initialize with current renderer

	// --- Effect to keep writable stores in sync with props/context ---
	$effect(() => {
		writableScale.set(scale);
		console.log('[Cube.svelte $effect] Syncing scale prop to writableScale:', scale);
	});
	$effect(() => {
		writableControlMode.set(controlMode);
		console.log('[Cube.svelte $effect] Syncing controlMode prop to writableControlMode:', controlMode);
	});
	$effect(() => {
		writableCamera.set($camera);
		console.log('[Cube.svelte $effect] Syncing $camera context to writableCamera:', $camera);
	});
    $effect(() => {
        writableRenderer.set(renderer); // Renderer context itself is not reactive, but we sync it once
        console.log('[Cube.svelte $effect] Syncing renderer context to writableRenderer:', renderer);
    });
    // --- End Intermediate Stores ---

	// --- Derived State ---
	let isSelected = $derived($selectedObject === groupRef);
	// --- End Derived State ---

	// Log prop/state changes for debugging
	$effect(() => {
		console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] isSelected derived state changed:`, isSelected, '$selectedObject:', $selectedObject, 'groupRef:', groupRef);
	});
	$effect(() => {
		if (rigidBodyRef) console.log('[Cube.svelte $effect] rigidBodyRef prop updated:', rigidBodyRef);
	});
	$effect(() => {
		console.log('[Cube.svelte $effect] Checking context for Draggable Handlers. Camera:', $camera, 'Renderer:', renderer);
	});


	// --- Create Draggable Handlers ---
	// Pass the writable stores as required by the action's signature
	const { handlePointerDown, handlePointerEnter, handlePointerLeave } = createDraggableHandlers({
		getRigidBody: () => rigidBodyRef, // Pass the reactive prop directly if action supports it, else use getter
		camera: writableCamera,
		renderer: writableRenderer,
		isDraggingStore: isDraggingStore,
		scale: writableScale,
		controlMode: writableControlMode
	});
	// --- End Create Draggable Handlers ---

	// --- Physics State Management ---
	let previousRigidBodyTypeStore: RigidBodyType = RigidBodyType.Dynamic;
	let previousGravityScaleStore: number = 1;
	let physicsStateStored = $state(false); // Use $state

	$effect(() => {
		const currentRigidBody = rigidBodyRef; // Dependency
		const currentControlMode = controlMode; // Dependency

		if (currentRigidBody) {
			if (currentControlMode === 'translate') {
				if (!physicsStateStored) {
					previousRigidBodyTypeStore = currentRigidBody.bodyType();
					previousGravityScaleStore = currentRigidBody.gravityScale();
					physicsStateStored = true;
					console.log('[Cube.svelte $effect] Storing physics state:', previousRigidBodyTypeStore, previousGravityScaleStore);
				}
				if (currentRigidBody.bodyType() !== RigidBodyType.KinematicPositionBased) {
					console.log('[Cube.svelte $effect] Setting body type to Kinematic');
					currentRigidBody.setBodyType(RigidBodyType.KinematicPositionBased, true);
				}
				if (currentRigidBody.gravityScale() !== 0) {
					console.log('[Cube.svelte $effect] Setting gravity scale to 0');
					currentRigidBody.setGravityScale(0, true);
				}
				currentRigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
        		currentRigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
			} else if (currentControlMode === 'drag') {
				if (physicsStateStored) {
					console.log('[Cube.svelte $effect] Restoring physics state:', previousRigidBodyTypeStore, previousGravityScaleStore);
					if (currentRigidBody.bodyType() !== previousRigidBodyTypeStore) {
						currentRigidBody.setBodyType(previousRigidBodyTypeStore, true);
					}
					if (currentRigidBody.gravityScale() !== previousGravityScaleStore) {
						currentRigidBody.setGravityScale(previousGravityScaleStore, true);
					}
					physicsStateStored = false;
				}
			}
		}
	});
	// --- End Physics State Management ---


	// --- RigidBody <-> Group Sync Task ---
	useTask(() => {
	  if (rigidBodyRef && groupRef) {
	    groupRef.position.copy(rigidBodyRef.translation() as Vector3);
	    groupRef.quaternion.copy(rigidBodyRef.rotation() as Quaternion);
	  }
	});
	// --- End RigidBody <-> Group Sync Task ---

	// Fetch initial color (onMount replacement logic if needed, but color is a prop now)
	// $effect(() => {
	// 	const computedStyle = getComputedStyle(document.documentElement);
	// 	color = computedStyle.getPropertyValue('--sidebar-border-color').trim() || color; // Color is a prop, shouldn't be reassigned here
	// });


	// --- Modified Event Handlers ---
	const originalHandlePointerEnter = handlePointerEnter;
	const originalHandlePointerLeave = handlePointerLeave;

	const handlePointerEnterModified = (e: ThreltePointerEvent) => { // Typed event
		if (!$isDraggingStore) {
			isHovering = true;
		} else {
            isHovering = false;
        }
		originalHandlePointerEnter(e);
	};

	const handlePointerLeaveModified = (e: ThreltePointerEvent) => { // Typed event
		isHovering = false;
		originalHandlePointerLeave(e);
	};

	// Threshold to distinguish click from drag (in pixels)
	const CLICK_VS_DRAG_THRESHOLD = 5;

	// Handler for double click
	const handleDoubleClick = (e: ThreltePointerEvent) => { // Typed event
		e.stopPropagation();
		// Check delta using optional chaining and nullish coalescing
		const deltaX = e.delta?.x ?? 0;
		const deltaY = e.delta?.y ?? 0;
		const moveDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Double Click Event Triggered. Move delta: ${moveDelta}`);

		if (moveDelta > CLICK_VS_DRAG_THRESHOLD) {
			console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Double Click ignored, likely end of drag.`);
			return;
		}

		// Use $followedObject store directly (it's already reactive)
		if ($followedObject === groupRef) {
			followedObject.set(null);
			console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Unfollowed. Store value:`, $followedObject);
		} else {
			followedObject.set(groupRef ?? null);
			console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Followed. Store value:`, $followedObject);
		}
	};
    // --- End Modified Event Handlers ---

</script>

<!-- Use reactive variables directly in the template -->
<T.Group bind:ref={groupRef} position={initialPosition.toArray()}>
	<RigidBody
		bind:rigidBody={rigidBodyRef}
		type={'dynamic'}
	>
		<AutoColliders mass={mass} shape={'cuboid'}>
			<T.Mesh
				receiveShadow
				scale={scale}
				onpointerdown={handlePointerDown}
				onpointerenter={handlePointerEnterModified}
				onpointerleave={handlePointerLeaveModified}
				onclick={(e: ThreltePointerEvent) => { /* Typed event */
					e.stopPropagation();

					// Use event delta to differentiate click from drag
					const deltaX = e.delta?.x ?? 0;
                    const deltaY = e.delta?.y ?? 0;
                    const moveDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
					console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Click Event Triggered. Move delta: ${moveDelta}`);

					// If mouse moved significantly, assume it was a drag, not a click
					if (moveDelta > CLICK_VS_DRAG_THRESHOLD) {
						console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Click ignored, likely end of drag.`);
						return;
					}

					// Proceed with selection logic using $selectedObject store directly
					if ($selectedObject === groupRef) {
						selectedObject.set(null); // Deselect
						console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Deselected. Store value after set:`, $selectedObject);
					} else {
						selectedObject.set(groupRef ?? null); // Select
						console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Selected. Store value after set:`, $selectedObject);
					}
				}}
				ondblclick={handleDoubleClick}
			>
				<T.BoxGeometry args={[1, 1, 1]} />
				<T.MeshBasicMaterial color={color} />
				<Edges color="#7b4db8" />
				{#if isSelected || isHovering}
					<Outlines thickness={0.05} color="#c099f0" />
				{/if}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>

	{#if rigidBodyRef}
		<FBD
			rigidBody={rigidBodyRef}
			vectorScale={scale}
			objectHalfHeight={scale / 2}
		/>
	{/if}

</T.Group>

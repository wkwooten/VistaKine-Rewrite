<script lang="ts">
	console.log('[Cube.svelte] Script Initializing');
	import { T, useThrelte, useTask } from '@threlte/core';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { Edges, Outlines } from '@threlte/extras'; /* Removed Billboard, Text */
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { RigidBodyType } from '@dimforge/rapier3d-compat';
	import { isDragging as isDraggingStore } from '$lib/stores/draggingStore';
	import { createDraggableHandlers } from '$lib/actions/draggable';
	import { writable, get } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	/* Removed ArrowHelper, Color */
	import { Vector3, Group, type Camera, type WebGLRenderer, Quaternion } from 'three';
	/* Import the new FBD component */
	import FBD from '$lib/components/visualization/helpers/FBD.svelte';
	import { selectedObject } from '$lib/stores/selectedObjectStore';
	import { followedObject } from '$lib/stores/followedObjectStore';

	export let color: string = '#ffffff';
	export let scale: number = 1;
	export let controlMode: 'drag' | 'translate' = 'drag';
	export let groupRef: Group | undefined = undefined;
	export let rigidBodyRef: RapierRigidBody | undefined = undefined;
	export let initialPosition: Vector3 = new Vector3(0, 0.5, 0);

	const { camera, renderer, invalidate, scene } = useThrelte();
	const mass = 1;

	let isHovering = false;
	let isSelected = false;

	const writableScale = writable(scale);
	const writableControlMode = writable(controlMode);
    const writableCamera = writable<Camera | undefined>(undefined);
    const writableRenderer = writable<WebGLRenderer | undefined>(undefined);

	$: writableScale.set(scale);
	$: writableControlMode.set(controlMode);
	$: writableCamera.set($camera);
    $: writableRenderer.set(renderer);

	$: isSelected = $selectedObject === groupRef;
	$: console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] isSelected check:`, isSelected, '$selectedObject:', $selectedObject, 'groupRef:', groupRef);

	$: if (rigidBodyRef) console.log('[Cube.svelte] Reactive: rigidBodyRef prop updated:', rigidBodyRef);

	$: console.log('[Cube.svelte] Reactive: Creating Draggable Handlers check. Camera:', $camera, 'Renderer:', renderer);

	const { handlePointerDown, handlePointerEnter, handlePointerLeave } = createDraggableHandlers({
		getRigidBody: () => rigidBodyRef,
		camera: writableCamera,
		renderer: writableRenderer,
		isDraggingStore: isDraggingStore,
		scale: writableScale,
		controlMode: writableControlMode
	});

	let previousRigidBodyTypeStore: RigidBodyType = RigidBodyType.Dynamic;
	let previousGravityScaleStore: number = 1;
	let physicsStateStored = false;

	$: {
		const currentRigidBody = rigidBodyRef;
		if (currentRigidBody) {
			const currentControlMode = get(writableControlMode);
			if (currentControlMode === 'translate') {
				if (!physicsStateStored) {
					previousRigidBodyTypeStore = currentRigidBody.bodyType();
					previousGravityScaleStore = currentRigidBody.gravityScale();
					physicsStateStored = true;
					console.log('[Cube.svelte] Storing physics state:', previousRigidBodyTypeStore, previousGravityScaleStore);
				}
				if (currentRigidBody.bodyType() !== RigidBodyType.KinematicPositionBased) {
					console.log('[Cube.svelte] Setting body type to Kinematic');
					currentRigidBody.setBodyType(RigidBodyType.KinematicPositionBased, true);
				}
				if (currentRigidBody.gravityScale() !== 0) {
					console.log('[Cube.svelte] Setting gravity scale to 0');
					currentRigidBody.setGravityScale(0, true);
				}
				currentRigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
        		currentRigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
			} else if (currentControlMode === 'drag') {
				if (physicsStateStored) {
					console.log('[Cube.svelte] Restoring physics state:', previousRigidBodyTypeStore, previousGravityScaleStore);
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
	}

	useTask(() => {
	  if (rigidBodyRef && groupRef) {
	    groupRef.position.copy(rigidBodyRef.translation() as Vector3);
	    groupRef.quaternion.copy(rigidBodyRef.rotation() as Quaternion);
	  }
	});

	onMount(() => {
		console.log('[Cube.svelte] Component Mounted.');
		const computedStyle = getComputedStyle(document.documentElement);
		color = computedStyle.getPropertyValue('--sidebar-border-color').trim() || color;
        writableCamera.set($camera);
        writableRenderer.set(renderer);
	});

	// --- Modified Event Handlers ---
	const originalHandlePointerEnter = handlePointerEnter;
	const originalHandlePointerLeave = handlePointerLeave;

	const handlePointerEnterModified = (e: any) => {
		// ---> REMOVE MODE CHECK: Always show hover outline when not dragging
		if (!$isDraggingStore) {
			isHovering = true;
		} else {
            isHovering = false;
        }
		originalHandlePointerEnter(e); // Call original drag handler logic for cursor
	};

	const handlePointerLeaveModified = (e: any) => {
		// Always remove hover outline on leave
		isHovering = false;
		originalHandlePointerLeave(e); // Call original drag handler logic for cursor
	};

	// Threshold to distinguish click from drag (in pixels)
	const CLICK_VS_DRAG_THRESHOLD = 5;

	// Handler for double click
	const handleDoubleClick = (e: any) => {
		e.stopPropagation();
		// Check delta to ensure it wasn't an accidental drag ending in double click
		const deltaX = Array.isArray(e.delta) ? e.delta[0] : (e.delta?.x ?? 0);
		const deltaY = Array.isArray(e.delta) ? e.delta[1] : (e.delta?.y ?? 0);
		const moveDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Double Click Event Triggered. Move delta: ${moveDelta}`);

		if (moveDelta > CLICK_VS_DRAG_THRESHOLD) {
			console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Double Click ignored, likely end of drag.`);
			return;
		}

		// Toggle following this object
		if (get(followedObject) === groupRef) {
			followedObject.set(null); // Unfollow if already following
			console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Unfollowed. Store value:`, get(followedObject));
		} else {
			followedObject.set(groupRef ?? null); // Follow this cube
			console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Followed. Store value:`, get(followedObject));
		}
	};

</script>

<T.Group bind:ref={groupRef} position={initialPosition.toArray()}>
	<RigidBody
		bind:rigidBody={rigidBodyRef}
		type={'dynamic'}
	>
		<AutoColliders mass={mass} shape={'cuboid'}>
			<T.Mesh
				receiveShadow
				{scale}
				onpointerdown={handlePointerDown}
				onpointerenter={handlePointerEnterModified}
				onpointerleave={handlePointerLeaveModified}
				onclick={(e) => {
					e.stopPropagation();
					// ---> REMOVE MODE CHECK

					// Use event delta to differentiate click from drag
                    console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Raw delta:`, e.delta);
					const deltaX = Array.isArray(e.delta) ? e.delta[0] : (e.delta?.x ?? 0);
                    const deltaY = Array.isArray(e.delta) ? e.delta[1] : (e.delta?.y ?? 0);
                    const moveDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
					console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Click Event Triggered. Move delta: ${moveDelta}`);

					// If mouse moved significantly, assume it was a drag, not a click
					if (moveDelta > CLICK_VS_DRAG_THRESHOLD) {
						console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Click ignored, likely end of drag.`);
						return;
					}

					// Proceed with selection logic
					if ($selectedObject === groupRef) {
						selectedObject.set(null); // Deselect
						console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Deselected. Store value after set:`, get(selectedObject));
					} else {
						selectedObject.set(groupRef ?? null); // Select
						console.log(`[Cube.svelte ${initialPosition.toArray().join(',')}] Selected. Store value after set:`, get(selectedObject));
					}
				}}
				ondblclick={handleDoubleClick}
			>
				<T.BoxGeometry args={[1, 1, 1]} />
				<T.MeshBasicMaterial {color} />
				<Edges color="#64B5F6" />
				{#if isSelected || isHovering}
					<Outlines thickness={0.1} color="#64B5F6" />
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

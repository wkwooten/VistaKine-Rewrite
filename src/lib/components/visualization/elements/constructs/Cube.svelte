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
	import { Vector3, Group, type Camera, type WebGLRenderer, MeshBasicMaterial } from 'three';
	/* Import the new FBD component */
	import FBD from '$lib/components/visualization/helpers/FBD.svelte';

	export let color: string = '#ffffff';
	export let scale: number = 1;
	export let controlMode: 'drag' | 'translate' = 'drag';
	export let groupRef: Group | undefined = undefined;
	export let rigidBodyRef: RapierRigidBody | undefined = undefined;

	const { camera, renderer, invalidate, scene } = useThrelte();
	const mass = 1;

	const writableScale = writable(scale);
	const writableControlMode = writable(controlMode);
    const writableCamera = writable<Camera | undefined>(undefined);
    const writableRenderer = writable<WebGLRenderer | undefined>(undefined);

	$: writableScale.set(scale);
	$: writableControlMode.set(controlMode);
	$: writableCamera.set($camera);
    $: writableRenderer.set(renderer);

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

	/* Remove state related to arrows/billboards */
	// let velocityArrowHelperRef: ArrowHelper | undefined = undefined;
	// let gravityArrowHelperRef: ArrowHelper | undefined = undefined;
	// const GRAVITY_CONSTANT = 9.81;
	// let velocityBillboardPosition = new Vector3();
	// let velocityBillboardVisible = false;
	// let gravityBillboardPosition = new Vector3();
	// let gravityBillboardVisible = false;

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

	/* Remove reactive statements for arrow colors */
	// $: if (velocityArrowHelperRef) velocityArrowHelperRef.setColor(new Color('red'));
	// $: if (gravityArrowHelperRef) gravityArrowHelperRef.setColor(new Color('green'));


	onMount(() => {
		console.log('[Cube.svelte] Component Mounted.');
		const computedStyle = getComputedStyle(document.documentElement);
		color = computedStyle.getPropertyValue('--sidebar-border-color').trim() || color;
        writableCamera.set($camera);
        writableRenderer.set(renderer);
	});

	/* Remove useTask for arrows/billboards */
	// useTask(() => { ... });

	const handleClick = (e: any) => {
		e.stopPropagation();
		console.log('[Cube.svelte using Box syntax] TEMPLATE Click Event Triggered', e.intersections);
	}

</script>

<T.Group bind:ref={groupRef}>
	<RigidBody bind:rigidBody={rigidBodyRef} type={'dynamic'}>
		<AutoColliders mass={mass} shape={'cuboid'}>
			<T.Mesh
				receiveShadow
				{scale}
				onpointerdown={handlePointerDown}
				onpointerenter={handlePointerEnter}
				onpointerleave={handlePointerLeave}
				onclick={handleClick}
			>
				<T.BoxGeometry args={[1, 1, 1]} />
				<T.MeshBasicMaterial {color} />
				<Edges color="#64B5F6" />
				<Outlines thickness={0.1} color="#64B5F6" />
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

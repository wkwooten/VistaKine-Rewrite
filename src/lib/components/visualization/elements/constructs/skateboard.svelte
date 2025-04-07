<script lang="ts">
	console.log('[Skateboard.svelte] Script Initializing');
	import { T, useThrelte, useTask } from '@threlte/core';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { useGltf, Suspense } from '@threlte/extras';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { RigidBodyType } from '@dimforge/rapier3d-compat';
	import { isDragging as isDraggingStore } from '$lib/stores/draggingStore';
	import { createDraggableHandlers } from '$lib/actions/draggable';
	import { writable, get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { Vector3, Group, type Camera, type WebGLRenderer, type Mesh, MeshStandardMaterial } from 'three';
	import FBD from '$lib/components/visualization/helpers/FBD.svelte';

	export let scale: number = .25;
	export let controlMode: 'drag' | 'translate' = 'drag';
	export let groupRef: Group | undefined = undefined;
	export let rigidBodyRef: RapierRigidBody | undefined = undefined;
	export let initialPosition: Vector3 = new Vector3(3, 0.5, 0);

	const { camera, renderer } = useThrelte();
	const mass = 1;

	type GLTFResult = {
		nodes: {
			Skateboard_Mesh: Mesh;
		};
		materials: {
			Skateboard_Mat: MeshStandardMaterial;
		};
	};

	const gltf = useGltf<GLTFResult>('/models/Skateboard.glb');

	const writableScale = writable(scale);
	const writableControlMode = writable(controlMode);
    const writableCamera = writable<Camera | undefined>(undefined);
    const writableRenderer = writable<WebGLRenderer | undefined>(undefined);

	$: writableScale.set(scale);
	$: writableControlMode.set(controlMode);
	$: writableCamera.set($camera);
    $: writableRenderer.set(renderer);

	$: if (rigidBodyRef) console.log('[Skateboard.svelte] Reactive: rigidBodyRef prop updated:', rigidBodyRef);

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
				}
				if (currentRigidBody.bodyType() !== RigidBodyType.KinematicPositionBased) {
					currentRigidBody.setBodyType(RigidBodyType.KinematicPositionBased, true);
				}
				if (currentRigidBody.gravityScale() !== 0) {
					currentRigidBody.setGravityScale(0, true);
				}
				currentRigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
        		currentRigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
			} else if (currentControlMode === 'drag') {
				if (physicsStateStored) {
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

	onMount(() => {
		console.log('[Skateboard.svelte] Component Mounted.');
        writableCamera.set($camera);
        writableRenderer.set(renderer);
	});

	const handleClick = (e: any) => {
		e.stopPropagation();
		console.log('[Skateboard.svelte] Click Event Triggered', e.intersections);
	}

</script>

{#snippet fallback()}
	<T.Group position={initialPosition.toArray()}>
		<T.Mesh visible={false}>
			<T.SphereGeometry args={[0.1 * scale]} />
			<T.MeshStandardMaterial color="lightgrey" />
		</T.Mesh>
	</T.Group>
{/snippet}

<Suspense {fallback}>
	<T.Group bind:ref={groupRef} position={initialPosition.toArray()}>
		{#if $gltf?.nodes?.Skateboard_Mesh && $gltf?.materials?.Skateboard_Mat}
			<RigidBody bind:rigidBody={rigidBodyRef} type={'dynamic'}>
				<AutoColliders mass={mass} shape={'trimesh'}>
					<T.Mesh
						geometry={$gltf.nodes.Skateboard_Mesh.geometry}
						material={$gltf.materials.Skateboard_Mat}
						scale={scale}
						castShadow
						receiveShadow
						on:pointerdown={handlePointerDown}
						on:pointerenter={handlePointerEnter}
						on:pointerleave={handlePointerLeave}
						on:click={handleClick}
					/>
				</AutoColliders>
			</RigidBody>
		{/if}

		{#if rigidBodyRef}
			<FBD
				rigidBody={rigidBodyRef}
				vectorScale={scale}
				objectHalfHeight={scale / 2}
			/>
		{/if}
	</T.Group>
</Suspense>

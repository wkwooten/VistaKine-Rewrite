<script lang="ts">
  console.log("[Skateboard.svelte] Script Initializing");
  import { T, useThrelte, useTask } from "@threlte/core";
  import { AutoColliders, RigidBody } from "@threlte/rapier";
  import { useGltf, Suspense } from "@threlte/extras";
  import type { RigidBody as RapierRigidBody } from "@dimforge/rapier3d-compat";
  import { RigidBodyType } from "@dimforge/rapier3d-compat";
  import { isDragging as isDraggingStore } from "$lib/stores/draggingStore";
  import { createDraggableHandlers } from "$lib/actions/draggable";
  import { writable, get } from "svelte/store";
  import { onMount } from "svelte";
  import {
    Vector3,
    Group,
    type Camera,
    type WebGLRenderer,
    type Mesh,
    MeshStandardMaterial,
    Quaternion,
  } from "three";
  import FBD from "$lib/components/visualization/helpers/FBD.svelte";

  interface $$Props {
    scale?: number;
    controlMode?: "drag" | "translate";
    groupRef?: Group | undefined;
    rigidBodyRef?: RapierRigidBody | undefined;
    initialPosition?: Vector3;
  }

  let {
    scale = 1,
    controlMode = "drag",
    groupRef = $bindable(),
    rigidBodyRef = $bindable(),
    initialPosition = new Vector3(3, 0.5, 0),
  }: $$Props = $props();

  $effect(() => {
    console.log(
      "[Skateboard.svelte] rigidBodyRef updated. Value:",
      rigidBodyRef,
      "Is instance of RigidBody (or a proxy):",
      typeof rigidBodyRef === "object" && rigidBodyRef !== null
    );
  });

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

  const gltf = useGltf<GLTFResult>("/models/Skateboard.glb");

  const writableScale = writable(scale);
  const writableControlMode = writable(controlMode);
  const writableCamera = writable<Camera | undefined>(undefined);
  const writableRenderer = writable<WebGLRenderer | undefined>(undefined);

  $effect(() => {
    writableScale.set(scale);
  });
  $effect(() => {
    writableControlMode.set(controlMode);
  });
  $effect(() => {
    writableCamera.set($camera);
  });
  $effect(() => {
    writableRenderer.set(renderer);
  });

  const {
    handlePointerDown: draggablePointerDown,
    handlePointerEnter: draggablePointerEnter,
    handlePointerLeave: draggablePointerLeave,
  } = createDraggableHandlers({
    getRigidBody: () => rigidBodyRef,
    camera: writableCamera,
    renderer: writableRenderer,
    isDraggingStore: isDraggingStore,
    scale: writableScale,
    controlMode: writableControlMode,
  });

  // Conditionally provide handlers using $derived
  let onPointerDown = $derived(rigidBodyRef ? draggablePointerDown : undefined);
  let onPointerEnter = $derived(
    rigidBodyRef ? draggablePointerEnter : undefined
  );
  let onPointerLeave = $derived(
    rigidBodyRef ? draggablePointerLeave : undefined
  );

  let previousRigidBodyTypeStore: RigidBodyType = RigidBodyType.Dynamic;
  let previousGravityScaleStore: number = 1;
  let physicsStateStored = false;

  $effect(() => {
    const currentRigidBody = rigidBodyRef;
    if (currentRigidBody) {
      if (controlMode === "translate") {
        if (!physicsStateStored) {
          previousRigidBodyTypeStore = currentRigidBody.bodyType();
          previousGravityScaleStore = currentRigidBody.gravityScale();
          physicsStateStored = true;
        }
        if (
          currentRigidBody.bodyType() !== RigidBodyType.KinematicPositionBased
        ) {
          currentRigidBody.setBodyType(
            RigidBodyType.KinematicPositionBased,
            true
          );
        }
        if (currentRigidBody.gravityScale() !== 0) {
          currentRigidBody.setGravityScale(0, true);
        }
        currentRigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
        currentRigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
      } else if (controlMode === "drag") {
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
  });

  useTask(() => {
    if (rigidBodyRef && groupRef) {
      groupRef.position.copy(rigidBodyRef.translation() as Vector3);
      groupRef.quaternion.copy(rigidBodyRef.rotation() as Quaternion);
    }
  });

  onMount(() => {
    console.log("[Skateboard.svelte] Component Mounted.");
    writableCamera.set($camera);
    writableRenderer.set(renderer);
  });

  const handleClick = (e: any) => {
    // e.stopPropagation();
    console.log("[Skateboard.svelte] Click Event Triggered", e.intersections);
  };
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
      <RigidBody bind:rigidBody={rigidBodyRef} type={"dynamic"}>
        <AutoColliders {mass} shape={"trimesh"}>
          <T.Mesh
            geometry={$gltf.nodes.Skateboard_Mesh.geometry}
            material={$gltf.materials.Skateboard_Mat}
            {scale}
            castShadow
            receiveShadow
            onpointerdown={onPointerDown}
            onpointerenter={onPointerEnter}
            onpointerleave={onPointerLeave}
            onclick={handleClick}
          />
        </AutoColliders>
      </RigidBody>
    {/if}

    {#if rigidBodyRef}
      <FBD
        rigidBody={rigidBodyRef}
        vectorScale={scale}
        objectHalfHeight={scale}
      />
    {/if}
  </T.Group>
</Suspense>

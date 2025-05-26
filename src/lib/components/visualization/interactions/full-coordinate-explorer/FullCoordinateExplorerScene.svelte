<script lang="ts">
  import RendererSetup from "../../helpers/RendererSetup.svelte";
  import { T, useTask } from "@threlte/core";
  import { OrbitControls, TransformControls } from "@threlte/extras";
  import SceneLabel from "$lib/components/visualization/helpers/SceneLabel.svelte";
  import XAxisLabel from "$lib/components/visualization/helpers/XAxisLabel.svelte";
  import YAxisLabel from "$lib/components/visualization/helpers/YAxisLabel.svelte";
  import ZAxisLabel from "$lib/components/visualization/helpers/ZAxisLabel.svelte";
  import {
    Color,
    Vector3,
    BufferGeometry,
    LineBasicMaterial,
    SphereGeometry,
    MeshBasicMaterial,
    BoxGeometry,
    Matrix4,
    Euler,
    Group,
    Quaternion,
  } from "three";
  import type { TransformControls as ThreeTransformControls } from "three/examples/jsm/controls/TransformControls.js";
  import {
    xAxisColor as xAxisColorStore,
    yAxisColor as yAxisColorStore,
    zAxisColor as zAxisColorStore,
    originColor as originColorStore,
    surfaceColor as sfcColorStore,
    accentColor,
    accentLightColor,
  } from "$lib/stores/themeColors";
  import {
    transformModeStore,
    type ExplorerTransformMode,
  } from "./coordinateExplorerStore";

  // --- Props ---
  let { resetKey = 0 } = $props<{
    resetKey?: number;
  }>();

  // --- Scene Setup ---
  const axesLength = 5;
  const initialAxesPosition = new Vector3(0, 0, 0);
  const initialAxesQuaternion = new Quaternion();

  // --- Movable Axes Group ---
  let movableAxesGroup: Group;
  let transformNonce = $state(0);
  let tcInstance: ThreeTransformControls | undefined = undefined;

  // --- Static Reference Points ---
  const referencePointsData = $state([
    {
      id: "p1",
      worldPosition: new Vector3(2, 2, 1),
      color: $accentColor,
      localCoords: { x: 0, y: 0, z: 0 },
    },
    {
      id: "p2",
      worldPosition: new Vector3(-3, 1, -2),
      color: $accentLightColor,
      localCoords: { x: 0, y: 0, z: 0 },
    },
    {
      id: "p3",
      worldPosition: new Vector3(1, -2, 3),
      color: $zAxisColorStore,
      localCoords: { x: 0, y: 0, z: 0 },
    },
  ]);
  const referencePointGeometry = new SphereGeometry(0.1);

  // Helper function to create an axis line
  function createAxisLine(direction: "x" | "y" | "z", color: string) {
    const points = [];
    if (direction === "x") {
      points.push(
        new Vector3(-axesLength, 0, 0),
        new Vector3(axesLength, 0, 0)
      );
    } else if (direction === "y") {
      points.push(
        new Vector3(0, -axesLength, 0),
        new Vector3(0, axesLength, 0)
      );
    } else {
      points.push(
        new Vector3(0, 0, -axesLength),
        new Vector3(0, 0, axesLength)
      );
    }
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({
      color: new Color(color),
      linewidth: 2,
    });
    return { geometry, material };
  }

  const xAxis = createAxisLine("x", $xAxisColorStore);
  const yAxis = createAxisLine("y", $yAxisColorStore);
  const zAxis = createAxisLine("z", $zAxisColorStore);
  const originMarkerGeometry = new SphereGeometry(0.15, 16, 16);

  const labelOffset = 0.4;
  const labelFontSize = 0.35;
  const labelPadding = 0.1;
  const labelBorderRadius = 0.05;

  // Effect to update reference point coordinates when axes move
  $effect(() => {
    const _ = transformNonce;
    if (movableAxesGroup) {
      const axesMatrixWorld = movableAxesGroup.matrixWorld;
      const inverseAxesMatrixWorld = new Matrix4()
        .copy(axesMatrixWorld)
        .invert();

      referencePointsData.forEach((point) => {
        const localPos = point.worldPosition
          .clone()
          .applyMatrix4(inverseAxesMatrixWorld);
        point.localCoords.x = parseFloat(localPos.x.toFixed(1));
        point.localCoords.y = parseFloat(localPos.y.toFixed(1));
        point.localCoords.z = parseFloat(localPos.z.toFixed(1));
      });
    }
  });

  // Effect to attach/detach event listeners and manage tcInstance mode
  $effect(() => {
    if (tcInstance) {
      const handleObjectChange = () => {
        transformNonce++;
      };
      tcInstance.addEventListener("objectChange", handleObjectChange);

      return () => {
        if (tcInstance) {
          tcInstance.removeEventListener("objectChange", handleObjectChange);
        }
      };
    }
  });

  // Effect to handle scene reset
  $effect(() => {
    const _ = resetKey;
    if (movableAxesGroup && tcInstance) {
      console.log(
        "Scene: Resetting axes position and rotation due to resetKey change."
      );
      // tcInstance.enabled = false; // Disable before detaching/resetting
      // tcInstance.detach();

      movableAxesGroup.position.copy(initialAxesPosition);
      movableAxesGroup.quaternion.copy(initialAxesQuaternion);
      movableAxesGroup.updateMatrixWorld(true); // Ensure matrix world is updated

      // tcInstance.attach(movableAxesGroup);
      // tcInstance.enabled = true; // Re-enable after attaching

      // Force a refresh of the TransformControls by re-evaluating its object prop binding.
      // This might be necessary if just updating position/quaternion isn't enough.
      // However, Threlte's TransformControls should ideally react to object changes.
      // The most straightforward way to ensure it picks up the new transform
      // is often by detaching and reattaching, or ensuring its internal state is updated.
      // For now, let's ensure the object itself is "seen" as potentially changed
      // by ensuring the reference in the #if block for TransformControls is re-evaluated
      // or that tcInstance updates its internal representation.
      // A simple re-attach might be the most robust if direct updates aren't reflected.

      // Minimal change: ensure the gizmo updates to the new position/rotation
      if (tcInstance.object) {
        // Check if object is still attached
        tcInstance.object.updateMatrixWorld(); // Correct: call on the attached object (movableAxesGroup)
      }
    }
  });
</script>

<RendererSetup />
<T.PerspectiveCamera
  makeDefault
  position={[axesLength * 1.5, axesLength * 1.2, axesLength * 1.8]}
  fov={75}
>
  <OrbitControls enablePan={true} enableDamping target={[0, 0, 0]} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.8} />
<T.DirectionalLight intensity={0.6} position={[5, 10, 7]} />

<!-- Movable Axes Group -->
<T.Group
  bind:ref={movableAxesGroup}
  position={initialAxesPosition.toArray()}
  quaternion={initialAxesQuaternion.toArray()}
>
  <T.Line geometry={xAxis.geometry} material={xAxis.material} />
  <T.Line geometry={yAxis.geometry} material={yAxis.material} />
  <T.Line geometry={zAxis.geometry} material={zAxis.material} />

  <T.Mesh geometry={originMarkerGeometry} position={[0, 0, 0]}>
    <T.MeshBasicMaterial color={$originColorStore} />
  </T.Mesh>

  <!-- Labels for Axes (relative to the group) -->
  <XAxisLabel text="+X" position={[axesLength + labelOffset, 0, 0]} />
  <XAxisLabel text="-X" position={[-axesLength - labelOffset, 0, 0]} />
  <YAxisLabel text="+Y" position={[0, axesLength + labelOffset, 0]} />
  <YAxisLabel text="-Y" position={[0, -axesLength - labelOffset, 0]} />
  <ZAxisLabel text="+Z" position={[0, 0, axesLength + labelOffset]} />
  <ZAxisLabel text="-Z" position={[0, 0, -axesLength - labelOffset]} />
  <SceneLabel
    text="Origin (0,0,0)"
    position={[0.2, -0.3, 0]}
    color={$originColorStore}
    fontSize={labelFontSize * 0.8}
    backgroundColor={$sfcColorStore}
    padding={labelPadding * 0.8}
    borderRadius={labelBorderRadius}
  />
</T.Group>

<!-- TransformControls for the movableAxesGroup -->
{#if movableAxesGroup}
  <TransformControls
    object={movableAxesGroup}
    mode={$transformModeStore}
    size={0.8}
    bind:controls={tcInstance}
  />
{/if}

<!-- Static Reference Points -->
{#each referencePointsData as point (point.id)}
  {@const coordLabelFontSize = 0.28}
  {@const coordLabelAboveBoxBaseY = point.worldPosition.y + 0.25} // Top surface
  of the box
  {@const coordLabelInitialOffsetAboveBox = 0.15} // Initial gap above the box for
  the first label's center
  {@const coordLabelLineSpacing = 0.35} // Vertical spacing between the centers of
  stacked labels

  {@const commonLabelProps = {
    fontSize: coordLabelFontSize,
    backgroundColor: $sfcColorStore,
    padding: 0.05,
    borderRadius: 0.03,
    depthTest: true, // Revert to true to see effect on rendering
  }}

  <T.Mesh
    geometry={referencePointGeometry}
    position={point.worldPosition.toArray()}
    renderOrder={12}
  >
    <T.MeshBasicMaterial color={point.color} />
  </T.Mesh>

  <!-- Z Coordinate Label (Bottom of the stack) -->
  <SceneLabel
    text={`Z: ${point.localCoords.z >= 0 ? "+" : ""}${point.localCoords.z.toFixed(1)}`}
    position={[
      point.worldPosition.x,
      coordLabelAboveBoxBaseY + coordLabelInitialOffsetAboveBox,
      point.worldPosition.z,
    ]}
    color={$zAxisColorStore}
    {...commonLabelProps}
  />
  <!-- Y Coordinate Label (Middle of the stack) -->
  <SceneLabel
    text={`Y: ${point.localCoords.y >= 0 ? "+" : ""}${point.localCoords.y.toFixed(1)}`}
    position={[
      point.worldPosition.x,
      coordLabelAboveBoxBaseY +
        coordLabelInitialOffsetAboveBox +
        coordLabelLineSpacing,
      point.worldPosition.z,
    ]}
    color={$yAxisColorStore}
    {...commonLabelProps}
  />
  <!-- X Coordinate Label (Top of the stack) -->
  <SceneLabel
    text={`X: ${point.localCoords.x >= 0 ? "+" : ""}${point.localCoords.x.toFixed(1)}`}
    position={[
      point.worldPosition.x,
      coordLabelAboveBoxBaseY +
        coordLabelInitialOffsetAboveBox +
        2 * coordLabelLineSpacing,
      point.worldPosition.z,
    ]}
    color={$xAxisColorStore}
    {...commonLabelProps}
  />
{/each}

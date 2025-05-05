<script lang="ts">
  // ==================================
  // Imports
  // ==================================
  import { T, useThrelte } from "@threlte/core";
  import { OrbitControls, Grid, Edges, Billboard, Text } from "@threlte/extras";
  import {
    Vector3,
    Vector2,
    Color,
    ArrowHelper,
    BufferGeometry,
    LineSegments,
    LineDashedMaterial,
    BufferAttribute,
  } from "three";
  import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
  import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
  import { Line2 } from "three/examples/jsm/lines/Line2.js";

  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  // Store Imports
  import {
    vectorData,
    MIN_X,
    MAX_X,
    MIN_Y,
    MAX_Y,
    MIN_Z,
    MAX_Z,
    showVectorDialog,
    showDeltaX,
    showDeltaY,
    showDeltaZ,
    vectorBuilderDialogTurns,
    showVectorBuilderDialog,
    hideVectorDialog,
    useIjkNotation,
  } from "$lib/stores/vectorBuilderState";
  import {
    xAxisColor,
    yAxisColor,
    zAxisColor,
    vectorColor,
    startPointColor,
    endPointColor,
    gridCellColor,
    gridSectionColor,
  } from "$lib/stores/themeColors";

  // Component Imports
  import SceneLabel from "../../helpers/SceneLabel.svelte";

  // ==================================
  // Threlte / Svelte Hooks
  // ==================================
  const { size } = useThrelte();

  // ==================================
  // Constants
  // ==================================
  const initialWorldPosition = new Vector3(0, 0, 0);
  const dashSize = 0.2;
  const gapSize = 0.1;
  const deltaLineWidth = 3;

  // ==================================
  // Reactive State ($state, tweened)
  // ==================================

  // ==================================
  // Component/Object Refs ($state)
  // ==================================
  let lineX = $state<Line2 | undefined>(undefined);
  let lineY = $state<Line2 | undefined>(undefined);
  let lineZ = $state<Line2 | undefined>(undefined);
  let materialX = $state<LineMaterial | undefined>(undefined);
  let materialY = $state<LineMaterial | undefined>(undefined);
  let materialZ = $state<LineMaterial | undefined>(undefined);

  // ==================================
  // Derived State ($derived.by)
  // ==================================

  // --- World Positions ---
  let vectorStartWorld = $derived.by(() => {
    const start = $vectorData?.start;
    if (!start) return null;
    return new Vector3(start.x, start.y, start.z);
  });

  let vectorEndWorld = $derived.by(() => {
    const end = $vectorData?.end;
    if (!end) return null;
    return new Vector3(end.x, end.y, end.z);
  });

  // --- Intermediate Points for Delta Lines ---
  let deltaIntermediateXY = $derived.by(() => {
    if (!vectorStartWorld || !vectorEndWorld) return null;
    return new Vector3(
      vectorEndWorld.x,
      vectorStartWorld.y,
      vectorStartWorld.z
    );
  });

  let deltaIntermediateYZ = $derived.by(() => {
    if (!vectorStartWorld || !vectorEndWorld) return null;
    // Point where X and Y deltas are complete
    return new Vector3(vectorEndWorld.x, vectorEndWorld.y, vectorStartWorld.z);
  });

  // --- Label Data ---
  let deltaLabelXData = $derived.by(() => {
    if ($showDeltaX && deltaIntermediateXY && $vectorData && vectorStartWorld) {
      const midPointX = vectorStartWorld.clone().lerp(deltaIntermediateXY, 0.5);
      const labelTextX = `ΔX =  ${$vectorData.components.dx.toFixed(2)}`;
      return { position: midPointX, text: labelTextX };
    }
    return null;
  });

  let deltaLabelYData = $derived.by(() => {
    if (
      $showDeltaY &&
      deltaIntermediateXY &&
      deltaIntermediateYZ &&
      $vectorData
    ) {
      const midPointY = deltaIntermediateXY
        .clone()
        .lerp(deltaIntermediateYZ, 0.5);
      const labelTextY = `ΔY = ${$vectorData.components.dy.toFixed(2)}`;
      return { position: midPointY, text: labelTextY };
    }
    return null;
  });

  let deltaLabelZData = $derived.by(() => {
    if ($showDeltaZ && deltaIntermediateYZ && vectorEndWorld && $vectorData) {
      const midPointZ = deltaIntermediateYZ.clone().lerp(vectorEndWorld, 0.5);
      const labelTextZ = `ΔZ = ${$vectorData.components.dz.toFixed(2)}`;
      return { position: midPointZ, text: labelTextZ };
    }
    return null;
  });

  // ==================================
  // Helper Functions
  // ==================================
  const linePoints = (start: Vector3, end: Vector3) =>
    new Float32Array([...start.toArray(), ...end.toArray()]);

  // ==================================
  // Effects ($effect)
  // ==================================

  // --- Initialization ---
  $effect(() => {
    // Initialize Lines and Materials ONCE
    if (!lineX && $size.width > 0 && $size.height > 0) {
      console.log("[VectorScene] Creating Line2 instances...");
      // X Line
      const geomX = new LineGeometry();
      const matX = new LineMaterial({
        color: $xAxisColor,
        linewidth: deltaLineWidth,
        resolution: new Vector2($size.width, $size.height),
        dashed: true,
        dashScale: 1,
        dashSize: dashSize,
        gapSize: gapSize,
      });
      const lnX = new Line2(geomX, matX);
      materialX = matX;
      lineX = lnX;

      // Y Line
      const geomY = new LineGeometry();
      const matY = new LineMaterial({
        color: $yAxisColor,
        linewidth: deltaLineWidth,
        resolution: new Vector2($size.width, $size.height),
        dashed: true,
        dashScale: 1,
        dashSize: dashSize,
        gapSize: gapSize,
      });
      const lnY = new Line2(geomY, matY);
      materialY = matY;
      lineY = lnY;

      // Z Line
      const geomZ = new LineGeometry();
      const matZ = new LineMaterial({
        color: $zAxisColor,
        linewidth: deltaLineWidth,
        resolution: new Vector2($size.width, $size.height),
        dashed: true,
        dashScale: 1,
        dashSize: dashSize,
        gapSize: gapSize,
      });
      const lnZ = new Line2(geomZ, matZ);
      materialZ = matZ;
      lineZ = lnZ;
    }

    // Cleanup
    return () => {
      if (lineX) {
        console.log("[VectorScene] Cleaning up Line2 instances...");
        lineX.geometry.dispose();
        materialX?.dispose();
        lineX = undefined;
        materialX = undefined;
      }
      if (lineY) {
        lineY.geometry.dispose();
        materialY?.dispose();
        lineY = undefined;
        materialY = undefined;
      }
      if (lineZ) {
        lineZ.geometry.dispose();
        materialZ?.dispose();
        lineZ = undefined;
        materialZ = undefined;
      }
    };
  });

  // --- Updates / Sync ---
  $effect(() => {
    // Update Line Positions
    if (lineX && vectorStartWorld && deltaIntermediateXY) {
      const positionsX = linePoints(vectorStartWorld, deltaIntermediateXY);
      (lineX.geometry as LineGeometry).setPositions(positionsX);
      lineX.computeLineDistances();
    }
  });

  $effect(() => {
    if (lineY && deltaIntermediateXY && deltaIntermediateYZ) {
      const positionsY = linePoints(deltaIntermediateXY, deltaIntermediateYZ);
      (lineY.geometry as LineGeometry).setPositions(positionsY);
      lineY.computeLineDistances();
    }
  });

  $effect(() => {
    if (lineZ && deltaIntermediateYZ && vectorEndWorld) {
      const positionsZ = linePoints(deltaIntermediateYZ, vectorEndWorld);
      (lineZ.geometry as LineGeometry).setPositions(positionsZ);
      lineZ.computeLineDistances();
    }
  });

  $effect(() => {
    // Update Material Resolution on Resize
    if (
      materialX &&
      materialY &&
      materialZ &&
      $size.width > 0 &&
      $size.height > 0
    ) {
      const res = new Vector2($size.width, $size.height);
      materialX.resolution = res;
      materialY.resolution = res;
      materialZ.resolution = res;
    }
  });

  $effect(() => {
    // Update Material Colors
    if (materialX) materialX.color = new Color($xAxisColor);
  });
  $effect(() => {
    if (materialY) materialY.color = new Color($yAxisColor);
  });
  $effect(() => {
    if (materialZ) materialZ.color = new Color($zAxisColor);
  });

  // --- Reactions ---
  // Removed effect block for traceVectorRequested

  // Removed effect block for resetVectorBuilderRequested

  // Adjusted camera target slightly, assuming origin is 0,0,0 now
  const cameraTarget = new Vector3(0, 0, 0);

  // --- Constants for Manual Axes ---
  const axisLength = MAX_X - MIN_X; // Total length (e.g., 12)
  const halfAxisLength = axisLength / 2; // Half length (e.g., 6)
  const axisThickness = 0.02;
  const originSphereRadius = 0.1;
</script>

<!-- Basic Lighting -->
<T.AmbientLight intensity={1} />

<T.PerspectiveCamera makeDefault position={[5, 10, 10]}>
  <OrbitControls
    target={cameraTarget.toArray()}
    enableZoom={true}
    enablePan={false}
    maxDistance={50}
    minDistance={10}
  />
</T.PerspectiveCamera>

<!-- Use Grid Component Directly -->
<Grid
  cellColor={$gridCellColor}
  sectionColor={$gridSectionColor}
  sectionSize={1}
  cellSize={1}
  sectionThickness={1}
  cellThickness={0.1}
  gridSize={[axisLength, axisLength]}
  position={[0, 0, 0]}
  rotation={[-Math.PI / 2, 0, 0]}
  infiniteGrid={false}
  fadeDistance={100}
  fadeStrength={1}
/>

<Grid
  cellColor={$gridCellColor}
  sectionColor={$gridSectionColor}
  sectionSize={1}
  cellSize={1}
  sectionThickness={1}
  cellThickness={0.1}
  gridSize={[axisLength, axisLength]}
  position={[0, 0, 0]}
  infiniteGrid={false}
  fadeDistance={100}
  fadeStrength={1}
/>

<!-- Origin Marker -->
<T.Mesh position={[0, 0, 0]}>
  <T.SphereGeometry args={[originSphereRadius]} />
  <T.MeshBasicMaterial color={"#ffffff"} />
</T.Mesh>

<!-- Manual Axes (Symmetrical) -->

<!-- X Axis -->
<T.Mesh position.x={0} rotation.x={0} rotation.y={0} rotation.z={Math.PI / 2}>
  <T.CylinderGeometry args={[axisThickness, axisThickness, axisLength, 8]} />
  <T.MeshBasicMaterial color={$xAxisColor} />
</T.Mesh>
<SceneLabel
  position={[halfAxisLength + 0.5, 0, 0]}
  text="+X"
  fontSize={0.6}
  color={$xAxisColor}
/>
<SceneLabel
  position={[-halfAxisLength - 0.5, 0, 0]}
  text="-X"
  fontSize={0.6}
  color={$xAxisColor}
/>

<!-- Y Axis -->
<T.Mesh position.y={0} rotation.x={0} rotation.y={0} rotation.z={0}>
  <T.CylinderGeometry args={[axisThickness, axisThickness, axisLength, 8]} />
  <T.MeshBasicMaterial color={$yAxisColor} />
</T.Mesh>
<SceneLabel
  position={[0, halfAxisLength + 0.5, 0]}
  text="+Y"
  fontSize={0.6}
  color={$yAxisColor}
/>
<SceneLabel
  position={[0, -halfAxisLength - 0.5, 0]}
  text="-Y"
  fontSize={0.6}
  color={$yAxisColor}
/>

<!-- Z Axis -->
<T.Mesh position.z={0} rotation.x={Math.PI / 2} rotation.y={0} rotation.z={0}>
  <T.CylinderGeometry args={[axisThickness, axisThickness, axisLength, 8]} />
  <T.MeshBasicMaterial color={$zAxisColor} />
</T.Mesh>
<SceneLabel
  position={[0, 0, halfAxisLength + 0.5]}
  text="+Z"
  fontSize={0.6}
  color={$zAxisColor}
/>
<SceneLabel
  position={[0, 0, -halfAxisLength - 0.5]}
  text="-Z"
  fontSize={0.6}
  color={$zAxisColor}
/>

<!-- Vector Visualization -->
{#if vectorStartWorld && vectorEndWorld && $vectorData}
  {@const direction = vectorEndWorld.clone().sub(vectorStartWorld).normalize()}
  {@const distance = vectorStartWorld.distanceTo(vectorEndWorld)}
  {@const vectorColorObj = new Color($vectorColor)}

  <!-- Start Point Marker (Always show if vector data exists) -->
  <T.Mesh position={vectorStartWorld.toArray()}>
    <T.SphereGeometry args={[0.25]} />
    <T.MeshBasicMaterial color={$startPointColor} />
  </T.Mesh>

  <!-- Start Coordinate Label (Always show if vector data exists) -->
  {@const labelOffsetY = 0.5}
  {@const labelFontSize = 0.5}
  {@const startLabelText = `(${$vectorData.start.x}, ${$vectorData.start.y}, ${$vectorData.start.z})`}
  <SceneLabel
    position={[
      vectorStartWorld.x,
      vectorStartWorld.y + labelOffsetY,
      vectorStartWorld.z,
    ]}
    text={startLabelText}
    fontSize={labelFontSize}
    color={$startPointColor}
    anchorX="center"
    anchorY="middle"
    depthTest={false}
  />

  {#if distance > 0.01}
    <!-- Only draw these elements if vector is non-zero -->

    <!-- Arrow -->
    {@const arrow = new ArrowHelper(
      direction,
      vectorStartWorld,
      distance,
      vectorColorObj.getHex(),
      distance * 0.1, // Adjust head size based on distance
      distance * 0.05 // Adjust head width based on distance
    )}
    <T is={arrow} />

    <!-- End Point Marker -->
    <T.Mesh position={vectorEndWorld.toArray()}>
      <T.SphereGeometry args={[0.25]} />
      <T.MeshBasicMaterial color={$endPointColor} />
    </T.Mesh>

    <!-- End Coordinate Label -->
    {@const endLabelText = `(${$vectorData.end.x}, ${$vectorData.end.y}, ${$vectorData.end.z})`}
    <SceneLabel
      position={[
        vectorEndWorld.x,
        vectorEndWorld.y + labelOffsetY,
        vectorEndWorld.z,
      ]}
      text={endLabelText}
      fontSize={labelFontSize}
      color={$endPointColor}
      anchorX="center"
      anchorY="middle"
      depthTest={false}
    />

    <!-- Delta Component Lines (Conditional & Refactored) -->
    {@const dashSize = 0.2}
    {@const gapSize = 0.1}
    {#if showDeltaX && showDeltaY && showDeltaZ && $vectorData}
      {@const deltaIntermediateXY = vectorStartWorld
        .clone()
        .lerp(vectorEndWorld, 0.5)}
      {@const deltaIntermediateYZ = deltaIntermediateXY
        .clone()
        .lerp(vectorEndWorld, 0.5)}
      <T.LineSegments>
        <T.Line
          position={[
            vectorStartWorld.x,
            vectorStartWorld.y,
            vectorStartWorld.z,
          ]}
          end={[
            deltaIntermediateXY.x,
            deltaIntermediateXY.y,
            deltaIntermediateXY.z,
          ]}
          color={$xAxisColor}
        />
        <T.Line
          position={[
            deltaIntermediateXY.x,
            deltaIntermediateXY.y,
            deltaIntermediateXY.z,
          ]}
          end={[
            deltaIntermediateYZ.x,
            deltaIntermediateYZ.y,
            deltaIntermediateYZ.z,
          ]}
          color={$yAxisColor}
        />
        <T.Line
          position={[
            deltaIntermediateYZ.x,
            deltaIntermediateYZ.y,
            deltaIntermediateYZ.z,
          ]}
          end={[vectorEndWorld.x, vectorEndWorld.y, vectorEndWorld.z]}
          color={$zAxisColor}
        />
      </T.LineSegments>
    {/if}

    <!-- Delta Component Labels (Billboard Text) -->
    {@const deltaLabelFontSize = 0.5}
    {@const deltaLabelOffsetY = 0.3}
    {#if deltaLabelXData}
      <SceneLabel
        position={[
          deltaLabelXData.position.x,
          deltaLabelXData.position.y + deltaLabelOffsetY,
          deltaLabelXData.position.z,
        ]}
        text={deltaLabelXData.text}
        fontSize={deltaLabelFontSize}
        color={$xAxisColor}
        anchorX="center"
        anchorY="middle"
      />
    {/if}
    {#if deltaLabelYData}
      <SceneLabel
        position={[
          deltaLabelYData.position.x,
          deltaLabelYData.position.y + deltaLabelOffsetY,
          deltaLabelYData.position.z,
        ]}
        text={deltaLabelYData.text}
        fontSize={deltaLabelFontSize}
        color={$yAxisColor}
        anchorX="center"
        anchorY="middle"
      />
    {/if}
    {#if deltaLabelZData}
      <SceneLabel
        position={[
          deltaLabelZData.position.x,
          deltaLabelZData.position.y + deltaLabelOffsetY,
          deltaLabelZData.position.z,
        ]}
        text={deltaLabelZData.text}
        fontSize={deltaLabelFontSize}
        color={$zAxisColor}
        anchorX="center"
        anchorY="middle"
      />
    {/if}

    <!-- Delta Lines (Refactored to use Line2) -->
    {#if $showDeltaX && lineX}
      {@const _ = console.log("[DEBUG] Rendering X Line")}
      <T is={lineX} />
    {/if}
    {#if $showDeltaY && lineY}
      {@const __ = console.log("[DEBUG] Rendering Y Line")}
      <T is={lineY} />
    {/if}
    {#if $showDeltaZ && lineZ}
      {@const ___ = console.log("[DEBUG] Rendering Z Line")}
      <T is={lineZ} />
    {/if}

    <!-- Magnitude Label -->
    {@const midpointPosVec = vectorStartWorld
      .clone()
      .add(vectorEndWorld)
      .multiplyScalar(0.5)}
    <SceneLabel
      position={midpointPosVec.add(new Vector3(0, 0.4, 0))}
      text={"Magnitude = " + $vectorData.magnitude.toFixed(2)}
      color={$vectorColor}
      fontSize={0.5}
      anchorX="center"
      anchorY="middle"
      depthTest={false}
    />
  {/if}
  <!-- End of distance > 0.01 check -->
{/if}
<!-- End of vector data check -->

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
    traceVectorRequested,
    resetVectorBuilderRequested,
    MIN_X,
    MAX_X,
    MIN_Y,
    MAX_Y,
    MIN_Z,
    MAX_Z,
    xAxisColor,
    yAxisColor,
    zAxisColor,
    nozzleColor,
    nozzleEdgesColor,
    heightIndicatorColor,
    bedColor,
    bedEdgesColor,
    gridCellColor,
    gridSectionColor,
    vectorColor,
    startPointColor,
    endPointColor,
    showVectorDialog,
    showDeltaX,
    showDeltaY,
    showDeltaZ,
  } from "$lib/stores/vectorBuilderState";

  // Component Imports
  import SceneLabel from "../../helpers/SceneLabel.svelte";
  import PrinterBed from "../../elements/constructs/PrinterBed.svelte";
  import CoordinateAxes from "../../elements/constructs/CoordinateAxes.svelte";
  import AnimatedNozzle from "../../elements/constructs/AnimatedNozzle.svelte";

  // ==================================
  // Threlte / Svelte Hooks
  // ==================================
  const { size } = useThrelte();

  // ==================================
  // Constants
  // ==================================
  const cornerOriginOffset = new Vector3(-6, 1, -6);
  const initialWorldPosition = cornerOriginOffset
    .clone()
    .add(new Vector3(0, 5, 0));
  const dashSize = 0.2;
  const gapSize = 0.1;
  const deltaLineWidth = 3;

  // ==================================
  // Reactive State ($state, tweened)
  // ==================================
  const animatedPosition = tweened(initialWorldPosition, {
    duration: 500,
    easing: cubicOut,
    interpolate: (a, b) => {
      const vec = a.clone();
      return (t) => vec.lerpVectors(a, b, t);
    },
  });

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
    return cornerOriginOffset
      .clone()
      .add(new Vector3(start.x, start.y, start.z));
  });

  let vectorEndWorld = $derived.by(() => {
    const end = $vectorData?.end;
    if (!end) return null;
    return cornerOriginOffset.clone().add(new Vector3(end.x, end.y, end.z));
  });

  // --- Intermediate Points for Delta Lines ---
  let deltaIntermediateXY = $derived.by(() => {
    if (!vectorStartWorld || !vectorEndWorld) return null;
    return new Vector3(
      vectorEndWorld.x,
      vectorStartWorld.y,
      vectorStartWorld.z,
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

  onMount(() => {
    // Fetch CSS Colors and update stores
    if (typeof window !== "undefined") {
      const styles = getComputedStyle(document.documentElement);
      xAxisColor.set(
        styles.getPropertyValue("--axis-color-x").trim() || get(xAxisColor),
      );
      yAxisColor.set(
        styles.getPropertyValue("--axis-color-y").trim() || get(yAxisColor),
      );
      zAxisColor.set(
        styles.getPropertyValue("--axis-color-z").trim() || get(zAxisColor),
      );
      nozzleColor.set(
        styles.getPropertyValue("--calibration-nozzle-color").trim() ||
          get(nozzleColor),
      );
      nozzleEdgesColor.set(
        styles.getPropertyValue("--calibration-nozzle-edges-color").trim() ||
          get(nozzleEdgesColor),
      );
      heightIndicatorColor.set(
        styles
          .getPropertyValue("--calibration-height-indicator-color")
          .trim() || get(heightIndicatorColor),
      );
      bedColor.set(
        styles.getPropertyValue("--color-surface").trim() || get(bedColor),
      );
      bedEdgesColor.set(
        styles.getPropertyValue("--calibration-bed-edges-color").trim() ||
          get(bedEdgesColor),
      );
      gridCellColor.set(
        styles.getPropertyValue("--scene-grid-cell-color").trim() ||
          get(gridCellColor),
      );
      gridSectionColor.set(
        styles.getPropertyValue("--scene-grid-section-color").trim() ||
          get(gridSectionColor),
      );
      vectorColor.set(
        styles.getPropertyValue("--vector-builder-vector-color").trim() ||
          get(vectorColor),
      );
      startPointColor.set(
        styles.getPropertyValue("--vector-builder-start-color").trim() ||
          get(startPointColor),
      );
      endPointColor.set(
        styles.getPropertyValue("--vector-builder-end-color").trim() ||
          get(endPointColor),
      );
      console.log("[VectorScene] Fetched Colors and updated stores");
    }

    // Show initial dialog
    showVectorDialog([
      {
        speaker: "Leo",
        message:
          "Okay, Surya, let's test a specific move. Define a start and end point using the controls. This defines a vector – the exact path the nozzle will follow.",
      },
      {
        speaker: "Surya",
        message:
          "Got it. Start point... end point... So the vector is just the straight line between them?",
      },
      {
        speaker: "Leo",
        message:
          "Precisely! And it has both a direction and a length, or magnitude. Enter some points and see.",
      },
    ]);
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
  $effect(() => {
    // React to trace requests
    if ($traceVectorRequested) {
      console.log("[VectorScene] Trace requested");
      const start = vectorStartWorld;
      const end = vectorEndWorld;

      if (start && end) {
        animatedPosition.set(start, { duration: 0 }).then(() => {
          const distance = start.distanceTo(end);
          const duration = distance * 100;
          if (distance > 0.01) {
            animatedPosition.set(end, {
              duration: Math.max(500, duration),
              easing: cubicOut,
            });
          }
        });
      } else {
        console.warn("[VectorScene] Trace requested but points invalid.");
      }
      traceVectorRequested.set(false); // Reset flag
    }
  });

  $effect(() => {
    // React to reset requests
    if ($resetVectorBuilderRequested) {
      console.log("[VectorScene] Reset requested");
      animatedPosition.set(initialWorldPosition, { duration: 0 });
      resetVectorBuilderRequested.set(false); // Reset flag
    }
  });

  const cameraTarget = new Vector3(0, 7.5, 0);
</script>

<!-- Basic Lighting -->
<T.AmbientLight intensity={1} />

<T.PerspectiveCamera makeDefault position={[0, 60, 0]}>
  <OrbitControls
    target={cameraTarget.toArray()}
    enableZoom={true}
    enablePan={false}
    maxPolarAngle={Math.PI / 2}
    maxDistance={50}
    minDistance={10}
  />
</T.PerspectiveCamera>

<!-- Use PrinterBed Component -->
<PrinterBed
  bedColor={$bedColor}
  bedEdgesColor={$bedEdgesColor}
  gridCellColor={$gridCellColor}
  gridSectionColor={$gridSectionColor}
/>

<!-- Use CoordinateAxes Component -->
<CoordinateAxes
  {cornerOriginOffset}
  xAxisColor={$xAxisColor}
  yAxisColor={$yAxisColor}
  zAxisColor={$zAxisColor}
  axisLengthX={MAX_X}
  axisLengthY={MAX_Y}
  axisLengthZ={MAX_Z}
/>

<!-- Use AnimatedNozzle Component -->
<AnimatedNozzle
  position={$animatedPosition}
  {cornerOriginOffset}
  nozzleColor={$nozzleColor}
  nozzleEdgesColor={$nozzleEdgesColor}
  heightIndicatorColor={$heightIndicatorColor}
/>

<!-- Vector Visualization -->
{#if vectorStartWorld && vectorEndWorld && $vectorData}
  {@const direction = vectorEndWorld.clone().sub(vectorStartWorld).normalize()}
  {@const distance = vectorStartWorld.distanceTo(vectorEndWorld)}
  {@const vectorColorObj = new Color($vectorColor)}

  {#if distance > 0.01}
    <!-- Only draw if points are distinct -->
    {@const arrow = new ArrowHelper(
      direction,
      vectorStartWorld,
      distance,
      vectorColorObj.getHex(),
      distance * 0.1,
      distance * 0.05,
    )}
    <T is={arrow} />
  {/if}

  <!-- Start Point Marker -->
  <T.Mesh position={vectorStartWorld.toArray()}>
    <T.SphereGeometry args={[0.25]} />
    <T.MeshBasicMaterial color={$startPointColor} />
  </T.Mesh>

  <!-- End Point Marker -->
  <T.Mesh position={vectorEndWorld.toArray()}>
    <T.SphereGeometry args={[0.25]} />
    <T.MeshBasicMaterial color={$endPointColor} />
  </T.Mesh>

  <!-- Coordinate Labels -->
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

  <!-- Correct Delta Component Lines (Conditional & Refactored) -->
  {@const dashSize = 0.2}
  {@const gapSize = 0.1}

  <!-- Delta Component Lines (Conditional & Refactored) -->
  {#if showDeltaX && showDeltaY && showDeltaZ && $vectorData}
    {@const deltaIntermediateXY = vectorStartWorld
      .clone()
      .lerp(vectorEndWorld, 0.5)}
    {@const deltaIntermediateYZ = deltaIntermediateXY
      .clone()
      .lerp(vectorEndWorld, 0.5)}
    <T.LineSegments>
      <T.Line
        position={[vectorStartWorld.x, vectorStartWorld.y, vectorStartWorld.z]}
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
  {@const deltaLabelOffsetY = 0.3} // Offset slightly from the line

  <!-- Use derived label data -->
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
  {#if showDeltaX && lineX}
    <T is={lineX} />
  {/if}
  {#if showDeltaY && lineY}
    <T is={lineY} />
  {/if}
  {#if showDeltaZ && lineZ}
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

<script lang="ts">
  import RendererSetup from "./../../helpers/RendererSetup.svelte";
  import { T, Canvas } from "@threlte/core";
  import {
    OrbitControls,
    MeshLineGeometry,
    MeshLineMaterial,
  } from "@threlte/extras";
  import {
    ArrowHelper,
    Color,
    Vector3,
    Vector2,
    BufferGeometry,
    BufferAttribute,
    SphereGeometry,
    MeshBasicMaterial,
    CylinderGeometry,
    Quaternion,
  } from "three";
  import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
  import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
  import { Line2 } from "three/examples/jsm/lines/Line2.js";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import SceneLabel from "../../helpers/SceneLabel.svelte";
  import {
    vectorColor as vectorColorStore,
    labelColor as labelColorStore,
    surfaceColor as surfaceColorStore,
    xAxisColor as xAxisColorStore,
    yAxisColor as yAxisColorStore,
    zAxisColor as zAxisColorStore,
  } from "$lib/stores/themeColors";

  // --- State for Colors (Initialized with defaults) --- //
  const originSphereColor = new Color("#ffffff"); // White for origin sphere contrast

  // --- Vector Definition (Static) --- //
  const origin = new Vector3(0, 0, 0);
  const endPoint = new Vector3(3, 4, 2);
  const components = endPoint.clone().sub(origin);
  const vectorV = endPoint.clone(); // Use the endpoint vector for angle calculations
  const direction = components.clone().normalize();
  const magnitude = components.length();
  const intermediateX = new Vector3(components.x, 0, 0);
  const intermediateXY = new Vector3(components.x, components.y, 0);

  // --- Direction Angles (Calculated but not displayed numerically) --- //
  const vNorm = vectorV.clone().normalize(); // Normalized vector for angle calculations
  const angleAlphaRad = Math.acos(vNorm.x); // Angle with +X
  const angleBetaRad = Math.acos(vNorm.y); // Angle with +Y
  const angleGammaRad = Math.acos(vNorm.z); // Angle with +Z

  // --- Scene Setup Constants --- //
  const labelFontSize = 0.3;
  const labelOffset = 0.3;
  const dashSize = 0.15;
  const gapSize = 0.1;
  const lineWidth = 2;
  const originSphereRadius = 0.1;
  const axisIndicatorLength = 1.0;
  const axisIndicatorRadius = 0.02;
  const axisLabelFontSize = 0.25;
  const axisLabelOffset = 0.3;
  const angleLabelFontSize = 0.25;
  const arcRadius = 0.6; // Radius for the angle arcs
  const arcPointsCount = 20; // Number of points for arc smoothness
  const arcLineWidth = 0.03;

  // --- New Padding Constant ---
  const anatomyLabelPadding = 0.5;

  // --- Helper Function to Generate Arc Points --- //
  function generateArcPoints(
    startDir: Vector3,
    endDir: Vector3,
    angleRad: number,
    radius: number,
    numPoints: number
  ): Vector3[] {
    const points: Vector3[] = [];
    // Axis of rotation: cross product of start and end directions
    const rotationAxis = new Vector3()
      .crossVectors(startDir, endDir)
      .normalize();
    // Handle cases where vectors are collinear (angle is 0 or PI)
    if (rotationAxis.lengthSq() < 0.0001) {
      // If collinear and angle is approx PI, add intermediate points if needed
      // For simplicity here, just return start and end points scaled by radius if collinear
      // A better approach might draw a small semi-circle in a default plane if angle is PI
      if (angleRad > 0.1) {
        // Only draw if not basically zero angle
        points.push(startDir.clone().multiplyScalar(radius));
        // Could add more points for a degenerate arc here
        points.push(endDir.clone().multiplyScalar(radius));
      } else {
        // Don't draw arc if angle is near zero
      }
      return points;
    }

    const q = new Quaternion();
    for (let i = 0; i <= numPoints; i++) {
      const fraction = i / numPoints;
      q.setFromAxisAngle(rotationAxis, angleRad * fraction);
      const point = startDir.clone().multiplyScalar(radius).applyQuaternion(q);
      points.push(point);
    }
    return points;
  }

  // --- Calculate Arc Points --- //
  const xAxisDir = new Vector3(1, 0, 0);
  const yAxisDir = new Vector3(0, 1, 0);
  const zAxisDir = new Vector3(0, 0, 1);

  const arcAlphaPoints = generateArcPoints(
    xAxisDir,
    vNorm,
    angleAlphaRad,
    arcRadius,
    arcPointsCount
  );
  const arcBetaPoints = generateArcPoints(
    yAxisDir,
    vNorm,
    angleBetaRad,
    arcRadius,
    arcPointsCount
  );
  const arcGammaPoints = generateArcPoints(
    zAxisDir,
    vNorm,
    angleGammaRad,
    arcRadius,
    arcPointsCount
  );

  // --- Calculated Positions (Static) --- //
  const tailLabelPos = origin.clone().add(new Vector3(0, -labelOffset, 0));
  const headLabelPos = endPoint.clone().add(new Vector3(0, 0, labelOffset));
  const midPoint = origin.clone().lerp(endPoint, 0.5);
  const magnitudeLabelPos = midPoint
    .clone()
    .add(new Vector3(0, labelOffset * 1.5, 0));
  const xCompLabelPos = origin
    .clone()
    .lerp(intermediateX, 0.5)
    .sub(new Vector3(0, labelOffset, 0));
  const yCompLabelPos = intermediateX.clone().lerp(intermediateXY, 0.5);
  const zCompLabelPos = intermediateXY.clone().lerp(endPoint, 0.5);

  // Positions for Angle Labels (near middle of arc)
  const alphaLabelPos =
    arcAlphaPoints.length > 1
      ? arcAlphaPoints[Math.floor(arcPointsCount / 2)]
          .clone()
          .multiplyScalar(1.2)
      : new Vector3(arcRadius, 0, 0);
  const betaLabelPos =
    arcBetaPoints.length > 1
      ? arcBetaPoints[Math.floor(arcPointsCount / 2)]
          .clone()
          .multiplyScalar(1.2)
      : new Vector3(0, arcRadius, 0);
  const gammaLabelPos =
    arcGammaPoints.length > 1
      ? arcGammaPoints[Math.floor(arcPointsCount / 2)]
          .clone()
          .multiplyScalar(1.2)
      : new Vector3(0, 0, arcRadius);

  // --- State Refs for Line2 objects --- //
  let lineX = $state<Line2 | undefined>();
  let lineY = $state<Line2 | undefined>();
  let lineZ = $state<Line2 | undefined>();

  // --- Ref for the wrapper element to get size --- //
  let wrapperElement: HTMLDivElement;

  // --- Reactive ArrowHelper (depends on vectorColor) --- //
  let arrow = $derived.by(() => {
    const headLength = magnitude * 0.15;
    const headWidth = headLength * 0.6;
    // Use the current store value
    return new ArrowHelper(
      direction,
      origin,
      magnitude,
      new Color($vectorColorStore).getHex(),
      headLength,
      headWidth
    );
  });

  // --- Setup on Mount --- //
  onMount(() => {
    let matX: LineMaterial | undefined;
    let matY: LineMaterial | undefined;
    let matZ: LineMaterial | undefined;
    let geomX: LineGeometry | undefined;
    let geomY: LineGeometry | undefined;
    let geomZ: LineGeometry | undefined;

    if (browser && wrapperElement) {
      const wrapperRect = wrapperElement.getBoundingClientRect();
      const currentSize = new Vector2(wrapperRect.width, wrapperRect.height);

      if (currentSize.width > 0 && currentSize.height > 0) {
        // Create Materials using updated store values
        matX = new LineMaterial({
          color: new Color($xAxisColorStore),
          linewidth: lineWidth,
          resolution: currentSize,
          dashed: true,
          dashScale: 1,
          dashSize: dashSize,
          gapSize: gapSize,
        });
        matY = new LineMaterial({
          color: new Color($yAxisColorStore),
          linewidth: lineWidth,
          resolution: currentSize,
          dashed: true,
          dashScale: 1,
          dashSize: dashSize,
          gapSize: gapSize,
        });
        matZ = new LineMaterial({
          color: new Color($zAxisColorStore),
          linewidth: lineWidth,
          resolution: currentSize,
          dashed: true,
          dashScale: 1,
          dashSize: dashSize,
          gapSize: gapSize,
        });

        // Create Geometries
        geomX = new LineGeometry();
        geomX.setPositions([...origin.toArray(), ...intermediateX.toArray()]);
        geomY = new LineGeometry();
        geomY.setPositions([
          ...intermediateX.toArray(),
          ...intermediateXY.toArray(),
        ]);
        geomZ = new LineGeometry();
        geomZ.setPositions([
          ...intermediateXY.toArray(),
          ...endPoint.toArray(),
        ]);

        // Create Line2 instances and assign to state
        const tempLineX = new Line2(geomX, matX);
        tempLineX.computeLineDistances();
        lineX = tempLineX;

        const tempLineY = new Line2(geomY, matY);
        tempLineY.computeLineDistances();
        lineY = tempLineY;

        const tempLineZ = new Line2(geomZ, matZ);
        tempLineZ.computeLineDistances();
        lineZ = tempLineZ;
      } else {
        console.warn(
          "[VectorAnatomy] Wrapper size is zero, cannot create component lines."
        );
      }
    }

    // Return cleanup function
    return () => {
      matX?.dispose();
      matY?.dispose();
      matZ?.dispose();
      geomX?.dispose();
      geomY?.dispose();
      geomZ?.dispose();
      lineX = undefined;
      lineY = undefined;
      lineZ = undefined;
    };
  });
</script>

<div class="vector-anatomy-wrapper" bind:this={wrapperElement}>
  <Canvas>
    <RendererSetup />
    <T.PerspectiveCamera makeDefault position={[2, 20, 8]} fov={50}>
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableDamping
        target={midPoint.toArray()}
        minDistance={2}
        maxDistance={20}
      />
    </T.PerspectiveCamera>

    <T.AmbientLight intensity={0.9} />
    <T.DirectionalLight position={[5, 5, 5]} intensity={0.6} />

    <!-- Render the reactive ArrowHelper -->
    {#if arrow}
      <T is={arrow} />
    {/if}

    <!-- Origin Sphere -->
    <T.Mesh position={origin.toArray()}>
      <T.SphereGeometry args={[originSphereRadius, 16, 16]} />
      <T.MeshBasicMaterial color={originSphereColor} />
    </T.Mesh>

    <!-- Axis Indicators -->
    {@const axisGeom = new CylinderGeometry(
      axisIndicatorRadius,
      axisIndicatorRadius,
      axisIndicatorLength,
      8
    )}
    <!-- X Axis Indicator -->
    <T.Mesh
      geometry={axisGeom}
      position.x={axisIndicatorLength / 2}
      rotation.z={-Math.PI / 2}
    >
      <T.MeshBasicMaterial color={$xAxisColorStore} />
    </T.Mesh>
    <SceneLabel
      position={[axisIndicatorLength + axisLabelOffset, 0, 0]}
      text="X+"
      fontSize={axisLabelFontSize}
      color={$xAxisColorStore}
      backgroundColor={null}
    />

    <!-- Y Axis Indicator -->
    <T.Mesh geometry={axisGeom} position.y={axisIndicatorLength / 2}>
      <T.MeshBasicMaterial color={$yAxisColorStore} />
    </T.Mesh>
    <SceneLabel
      position={[0, axisIndicatorLength + axisLabelOffset, 0]}
      text="Y+"
      fontSize={axisLabelFontSize}
      color={$yAxisColorStore}
      backgroundColor={null}
    />

    <!-- Z Axis Indicator -->
    <T.Mesh
      geometry={axisGeom}
      position.z={axisIndicatorLength / 2}
      rotation.x={Math.PI / 2}
    >
      <T.MeshBasicMaterial color={$zAxisColorStore} />
    </T.Mesh>
    <SceneLabel
      position={[0, 0, axisIndicatorLength + axisLabelOffset]}
      text="Z+"
      fontSize={axisLabelFontSize}
      color={$zAxisColorStore}
      backgroundColor={null}
    />

    <!-- Component Lines (Render Line2 instances) -->
    {#if lineX}
      <T is={lineX} />
    {/if}
    {#if lineY}
      <T is={lineY} />
    {/if}
    {#if lineZ}
      <T is={lineZ} />
    {/if}

    <!-- Direction Angle Arcs -->
    {#if arcAlphaPoints.length > 1}
      <T.Mesh>
        <MeshLineGeometry points={arcAlphaPoints} />
        <MeshLineMaterial
          width={arcLineWidth}
          color={$xAxisColorStore}
          transparent={true}
          opacity={0.4}
          dashArray={0.1}
          dashRatio={0.5}
        />
      </T.Mesh>
    {/if}
    {#if arcBetaPoints.length > 1}
      <T.Mesh>
        <MeshLineGeometry points={arcBetaPoints} />
        <MeshLineMaterial
          width={arcLineWidth}
          color={$yAxisColorStore}
          transparent={true}
          opacity={0.4}
          dashArray={0.1}
          dashRatio={0.5}
        />
      </T.Mesh>
    {/if}
    {#if arcGammaPoints.length > 1}
      <T.Mesh>
        <MeshLineGeometry points={arcGammaPoints} />
        <MeshLineMaterial
          width={arcLineWidth}
          color={$zAxisColorStore}
          transparent={true}
          opacity={0.4}
          dashArray={0.1}
          dashRatio={0.5}
        />
      </T.Mesh>
    {/if}

    <!-- Labels -->
    <SceneLabel
      position={tailLabelPos}
      text="Tail (Start)"
      fontSize={labelFontSize}
      color={$labelColorStore}
      backgroundColor={$surfaceColorStore}
      anchorX="center"
      anchorY="middle"
      depthTest={true}
      padding={anatomyLabelPadding}
    />
    <SceneLabel
      position={headLabelPos}
      text="Head (End)"
      fontSize={labelFontSize}
      color={$labelColorStore}
      backgroundColor={$surfaceColorStore}
      anchorX="center"
      anchorY="middle"
      depthTest={true}
      padding={anatomyLabelPadding}
    />
    <SceneLabel
      position={magnitudeLabelPos}
      text={`Magnitude`}
      fontSize={labelFontSize}
      color={$labelColorStore}
      backgroundColor={$surfaceColorStore}
      anchorX="center"
      anchorY="middle"
      depthTest={true}
      padding={anatomyLabelPadding}
    />

    <!-- Component Labels -->
    {#if Math.abs(components.x) > 0.01}
      <SceneLabel
        position={xCompLabelPos}
        text={`X Component`}
        fontSize={labelFontSize * 0.9}
        color={$xAxisColorStore}
        backgroundColor={$surfaceColorStore}
        anchorX="center"
        anchorY="middle"
        padding={anatomyLabelPadding}
      />
    {/if}
    {#if Math.abs(components.y) > 0.01}
      <SceneLabel
        position={yCompLabelPos}
        text={`Y Component`}
        fontSize={labelFontSize * 0.9}
        color={$yAxisColorStore}
        backgroundColor={$surfaceColorStore}
        anchorX="center"
        anchorY="middle"
        padding={anatomyLabelPadding}
      />
    {/if}
    {#if Math.abs(components.z) > 0.01}
      <SceneLabel
        position={zCompLabelPos}
        text={`Z Component`}
        fontSize={labelFontSize * 0.9}
        color={$zAxisColorStore}
        backgroundColor={$surfaceColorStore}
        anchorX="center"
        anchorY="middle"
        padding={anatomyLabelPadding}
      />
    {/if}

    <!-- Direction Angle Labels (Repositioned) -->
    <SceneLabel
      position={alphaLabelPos}
      text="α"
      fontSize={angleLabelFontSize}
      color={$xAxisColorStore}
      backgroundColor={null}
      anchorX="center"
      anchorY="middle"
    />
    <SceneLabel
      position={betaLabelPos}
      text="β"
      fontSize={angleLabelFontSize}
      color={$yAxisColorStore}
      backgroundColor={null}
      anchorX="center"
      anchorY="middle"
    />
    <SceneLabel
      position={gammaLabelPos}
      text="γ"
      fontSize={angleLabelFontSize}
      color={$zAxisColorStore}
      backgroundColor={null}
      anchorX="center"
      anchorY="middle"
    />
  </Canvas>
</div>

<style>
  .vector-anatomy-wrapper {
    /* Basic wrapper styles */
    display: block;
    position: relative;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-background);
    margin-bottom: var(--space-m);
    height: 350px;
    width: 100%;
    overflow: hidden;
  }
</style>

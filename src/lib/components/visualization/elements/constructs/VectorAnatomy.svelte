<script lang="ts">
  import { T, Canvas } from '@threlte/core';
  import { OrbitControls, Billboard, Text, MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';
  import { ArrowHelper, Color, Vector3, Vector2, BufferGeometry, BufferAttribute, SphereGeometry, MeshBasicMaterial, CylinderGeometry, Quaternion } from 'three';
  import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
  import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
  import { Line2 } from 'three/examples/jsm/lines/Line2.js';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // --- State for Colors (Initialized with defaults) --- //
  let vectorColor = $state(new Color('#FFA500'));
  let labelColor = $state(new Color('#cccccc'));
  let xAxisColor = $state(new Color('#EF5350'));
  let yAxisColor = $state(new Color('#66BB6A'));
  let zAxisColor = $state(new Color('#2C8FFF'));
  const originSphereColor = new Color('#ffffff'); // White for origin sphere contrast

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
  const angleBetaRad = Math.acos(vNorm.y);  // Angle with +Y
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
    const rotationAxis = new Vector3().crossVectors(startDir, endDir).normalize();
    // Handle cases where vectors are collinear (angle is 0 or PI)
    if (rotationAxis.lengthSq() < 0.0001) {
      // If collinear and angle is approx PI, add intermediate points if needed
      // For simplicity here, just return start and end points scaled by radius if collinear
      // A better approach might draw a small semi-circle in a default plane if angle is PI
      if (angleRad > 0.1) { // Only draw if not basically zero angle
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

  const arcAlphaPoints = generateArcPoints(xAxisDir, vNorm, angleAlphaRad, arcRadius, arcPointsCount);
  const arcBetaPoints = generateArcPoints(yAxisDir, vNorm, angleBetaRad, arcRadius, arcPointsCount);
  const arcGammaPoints = generateArcPoints(zAxisDir, vNorm, angleGammaRad, arcRadius, arcPointsCount);

  // --- Calculated Positions (Static) --- //
  const tailLabelPos = origin.clone().add(new Vector3(-labelOffset, -labelOffset, -labelOffset));
  const headLabelPos = endPoint.clone().add(new Vector3(labelOffset, labelOffset, labelOffset));
  const midPoint = origin.clone().lerp(endPoint, 0.5);
  const magnitudeLabelPos = midPoint.clone().add(new Vector3(0, labelOffset * 1.5, 0));
  const xCompLabelPos = origin.clone().lerp(intermediateX, 0.5);
  const yCompLabelPos = intermediateX.clone().lerp(intermediateXY, 0.5);
  const zCompLabelPos = intermediateXY.clone().lerp(endPoint, 0.5);

  // Positions for Angle Labels (near middle of arc)
  const alphaLabelPos = arcAlphaPoints.length > 1 ? arcAlphaPoints[Math.floor(arcPointsCount / 2)].clone().multiplyScalar(1.2) : new Vector3(arcRadius, 0, 0);
  const betaLabelPos = arcBetaPoints.length > 1 ? arcBetaPoints[Math.floor(arcPointsCount / 2)].clone().multiplyScalar(1.2) : new Vector3(0, arcRadius, 0);
  const gammaLabelPos = arcGammaPoints.length > 1 ? arcGammaPoints[Math.floor(arcPointsCount / 2)].clone().multiplyScalar(1.2) : new Vector3(0, 0, arcRadius);

  // --- State Refs for Line2 objects --- //
  let lineX = $state<Line2 | undefined>();
  let lineY = $state<Line2 | undefined>();
  let lineZ = $state<Line2 | undefined>();

  // --- Ref for the wrapper element to get size --- //
  let wrapperElement: HTMLDivElement;

  // --- Reactive ArrowHelper (depends on vectorColor) --- //
  let arrow = $derived.by(() => {
      // console.log("[VectorAnatomy] Recreating ArrowHelper with color:", vectorColor.getHexString());
      const headLength = magnitude * 0.15;
      const headWidth = headLength * 0.6;
      // Use the current state of vectorColor
      return new ArrowHelper(direction, origin, magnitude, vectorColor.getHex(), headLength, headWidth);
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
      // console.log('[VectorAnatomy] Fetching initial colors and size...');
      const styles = getComputedStyle(document.documentElement);
      const wrapperRect = wrapperElement.getBoundingClientRect();
      const currentSize = new Vector2(wrapperRect.width, wrapperRect.height);

      // Update color state (will trigger $derived arrow update)
      vectorColor = new Color(styles.getPropertyValue('--vector-builder-vector-color').trim() || '#FFA500');
      labelColor = new Color(styles.getPropertyValue('--color-text-secondary').trim() || '#cccccc');
      xAxisColor = new Color(styles.getPropertyValue('--axis-color-x').trim() || '#EF5350');
      yAxisColor = new Color(styles.getPropertyValue('--axis-color-y').trim() || '#66BB6A');
      zAxisColor = new Color(styles.getPropertyValue('--axis-color-z').trim() || '#2C8FFF');

      if (currentSize.width > 0 && currentSize.height > 0) {
        // Create Materials using updated state colors
        matX = new LineMaterial({
            color: xAxisColor,
            linewidth: lineWidth,
            resolution: currentSize,
            dashed: true, dashScale: 1, dashSize: dashSize, gapSize: gapSize,
        });
        matY = new LineMaterial({
            color: yAxisColor,
            linewidth: lineWidth,
            resolution: currentSize,
            dashed: true, dashScale: 1, dashSize: dashSize, gapSize: gapSize,
        });
        matZ = new LineMaterial({
            color: zAxisColor,
            linewidth: lineWidth,
            resolution: currentSize,
            dashed: true, dashScale: 1, dashSize: dashSize, gapSize: gapSize,
        });

        // Create Geometries
        geomX = new LineGeometry();
        geomX.setPositions([...origin.toArray(), ...intermediateX.toArray()]);
        geomY = new LineGeometry();
        geomY.setPositions([...intermediateX.toArray(), ...intermediateXY.toArray()]);
        geomZ = new LineGeometry();
        geomZ.setPositions([...intermediateXY.toArray(), ...endPoint.toArray()]);

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

        // console.log('[VectorAnatomy] Component Lines created.');
      } else {
         console.warn('[VectorAnatomy] Wrapper size is zero, cannot create component lines.');
      }
    }

    // Return cleanup function
    return () => {
        // console.log('[VectorAnatomy] Cleaning up component lines (onMount cleanup)...');
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
    <T.PerspectiveCamera
      makeDefault
      position={[2, 3, 8]}
      fov={50}
    >
      <OrbitControls
        enableZoom={true}
        enablePan={true}
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
    {@const axisGeom = new CylinderGeometry(axisIndicatorRadius, axisIndicatorRadius, axisIndicatorLength, 8)}
    <!-- X Axis Indicator -->
    <T.Mesh
        geometry={axisGeom}
        position.x={axisIndicatorLength / 2}
        rotation.z={-Math.PI / 2} >
        <T.MeshBasicMaterial color={xAxisColor} />
    </T.Mesh>
    <Billboard position={[axisIndicatorLength + axisLabelOffset, 0, 0]}>
        <Text text="X+" fontSize={axisLabelFontSize} color={xAxisColor} />
    </Billboard>

    <!-- Y Axis Indicator -->
     <T.Mesh
        geometry={axisGeom}
        position.y={axisIndicatorLength / 2} >
         <T.MeshBasicMaterial color={yAxisColor} />
    </T.Mesh>
     <Billboard position={[0, axisIndicatorLength + axisLabelOffset, 0]}>
        <Text text="Y+" fontSize={axisLabelFontSize} color={yAxisColor} />
    </Billboard>

    <!-- Z Axis Indicator -->
     <T.Mesh
        geometry={axisGeom}
        position.z={axisIndicatorLength / 2}
        rotation.x={Math.PI / 2} >
         <T.MeshBasicMaterial color={zAxisColor} />
    </T.Mesh>
     <Billboard position={[0, 0, axisIndicatorLength + axisLabelOffset]}>
        <Text text="Z+" fontSize={axisLabelFontSize} color={zAxisColor} />
    </Billboard>

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
                color={xAxisColor}
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
                color={yAxisColor}
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
                color={zAxisColor}
                transparent={true}
                opacity={0.4}
                dashArray={0.1}
                dashRatio={0.5}
            />
        </T.Mesh>
    {/if}

    <!-- Labels -->
    <Billboard position={tailLabelPos.toArray()}>
        <Text
            text="Tail (Start)"
            fontSize={labelFontSize}
            color={labelColor}
            anchorX="center"
            anchorY="top"
            depthTest={false}
        />
    </Billboard>
    <Billboard position={headLabelPos.toArray()}>
        <Text
            text="Head (End)"
            fontSize={labelFontSize}
            color={labelColor}
            anchorX="center"
            anchorY="bottom"
            depthTest={false}
        />
    </Billboard>
     <Billboard position={magnitudeLabelPos.toArray()}>
        <Text
            text={`Magnitude`}
            fontSize={labelFontSize}
            color={labelColor}
            anchorX="center"
            anchorY="middle"
            depthTest={false}
        />
    </Billboard>

    <!-- Component Labels -->
    {#if Math.abs(components.x) > 0.01}
      <Billboard position={xCompLabelPos.toArray()}>
          <Text
              text={`X Component`}
              fontSize={labelFontSize * 0.9}
              color={xAxisColor}
              anchorX="center"
              anchorY="bottom"
              depthTest={false}
          />
      </Billboard>
    {/if}
    {#if Math.abs(components.y) > 0.01}
      <Billboard position={yCompLabelPos.toArray()}>
          <Text
              text={`Y Component`}
              fontSize={labelFontSize * 0.9}
              color={yAxisColor}
              anchorX="left"
              anchorY="middle"
              depthTest={false}
          />
      </Billboard>
    {/if}
    {#if Math.abs(components.z) > 0.01}
      <Billboard position={zCompLabelPos.toArray()}>
          <Text
              text={`Z Component`}
              fontSize={labelFontSize * 0.9}
              color={zAxisColor}
              anchorX="center"
              anchorY="bottom"
              depthTest={false}
          />
      </Billboard>
    {/if}

    <!-- Direction Angle Labels (Repositioned) -->
    <Billboard position={alphaLabelPos.toArray()}>
        <Text
            text="α"
            fontSize={angleLabelFontSize}
            color={xAxisColor}
            anchorX="center"
            anchorY="middle"
            depthTest={false}
        />
    </Billboard>
    <Billboard position={betaLabelPos.toArray()}>
        <Text
            text="β"
            fontSize={angleLabelFontSize}
            color={yAxisColor}
            anchorX="center"
            anchorY="middle"
            depthTest={false}
        />
    </Billboard>
    <Billboard position={gammaLabelPos.toArray()}>
        <Text
            text="γ"
            fontSize={angleLabelFontSize}
            color={zAxisColor}
            anchorX="center"
            anchorY="middle"
            depthTest={false}
        />
    </Billboard>

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
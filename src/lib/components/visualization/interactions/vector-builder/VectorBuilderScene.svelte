<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import {
    OrbitControls,
    Grid,
    Edges,
    Gizmo,
    Billboard,
    Text,
  } from '@threlte/extras';
  import { Vector3, Color, ArrowHelper } from 'three';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import { vectorData, traceVectorRequested, resetVectorBuilderRequested } from '$lib/stores/vectorBuilderState';
  import { get } from 'svelte/store';

  // --- Constants (reuse from calibration/state) ---
  const cornerOriginOffset = new Vector3(-6, 1, -6); // Consistent with PrinterCalibrationScene
  const initialWorldPosition = cornerOriginOffset.clone().add(new Vector3(0, 5, 0));

  // --- Colors (fetch from CSS later) ---
  let xAxisColor = 'red';
  let yAxisColor = 'lime';
  let zAxisColor = 'blue';
  let nozzleColor = '#4682b4';
  let nozzleEdgesColor = '#ADD8E6';
  let bedColor = '#ffffff';
  let bedEdgesColor = '#ADD8E6';
  let gridCellColor = '#ADD8E6';
  let gridSectionColor = '#64B5F6';
  let vectorColor = '#ff00ff'; // Magenta for the vector
  let startPointColor = '#FFA500'; // Orange
  let endPointColor = '#1E90FF';   // DodgerBlue

  // --- State ---
  // Animated nozzle position
  const animatedPosition = tweened(initialWorldPosition, {
    duration: 500,
    easing: cubicOut,
    interpolate: (a, b) => {
      const vec = a.clone();
      return t => vec.lerpVectors(a, b, t);
    }
  });

  // --- Derived World Positions --- //
  let vectorStartWorld = $derived.by(() => {
    const start = $vectorData?.start;
    if (!start) return null;
    return cornerOriginOffset.clone().add(new Vector3(start.x, start.y, start.z));
  });

  let vectorEndWorld = $derived.by(() => {
    const end = $vectorData?.end;
    if (!end) return null;
    return cornerOriginOffset.clone().add(new Vector3(end.x, end.y, end.z));
  });

  // --- Effects --- //
  // React to trace requests
  $effect(() => {
    if ($traceVectorRequested) {
      console.log('[VectorScene] Trace requested');
      // Access derived values directly (no $ needed)
      const start = vectorStartWorld;
      const end = vectorEndWorld;

      if (start && end) { // Explicit null check
        // Sequence: Instant move to start, then tween to end
        animatedPosition.set(start, { duration: 0 }).then(() => {
            // Check distance to avoid issues if start === end
            const distance = start.distanceTo(end);
            const duration = distance * 100; // Duration based on length
            if (distance > 0.01) { // Only tween if points are different
                animatedPosition.set(end, { duration: Math.max(500, duration), easing: cubicOut });
            }
        });
      } else {
        console.warn('[VectorScene] Trace requested but points invalid.');
      }
      traceVectorRequested.set(false); // Reset flag
    }
  });

  // React to reset requests
  $effect(() => {
    if ($resetVectorBuilderRequested) {
      console.log('[VectorScene] Reset requested');
      animatedPosition.set(initialWorldPosition, { duration: 0 });
      // State reset (like clearing coords) should happen in the store/HUD
      resetVectorBuilderRequested.set(false); // Reset flag
    }
  });

  onMount(() => {
    // TODO: Fetch CSS color variables like in PrinterCalibrationScene
  });

</script>

<!-- Basic Lighting -->
<T.AmbientLight intensity={1} />

<T.PerspectiveCamera
	makeDefault
	position={[0, 30, 5]}
>
	<OrbitControls
		enableZoom={true}
		enablePan={false}
		maxPolarAngle={Math.PI / 2}
		maxDistance={50}
		minDistance={10}
  >
    <Gizmo placement='bottom-left' />
	</OrbitControls>
</T.PerspectiveCamera>

<!-- Base Scene Elements (Bed, Grid, Axes - Copy/Adapt from PrinterCalibrationScene) -->
<Grid
    position.y={1.1}
    sectionsSize={10}
    gridSize={12}
    sectionThickness={1}
    cellColor={gridCellColor}
    sectionColor={gridSectionColor}
/>
<T.Mesh position.y={0.5}>
    <T.BoxGeometry args={[12, 1, 12]}/>
    <T.MeshBasicMaterial color={bedColor} />
    <Edges color={bedEdgesColor} />
</T.Mesh>

<!-- Axes Group at Corner -->
<T.Group position={[-6, 1, -6]}>
  {@const axisThickness = 0.08}
  {@const axisLengthX = 12}
  {@const axisLengthY = 10}
  {@const axisLengthZ = 12}
  {@const axisOpacity = 0.4}
  <!-- X Axis -->
  <T.Mesh position.x={axisLengthX / 2}>
    <T.BoxGeometry args={[axisLengthX, axisThickness, axisThickness]} />
    <T.MeshBasicMaterial color={xAxisColor} transparent={true} opacity={axisOpacity} />
  </T.Mesh>
  <!-- Y Axis -->
  <T.Mesh position.y={axisLengthY / 2}>
    <T.BoxGeometry args={[axisThickness, axisLengthY, axisThickness]} />
    <T.MeshBasicMaterial color={yAxisColor} transparent={true} opacity={axisOpacity} />
  </T.Mesh>
  <!-- Z Axis -->
  <T.Mesh position.z={axisLengthZ / 2}>
    <T.BoxGeometry args={[axisThickness, axisThickness, axisLengthZ]} />
    <T.MeshBasicMaterial color={zAxisColor} transparent={true} opacity={axisOpacity} />
  </T.Mesh>
  <!-- TODO: Add Ticks & Numbers if desired (copy from PrinterCalibrationScene) -->
</T.Group>

<!-- Nozzle Group -->
<T.Group position={$animatedPosition.toArray()}>
  <T.Mesh position.y={1}>
    <T.BoxGeometry args={[1, 2, 1]}/>
    <T.MeshBasicMaterial color={nozzleColor} transparent={true} opacity={0.75} />
    <Edges color={nozzleEdgesColor} />
  </T.Mesh>
  <!-- TODO: Add Height Indicator if desired -->
</T.Group>

<!-- Vector Visualization -->
{#if vectorStartWorld && vectorEndWorld && $vectorData}
  {@const direction = vectorEndWorld.clone().sub(vectorStartWorld).normalize()}
  {@const distance = vectorStartWorld.distanceTo(vectorEndWorld)}
  {@const vectorColorObj = new Color(vectorColor)}

  {#if distance > 0.01} <!-- Only draw if points are distinct -->
    {@const arrow = new ArrowHelper(
        direction,
        vectorStartWorld,
        distance,
        vectorColorObj.getHex(),
        distance * 0.1,
        distance * 0.05
    )}
    <T is={arrow} />
  {/if}

  <!-- Start Point Marker -->
  <T.Mesh position={vectorStartWorld.toArray()}>
    <T.SphereGeometry args={[0.25]} />
    <T.MeshBasicMaterial color={startPointColor} />
  </T.Mesh>

  <!-- End Point Marker -->
  <T.Mesh position={vectorEndWorld.toArray()}>
    <T.SphereGeometry args={[0.25]} />
    <T.MeshBasicMaterial color={endPointColor} />
  </T.Mesh>

  <!-- Coordinate Labels -->
  {@const labelOffsetY = 0.5}
  {@const labelFontSize = 0.5}
  {@const startLabelText = `(${ $vectorData.start.x }, ${ $vectorData.start.y }, ${ $vectorData.start.z })`}
  <Billboard position={[vectorStartWorld.x, vectorStartWorld.y + labelOffsetY, vectorStartWorld.z]}>
      <Text
        text={startLabelText}
        fontSize={labelFontSize}
        color={startPointColor}
        anchorX="center"
        anchorY="middle"
        depthTest={false}
      />
  </Billboard>
  {@const endLabelText = `(${ $vectorData.end.x }, ${ $vectorData.end.y }, ${ $vectorData.end.z })`}
  <Billboard position={[vectorEndWorld.x, vectorEndWorld.y + labelOffsetY, vectorEndWorld.z]}>
      <Text
        text={endLabelText}
        fontSize={labelFontSize}
        color={endPointColor}
        anchorX="center"
        anchorY="middle"
        depthTest={false}
      />
  </Billboard>
{/if}
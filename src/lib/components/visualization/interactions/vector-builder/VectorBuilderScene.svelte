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
  import { get } from 'svelte/store';
  import {
    vectorData, traceVectorRequested, resetVectorBuilderRequested, MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_Z, MAX_Z,
    xAxisColor, yAxisColor, zAxisColor,
    nozzleColor, nozzleEdgesColor, heightIndicatorColor,
    bedColor, bedEdgesColor, gridCellColor, gridSectionColor,
    vectorColor, startPointColor, endPointColor,
    showVectorDialog
  } from '$lib/stores/vectorBuilderState';

  // --- Constants (reuse from calibration/state) ---
  const cornerOriginOffset = new Vector3(-6, 1, -6); // Consistent with PrinterCalibrationScene
  const initialWorldPosition = cornerOriginOffset.clone().add(new Vector3(0, 5, 0));

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

  // --- Visual Helper Data Generation (Copied from PrinterCalibrationScene) ---
  const gridNumbers: { text: string, x: number, z: number, axis: 'x' | 'z' }[] = [];
  const step = 2;
  const gridSizeVal = 12;
  const numberYOffset = .5;
  const numberOutwardOffset = .8;
  for (let i = 0; i <= gridSizeVal; i += step) gridNumbers.push({ text: `${i}`, x: i, z: -numberOutwardOffset, axis: 'x' });
  for (let i = step; i <= gridSizeVal; i += step) gridNumbers.push({ text: `${i}`, x: -numberOutwardOffset, z: i, axis: 'z' });

  const tickStep = 2;
  const tickSize = 0.15;
  const tickLength = 0.5;
  const tickOpacity = 0.8;
  const yAxisLength = MAX_Y; // Use MAX_Y from state
  const xAxisLength = MAX_X; // Use MAX_X from state
  const zAxisLength = MAX_Z; // Use MAX_Z from state
  const xTicks: number[] = [];
  const zTicks: number[] = [];
  const yTicks: number[] = [];
  for (let i = tickStep; i < xAxisLength; i += tickStep) xTicks.push(i);
  for (let i = tickStep; i < zAxisLength; i += tickStep) zTicks.push(i);
  for (let i = tickStep; i <= yAxisLength; i += tickStep) yTicks.push(i);

  const labelOffset = 1.0;
  const labelYPos = 1.0;
  const labelFontSizeAxis = 0.8; // Renamed to avoid conflict
  const xLabelWorldPos = cornerOriginOffset.clone().add(new Vector3(xAxisLength + labelOffset, 0, 0));
  const yLabelWorldPos = cornerOriginOffset.clone().add(new Vector3(0, yAxisLength + labelOffset, 0));
  const zLabelWorldPos = cornerOriginOffset.clone().add(new Vector3(0, 0, zAxisLength + labelOffset));

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
    // Fetch CSS color variables and update stores
    if (typeof window !== 'undefined') {
      const styles = getComputedStyle(document.documentElement);
      // Update axis color stores
      xAxisColor.set(styles.getPropertyValue('--axis-color-x').trim() || get(xAxisColor));
      yAxisColor.set(styles.getPropertyValue('--axis-color-y').trim() || get(yAxisColor));
      zAxisColor.set(styles.getPropertyValue('--axis-color-z').trim() || get(zAxisColor));

      // Update other scene color stores
      nozzleColor.set(styles.getPropertyValue('--calibration-nozzle-color').trim() || get(nozzleColor));
      nozzleEdgesColor.set(styles.getPropertyValue('--calibration-nozzle-edges-color').trim() || get(nozzleEdgesColor));
      heightIndicatorColor.set(styles.getPropertyValue('--calibration-height-indicator-color').trim() || get(heightIndicatorColor));
      bedColor.set(styles.getPropertyValue('--calibration-bed-color').trim() || get(bedColor));
      bedEdgesColor.set(styles.getPropertyValue('--calibration-bed-edges-color').trim() || get(bedEdgesColor));
      gridCellColor.set(styles.getPropertyValue('--scene-grid-cell-color').trim() || get(gridCellColor));
      gridSectionColor.set(styles.getPropertyValue('--scene-grid-section-color').trim() || get(gridSectionColor));
      vectorColor.set(styles.getPropertyValue('--vector-builder-vector-color').trim() || get(vectorColor));
      startPointColor.set(styles.getPropertyValue('--vector-builder-start-color').trim() || get(startPointColor));
      endPointColor.set(styles.getPropertyValue('--vector-builder-end-color').trim() || get(endPointColor));

      console.log('[VectorScene] Fetched Colors and updated stores');
    }

    // Show initial dialog
    showVectorDialog([
        { speaker: 'Leo', message: 'Okay, Surya, let\'s test a specific move. Define a start and end point using the controls. This defines a vector – the exact path the nozzle will follow.' },
        { speaker: 'Surya', message: 'Got it. Start point... end point... So the vector is just the straight line between them?' },
        { speaker: 'Leo', message: 'Precisely! And it has both a direction and a length, or magnitude. Enter some points and see.' }
    ]);
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
    cellColor={$gridCellColor}
    sectionColor={$gridSectionColor}
/>
<T.Mesh position.y={0.5}>
    <T.BoxGeometry args={[12, 1, 12]}/>
    <T.MeshBasicMaterial color={$bedColor} />
    <Edges color={$bedEdgesColor} />
</T.Mesh>

<!-- Axes Group at Corner -->
<T.Group position={[-6, 1, -6]}>
  {@const axisThickness = 0.08}
  {@const axisLengthX = MAX_X}
  {@const axisLengthY = MAX_Y}
  {@const axisLengthZ = MAX_Z}
  {@const axisOpacity = 0.4}
  <!-- X Axis -->
  <T.Mesh position.x={axisLengthX / 2}>
    <T.BoxGeometry args={[axisLengthX, axisThickness, axisThickness]} />
    <T.MeshBasicMaterial color={$xAxisColor} transparent={true} opacity={axisOpacity} />
  </T.Mesh>
  <!-- Y Axis -->
  <T.Mesh position.y={axisLengthY / 2}>
    <T.BoxGeometry args={[axisThickness, axisLengthY, axisThickness]} />
    <T.MeshBasicMaterial color={$yAxisColor} transparent={true} opacity={axisOpacity} />
  </T.Mesh>
  <!-- Z Axis -->
  <T.Mesh position.z={axisLengthZ / 2}>
    <T.BoxGeometry args={[axisThickness, axisThickness, axisLengthZ]} />
    <T.MeshBasicMaterial color={$zAxisColor} transparent={true} opacity={axisOpacity} />
  </T.Mesh>

  <!-- X Axis Ticks (Copied) -->
  {#each xTicks as x (x)}
    <T.Mesh position.x={x}>
      <T.BoxGeometry args={[axisThickness / 2, tickSize, tickLength]} />
      <T.MeshBasicMaterial color={$xAxisColor} transparent={true} opacity={tickOpacity} />
    </T.Mesh>
  {/each}

  <!-- Z Axis Ticks (Copied) -->
  {#each zTicks as z (z)}
    <T.Mesh position.z={z}>
      <T.BoxGeometry args={[tickLength, tickSize, axisThickness / 2]} />
      <T.MeshBasicMaterial color={$zAxisColor} transparent={true} opacity={tickOpacity} />
    </T.Mesh>
  {/each}

  <!-- Y Axis Ticks (Copied) -->
  {#each yTicks as y (y)}
    <T.Mesh position.y={y}>
      <T.BoxGeometry args={[tickSize, axisThickness / 2, tickSize]} />
      <T.MeshBasicMaterial color={$yAxisColor} transparent={true} opacity={tickOpacity} />
    </T.Mesh>
  {/each}

</T.Group>

<!-- Grid Numbers (Near Axes Only) (Copied) -->
{#each gridNumbers as num}
  {@const worldPos = cornerOriginOffset.clone().add(new Vector3(num.x, 0, num.z))}
  {@const numColor = num.axis === 'x' ? $xAxisColor : $zAxisColor}
  <Billboard position={[worldPos.x, numberYOffset, worldPos.z]}>
    <Text
      text={num.text}
      fontSize={0.6}
      color={numColor}
      anchorX="center"
      anchorY="middle"
      depthTest={false}
    />
  </Billboard>
{/each}

<!-- Y Axis Numbers (Copied) -->
{#each yTicks as y (y)}
  {@const worldPos = cornerOriginOffset.clone().add(new Vector3(0, y, 0))}
  {@const yNumberOffset = 0.4}
  <Billboard position={[worldPos.x - yNumberOffset, worldPos.y, worldPos.z - yNumberOffset]}>
    <Text
      text={y.toString()}
      fontSize={0.6}
      color={$yAxisColor}
      anchorX="center"
      anchorY="middle"
      depthTest={false}
    />
  </Billboard>
{/each}

<!-- Axis Labels (Copied) -->
<Billboard position={[xLabelWorldPos.x, labelYPos, xLabelWorldPos.z]}>
  <Text text="X" fontSize={labelFontSizeAxis} color={$xAxisColor} anchorX="center" anchorY="middle" depthTest={false} />
</Billboard>
<Billboard position={[yLabelWorldPos.x, yLabelWorldPos.y, yLabelWorldPos.z]}>
  <Text text="Y" fontSize={labelFontSizeAxis} color={$yAxisColor} anchorX="center" anchorY="middle" depthTest={false} />
</Billboard>
<Billboard position={[zLabelWorldPos.x, labelYPos, zLabelWorldPos.z]}>
  <Text text="Z" fontSize={labelFontSizeAxis} color={$zAxisColor} anchorX="center" anchorY="middle" depthTest={false} />
</Billboard>

<!-- Nozzle Group -->
<T.Group position={$animatedPosition.toArray()}>
  <T.Mesh position.y={1}>
    <T.BoxGeometry args={[1, 2, 1]}/>
    <T.MeshBasicMaterial color={$nozzleColor} transparent={true} opacity={0.75} />
    <Edges color={$nozzleEdgesColor} />
  </T.Mesh>
  <!-- Height Indicator Cylinder (Copied) -->
  {@const indicatorHeight = $animatedPosition.y - cornerOriginOffset.y} // Height from bed surface (world Y=1) to nozzle bottom
  {#if indicatorHeight > 0.01}
    <T.Mesh position.y={-indicatorHeight / 2}>
      <T.CylinderGeometry args={[0.05, 0.05, indicatorHeight, 8]} />
      <T.MeshBasicMaterial color={$heightIndicatorColor} transparent={true} opacity={0.6} />
    </T.Mesh>
  {/if}
</T.Group>

<!-- Vector Visualization -->
{#if vectorStartWorld && vectorEndWorld && $vectorData}
  {@const direction = vectorEndWorld.clone().sub(vectorStartWorld).normalize()}
  {@const distance = vectorStartWorld.distanceTo(vectorEndWorld)}
  {@const vectorColorObj = new Color($vectorColor)}

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
  {@const startLabelText = `(${ $vectorData.start.x }, ${ $vectorData.start.y }, ${ $vectorData.start.z })`}
  <Billboard position={[vectorStartWorld.x, vectorStartWorld.y + labelOffsetY, vectorStartWorld.z]}>
      <Text
        text={startLabelText}
        fontSize={labelFontSize}
        color={$startPointColor}
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
        color={$endPointColor}
        anchorX="center"
        anchorY="middle"
        depthTest={false}
      />
  </Billboard>
{/if}
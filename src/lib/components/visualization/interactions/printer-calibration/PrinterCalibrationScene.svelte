<script lang="ts">
	import { T, useTask } from '@threlte/core'
  import {
    Environment,
    Grid,
    OrbitControls,
    SoftShadows,
    TransformControls,
    interactivity,
    Edges,
    Gizmo,
    Billboard,
    Text,
    HTML
  } from '@threlte/extras'
  import { Vector3, Group, Quaternion, Euler, Vector2, Color } from 'three'
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    showCalibrationDialog,
    requestedNozzlePosition,
    resetSceneRequested,
    showDialog,
    MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_Z, MAX_Z // Import constants if defined in store
  } from '$lib/stores/calibrationState';
  import { get } from 'svelte/store'; // To read store value once

  interactivity()

  const dispatch = createEventDispatcher();

  // --- Props (using $props) ---
  let { targets = [], currentStage = 1 } = $props<{ targets?: { id: string; x: number; y: number; z: number }[]; currentStage?: number }>();

  // --- Resolved CSS Color State ---
  let xAxisColor = $state('red');
  let yAxisColor = $state('lime');
  let zAxisColor = $state('blue');
  // Calibration specific colors
  let nozzleColor = $state('#4682b4');
  let nozzleEdgesColor = $state('#ADD8E6');
  let heightIndicatorColor = $state('#ADD8E6');
  let bedColor = $state('#ffffff');
  let bedEdgesColor = $state('#ADD8E6');
  let gridCellColor = $state('#ADD8E6'); // Re-use scene grid color
  let gridSectionColor = $state('#64B5F6'); // Re-use scene grid color
  // Target Sphere Colors (read from CSS)
  let targetPendingColor = $state('#FFA500'); // Orange
  let targetHitColor = $state('#32CD32');   // LimeGreen
  // Target Label Colors (darker defaults, can be overridden by CSS)
  let targetLabelPendingColor = $state('#FFA500'); // Darker Amber/Orange
  let targetLabelHitColor = $state('#32CD32');   // Darker Green

  // --- Constants ---
  const cornerOriginOffset = new Vector3(-6, 1, -6);
  const targetProximityThreshold = 0.3; // How close the nozzle needs to be
  const initialWorldPosition = cornerOriginOffset.clone().add(new Vector3(0, 5, 0));

  // --- Core State ---
  const animatedPosition = tweened(initialWorldPosition, {
    duration: 500, // Animation duration in ms
    easing: cubicOut, // Apply easing
    interpolate: (a, b) => {
      // Custom interpolator for Vector3
      const vec = a.clone();
      return t => vec.lerpVectors(a, b, t);
    }
  });
  let hitTargets = $state(new Set<string>());

  // --- Reactive Logic ---
  // Reset hitTargets when targets prop changes (new stage) - USE $effect
  $effect(() => {
    // This effect runs whenever 'targets' changes.
    // We access targets here to establish the dependency.
    const _numTargets = targets.length;
    console.log('[PrinterCalibration] targets.length changed, resetting hits.');
    hitTargets = new Set();
  });

  // Calculate World Positions and store relative coords for Targets (reactive) - USE $derived.by
  const targetDetails = $derived.by(() => {
    return targets.map((target: { id: string; x: number; y: number; z: number }) => ({
      id: target.id,
      x: target.x, // Store original relative X
      y: target.y, // Store original relative Y (used to be relativeY)
      z: target.z, // Store original relative Z
      worldPos: cornerOriginOffset.clone().add(new Vector3(target.x, target.y, target.z))
    }));
  });

  // Check for target proximity & stage completion - USE $effect
  $effect(() => {
    // Dependencies: $animatedPosition, targetDetails (which depends on targets)
    const currentNozzlePos = $animatedPosition;
    let newlyHit = false;
    // Add explicit type for target within the loop
    targetDetails.forEach((target: { id: string; x: number; y: number; z: number; worldPos: Vector3 }) => { // Update type here
      if (!hitTargets.has(target.id)) {
        let distance = Infinity;
        const targetWorldPos = target.worldPos; // Cache for logging clarity
        if (target.y === 0) { // Check original relative Y
          // Calculate XZ distance for targets on the bed
          const nozzleXZ = new Vector2(currentNozzlePos.x, currentNozzlePos.z);
          const targetXZ = new Vector2(targetWorldPos.x, targetWorldPos.z);
          distance = nozzleXZ.distanceTo(targetXZ);
        } else {
          // Calculate 3D distance for targets with height (future)
          distance = currentNozzlePos.distanceTo(targetWorldPos);
        }

        if (distance < targetProximityThreshold) {
          console.log(`[PrinterCalibration] Hit target: ${target.id}`);
          hitTargets.add(target.id);
          hitTargets = new Set(hitTargets);
          newlyHit = true; // Flag that a hit occurred
        }
      }
    });

    // If a hit occurred, update the Set reactivity and check for stage completion
    if (newlyHit) {
      if (hitTargets.size === targets.length && targets.length > 0) {
        // Dispatch stageComplete for stage 1
        if (currentStage === 1) {
           console.log('[PrinterCalibration] Stage 1 targets hit! Dispatching stageComplete & showing dialog.');
           showCalibrationDialog([
               { speaker: 'Leo', message: "Alright, not bad, Surya! You managed the X and Z axes without *too* much trouble." },
               { speaker: 'Surya', message: "Heh, piece of cake. What's next, rocket science?" },
               { speaker: 'Leo', message: "Focus. Think you can handle adding height? Let's see you hit these next points, including the Y value." }
           ]);
           dispatch('stageComplete');
        }
        // Dispatch allStagesComplete for stage 2
        else if (currentStage === 2) {
           console.log('[PrinterCalibration] Stage 2 targets hit! Dispatching allStagesComplete & showing dialog.');
           showCalibrationDialog([
               { speaker: 'Leo', message: "Wow...I can't believe it... You actually got it perfectly calibrated." },
               { speaker: 'Surya', message: "Told you! See? Hands-on beats staring at formulas any day." },
               { speaker: 'Leo', message: "...Let's just say precision isn't so bad. Now the nozzle will know exactly where to go." }
           ]);
           dispatch('allStagesComplete');
        }
      }
    }
  });

  // React to move requests from the store
  $effect(() => {
    const requestedPos = $requestedNozzlePosition;
    if (requestedPos) {
      console.log(`[PrinterCalibration] Store requested move to relative: ${requestedPos.x}, ${requestedPos.y}, ${requestedPos.z}`);
      setTargetPosition(requestedPos.x, requestedPos.y, requestedPos.z);
      requestedNozzlePosition.set(null); // Reset store value after processing
    }
  });

  // React to reset requests from the store
  $effect(() => {
    if ($resetSceneRequested) {
      console.log('[PrinterCalibration] Store requested scene reset.');
      resetSceneInternal(); // Call internal reset logic
      resetSceneRequested.set(false); // Reset store flag
    }
  });

  // --- API Functions ---
  export function setTargetPosition(x: number, y: number, z: number) {
    console.log(`[PrinterCalibration] Received target relative to corner: ${x}, ${y}, ${z}`);
    // Calculate world position by adding offset to the relative input
    const targetWorldPosition = cornerOriginOffset.clone().add(new Vector3(x, y, z));
    console.log(`[PrinterCalibration] Setting animated target to: ${targetWorldPosition.x}, ${targetWorldPosition.y}, ${targetWorldPosition.z}`);
    // Set the target for the tweened store
    animatedPosition.set(targetWorldPosition);
  }

  // Internal reset logic, called by store effect or potentially other internal needs
  function resetSceneInternal() {
    console.log('[PrinterCalibration] Resetting scene...');
    // Reset nozzle position to initial state
    const initialWorldPosition = cornerOriginOffset.clone().add(new Vector3(0, 5, 0));
    animatedPosition.set(initialWorldPosition, { duration: 0 }); // Reset immediately

    // Reset hit targets
    hitTargets = new Set(); // Reassign for reactivity

    // Show reset dialog via store
    showCalibrationDialog([
        { speaker: 'Leo', message: "Alright, take two! Focus this time, Surya." },
        { speaker: 'Surya', message: "Okay, okay, I'm focusing! No need to hover." },
        { speaker: 'Leo', message: "Just guide the nozzle to that first target (T0) in the corner. You got this... probably." }
    ]);

    // Note: Stage reset is handled by the parent component dispatching the event
  }

  // --- Fetch CSS Variables on Mount ---
  onMount(() => {
    const styles = getComputedStyle(document.documentElement);
    // Axis
    xAxisColor = styles.getPropertyValue('--axis-color-x').trim() || xAxisColor;
    yAxisColor = styles.getPropertyValue('--axis-color-y').trim() || yAxisColor;
    zAxisColor = styles.getPropertyValue('--axis-color-z').trim() || zAxisColor;
    // Calibration Scene
    nozzleColor = styles.getPropertyValue('--calibration-nozzle-color').trim() || nozzleColor;
    nozzleEdgesColor = styles.getPropertyValue('--calibration-nozzle-edges-color').trim() || nozzleEdgesColor;
    heightIndicatorColor = styles.getPropertyValue('--calibration-height-indicator-color').trim() || heightIndicatorColor;
    bedColor = styles.getPropertyValue('--calibration-bed-color').trim() || bedColor;
    bedEdgesColor = styles.getPropertyValue('--calibration-bed-edges-color').trim() || bedEdgesColor;
    gridCellColor = styles.getPropertyValue('--scene-grid-cell-color').trim() || gridCellColor; // Use scene grid var
    gridSectionColor = styles.getPropertyValue('--scene-grid-section-color').trim() || gridSectionColor; // Use scene grid var
    // Target Sphere Colors
    targetPendingColor = styles.getPropertyValue('--calibration-target-pending-color').trim() || targetPendingColor;
    targetHitColor = styles.getPropertyValue('--calibration-target-hit-color').trim() || targetHitColor;
    // Target Label Colors (fetch overrides or use darker defaults)
    targetLabelPendingColor = styles.getPropertyValue('--calibration-target-label-pending-color').trim() || targetLabelPendingColor;
    targetLabelHitColor = styles.getPropertyValue('--calibration-target-label-hit-color').trim() || targetLabelHitColor;

    console.log('[PrinterCalibration] Fetched Colors:', { xAxisColor, yAxisColor, zAxisColor, nozzleColor, bedColor, targetPendingColor, targetHitColor, targetLabelPendingColor, targetLabelHitColor });

    // Show initial dialog only if the store isn't already showing one (e.g., on reset)
    if (!get(showDialog)) { // Use get() for one-time read on the ACTUAL store
        showCalibrationDialog([
            { speaker: 'Leo', message: "Alright Surya, pop quiz time, but with hardware. We need to calibrate this printer so it knows its exact coordinates." },
            { speaker: 'Surya', message: "Hardware quiz? My kind of test. Lay it on me." },
            { speaker: 'Leo', message: "Think of it like teaching it basic geometry. See those targets? Your job is to move the nozzle using the controls and hit T0 first. Don't break anything." }
        ]);
    }
  });

  // --- Visual Helper Data Generation ---
  // Generate Grid Number Positions & Text
  const gridNumbers: { text: string, x: number, z: number, axis: 'x' | 'z' }[] = [];
  const step = 2;
  const gridSizeVal = 12;
  const numberYOffset = .5;
  const numberOutwardOffset = .8;

  // Along Z=-offset (near X-axis)
  for (let i = 0; i <= gridSizeVal; i += step) { // Include 12
    gridNumbers.push({ text: `${i}`, x: i, z: -numberOutwardOffset, axis: 'x' });
  }
  // Along X=-offset (near Z-axis)
  for (let i = step; i <= gridSizeVal; i += step) { // Include 12, start from step
    gridNumbers.push({ text: `${i}`, x: -numberOutwardOffset, z: i, axis: 'z' });
  }
  // REMOVED LOOPS FOR FAR EDGES

  // Generate Tick Positions
  const tickStep = 2;
  const tickSize = 0.15;
  const tickLength = 0.5; // Length for elongated X/Z ticks
  const tickOpacity = 0.8; // Separate opacity for ticks
  const yAxisLength = 10; // Match Y axis length
  const xAxisLength = 12;
  const zAxisLength = 12;
  const xTicks: number[] = [];
  const zTicks: number[] = [];
  const yTicks: number[] = []; // Add Y ticks array
  for (let i = tickStep; i < xAxisLength; i += tickStep) xTicks.push(i);
  for (let i = tickStep; i < zAxisLength; i += tickStep) zTicks.push(i);
  for (let i = tickStep; i <= yAxisLength; i += tickStep) yTicks.push(i); // Generate Y ticks up to max height

  // Define Label Constants
  const labelOffset = 1.0;
  const labelYPos = 1.0;
  const labelFontSize = 0.8;
  const xLabelWorldPos = cornerOriginOffset.clone().add(new Vector3(xAxisLength + labelOffset, 0, 0));
  const yLabelWorldPos = cornerOriginOffset.clone().add(new Vector3(0, yAxisLength + labelOffset, 0));
  const zLabelWorldPos = cornerOriginOffset.clone().add(new Vector3(0, 0, zAxisLength + labelOffset));

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


<!-- Nozzle Group -->
<T.Group position={$animatedPosition.toArray()}>
  <!-- Actual Nozzle Mesh, offset vertically -->
  <T.Mesh position.y={1}>
    <T.BoxGeometry args={[1, 2, 1]}/>
    <T.MeshBasicMaterial color={nozzleColor} transparent={true} opacity={0.75} />
    <Edges color={nozzleEdgesColor} />
  </T.Mesh>

  <!-- Height Indicator Cylinder -->
  {@const indicatorHeight = $animatedPosition.y - 1} // Height from bed surface (world Y=1) to nozzle bottom (world Y=$animatedPosition.y)
  {#if indicatorHeight > 0.01} // Only show if nozzle is noticeably above the bed
    <T.Mesh position.y={-indicatorHeight / 2}> // Position center relative to group origin (nozzle bottom)
      <T.CylinderGeometry args={[0.05, 0.05, indicatorHeight, 8]} />
      <T.MeshBasicMaterial color={heightIndicatorColor} transparent={true} opacity={0.6} />
    </T.Mesh>
  {/if}
</T.Group>

<!-- Printer Bed-->
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
  <!-- Custom Axes Lines -->
  {@const axisThickness = 0.08}
  {@const axisLengthX = 12}
  {@const axisLengthY = 10}
  {@const axisLengthZ = 12}
  {@const axisOpacity = 0.4} // Define opacity
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

  <!-- X Axis Ticks -->
  {#each xTicks as x (x)}
    <T.Mesh position.x={x}>
      <T.BoxGeometry args={[axisThickness / 2, tickSize, tickLength]} />
      <T.MeshBasicMaterial color={xAxisColor} transparent={true} opacity={tickOpacity} />
    </T.Mesh>
  {/each}

  <!-- Z Axis Ticks -->
  {#each zTicks as z (z)}
    <T.Mesh position.z={z}>
      <T.BoxGeometry args={[tickLength, tickSize, axisThickness / 2]} />
      <T.MeshBasicMaterial color={zAxisColor} transparent={true} opacity={tickOpacity} />
    </T.Mesh>
  {/each}

  <!-- Y Axis Ticks -->
  {#each yTicks as y (y)}
    <T.Mesh position.y={y}>
      <T.BoxGeometry args={[tickSize, axisThickness / 2, tickSize]} />
      <T.MeshBasicMaterial color={yAxisColor} transparent={true} opacity={tickOpacity} />
    </T.Mesh>
  {/each}

</T.Group>

<!-- Grid Numbers (Near Axes Only) -->
{#each gridNumbers as num}
  {@const worldPos = cornerOriginOffset.clone().add(new Vector3(num.x, 0, num.z))}
  {@const numColor = num.axis === 'x' ? xAxisColor : zAxisColor}
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

<!-- Y Axis Numbers -->
{#each yTicks as y (y)}
  {@const worldPos = cornerOriginOffset.clone().add(new Vector3(0, y, 0))}
  {@const yNumberOffset = 0.4}
  <Billboard position={[worldPos.x - yNumberOffset, worldPos.y, worldPos.z - yNumberOffset]}> // Offset diagonally away
    <Text
      text={y.toString()}
      fontSize={0.6}
      color={yAxisColor}
      anchorX="center"
      anchorY="middle"
      depthTest={false}
    />
  </Billboard>
{/each}

<!-- Axis Labels -->
<!-- X Label -->
<Billboard position={[xLabelWorldPos.x, labelYPos, xLabelWorldPos.z]}>
  <Text text="X" fontSize={labelFontSize} color={xAxisColor} anchorX="center" anchorY="middle" depthTest={false} />
</Billboard>
<!-- Y Label -->
<Billboard position={[yLabelWorldPos.x, yLabelWorldPos.y, yLabelWorldPos.z]}>
  <Text text="Y" fontSize={labelFontSize} color={yAxisColor} anchorX="center" anchorY="middle" depthTest={false} />
</Billboard>
<!-- Z Label -->
<Billboard position={[zLabelWorldPos.x, labelYPos, zLabelWorldPos.z]}>
  <Text text="Z" fontSize={labelFontSize} color={zAxisColor} anchorX="center" anchorY="middle" depthTest={false} />
</Billboard>

<!-- Target Point Markers -->
{#each targetDetails as target (target.id)}
  {@const isHit = hitTargets.has(target.id)}
  {@const sphereColor = isHit ? targetHitColor : targetPendingColor}
  {@const labelColor = isHit ? targetLabelHitColor : targetLabelPendingColor}
  {@const labelOffsetY = 0.7}
  {@const labelOffsetZ = -0.}
  {@const labelFontSize = 0.7}
  {@const coordinateText = `(${target.x}, ${target.y}, ${target.z})`}
  {@const outlineColor = '#FFFFFF'}
  {@const outlineWidth = 0.03}

  <!-- Target Sphere -->
  <T.Mesh position={target.worldPos.toArray()}>
    <T.SphereGeometry args={[0.2]} />
    <T.MeshBasicMaterial color={sphereColor} />
  </T.Mesh>

  <!-- Vertical Line for Stage 2 targets (Y > 0) -->
  {#if target.y > 0}
    {@const lineColor = isHit ? targetHitColor : targetPendingColor}
    {@const lineOpacity = isHit ? 1 : 0.5}
    {@const lineHeight = target.worldPos.y - 1}
    {@const lineCenterY = 1 + lineHeight / 2}
    <T.Mesh position={[target.worldPos.x, lineCenterY, target.worldPos.z]}>
      <T.CylinderGeometry args={[0.03, 0.03, lineHeight, 6]} />
      <T.MeshBasicMaterial color={lineColor} transparent={true} opacity={lineOpacity} />
    </T.Mesh>
  {/if}

  <!-- Target Label (shows ID initially, coords when hit) -->
  <Billboard position={[target.worldPos.x, target.worldPos.y + labelOffsetY, target.worldPos.z + labelOffsetZ]}>
    <Text
      text={isHit ? coordinateText : target.id}
      fontSize={labelFontSize}
      color={labelColor}
      anchorX="center"
      anchorY="middle"
      depthTest={false}
      {outlineColor}
      {outlineWidth}
    />
  </Billboard>
{/each}
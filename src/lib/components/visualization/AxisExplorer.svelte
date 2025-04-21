<script lang="ts">
  import { T, Canvas } from '@threlte/core';
  import { OrbitControls, Billboard, Text } from '@threlte/extras';
  import { AmbientLight, ArrowHelper, BufferAttribute, BufferGeometry, Color, DirectionalLight, LineBasicMaterial, Mesh, MeshBasicMaterial, PerspectiveCamera, SphereGeometry, Vector3 } from 'three';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // --- State for Colors (Initialized with defaults, updated onMount) ---
  let xAxisColor = $state(new Color('#EF5350')); // Default Red
  let yAxisColor = $state(new Color('#66BB6A')); // Default Green
  let zAxisColor = $state(new Color('#2C8FFF')); // Default Blue
  let originColor = $state(new Color('#cccccc')); // Default Grey

  // Keep origin sphere white for contrast
  const originSphereColor = new Color('#ffffff');

  // --- Scene Setup ---
  const axesSize = 5;
  const labelFontSize = 0.5;
  const originLabelFontSize = 0.8;

  const originGeometry = new SphereGeometry(0.1, 16, 16);
  const originMaterial = new MeshBasicMaterial({ color: originSphereColor });

  const labelOffset = 0.4;
  const xLabelPos = new Vector3(axesSize + labelOffset, 0, 0);
  const yLabelPos = new Vector3(0, axesSize + labelOffset, 0);
  const zLabelPos = new Vector3(0, 0, axesSize + labelOffset);

  // New, more offset position for the Origin label
  const originLabelConnectorEndPos = new Vector3(0.5,.5, 0.5); // Moved Y higher

  // Define constants for ArrowHelper directions and origin
  const originVec = new Vector3(0, 0, 0);
  const xDir = new Vector3(1, 0, 0);
  const yDir = new Vector3(0, 1, 0);
  const zDir = new Vector3(0, 0, 1);

  // Arrow head size (optional adjustment)
  const headLength = axesSize * 0.1;
  const headWidth = headLength * 0.6;

  // --- Fetch Colors on Mount ---
  onMount(() => {
    if (browser) {
      const styles = getComputedStyle(document.documentElement);
      // Update state variables with colors from CSS variables
      xAxisColor = new Color(styles.getPropertyValue('--axis-color-x').trim() || '#EF5350');
      yAxisColor = new Color(styles.getPropertyValue('--axis-color-y').trim() || '#66BB6A');
      zAxisColor = new Color(styles.getPropertyValue('--axis-color-z').trim() || '#2C8FFF');
      // Use text-secondary for origin label for theme consistency
      originColor = new Color(styles.getPropertyValue('--color-text-secondary').trim() || '#cccccc');
    }
  });

</script>

<div class="axis-explorer-wrapper">
  <Canvas>
    <T.PerspectiveCamera
      makeDefault
      position={[axesSize * 1.5, axesSize * 1.5, axesSize * 1.5]}
      fov={60}
    >
      <OrbitControls
        maxDistance={axesSize * 2}
        minDistance={axesSize * 0.5}
        enableDamping
        target={[0, axesSize / 4, 0]}
      />
    </T.PerspectiveCamera>

    <T.AmbientLight intensity={0.8} />

    <!-- Add Individual ArrowHelpers -->
    {@const xAxisArrow = new ArrowHelper(xDir, originVec, axesSize, xAxisColor.getHex(), headLength, headWidth)}
    <T is={xAxisArrow} />

    {@const yAxisArrow = new ArrowHelper(yDir, originVec, axesSize, yAxisColor.getHex(), headLength, headWidth)}
    <T is={yAxisArrow} />

    {@const zAxisArrow = new ArrowHelper(zDir, originVec, axesSize, zAxisColor.getHex(), headLength, headWidth)}
    <T is={zAxisArrow} />

    <!-- Origin Marker -->
    <T.Mesh geometry={originGeometry} material={originMaterial} position={[0, 0, 0]} />

    <!-- Origin Label Connector Line -->
    {@const linePoints = new Float32Array([
        originVec.x, originVec.y, originVec.z, // Start at origin sphere center
        originLabelConnectorEndPos.x, originLabelConnectorEndPos.y, originLabelConnectorEndPos.z // End at label position
    ])}
    {@const lineGeometry = new BufferGeometry()}
    {@const _ = lineGeometry.setAttribute('position', new BufferAttribute(linePoints, 3))}
    {@const lineMaterial = new LineBasicMaterial({ color: originColor })}
    <T.Line geometry={lineGeometry} material={lineMaterial} />

    <!-- Labels using Billboard and Text (using state colors) -->
    <Billboard position={xLabelPos.toArray()}>
        <Text
            text="X"
            fontSize={labelFontSize}
            color={xAxisColor}
            anchorX="center"
            anchorY="middle"
            depthTest={false}
        />
    </Billboard>
    <Billboard position={yLabelPos.toArray()}>
        <Text
            text="Y"
            fontSize={labelFontSize}
            color={yAxisColor}
            anchorX="center"
            anchorY="middle"
            depthTest={false}
        />
    </Billboard>
    <Billboard position={zLabelPos.toArray()}>
        <Text
            text="Z"
            fontSize={labelFontSize}
            color={zAxisColor}
            anchorX="center"
            anchorY="middle"
            depthTest={false}
        />
    </Billboard>
    <Billboard position={originLabelConnectorEndPos.toArray()} >
        <Text
            text="Origin (0,0,0)"
            fontSize={originLabelFontSize}
            color={originColor}
            anchorX="center"
            anchorY="bottom"
            depthTest={false}
        />
    </Billboard>

  </Canvas>
</div>

<style>
  .axis-explorer-wrapper {
    /* Styles mimicking .exercise-wrapper */
    display: flex;
    flex-direction: column;
    position: relative;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background-color: var(--color-background ); /* Confirmed: using theme variable */
    margin-bottom: var(--space-l);

    /* Original sizing styles */
    height: 400px;
    width: 100%;
    overflow: hidden;
  }

</style>
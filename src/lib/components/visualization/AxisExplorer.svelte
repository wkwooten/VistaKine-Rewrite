<script lang="ts">
  import RendererSetup from "./helpers/RendererSetup.svelte";
  import { T, Canvas } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import {
    AmbientLight,
    ArrowHelper,
    BufferAttribute,
    BufferGeometry,
    Color,
    DirectionalLight,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    SphereGeometry,
    Vector3,
  } from "three";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import SceneLabel from "./helpers/SceneLabel.svelte";
  import {
    xAxisColor as xAxisColorStore,
    yAxisColor as yAxisColorStore,
    zAxisColor as zAxisColorStore,
    originColor as originColorStore,
  } from "$lib/stores/themeColors";

  // Keep origin sphere white for contrast
  const originSphereColor = new Color("#ffffff");

  // --- Scene Setup ---
  const axesSize = 5;
  const labelFontSize = 0.6;
  const originLabelFontSize = 0.8;

  const originGeometry = new SphereGeometry(0.1, 16, 16);
  const originMaterial = new MeshBasicMaterial({ color: originSphereColor });

  const labelOffset = 0.4;
  const xLabelPos = new Vector3(axesSize + labelOffset, 0, 0);
  const yLabelPos = new Vector3(0, axesSize + labelOffset, 0);
  const zLabelPos = new Vector3(0, 0, axesSize + labelOffset);

  // New, more offset position for the Origin label
  const originLabelConnectorEndPos = new Vector3(0.5, -2, 0.5); // Moved Y higher

  // Define constants for ArrowHelper directions and origin
  const originVec = new Vector3(0, 0, 0);
  const xDir = new Vector3(1, 0, 0);
  const yDir = new Vector3(0, 1, 0);
  const zDir = new Vector3(0, 0, 1);

  // Arrow head size (optional adjustment)
  const headLength = axesSize * 0.1;
  const headWidth = headLength * 0.6;
</script>

<div class="axis-explorer-wrapper">
  <Canvas>
    <RendererSetup />
    <T.PerspectiveCamera
      makeDefault
      position={[axesSize * 1.5, axesSize * 1.5, axesSize * 1.5]}
      fov={60}
    >
      <OrbitControls
        enablePan={false}
        maxDistance={axesSize * 3}
        minDistance={axesSize * 0.5}
        enableDamping
        target={[0, axesSize / 4, 0]}
      />
    </T.PerspectiveCamera>

    <T.AmbientLight intensity={0.8} />

    <!-- Add Individual ArrowHelpers -->
    {@const xAxisArrow = new ArrowHelper(
      xDir,
      originVec,
      axesSize,
      new Color($xAxisColorStore).getHex(),
      headLength,
      headWidth
    )}
    <T is={xAxisArrow} />

    {@const yAxisArrow = new ArrowHelper(
      yDir,
      originVec,
      axesSize,
      new Color($yAxisColorStore).getHex(),
      headLength,
      headWidth
    )}
    <T is={yAxisArrow} />

    {@const zAxisArrow = new ArrowHelper(
      zDir,
      originVec,
      axesSize,
      new Color($zAxisColorStore).getHex(),
      headLength,
      headWidth
    )}
    <T is={zAxisArrow} />

    <!-- Origin Marker -->
    <T.Mesh
      geometry={originGeometry}
      material={originMaterial}
      position={[0, 0, 0]}
    />

    <!-- Origin Label Connector Line -->
    {@const linePoints = new Float32Array([
      originVec.x,
      originVec.y,
      originVec.z, // Start at origin sphere center
      originLabelConnectorEndPos.x,
      originLabelConnectorEndPos.y,
      originLabelConnectorEndPos.z, // End at label position
    ])}
    {@const lineGeometry = new BufferGeometry()}
    {@const _ = lineGeometry.setAttribute(
      "position",
      new BufferAttribute(linePoints, 3)
    )}
    {@const lineMaterial = new LineBasicMaterial({
      color: new Color($originColorStore),
    })}
    <T.Line geometry={lineGeometry} material={lineMaterial} />

    <!-- Labels using SceneLabel (state colors are passed directly) -->
    <SceneLabel
      text="X axis"
      position={xLabelPos}
      fontSize={labelFontSize}
      color={$xAxisColorStore}
      anchorX="center"
      anchorY="middle"
    />
    <SceneLabel
      text="Y axis"
      position={yLabelPos}
      fontSize={labelFontSize}
      color={$yAxisColorStore}
      anchorX="center"
      anchorY="middle"
    />
    <SceneLabel
      text="Z axis"
      position={zLabelPos}
      fontSize={labelFontSize}
      color={$zAxisColorStore}
      anchorX="center"
      anchorY="middle"
    />
    <SceneLabel
      text="Origin (0,0,0)"
      position={originLabelConnectorEndPos}
      fontSize={originLabelFontSize}
      anchorX="center"
      anchorY="middle"
    />
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
    background-color: var(
      --color-background
    ); /* Confirmed: using theme variable */
    margin-bottom: var(--space-l);

    /* Original sizing styles */
    height: 400px;
    width: 100%;
    overflow: hidden;
  }
</style>

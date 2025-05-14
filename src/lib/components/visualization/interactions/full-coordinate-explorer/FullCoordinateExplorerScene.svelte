<script lang="ts">
  import RendererSetup from "../../helpers/RendererSetup.svelte"; // Adjusted path
  import { T, Canvas } from "@threlte/core";
  import { OrbitControls, Text } from "@threlte/extras";
  import {
    Color,
    Vector3,
    BufferGeometry,
    LineBasicMaterial,
    SphereGeometry,
    MeshBasicMaterial,
  } from "three";
  import {
    xAxisColor as xAxisColorStore,
    yAxisColor as yAxisColorStore,
    zAxisColor as zAxisColorStore,
    originColor as originColorStore,
  } from "$lib/stores/themeColors";

  // --- Props for interactivity (will be controlled by CoordinateInputPanel) ---
  let { x = 1, y = 1, z = 1 } = $props(); // Default point

  // --- Scene Setup ---
  const axesLength = 5; // Length of axis in one direction (e.g., -5 to +5)
  const originSphereColor = new Color("#ffffff");

  const originGeometry = new SphereGeometry(0.1, 16, 16);
  const originMaterial = new MeshBasicMaterial({ color: originSphereColor });

  const pointGeometry = new SphereGeometry(0.15, 16, 16);
  const pointMaterial = new MeshBasicMaterial({ color: "#ff00ff" }); // Bright color for the point

  // Reactive point position
  let pointPositionVector = $derived(new Vector3(x, y, z));
  let pointPositionArray: [number, number, number] = $derived([x, y, z]); // Explicitly typed tuple

  // Reactive label for the point
  let pointLabelText = $derived("(" + x + ", " + y + ", " + z + ")"); // Explicit string concatenation

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
    const material = new LineBasicMaterial({ color: new Color(color) });
    return { geometry, material };
  }

  const xAxis = createAxisLine("x", $xAxisColorStore);
  const yAxis = createAxisLine("y", $yAxisColorStore);
  const zAxis = createAxisLine("z", $zAxisColorStore);

  const labelOffset = 0.4;
  const labelFontSize = 0.5;
</script>

<Canvas>
  <RendererSetup />
  <T.PerspectiveCamera
    makeDefault
    position={[axesLength * 1.2, axesLength * 1.2, axesLength * 1.2]}
    fov={75}
  >
    <OrbitControls enablePan={true} enableDamping target={[0, 0, 0]} />
  </T.PerspectiveCamera>

  <T.AmbientLight intensity={0.7} />
  <T.DirectionalLight intensity={0.5} position={[5, 5, 5]} />

  <!-- Axes -->
  <T.Line geometry={xAxis.geometry} material={xAxis.material} />
  <T.Line geometry={yAxis.geometry} material={yAxis.material} />
  <T.Line geometry={zAxis.geometry} material={zAxis.material} />

  <!-- Origin Marker -->
  <T.Mesh
    geometry={originGeometry}
    material={originMaterial}
    position={[0, 0, 0]}
  />

  <!-- Point Marker -->
  <T.Mesh
    geometry={pointGeometry}
    material={pointMaterial}
    position={pointPositionArray}
  />

  <!-- Labels for Axes -->
  <Text
    text="+X"
    position={[axesLength + labelOffset, 0, 0]}
    color={$xAxisColorStore}
    fontSize={labelFontSize}
    anchorX="left"
  />
  <Text
    text="-X"
    position={[-axesLength - labelOffset, 0, 0]}
    color={$xAxisColorStore}
    fontSize={labelFontSize}
    anchorX="right"
  />
  <Text
    text="+Y"
    position={[0, axesLength + labelOffset, 0]}
    color={$yAxisColorStore}
    fontSize={labelFontSize}
    anchorY="top"
  />
  <Text
    text="-Y"
    position={[0, -axesLength - labelOffset, 0]}
    color={$yAxisColorStore}
    fontSize={labelFontSize}
    anchorY="bottom"
  />
  <Text
    text="+Z"
    position={[0, 0, axesLength + labelOffset]}
    color={$zAxisColorStore}
    fontSize={labelFontSize}
    anchorX="left"
  />
  <Text
    text="-Z"
    position={[0, 0, -axesLength - labelOffset]}
    color={$zAxisColorStore}
    fontSize={labelFontSize}
    anchorX="right"
  />
  <Text
    text="Origin (0,0,0)"
    position={[0.2, -0.2, 0]}
    color={$originColorStore}
    fontSize={labelFontSize * 0.9}
  />

  <!-- Label for the interactive point -->
  <Text
    text={pointLabelText}
    position={[
      pointPositionVector.x,
      pointPositionVector.y + 0.3,
      pointPositionVector.z,
    ]}
    color="#ff00ff"
    fontSize={labelFontSize * 0.9}
  />
</Canvas>

<style lang="scss">
  /* No specific styles needed here for now, canvas takes full parent size */
</style>

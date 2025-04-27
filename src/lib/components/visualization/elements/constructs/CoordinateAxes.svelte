<script lang="ts">
  import { T } from "@threlte/core";
  import { Vector3 } from "three";
  import type { ColorRepresentation } from "three";
  import SceneLabel from "../../helpers/SceneLabel.svelte"; // Adjust path as needed

  // Define props
  let {
    cornerOriginOffset = new Vector3(-6, 1, -6),
    xAxisColor = "red" as ColorRepresentation,
    yAxisColor = "lime" as ColorRepresentation,
    zAxisColor = "blue" as ColorRepresentation,
    axisLengthX = 12,
    axisLengthY = 12,
    axisLengthZ = 12,
    axisThickness = 0.08,
    axisOpacity = 0.4,
    tickStep = 2,
    tickSize = 0.15,
    tickLength = 0.5,
    tickOpacity = 0.8,
    gridNumberStep = 2,
    gridSizeVal = 12,
    numberYOffset = 0.5,
    numberOutwardOffset = 0.8,
    yNumberOffset = 0.4, // Offset for Y numbers
    labelOffset = 0.5, // Offset for X, Y, Z labels
    labelYPos = 0.1, // Y Position for X, Z labels
    labelFontSize = 0.8,
    labelFontSizeGridNum = 0.6,
  } = $props<{
    cornerOriginOffset?: Vector3;
    xAxisColor?: ColorRepresentation;
    yAxisColor?: ColorRepresentation;
    zAxisColor?: ColorRepresentation;
    axisLengthX?: number;
    axisLengthY?: number;
    axisLengthZ?: number;
    axisThickness?: number;
    axisOpacity?: number;
    tickStep?: number;
    tickSize?: number;
    tickLength?: number;
    tickOpacity?: number;
    gridNumberStep?: number;
    gridSizeVal?: number;
    numberYOffset?: number;
    numberOutwardOffset?: number;
    yNumberOffset?: number;
    labelOffset?: number;
    labelYPos?: number;
    labelFontSize?: number;
    labelFontSizeGridNum?: number;
  }>();

  // --- Derived Calculation for Ticks & Labels (Internal to this component) ---

  // Ticks
  const xTicks: number[] = [];
  const zTicks: number[] = [];
  const yTicks: number[] = [];
  for (let i = tickStep; i < axisLengthX; i += tickStep) xTicks.push(i);
  for (let i = tickStep; i < axisLengthZ; i += tickStep) zTicks.push(i);
  for (let i = tickStep; i <= axisLengthY; i += tickStep) yTicks.push(i);

  // Grid Numbers
  const gridNumbers: { text: string; x: number; z: number; axis: "x" | "z" }[] =
    [];
  for (let i = 0; i <= gridSizeVal; i += gridNumberStep) {
    gridNumbers.push({
      text: `${i}`,
      x: i,
      z: -numberOutwardOffset,
      axis: "x",
    });
  }
  for (let i = gridNumberStep; i <= gridSizeVal; i += gridNumberStep) {
    gridNumbers.push({
      text: `${i}`,
      x: -numberOutwardOffset,
      z: i,
      axis: "z",
    });
  }

  // Axis Label Positions
  const xLabelWorldPos = cornerOriginOffset
    .clone()
    .add(new Vector3(axisLengthX + labelOffset, 0, 0));
  const yLabelWorldPos = cornerOriginOffset
    .clone()
    .add(new Vector3(0, axisLengthY + labelOffset, 0));
  const zLabelWorldPos = cornerOriginOffset
    .clone()
    .add(new Vector3(0, 0, axisLengthZ + labelOffset));
</script>

<!-- Axes Group at Corner -->
<T.Group position={cornerOriginOffset.toArray()}>
  <!-- X Axis -->
  <T.Mesh position.x={axisLengthX / 2}>
    <T.BoxGeometry args={[axisLengthX, axisThickness, axisThickness]} />
    <T.MeshBasicMaterial
      color={xAxisColor}
      transparent={true}
      opacity={axisOpacity}
    />
  </T.Mesh>
  <!-- Y Axis -->
  <T.Mesh position.y={axisLengthY / 2}>
    <T.BoxGeometry args={[axisThickness, axisLengthY, axisThickness]} />
    <T.MeshBasicMaterial
      color={yAxisColor}
      transparent={true}
      opacity={axisOpacity}
    />
  </T.Mesh>
  <!-- Z Axis -->
  <T.Mesh position.z={axisLengthZ / 2}>
    <T.BoxGeometry args={[axisThickness, axisThickness, axisLengthZ]} />
    <T.MeshBasicMaterial
      color={zAxisColor}
      transparent={true}
      opacity={axisOpacity}
    />
  </T.Mesh>

  <!-- X Axis Ticks -->
  {#each xTicks as x (x)}
    <T.Mesh position.x={x}>
      <T.BoxGeometry args={[axisThickness / 2, tickSize, tickLength]} />
      <T.MeshBasicMaterial
        color={xAxisColor}
        transparent={true}
        opacity={tickOpacity}
      />
    </T.Mesh>
  {/each}

  <!-- Z Axis Ticks -->
  {#each zTicks as z (z)}
    <T.Mesh position.z={z}>
      <T.BoxGeometry args={[tickLength, tickSize, axisThickness / 2]} />
      <T.MeshBasicMaterial
        color={zAxisColor}
        transparent={true}
        opacity={tickOpacity}
      />
    </T.Mesh>
  {/each}

  <!-- Y Axis Ticks -->
  {#each yTicks as y (y)}
    <T.Mesh position.y={y}>
      <T.BoxGeometry args={[tickSize, axisThickness / 2, tickSize]} />
      <T.MeshBasicMaterial
        color={yAxisColor}
        transparent={true}
        opacity={tickOpacity}
      />
    </T.Mesh>
  {/each}

  <!-- Grid Numbers (Relative to Group Origin) -->
  {#each gridNumbers as num}
    {@const numColor = num.axis === "x" ? xAxisColor : zAxisColor}
    {@const relativeY = numberYOffset - cornerOriginOffset.y}
    <SceneLabel
      position={[num.x, relativeY, num.z]}
      text={num.text}
      fontSize={labelFontSizeGridNum}
      color={numColor}
      anchorX="center"
      anchorY="middle"
      depthTest={false}
    />
  {/each}

  <!-- Y Axis Numbers (Relative to Group Origin) -->
  {#each yTicks as y (y)}
    <SceneLabel
      position={[-yNumberOffset, y, -yNumberOffset]}
      text={y.toString()}
      fontSize={labelFontSizeGridNum}
      color={yAxisColor}
      anchorX="center"
      anchorY="middle"
      depthTest={false}
    />
  {/each}

  <!-- Axis Labels (Positioned relative to group origin) -->
  <SceneLabel
    position={[axisLengthX + labelOffset, labelYPos, 0]}
    text="+X"
    fontSize={labelFontSize}
    color={xAxisColor}
    anchorX="center"
    anchorY="middle"
    depthTest={false}
  />
  <SceneLabel
    position={[0, axisLengthY + labelOffset, 0]}
    text="+Y"
    fontSize={labelFontSize}
    color={yAxisColor}
    anchorX="center"
    anchorY="middle"
    depthTest={false}
  />
  <SceneLabel
    position={[0, labelYPos, axisLengthZ + labelOffset]}
    text="+Z"
    fontSize={labelFontSize}
    color={zAxisColor}
    anchorX="center"
    anchorY="middle"
    depthTest={false}
  />
</T.Group>

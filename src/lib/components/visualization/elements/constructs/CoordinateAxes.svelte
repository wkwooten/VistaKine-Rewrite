<script lang="ts">
  import { T } from "@threlte/core";
  import { Vector3 } from "three";
  import type { ColorRepresentation } from "three";
  import SceneLabel from "../../helpers/SceneLabel.svelte";
  import { xAxisColor, yAxisColor, zAxisColor } from "$lib/stores/themeColors";
  // Define props
  let {
    cornerOriginOffset = new Vector3(-6, 1, -6),
    axisLengthX = 12,
    axisLengthY = 12,
    axisLengthZ = 12,
    axisThickness = 0.08,
    axisOpacity = 1,
    tickStep = 2,
    tickSize = 0.15,
    tickLength = 0.5,
    tickOpacity = 0.8,
    gridNumberStep = 2,
    gridSizeVal = 12,
    numberYOffset = -0.5,
    numberOutwardOffset = 0.8,
    yNumberOffset = 0.4, // Offset for Y numbers
    labelOffset = 1.0, // Offset for X, Y, Z labels
    labelYPos = 0.1, // Y Position for X, Z labels - REVERTED to original constructs default
    labelFontSize = 0.8,
    labelFontSizeGridNum = 0.6,
    axisLabelFontSize = 0.5,
  } = $props<{
    cornerOriginOffset?: Vector3;
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
    axisLabelFontSize?: number;
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
      color={$xAxisColor}
      transparent={false}
      depthWrite={true}
    />
  </T.Mesh>
  <!-- Y Axis -->
  <T.Mesh position.y={axisLengthY / 2}>
    <T.BoxGeometry args={[axisThickness, axisLengthY, axisThickness]} />
    <T.MeshBasicMaterial
      color={$yAxisColor}
      transparent={false}
      depthWrite={true}
      renderOrder={0}
    />
  </T.Mesh>
  <!-- Z Axis -->
  <T.Mesh position.z={axisLengthZ / 2}>
    <T.BoxGeometry args={[axisThickness, axisThickness, axisLengthZ]} />
    <T.MeshBasicMaterial
      color={$zAxisColor}
      transparent={true}
      opacity={1}
      depthWrite={true}
    />
  </T.Mesh>

  <!-- X Axis Ticks -->
  {#each xTicks as x (x)}
    <T.Mesh position.x={x}>
      <T.BoxGeometry args={[axisThickness / 2, tickSize, tickLength]} />
      <T.MeshBasicMaterial
        color={$xAxisColor}
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
        color={$zAxisColor}
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
        color={$yAxisColor}
        transparent={true}
        opacity={tickOpacity}
      />
    </T.Mesh>
  {/each}

  <!-- Grid Numbers (Relative to Group Origin) -->
  {#each gridNumbers as num}
    {@const numColor = num.axis === "x" ? $xAxisColor : $zAxisColor}
    <SceneLabel
      position={[num.x, numberYOffset, num.z]}
      text={num.text}
      fontSize={labelFontSizeGridNum}
      color={numColor}
      anchorX="center"
      anchorY="middle"
      depthTest={true}
    />
  {/each}

  <!-- Y Axis Numbers (Relative to Group Origin) -->
  {#each yTicks as y (y)}
    <SceneLabel
      position={[yNumberOffset, y, yNumberOffset]}
      text={y.toString()}
      fontSize={labelFontSizeGridNum}
      color={$yAxisColor}
      anchorX="center"
      anchorY="middle"
      depthTest={true}
      backgroundOpacity={1}
      renderOrder={2}
    />
  {/each}

  <!-- Axis Labels (Positioned relative to group origin) -->
  <SceneLabel
    position={[axisLengthX + labelOffset, labelYPos, 0]}
    text="+X"
    fontSize={axisLabelFontSize}
    color={"white"}
    backgroundColor={$xAxisColor}
    anchorX="center"
    anchorY="middle"
    padding={0.2}
  />
  <SceneLabel
    position={[0, axisLengthY + labelOffset, 0]}
    text="+Y"
    fontSize={axisLabelFontSize}
    color={"white"}
    backgroundColor={$yAxisColor}
    anchorX="center"
    anchorY="middle"
    padding={0.2}
  />
  <SceneLabel
    position={[0, labelYPos, axisLengthZ + labelOffset]}
    text="+Z"
    fontSize={axisLabelFontSize}
    color={"white"}
    backgroundColor={$zAxisColor}
    anchorX="center"
    anchorY="middle"
    padding={0.2}
  />
</T.Group>

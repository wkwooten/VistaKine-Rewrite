<script lang="ts">
  import { T } from "@threlte/core";
  import { Edges } from "@threlte/extras";
  import { Vector3 } from "three";
  import type { ColorRepresentation } from "three";

  // Define props
  let {
    position = new Vector3(0, 5, 0), // Default starting position (relative to world origin)
    cornerOriginOffset = new Vector3(-6, 1, -6), // Needed to calculate indicator height from bed
    nozzleColor = "#4682b4" as ColorRepresentation,
    nozzleEdgesColor = "#ADD8E6" as ColorRepresentation,
    heightIndicatorColor = "#ADD8E6" as ColorRepresentation,
    nozzleDimensions = [1, 2, 1] as [number, number, number],
    indicatorRadius = 0.05,
  } = $props<{
    position?: Vector3;
    cornerOriginOffset?: Vector3;
    nozzleColor?: ColorRepresentation;
    nozzleEdgesColor?: ColorRepresentation;
    heightIndicatorColor?: ColorRepresentation;
    nozzleDimensions?: [number, number, number];
    indicatorRadius?: number;
  }>();

  // Calculate indicator height based on the nozzle's world Y and the bed's world Y
  const indicatorHeight = $derived(position.y - cornerOriginOffset.y);
  // Center Y position for the indicator cylinder, relative to the group origin (nozzle bottom)
  const indicatorCenterY = $derived(-indicatorHeight / 2);
</script>

<!-- Nozzle Group -->
<T.Group position={position.toArray()}>
  <!-- Actual Nozzle Mesh, offset vertically within the group -->
  <T.Mesh position.y={nozzleDimensions[1] / 2}>
    <T.BoxGeometry args={nozzleDimensions} />
    <T.MeshBasicMaterial
      color={nozzleColor}
      transparent={true}
      opacity={0.75}
    />
    <Edges color={nozzleEdgesColor} />
  </T.Mesh>

  <!-- Height Indicator Cylinder -->
  {#if indicatorHeight > 0.01}
    <T.Mesh position.y={indicatorCenterY}>
      <T.CylinderGeometry
        args={[indicatorRadius, indicatorRadius, indicatorHeight, 8]}
      />
      <T.MeshBasicMaterial
        color={heightIndicatorColor}
        transparent={true}
        opacity={0.6}
      />
    </T.Mesh>
  {/if}
</T.Group>

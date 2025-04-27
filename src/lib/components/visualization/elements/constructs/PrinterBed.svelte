<script lang="ts">
  import { T } from "@threlte/core";
  import { Grid, Edges } from "@threlte/extras";
  import type { ColorRepresentation } from "three";

  // Define props for customization
  let {
    gridSize = 12,
    sectionsSize = 10,
    sectionThickness = 1,
    gridCellColor = "#ADD8E6",
    gridSectionColor = "#64B5F6",
    bedDimensions = [12, 1, 12] as [number, number, number],
    bedPositionY = 0.5,
    gridPositionY = 1.1,
    bedColor = "#ffffff" as ColorRepresentation,
    bedEdgesColor = "#ADD8E6" as ColorRepresentation,
  } = $props<{
    gridSize?: number;
    sectionsSize?: number;
    sectionThickness?: number;
    gridCellColor?: ColorRepresentation;
    gridSectionColor?: ColorRepresentation;
    bedDimensions?: [number, number, number];
    bedPositionY?: number;
    gridPositionY?: number;
    bedColor?: ColorRepresentation;
    bedEdgesColor?: ColorRepresentation;
  }>();
</script>

<!-- Grid -->
<Grid
  position.y={gridPositionY}
  {gridSize}
  {sectionsSize}
  {sectionThickness}
  cellColor={gridCellColor}
  sectionColor={gridSectionColor}
/>

<!-- Bed Mesh -->
<T.Mesh position.y={bedPositionY}>
  <T.BoxGeometry args={bedDimensions} />
  <T.MeshBasicMaterial color={bedColor} />
  <Edges color={bedEdgesColor} />
</T.Mesh>

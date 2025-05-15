<script lang="ts">
  import SceneLabel from "./SceneLabel.svelte";
  import {
    xAxisColor as axisThemeColor,
    surfaceColor as sfcColorStore,
  } from "$lib/stores/themeColors";
  import type { Color, Vector3 } from "three";

  // type SceneLabelProps = Parameters<typeof SceneLabel>[0]; // Keep for reference if needed later

  type AnchorX = "center" | "left" | "right";
  type AnchorY =
    | "middle"
    | "top"
    | "bottom"
    | "top-baseline"
    | "bottom-baseline";

  let {
    position,
    text = "X",
    fontSize = 0.35,
    backgroundColor = $sfcColorStore,
    padding = 0.1,
    borderRadius = 0.05,
    // Explicitly define other SceneLabel props for passthrough
    backgroundOpacity,
    backgroundSmoothness,
    anchorX,
    anchorY,
    depthTest,
    renderOrder,
    visible,
    ...rest // For any other Text component specific props
  } = $props<{
    position: Vector3 | [number, number, number];
    text?: string;
    fontSize?: number;
    backgroundColor?: Color | string | null | undefined;
    padding?: number;
    borderRadius?: number;
    // Optional SceneLabel specific props
    backgroundOpacity?: number;
    backgroundSmoothness?: number;
    anchorX?: AnchorX;
    anchorY?: AnchorY;
    depthTest?: boolean;
    renderOrder?: number;
    visible?: boolean;
    // Allow any other Text props via index signature for ...rest
    [key: string]: any;
  }>();
</script>

<SceneLabel
  {text}
  {position}
  color={$axisThemeColor}
  {fontSize}
  {backgroundColor}
  {padding}
  {borderRadius}
  {backgroundOpacity}
  {backgroundSmoothness}
  {anchorX}
  {anchorY}
  {depthTest}
  {renderOrder}
  {visible}
  {...rest}
/>

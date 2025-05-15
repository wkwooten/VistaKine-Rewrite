<script lang="ts">
  import SceneLabel from "./SceneLabel.svelte";
  import {
    zAxisColor as axisThemeColor,
    surfaceColor as sfcColorStore,
  } from "$lib/stores/themeColors";
  import type { Color, Vector3 } from "three";

  type AnchorX = "center" | "left" | "right";
  type AnchorY =
    | "middle"
    | "top"
    | "bottom"
    | "top-baseline"
    | "bottom-baseline";

  let {
    position,
    text = "Z",
    fontSize = 0.35,
    backgroundColor = $sfcColorStore,
    padding = 0.1,
    borderRadius = 0.05,
    backgroundOpacity,
    backgroundSmoothness,
    anchorX,
    anchorY,
    depthTest,
    renderOrder,
    visible,
    ...rest
  } = $props<{
    position: Vector3 | [number, number, number];
    text?: string;
    fontSize?: number;
    backgroundColor?: Color | string | null | undefined;
    padding?: number;
    borderRadius?: number;
    backgroundOpacity?: number;
    backgroundSmoothness?: number;
    anchorX?: AnchorX;
    anchorY?: AnchorY;
    depthTest?: boolean;
    renderOrder?: number;
    visible?: boolean;
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

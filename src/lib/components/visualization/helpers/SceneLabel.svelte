<!--
 @component
 SceneLabel
 A reusable component for displaying text labels within a Threlte scene using Billboard and Text.
 Handles common properties and allows pass-through of additional props to the Text component.
 Uses a RoundedBoxGeometry for the background plane.

 @prop {string} [text=''] - The text content of the label.
 @prop {Vector3 | [number, number, number]} [position=[0, 0, 0]] - The world position of the label. Can be a Three.js Vector3 or a [x, y, z] array.
 @prop {Color | string} [color='#ffffff'] - The color of the text. Can be a Three.js Color or a CSS color string.
 @prop {number} [fontSize=0.5] - The font size of the text.
 @prop {Color | string | null} [backgroundColor=null] - Background color for the label plane. If null, no background is shown.
 @prop {number} [backgroundOpacity=1.0] - Opacity of the background plane (0.0 to 1.0).
 @prop {number} [padding=0.1] - Padding around the text for the background plane (scaled by fontSize).
 @prop {number} [borderRadius=0.05] - Radius for the rounded corners of the background box.
 @prop {number} [backgroundSmoothness=4] - Number of segments per corner quarter-circle
 @prop {'center' | 'left' | 'right'} [anchorX='center'] - Horizontal anchor point for the text.
 @prop {'middle' | 'top' | 'bottom' | 'top-baseline' | 'bottom-baseline'} [anchorY='middle'] - Vertical anchor point for the text.
 @prop {boolean} [depthTest=true] - Whether the label should be depth-tested against other scene objects. Defaults to true (respects scene depth).
 @prop {number} [renderOrder] - Render order for the background mesh.
 @prop {Record<string, any>} [rest] - Any additional props will be passed directly to the underlying Threlte <Text> component (e.g., maxWidth, letterSpacing).
 @prop {boolean} [visible=true] - Whether the label is visible.
-->
<script lang="ts">
  import { T } from "@threlte/core";
  import { Billboard, Text } from "@threlte/extras";
  import {
    Color,
    Vector3,
    // BufferGeometry, // Removed
    // BufferAttribute, // Removed
    // Float32BufferAttribute, // Removed
    // Uint32BufferAttribute, // Removed
    // Mesh, // Removed
  } from "three";
  import {
    labelColor as lblColorStore,
    surfaceColor as sfcColorStore, // Will be used by LabelBackground eventually
  } from "$lib/stores/themeColors";
  import LabelBackground from "./LabelBackground.svelte";

  type AnchorX = "center" | "left" | "right";
  type AnchorY =
    | "middle"
    | "top"
    | "bottom"
    | "top-baseline"
    | "bottom-baseline";

  // Define common props with defaults
  let {
    text = "",
    position = [0, 0, 0] as Vector3 | [number, number, number],
    color = undefined as Color | string | undefined,
    fontSize = 0.5,
    backgroundColor = undefined as Color | string | null | undefined,
    backgroundOpacity = 1.0,
    padding = 0.2,
    borderRadius = 0.2,
    backgroundSmoothness = 4,
    anchorX = "center" as AnchorX,
    anchorY = "middle" as AnchorY,
    depthTest = true,
    renderOrder: componentRenderOrder = 5,
    visible = true,
    // Capture any other props passed in
    ...rest // Capture remaining props
  } = $props<{
    text?: string;
    position?: Vector3 | [number, number, number];
    color?: Color | string | undefined;
    fontSize?: number;
    backgroundColor?: Color | string | null | undefined;
    backgroundOpacity?: number;
    padding?: number;
    borderRadius?: number;
    backgroundSmoothness?: number;
    anchorX?: AnchorX;
    anchorY?: AnchorY;
    depthTest?: boolean;
    renderOrder?: number;
    visible?: boolean;
    // Allow any other Text props via index signature
    [key: string]: any;
  }>();

  // --- Reactive Calculations --- //
  let finalPosition = $derived(
    Array.isArray(position) ? position : position.toArray()
  );

  const resolvedTextColor = $derived(
    color !== undefined ? color : $lblColorStore
  );

  const resolvedBackgroundColorValue = $derived(
    backgroundColor !== undefined ? backgroundColor : $sfcColorStore
  );

  const actualBackgroundColor = $derived(
    backgroundColor === null ? null : resolvedBackgroundColorValue
  );

  // Calculations for background dimensions (will be passed to LabelBackground or used to compute props for it)
  const estimatedTextWidthWithPadding = $derived(
    text.length * fontSize * 0.55 + padding * 2 * fontSize
  );
  const estimatedTextHeightWithPadding = $derived(
    fontSize + padding * 2 * fontSize
  );

  // const labelBackgroundGeometry = $derived(...); // REMOVED
</script>

<Billboard
  {visible}
  position={finalPosition}
  renderOrder={componentRenderOrder}
>
  {#if actualBackgroundColor}
    <LabelBackground
      width={estimatedTextWidthWithPadding}
      height={estimatedTextHeightWithPadding}
      color={actualBackgroundColor}
      opacity={backgroundOpacity}
      {borderRadius}
      smoothness={backgroundSmoothness}
      {depthTest}
      renderOrder={componentRenderOrder}
      {visible}
    />
  {/if}

  <!-- Text Group (remains at z=0 relative to Billboard) -->
  <T.Group position.z={0.01}>
    <Text
      {text}
      {fontSize}
      color={new Color(resolvedTextColor)}
      {anchorX}
      {anchorY}
      renderOrder={componentRenderOrder}
      depthOffset={-10}
      materialParameters={{
        depthTest: depthTest,
        depthWrite: true,
        transparent: true,
      }}
      {...rest}
    />
  </T.Group>
</Billboard>

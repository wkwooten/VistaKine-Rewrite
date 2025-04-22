<!--
 @component
 SceneLabel
 A reusable component for displaying text labels within a Threlte scene using Billboard and Text.
 Handles common properties and allows pass-through of additional props to the Text component.

 @prop {string} [text=''] - The text content of the label.
 @prop {Vector3 | [number, number, number]} [position=[0, 0, 0]] - The world position of the label. Can be a Three.js Vector3 or a [x, y, z] array.
 @prop {Color | string} [color='#ffffff'] - The color of the text. Can be a Three.js Color or a CSS color string.
 @prop {number} [fontSize=0.5] - The font size of the text.
 @prop {'center' | 'left' | 'right'} [anchorX='center'] - Horizontal anchor point for the text.
 @prop {'middle' | 'top' | 'bottom' | 'top-baseline' | 'bottom-baseline'} [anchorY='middle'] - Vertical anchor point for the text.
 @prop {boolean} [depthTest=false] - Whether the label should be depth-tested against other scene objects. Defaults to false (always visible).
 @prop {Record<string, any>} [rest] - Any additional props will be passed directly to the underlying Threlte <Text> component (e.g., maxWidth, letterSpacing).
-->
<script lang="ts">
  import { T } from '@threlte/core';
  import { Billboard, Text } from '@threlte/extras';
  import type { Color, Vector3 } from 'three';

  type AnchorX = 'center' | 'left' | 'right';
  type AnchorY = 'middle' | 'top' | 'bottom' | 'top-baseline' | 'bottom-baseline';

  // Define common props with defaults
  let {
    text = '',
    position = [0, 0, 0] as Vector3 | [number, number, number], // Ensure type safety for default
    color = '#ffffff' as Color | string, // Ensure type safety for default
    fontSize = 0.5,
    anchorX = 'center' as AnchorX,
    anchorY = 'middle' as AnchorY,
    depthTest = false,
    // Capture any other props passed in
    ...rest // Capture remaining props
  } = $props<{
    text?: string;
    position?: Vector3 | [number, number, number];
    color?: Color | string;
    fontSize?: number;
    anchorX?: AnchorX;
    anchorY?: AnchorY;
    depthTest?: boolean;
    // Allow any other Text props via index signature
    [key: string]: any;
  }>();

  // --- Reactive Calculation for Position ---
  // This ensures that if the input `position` prop changes (even if it's an array),
  // the Billboard gets the updated array. If it's a Vector3, it converts reactively.
  let finalPosition = $derived(
    Array.isArray(position) ? position : position.toArray()
  );

</script>

<Billboard position={finalPosition}>
    <T.Group>
        <Text
            text={text}
            fontSize={fontSize}
            color={color}
            anchorX={anchorX}
            anchorY={anchorY}
            depthTest={depthTest}
            {...rest}
        />
    </T.Group>
</Billboard>
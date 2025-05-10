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
 @prop {Record<string, any>} [rest] - Any additional props will be passed directly to the underlying Threlte <Text> component (e.g., maxWidth, letterSpacing).
-->
<script lang="ts">
  import { T } from "@threlte/core";
  import { Billboard, Text } from "@threlte/extras";
  import {
    Color,
    Vector3,
    BufferGeometry,
    BufferAttribute,
    Float32BufferAttribute,
    Uint32BufferAttribute,
  } from "three";
  import {
    labelColor as lblColorStore,
    surfaceColor as sfcColorStore,
  } from "$lib/stores/themeColors";

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
    // Allow any other Text props via index signature
    [key: string]: any;
  }>();

  // --- Helper function to create rounded rectangle geometry ---
  // Adapted from: https://discourse.threejs.org/t/roundedrectangle-squircle/28645 (UPDATE 2022 by hofk)
  function createRectangleRounded(
    w: number,
    h: number,
    r: number,
    s: number
  ): BufferGeometry {
    const pi2 = Math.PI * 2;
    const n = (s + 1) * 4; // number of segments for the whole contour

    const indices: number[] = [];
    const positions: number[] = [];
    const uvs: number[] = [];

    // Center point for triangle fan
    positions.push(0, 0, 0);
    uvs.push(0.5, 0.5);

    // Generate contour points and connect them to the center
    for (let j = 0; j < n; j++) {
      // Add indices for the triangle: center, current point, next point
      // (j+1) is current contour point index in positions array (0 is center)
      // (j+2) is next contour point index (wrap around for the last one)
      indices.push(0, j + 1, ((j + 1) % n) + 1);

      // Generate contour point
      const qu = Math.trunc((j * 4) / n) + 1; // Quadrant: 1, 2, 3, 4 (TR, TL, BL, BR)

      // Sign for x and y based on quadrant
      // Q1 (TR): sgx=1, sgy=1
      // Q2 (TL): sgx=-1, sgy=1
      // Q3 (BL): sgx=-1, sgy=-1
      // Q4 (BR): sgx=1, sgy=-1
      const sgx = qu === 1 || qu === 4 ? 1 : -1;
      const sgy = qu < 3 ? 1 : -1;

      // Angle for the current segment within its corner arc
      // Each quadrant has `s+1` points including start/end of arc.
      // `s` segments make the arc.
      // We need to map `j` to an angle within the current corner's 90-degree arc.

      // `j_in_quad_period` = j % (s+1) (roughly, needs adjustment for total n)
      // `j_eff` maps j to a 0..s range for each corner
      let angle_offset_factor = 0;
      if (qu === 1)
        angle_offset_factor = 0; // 0 to PI/2
      else if (qu === 2)
        angle_offset_factor = 1; // PI/2 to PI
      else if (qu === 3)
        angle_offset_factor = 2; // PI to 3PI/2
      else if (qu === 4) angle_offset_factor = 3; // 3PI/2 to 2PI

      // Calculate effective j for the current corner's segments
      // Total points for arcs = 4 * s. Total points for contour = 4 * (s+1) if we include straight section start/end
      // The original formula for x,y seems to map j across the *entire* perimeter's segments.
      // n = (s+1)*4 means s+1 segments per quadrant.
      // (j - qu + 1) - this seems to be an index within a quadrant's "corner part"
      // (n-4) should be 4*s (total segments in all 4 corners)

      let x: number, y: number;
      const cornerAngle = (Math.PI / 2) * ((j % (n / 4)) / s - (qu - 1)); // Simplified attempt, might be wrong

      // Original formula from hofk, adapted:
      // The term (j - qu + 1) seems to be indexing segments within a theoretical continuous curve around corners
      // (n-4) is total segments in all corners if each corner is made of 's' segments.
      // pi2 * (j - qu + 1) / (n - 4) -> this is the angle
      // (n-4) should be 4*s
      // The index `j` here goes from 0 to n-1.
      // `j_mod_s_plus_1 = j % (s+1)`
      // `quadrant_progress = j_mod_s_plus_1 / s` (0 to 1 for corner curve)

      const angle =
        (pi2 * (j - (qu - 1) * s)) / (4 * s) - (Math.PI / 2) * (qu - 1);

      const current_segment_in_arc = j % (s + 1);
      let theta_within_corner: number;

      if (current_segment_in_arc <= s) {
        // Point is on a rounded corner
        const progress_in_arc = current_segment_in_arc / s; // 0 to 1
        if (qu === 1)
          theta_within_corner = (Math.PI / 2) * (1 - progress_in_arc); // 90 to 0 deg
        else if (qu === 2)
          theta_within_corner =
            Math.PI / 2 + (Math.PI / 2) * (1 - progress_in_arc);
        // 180 to 90 deg
        else if (qu === 3)
          theta_within_corner = Math.PI + (Math.PI / 2) * (1 - progress_in_arc); // 270 to 180 deg
        else
          theta_within_corner =
            (3 * Math.PI) / 2 + (Math.PI / 2) * (1 - progress_in_arc); // 360 to 270 deg

        // Corrected hofk's logic based on re-reading his contour(j)
        // map j (0..n-1) to an angle that sweeps the rounded corners correctly.
        // Each corner spans pi/2 radians.
        // s: number of segments in one pi/2 corner arc.
        // Total segments for all 4 corner arcs = 4*s
        // The original function has `qu = Math.trunc( 4 * j / n ) + 1`
        // and `x = sgx * ( w / 2 - r ) + r * Math.cos( pi2 * ( j - qu + 1 ) / ( n - 4 ) );`
        // If n = (s+1)*4, then n-4 = 4s.
        // So the angle is `pi2 * (j - qu + 1) / (4*s)`.
        // This angle is for the parametric equation of the circle part.

        const angle_hofk = (Math.PI * 2 * (j - qu + 1)) / (4 * s);

        x = sgx * (w / 2 - r) + r * Math.cos(angle_hofk);
        y = sgy * (h / 2 - r) + r * Math.sin(angle_hofk);
      } else {
        // Point should be on a straight edge (this case shouldn't happen if s >= 0 and n=(s+1)*4, every point is part of a corner calculation)
        // This part of original hofk's code might be for a version where straight edges are handled differently or s could be 0
        // For s > 0, (s+1)*4 points should define the corners primarily.
        // Let's assume for s>=1, all points are generated by the corner logic.
        // If r=0, then x = sgx * w/2, y = sgy * h/2, this is just a rectangle corner.
        x = sgx * (w / 2 - r) + r * Math.cos((pi2 * (j - qu + 1)) / (4 * s));
        y = sgy * (h / 2 - r) + r * Math.sin((pi2 * (j - qu + 1)) / (4 * s));
      }

      positions.push(x, y, 0);
      uvs.push(0.5 + x / w, 0.5 + y / h);
    }

    // Correction for last triangle in fan
    indices[indices.length - 2] = n; // Last contour point
    indices[indices.length - 1] = 1; // First contour point

    const geometry = new BufferGeometry();
    geometry.setIndex(new Uint32BufferAttribute(new Uint32Array(indices), 1));
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(new Float32Array(positions), 3)
    );
    geometry.setAttribute(
      "uv",
      new Float32BufferAttribute(new Float32Array(uvs), 2)
    );

    return geometry;
  }

  // --- Reactive Calculations --- //
  let finalPosition = $derived(
    Array.isArray(position) ? position : position.toArray()
  );

  const resolvedTextColor = $derived(
    color !== undefined ? color : $lblColorStore
  );

  const resolvedBackgroundColorPropValue = $derived(
    backgroundColor !== undefined ? backgroundColor : $sfcColorStore
  );

  const materialBackgroundColor = $derived(
    resolvedBackgroundColorPropValue
      ? new Color(resolvedBackgroundColorPropValue)
      : null
  );

  // Reverted: Calculate dimensions including padding directly for geometry
  const estimatedTextWidth = $derived(
    text.length * fontSize * 0.55 + padding * 2 * fontSize
  );
  const estimatedTextHeight = $derived(fontSize + padding * 2 * fontSize);

  const labelBackgroundGeometry = $derived(
    createRectangleRounded(
      estimatedTextWidth, // Reverted: Use direct calculation
      estimatedTextHeight, // Reverted: Use direct calculation
      borderRadius,
      backgroundSmoothness
    )
  );
</script>

<Billboard position={finalPosition}>
  <!-- Manual Background Plane using Custom Geometry -->
  {#if materialBackgroundColor && labelBackgroundGeometry}
    <T.Mesh position.z={-0.01} material.depthTest={depthTest}>
      <T is={labelBackgroundGeometry} />
      <T.MeshBasicMaterial
        color={materialBackgroundColor}
        opacity={backgroundOpacity}
        transparent={backgroundOpacity < 1.0}
        {depthTest}
      />
    </T.Mesh>
  {/if}

  <!-- Text Group (remains at z=0) -->
  <T.Group>
    <Text
      {text}
      {fontSize}
      color={new Color(resolvedTextColor)}
      {anchorX}
      {anchorY}
      {depthTest}
      {...rest}
    />
  </T.Group>
</Billboard>

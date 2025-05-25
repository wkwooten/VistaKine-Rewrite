<script lang="ts">
  import { T } from "@threlte/core";
  import {
    BufferGeometry,
    Float32BufferAttribute,
    Uint32BufferAttribute,
    Color,
  } from "three";

  // Props for the background plane
  let {
    width = 1,
    height = 0.5,
    borderRadius = 0.1,
    smoothness = 4,
    color = new Color(0x333333) as Color | string, // Default background color
    opacity = 1.0,
    depthTest = false,
    renderOrder = 0,
    visible = true,
  } = $props<{
    width?: number;
    height?: number;
    borderRadius?: number;
    smoothness?: number;
    color?: Color | string;
    opacity?: number;
    depthTest?: boolean;
    renderOrder?: number;
    visible?: boolean;
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

    for (let j = 0; j < n; j++) {
      indices.push(0, j + 1, ((j + 1) % n) + 1);
      const qu = Math.trunc((j * 4) / n) + 1;
      const sgx = qu === 1 || qu === 4 ? 1 : -1;
      const sgy = qu < 3 ? 1 : -1;
      const angle_hofk = (Math.PI * 2 * (j - qu + 1)) / (4 * s); // Angle for the corner arc
      let x = sgx * (w / 2 - r) + r * Math.cos(angle_hofk);
      let y = sgy * (h / 2 - r) + r * Math.sin(angle_hofk);
      positions.push(x, y, 0);
      uvs.push(0.5 + x / w, 0.5 + y / h);
    }
    // Correction for last triangle in fan to close the loop
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

  const backgroundGeometry = $derived(
    // Only create geometry if dimensions are valid and radius is less than half the smaller dimension
    width > 0 &&
      height > 0 &&
      borderRadius >= 0 &&
      smoothness >= 0 &&
      borderRadius < width / 2 &&
      borderRadius < height / 2
      ? createRectangleRounded(
          width,
          height,
          Math.max(0, borderRadius),
          Math.max(0, smoothness)
        ) // Ensure r and s are non-negative
      : new BufferGeometry() // Provide a default empty geometry if inputs are invalid
  );

  const materialColor = $derived(new Color(color));
</script>

{#if visible && backgroundGeometry && backgroundGeometry.attributes.position && backgroundGeometry.attributes.position.count > 0}
  <T.Mesh position.z={-0.01} {renderOrder} {depthTest}>
    <T is={backgroundGeometry} />
    <T.MeshBasicMaterial
      color={materialColor}
      {opacity}
      transparent={true}
      {depthTest}
      depthWrite={false}
    />
  </T.Mesh>
{/if}

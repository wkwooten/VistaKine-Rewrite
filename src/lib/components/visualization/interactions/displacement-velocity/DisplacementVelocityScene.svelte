<script lang="ts">
  import { T } from "@threlte/core";
  import { Grid, OrbitControls } from "@threlte/extras";
  import * as THREE from "three";
  // Later: Import state from displacementVelocityState.ts

  // Basic geometry and material for our objects
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  // TODO: Define materials based on state or context (start, end, current)
  const objectMaterial = new THREE.MeshStandardMaterial({ color: "royalblue" });
  const targetMaterial = new THREE.MeshStandardMaterial({
    color: "lightgray",
    transparent: true,
    opacity: 0.5,
  });
</script>

<!-- Camera Setup -->
<T.PerspectiveCamera makeDefault position={[15, 15, 15]} fov={50}>
  <OrbitControls enableDamping target={[5, 0, 0]} />
</T.PerspectiveCamera>

<!-- Lighting -->
<T.AmbientLight intensity={0.6} />
<T.DirectionalLight position={[10, 15, 8]} intensity={1.5} castShadow />

<!-- The Grid -->
<Grid
  gridSize={[100, 100]}
  cellSize={1}
  cellColor={"#cccccc"}
  sectionSize={5}
  sectionColor={"#ff3e00"}
  sectionThickness={1.5}
  fadeDistance={75}
  fadeStrength={1}
  infiniteGrid={false}
  followCamera={false}
  position={[0, -0.01, 0]}
/>

<!-- Objects -->
<!-- The "Drone" Object -->
<!-- TODO: Make position reactive based on animation state -->
<T.Mesh
  geometry={boxGeometry}
  material={objectMaterial}
  position={[0, 0.5, 0]}
  castShadow
  name="drone"
/>

<!-- Target Point Marker (e.g., the 10m mark) -->
<T.Mesh
  geometry={boxGeometry}
  material={targetMaterial}
  position={[10, 0.5, 0]}
  name="target"
/>

<!-- Optional: Ground plane for better shadow visibility -->
<T.Mesh rotation.x={-Math.PI / 2} receiveShadow position.y={-0.02}>
  <T.PlaneGeometry args={[100, 100]} />
  <T.MeshStandardMaterial color="#e0e0e0" side={THREE.DoubleSide} />
</T.Mesh>

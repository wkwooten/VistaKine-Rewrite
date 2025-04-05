<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { Environment, Grid, OrbitControls, SoftShadows, TransformControls, interactivity } from '@threlte/extras'
  import type { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat'
  import { Vector3, Group, Quaternion, Euler } from 'three'

  import { isDragging } from '$lib/stores/draggingStore';
  import Ground from '../elements/constructs/Ground.svelte'
  import Cube from '../elements/constructs/Cube.svelte'

  interactivity()

  // Props
  export let controlMode: 'drag' | 'translate' = 'drag';

  // State & Refs
  let controls: ThreeOrbitControls | undefined = undefined;
  let cubeGroupRef: Group | undefined = undefined;
	let cubeRigidBodyRef: RapierRigidBody | undefined = undefined;

  // Constants
  const BOUNDS = { minX: -100, maxX: 100, minY: 2, maxY: 50, minZ: -100, maxZ: 100 };
  const defaultCameraPosition = new Vector3(0, 2, 10);
  const defaultCameraTarget = new Vector3(0, 0, 0);
  const defaultCubePosition = new Vector3(2, 5, 0);
  const defaultRotation = new Quaternion().setFromEuler(new Euler(0, 0, 0));

  // --- Camera Clamping Task ---
  useTask(() => {
    if (!controls) return;
    const camera = controls.object;

    camera.position.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, camera.position.x));
    camera.position.y = Math.max(BOUNDS.minY, Math.min(BOUNDS.maxY, camera.position.y));
    camera.position.z = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, camera.position.z));

    controls.target.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, controls.target.x));
    controls.target.y = Math.max(BOUNDS.minY, Math.min(BOUNDS.maxY, controls.target.y));
    controls.target.z = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, controls.target.z));
  });

  // --- Scene Reset Function ---
	export function resetScene() {
		console.log('Resetting Scene...');
		// Reset camera
		if (controls) {
			controls.object.position.copy(defaultCameraPosition);
			controls.target.copy(defaultCameraTarget);
			controls.update();
		}

		// Reset Cube
		if (cubeRigidBodyRef) {
			cubeRigidBodyRef.setTranslation(defaultCubePosition, true);
			cubeRigidBodyRef.setRotation(defaultRotation, true);
			cubeRigidBodyRef.setLinvel({ x: 0, y: 0, z: 0 }, true);
			cubeRigidBodyRef.setAngvel({ x: 0, y: 0, z: 0 }, true);
		}
		if (cubeGroupRef) {
			cubeGroupRef.position.copy(defaultCubePosition);
			cubeGroupRef.quaternion.copy(defaultRotation);
		}

		// controlMode = 'drag'; // Optional: reset control mode
	}

</script>

<!-- Camera Setup -->
<T.PerspectiveCamera
  makeDefault
  position={defaultCameraPosition.toArray()}
>
	<OrbitControls
    bind:ref={controls}
    target={defaultCameraTarget.toArray()}
    enableZoom={true}
    enabled={!$isDragging}
    maxPolarAngle={Math.PI / 2}
  />
</T.PerspectiveCamera>

<!-- Environment -->
<T.Fog
  color={'#f0f8ff'}
  near={10}
  far={50}
/>
<T.AmbientLight intensity={1} />
<T.DirectionalLight
  castShadow
  position={[8, 20, -3]}
/>
<Grid
  position.y={0.01}
  infiniteGrid={true}
  fadeOrigin={new Vector3(0, 0, 0)}
  sectionsSize={10}
  sectionThickness={1}
  cellColor='#ADD8E6'
  sectionColor='#64B5F6'
  fadeDistance={150}
/>
<Ground />

<!-- Scene Objects -->
<Cube bind:groupRef={cubeGroupRef} bind:rigidBodyRef={cubeRigidBodyRef} {controlMode} />

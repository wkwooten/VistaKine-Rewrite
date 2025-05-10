<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { Grid, OrbitControls, HTML } from "@threlte/extras";
  import {
    BoxGeometry,
    MeshStandardMaterial,
    Vector3,
    Color,
    ArrowHelper as ThreeArrowHelper,
  } from "three";
  import CoordinateAxes from "$lib/components/visualization/elements/constructs/CoordinateAxes.svelte";
  import {
    gridCellColor as gridColorStore,
    gridSectionColor as gridSectionColorStore,
    vectorColor as primaryColorStore,
    nozzleColor as nozzleColorStore,
    xAxisColor as xAxisColorStore,
    yAxisColor as yAxisColorStore,
    zAxisColor as zAxisColorStore,
    bedColor as bedColorStore,
    bedEdgesColor as bedEdgesColorStore,
    gridCellColor as gridCellColorStore,
  } from "$lib/stores/themeColors";
  import PrinterBed from "$lib/components/visualization/elements/constructs/PrinterBed.svelte";

  let {
    nozzlePosition = $bindable(new Vector3(0, 0.1, 0)), // Nozzle slightly above grid
    printedSegments = [],
    currentVectorToDisplay = new Vector3(), // The active vector being defined
    currentVectorOrigin = new Vector3(), // Origin for the currentVectorToDisplay
  } = $props<{
    nozzlePosition?: Vector3;
    printedSegments?: { start: Vector3; end: Vector3; vector: Vector3 }[];
    currentVectorToDisplay?: Vector3;
    currentVectorOrigin?: Vector3;
  }>();

  const nozzleGeometry = new BoxGeometry(0.2, 0.2, 0.2);
  const segmentMaterial = new MeshStandardMaterial({
    color: new Color($primaryColorStore),
  }); // Use theme color
  const nozzleMaterial = new MeshStandardMaterial({
    color: new Color($nozzleColorStore),
  });

  // Reactive color for segments and nozzle
  let reactiveSegmentMaterial = $derived(
    new MeshStandardMaterial({ color: new Color($primaryColorStore) })
  );
  let reactiveNozzleMaterial = $derived(
    new MeshStandardMaterial({ color: new Color($nozzleColorStore) })
  );

  // For the current vector arrow helper
  let currentDisplayVectorHelper = $state<ThreeArrowHelper | null>(null);

  useTask((delta) => {
    if (currentVectorToDisplay && currentVectorToDisplay.lengthSq() > 0) {
      const dir = currentVectorToDisplay.clone().normalize();
      const length = currentVectorToDisplay.length();
      const color = new Color($primaryColorStore);
      const headLength = Math.max(0.1, length * 0.2); // Ensure minimum head length
      const headWidth = Math.max(0.05, length * 0.1); // Ensure minimum head width

      if (!currentDisplayVectorHelper) {
        currentDisplayVectorHelper = new ThreeArrowHelper(
          dir,
          currentVectorOrigin,
          length,
          color.getHex(),
          headLength,
          headWidth
        );
      } else {
        currentDisplayVectorHelper.setDirection(dir);
        currentDisplayVectorHelper.position.copy(currentVectorOrigin);
        currentDisplayVectorHelper.setLength(length, headLength, headWidth);
        currentDisplayVectorHelper.setColor(color);
      }
    } else {
      if (currentDisplayVectorHelper) {
        // Optionally dispose or hide if no longer needed
        // For now, just ensure it's not processed or trying to render a zero vector
        currentDisplayVectorHelper = null;
      }
    }
  });

  // Default axis lengths, can be made props later
  const axisLength = 12;
</script>

<T.PerspectiveCamera makeDefault position={[0, 30, 5]}>
  <OrbitControls
    enableZoom={true}
    enablePan={false}
    maxPolarAngle={Math.PI / 2}
    maxDistance={50}
    minDistance={10}
  />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.7} />
<T.DirectionalLight position={[10, 10, 5]} intensity={0.8} castShadow />

<PrinterBed
  bedColor={$bedColorStore}
  bedEdgesColor={$bedEdgesColorStore}
  gridCellColor={$gridCellColorStore}
  gridSectionColor={$gridSectionColorStore}
/>

<CoordinateAxes
  axisLengthX={axisLength}
  axisLengthY={axisLength}
  axisLengthZ={axisLength}
  xAxisColor={$xAxisColorStore}
  yAxisColor={$yAxisColorStore}
  zAxisColor={$zAxisColorStore}
/>

<!-- Nozzle Representation -->
<T.Mesh
  position={nozzlePosition.toArray()}
  geometry={nozzleGeometry}
  material={reactiveNozzleMaterial}
  castShadow
/>

<!-- Printed Segments -->
{#each printedSegments as segment, i (segment.start.x + "-" + segment.end.x + i)}
  {@const length = segment.vector.length()}
  {@const segmentMidpoint = new Vector3()
    .addVectors(segment.start, segment.end)
    .multiplyScalar(0.5)}
  {@const segmentOrientation = new Vector3()
    .subVectors(segment.end, segment.start)
    .normalize()}

  {#if length > 0.001}
    <T.Mesh
      position={segmentMidpoint.toArray()}
      lookAt={segment.end}
      castShadow
      receiveShadow
    >
      <T.BoxGeometry args={[0.1, 0.1, length]} />
      <T.MeshStandardMaterial color={reactiveSegmentMaterial.color} />
    </T.Mesh>
  {/if}
{/each}

{#if currentDisplayVectorHelper}
  <T is={currentDisplayVectorHelper} />
{/if}

<OrbitControls target={new Vector3(0, 0.5, 0).toArray()} />

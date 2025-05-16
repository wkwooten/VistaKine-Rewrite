<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { Grid, OrbitControls, HTML } from "@threlte/extras";
  import {
    BoxGeometry,
    MeshStandardMaterial,
    Vector3,
    Color,
    ArrowHelper as ThreeArrowHelper,
  } from "three";
  import CoordinateAxes from "$lib/components/visualization/elements/constructs/CoordinateAxes.svelte";
  import SceneLabel from "$lib/components/visualization/helpers/SceneLabel.svelte";
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
  } from "$lib/stores/themeColors";
  import PrinterBed from "$lib/components/visualization/elements/constructs/PrinterBed.svelte";
  import {
    currentDefiningVectorStore,
    definedVectorsStore,
    resultantVectorStore,
    type DefinedVector,
  } from "./vectorPrinterState";

  let {
    nozzlePosition = $bindable(new Vector3(0, 0.1, 0)),
    currentVectorOrigin = new Vector3(),
    sequenceStartOrigin = new Vector3(),
  } = $props<{
    nozzlePosition?: Vector3;
    currentVectorOrigin?: Vector3;
    sequenceStartOrigin?: Vector3;
  }>();

  const nozzleGeometry = new BoxGeometry(0.2, 0.2, 0.2);
  let reactiveNozzleMaterial = $derived(
    new MeshStandardMaterial({ color: new Color($nozzleColorStore) })
  );

  let _currentHelperInstance: ThreeArrowHelper | null = null;

  const RESULTANT_COLOR = new Color("green");
  const { scene } = useThrelte();

  $effect(() => {
    console.log(
      "[VPS PROP WATCHER (Scene)] definedVectorsStore count:",
      $definedVectorsStore.length
    );
  });
  $effect(() => {
    const resVec = $resultantVectorStore;
    console.log(
      "[VPS PROP WATCHER (Scene)] resultantVectorStore changed:",
      resVec ? { x: resVec.x, y: resVec.y, z: resVec.z } : null
    );
  });
  $effect(() => {
    console.log(
      "[VPS PROP WATCHER (Scene)] sequenceStartOrigin changed:",
      sequenceStartOrigin
        ? {
            x: sequenceStartOrigin.x,
            y: sequenceStartOrigin.y,
            z: sequenceStartOrigin.z,
          }
        : null
    );
  });
  $effect(() => {
    console.log(
      "[VPS PROP WATCHER (Scene)] currentVectorOrigin changed:",
      currentVectorOrigin
        ? {
            x: currentVectorOrigin.x,
            y: currentVectorOrigin.y,
            z: currentVectorOrigin.z,
          }
        : null
    );
  });

  $effect(() => {
    console.log(
      "[VPS $effect currentDisplayVectorHelper IMPERATIVE] Triggered. Store:",
      $state.snapshot($currentDefiningVectorStore),
      "Origin (prop):",
      $state.snapshot(currentVectorOrigin)
    );

    const vecDefStore = $currentDefiningVectorStore;

    if (vecDefStore && vecDefStore.lengthSq() > 0.00001) {
      const dir = vecDefStore.clone().normalize();
      const length = vecDefStore.length();
      const color = new Color($primaryColorStore);
      const headLength = 0.2;
      const headWidth = 0.075;

      if (!_currentHelperInstance) {
        _currentHelperInstance = new ThreeArrowHelper(
          dir,
          currentVectorOrigin.clone(),
          length,
          color.getHex(),
          headLength,
          headWidth
        );
        scene.add(_currentHelperInstance);
        console.log(
          "[VPS $effect currentDisplayVectorHelper IMPERATIVE] Created and added _currentHelperInstance",
          _currentHelperInstance
        );
      } else {
        _currentHelperInstance.setDirection(dir);
        _currentHelperInstance.position.copy(currentVectorOrigin);
        _currentHelperInstance.setLength(length, headLength, headWidth);
        _currentHelperInstance.setColor(color);
      }
      _currentHelperInstance.visible = true;
    } else {
      if (_currentHelperInstance) {
        _currentHelperInstance.visible = false;
      }
    }
    console.log(
      "[VPS $effect currentDisplayVectorHelper IMPERATIVE] _currentHelperInstance state:",
      _currentHelperInstance
        ? _currentHelperInstance.visible
          ? "Visible"
          : "Hidden"
        : "Null"
    );
  });

  useTask((delta) => {
    // Per-frame logic if needed
  });

  const axisLength = 12;

  // Helper to format vector for scene label
  function formatVectorForLabel(v: Vector3 | undefined | null): string {
    if (!v) return "⟨0,0,0⟩";
    return `⟨${v.x.toFixed(1)}, ${v.y.toFixed(1)}, ${v.z.toFixed(1)}⟩`;
  }

  function getLabelPosition(
    arrowOrigin: Vector3,
    vector: Vector3,
    vectorName: string,
    offsetScale = 0.3
  ): [number, number, number] {
    let labelBasePos: Vector3;

    if (vectorName === "R") {
      labelBasePos = arrowOrigin.clone().add(vector);
      const directionOffset = vector
        .clone()
        .normalize()
        .multiplyScalar(offsetScale);
      labelBasePos.add(directionOffset);
    } else {
      labelBasePos = arrowOrigin
        .clone()
        .add(vector.clone().multiplyScalar(0.5));
    }

    labelBasePos.add(new Vector3(0, offsetScale * 1.5, 0));
    return labelBasePos.toArray();
  }
</script>

<T.PerspectiveCamera makeDefault position={[0, 30, 5]}>
  <OrbitControls
    enableZoom={true}
    enablePan={false}
    maxPolarAngle={Math.PI / 2}
    maxDistance={50}
    minDistance={10}
    target={new Vector3(0, 0.5, 0).toArray()}
  />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.7} />
<T.DirectionalLight position={[10, 10, 5]} intensity={0.8} castShadow />

<PrinterBed
  bedColor={$bedColorStore}
  bedEdgesColor={$bedEdgesColorStore}
  gridCellColor={$gridColorStore}
  gridSectionColor={$gridSectionColorStore}
/>

<T.Group>
  <!-- Test Arrow using T component with ThreeArrowHelper -->
  <T
    is={ThreeArrowHelper}
    args={[
      new Vector3(0, 1, 0), // direction (normalized)
      new Vector3(0, 0, 0), // origin
      2, // length
      0xff0000, // color (hex number for red)
      0.4, // headLength
      0.2, // headWidth
    ]}
  />
  <!-- End Test Arrow -->

  <CoordinateAxes
    axisLengthX={axisLength}
    axisLengthY={axisLength}
    axisLengthZ={axisLength}
  />

  <T.Mesh
    position={nozzlePosition.toArray()}
    geometry={nozzleGeometry}
    material={reactiveNozzleMaterial}
    castShadow
  />

  {#each $definedVectorsStore as defVec, i (defVec.id)}
    {@const arrowOrigin = (() => {
      let origin = sequenceStartOrigin.clone();
      for (let k = 0; k < i; k++) {
        origin.add($definedVectorsStore[k].vector);
      }
      return origin;
    })()}
    {@const direction = defVec.vector.clone().normalize()}
    {@const length = defVec.vector.length()}
    {@const colorHex = new Color(defVec.color).getHex()}
    {@const headLength = 0.2}
    {@const headWidth = 0.075}

    {#if length > 0.0001}
      <T
        is={ThreeArrowHelper}
        args={[direction, arrowOrigin, length, colorHex, headLength, headWidth]}
      />
      <SceneLabel
        text={defVec.name}
        position={getLabelPosition(arrowOrigin, defVec.vector, defVec.name)}
        fontSize={0.5}
        color={"white"}
        backgroundColor={new Color(defVec.color)}
        padding={0.1}
      />
    {/if}
  {/each}

  {#if $resultantVectorStore && $resultantVectorStore.lengthSq() > 0.0001 && $definedVectorsStore.length > 0}
    {@const arrowOrigin = sequenceStartOrigin.clone()}
    {@const direction = $resultantVectorStore.clone().normalize()}
    {@const length = $resultantVectorStore.length()}
    {@const colorHex = RESULTANT_COLOR.getHex()}
    {@const headLength = 0.2}
    {@const headWidth = 0.075}

    <T
      is={ThreeArrowHelper}
      args={[direction, arrowOrigin, length, colorHex, headLength, headWidth]}
    />
    <SceneLabel
      text={`R = ${formatVectorForLabel($resultantVectorStore)}`}
      position={getLabelPosition(arrowOrigin, $resultantVectorStore, "R")}
      fontSize={0.5}
      color={"white"}
      backgroundColor={RESULTANT_COLOR}
      padding={0.1}
    />
  {/if}
</T.Group>

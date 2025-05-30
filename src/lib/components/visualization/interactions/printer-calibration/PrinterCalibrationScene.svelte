<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import {
    Environment,
    OrbitControls,
    SoftShadows,
    TransformControls,
    interactivity,
    Gizmo,
    HTML,
  } from "@threlte/extras";
  import { Vector3, Group, Quaternion, Euler, Vector2, Color } from "three";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { onMount } from "svelte";
  import {
    showCalibrationDialog,
    showDialog,
    relativeNozzleXStore,
    relativeNozzleYStore,
    relativeNozzleZStore,
    currentStageStore,
    activeTargetsStore,
    type TargetPoint,
    MIN_X,
    MAX_X,
    MIN_Y,
    MAX_Y,
    MIN_Z,
    MAX_Z,
  } from "$lib/components/visualization/interactions/printer-calibration/calibrationState";
  import {
    nozzleColor,
    nozzleEdgesColor,
    heightIndicatorColor,
    bedColor,
    bedEdgesColor,
    gridCellColor,
    gridSectionColor,
    targetPendingColor,
    targetHitColor,
    targetLabelPendingColor,
    targetLabelHitColor,
    textColor,
  } from "$lib/stores/themeColors";
  import { get } from "svelte/store";
  import SceneLabel from "../../helpers/SceneLabel.svelte";

  // Import newly extracted components
  import PrinterBed from "../../elements/constructs/PrinterBed.svelte";
  import CoordinateAxes from "../../elements/constructs/CoordinateAxes.svelte";
  import AnimatedNozzle from "../../elements/constructs/AnimatedNozzle.svelte";

  interactivity();

  // const dispatch = createEventDispatcher(); // Removed

  // --- Props (using $props) ---
  let { onStageComplete, onAllStagesComplete } = $props<{
    onStageComplete?: () => void;
    onAllStagesComplete?: () => void;
  }>();

  // --- Constants ---
  const cornerOriginOffset = new Vector3(-6, 1, -6);
  const targetProximityThreshold = 0.3;
  const initialWorldPosition = cornerOriginOffset
    .clone()
    .add(
      new Vector3(
        $relativeNozzleXStore,
        $relativeNozzleYStore,
        $relativeNozzleZStore
      )
    );

  // Tweened state for the visual representation
  const animatedPosition = tweened(initialWorldPosition, {
    duration: 500,
    easing: cubicOut,
    interpolate: (a, b) => {
      const vec = a.clone();
      return (t) => vec.lerpVectors(a, b, t);
    },
  });
  let hitTargets = $state(new Set<string>());

  // --- Reactive Logic ---
  let effectRunCount = 0;
  $effect(() => {
    const rnx = $relativeNozzleXStore;
    const rny = $relativeNozzleYStore;
    const rnz = $relativeNozzleZStore;
    const stage = $currentStageStore;

    effectRunCount++;
    console.log(
      `[Scene Effect - Store] Run count: ${effectRunCount}, Stage: ${stage}`
    );
    console.log(
      `[Scene Props - Store] Incoming Nozzle: X=${rnx}, Y=${rny}, Z=${rnz}`
    );
    const targetWorldPosition = cornerOriginOffset
      .clone()
      .add(new Vector3(rnx, rny, rnz));
    console.log(
      `[Scene Logic - Store] Setting animated target world pos to: ${targetWorldPosition.x.toFixed(2)}, ${targetWorldPosition.y.toFixed(2)}, ${targetWorldPosition.z.toFixed(2)}`
    );
    animatedPosition.set(targetWorldPosition);
  });

  $effect(() => {
    const currentTargets = $activeTargetsStore;
    console.log(
      "[PrinterCalibration - Store] activeTargetsStore changed, resetting hits. Count:",
      currentTargets.length
    );
    hitTargets = new Set();
  });

  const targetDetails = $derived.by(() => {
    const currentTargets = $activeTargetsStore;
    return currentTargets.map((target: TargetPoint) => ({
      id: target.id,
      x: target.x,
      y: target.y,
      z: target.z,
      worldPos: cornerOriginOffset
        .clone()
        .add(new Vector3(target.x, target.y, target.z)),
    }));
  });

  $effect(() => {
    const currentNozzlePos = $animatedPosition;
    const stage = $currentStageStore;
    const currentTargets = $activeTargetsStore;
    let newlyHit = false;
    let firstTargetHitThisUpdate = false;

    targetDetails.forEach((target) => {
      if (!hitTargets.has(target.id)) {
        let distance = Infinity;
        const targetWorldPos = target.worldPos;
        if (target.y === 0 && stage === 1) {
          const nozzleXZ = new Vector2(currentNozzlePos.x, currentNozzlePos.z);
          const targetXZ = new Vector2(targetWorldPos.x, targetWorldPos.z);
          distance = nozzleXZ.distanceTo(targetXZ);
        } else {
          distance = currentNozzlePos.distanceTo(targetWorldPos);
        }

        if (distance < targetProximityThreshold) {
          console.log(`[PrinterCalibration] Hit target: ${target.id}`);
          if (hitTargets.size === 0) {
            firstTargetHitThisUpdate = true;
          }
          hitTargets.add(target.id);
          hitTargets = new Set(hitTargets);
          newlyHit = true;
        }
      }
    });

    if (newlyHit) {
      if (firstTargetHitThisUpdate) {
        if (stage === 1) {
          showCalibrationDialog([
            { speaker: "Surya", message: "Nice! Got the first one." },
            {
              speaker: "Leo",
              message: "Position acquired. Remember, precision is key!",
            },
          ]);
        } else if (stage === 2) {
          showCalibrationDialog([
            { speaker: "Surya", message: "There we go, first 3D point!" },
            {
              speaker: "Leo",
              message: "Y-coordinate confirmed. Keep that accuracy up.",
            },
          ]);
        }
      } else if (
        hitTargets.size === currentTargets.length &&
        currentTargets.length > 0
      ) {
        if (stage === 1) {
          console.log(
            "[PrinterCalibration] Stage 1 targets hit! Dispatching stageComplete & showing dialog."
          );
          setTimeout(
            () => {
              showCalibrationDialog([
                {
                  speaker: "Leo",
                  message:
                    "Okay, that's much closer on the plane. The deviation is smaller now.",
                },
                {
                  speaker: "Surya",
                  message:
                    "See? Told you it wasn't that complicated. Just needed a little hands-on touch.",
                },
                {
                  speaker: "Leo",
                  message:
                    "Hmph. But for my multi-layer component, the *height* between layers needs to be exact. We need to calibrate the Y-axis too.",
                },
                {
                  speaker: "Surya",
                  message:
                    "Right, can't have your masterpiece looking like a pancake tower. Time to add the third dimension! Let's hit these next points, getting the Y-value spot on.",
                },
              ]);
              onStageComplete?.();
            },
            firstTargetHitThisUpdate ? 2500 : 0
          );
        } else if (stage === 2) {
          console.log(
            "[PrinterCalibration] Stage 2 targets hit! Dispatching allStagesComplete & showing dialog."
          );
          setTimeout(
            () => {
              showCalibrationDialog([
                {
                  speaker: "Leo",
                  message:
                    "Excellent! The deviation is now within acceptable tolerances. My calculations should hold true with prints from this calibration. Thank you, Surya.",
                },
                {
                  speaker: "Surya",
                  message:
                    "See? A little less theory, a little more doing. Now, what exactly *is* this super-precise thing you're printing anyway?",
                },
                {
                  speaker: "Leo",
                  message:
                    "It's... complicated. But essential. Let's just say it involves quantum foam.",
                },
              ]);
              onAllStagesComplete?.();
            },
            firstTargetHitThisUpdate ? 2500 : 0
          );
        }
      }
    }
  });

  // Show initial dialog
  onMount(() => {
    showCalibrationDialog([
      {
        speaker: "Leo",
        message:
          "Surya, I need your help. I've read all the manuals, double-checked the kinematics equations, but I *cannot* get this printer dialed in precisely enough for my experiment!",
      },
      {
        speaker: "Surya",
        message:
          "Whoa, deep breaths, Leo! You're probably getting lost in the nanometers again. Calibration's important, but it's also about getting a feel for it.",
      },
      {
        speaker: "Leo",
        message: "My first layer is practically floating! It's unacceptable.",
      },
      {
        speaker: "Surya",
        message:
          "Okay, let's walk through it together. First things first, let's just get the basics right on the print bed (X and Z axes). Try using the controls to get the nozzle over the points.",
      },
    ]);
  });

  const cameraTarget = new Vector3(0, 7.5, 0);
</script>

<T.AmbientLight intensity={1} />

<T.PerspectiveCamera makeDefault position={[0, 30, 5]}>
  <OrbitControls
    enableZoom={true}
    target={cameraTarget.toArray()}
    enablePan={false}
    maxPolarAngle={Math.PI / 2}
    maxDistance={50}
    minDistance={10}
  />
</T.PerspectiveCamera>

<!-- Use Extracted Components -->
<PrinterBed
  bedColor={$bedColor}
  bedEdgesColor={$bedEdgesColor}
  gridCellColor={$gridCellColor}
  gridSectionColor={$gridSectionColor}
/>

<CoordinateAxes
  {cornerOriginOffset}
  axisLengthX={MAX_X}
  axisLengthY={MAX_Y}
  axisLengthZ={MAX_Z}
/>

<AnimatedNozzle
  position={$animatedPosition}
  {cornerOriginOffset}
  nozzleColor={$nozzleColor}
  nozzleEdgesColor={$nozzleEdgesColor}
  heightIndicatorColor={$heightIndicatorColor}
/>

<!-- Target Point Markers (Specific to this scene) -->
{#each targetDetails as target (target.id)}
  {@const isHit = hitTargets.has(target.id)}
  {@const sphereColor = isHit ? $targetHitColor : $targetPendingColor}
  {@const labelColor = isHit ? $targetLabelHitColor : $targetLabelPendingColor}
  {@const labelOffsetY = 0.7}
  {@const labelOffsetZ = -0}
  {@const labelFontSize = 0.7}
  {@const coordinateText = `(${target.x}, ${target.y}, ${target.z})`}

  <!-- Target Sphere -->
  <T.Mesh position={target.worldPos.toArray()}>
    <T.SphereGeometry args={[0.2]} />
    <T.MeshBasicMaterial color={sphereColor} />
  </T.Mesh>

  <!-- Vertical Line for Stage 2 targets (Y > 0) -->
  {#if target.y > 0}
    {@const lineColor = isHit ? $targetHitColor : $targetPendingColor}
    {@const lineOpacity = isHit ? 1 : 0.5}
    {@const lineHeight = target.worldPos.y - 1}
    {@const lineCenterY = 1 + lineHeight / 2}
    <T.Mesh position={[target.worldPos.x, lineCenterY, target.worldPos.z]}>
      <T.CylinderGeometry args={[0.03, 0.03, lineHeight, 6]} />
      <T.MeshBasicMaterial
        color={lineColor}
        transparent={true}
        opacity={lineOpacity}
      />
    </T.Mesh>
  {/if}

  <!-- Target Label (shows ID initially, coords when hit) -->
  <SceneLabel
    position={[
      target.worldPos.x,
      target.worldPos.y + labelOffsetY,
      target.worldPos.z + labelOffsetZ,
    ]}
    text={isHit ? coordinateText : target.id}
    fontSize={labelFontSize}
    color={$textColor}
    backgroundColor={labelColor}
    anchorX="center"
    anchorY="middle"
  />
{/each}

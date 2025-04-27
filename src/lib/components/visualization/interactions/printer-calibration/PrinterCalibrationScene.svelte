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
  import { createEventDispatcher, onMount } from "svelte";
  import {
    showCalibrationDialog,
    requestedNozzlePosition,
    resetSceneRequested,
    showDialog,
    MIN_X,
    MAX_X,
    MIN_Y,
    MAX_Y,
    MIN_Z,
    MAX_Z,
  } from "$lib/stores/calibrationState";
  import { get } from "svelte/store";
  import SceneLabel from "../../helpers/SceneLabel.svelte";

  // Import newly extracted components
  import PrinterBed from "../../elements/constructs/PrinterBed.svelte";
  import CoordinateAxes from "../../elements/constructs/CoordinateAxes.svelte";
  import AnimatedNozzle from "../../elements/constructs/AnimatedNozzle.svelte";

  interactivity();

  const dispatch = createEventDispatcher();

  // --- Props (using $props) ---
  let {
    targets = [],
    currentStage = 1,
    relativeNozzleX = 0,
    relativeNozzleY = 5,
    relativeNozzleZ = 0,
  } = $props<{
    targets?: { id: string; x: number; y: number; z: number }[];
    currentStage?: number;
    relativeNozzleX?: number;
    relativeNozzleY?: number;
    relativeNozzleZ?: number;
  }>();

  // --- Resolved CSS Color State ---
  let xAxisColor = $state("red");
  let yAxisColor = $state("lime");
  let zAxisColor = $state("blue");
  let nozzleColor = $state("#4682b4");
  let nozzleEdgesColor = $state("#ADD8E6");
  let heightIndicatorColor = $state("#ADD8E6");
  let bedColor = $state("#ffffff");
  let bedEdgesColor = $state("#ADD8E6");
  let gridCellColor = $state("#ADD8E6");
  let gridSectionColor = $state("#64B5F6");
  let targetPendingColor = $state("#FFA500"); // Orange
  let targetHitColor = $state("#32CD32"); // LimeGreen
  let targetLabelPendingColor = $state("#FFA500"); // Darker Amber/Orange
  let targetLabelHitColor = $state("#32CD32"); // Darker Green

  // --- Constants ---
  const cornerOriginOffset = new Vector3(-6, 1, -6);
  const targetProximityThreshold = 0.3;
  const initialRelativePosition = new Vector3(0, 5, 0);
  const initialWorldPosition = cornerOriginOffset
    .clone()
    .add(initialRelativePosition);

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
  // Effect to update the nozzle's animated position
  $effect(() => {
    const targetWorldPosition = cornerOriginOffset
      .clone()
      .add(new Vector3(relativeNozzleX, relativeNozzleY, relativeNozzleZ));
    console.log(
      `[PrinterCalibration] Relative state changed. Setting animated target world pos to: ${targetWorldPosition.x}, ${targetWorldPosition.y}, ${targetWorldPosition.z}`,
    );
    animatedPosition.set(targetWorldPosition);
  });

  // Reset hitTargets when targets prop changes
  $effect(() => {
    const _numTargets = targets.length;
    console.log("[PrinterCalibration] targets.length changed, resetting hits.");
    hitTargets = new Set();
  });

  // Calculate World Positions for Targets (specific to this scene)
  const targetDetails = $derived.by(() => {
    return targets.map(
      (target: { id: string; x: number; y: number; z: number }) => ({
        id: target.id,
        x: target.x,
        y: target.y,
        z: target.z,
        worldPos: cornerOriginOffset
          .clone()
          .add(new Vector3(target.x, target.y, target.z)),
      }),
    );
  });

  // Check for target proximity & stage completion (specific to this scene)
  $effect(() => {
    const currentNozzlePos = $animatedPosition;
    let newlyHit = false;
    let firstTargetHitThisUpdate = false;

    targetDetails.forEach(
      (target: {
        id: string;
        x: number;
        y: number;
        z: number;
        worldPos: Vector3;
      }) => {
        if (!hitTargets.has(target.id)) {
          let distance = Infinity;
          const targetWorldPos = target.worldPos;
          if (target.y === 0 && currentStage === 1) {
            const nozzleXZ = new Vector2(
              currentNozzlePos.x,
              currentNozzlePos.z,
            );
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
      },
    );

    if (newlyHit) {
      if (firstTargetHitThisUpdate) {
        if (currentStage === 1) {
          showCalibrationDialog([
            { speaker: "Surya", message: "Nice! Got the first one." },
            {
              speaker: "Leo",
              message: "Position acquired. Remember, precision is key!",
            },
          ]);
        } else if (currentStage === 2) {
          showCalibrationDialog([
            { speaker: "Surya", message: "There we go, first 3D point!" },
            {
              speaker: "Leo",
              message: "Y-coordinate confirmed. Keep that accuracy up.",
            },
          ]);
        }
      } else if (hitTargets.size === targets.length && targets.length > 0) {
        if (currentStage === 1) {
          console.log(
            "[PrinterCalibration] Stage 1 targets hit! Dispatching stageComplete & showing dialog.",
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
              dispatch("stageComplete");
            },
            firstTargetHitThisUpdate ? 2500 : 0,
          );
        } else if (currentStage === 2) {
          console.log(
            "[PrinterCalibration] Stage 2 targets hit! Dispatching allStagesComplete & showing dialog.",
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
              dispatch("allStagesComplete");
            },
            firstTargetHitThisUpdate ? 2500 : 0,
          );
        }
      }
    }
  });

  // React to reset requests from the store
  $effect(() => {
    if ($resetSceneRequested) {
      console.log("[PrinterCalibration] Store requested scene reset.");
      resetSceneInternal();
      resetSceneRequested.set(false);
    }
  });

  // Internal reset logic
  function resetSceneInternal() {
    console.log("[PrinterCalibration] Resetting scene...");
    const resetWorldPosition = cornerOriginOffset
      .clone()
      .add(new Vector3(0, 5, 0));
    animatedPosition.set(resetWorldPosition, { duration: 0 });
    hitTargets = new Set();
    showCalibrationDialog([
      {
        speaker: "Leo",
        message:
          "Okay, let's try this calibration again. Precision requires patience.",
      },
      {
        speaker: "Surya",
        message:
          "Alright, alright, I'm ready. Point me to the first target, Leo.",
      },
      {
        speaker: "Leo",
        message: "Just guide the nozzle to T0 in the corner. Smoothly, please.",
      },
    ]);
  }

  // --- Fetch CSS Variables on Mount ---
  onMount(() => {
    const styles = getComputedStyle(document.documentElement);
    // Update state variables from CSS
    xAxisColor = styles.getPropertyValue("--axis-color-x").trim() || xAxisColor;
    yAxisColor = styles.getPropertyValue("--axis-color-y").trim() || yAxisColor;
    zAxisColor = styles.getPropertyValue("--axis-color-z").trim() || zAxisColor;
    nozzleColor =
      styles.getPropertyValue("--calibration-nozzle-color").trim() ||
      nozzleColor;
    nozzleEdgesColor =
      styles.getPropertyValue("--calibration-nozzle-edges-color").trim() ||
      nozzleEdgesColor;
    heightIndicatorColor =
      styles.getPropertyValue("--calibration-height-indicator-color").trim() ||
      heightIndicatorColor;
    bedColor = styles.getPropertyValue("--color-surface").trim() || bedColor;
    bedEdgesColor =
      styles.getPropertyValue("--calibration-bed-edges-color").trim() ||
      bedEdgesColor;
    gridCellColor =
      styles.getPropertyValue("--scene-grid-cell-color").trim() ||
      gridCellColor;
    gridSectionColor =
      styles.getPropertyValue("--scene-grid-section-color").trim() ||
      gridSectionColor;
    targetPendingColor =
      styles.getPropertyValue("--calibration-target-pending-color").trim() ||
      targetPendingColor;
    targetHitColor =
      styles.getPropertyValue("--calibration-target-hit-color").trim() ||
      targetHitColor;
    targetLabelPendingColor =
      styles
        .getPropertyValue("--calibration-target-label-pending-color")
        .trim() || targetLabelPendingColor;
    targetLabelHitColor =
      styles.getPropertyValue("--calibration-target-label-hit-color").trim() ||
      targetLabelHitColor;

    console.log("[PrinterCalibration] Fetched Colors:", {
      xAxisColor,
      yAxisColor,
      zAxisColor,
      nozzleColor,
      bedColor,
      targetPendingColor,
      targetHitColor,
      targetLabelPendingColor,
      targetLabelHitColor,
    });

    // Show initial dialog
    if (!get(showDialog)) {
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
    }
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
  >
    <Gizmo placement="bottom-left" />
  </OrbitControls>
</T.PerspectiveCamera>

<!-- Use Extracted Components -->
<PrinterBed {bedColor} {bedEdgesColor} {gridCellColor} {gridSectionColor} />

<CoordinateAxes
  {cornerOriginOffset}
  {xAxisColor}
  {yAxisColor}
  {zAxisColor}
  axisLengthX={MAX_X}
  axisLengthY={MAX_Y}
  axisLengthZ={MAX_Z}
/>

<AnimatedNozzle
  position={$animatedPosition}
  {cornerOriginOffset}
  {nozzleColor}
  {nozzleEdgesColor}
  {heightIndicatorColor}
/>

<!-- Target Point Markers (Specific to this scene) -->
{#each targetDetails as target (target.id)}
  {@const isHit = hitTargets.has(target.id)}
  {@const sphereColor = isHit ? targetHitColor : targetPendingColor}
  {@const labelColor = isHit ? targetLabelHitColor : targetLabelPendingColor}
  {@const labelOffsetY = 0.7}
  {@const labelOffsetZ = -0}
  {@const labelFontSize = 0.7} // Note: This uses a local constant, not the one removed
  {@const coordinateText = `(${target.x}, ${target.y}, ${target.z})`}

  <!-- Target Sphere -->
  <T.Mesh position={target.worldPos.toArray()}>
    <T.SphereGeometry args={[0.2]} />
    <T.MeshBasicMaterial color={sphereColor} />
  </T.Mesh>

  <!-- Vertical Line for Stage 2 targets (Y > 0) -->
  {#if target.y > 0}
    {@const lineColor = isHit ? targetHitColor : targetPendingColor}
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
    color={labelColor}
    anchorX="center"
    anchorY="middle"
    depthTest={false}
  />
{/each}

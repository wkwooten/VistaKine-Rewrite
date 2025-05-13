<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { useRapier } from "@threlte/rapier";
  import {
    Vector3,
    ArrowHelper,
    Color,
    LineBasicMaterial,
    MeshBasicMaterial,
    SphereGeometry,
    BufferGeometry,
    Float32BufferAttribute,
    LineSegments,
    LineDashedMaterial,
    Group,
    Quaternion,
  } from "three";
  import type { RigidBody as RapierRigidBody } from "@dimforge/rapier3d-compat";
  import { fbdVisibilityStore } from "$lib/stores/fbdStores";
  import { isFBDMenuOpen } from "$lib/stores/uiStores";
  import SceneLabel from "./SceneLabel.svelte"; // IMPORT SceneLabel

  // Use $props() instead of export let in runes mode
  let {
    rigidBody = undefined, // Keep default
    vectorScale = 0.5, // Keep default
    frictionCoefficient = 0.5, // Keep default
    objectHalfHeight = 0.5, // Keep default
  } = $props<{
    // Add type annotation for props
    rigidBody?: { handle: number /* ... other known props */ } | undefined;
    vectorScale?: number;
    frictionCoefficient?: number;
    objectHalfHeight?: number;
  }>();

  // --- Refs for Helpers ---
  let velocityArrowHelperRef: ArrowHelper | undefined = undefined;
  let weightArrowHelperRef: ArrowHelper | undefined = undefined;
  let accelerationArrowHelperRef: ArrowHelper | undefined = undefined;
  let netForceArrowHelperRef: ArrowHelper | undefined = undefined;
  let normalForceArrowHelperRef: ArrowHelper | undefined = undefined;
  let frictionArrowHelperRef: ArrowHelper | undefined = undefined;
  // --- Refs for Axes ---
  let xAxisRef: LineSegments | undefined = undefined;
  let yAxisRef: LineSegments | undefined = undefined;
  let zAxisRef: LineSegments | undefined = undefined;
  // --- Ref for FBD root group ---
  let fbdGroupRef: Group | undefined = undefined;
  let internalFbdOriginGroupRef: Group | undefined = undefined; // Ref for the new inner group

  // --- Constants ---
  const GRAVITY_CONSTANT = 9.81;
  const MIN_VISIBLE_LENGTH = 0.01; // Minimum physics value length to display vector
  const ARROW_HEAD_SIZE_RATIO = 0.2; // Ratio of length for head size
  const ARROW_HEAD_WIDTH_RATIO = 0.1; // Ratio of length for head width
  const MIN_ARROW_LENGTH = 0.1; // Smallest visual size for an arrow
  const ACCELERATION_SMOOTHING_FACTOR = 0.2; // Smoothing factor for acceleration
  const ACCELERATION_AVERAGING_INTERVAL = 0.1; // seconds (100ms)
  // --- Axis Constants ---
  const AXIS_LENGTH = 1.0 * vectorScale; // Scale axis length with vector scale
  const AXIS_DASH_SIZE = 0.05 * vectorScale;
  const AXIS_GAP_SIZE = 0.05 * vectorScale;

  // --- Reactive State for Billboards (Using LOCAL offsets) --- -> Renamed to Label positions
  let velocityLabelLocalPosition = $state(new Vector3()); // Use Svelte 5 $state
  let velocityLabelVisible = $state(false); // Use Svelte 5 $state
  let weightLabelLocalPosition = $state(new Vector3()); // Use Svelte 5 $state
  let weightLabelVisible = $state(false); // Use Svelte 5 $state
  let accelerationLabelLocalPosition = $state(new Vector3()); // Use Svelte 5 $state
  let accelerationLabelVisible = $state(false); // Use Svelte 5 $state
  let netForceLabelLocalPosition = $state(new Vector3()); // Use Svelte 5 $state
  let netForceLabelVisible = $state(false); // Use Svelte 5 $state
  let normalForceLabelLocalPosition = $state(new Vector3()); // Use Svelte 5 $state
  let normalForceLabelVisible = $state(false); // Use Svelte 5 $state
  let frictionLabelLocalPosition = $state(new Vector3()); // Use Svelte 5 $state
  let frictionLabelVisible = $state(false); // Use Svelte 5 $state
  let originDotVisible = $state(false); // Use Svelte 5 $state

  // --- Physics State for Calculation ---
  let averageAcceleration = new Vector3();
  let smoothedAcceleration = new Vector3();
  let netForce = new Vector3();
  let normalForce = new Vector3();
  let frictionForce = new Vector3();
  let timeAccumulator = 0;
  let velocityAtIntervalStart = new Vector3();

  // --- Geometry & Material for Axes (create once) ---
  const xAxisGeometry = new BufferGeometry();
  const yAxisGeometry = new BufferGeometry();
  const zAxisGeometry = new BufferGeometry();

  const xAxisVertices = new Float32Array([0, 0, 0, AXIS_LENGTH, 0, 0]);
  const yAxisVertices = new Float32Array([0, 0, 0, 0, AXIS_LENGTH, 0]);
  const zAxisVertices = new Float32Array([0, 0, 0, 0, 0, AXIS_LENGTH]);

  xAxisGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(xAxisVertices, 3)
  );
  yAxisGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(yAxisVertices, 3)
  );
  zAxisGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(zAxisVertices, 3)
  );

  // REMOVED - computeLineDistances() seems deprecated/unnecessary
  // xAxisGeometry.computeLineDistances();
  // yAxisGeometry.computeLineDistances();
  // zAxisGeometry.computeLineDistances();

  const xAxisMaterial = new LineDashedMaterial({
    color: 0xff0000,
    dashSize: AXIS_DASH_SIZE,
    gapSize: AXIS_GAP_SIZE,
    depthTest: false,
  }); // Red
  const yAxisMaterial = new LineDashedMaterial({
    color: 0x00ff00,
    dashSize: AXIS_DASH_SIZE,
    gapSize: AXIS_GAP_SIZE,
    depthTest: false,
  }); // Green
  const zAxisMaterial = new LineDashedMaterial({
    color: 0x0000ff,
    dashSize: AXIS_DASH_SIZE,
    gapSize: AXIS_GAP_SIZE,
    depthTest: false,
  }); // Blue

  // --- Arrow Colors ---
  // These should ideally come from a theme store later, but for now hardcode for visibility.
  const velocityColor = new Color("red");
  const weightColor = new Color("green");
  const accelerationColor = new Color("blue");
  const netForceColor = new Color("magenta");
  const normalForceColor = new Color("yellow"); // Or use purple from SceneLabel default?
  const frictionColor = new Color("orange");

  $effect(() => {
    if (velocityArrowHelperRef) velocityArrowHelperRef.setColor(velocityColor);
  });
  $effect(() => {
    if (weightArrowHelperRef) weightArrowHelperRef.setColor(weightColor);
  });
  $effect(() => {
    if (accelerationArrowHelperRef)
      accelerationArrowHelperRef.setColor(accelerationColor);
  });
  $effect(() => {
    if (netForceArrowHelperRef) netForceArrowHelperRef.setColor(netForceColor);
  });
  $effect(() => {
    if (normalForceArrowHelperRef)
      normalForceArrowHelperRef.setColor(normalForceColor);
  });
  $effect(() => {
    if (frictionArrowHelperRef) frictionArrowHelperRef.setColor(frictionColor);
  });

  // --- Disable Depth Test for Overlay Effect ---
  $effect(() => {
    if (velocityArrowHelperRef) {
      (velocityArrowHelperRef.line.material as LineBasicMaterial).depthTest =
        false;
      (velocityArrowHelperRef.cone.material as MeshBasicMaterial).depthTest =
        false;
    }
    if (weightArrowHelperRef) {
      (weightArrowHelperRef.line.material as LineBasicMaterial).depthTest =
        false;
      (weightArrowHelperRef.cone.material as MeshBasicMaterial).depthTest =
        false;
    }
    if (accelerationArrowHelperRef) {
      (
        accelerationArrowHelperRef.line.material as LineBasicMaterial
      ).depthTest = false;
      (
        accelerationArrowHelperRef.cone.material as MeshBasicMaterial
      ).depthTest = false;
    }
    if (netForceArrowHelperRef) {
      (netForceArrowHelperRef.line.material as LineBasicMaterial).depthTest =
        false;
      (netForceArrowHelperRef.cone.material as MeshBasicMaterial).depthTest =
        false;
    }
    if (normalForceArrowHelperRef) {
      (normalForceArrowHelperRef.line.material as LineBasicMaterial).depthTest =
        false;
      (normalForceArrowHelperRef.cone.material as MeshBasicMaterial).depthTest =
        false;
    }
    if (frictionArrowHelperRef) {
      (frictionArrowHelperRef.line.material as LineBasicMaterial).depthTest =
        false;
      (frictionArrowHelperRef.cone.material as MeshBasicMaterial).depthTest =
        false;
    }
  });

  // --- Get Rapier Context ---
  const ctx = useRapier();

  // --- Update Task ---
  useTask((delta: number) => {
    if (!rigidBody || !ctx.world) {
      // Hide everything if rigidBody is not available
      if (velocityArrowHelperRef) velocityArrowHelperRef.visible = false;
      if (weightArrowHelperRef) weightArrowHelperRef.visible = false;
      if (accelerationArrowHelperRef)
        accelerationArrowHelperRef.visible = false;
      if (netForceArrowHelperRef) netForceArrowHelperRef.visible = false;
      if (normalForceArrowHelperRef) normalForceArrowHelperRef.visible = false;
      if (frictionArrowHelperRef) frictionArrowHelperRef.visible = false;

      velocityLabelVisible = false;
      weightLabelVisible = false;
      accelerationLabelVisible = false;
      netForceLabelVisible = false;
      normalForceLabelVisible = false;
      frictionLabelVisible = false;

      originDotVisible = false; // Hide dot
      // Hide axes if no rigid body
      if (xAxisRef) xAxisRef.visible = false;
      if (yAxisRef) yAxisRef.visible = false;
      if (zAxisRef) zAxisRef.visible = false;

      averageAcceleration.set(0, 0, 0);
      smoothedAcceleration.set(0, 0, 0); // Reset smoothed acceleration
      netForce.set(0, 0, 0); // Reset net force
      normalForce.set(0, 0, 0); // Reset normal force
      frictionForce.set(0, 0, 0); // Reset friction force
      timeAccumulator = 0; // Reset accumulator
      velocityAtIntervalStart.set(0, 0, 0);
      if (internalFbdOriginGroupRef)
        internalFbdOriginGroupRef.position.set(0, 0, 0); // Reset inner group position
      return;
    }

    // --- Get the FULL RigidBody API object using the handle ---
    const fullBody = ctx.world.getRigidBody(rigidBody.handle);

    // --- Remove Debugging Logs ---
    // console.log("[FBD] Handle used:", rigidBody.handle);
    if (!fullBody) {
      // console.error("[FBD] world.getRigidBody returned null/undefined for handle!");
      if (internalFbdOriginGroupRef)
        internalFbdOriginGroupRef.position.set(0, 0, 0);
      return;
    }
    // else {
    // 	console.log("[FBD] Retrieved fullBody:", fullBody);
    // 	console.log("[FBD] Keys on fullBody:", Object.keys(fullBody));
    // }
    // --- End Remove Debugging Logs ---

    // --- Now use fullBody for all API calls ---

    // --- Get Center of Mass using localCom ---
    let comVec = new Vector3(0, 0, 0);
    if (typeof fullBody.localCom === "function") {
      const com = (fullBody as any).localCom();
      comVec.set(com.x, com.y, com.z);
      // console.log("[FBD] Successfully got localCom:", comVec);
    } else {
      // console.error("[FBD] localCom method not found on fullBody!", fullBody);
    }
    // --- Position the INNER group at the COM ---
    if (internalFbdOriginGroupRef) {
      internalFbdOriginGroupRef.position.copy(comVec);
    }

    // --- Counteract Parent Rotation (for the OUTER group) ---
    if (fbdGroupRef?.parent) {
      const parentWorldQuaternion = fbdGroupRef.parent.getWorldQuaternion(
        new Quaternion()
      );
      fbdGroupRef.quaternion.copy(parentWorldQuaternion.invert());
    } else if (fbdGroupRef) {
      // Reset rotation if parent is somehow lost
      fbdGroupRef.quaternion.identity();
    }

    // --- Position Origin Dot and Axes Locally (at 0,0,0) ---
    originDotVisible = $isFBDMenuOpen; // Visibility only
    if (xAxisRef) xAxisRef.visible = $isFBDMenuOpen && $fbdVisibilityStore.axes; // Visibility only
    if (yAxisRef) yAxisRef.visible = $isFBDMenuOpen && $fbdVisibilityStore.axes; // Visibility only
    if (zAxisRef) zAxisRef.visible = $isFBDMenuOpen && $fbdVisibilityStore.axes; // Visibility only

    // --- Calculate Physics Vectors using fullBody ---
    const linvel = fullBody.linvel(); // Use fullBody
    const linvelVec = new Vector3(linvel.x, linvel.y, linvel.z);
    const mass = fullBody.mass(); // Use fullBody
    const gravityScaleValue = fullBody.gravityScale(); // Use fullBody

    // Acceleration averaging
    timeAccumulator += delta;
    if (timeAccumulator === delta) velocityAtIntervalStart.copy(linvelVec);
    if (timeAccumulator >= ACCELERATION_AVERAGING_INTERVAL) {
      const deltaVelOverInterval = linvelVec
        .clone()
        .sub(velocityAtIntervalStart);
      averageAcceleration =
        timeAccumulator > 1e-6
          ? deltaVelOverInterval.divideScalar(timeAccumulator)
          : new Vector3();
      timeAccumulator = 0;
    }
    smoothedAcceleration.lerp(
      averageAcceleration,
      ACCELERATION_SMOOTHING_FACTOR
    );

    // Net force F=ma
    netForce =
      mass > 1e-6
        ? smoothedAcceleration.clone().multiplyScalar(mass)
        : new Vector3();

    // --- Calculate Normal & Friction (Requires World Position for Ground Check) ---
    const worldPosition = new Vector3().copy(fullBody.translation() as Vector3); // Use fullBody
    const groundContactY = objectHalfHeight;
    const verticalVelocityThreshold = 0.1;
    const groundContactThreshold = 0.05;
    const isGrounded =
      Math.abs(linvelVec.y) < verticalVelocityThreshold &&
      Math.abs(worldPosition.y - groundContactY) < groundContactThreshold;
    let normalForceMagnitude = 0;
    normalForce.set(0, 0, 0);
    if (isGrounded) {
      normalForceMagnitude = mass * GRAVITY_CONSTANT * gravityScaleValue;
      if (normalForceMagnitude > 1e-6) {
        normalForce.set(0, normalForceMagnitude, 0);
      }
    }

    const horizontalVel = new Vector3(linvelVec.x, 0, linvelVec.z);
    const slidingSpeedThreshold = 0.1;
    const isSliding =
      isGrounded && horizontalVel.length() > slidingSpeedThreshold;
    let frictionMagnitude = 0;
    frictionForce.set(0, 0, 0);
    if (isSliding && normalForceMagnitude > 1e-6) {
      frictionMagnitude = frictionCoefficient * normalForceMagnitude;
      const frictionDirection = horizontalVel.normalize().negate();
      frictionForce = frictionDirection.multiplyScalar(frictionMagnitude);
    }

    // --- Update All Vector Helpers using calculated values & fullBody methods ---
    // (Velocity, Weight, Acceleration, Net Force, Normal Force, Friction)
    // Ensure all direct calls like .setDirection, .setLength are still valid
    // Billboard offsets calculated relative to COM remain the same conceptually

    // --- Update Velocity Vector (Locally relative to COM) ---
    const velocityLength = linvelVec.length();
    const isVelocityVisible =
      $fbdVisibilityStore.velocity && velocityLength > MIN_VISIBLE_LENGTH;
    let velocityArrowTipLocal = new Vector3();
    if (velocityArrowHelperRef) {
      velocityArrowHelperRef.visible = isVelocityVisible;
      if (isVelocityVisible) {
        const direction = linvelVec.clone().normalize();
        const visualLength = velocityLength * 0.5 * vectorScale;
        velocityArrowHelperRef.setDirection(direction);
        velocityArrowHelperRef.setLength(
          visualLength,
          visualLength * ARROW_HEAD_SIZE_RATIO,
          visualLength * ARROW_HEAD_WIDTH_RATIO
        );
        velocityArrowTipLocal = direction.multiplyScalar(visualLength);
      } else {
        velocityArrowHelperRef.setLength(
          MIN_ARROW_LENGTH,
          MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO,
          MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO
        );
        velocityArrowTipLocal.set(0, 0, 0);
      }
    }
    velocityLabelVisible = isVelocityVisible; // Update label visibility state
    velocityLabelLocalPosition = isVelocityVisible // Update label position state
      ? velocityArrowTipLocal.clone().add(new Vector3(0, 0.2 * vectorScale, 0))
      : new Vector3();

    // --- Update Weight Vector (Locally relative to COM) ---
    const weightMagnitude = mass * GRAVITY_CONSTANT * gravityScaleValue;
    const isWeightVisible =
      $fbdVisibilityStore.weight && weightMagnitude > MIN_VISIBLE_LENGTH;
    let weightArrowTipLocal = new Vector3();
    const weightDirection = new Vector3(0, -1, 0);
    const visualWeightLength = weightMagnitude * 0.1 * vectorScale;
    if (weightArrowHelperRef) {
      weightArrowHelperRef.visible = isWeightVisible && visualWeightLength > 0;
      if (isWeightVisible && visualWeightLength > 0) {
        weightArrowHelperRef.setDirection(weightDirection);
        weightArrowHelperRef.setLength(
          visualWeightLength,
          visualWeightLength * ARROW_HEAD_SIZE_RATIO,
          visualWeightLength * ARROW_HEAD_WIDTH_RATIO
        );
        weightArrowTipLocal = weightDirection
          .clone()
          .multiplyScalar(visualWeightLength);
      } else {
        weightArrowHelperRef.setLength(
          MIN_ARROW_LENGTH,
          MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO,
          MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO
        );
        weightArrowTipLocal.set(0, 0, 0);
      }
    }
    weightLabelVisible = weightArrowHelperRef?.visible ?? false; // Update label visibility state
    weightLabelLocalPosition =
      isWeightVisible && visualWeightLength > 0 // Update label position state
        ? weightArrowTipLocal.clone().add(new Vector3(0, -0.2 * vectorScale, 0))
        : new Vector3();

    // --- Update Acceleration Vector (Locally relative to COM) ---
    const accelerationLength = smoothedAcceleration.length();
    const isAccelerationVisible =
      $fbdVisibilityStore.acceleration &&
      accelerationLength > MIN_VISIBLE_LENGTH;
    let accelerationArrowTipLocal = new Vector3();
    let visualAccelerationLength = 0;
    if (accelerationArrowHelperRef) {
      accelerationArrowHelperRef.visible = isAccelerationVisible;
      if (isAccelerationVisible) {
        const direction = smoothedAcceleration.clone().normalize();
        visualAccelerationLength = accelerationLength * 0.1 * vectorScale;
        accelerationArrowHelperRef.setDirection(direction);
        accelerationArrowHelperRef.setLength(
          visualAccelerationLength,
          visualAccelerationLength * ARROW_HEAD_SIZE_RATIO,
          visualAccelerationLength * ARROW_HEAD_WIDTH_RATIO
        );
        accelerationArrowTipLocal = direction.multiplyScalar(
          visualAccelerationLength
        );
      } else {
        accelerationArrowHelperRef.setLength(
          MIN_ARROW_LENGTH,
          MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO,
          MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO
        );
        accelerationArrowTipLocal.set(0, 0, 0);
      }
    }
    accelerationLabelVisible = isAccelerationVisible; // Update label visibility state
    accelerationLabelLocalPosition = isAccelerationVisible // Update label position state
      ? accelerationArrowTipLocal
          .clone()
          .add(new Vector3(0.1 * vectorScale, 0.1 * vectorScale, 0))
      : new Vector3();

    // --- Update Net Force Vector (Locally relative to COM) ---
    const netForceLength = netForce.length();
    const isNetForceVisible =
      $fbdVisibilityStore.netForce && netForceLength > MIN_VISIBLE_LENGTH;
    let netForceArrowTipLocal = new Vector3();
    let visualNetForceLength = 0;
    if (netForceArrowHelperRef) {
      netForceArrowHelperRef.visible = isNetForceVisible;
      if (isNetForceVisible) {
        const direction = netForce.clone().normalize();
        visualNetForceLength = netForceLength * 0.1 * vectorScale;
        netForceArrowHelperRef.setDirection(direction);
        netForceArrowHelperRef.setLength(
          visualNetForceLength,
          visualNetForceLength * ARROW_HEAD_SIZE_RATIO,
          visualNetForceLength * ARROW_HEAD_WIDTH_RATIO
        );
        netForceArrowTipLocal = direction.multiplyScalar(visualNetForceLength);
      } else {
        netForceArrowHelperRef.setLength(
          MIN_ARROW_LENGTH,
          MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO,
          MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO
        );
        netForceArrowTipLocal.set(0, 0, 0);
      }
    }
    netForceLabelVisible = isNetForceVisible; // Update label visibility state
    netForceLabelLocalPosition = isNetForceVisible // Update label position state
      ? netForceArrowTipLocal
          .clone()
          .add(new Vector3(-0.1 * vectorScale, -0.1 * vectorScale, 0))
      : new Vector3();

    // --- Update Normal Force Vector (Locally relative to COM) ---
    const normalForceLength = normalForce.length();
    const isNormalForceVisible =
      $fbdVisibilityStore.normalForce &&
      normalForceLength > MIN_VISIBLE_LENGTH &&
      isGrounded;
    let normalForceArrowTipLocal = new Vector3();
    let visualNormalForceLength = 0;
    if (normalForceArrowHelperRef) {
      normalForceArrowHelperRef.visible = isNormalForceVisible;
      if (isNormalForceVisible) {
        const direction = normalForce.clone().normalize();
        visualNormalForceLength = normalForceLength * 0.1 * vectorScale;
        normalForceArrowHelperRef.setDirection(direction);
        normalForceArrowHelperRef.setLength(
          visualNormalForceLength,
          visualNormalForceLength * ARROW_HEAD_SIZE_RATIO,
          visualNormalForceLength * ARROW_HEAD_WIDTH_RATIO
        );
        normalForceArrowTipLocal = direction.multiplyScalar(
          visualNormalForceLength
        );
      } else {
        normalForceArrowHelperRef.setLength(
          MIN_ARROW_LENGTH,
          MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO,
          MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO
        );
        normalForceArrowTipLocal.set(0, 0, 0);
      }
    }
    normalForceLabelVisible = isNormalForceVisible; // Update label visibility state
    normalForceLabelLocalPosition = isNormalForceVisible // Update label position state
      ? normalForceArrowTipLocal
          .clone()
          .add(new Vector3(0.1 * vectorScale, 0.2 * vectorScale, 0))
      : new Vector3();

    // --- Update Friction Force Vector (Locally relative to COM) ---
    const frictionForceLength = frictionForce.length();
    const isFrictionVisible =
      $fbdVisibilityStore.friction &&
      frictionForceLength > MIN_VISIBLE_LENGTH &&
      isSliding;
    let frictionArrowTipLocal = new Vector3();
    let visualFrictionForceLength = 0;
    if (frictionArrowHelperRef) {
      frictionArrowHelperRef.visible = isFrictionVisible;
      if (isFrictionVisible) {
        const direction = frictionForce.clone().normalize();
        visualFrictionForceLength = frictionForceLength * 0.1 * vectorScale;
        frictionArrowHelperRef.setDirection(direction);
        frictionArrowHelperRef.setLength(
          visualFrictionForceLength,
          visualFrictionForceLength * ARROW_HEAD_SIZE_RATIO,
          visualFrictionForceLength * ARROW_HEAD_WIDTH_RATIO
        );
        frictionArrowTipLocal = direction.multiplyScalar(
          visualFrictionForceLength
        );
      } else {
        frictionArrowHelperRef.setLength(
          MIN_ARROW_LENGTH,
          MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO,
          MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO
        );
        frictionArrowTipLocal.set(0, 0, 0);
      }
    }
    frictionLabelVisible = isFrictionVisible; // Update label visibility state
    frictionLabelLocalPosition = isFrictionVisible // Update label position state
      ? frictionArrowTipLocal
          .clone()
          .add(new Vector3(0, -0.2 * vectorScale, 0.1 * vectorScale))
      : new Vector3();
  });
</script>

<!-- OUTER group is positioned at RB Origin by parent -->
<T.Group bind:ref={fbdGroupRef}>
  <!-- Origin Dot & Axes remain at RB Origin -->
  <T.Mesh visible={originDotVisible}>
    <T.SphereGeometry args={[0.05 * vectorScale, 8, 8]} />
    <T.MeshBasicMaterial color="#3b82f6" depthTest={false} />
  </T.Mesh>
  <T.LineSegments
    bind:ref={xAxisRef}
    geometry={xAxisGeometry}
    material={xAxisMaterial}
  />
  <T.LineSegments
    bind:ref={yAxisRef}
    geometry={yAxisGeometry}
    material={yAxisMaterial}
  />
  <T.LineSegments
    bind:ref={zAxisRef}
    geometry={zAxisGeometry}
    material={zAxisMaterial}
  />

  <!-- INNER group positioned at COM relative to RB Origin -->
  <T.Group bind:ref={internalFbdOriginGroupRef}>
    <!-- Velocity ArrowHelper (origin is now COM) -->
    <T.ArrowHelper
      bind:ref={velocityArrowHelperRef}
      dir={[0, 1, 0]}
      length={MIN_ARROW_LENGTH}
    />
    <!-- Velocity Text Label (position is relative to COM) -->
    <!-- REPLACED Billboard/Text with SceneLabel -->
    <SceneLabel
      text="v"
      position={velocityLabelLocalPosition}
      visible={velocityLabelVisible}
      color={velocityColor}
      fontSize={0.75 * vectorScale}
      padding={0.2 * vectorScale}
      borderRadius={0.2 * vectorScale}
      backgroundSmoothness={4}
      depthTest={false}
      renderOrder={1}
    />

    <!-- Weight ArrowHelper (origin is now COM) -->
    <T.ArrowHelper
      bind:ref={weightArrowHelperRef}
      dir={[0, -1, 0]}
      length={MIN_ARROW_LENGTH}
    />
    <!-- Weight Text Label (position is relative to COM) -->
    <!-- REPLACED Billboard/Text with SceneLabel -->
    <SceneLabel
      text="W"
      position={weightLabelLocalPosition}
      visible={weightLabelVisible}
      color={weightColor}
      fontSize={0.75 * vectorScale}
      padding={0.2 * vectorScale}
      borderRadius={0.2 * vectorScale}
      backgroundSmoothness={4}
      depthTest={false}
      renderOrder={1}
    />

    <!-- Acceleration ArrowHelper (origin is now COM) -->
    <T.ArrowHelper
      bind:ref={accelerationArrowHelperRef}
      dir={[1, 0, 0]}
      length={MIN_ARROW_LENGTH}
    />
    <!-- Acceleration Text Label (position is relative to COM) -->
    <!-- REPLACED Billboard/Text with SceneLabel -->
    <SceneLabel
      text="a"
      position={accelerationLabelLocalPosition}
      visible={accelerationLabelVisible}
      color={accelerationColor}
      fontSize={0.75 * vectorScale}
      padding={0.2 * vectorScale}
      borderRadius={0.2 * vectorScale}
      backgroundSmoothness={4}
      depthTest={false}
      renderOrder={1}
    />

    <!-- Net Force ArrowHelper (origin is now COM) -->
    <T.ArrowHelper
      bind:ref={netForceArrowHelperRef}
      dir={[1, 0, 0]}
      length={MIN_ARROW_LENGTH}
    />
    <!-- Net Force Text Label (position is relative to COM) -->
    <!-- REPLACED Billboard/Text with SceneLabel -->
    <SceneLabel
      text="ΣF"
      position={netForceLabelLocalPosition}
      visible={netForceLabelVisible}
      color={netForceColor}
      fontSize={0.75 * vectorScale}
      padding={0.2 * vectorScale}
      borderRadius={0.2 * vectorScale}
      backgroundSmoothness={4}
      depthTest={false}
      renderOrder={1}
    />

    <!-- Normal Force ArrowHelper (origin is now COM) -->
    <T.ArrowHelper
      bind:ref={normalForceArrowHelperRef}
      dir={[0, 1, 0]}
      length={MIN_ARROW_LENGTH}
    />
    <!-- Normal Force Text Label (position is relative to COM) -->
    <!-- REPLACED Billboard/Text with SceneLabel -->
    <SceneLabel
      text="N"
      position={normalForceLabelLocalPosition}
      visible={normalForceLabelVisible}
      color={normalForceColor}
      fontSize={0.75 * vectorScale}
      padding={0.2 * vectorScale}
      borderRadius={0.2 * vectorScale}
      backgroundSmoothness={4}
      depthTest={false}
      renderOrder={1}
    />

    <!-- Friction Force ArrowHelper (origin is now COM) -->
    <T.ArrowHelper
      bind:ref={frictionArrowHelperRef}
      dir={[1, 0, 0]}
      length={MIN_ARROW_LENGTH}
    />
    <!-- Friction Force Text Label (position is relative to COM) -->
    <!-- REPLACED Billboard/Text with SceneLabel -->
    <SceneLabel
      text="Ff"
      position={frictionLabelLocalPosition}
      visible={frictionLabelVisible}
      color={frictionColor}
      fontSize={0.75 * vectorScale}
      padding={0.2 * vectorScale}
      borderRadius={0.2 * vectorScale}
      backgroundSmoothness={4}
      depthTest={false}
      renderOrder={1}
    />
  </T.Group>
</T.Group>

<style lang="scss">
  /* Component-specific styles for FBD if any */
  /* Note: Billboard/Text styling is now handled within SceneLabel */
</style>

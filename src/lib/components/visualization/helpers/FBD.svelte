<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Billboard, Text } from '@threlte/extras';
	import { Vector3, ArrowHelper, Color, LineBasicMaterial, MeshBasicMaterial, SphereGeometry, BufferGeometry, Float32BufferAttribute, LineSegments, LineDashedMaterial, Group, Quaternion } from 'three';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { fbdVisibilityStore } from '$lib/stores/fbdStores';
	import { isFBDMenuOpen } from '$lib/stores/uiStores';

	/** The Rapier RigidBody instance to visualize vectors for. */
	export let rigidBody: RapierRigidBody | undefined = undefined;

	/** Optional: Scale factor for the visual length of vectors. */
	export let vectorScale: number = .5;

	/** Friction coefficient of the object's collider (passed for performance). */
	export let frictionCoefficient: number = 0.5;

	/** Half-height of the object FBD represents (center-to-base distance). */
	export let objectHalfHeight: number = 0.5;

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

	// --- Reactive State for Billboards (Using LOCAL offsets) ---
	let velocityBillboardLocalOffset = new Vector3();
	let velocityBillboardVisible = false;
	let weightBillboardLocalOffset = new Vector3();
	let weightBillboardVisible = false;
	let accelerationBillboardLocalOffset = new Vector3();
	let accelerationBillboardVisible = false;
	let netForceBillboardLocalOffset = new Vector3();
	let netForceBillboardVisible = false;
	let normalForceBillboardLocalOffset = new Vector3();
	let normalForceBillboardVisible = false;
	let frictionBillboardLocalOffset = new Vector3();
	let frictionBillboardVisible = false;
	let originDotVisible = false;

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

	const xAxisVertices = new Float32Array([ 0, 0, 0,  AXIS_LENGTH, 0, 0 ]);
	const yAxisVertices = new Float32Array([ 0, 0, 0,  0, AXIS_LENGTH, 0 ]);
	const zAxisVertices = new Float32Array([ 0, 0, 0,  0, 0, AXIS_LENGTH ]);

	xAxisGeometry.setAttribute('position', new Float32BufferAttribute(xAxisVertices, 3));
	yAxisGeometry.setAttribute('position', new Float32BufferAttribute(yAxisVertices, 3));
	zAxisGeometry.setAttribute('position', new Float32BufferAttribute(zAxisVertices, 3));

	// REMOVED - computeLineDistances() seems deprecated/unnecessary
	// xAxisGeometry.computeLineDistances();
	// yAxisGeometry.computeLineDistances();
	// zAxisGeometry.computeLineDistances();

	const xAxisMaterial = new LineDashedMaterial({ color: 0xff0000, dashSize: AXIS_DASH_SIZE, gapSize: AXIS_GAP_SIZE, depthTest: false }); // Red
	const yAxisMaterial = new LineDashedMaterial({ color: 0x00ff00, dashSize: AXIS_DASH_SIZE, gapSize: AXIS_GAP_SIZE, depthTest: false }); // Green
	const zAxisMaterial = new LineDashedMaterial({ color: 0x0000ff, dashSize: AXIS_DASH_SIZE, gapSize: AXIS_GAP_SIZE, depthTest: false }); // Blue

	// --- Arrow Colors ---
	$: if (velocityArrowHelperRef) velocityArrowHelperRef.setColor(new Color('red'));
	$: if (weightArrowHelperRef) weightArrowHelperRef.setColor(new Color('green'));
	$: if (accelerationArrowHelperRef) accelerationArrowHelperRef.setColor(new Color('blue'));
	$: if (netForceArrowHelperRef) netForceArrowHelperRef.setColor(new Color('magenta'));
	$: if (normalForceArrowHelperRef) normalForceArrowHelperRef.setColor(new Color('yellow'));
	$: if (frictionArrowHelperRef) frictionArrowHelperRef.setColor(new Color('orange'));

	// --- Disable Depth Test for Overlay Effect ---
	$: {
		if (velocityArrowHelperRef) {
			(velocityArrowHelperRef.line.material as LineBasicMaterial).depthTest = false;
			(velocityArrowHelperRef.cone.material as MeshBasicMaterial).depthTest = false;
		}
		if (weightArrowHelperRef) {
			(weightArrowHelperRef.line.material as LineBasicMaterial).depthTest = false;
			(weightArrowHelperRef.cone.material as MeshBasicMaterial).depthTest = false;
		}
		if (accelerationArrowHelperRef) {
			(accelerationArrowHelperRef.line.material as LineBasicMaterial).depthTest = false;
			(accelerationArrowHelperRef.cone.material as MeshBasicMaterial).depthTest = false;
		}
		if (netForceArrowHelperRef) {
			(netForceArrowHelperRef.line.material as LineBasicMaterial).depthTest = false;
			(netForceArrowHelperRef.cone.material as MeshBasicMaterial).depthTest = false;
		}
		if (normalForceArrowHelperRef) {
			(normalForceArrowHelperRef.line.material as LineBasicMaterial).depthTest = false;
			(normalForceArrowHelperRef.cone.material as MeshBasicMaterial).depthTest = false;
		}
		if (frictionArrowHelperRef) {
			(frictionArrowHelperRef.line.material as LineBasicMaterial).depthTest = false;
			(frictionArrowHelperRef.cone.material as MeshBasicMaterial).depthTest = false;
		}
	}

	// --- Update Task ---
	useTask((delta: number) => {
		if (!rigidBody) {
            // Hide everything if rigidBody is not available
            if(velocityArrowHelperRef) velocityArrowHelperRef.visible = false;
            if(weightArrowHelperRef) weightArrowHelperRef.visible = false;
            if(accelerationArrowHelperRef) accelerationArrowHelperRef.visible = false;
            if(netForceArrowHelperRef) netForceArrowHelperRef.visible = false;
            if(normalForceArrowHelperRef) normalForceArrowHelperRef.visible = false;
            if(frictionArrowHelperRef) frictionArrowHelperRef.visible = false;
            velocityBillboardVisible = false;
            weightBillboardVisible = false;
            accelerationBillboardVisible = false;
            netForceBillboardVisible = false;
            normalForceBillboardVisible = false;
            frictionBillboardVisible = false;
            originDotVisible = false; // Hide dot
			// Hide axes if no rigid body
            if(xAxisRef) xAxisRef.visible = false;
            if(yAxisRef) yAxisRef.visible = false;
            if(zAxisRef) zAxisRef.visible = false;

            averageAcceleration.set(0,0,0);
            smoothedAcceleration.set(0,0,0); // Reset smoothed acceleration
            netForce.set(0,0,0); // Reset net force
            normalForce.set(0,0,0); // Reset normal force
            frictionForce.set(0,0,0); // Reset friction force
            timeAccumulator = 0; // Reset accumulator
            velocityAtIntervalStart.set(0,0,0);
            return;
        };

    // --- Counteract Parent Rotation ---
    if (fbdGroupRef?.parent) {
        const parentWorldQuaternion = fbdGroupRef.parent.getWorldQuaternion(new Quaternion());
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

		// --- Calculate Physics Vectors ---
		const linvel = rigidBody.linvel();
		const linvelVec = new Vector3(linvel.x, linvel.y, linvel.z);
		const mass = rigidBody.mass();
		const gravityScaleValue = rigidBody.gravityScale();

		// Acceleration averaging
		timeAccumulator += delta;
		if (timeAccumulator === delta) velocityAtIntervalStart.copy(linvelVec);
		if (timeAccumulator >= ACCELERATION_AVERAGING_INTERVAL) {
			const deltaVelOverInterval = linvelVec.clone().sub(velocityAtIntervalStart);
			averageAcceleration = timeAccumulator > 1e-6 ? deltaVelOverInterval.divideScalar(timeAccumulator) : new Vector3();
			timeAccumulator = 0;
		}
		smoothedAcceleration.lerp(averageAcceleration, ACCELERATION_SMOOTHING_FACTOR);

		// Net force F=ma
		netForce = mass > 1e-6 ? smoothedAcceleration.clone().multiplyScalar(mass) : new Vector3();

		// --- Calculate Normal & Friction (Requires World Position for Ground Check) ---
		const worldPosition = new Vector3().copy(rigidBody.translation() as Vector3);
		const groundContactY = objectHalfHeight;
		const verticalVelocityThreshold = 0.1;
		const groundContactThreshold = 0.05;
		const isGrounded = Math.abs(linvelVec.y) < verticalVelocityThreshold && Math.abs(worldPosition.y - groundContactY) < groundContactThreshold;
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
		const isSliding = isGrounded && horizontalVel.length() > slidingSpeedThreshold;
		let frictionMagnitude = 0;
		frictionForce.set(0, 0, 0);
		if (isSliding && normalForceMagnitude > 1e-6) {
			frictionMagnitude = frictionCoefficient * normalForceMagnitude;
			const frictionDirection = horizontalVel.normalize().negate();
			frictionForce = frictionDirection.multiplyScalar(frictionMagnitude);
		}

		// --- Update Velocity Vector (Locally) ---
		const velocityLength = linvelVec.length();
		const isVelocityVisible = $fbdVisibilityStore.velocity && velocityLength > MIN_VISIBLE_LENGTH;
		let velocityArrowTipLocal = new Vector3();

		if (velocityArrowHelperRef) {
			velocityArrowHelperRef.visible = isVelocityVisible;
			if (isVelocityVisible) {
				const direction = linvelVec.clone().normalize();
				const visualLength = velocityLength * 0.5 * vectorScale;
				velocityArrowHelperRef.setDirection(direction);
				velocityArrowHelperRef.setLength(visualLength, visualLength * ARROW_HEAD_SIZE_RATIO, visualLength * ARROW_HEAD_WIDTH_RATIO);
				velocityArrowTipLocal = direction.multiplyScalar(visualLength); // Calculate LOCAL tip
			} else {
				velocityArrowHelperRef.setLength(MIN_ARROW_LENGTH, MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO, MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO);
                velocityArrowTipLocal.set(0,0,0); // Reset local tip if not visible
			}
		}

		velocityBillboardVisible = isVelocityVisible;
		velocityBillboardLocalOffset = isVelocityVisible
			? velocityArrowTipLocal.clone().add(new Vector3(0, 0.2 * vectorScale, 0))
			: new Vector3(); // Default to local origin if hidden

		// --- Update Weight Vector (Locally) ---
		const weightMagnitude = mass * GRAVITY_CONSTANT * gravityScaleValue;
		const isWeightVisible = $fbdVisibilityStore.weight && weightMagnitude > MIN_VISIBLE_LENGTH;
		let weightArrowTipLocal = new Vector3();
		const weightDirection = new Vector3(0, -1, 0);
		const visualWeightLength = weightMagnitude * 0.1 * vectorScale;

		if (weightArrowHelperRef) {
			weightArrowHelperRef.visible = isWeightVisible && visualWeightLength > 0;
			if (isWeightVisible && visualWeightLength > 0) {
				weightArrowHelperRef.setDirection(weightDirection);
				weightArrowHelperRef.setLength(visualWeightLength, visualWeightLength * ARROW_HEAD_SIZE_RATIO, visualWeightLength * ARROW_HEAD_WIDTH_RATIO);
				weightArrowTipLocal = weightDirection.clone().multiplyScalar(visualWeightLength);
			} else {
				weightArrowHelperRef.setLength(MIN_ARROW_LENGTH, MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO, MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO);
                weightArrowTipLocal.set(0,0,0);
			}
		}

		weightBillboardVisible = weightArrowHelperRef?.visible ?? false;
		weightBillboardLocalOffset = isWeightVisible && visualWeightLength > 0
        	? weightArrowTipLocal.clone().add(new Vector3(0, -0.2 * vectorScale, 0))
            : new Vector3();

		// --- Update Acceleration Vector (Locally) ---
		const accelerationLength = smoothedAcceleration.length();
		const isAccelerationVisible = $fbdVisibilityStore.acceleration && accelerationLength > MIN_VISIBLE_LENGTH;
		let accelerationArrowTipLocal = new Vector3();
		let visualAccelerationLength = 0;

		if (accelerationArrowHelperRef) {
			accelerationArrowHelperRef.visible = isAccelerationVisible;
			if (isAccelerationVisible) {
				const direction = smoothedAcceleration.clone().normalize();
				visualAccelerationLength = accelerationLength * 0.1 * vectorScale;
				accelerationArrowHelperRef.setDirection(direction);
				accelerationArrowHelperRef.setLength(visualAccelerationLength, visualAccelerationLength * ARROW_HEAD_SIZE_RATIO, visualAccelerationLength * ARROW_HEAD_WIDTH_RATIO);
				accelerationArrowTipLocal = direction.multiplyScalar(visualAccelerationLength);
			} else {
				accelerationArrowHelperRef.setLength(MIN_ARROW_LENGTH, MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO, MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO);
                accelerationArrowTipLocal.set(0,0,0);
			}
		}

		accelerationBillboardVisible = isAccelerationVisible;
		accelerationBillboardLocalOffset = isAccelerationVisible
			? accelerationArrowTipLocal.clone().add(new Vector3(0.1 * vectorScale, 0.1 * vectorScale, 0))
			: new Vector3();

		// --- Update Net Force Vector (Locally) ---
		const netForceLength = netForce.length();
		const isNetForceVisible = $fbdVisibilityStore.netForce && netForceLength > MIN_VISIBLE_LENGTH;
		let netForceArrowTipLocal = new Vector3();
		let visualNetForceLength = 0;

		if (netForceArrowHelperRef) {
			netForceArrowHelperRef.visible = isNetForceVisible;
			if (isNetForceVisible) {
				const direction = netForce.clone().normalize();
				visualNetForceLength = netForceLength * 0.1 * vectorScale;
				netForceArrowHelperRef.setDirection(direction);
				netForceArrowHelperRef.setLength(visualNetForceLength, visualNetForceLength * ARROW_HEAD_SIZE_RATIO, visualNetForceLength * ARROW_HEAD_WIDTH_RATIO);
				netForceArrowTipLocal = direction.multiplyScalar(visualNetForceLength);
			} else {
				netForceArrowHelperRef.setLength(MIN_ARROW_LENGTH, MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO, MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO);
                netForceArrowTipLocal.set(0,0,0);
			}
		}

		netForceBillboardVisible = isNetForceVisible;
		netForceBillboardLocalOffset = isNetForceVisible
			? netForceArrowTipLocal.clone().add(new Vector3(-0.1 * vectorScale, -0.1 * vectorScale, 0))
			: new Vector3();

		// --- Update Normal Force Vector (Locally) ---
		const normalForceLength = normalForce.length();
		const isNormalForceVisible = $fbdVisibilityStore.normalForce && normalForceLength > MIN_VISIBLE_LENGTH && isGrounded;
		let normalForceArrowTipLocal = new Vector3();
		let visualNormalForceLength = 0;

		if (normalForceArrowHelperRef) {
			normalForceArrowHelperRef.visible = isNormalForceVisible;
			if (isNormalForceVisible) {
				const direction = normalForce.clone().normalize();
				visualNormalForceLength = normalForceLength * 0.1 * vectorScale;
				normalForceArrowHelperRef.setDirection(direction);
				normalForceArrowHelperRef.setLength(visualNormalForceLength, visualNormalForceLength * ARROW_HEAD_SIZE_RATIO, visualNormalForceLength * ARROW_HEAD_WIDTH_RATIO);
				normalForceArrowTipLocal = direction.multiplyScalar(visualNormalForceLength);
			} else {
				normalForceArrowHelperRef.setLength(MIN_ARROW_LENGTH, MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO, MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO);
                normalForceArrowTipLocal.set(0,0,0);
			}
		}

		normalForceBillboardVisible = isNormalForceVisible;
		normalForceBillboardLocalOffset = isNormalForceVisible
			? normalForceArrowTipLocal.clone().add(new Vector3(0.1 * vectorScale, 0.2 * vectorScale, 0))
			: new Vector3();

		// --- Update Friction Force Vector (Locally) ---
		const frictionForceLength = frictionForce.length();
		const isFrictionVisible = $fbdVisibilityStore.friction && frictionForceLength > MIN_VISIBLE_LENGTH && isSliding;
		let frictionArrowTipLocal = new Vector3();
		let visualFrictionForceLength = 0;

		if (frictionArrowHelperRef) {
			frictionArrowHelperRef.visible = isFrictionVisible;
			if (isFrictionVisible) {
				const direction = frictionForce.clone().normalize();
				visualFrictionForceLength = frictionForceLength * 0.1 * vectorScale;
				frictionArrowHelperRef.setDirection(direction);
				frictionArrowHelperRef.setLength(visualFrictionForceLength, visualFrictionForceLength * ARROW_HEAD_SIZE_RATIO, visualFrictionForceLength * ARROW_HEAD_WIDTH_RATIO);
				frictionArrowTipLocal = direction.multiplyScalar(visualFrictionForceLength);
			} else {
				frictionArrowHelperRef.setLength(MIN_ARROW_LENGTH, MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO, MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO);
                frictionArrowTipLocal.set(0,0,0);
			}
		}

		frictionBillboardVisible = isFrictionVisible;
		frictionBillboardLocalOffset = isFrictionVisible
			? frictionArrowTipLocal.clone().add(new Vector3(0, -0.2 * vectorScale, 0.1 * vectorScale))
			: new Vector3();
	});

</script>

<!-- Render Arrows and Billboards -->
<T.Group bind:ref={fbdGroupRef}>
	<!-- Origin Dot (always at local 0,0,0) -->
	<T.Mesh visible={originDotVisible}>
		<T.SphereGeometry args={[0.05 * vectorScale, 8, 8]} />
		<T.MeshBasicMaterial color="#3b82f6" depthTest={false} />
	</T.Mesh>

	<!-- Axes (always at local 0,0,0) -->
	<T.LineSegments bind:ref={xAxisRef} geometry={xAxisGeometry} material={xAxisMaterial} />
	<T.LineSegments bind:ref={yAxisRef} geometry={yAxisGeometry} material={yAxisMaterial} />
	<T.LineSegments bind:ref={zAxisRef} geometry={zAxisGeometry} material={zAxisMaterial} />

	<!-- Velocity ArrowHelper (origin defaults to 0,0,0) -->
	<T.ArrowHelper bind:ref={velocityArrowHelperRef} dir={[0, 1, 0]} length={MIN_ARROW_LENGTH} />

	<!-- Velocity Text Label (position is LOCAL offset) -->
	<Billboard
		position={velocityBillboardLocalOffset.toArray()}
		visible={velocityBillboardVisible}>
		<Text text="v" font="/fonts/STIXTwoText-Regular.ttf" color="red" fontSize={0.75 * vectorScale} outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
	</Billboard>

	<!-- Weight ArrowHelper (origin defaults to 0,0,0) -->
	<T.ArrowHelper bind:ref={weightArrowHelperRef} dir={[0, -1, 0]} length={MIN_ARROW_LENGTH} />

	<!-- Weight Text Label (position is LOCAL offset) -->
	<Billboard
		position={weightBillboardLocalOffset.toArray()}
		visible={weightBillboardVisible}>
		<Text text="W" font="/fonts/STIXTwoText-Regular.ttf" color="green" fontSize={0.75 * vectorScale} direction='ltr' outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
	</Billboard>

	<!-- Acceleration ArrowHelper (origin defaults to 0,0,0) -->
	<T.ArrowHelper bind:ref={accelerationArrowHelperRef} dir={[1, 0, 0]} length={MIN_ARROW_LENGTH} />

	<!-- Acceleration Text Label (position is LOCAL offset) -->
	<Billboard
		position={accelerationBillboardLocalOffset.toArray()}
		visible={accelerationBillboardVisible}>
		<Text text="a" font="/fonts/STIXTwoText-Regular.ttf" color="blue" fontSize={0.75 * vectorScale} outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
	</Billboard>

	<!-- Net Force ArrowHelper (origin defaults to 0,0,0) -->
	<T.ArrowHelper bind:ref={netForceArrowHelperRef} dir={[1, 0, 0]} length={MIN_ARROW_LENGTH} />

	<!-- Net Force Text Label (position is LOCAL offset) -->
	<Billboard
		position={netForceBillboardLocalOffset.toArray()}
		visible={netForceBillboardVisible}>
		<Text text="ΣF" font="/fonts/STIXTwoText-Regular.ttf" color="magenta" fontSize={0.75 * vectorScale} outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
	</Billboard>

	<!-- Normal Force ArrowHelper (origin defaults to 0,0,0) -->
	<T.ArrowHelper bind:ref={normalForceArrowHelperRef} dir={[0, 1, 0]} length={MIN_ARROW_LENGTH} />

	<!-- Normal Force Text Label (position is LOCAL offset) -->
	<Billboard
		position={normalForceBillboardLocalOffset.toArray()}
		visible={normalForceBillboardVisible}>
		<Text text="N" font="/fonts/STIXTwoText-Regular.ttf" color="yellow" fontSize={0.75 * vectorScale} outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
	</Billboard>

	<!-- Friction Force ArrowHelper (origin defaults to 0,0,0) -->
	<T.ArrowHelper bind:ref={frictionArrowHelperRef} dir={[1, 0, 0]} length={MIN_ARROW_LENGTH} />

	<!-- Friction Force Text Label (position is LOCAL offset) -->
	<Billboard
		position={frictionBillboardLocalOffset.toArray()}
		visible={frictionBillboardVisible}>
		<Text text="Ff" font="/fonts/STIXTwoText-Regular.ttf" color="orange" fontSize={0.75 * vectorScale} outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
	</Billboard>
</T.Group>
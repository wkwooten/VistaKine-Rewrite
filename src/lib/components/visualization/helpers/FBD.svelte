<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Billboard, Text } from '@threlte/extras';
	import { Vector3, ArrowHelper, Color, LineBasicMaterial, MeshBasicMaterial, SphereGeometry } from 'three';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';

	/** The Rapier RigidBody instance to visualize vectors for. */
	export let rigidBody: RapierRigidBody | undefined = undefined;

	/** Optional: Scale factor for the visual length of vectors. */
	export let vectorScale: number = .5;

	/** Control visibility of the velocity vector. */
	export let showVelocityVector = true;

	/** Control visibility of the weight vector. */
	export let showWeightVector = true;

	/** Control visibility of the acceleration vector. */
	export let showAccelerationVector = true;

	/** Control visibility of the net force vector. */
	export let showNetForceVector = true;

	/** Control visibility of the normal force vector. */
	export let showNormalForceVector = true;

	/** Half-height of the object FBD represents (center-to-base distance). */
	export let objectHalfHeight: number = 0.5;

	// --- Refs for Helpers ---
	let velocityArrowHelperRef: ArrowHelper | undefined = undefined;
	let weightArrowHelperRef: ArrowHelper | undefined = undefined;
	let accelerationArrowHelperRef: ArrowHelper | undefined = undefined;
	let netForceArrowHelperRef: ArrowHelper | undefined = undefined;
	let normalForceArrowHelperRef: ArrowHelper | undefined = undefined;

	// --- Constants ---
	const GRAVITY_CONSTANT = 9.81;
	const MIN_VISIBLE_LENGTH = 0.01; // Minimum physics value length to display vector
	const ARROW_HEAD_SIZE_RATIO = 0.2; // Ratio of length for head size
	const ARROW_HEAD_WIDTH_RATIO = 0.1; // Ratio of length for head width
	const MIN_ARROW_LENGTH = 0.1; // Smallest visual size for an arrow
	const ACCELERATION_SMOOTHING_FACTOR = 0.2; // Smoothing factor for acceleration
	const ACCELERATION_AVERAGING_INTERVAL = 0.1; // seconds (100ms)

	// --- Reactive State for Billboards ---
	let velocityBillboardPosition = new Vector3();
	let velocityBillboardVisible = false;
	let weightBillboardPosition = new Vector3();
	let weightBillboardVisible = false;
	let accelerationBillboardPosition = new Vector3();
	let accelerationBillboardVisible = false;
	let netForceBillboardPosition = new Vector3();
	let netForceBillboardVisible = false;
	let normalForceBillboardPosition = new Vector3();
	let normalForceBillboardVisible = false;
	let originDotPosition = new Vector3();
	let originDotVisible = false;

	// --- Physics State for Calculation ---
	let averageAcceleration = new Vector3(); // Calculated over interval
	let smoothedAcceleration = new Vector3(); // State for smoothed value
	let netForce = new Vector3(); // Calculated Net Force (F=ma)
	let normalForce = new Vector3(); // Calculated Normal Force
	let timeAccumulator = 0;
	let velocityAtIntervalStart = new Vector3();

	// --- Arrow Colors ---
	$: if (velocityArrowHelperRef) velocityArrowHelperRef.setColor(new Color('red'));
	$: if (weightArrowHelperRef) weightArrowHelperRef.setColor(new Color('green'));
	$: if (accelerationArrowHelperRef) accelerationArrowHelperRef.setColor(new Color('blue'));
	$: if (netForceArrowHelperRef) netForceArrowHelperRef.setColor(new Color('magenta'));
	$: if (normalForceArrowHelperRef) normalForceArrowHelperRef.setColor(new Color('yellow'));

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
            velocityBillboardVisible = false;
            weightBillboardVisible = false;
            accelerationBillboardVisible = false;
            netForceBillboardVisible = false;
            normalForceBillboardVisible = false;
            originDotVisible = false; // Hide dot
            averageAcceleration.set(0,0,0);
            smoothedAcceleration.set(0,0,0); // Reset smoothed acceleration
            netForce.set(0,0,0); // Reset net force
            normalForce.set(0,0,0); // Reset normal force
            timeAccumulator = 0; // Reset accumulator
            velocityAtIntervalStart.set(0,0,0);
            return;
        };

		const worldPosition = new Vector3().copy(rigidBody.translation() as Vector3);
		originDotPosition = worldPosition.clone(); // Reassign for reactivity
		originDotVisible = true; // Show dot

		// --- Velocity Vector ---
		const linvel = rigidBody.linvel();
		const linvelVec = new Vector3(linvel.x, linvel.y, linvel.z);
		const velocityLength = linvelVec.length();
		const isVelocityVisible = showVelocityVector && velocityLength > MIN_VISIBLE_LENGTH;
		let velocityArrowTipPosition = worldPosition.clone(); // Default to world pos

        // --- Time-Averaged Acceleration Calculation ---
        timeAccumulator += delta;
        // Check if this is the first frame contributing to the interval
        // (Handles case where accumulator was just reset)
        if (timeAccumulator === delta) {
            velocityAtIntervalStart.copy(linvelVec);
        }

        // Update average acceleration when interval elapses
        if (timeAccumulator >= ACCELERATION_AVERAGING_INTERVAL) {
            const deltaVelOverInterval = linvelVec.clone().sub(velocityAtIntervalStart);
            if (timeAccumulator > 1e-6) { // Avoid division by zero
                averageAcceleration = deltaVelOverInterval.divideScalar(timeAccumulator);
            } else {
                averageAcceleration.set(0, 0, 0);
            }
            // Reset for next interval
            timeAccumulator = 0;
        }

        // Apply smoothing to the averaged value
        smoothedAcceleration.lerp(averageAcceleration, ACCELERATION_SMOOTHING_FACTOR);

        // --- Net Force Calculation (F=ma) ---
        const mass = rigidBody.mass();
        if (mass > 1e-6) { // Check for valid mass
            netForce = smoothedAcceleration.clone().multiplyScalar(mass);
        } else {
            netForce.set(0, 0, 0);
        }

        // Logging (optional, adjust as needed)
        // console.log(`[FBD Debug] Current Vel: (${linvelVec.x.toFixed(2)}, ${linvelVec.y.toFixed(2)}, ${linvelVec.z.toFixed(2)})`);
        // console.log(`[FBD Debug] Avg Acceleration: (${averageAcceleration.x.toFixed(2)}, ${averageAcceleration.y.toFixed(2)}, ${averageAcceleration.z.toFixed(2)})`);
        console.log(`[FBD Debug] Smoothed Avg Acceleration: (${smoothedAcceleration.x.toFixed(2)}, ${smoothedAcceleration.y.toFixed(2)}, ${smoothedAcceleration.z.toFixed(2)}) Length: ${smoothedAcceleration.length().toFixed(2)}`);
        console.log(`[FBD Debug] Net Force: (${netForce.x.toFixed(2)}, ${netForce.y.toFixed(2)}, ${netForce.z.toFixed(2)}) Length: ${netForce.length().toFixed(2)}`);

		if (velocityArrowHelperRef) {
			velocityArrowHelperRef.position.copy(worldPosition);
			velocityArrowHelperRef.visible = isVelocityVisible;
			if (isVelocityVisible) {
				const direction = linvelVec.clone().normalize();
				/* Scale visual length for better visibility */
				const visualLength = velocityLength * 0.5 * vectorScale;
				velocityArrowHelperRef.setDirection(direction);
				velocityArrowHelperRef.setLength(
                    visualLength,
                    visualLength * ARROW_HEAD_SIZE_RATIO,
                    visualLength * ARROW_HEAD_WIDTH_RATIO
                );
				velocityArrowTipPosition = worldPosition.clone().add(direction.multiplyScalar(visualLength));
			} else {
				velocityArrowHelperRef.setLength(MIN_ARROW_LENGTH, MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO, MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO);
			}
		}

		velocityBillboardVisible = isVelocityVisible;
        /* Offset billboard slightly above the arrow tip */
		velocityBillboardPosition = isVelocityVisible
			? velocityArrowTipPosition.clone().add(new Vector3(0, 0.2 * vectorScale, 0))
			: worldPosition.clone();

		// --- Weight Vector (Previously Gravity) ---
		const gravityScaleValue = rigidBody.gravityScale();
		const weightMagnitude = mass * GRAVITY_CONSTANT * gravityScaleValue;
		const isWeightVisible = showWeightVector && weightMagnitude > MIN_VISIBLE_LENGTH;
		let weightArrowTipPosition = worldPosition.clone();
		const weightDirection = new Vector3(0, -1, 0);
        /* Scale visual length for better visibility */
		const visualWeightLength = weightMagnitude * 0.1 * vectorScale; // Note: Using mass, gravity const, and scale

		if (weightArrowHelperRef) {
			weightArrowHelperRef.position.copy(worldPosition);
			weightArrowHelperRef.visible = isWeightVisible;
			if (isWeightVisible && visualWeightLength > 0) {
				weightArrowHelperRef.setDirection(weightDirection);
				weightArrowHelperRef.setLength(
                    visualWeightLength,
                    visualWeightLength * ARROW_HEAD_SIZE_RATIO,
                    visualWeightLength * ARROW_HEAD_WIDTH_RATIO
                );
				weightArrowTipPosition = worldPosition.clone().add(weightDirection.clone().multiplyScalar(visualWeightLength));
			} else {
				weightArrowHelperRef.setLength(MIN_ARROW_LENGTH, MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO, MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO);
                /* Ensure visibility is false if length is effectively zero */
                if (visualWeightLength <= 0) {
                    weightArrowHelperRef.visible = false;
                }
			}
		}

		weightBillboardVisible = weightArrowHelperRef?.visible ?? false;
        /* Offset billboard slightly below the arrow tip */
		weightBillboardPosition = isWeightVisible && visualWeightLength > 0
        	? weightArrowTipPosition.clone().add(new Vector3(0, -0.2 * vectorScale, 0))
            : worldPosition.clone();

		// --- Acceleration Vector ---
        const accelerationLength = smoothedAcceleration.length(); // Use smoothed length
        const isAccelerationVisible = showAccelerationVector && accelerationLength > MIN_VISIBLE_LENGTH;
        let accelerationArrowTipPosition = worldPosition.clone(); // Default to world pos
        let visualAccelerationLength = 0; // Initialize

        if (accelerationArrowHelperRef) {
            accelerationArrowHelperRef.position.copy(worldPosition);
            accelerationArrowHelperRef.visible = isAccelerationVisible;
            if (isAccelerationVisible) {
                const direction = smoothedAcceleration.clone().normalize(); // Use smoothed direction
                /* Scale visual length - adjust multiplier as needed */
                visualAccelerationLength = accelerationLength * 0.1 * vectorScale; // Might need different scaling than velocity/gravity
                console.log(`[FBD Debug] Visual Accel Length: ${visualAccelerationLength.toFixed(3)}`);
                accelerationArrowHelperRef.setDirection(direction);
                accelerationArrowHelperRef.setLength(
                    visualAccelerationLength,
                    visualAccelerationLength * ARROW_HEAD_SIZE_RATIO,
                    visualAccelerationLength * ARROW_HEAD_WIDTH_RATIO
                );
                accelerationArrowTipPosition = worldPosition.clone().add(direction.multiplyScalar(visualAccelerationLength));
            } else {
                accelerationArrowHelperRef.setLength(MIN_ARROW_LENGTH, MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO, MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO);
            }
        }

        accelerationBillboardVisible = isAccelerationVisible;
        /* Offset billboard - adjust offset as needed */
        accelerationBillboardPosition = isAccelerationVisible
            ? accelerationArrowTipPosition.clone().add(new Vector3(0.1 * vectorScale, 0.1 * vectorScale, 0)) // Example offset
            : worldPosition.clone();

        // --- Net Force Vector ---
        const netForceLength = netForce.length();
        const isNetForceVisible = showNetForceVector && netForceLength > MIN_VISIBLE_LENGTH;
        let netForceArrowTipPosition = worldPosition.clone();
        let visualNetForceLength = 0;

        if (netForceArrowHelperRef) {
            netForceArrowHelperRef.position.copy(worldPosition);
            netForceArrowHelperRef.visible = isNetForceVisible;
            if (isNetForceVisible) {
                const direction = netForce.clone().normalize();
                /* Scale visual length - adjust multiplier as needed */
                visualNetForceLength = netForceLength * 0.1 * vectorScale; // Needs careful scaling based on typical force magnitudes
                netForceArrowHelperRef.setDirection(direction);
                netForceArrowHelperRef.setLength(
                    visualNetForceLength,
                    visualNetForceLength * ARROW_HEAD_SIZE_RATIO,
                    visualNetForceLength * ARROW_HEAD_WIDTH_RATIO
                );
                netForceArrowTipPosition = worldPosition.clone().add(direction.multiplyScalar(visualNetForceLength));
            } else {
                netForceArrowHelperRef.setLength(MIN_ARROW_LENGTH, MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO, MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO);
            }
        }

        netForceBillboardVisible = isNetForceVisible;
        /* Offset billboard - adjust as needed */
        netForceBillboardPosition = isNetForceVisible
            ? netForceArrowTipPosition.clone().add(new Vector3(-0.1 * vectorScale, -0.1 * vectorScale, 0)) // Example offset
            : worldPosition.clone();

        // --- Normal Force Vector ---
        const groundContactY = objectHalfHeight; // Y position of center when bottom touches Y=0
        const verticalVelocityThreshold = 0.1;
        const groundContactThreshold = 0.05; // How close to groundContactY counts as grounded
        const isGrounded = Math.abs(linvelVec.y) < verticalVelocityThreshold && Math.abs(worldPosition.y - groundContactY) < groundContactThreshold;
        let normalForceMagnitude = 0;
        normalForce.set(0, 0, 0); // Default to zero

        if (isGrounded) {
            // Approximate normal force magnitude opposes weight
            normalForceMagnitude = weightMagnitude; // Using already calculated weight magnitude
            if (normalForceMagnitude > 1e-6) {
                normalForce.set(0, normalForceMagnitude, 0); // Set normal force vector upwards
            }
        }

        const normalForceLength = normalForce.length(); // Will be 0 if not grounded or weight is negligible
        const isNormalForceVisible = showNormalForceVector && normalForceLength > MIN_VISIBLE_LENGTH && isGrounded;
        let normalForceArrowTipPosition = worldPosition.clone();
        let visualNormalForceLength = 0;

        if (normalForceArrowHelperRef) {
            normalForceArrowHelperRef.position.copy(worldPosition);
            normalForceArrowHelperRef.visible = isNormalForceVisible;
            if (isNormalForceVisible) {
                const direction = normalForce.clone().normalize(); // Should be (0, 1, 0)
                 /* Scale visual length - adjust multiplier based on typical magnitudes */
                 // Let's scale it similarly to weight for now
                visualNormalForceLength = normalForceLength * 0.1 * vectorScale;
                normalForceArrowHelperRef.setDirection(direction);
                normalForceArrowHelperRef.setLength(
                    visualNormalForceLength,
                    visualNormalForceLength * ARROW_HEAD_SIZE_RATIO,
                    visualNormalForceLength * ARROW_HEAD_WIDTH_RATIO
                );
                normalForceArrowTipPosition = worldPosition.clone().add(direction.multiplyScalar(visualNormalForceLength));
            } else {
                normalForceArrowHelperRef.setLength(MIN_ARROW_LENGTH, MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO, MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO);
            }
        }

        normalForceBillboardVisible = isNormalForceVisible;
        /* Offset billboard - adjust as needed */
        normalForceBillboardPosition = isNormalForceVisible
            ? normalForceArrowTipPosition.clone().add(new Vector3(0.1 * vectorScale, 0.2 * vectorScale, 0)) // Example offset upwards
            : worldPosition.clone();
	});

</script>

<!-- Render Arrows and Billboards -->
<T.Group>
	<!-- Origin Dot -->
	<T.Mesh position={[originDotPosition.x, originDotPosition.y, originDotPosition.z]} visible={originDotVisible}>
		<T.SphereGeometry args={[0.05 * vectorScale, 8, 8]} />
		<T.MeshBasicMaterial color="black" depthTest={false} />
	</T.Mesh>

	<!-- Velocity ArrowHelper -->
	<T.ArrowHelper
		bind:ref={velocityArrowHelperRef}
		dir={[0, 1, 0]} origin={[0, 0, 0]} length={MIN_ARROW_LENGTH} visible={showVelocityVector} />

	<!-- Velocity Text Label -->
	<Billboard
		position={[velocityBillboardPosition.x, velocityBillboardPosition.y, velocityBillboardPosition.z]}
		visible={velocityBillboardVisible}>
		<Text text="v" font="/fonts/STIXTwoText-Regular.ttf" color="red" fontSize={0.75 * vectorScale} outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
	</Billboard>

	<!-- Weight ArrowHelper (Previously Gravity) -->
	<T.ArrowHelper
		bind:ref={weightArrowHelperRef}
		dir={[0, -1, 0]} origin={[0, 0, 0]} length={MIN_ARROW_LENGTH} visible={showWeightVector} />

	<!-- Weight Text Label (Previously Gravity) -->
	<Billboard
		position={[weightBillboardPosition.x, weightBillboardPosition.y, weightBillboardPosition.z]}
		visible={weightBillboardVisible}>
		<Text text="W" font="/fonts/STIXTwoText-Regular.ttf" color="green" fontSize={0.75 * vectorScale} direction='ltr' outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
	</Billboard>

    <!-- Acceleration ArrowHelper -->
    <T.ArrowHelper
        bind:ref={accelerationArrowHelperRef}
        dir={[1, 0, 0]} origin={[0, 0, 0]} length={MIN_ARROW_LENGTH} visible={showAccelerationVector} />

    <!-- Acceleration Text Label -->
    <Billboard
        position={[accelerationBillboardPosition.x, accelerationBillboardPosition.y, accelerationBillboardPosition.z]}
        visible={accelerationBillboardVisible}>
        <Text text="a" font="/fonts/STIXTwoText-Regular.ttf" color="blue" fontSize={0.75 * vectorScale} outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
    </Billboard>

    <!-- Net Force ArrowHelper -->
    <T.ArrowHelper
        bind:ref={netForceArrowHelperRef}
        dir={[1, 0, 0]} origin={[0, 0, 0]} length={MIN_ARROW_LENGTH} visible={showNetForceVector} />

    <!-- Net Force Text Label -->
    <Billboard
        position={[netForceBillboardPosition.x, netForceBillboardPosition.y, netForceBillboardPosition.z]}
        visible={netForceBillboardVisible}>
        <Text text="ΣF" font="/fonts/STIXTwoText-Regular.ttf" color="magenta" fontSize={0.75 * vectorScale} outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
    </Billboard>

    <!-- Normal Force ArrowHelper -->
    <T.ArrowHelper
        bind:ref={normalForceArrowHelperRef}
        dir={[0, 1, 0]} origin={[0, 0, 0]} length={MIN_ARROW_LENGTH} visible={showNormalForceVector} />

    <!-- Normal Force Text Label -->
    <Billboard
        position={[normalForceBillboardPosition.x, normalForceBillboardPosition.y, normalForceBillboardPosition.z]}
        visible={normalForceBillboardVisible}>
        <Text text="N" font="/fonts/STIXTwoText-Regular.ttf" color="yellow" fontSize={0.75 * vectorScale} outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
    </Billboard>
</T.Group>
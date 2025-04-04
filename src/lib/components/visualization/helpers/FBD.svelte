<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Billboard, Text } from '@threlte/extras';
	import { Vector3, ArrowHelper, Color, LineBasicMaterial, MeshBasicMaterial, SphereGeometry } from 'three';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';

	/** The Rapier RigidBody instance to visualize vectors for. */
	export let rigidBody: RapierRigidBody | undefined = undefined;

	/** Optional: Scale factor for the visual length of vectors. */
	export let vectorScale: number = .5;

	// --- Refs for Helpers ---
	let velocityArrowHelperRef: ArrowHelper | undefined = undefined;
	let gravityArrowHelperRef: ArrowHelper | undefined = undefined;

	// --- Constants ---
	const GRAVITY_CONSTANT = 9.81;
	const MIN_VISIBLE_LENGTH = 0.01; // Minimum physics value length to display vector
	const ARROW_HEAD_SIZE_RATIO = 0.2; // Ratio of length for head size
	const ARROW_HEAD_WIDTH_RATIO = 0.1; // Ratio of length for head width
	const MIN_ARROW_LENGTH = 0.1; // Smallest visual size for an arrow

	// --- Reactive State for Billboards ---
	let velocityBillboardPosition = new Vector3();
	let velocityBillboardVisible = false;
	let gravityBillboardPosition = new Vector3();
	let gravityBillboardVisible = false;
	let originDotPosition = new Vector3();
	let originDotVisible = false;

	// --- Arrow Colors ---
	$: if (velocityArrowHelperRef) velocityArrowHelperRef.setColor(new Color('red'));
	$: if (gravityArrowHelperRef) gravityArrowHelperRef.setColor(new Color('green'));

	// --- Disable Depth Test for Overlay Effect ---
	$: {
		if (velocityArrowHelperRef) {
			(velocityArrowHelperRef.line.material as LineBasicMaterial).depthTest = false;
			(velocityArrowHelperRef.cone.material as MeshBasicMaterial).depthTest = false;
		}
		if (gravityArrowHelperRef) {
			(gravityArrowHelperRef.line.material as LineBasicMaterial).depthTest = false;
			(gravityArrowHelperRef.cone.material as MeshBasicMaterial).depthTest = false;
		}
	}

	// --- Update Task ---
	useTask(() => {
		if (!rigidBody) {
            // Hide everything if rigidBody is not available
            if(velocityArrowHelperRef) velocityArrowHelperRef.visible = false;
            if(gravityArrowHelperRef) gravityArrowHelperRef.visible = false;
            velocityBillboardVisible = false;
            gravityBillboardVisible = false;
            originDotVisible = false; // Hide dot
            return;
        };

		const worldPosition = new Vector3().copy(rigidBody.translation() as Vector3);
		// originDotPosition.copy(worldPosition); // Update dot position
		originDotPosition = worldPosition.clone(); // Reassign for reactivity
		originDotVisible = true; // Show dot

		// --- Velocity Vector ---
		const linvel = rigidBody.linvel();
		const linvelVec = new Vector3(linvel.x, linvel.y, linvel.z);
		const velocityLength = linvelVec.length();
		const isVelocityVisible = velocityLength > MIN_VISIBLE_LENGTH;
		let velocityArrowTipPosition = worldPosition.clone(); // Default to world pos

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

		// --- Gravity Vector ---
		const gravityScaleValue = rigidBody.gravityScale();
		const isGravityVisible = gravityScaleValue > MIN_VISIBLE_LENGTH;
		let gravityArrowTipPosition = worldPosition.clone(); // Default to world pos
		const gravityDirection = new Vector3(0, -1, 0);
        /* Scale visual length for better visibility */
		const visualGravityLength = gravityScaleValue * GRAVITY_CONSTANT * 0.1 * vectorScale;

		if (gravityArrowHelperRef) {
			gravityArrowHelperRef.position.copy(worldPosition);
			gravityArrowHelperRef.visible = isGravityVisible;
			if (isGravityVisible && visualGravityLength > 0) {
				gravityArrowHelperRef.setDirection(gravityDirection);
				gravityArrowHelperRef.setLength(
                    visualGravityLength,
                    visualGravityLength * ARROW_HEAD_SIZE_RATIO,
                    visualGravityLength * ARROW_HEAD_WIDTH_RATIO
                );
				gravityArrowTipPosition = worldPosition.clone().add(gravityDirection.clone().multiplyScalar(visualGravityLength));
			} else {
				gravityArrowHelperRef.setLength(MIN_ARROW_LENGTH, MIN_ARROW_LENGTH * ARROW_HEAD_SIZE_RATIO, MIN_ARROW_LENGTH * ARROW_HEAD_WIDTH_RATIO);
                /* Ensure visibility is false if length is effectively zero */
                if (visualGravityLength <= 0) {
                    gravityArrowHelperRef.visible = false;
                }
			}
		}

		gravityBillboardVisible = gravityArrowHelperRef?.visible ?? false; // Match arrow visibility
        /* Offset billboard slightly below the arrow tip */
		gravityBillboardPosition = isGravityVisible && visualGravityLength > 0
        	? gravityArrowTipPosition.clone().add(new Vector3(0, -0.2 * vectorScale, 0))
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
		dir={[0, 1, 0]} origin={[0, 0, 0]} length={MIN_ARROW_LENGTH} visible={false} />

	<!-- Velocity Text Label -->
	<Billboard
		position={[velocityBillboardPosition.x, velocityBillboardPosition.y, velocityBillboardPosition.z]}
		visible={velocityBillboardVisible}>
		<Text text="v" font="/fonts/STIXTwoText-Regular.ttf" color="red" fontSize={0.75 * vectorScale} outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
	</Billboard>

	<!-- Gravity ArrowHelper -->
	<T.ArrowHelper
		bind:ref={gravityArrowHelperRef}
		dir={[0, -1, 0]} origin={[0, 0, 0]} length={MIN_ARROW_LENGTH} visible={false} />

	<!-- Gravity Text Label -->
	<Billboard
		position={[gravityBillboardPosition.x, gravityBillboardPosition.y, gravityBillboardPosition.z]}
		visible={gravityBillboardVisible}>
		<Text text="g" font="/fonts/STIXTwoText-Regular.ttf" color="green" fontSize={0.75 * vectorScale} direction='ltr' outlineWidth={'1%'} outlineColor={'white'} anchorX="center" anchorY="middle" material-depthTest={false} />
	</Billboard>
</T.Group>
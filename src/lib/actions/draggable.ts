import { type Writable, get } from 'svelte/store';
import { Vector3, Plane, Raycaster, Vector2, type Camera, type WebGLRenderer } from 'three';
import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';

// Constants
const dragStiffness = 20; // Stiffness factor for drag velocity

export function createDraggableHandlers(options: {
	getRigidBody: () => RapierRigidBody | undefined;
	camera: Writable<Camera | undefined>;
	renderer: Writable<WebGLRenderer | undefined>;
	isDraggingStore: Writable<boolean>;
	scale: Writable<number>;
	controlMode: Writable<'drag' | 'translate'>;
}) {
	const { getRigidBody, camera, renderer, isDraggingStore, scale, controlMode } = options;

	// Drag state variables
	const dragPlane = new Plane();
	const dragOffset = new Vector3();
	let originalGravityScale: number | undefined = undefined;
	let originalLinearDamping: number | undefined = undefined;
	let isDraggingLocally = false; // Local flag to manage listener attachment/detachment


	// Handler for pointer move (global listener)
	const handlePointerMove = (event: PointerEvent) => {
        const currentRenderer = get(renderer);
        const currentCamera = get(camera);
        const currentRigidBody = getRigidBody();

		console.log('[draggable.ts] handlePointerMove Triggered. isDraggingLocally:', isDraggingLocally); // Log entry

		if (!isDraggingLocally || !currentCamera || !currentRenderer || !currentRigidBody) {
			console.log('[draggable.ts] handlePointerMove: Aborting - Drag not active or refs missing.'); // Log entry
			return;
		}

		const { width, height, left, top } = currentRenderer.domElement.getBoundingClientRect();
		const x = ((event.clientX - left) / width) * 2 - 1;
		const y = -((event.clientY - top) / height) * 2 + 1;
		const pointerCoordsVec2 = new Vector2(x, y);

		const raycaster = new Raycaster();
		raycaster.setFromCamera(pointerCoordsVec2, currentCamera);

		const intersectionPoint = new Vector3();
		if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
			const targetPosition = intersectionPoint.sub(dragOffset);

			// Re-enable Y position clamping on the target position
            const currentScale = get(scale);
			const halfHeight = currentScale / 2;
			targetPosition.y = Math.max(targetPosition.y, halfHeight);

			// Calculate velocity needed to reach target
			const currentPositionVec = currentRigidBody.translation();
			const currentPosition = new Vector3().copy(currentPositionVec);
			const velocity = new Vector3()
				.copy(targetPosition)
				.sub(currentPosition)
				.multiplyScalar(dragStiffness); // Use constant

			currentRigidBody.setLinvel(velocity, true);
		}
	};

	// Handler for pointer up (global listener)
	const handlePointerUp = () => {
        const currentRigidBody = getRigidBody();
        const currentRenderer = get(renderer);

		console.log('[draggable.ts] handlePointerUp Triggered. isDraggingLocally:', isDraggingLocally); // Log entry

		if (!isDraggingLocally || !currentRigidBody || !currentRenderer) {
			console.log('[draggable.ts] handlePointerUp: Aborting - Drag not active or refs missing.'); // Log entry
			return;
		}

		isDraggingLocally = false;
		isDraggingStore.set(false); // Set global store to false
        if (currentRenderer) {
		    currentRenderer.domElement.style.cursor = 'grab';
        }

		// Restore original physics properties
		if (originalGravityScale !== undefined) {
			currentRigidBody.setGravityScale(originalGravityScale, true);
		}

		// Keep current velocity to allow throwing

		// Restore damping AFTER potential velocity is kept
		if (originalLinearDamping !== undefined) {
			currentRigidBody.setLinearDamping(originalLinearDamping);
		}

		originalGravityScale = undefined;
		originalLinearDamping = undefined;

		window.removeEventListener('pointermove', handlePointerMove);
        // The 'once' option for pointerup is handled in handlePointerDown
	};


    // Handler for pointer down (attached to the mesh)
	const handlePointerDown = (event: any) => {
		console.log('[draggable.ts] handlePointerDown Triggered'); // Log entry
        const currentControlMode = get(controlMode);
        const currentCamera = get(camera);
        const currentRenderer = get(renderer);
        const draggingStoreValue = get(isDraggingStore);

		console.log('[draggable.ts] handlePointerDown Initial Checks:', { // Log entry block
			currentControlMode,
			currentCamera: !!currentCamera,
			currentRenderer: !!currentRenderer,
			draggingStoreValue,
			eventPoint: event.point,
			eventObject: event.object
		});

		// Only allow dragging if in 'drag' mode
		if (currentControlMode !== 'drag') {
			console.log('[draggable.ts] handlePointerDown: Aborting - Not in drag mode.'); // Log entry
			return;
		}

		if (!event.object || !event.point || !currentCamera || !currentRenderer) {
			console.log('[draggable.ts] handlePointerDown: Aborting - Missing event data or camera/renderer.'); // Log entry
			return;
		}

		// Prevent starting a new drag if already dragging (using global store)
		if (draggingStoreValue) {
			console.log('[draggable.ts] handlePointerDown: Aborting - Already dragging (global store is true).'); // Log entry
            return;
        }

		console.log('[draggable.ts] handlePointerDown: Starting drag sequence...'); // Log entry
        isDraggingLocally = true;
        isDraggingStore.set(true); // Set global store

		// Store original physics state
        const currentRigidBody = getRigidBody();
        console.log('[draggable.ts] handlePointerDown: RigidBody value fetched via getter:', currentRigidBody);

        if (!currentRigidBody) {
			console.log('[draggable.ts] handlePointerDown: Aborting - RigidBody is not available via getter.');
			return;
        }

		originalGravityScale = currentRigidBody.gravityScale();
		originalLinearDamping = currentRigidBody.linearDamping();
		console.log('[draggable.ts] Stored physics:', { originalGravityScale, originalLinearDamping }); // Log entry

		// Set physics for dragging
		currentRigidBody.setGravityScale(0, true);
		currentRigidBody.setLinearDamping(10);
		currentRigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
		currentRigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
		console.log('[draggable.ts] Set dragging physics.'); // Log entry

		// Offset and Plane calculation
		const intersectionPoint = event.point;
		const currentPositionVec = currentRigidBody.translation() as Vector3;
		const currentPosition = new Vector3().copy(currentPositionVec);
		const cameraDirection = new Vector3();
		currentCamera.getWorldDirection(cameraDirection);
		dragPlane.setFromNormalAndCoplanarPoint(cameraDirection, intersectionPoint);
		console.log('[draggable.ts] Calculated drag plane and offset.'); // Log entry

		const intersectionOnPlane = new Vector3();
		if (event.ray) {
			event.ray.intersectPlane(dragPlane, intersectionOnPlane);
		} else {
			console.warn("[draggable.ts] Ray not available on event for offset calculation."); // Log entry
			intersectionOnPlane.copy(intersectionPoint);
		}
		dragOffset.copy(intersectionOnPlane).sub(currentPosition);

		currentRenderer.domElement.style.cursor = 'grabbing';
		console.log('[draggable.ts] Adding window listeners for move/up.'); // Log entry
		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp, { once: true }); // Use once here
	};


    // Handler for pointer enter (attached to the mesh)
	const handlePointerEnter = (event: any) => {
        const currentRenderer = get(renderer);
        const draggingStoreValue = get(isDraggingStore);
		if (!draggingStoreValue && currentRenderer) {
            currentRenderer.domElement.style.cursor = 'grab';
        }
	};

    // Handler for pointer leave (attached to the mesh)
	const handlePointerLeave = (event: any) => {
        const currentRenderer = get(renderer);
        const draggingStoreValue = get(isDraggingStore);
		if (!draggingStoreValue && currentRenderer) {
            currentRenderer.domElement.style.cursor = 'auto';
        }
	};

    // Return the handlers to be attached in the component
    return {
        handlePointerDown,
        handlePointerEnter,
        handlePointerLeave,
        // handlePointerMove and handlePointerUp are managed internally via window listeners
    };
}

import { writable, derived } from 'svelte/store';
import * as THREE from 'three';

// === Core State ===
/** Current position of the drone */
export const dronePosition = writable(new THREE.Vector3(0, 0.5, 0));

/** Animation playing state */
export const isPlaying = writable(false);

/** Current stage of the animation (e.g., 'toTarget', 'returning', 'finished') */
export const animationStage = writable<'initial' | 'toTarget' | 'returning' | 'finished'>('initial');

/** Time elapsed in the current animation segment */
export const elapsedTime = writable(0);

// === Constants ===
export const targetPosition = new THREE.Vector3(10, 0.5, 0);
export const startPosition = new THREE.Vector3(0, 0.5, 0);
export const movementSpeed = 2; // units per second

// === Derived State ===
/** Total distance traveled */
export const totalDistance = derived(
    [dronePosition, animationStage],
    ([$dronePosition, $animationStage]) => {
        // Basic calculation - refine later with actual path tracking
        if ($animationStage === 'toTarget') {
            return $dronePosition.distanceTo(startPosition);
        } else if ($animationStage === 'returning') {
            return targetPosition.distanceTo(startPosition) + $dronePosition.distanceTo(targetPosition);
        } else if ($animationStage === 'finished') {
             return targetPosition.distanceTo(startPosition) * 2;
        }
        return 0;
    }
);

/** Current displacement vector */
export const currentDisplacementVector = derived(
    dronePosition,
    ($dronePosition) => $dronePosition.clone().sub(startPosition)
);

/** Magnitude of the current displacement */
export const currentDisplacementMagnitude = derived(
    currentDisplacementVector,
    ($vector) => $vector.length()
);

// === Functions ===
export function resetState() {
    dronePosition.set(new THREE.Vector3(0, 0.5, 0));
    isPlaying.set(false);
    animationStage.set('initial');
    elapsedTime.set(0);
    // Reset any other relevant state
}

// TODO: Add functions to start/pause/control animation stages
// e.g., startAnimation(), pauseAnimation(), stepAnimation(deltaTime)
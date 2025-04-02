# Threlte Drag Feature Summary

## Goal
Implement physics-based drag-and-drop for a `<Box>` component within a Threlte scene (`Scene.svelte`), ensuring `<OrbitControls>` are disabled during the drag operation for a smoother user experience.

## Event Handling Solution
- Standard Svelte `on:eventname` directives do not work directly on Threlte's `<T>` components for pointer interactions.
- The `@threlte/extras` `interactivity()` plugin is required.
- **Implementation:**
    1. Call `interactivity()` within the `<script>` tag of a component inside the `<Canvas>` context (e.g., `Scene.svelte`).
    2. Use the specific event *props* provided by the plugin (e.g., `onpointerdown`, `onpointerenter`, `onpointerleave`, `onclick`) directly on the target `<T.Mesh>` component (e.g., inside `Box.svelte`).

## Drag Logic Implementation (inside `Box.svelte`)
- **`onpointerdown` Handler:**
    - Check for valid intersection (`event.object`, `event.point`) and `rigidBodyRef`.
    - Set `isDragging = true`.
    - Store the current `rigidBodyRef.bodyType()`.
    - Set `rigidBodyRef.setBodyType(RigidBodyType.KinematicPositionBased, true)`.
    - Stop current velocity/angular velocity: `rigidBodyRef.setLinvel(...)`, `rigidBodyRef.setAngvel(...)`.
    - Create a `Plane` (e.g., parallel to the ground at intersection height).
    - Calculate the offset `Vector3` between the intersection point on the plane and the body's current position.
    - Add global `pointermove` and `pointerup` listeners.
    - *Attempt* to disable OrbitControls.
- **Global `pointermove` Handler:**
    - If `isDragging` is true.
    - Calculate pointer NDC.
    - Create `Raycaster` from camera and pointer NDC.
    - Intersect the ray with the drag `Plane`.
    - Calculate the `newPosition` (intersection point - offset).
    - Update physics body: `rigidBodyRef.setNextKinematicTranslation(newPosition)`.
    - Call `invalidate()` if needed.
- **Global `pointerup` Handler:**
    - If `isDragging` is true.
    - Set `isDragging = false`.
    - Restore original `RigidBody` type using stored value and `rigidBodyRef.wakeUp()`.
    - *Attempt* to re-enable OrbitControls.
    - Remove global `pointermove` listener.

## Disabling OrbitControls - The Challenge
- **Goal:** Get the underlying Three.js `OrbitControls` instance within `Box.svelte` to set `controls.enabled = false/true`.
- **Attempts & Failures:**
    1.  **Scene Traversal:** Using `scene.traverse` in `Box.svelte`'s `onMount` (Fragile, not recommended).
    2.  **`bind:this` + Prop + `.controls`:** Passed Svelte component ref via prop, accessed `componentRef?.controls` -> `undefined`.
    3.  **`bind:this` + Prop + `.instance`:** Passed Svelte component ref via prop, accessed `componentRef?.instance` -> `undefined`.
    4.  **`bind:this` + Prop + `.ref`:** Passed Svelte component ref via prop, accessed `componentRef?.ref` -> `undefined`.
    5.  **`useThrelteUserContext`:** Imported from `@threlte/core`, used `useThrelteUserContext('orbit-controls')`. The resulting store value (`$orbitControlsStore`) was `undefined`. Likely because `<OrbitControls>` from `@threlte/extras` uses an internal context, not the user context, for its own instance management.

## Current Status
- Pointer events (`onpointerdown`, `onpointerenter`, etc.) on the `<Box>` mesh are working correctly via the `interactivity` plugin.
- The core drag logic (changing physics state, calculating position) is implemented.
- **Blocker:** OrbitControls are *not* being disabled/enabled during drag because a valid reference to the Three.js `OrbitControls` instance cannot be obtained reliably in `Box.svelte` using the methods attempted so far.

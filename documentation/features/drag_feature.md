# Threlte Draggable Physics Component Summary

## Goal
Create a reusable drag-and-throw physics interaction for Threlte components, separated into a dedicated function (`createDraggableHandlers` in `draggable.ts`) and applied to a Svelte component (`Cube.svelte`).

## Core Implementation (`Cube.svelte` + `draggable.ts`)

1.  **`Cube.svelte` Component:**
    *   Renders a `<T.Mesh>` within Rapier's `<RigidBody>` and `<AutoColliders>`.
    *   Exports a `rigidBodyRef` prop (`export let rigidBodyRef: RapierRigidBody | undefined`).
    *   Binds the `<RigidBody>` component's instance to this `rigidBodyRef` prop (`<RigidBody bind:rigidBody={rigidBodyRef} ...>`).
    *   Imports `createDraggableHandlers` from `draggable.ts`.
    *   Creates necessary `writable` stores for shared state needed by handlers (camera, renderer, scale, controlMode). **Important:** The `rigidBodyRef` itself is *not* passed as a store.
    *   Calls `createDraggableHandlers`, passing:
        *   A getter function `getRigidBody: () => rigidBodyRef` to allow the handlers to access the *current* value of the `rigidBodyRef` prop variable at the time the event occurs.
        *   The writable stores for camera, renderer, scale, etc.
    *   Attaches the returned handlers (`handlePointerDown`, `handlePointerEnter`, `handlePointerLeave`) to the `<T.Mesh>` using **Svelte prop syntax** (e.g., `onpointerdown={handlePointerDown}`).

2.  **`draggable.ts` (`createDraggableHandlers` function):**
    *   Accepts an options object including the `getRigidBody` function and the other state stores.
    *   Defines the `handlePointerDown`, `handlePointerMove`, and `handlePointerUp` logic.
    *   **`handlePointerDown`:**
        *   Checks `controlMode`, event data, camera, and renderer *first*.
        *   Crucially, calls `getRigidBody()` *after* initial checks but *before* manipulating the physics body, ensuring the reference is available.
        *   If `rigidBody` exists, stores original physics state (`gravityScale`, `linearDamping`).
        *   Sets physics state for dragging (gravity=0, high damping, zero velocity).
        *   Calculates drag plane and offset.
        *   Adds global `pointermove` and `pointerup` listeners.
    *   **`handlePointerMove`:**
        *   Calls `getRigidBody()` to get the current reference.
        *   Calculates target position based on raycasting against the drag plane.
        *   Applies velocity to the `rigidBody` using `setLinvel` to move it towards the target (kinematic-like movement via velocity).
    *   **`handlePointerUp`:**
        *   Calls `getRigidBody()` to get the current reference.
        *   Removes global listeners.
        *   Restores original physics properties (`gravityScale`, `linearDamping`). Does *not* reset velocity, allowing throwing.
    *   Returns the handlers (`handlePointerDown`, `handlePointerEnter`, `handlePointerLeave`) to be used by the component.

3.  **`Scene.svelte`:**
    *   Imports and calls `@threlte/extras` `interactivity()` at the top level of the script.
    *   Renders `<Cube bind:rigidBodyRef={cubeRigidBodyRef} ... />`, binding the `rigidBodyRef` prop.
    *   Manages `OrbitControls` enabling/disabling using the global `$isDragging` store (`enabled={!$isDragging}`).

## Key Debugging Takeaways & Solutions

1.  **Event Handler Syntax:** Threlte's `<T.*>` components require pointer events to be attached using **Svelte prop syntax** (e.g., `onpointerdown={handler}`) rather than Svelte's event directive syntax (`on:pointerdown={handler}`). Using `on:` prevented events from firing.
2.  **`interactivity()` Placement:** Calling `@threlte/extras` `interactivity()` at the top level of the main scene script (`Scene.svelte`) ensures pointer events work reliably. Moving it into `onMount` caused interactions to stop working for all components.
3.  **RigidBody Reference Timing:** Accessing the `RigidBody` instance within event handlers requires careful timing.
    *   **Initial Problem:** Passing a `writable` store updated by a reactive statement (`$:`) resulted in the handler reading an `undefined` value because the store update happened after the handler function was created/accessed.
    *   **Solution:** Pass a **getter function** (`() => rigidBodyRef`) from the component to the handler creator (`createDraggableHandlers`). The handlers then call this function *inside* the event logic (e.g., `handlePointerDown`) to get the most up-to-date reference to the `rigidBodyRef` prop, which is populated by the `<RigidBody bind:rigidBody...>` directive.

## Status
- The reusable dragging logic works correctly for the `Cube` component.
- OrbitControls are correctly disabled during drag via the shared `$isDragging` store.
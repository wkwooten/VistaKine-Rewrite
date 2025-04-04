<script lang="ts">
	import { T, Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import Scene from '$lib/components/visualization/scenes/Scene.svelte';
	import PhysicsPlayground from '$lib/components/visualization/PhysicsPlayground.svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store'; // Import Writable if not already

	const currentSection: Writable<string> = writable<string>('physics-playground');

	// State for the selected control mode
	let selectedControlMode: 'drag' | 'translate' = 'drag';

	// Reference to the Scene component instance
	let sceneComponent: Scene;

	// Handler to update the mode when the event bubbles up
	function handleModeChange(event: CustomEvent<{ mode: 'drag' | 'translate' }>) {
		selectedControlMode = event.detail.mode;
		console.log('Page received mode change:', selectedControlMode); // For debugging
	}

	// Handler for the reset scene event
	function handleReset() {
		console.log('Reset event received in page, calling Scene.resetScene()');
		if (sceneComponent) {
			sceneComponent.resetScene(); // Call the exported function
		}
	}

</script>

<div>
  <h1>Physics Playground</h1>
  <div class="physics-pg-container">
		<p> This is a testbed for physics simulations. </p>
		<PhysicsPlayground
			{currentSection}
			bind:controlMode={selectedControlMode}
			on:modechange={handleModeChange}
			on:resetscene={handleReset}
		>
			<Scene bind:this={sceneComponent} bind:controlMode={selectedControlMode} />
		</PhysicsPlayground>
  </div>
</div>

<style lang="scss">
	.physics-pg-container {
		padding: var(--space-m);
	}
</style>

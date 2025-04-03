<script lang="ts">
	import { T, Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import Scene from '$lib/components/visualization/scenes/Scene.svelte';
	import PhysicsPlayground from '$lib/components/visualization/PhysicsPlayground.svelte';
	import { writable } from 'svelte/store';

	const currentSection = writable<string>('physics-playground');

	// State for the selected control mode
	let selectedControlMode: 'drag' | 'translate' = 'drag';

	// Handler to update the mode when the event bubbles up
	function handleModeChange(event: CustomEvent<{ mode: 'drag' | 'translate' }>) {
		selectedControlMode = event.detail.mode;
		console.log('Page received mode change:', selectedControlMode); // For debugging
	}

</script>

<div>
  <h1>Physics Playground</h1>
  <div class="physics-pg-container">
		<p> This is a testbed for physics simulations. </p>
		<PhysicsPlayground {currentSection} controlMode={selectedControlMode} on:modechange={handleModeChange}>
			<Scene controlMode={selectedControlMode} />
		</PhysicsPlayground>
  </div>
</div>

<style lang="scss">
	.physics-pg-container {
		padding: var(--space-m);
	}
</style>

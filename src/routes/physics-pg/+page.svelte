<script lang="ts">
	import { T, Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import Scene from '$lib/components/visualization/scenes/Scene.svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store'; // Import Writable if not already
	import { onMount } from 'svelte'; // Import onMount
	import type { SvelteComponent } from 'svelte'; // Import SvelteComponent type

	const currentSection: Writable<string> = writable<string>('physics-playground');

	// State for the selected control mode
	let selectedControlMode: 'drag' | 'translate' = 'drag';

	// Reference to the Scene component instance
	let sceneComponent: Scene;

	// Variable to hold the dynamically imported component
	let PhysicsPlaygroundComponent: typeof SvelteComponent | null = null;

	onMount(async () => {
		const module = await import('$lib/components/visualization/PhysicsPlayground.svelte');
		// Explicitly cast to satisfy the type checker
		PhysicsPlaygroundComponent = module.default as typeof SvelteComponent;
	});

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
		// Reset the control mode back to drag
		selectedControlMode = 'drag';
		console.log('Control mode reset to drag');
	}

</script>

<div class="page-container">
  <h1 class="title">Physics Playground</h1>
  <div class="physics-pg-container">
		{#if PhysicsPlaygroundComponent}
			<svelte:component
				this={PhysicsPlaygroundComponent}
				{currentSection}
				bind:controlMode={selectedControlMode}
				on:modechange={handleModeChange}
				on:resetscene={handleReset}
			>
				<Scene bind:this={sceneComponent} bind:controlMode={selectedControlMode} />
			</svelte:component>
		{:else}
			<p>Loading visualization...</p> <!-- Optional loading indicator -->
		{/if}
  </div>
	<p> This is a testbed for physics simulations. </p>
</div>

<style lang="scss">
	.title {
		font-size: var(--step-3);
		font-weight: 500;
		margin-top: var(--space-m);
	}
	.physics-pg-container {
		padding: var(--space-m);
	}
</style>

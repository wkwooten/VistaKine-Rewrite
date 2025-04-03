<script lang="ts">
	import { T, Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import Scene from '$lib/components/visualization/scenes/Scene.svelte';
	import PhysicsPlayground from '$lib/components/visualization/PhysicsPlayground.svelte';
	import { writable } from 'svelte/store';

	const currentSection = writable<string>('physics-playground');
</script>

<div>
  <h1>Physics Playground</h1>
  <div class="physics-pg-container">
		<p> This is a testbed for physics simulations. </p>
		<PhysicsPlayground {currentSection}>
			<Scene />
		</PhysicsPlayground>
  </div>
</div>

<style lang="scss">
	.physics-pg-container {
		padding: var(--space-m);
	}
</style>

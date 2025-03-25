<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import type { Writable } from 'svelte/store';
	import ToolbarMain from './elements/ui/ToolbarMain.svelte';
	import FullscreenButton from './elements/ui/FullscreenButton.svelte';
	import { onMount, onDestroy } from 'svelte';
	export let currentSection : Writable<string>;

	let width: number;
	let height: number;
	let isFullscreen = false;

	function handleFullscreenToggle(event: CustomEvent<boolean>) {
		isFullscreen = event.detail;
	}
</script>

<div class="visualization-container" class:fullscreen={isFullscreen} bind:clientWidth={width} bind:clientHeight={height}>
	<div class="ui-container">
		<ToolbarMain />
		<FullscreenButton on:toggleFullscreen={handleFullscreenToggle} {isFullscreen}/>
	</div>

	<Canvas {width} {height}>
		<World>
			<slot />
		</World>
	</Canvas>
</div>

<style lang="scss">

	.visualization-container {
		/* background-color: white; */
		border-radius: var(--radius-lg);
		max-height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
		/* box-shadow: var(--shadow-md); */
		aspect-ratio: 16/9;
		width: 100%;
		height: 100%;
		position: relative; /* Important for absolute positioning of children */
		/* transition: width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease; */

		&.fullscreen {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			max-height: none;
			z-index: 1000; /* Ensure it's on top */
		}
	}

	.ui-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none; /* Allow clicks to pass through to the canvas */
		z-index: 10; /* Ensure UI is on top */
		display: flex;
		flex-direction: column;
		justify-content: space-between; /* Push toolbar to bottom, button to top */
		align-items: center;
	}

	:global(.ui-container > *) {
		pointer-events: auto; /* Make children of ui-container clickable */
	}

	:global(.ui-container .toolbar-main) {
		margin-bottom: 1rem; /* Add some margin at the bottom */
		align-self: center;
	}
	:global(.ui-container .fullscreen-button) {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
</style>
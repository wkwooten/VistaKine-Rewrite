<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import type { Writable } from 'svelte/store';
	import HudScene from './elements/ui/HudScene.svelte';
	import RendererSetup from './helpers/RendererSetup.svelte';
	import { onMount, onDestroy } from 'svelte';
	export let currentSection : Writable<string>;

	let width: number;
	let height: number;
	let isFullscreen = false;
	let containerElement: HTMLDivElement;

	function handleFullscreenToggle(event: CustomEvent<boolean>) {
		isFullscreen = event.detail;
	}
</script>

<div bind:this={containerElement} class="visualization-container" class:fullscreen={isFullscreen} bind:clientWidth={width} bind:clientHeight={height}>
	<div class="ui-container">
		<HudScene {isFullscreen} targetElement={containerElement}/>
	</div>

	<Canvas {width} {height}>
		<RendererSetup />
		<World>
			<slot />
		</World>
	</Canvas>
</div>

<style lang="scss">

	.visualization-container {
		background-color: var(--background-color);
		border-radius: var(--radius-sm);
		margin-block: var(--space-xl);
		border: 1px solid var(--border-color);
		max-height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
		/* box-shadow: var(--shadow-md); */
		aspect-ratio: 16/9;
		width: 100%;
		height: 100%;
		position: relative; /* Important for absolute positioning of children */
		/* transition: width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease; */

		@media (max-width: 768px) {
			aspect-ratio: 9/16;
		}
	}
</style>
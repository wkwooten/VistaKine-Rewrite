<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World, Debug } from '@threlte/rapier';
	import type { Writable } from 'svelte/store';
	import HudScene from './elements/ui/HudScene.svelte';
	import { onDestroy, createEventDispatcher } from 'svelte';
	import RendererSetup from './helpers/RendererSetup.svelte';
	import { PerfMonitor } from '@threlte/extras';
	export let currentSection : Writable<string>;
	export let controlMode: 'drag' | 'translate' = 'drag';

	const dispatch = createEventDispatcher();

	let isFullscreen = false;
	let containerElement: HTMLDivElement;

	function handleFullscreenToggle(event: CustomEvent<boolean>) {
		isFullscreen = event.detail;
	}

	function forwardModeChange(event: CustomEvent<{ mode: 'drag' | 'translate' }>) {
		dispatch('modechange', event.detail);
	}

	function handleResetScene() {
		dispatch('resetscene');
	}
</script>

<div bind:this={containerElement} class="visualization-container" class:fullscreen={isFullscreen}>
	<div class="ui-container">
		<HudScene
			{currentSection}
			{isFullscreen}
			targetElement={containerElement}
			bind:selectedControlMode={controlMode}
			on:modechange={forwardModeChange}
			on:resetscene={handleResetScene}
		/>
	</div>

	<Canvas>
		<RendererSetup />
		<World>
			<!-- <Debug /> -->
			<slot />
		</World>
		<PerfMonitor domElement={containerElement}   anchorX={'right'} anchorY={'top'}/>
	</Canvas>
</div>

<style lang="scss">

	.visualization-container {
		background-color: var(--background-color);
		/* margin-block: var(--space-xl); */
		border: 1px solid var(--border-color);
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 500px;
		aspect-ratio: 16/9;
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: var(--radius-sm);

		&.fullscreen {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			min-height: 100vh; /* Override min-height */
			border-radius: 0;
			border: none;
			z-index: 9999;
			aspect-ratio: auto;
		}

		@media (max-width: 768px) {
			aspect-ratio: 9/16;
			min-height: 300px;

			&.fullscreen {
				aspect-ratio: auto; /* Override aspect ratio for fullscreen on mobile */
				min-height: 100vh; /* Ensure full height on mobile fullscreen */
			}
		}
	}
</style>
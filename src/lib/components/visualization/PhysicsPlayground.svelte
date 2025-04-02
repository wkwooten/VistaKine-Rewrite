<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import type { Writable } from 'svelte/store';
	import HudScene from './elements/ui/HudScene.svelte';
	import { onMount, onDestroy } from 'svelte';
	export let currentSection : Writable<string>;

	let isFullscreen = false;
	let containerElement: HTMLDivElement;

	function handleFullscreenToggle(event: CustomEvent<boolean>) {
		isFullscreen = event.detail;
	}
</script>

<div bind:this={containerElement} class="visualization-container" class:fullscreen={isFullscreen}>
	<div class="ui-container">
		<HudScene {currentSection} {isFullscreen} targetElement={containerElement}/>
	</div>

	<Canvas>
		<World>
			<slot />
		</World>
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
		aspect-ratio: 16/9;
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: var(--radius-sm);
	}
</style>
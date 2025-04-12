<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import RendererSetup from './helpers/RendererSetup.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	// --- Props ---
	export let isComplete = false;

	// --- State ---
	let width: number;
	let height: number;
	let containerElement: HTMLDivElement;
</script>

<div
	bind:this={containerElement}
	class="visualization-container"
	class:complete={isComplete}
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<Canvas>
		<RendererSetup />
		<World>
			<slot />
		</World>
	</Canvas>
</div>

<style lang="scss">
	.visualization-container {
		background-color: var(--color-background);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
		max-height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 16/9;
		width: 100%;
		height: 100%;
		position: relative;
		transition: border-color 0.5s ease;

		@media (max-width: 768px) {
			aspect-ratio: 9/16;
		}
	}

	/* Added completion styles */
	.visualization-container.complete {
		box-shadow: var(--color-success) 2px 2px 10px 0;
		border-color: var(--color-success);
	}
</style>
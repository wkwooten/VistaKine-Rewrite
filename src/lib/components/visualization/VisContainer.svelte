<script lang="ts">
	import { Canvas } from '@threlte/core';
	import type { Writable } from 'svelte/store';
    export let currentSection : Writable<string>;

	let width: number;
	let height: number;
</script>

<div class="visualization-container" bind:clientWidth={width} bind:clientHeight={height}>
	<Canvas {width} {height}>
		<slot />
	</Canvas>
</div>

<style lang="scss">
	.visualization-container {
		background-color: transparent;
		border-radius: var(--radius-lg);
		max-height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-md);
    aspect-ratio: 16/9;
		width: 100%;
    height: 100%;
	}
</style>
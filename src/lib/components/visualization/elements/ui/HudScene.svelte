<script lang="ts">
	import ToolbarMain from './ToolbarMain.svelte';
	import FullscreenButton from './FullscreenButton.svelte';
	import type { Writable } from 'svelte/store';
	export let currentSection : Writable<string>;
	export let isFullscreen: boolean;
	export let targetElement: HTMLDivElement;

	let width: number;
	let height: number;

	function handleFullscreenToggle(event: CustomEvent<boolean>) {
		isFullscreen = event.detail;
	}
</script>

<div class="ui-container">
	<slot />
	<ToolbarMain />
	<FullscreenButton on:toggleFullscreen={handleFullscreenToggle} {isFullscreen} targetElement={targetElement}/>
</div>


<style lang="scss">
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
		margin-top: auto; /* Push toolbar to bottom */
		margin-bottom: 1rem; /* Keep some spacing from bottom edge */
		align-self: center;
	}
	:global(.ui-container .fullscreen-button) {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
	.hud-scene {
		position: absolute;
		top: 0;
		left: 0;
	}

</style>

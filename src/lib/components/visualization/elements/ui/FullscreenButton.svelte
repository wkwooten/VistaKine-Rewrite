<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Maximize2, Minimize2 } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	const dispatch = createEventDispatcher();
	export let isFullscreen = false;

	function toggleFullscreen() {
		isFullscreen = !isFullscreen;
		dispatch('toggleFullscreen', isFullscreen); // Dispatch with the new state
	}

	onMount(() => {
		// Define handleFullscreenChange *inside* onMount
		function handleFullscreenChange() {
			if (browser) {
				isFullscreen = !!document.fullscreenElement;
			}
		}

		document.addEventListener('fullscreenchange', handleFullscreenChange);

		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	});
</script>

<button on:click={toggleFullscreen} class="fullscreen-button">
	{#if isFullscreen}
		<Minimize2 size={24} />
	{:else}
		<Maximize2 size={24} />
	{/if}
</button>

<style>
	.fullscreen-button {
		padding: var(--space-xs-s); /* Use Utopia fluid spacing */
		border: none;
		border-radius: var(--radius-sm); /* Use variable for radius */
		background-color: var(--brand-primary); /* Use brand color */
		color: var(--brand-text-on-dark); /* Use appropriate text color */
		cursor: pointer;
		transition: background-color var(--transition-normal) var(--transition-bezier); /* Smooth transition */
		display: flex; /* Use flex to center the icon */
		align-items: center;
		justify-content: center;

		&:hover {
			background-color: var(--brand-hover-bg); /* Hover effect */
			color: var(--brand-hover-color)
		}

		&:focus {
			outline: 2px solid var(--brand-accent); /* Focus style */
			outline-offset: 2px;
		}

		&:active {
			background-color: var(--brand-active-bg);
		}
	}
</style>

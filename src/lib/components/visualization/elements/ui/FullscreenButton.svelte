<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Maximize2, Minimize2 } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	const dispatch = createEventDispatcher();
	export let isFullscreen = false;
	export let targetElement: HTMLElement | undefined = undefined; // Accept the target element

	async function toggleFullscreen() {
		if (!browser || !targetElement) return; // Guard against SSR and missing element

		if (!document.fullscreenElement) {
			try {
				await targetElement.requestFullscreen();
				// isFullscreen = true; // State will be updated by the event listener
			} catch (err) {
				console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
				// Optionally reset state if request fails
				// isFullscreen = false;
			}
		} else {
			if (document.exitFullscreen) {
				try {
					await document.exitFullscreen();
					// isFullscreen = false; // State will be updated by the event listener
				} catch (err) {
					console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`);
				}
			}
		}
		// We no longer need to manually dispatch the state,
		// as the 'fullscreenchange' listener will handle it.
		// dispatch('toggleFullscreen', isFullscreen);
	}

	onMount(() => {
		function handleFullscreenChange() {
			if (browser) {
				// Update state based on the actual browser fullscreen status
				isFullscreen = !!document.fullscreenElement;
				// Dispatch the updated state if the parent still needs it
				dispatch('toggleFullscreen', isFullscreen);
			}
		}

		// Add listener only in browser
		if (browser) {
			document.addEventListener('fullscreenchange', handleFullscreenChange);
		}

		// Cleanup function
		return () => {
			if (browser) {
				document.removeEventListener('fullscreenchange', handleFullscreenChange);
			}
		};
	});
</script>

<button on:click={toggleFullscreen} class="fullscreen-button" title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
	{#if isFullscreen}
		<Minimize2 size={24} />
	{:else}
		<Maximize2 size={24} />
	{/if}
</button>

<style>
	.fullscreen-button {
		padding: var(--space-xs-s); /* Use Utopia fluid spacing */
		/* border: none; */ /* Remove or adjust border */
		border-radius: var(--radius-sm); /* Use variable for radius */
		/* background-color: var(--brand-primary); */ /* Original background */
		color: var(--primary-color); /* Use appropriate text color */
		cursor: pointer;
		transition: background-color var(--transition-normal) var(--transition-bezier), border-color var(--transition-normal) var(--transition-bezier); /* Smooth transition - Added border-color */
		display: flex; /* Use flex to center the icon */
		align-items: center;
		justify-content: center;

		/* Glassmorphism */
		background-color: var(--glass-bg-color, rgba(255, 255, 255, 0.1)); /* Use glass background */
		backdrop-filter: var(--glass-backdrop-blur, blur(8px));
		-webkit-backdrop-filter: var(--glass-backdrop-blur, blur(8px)); /* Safari support */
		border: var(--glass-border, 1px solid rgba(255, 255, 255, 0.15));


		&:hover {
			/* Adjust hover if needed - maybe slightly less transparent */
			background-color: var(--brand-hover-bg); /* Revert to original hover or adjust */
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

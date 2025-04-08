<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Maximize2, Minimize2 } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	const dispatch = createEventDispatcher();
	export let isFullscreen = false;
	export let targetElement: HTMLElement | undefined = undefined; // Accept the target element

	/**
	 * Toggles fullscreen mode for the targetElement.
	 * It manually updates the component's state first for immediate UI feedback,
	 * then attempts to use the native browser Fullscreen API.
	 * It dispatches the 'toggleFullscreen' event with the new intended state.
	 */
	async function toggleFullscreen() {
		if (!browser || !targetElement) return; // Guard against SSR and missing element

		// Manually toggle state first for responsive UI and CSS class application
		const newState = !isFullscreen;
		isFullscreen = newState;
		dispatch('toggleFullscreen', newState);

		// Attempt native fullscreen/exit (best effort, handles vendor prefixes)
		if (newState) { // Enter fullscreen
			if (!document.fullscreenElement) {
				try {
					if (targetElement.requestFullscreen) {
						await targetElement.requestFullscreen();
					} else if ((targetElement as any).webkitRequestFullscreen) { /* Safari */
						await (targetElement as any).webkitRequestFullscreen();
					} else if ((targetElement as any).msRequestFullscreen) { /* IE11 */
						await (targetElement as any).msRequestFullscreen();
					}
				} catch (err) {
					console.error(`Error attempting to enable full-screen mode: ${err instanceof Error ? err.message : String(err)} (${err instanceof Error ? err.name : 'Unknown Error'})`);
					// Native request might fail, but the manual state toggle ensures UI reflects intent.
				}
			}
		} else { // Exit fullscreen
			if (document.fullscreenElement) {
				try {
					if (document.exitFullscreen) {
						await document.exitFullscreen();
					} else if ((document as any).webkitExitFullscreen) { /* Safari */
						await (document as any).webkitExitFullscreen();
					} else if ((document as any).msExitFullscreen) { /* IE11 */
						await (document as any).msExitFullscreen();
					}
				} catch (err) {
					console.error(`Error attempting to disable full-screen mode: ${err instanceof Error ? err.message : String(err)} (${err instanceof Error ? err.name : 'Unknown Error'})`);
					// Native exit might fail, but the manual state toggle ensures UI reflects intent.
				}
			}
		}
		// The 'fullscreenchange' listener handles syncing state if the browser state changes independently (e.g., ESC key).
	}

	/**
	 * Sets up and cleans up event listeners to synchronize the component's
	 * fullscreen state with the actual browser fullscreen status, handling cases
	 * like exiting fullscreen via the ESC key.
	 */
	onMount(() => {
		/**
		 * Event handler for native fullscreen change events.
		 * Detects discrepancies between the browser's fullscreen state and the
		 * component's state, then syncs the component state and dispatches an event.
		 */
		function handleFullscreenChange() {
			if (browser) {
				const browserIsFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);

				// Sync component state if it doesn't match the browser's actual state
				if (isFullscreen !== browserIsFullscreen) {
					console.log(`Fullscreen state mismatch detected. Browser: ${browserIsFullscreen}, Component: ${isFullscreen}. Syncing...`);
					isFullscreen = browserIsFullscreen;
					dispatch('toggleFullscreen', isFullscreen); // Dispatch the synced state
				}
			}
		}

		// Add listeners for standard and vendor-prefixed fullscreen change events
		if (browser) {
			document.addEventListener('fullscreenchange', handleFullscreenChange);
			document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari
			document.addEventListener('msfullscreenchange', handleFullscreenChange); // IE11
		}

		// Cleanup listeners on component destruction
		return () => {
			if (browser) {
				document.removeEventListener('fullscreenchange', handleFullscreenChange);
				document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
				document.removeEventListener('msfullscreenchange', handleFullscreenChange);
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
		border-radius: 50%; /* Use variable for radius */
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
		box-shadow: var(--shadow-sm);

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

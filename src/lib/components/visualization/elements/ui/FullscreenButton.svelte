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

		// --- Manual State Toggle --- START
		// Determine the intended new state *before* attempting native API
		const newState = !isFullscreen;
		// Update local state immediately so the icon changes
		isFullscreen = newState;
		// Dispatch the change immediately so parent applies CSS class
		dispatch('toggleFullscreen', newState);
		// --- Manual State Toggle --- END

		// Now, attempt native fullscreen/exit (best effort, might fail on iOS)
		if (newState) { // If we are trying to ENTER fullscreen
			if (!document.fullscreenElement) { // Only request if not already in native FS
				try {
					// Use vendor prefixes for wider compatibility if needed, but standard first
					if (targetElement.requestFullscreen) {
						await targetElement.requestFullscreen();
					} else if ((targetElement as any).webkitRequestFullscreen) { /* Safari */
						await (targetElement as any).webkitRequestFullscreen();
					} else if ((targetElement as any).msRequestFullscreen) { /* IE11 */
						await (targetElement as any).msRequestFullscreen();
					}
					// State was already updated manually. Listener handles browser state sync later.
				} catch (err) {
					console.error(`Error attempting to enable full-screen mode: ${err instanceof Error ? err.message : String(err)} (${err instanceof Error ? err.name : 'Unknown Error'})`);
					// If native request fails, our manual state toggle ensures the CSS class is still applied.
					// We don't revert isFullscreen here because the user *intended* to go fullscreen.
				}
			}
		} else { // If we are trying to EXIT fullscreen
			if (document.fullscreenElement) { // Only exit if browser *is* in native FS
				try {
					if (document.exitFullscreen) {
						await document.exitFullscreen();
					} else if ((document as any).webkitExitFullscreen) { /* Safari */
						await (document as any).webkitExitFullscreen();
					} else if ((document as any).msExitFullscreen) { /* IE11 */
						await (document as any).msExitFullscreen();
					}
					// State was already updated manually. Listener handles browser state sync later.
				} catch (err) {
					console.error(`Error attempting to disable full-screen mode: ${err instanceof Error ? err.message : String(err)} (${err instanceof Error ? err.name : 'Unknown Error'})`);
					// If native exit fails, we keep the manually toggled state (exited).
				}
			}
			// If document.fullscreenElement was already null (e.g., exited via ESC),
			// our manual toggle already set isFullscreen to false, which is correct.
		}
		// The 'fullscreenchange' listener below handles syncing 'isFullscreen'
		// if the browser's state changes independently (e.g., ESC key).
	}

	onMount(() => {
		function handleFullscreenChange() {
			if (browser) {
				// Get the actual browser fullscreen status
				const browserIsFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);

				// If the browser state differs from our component state
				if (isFullscreen !== browserIsFullscreen) {
					console.log(`Fullscreen state mismatch detected. Browser: ${browserIsFullscreen}, Component: ${isFullscreen}. Syncing...`);
					isFullscreen = browserIsFullscreen; // Sync component state to browser state
					// Dispatch the updated state reflecting the browser's actual status
					dispatch('toggleFullscreen', isFullscreen);
				}
			}
		}

		// Add listeners for standard and vendor-prefixed events
		if (browser) {
			document.addEventListener('fullscreenchange', handleFullscreenChange);
			document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari
			document.addEventListener('msfullscreenchange', handleFullscreenChange); // IE11
		}

		// Cleanup function
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

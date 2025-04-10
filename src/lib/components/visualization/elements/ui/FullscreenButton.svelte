<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Maximize2, Minimize2 } from 'lucide-svelte';
	// import { onMount, onDestroy } from 'svelte'; // No longer needed for listeners
	import { browser } from '$app/environment';

	const dispatch = createEventDispatcher();
	export let isFullscreen = false;
	// export let targetElement: HTMLElement | undefined = undefined; // Removed: Logic moved to parent

	/**
	 * Signals the parent component to attempt toggling fullscreen mode.
	 */
	function requestToggle() {
		if (!browser) return; // Still useful to prevent clicks during SSR if rendered
		console.log('[FullscreenButton] Dispatching requestToggle');
		dispatch('requestToggle');
	}
</script>

<button on:click={requestToggle} class="fullscreen-button" title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
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
		border-radius: 50%; /* Use variable for radius */
		/* background-color: var(--color-accent); */ /* Original background */
		color: var(--color-accent); /* Use appropriate text color */
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
			background-color: var(--color-accent-hover-bg); /* Revert to original hover or adjust */
			color: var(--color-accent-light);
		}

		&:focus {
			outline: 2px solid var(--color-accent-light); /* Focus style */
			outline-offset: 1px;
		}

		&:active {
			background-color: var(--color-accent-active-bg);
		}
	}
</style>

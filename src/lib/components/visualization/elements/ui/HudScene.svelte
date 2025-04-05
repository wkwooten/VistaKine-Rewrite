<script lang="ts">
	import ToolbarMain from './ToolbarMain.svelte';
	import FullscreenButton from './FullscreenButton.svelte';
	import type { Writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import FBDMenu from './FBDMenu.svelte';
	import ResetButton from './ResetButton.svelte';
	import { isFBDMenuOpen } from '$lib/stores/uiStores'; // Import menu state store
	import { fbdVisibilityStore, type FBDVisibilityState } from '$lib/stores/fbdStores'; // Import FBD visibility store


	export let currentSection : Writable<string>;
	export let isFullscreen: boolean;
	export let targetElement: HTMLDivElement;
	export let selectedControlMode: 'drag' | 'translate' = 'drag'; // State for the control mode

	const dispatch = createEventDispatcher();

	let width: number;
	let height: number;

	function handleFullscreenToggle(event: CustomEvent<boolean>) {
		isFullscreen = event.detail;
	}

	// Reactively dispatch the modechange event whenever selectedControlMode changes
	$: if (dispatch) {
		dispatch('modechange', { mode: selectedControlMode });
	}

	// $: console.log('Selected control mode in HudScene:', selectedControlMode); // Optional: Log changes

	// Reactive statement to clear FBD visibility when menu closes
	$: {
		if (!$isFBDMenuOpen) {
			// Check if any are currently visible before updating to avoid unnecessary updates
			let anyVisible = false;
			const unsub = fbdVisibilityStore.subscribe(current => {
				anyVisible = Object.values(current).some(v => v);
			});
			unsub(); // Unsubscribe immediately after reading

			if (anyVisible) {
				console.log('[HudScene] FBD Menu closed, hiding all vectors.');
				fbdVisibilityStore.update(current => {
					const updated: FBDVisibilityState = { ...current };
					for (const key in updated) {
						updated[key as keyof FBDVisibilityState] = false;
					}
					return updated;
				});
			}
		}
	}
</script>

<div class="ui-container">
	<slot />
	<ResetButton on:resetscene={() => dispatch('resetscene')} />
	<!-- Conditionally render FBDMenu container based on store -->
	{#if $isFBDMenuOpen}
		<div class="fbd-menu-container">
			<FBDMenu />
		</div>
	{/if}
	<ToolbarMain bind:selectedMode={selectedControlMode} />
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

	:global(.ui-container .fbd-menu-container) {
		position: absolute;
		top: 20%; /* Position below the reset button */
		left: 1rem;
		z-index: 11;
		background-color: var(--glass-bg-color, rgba(255, 255, 255, 0.1)); /* Use glass background */
		backdrop-filter: var(--glass-backdrop-blur, blur(8px));
		-webkit-backdrop-filter: var(--glass-backdrop-blur, blur(8px)); /* Safari support */
		padding: var(--space-s);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-sm);
	}

	:global(.ui-container .reset-button) {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 11; /* Ensure it's above other UI elements if needed */
	}
	.hud-scene {
		position: absolute;
		top: 0;
		left: 0;
	}

</style>

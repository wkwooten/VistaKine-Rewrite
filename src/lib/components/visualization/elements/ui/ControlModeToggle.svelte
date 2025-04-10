<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Hand, Move3D } from 'lucide-svelte';

	let isMenuOpen = false;
	let currentMode: 'drag' | 'translate' = 'drag'; // Default mode

	const dispatch = createEventDispatcher();

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function selectMode(mode: 'drag' | 'translate') {
		currentMode = mode;
		isMenuOpen = false; // Close menu after selection
		dispatch('modechange', { mode });
		console.log("Selected mode:", mode); // For debugging
	}

	// TODO: Add icons for the modes
</script>

<div class="control-mode-toggle">
	<button class="toggle-button" on:click={toggleMenu} title="Change control mode">
		{#if currentMode === 'drag'}
			<Hand size={32} />
		{:else}
			<Move3D size={20} />
		{/if}
	</button>

	{#if isMenuOpen}
		<div class="mode-menu">
			<button on:click={() => selectMode('drag')} class:active={currentMode === 'drag'}>
				<Hand size={18} class="menu-icon"/> Drag
			</button>
			<button on:click={() => selectMode('translate')} class:active={currentMode === 'translate'}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-icon"><path d="M5 3v16h16"/><path d="m5 19 6-6"/><path d="m2 6 3-3 3 3"/><path d="m18 16 3 3-3 3"/></svg>
				 Translate
			</button>
		</div>
	{/if}
</div>

<style>
	.control-mode-toggle {
		position: relative; /* Needed for absolute positioning of the menu */
		display: inline-block;
	}

	.toggle-button {
		/* Basic button styling - adapt as needed */
		background: var(--glass-bg-color, rgba(255, 255, 255, 0.2));
		border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.3));
		padding: var(--space-3xs) var(--space-2xs);
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-size: 1.2rem; /* Adjust icon size */
		line-height: 1;
		/* min-width: 40px;
		height: 40px;
		aspect-ratio: 1/1; */
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: var(--glass-backdrop-blur, blur(5px));
		-webkit-backdrop-filter: var(--glass-backdrop-blur, blur(5px));
	}

	.toggle-button:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.mode-menu {
		position: absolute;
		bottom: calc(100% + 5px); /* Position above the button */
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--glass-bg-color, rgba(50, 50, 50, 0.8));
		border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
		border-radius: var(--radius-xs);
		padding: var(--space-3xs);
		box-shadow: var(--shadow-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
		z-index: 1010; /* Ensure menu is above toolbar */
		backdrop-filter: var(--glass-backdrop-blur, blur(8px));
		-webkit-backdrop-filter: var(--glass-backdrop-blur, blur(8px));
	}

	.mode-menu button {
		background: none;
		border: none;
		color: var(--color-text-primary);
		padding: var(--space-2xs) var(--space-xs);
		text-align: left;
		cursor: pointer;
		border-radius: var(--radius-xs);
		white-space: nowrap;
		display: flex; /* Align icon and text */
		align-items: center; /* Vertically center icon and text */
		gap: var(--space-3xs); /* Space between icon and text */
	}

	.mode-menu button:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.mode-menu button.active {
		background-color: rgba(255, 255, 255, 0.2);
		font-weight: bold;
	}

	.menu-icon {
		/* Optional: Add specific styling for menu icons if needed */
		stroke: currentColor; /* Ensure icon inherits text color */
		flex-shrink: 0; /* Prevent icon from shrinking if button text is long */
	}
</style>

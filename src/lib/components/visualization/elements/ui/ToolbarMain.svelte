<script lang="ts">
	import ControlModeToggle from './ControlModeToggle.svelte';
	import { Move } from 'lucide-svelte'; // Import the icon
	import { isFBDMenuOpen } from '$lib/stores/uiStores'; // Import the store

	// Props for customization (optional, but good practice)
	export let backgroundColor: string = 'var(--glass-bg-color, rgba(255, 255, 255, 0.1))'; // Default background with fallback - UPDATED
	export let textColor: string = 'var(--text-color)';          // Default text color
	export let padding: string = 'var(--space-2xs)';                // Default padding, using Utopia fluid spacing
	export let gap: string = 'var(--space-s)';                          // Default gap between items
	export let borderRadius: string = 'var(--radius-sm)'; // Default border radius
	export let boxShadow: string = 'var(--shadow-sm)';    // Default box shadow
	export let width: string = 'fit-content';
	export let selectedMode: 'drag' | 'translate' = 'drag'; // Default - Exported prop

	function handleModeChange(event: CustomEvent<{ mode: 'drag' | 'translate' }>) {
		selectedMode = event.detail.mode; // Update the bound prop directly
	}
</script>

<div
	class="toolbar-main"
	style:background-color={backgroundColor}
	style:color={textColor}
	style:padding={padding}
	style:gap={gap}
	style:border-radius={borderRadius}
	style:box-shadow={boxShadow}
	style:width={width}
>

	<ControlModeToggle on:modechange={handleModeChange} />

	<!-- FBD Menu Toggle Button -->
	<button class="toolbar-button fbd-toggle-button" on:click={() => isFBDMenuOpen.update(open => !open)} title="Toggle Free Body Diagram Controls">
		<Move size={32} />
	</button>

	<!-- Placeholder slots -->
	<!-- <div class="placeholder-slot">1</div>
	<div class="placeholder-slot">2</div> -->
	<div class="placeholder-slot">3</div>
	<div class="placeholder-slot">4</div>
</div>

<style>
	.toolbar-main {
		display: flex;
		align-items: center; /* Vertically center items */
		z-index: 1000; /* Ensure it's above other content */
		border: 1px solid var(--border-color,#ccc);
		box-shadow: var(--shadow-sm);
		border-radius: var(--radius-lg);

		/* Glassmorphism */
		backdrop-filter: var(--glass-backdrop-blur, blur(8px));
		-webkit-backdrop-filter: var(--glass-backdrop-blur, blur(8px)); /* Safari support */
		/* border: var(--glass-border, 1px solid rgba(255, 255, 255, 0.15)); */
	}

	/* Basic styling for placeholder slots */
	.placeholder-slot {
		width: 30px;
		height: 30px;
		border: 1px dashed var(--border-color, #ccc);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8em;
		color: var(--text-muted-color, #888);
	}

	/* Style for the toolbar buttons */
	.toolbar-button {
		background: none;
		border: none;
		padding: var(--space-3xs); /* Small padding */
		margin: 0;
		color: var(--primary-color); /* Inherit text color from toolbar */
		cursor: pointer;
		display: inline-flex; /* Align icon nicely */
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		transition: background-color 0.2s ease;
	}

	.toolbar-button:hover {
		background-color: var(--brand-hover-bg);
		color: var(--brand-hover-color);
	}

	.fbd-toggle-button:focus {
		outline: 2px solid var(--focus-ring-color);
		outline-offset: 1px;
	}
</style>
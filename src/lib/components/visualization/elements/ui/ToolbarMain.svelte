<script lang="ts">
	// Props for customization (optional, but good practice)
	export let backgroundColor: string = 'var(--background-elevation-1, var(--background-color))'; // Default background with fallback
	export let textColor: string = 'var(--text-color)';          // Default text color
	export let padding: string = 'var(--space-s-m)';                // Default padding, using Utopia fluid spacing
	export let gap: string = 'var(--space-s)';                          // Default gap between items
	export let borderRadius: string = 'var(--radius-sm)'; // Default border radius
	export let boxShadow: string = 'var(--shadow-sm)';    // Default box shadow
	export let width: string = 'fit-content';
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
	<slot />
</div>

<style>
	.toolbar-main {
		display: flex;
		align-items: center; /* Vertically center items */
		z-index: 1000; /* Ensure it's above other content */
	}
</style>
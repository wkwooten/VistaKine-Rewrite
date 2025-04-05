<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { RotateCcw } from 'lucide-svelte';

	const dispatch = createEventDispatcher();

	function handleResetClick() {
		dispatch('resetscene');
	}
</script>

<button class="reset-button" on:click={handleResetClick}>
	<RotateCcw size={24} />
</button>

<style>
	/* Add any button-specific styles here */
	.reset-button {

		padding: 0.5rem 1rem;
		cursor: pointer;
		z-index: 11;

		padding: var(--space-xs-s);
		border-radius: 50%;
		color: var(--primary-color);
		cursor: pointer;
		transition: background-color var(--transition-normal) var(--transition-bezier), border-color var(--transition-normal) var(--transition-bezier);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-sm);


		/* Glassmorphism */
		background-color: var(--glass-bg-color, rgba(255, 255, 255, 0.1)); /* Use glass background */
		backdrop-filter: var(--glass-backdrop-blur, blur(8px));
		-webkit-backdrop-filter: var(--glass-backdrop-blur, blur(8px)); /* Safari support */
		/* border: var(--glass-border, 1px solid rgba(255, 255, 255, 0.15)); */


		&:hover {
			/* Adjust hover if needed - maybe slightly less transparent */
			background-color: var(--brand-hover-bg); /* Revert to original hover or adjust */
			color: var(--brand-hover-color)
		}


		&:active {
			background-color: var(--brand-active-bg);
		}
	}
</style>
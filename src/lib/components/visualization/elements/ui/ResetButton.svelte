<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { RotateCcw } from 'lucide-svelte';

	const dispatch = createEventDispatcher();

	let isRotating = false; // State to control animation

	function handleResetClick() {
		dispatch('resetscene');
		if (!isRotating) { // Prevent re-triggering if already rotating
			isRotating = true;
		}
	}

	function handleAnimationEnd() {
		isRotating = false; // Reset state when animation finishes
	}
</script>

<button class="reset-button" on:click={handleResetClick}>
	<!-- Apply rotating class based on state and listen for animation end -->
	<div  class:rotating={isRotating} on:animationend={handleAnimationEnd}>
		<RotateCcw size={24} />
	</div>
</button>

<style>
	/* Define the rotation animation */
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg); /* Counter-clockwise rotation */
		}
	}

	/* Apply the animation when the rotating class is present */
	/* Use :global(svg) to target the SVG inside the Lucide component */
	:global(.reset-button svg.rotating) {
		animation: spin 0.5s linear; /* Adjust duration and timing as needed */
	}

	/* Add any button-specific styles here */
	.reset-button {
		/* Consistent styles */
		padding: var(--space-xs-s);
		border: 1px solid var(--color-accent);
		border-radius: 50%;
		color: var(--color-accent);
		background-color: var(--color-surface);
		cursor: pointer;
		transition: transform 0.1s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease; /* Added border-color transition */
		display: flex;
		align-items: center;
		justify-content: center;
		margin: var(--space-s);
		box-shadow: var(--shadow-sm);

		/* Removed Glassmorphism */
		/* backdrop-filter: var(--glass-backdrop-blur, blur(8px)); */
		/* -webkit-backdrop-filter: var(--glass-backdrop-blur, blur(8px)); */

		/* Consistent hover/active states */
		&:hover {
			background-color: var(--color-accent-hover-bg);
			color: var(--color-accent-light);
			transform: translateY(-1px);
			/* Optional: border change on hover */
			/* border-color: var(--color-accent-light); */
		}

		&:active {
			background-color: var(--color-accent-active-bg);
			transform: translateY(0);
		}
	}

	.rotating {
		animation: spin 0.5s linear; /* Adjust duration and timing as needed */
	}
</style>
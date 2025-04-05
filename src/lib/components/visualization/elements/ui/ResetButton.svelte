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

	.rotating {
		animation: spin 0.5s linear; /* Adjust duration and timing as needed */
	}
</style>
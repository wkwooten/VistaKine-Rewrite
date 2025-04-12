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
		margin: var(--space-s);

		padding: var(--space-xs-s);
		border-radius: 50%;
		color: var(--color-accent);
		cursor: pointer;
		transition: transform 0.1s ease, background-color 0.2s ease, color 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-sm);
		/* Glassmorphism */
		background-color: var(--glass-bg-color, rgba(255, 255, 255, 0.1)); /* Use glass background */
		border: var(--glass-border, 1px solid rgba(255, 255, 255, 0.15));

		backdrop-filter: var(--glass-backdrop-blur, blur(8px));
		-webkit-backdrop-filter: var(--glass-backdrop-blur, blur(8px)); /* Safari support */
		/* border: var(--glass-border, 1px solid rgba(255, 255, 255, 0.15)); */

		&:hover {
			background-color: var(--color-accent-hover-bg); /* Revert to original hover or adjust */
			color: var(--color-accent-light);
			transform: translateY(-1px);
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
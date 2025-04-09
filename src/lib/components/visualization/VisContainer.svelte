<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import type { Writable } from 'svelte/store';
	import RendererSetup from './helpers/RendererSetup.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import CalibrationHud from './elements/layouts/CalibrationHud.svelte';

	let { currentSection = undefined, isCalibrationComplete = false } = $props<{
		currentSection?: Writable<string>;
		isCalibrationComplete?: boolean;
	}>();

	let width: number;
	let height: number;
	let isFullscreen = false;
	let containerElement: HTMLDivElement;

	async function toggleFullscreen() {
		if (!browser || !containerElement) return;

		const newState = !isFullscreen;

		if (newState) {
			if (!document.fullscreenElement) {
				try {
					if (containerElement.requestFullscreen) {
						await containerElement.requestFullscreen();
					} else if ((containerElement as any).webkitRequestFullscreen) {
						await (containerElement as any).webkitRequestFullscreen();
					} else if ((containerElement as any).msRequestFullscreen) {
						await (containerElement as any).msRequestFullscreen();
					}
					isFullscreen = true;
				} catch (err) {
					console.error(`Error attempting to enable full-screen mode: ${err instanceof Error ? err.message : String(err)} (${err instanceof Error ? err.name : 'Unknown Error'})`);
					isFullscreen = false;
				}
			}
		} else {
			if (document.fullscreenElement) {
				try {
					if (document.exitFullscreen) {
						await document.exitFullscreen();
					} else if ((document as any).webkitExitFullscreen) {
						await (document as any).webkitExitFullscreen();
					} else if ((document as any).msExitFullscreen) {
						await (document as any).msExitFullscreen();
					}
					isFullscreen = false;
				} catch (err) {
					console.error(`Error attempting to disable full-screen mode: ${err instanceof Error ? err.message : String(err)} (${err instanceof Error ? err.name : 'Unknown Error'})`);
				}
			} else {
				isFullscreen = false;
			}
		}
	}

	onMount(() => {
		function handleFullscreenChange() {
			if (browser) {
				const browserIsFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
				if (isFullscreen !== browserIsFullscreen) {
					console.log(`[VisContainer] Syncing fullscreen state. Browser: ${browserIsFullscreen}, Component: ${isFullscreen}.`);
					isFullscreen = browserIsFullscreen;
				}
			}
		}

		if (browser) {
			document.addEventListener('fullscreenchange', handleFullscreenChange);
			document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
			document.addEventListener('msfullscreenchange', handleFullscreenChange);
		}

		return () => {
			if (browser) {
				document.removeEventListener('fullscreenchange', handleFullscreenChange);
				document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
				document.removeEventListener('msfullscreenchange', handleFullscreenChange);
			}
		};
	});

	function handleResetScene() {
		console.log('Reset scene requested in VisContainer');
	}
</script>

<div
	bind:this={containerElement}
	class="visualization-container"
	class:fullscreen={isFullscreen}
	class:complete={isCalibrationComplete}
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<Canvas>
		<RendererSetup />
		<World>
			<slot />
		</World>
	</Canvas>

	<CalibrationHud
		bind:isFullscreen
		on:requestToggleFullscreen={toggleFullscreen}
	/>
</div>

<style lang="scss">
	.visualization-container {
		background-color: var(--background-color);
		border-radius: var(--radius-sm);
		/* margin-block: var(--space-xl); */
		border: 1px solid var(--border-color);
		max-height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
		/* box-shadow: var(--shadow-md); */
		aspect-ratio: 16/9;
		width: 100%;
		height: 100%;
		position: relative; /* Important for absolute positioning of children */
		/* transition: width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease; */
		transition: border-color 0.5s ease;

		&.complete {
			box-shadow: var(--color-success) 2px 2px 10px 0;
		}

		&.fullscreen {
			position: fixed; /* Use fixed positioning for fullscreen */
			top: 0;
			left: 0;
			width: 100vw; /* Full viewport width */
			height: 100vh; /* Full viewport height */
			max-height: 100vh; /* Override max-height */
			border-radius: 0; /* Remove border radius */
			border: none; /* Remove border */
			z-index: 9999; /* Ensure it's on top */
			aspect-ratio: auto; /* Allow free aspect ratio */
		}

		@media (max-width: 768px) {
			aspect-ratio: 9/16;

			&.fullscreen {
				aspect-ratio: auto; /* Override aspect ratio for fullscreen on mobile */
			}
		}
	}
</style>
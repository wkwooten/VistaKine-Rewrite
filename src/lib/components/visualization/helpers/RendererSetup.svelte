<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import { onMount } from 'svelte';
	import { NoToneMapping } from 'three';

	// Get the renderer instance - this is safe now because
	// this component will be rendered INSIDE <Canvas>
	const { renderer } = useThrelte();

	onMount(() => {
		// Disable tone mapping
		console.log('Setting NoToneMapping via RendererSetup component');
		// No need for setTimeout here as context should be ready by onMount
		if (renderer) {
			renderer.toneMapping = NoToneMapping;
		} else {
			console.error('Renderer context not available in RendererSetup onMount');
		}
	});

</script>

<!-- This component renders nothing visually -->
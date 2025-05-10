<script lang="ts">
  import FullscreenButton from "./../../elements/ui/FullscreenButton.svelte";
  import ResetButton from "../../elements/ui/ResetButton.svelte";
  import type { Vector3 } from "three";
  // Import specific color stores if needed by HUD text, or rely on CSS variables set by themeColors
  // For now, assuming HUD text color is primarily handled by CSS variables or defaults.
  import katex from "katex";
  import AddButton from "$lib/components/visualization/elements/ui/AddButton.svelte";

  let {
    nozzlePosition,
    currentVectorA, // This will be currentDefiningVector from the parent
    dialogMessage,
    dialogSpeaker,
  } = $props<{
    nozzlePosition: Vector3;
    currentVectorA?: Vector3; // Represents the vector currently being defined/inputted
    dialogMessage?: string;
    dialogSpeaker?: string;
  }>();

  const formatVector = (v: Vector3 | undefined, defaultText = "⟨0,0,0⟩") => {
    if (!v || v.lengthSq() === 0) return defaultText; // Show 0,0,0 for zero vectors or undefined
    return `⟨${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)}⟩`;
  };

  const formatDeltaVector = (v: Vector3 | undefined) => {
    if (!v || v.lengthSq() === 0) return "⟨0,0,0⟩"; // Show 0,0,0 if not being defined
    return `⟨${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)}⟩`;
  };
</script>

<div class="vector-printer-hud-overlay">
  <div class="hud-panel bottom-right">
    <div class="hud-item">
      <span class="label">Nozzle Position:</span>
      <span class="value">{formatVector(nozzlePosition)}</span>
    </div>
    {#if currentVectorA}
      <!-- Only show if a vector is being defined (non-zero) -->
      <div class="hud-item">
        <!-- Label changed to reflect it's the components being input -->
        <span class="label">{@html katex.renderToString("\\vec{A}")} =</span>
        <span class="value">{formatDeltaVector(currentVectorA)}</span>
      </div>
    {/if}
  </div>

  <div class="hud-items">
    <div class="reset-button">
      <ResetButton />
    </div>
    <div class="add-vector-button">
      <AddButton />
    </div>
    <div class="fullscreen-button">
      <FullscreenButton />
    </div>
  </div>
  <!-- Future placeholder for dialog elements if not using DialogBox component directly in HUD -->
  <!-- {#if dialogMessage && dialogSpeaker}
		<div class="hud-panel bottom-center dialog-preview">
			<div class="speaker">{dialogSpeaker}:</div>
			<div class="message">{dialogMessage}</div>
		</div>
	{/if} -->
</div>

<style lang="scss">
  .vector-printer-hud-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Overall overlay doesn't block controls below */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--space-xs);
    font-family: var(--font-mono);
    font-size: var(--step--1);
    color: var(
      --color-text-hud,
      white
    ); /* Uses CSS variable from _variables.scss */
  }

  .hud-panel {
    background-color: var(
      --color-surface-transparent,
      rgba(0, 0, 0, 0.5)
    ); /* Uses CSS variable */
    padding: var(--space-xs);
    border-radius: var(--radius-sm);
    pointer-events: auto; /* Panels themselves can be interacted with if needed */
    box-shadow: var(--shadow-sm);
    max-width: 300px;
  }

  .hud-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-xxs);
    align-items: center;

    .label {
      margin-right: var(--space-xs);
      color: var(--color-text-hud-secondary, lightgray); /* Uses CSS variable */
    }
    .value {
      font-weight: 500;
      min-width: 100px; // Ensure some alignment
      text-align: right;
    }
    .value.bold {
      font-weight: 700;
    }
  }

  .hud-item.resultant {
    margin-top: var(--space-xs);
    padding-top: var(--space-xs);
    border-top: 1px solid var(--color-border-hud, rgba(255, 255, 255, 0.2)); /* Uses CSS variable */
  }

  /* Styling for KaTeX rendered elements */
  :global(.vector-printer-hud-overlay .katex) {
    font-size: inherit !important; // Match surrounding text
    color: inherit !important;
  }

  /* Dialog preview (if used directly in HUD) */
  .dialog-preview {
    align-self: center;
    margin-bottom: var(--space-m);
    text-align: center;
    .speaker {
      font-weight: bold;
      color: var(--color-accent-light); /* Example color */
    }
    .message {
      margin-top: var(--space-xxs);
    }
  }
</style>

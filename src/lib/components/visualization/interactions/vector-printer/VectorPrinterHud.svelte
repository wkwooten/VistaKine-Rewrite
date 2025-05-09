<script lang="ts">
  import type { Vector3 } from "three";
  // Import specific color stores if needed by HUD text, or rely on CSS variables set by themeColors
  // For now, assuming HUD text color is primarily handled by CSS variables or defaults.
  import katex from "katex";

  let {
    nozzlePosition,
    currentVectorA,
    currentVectorB,
    resultantVector, // Example for vector addition display
    dialogMessage,
    dialogSpeaker,
  } = $props<{
    nozzlePosition: Vector3;
    currentVectorA?: Vector3; // For displaying components of A
    currentVectorB?: Vector3; // For displaying components of B
    resultantVector?: Vector3; // Example: A + B
    dialogMessage?: string;
    dialogSpeaker?: string;
  }>();

  const formatVector = (v: Vector3 | undefined) => {
    if (!v) return "⟨?, ?, ?⟩";
    return `⟨${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)}⟩`;
  };
</script>

<div class="vector-printer-hud-overlay">
  <div class="hud-panel top-left">
    <div class="hud-item">
      <span class="label">Nozzle Position:</span>
      <span class="value">{formatVector(nozzlePosition)}</span>
    </div>
    {#if currentVectorA}
      <div class="hud-item">
        <span class="label">{@html katex.renderToString("\\vec{A}")} =</span>
        <span class="value">{formatVector(currentVectorA)}</span>
      </div>
    {/if}
    {#if currentVectorB}
      <div class="hud-item">
        <span class="label">{@html katex.renderToString("\\vec{B}")} =</span>
        <span class="value">{formatVector(currentVectorB)}</span>
      </div>
    {/if}
    {#if currentVectorA && currentVectorB && resultantVector}
      <div class="hud-item resultant">
        <span class="label"
          >{@html katex.renderToString("\\vec{A} + \\vec{B}")} =</span
        >
        <span class="value bold">{formatVector(resultantVector)}</span>
      </div>
    {/if}
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

  .top-left {
    position: absolute;
    top: var(--space-s);
    left: var(--space-s);
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

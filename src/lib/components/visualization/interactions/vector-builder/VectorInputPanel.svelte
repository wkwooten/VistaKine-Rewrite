<script lang="ts">
  import {
    startCoordsRaw, endCoordsRaw,
    startCoordsNum, endCoordsNum, // Import derived stores for validation
    vectorData, traceVectorRequested,
    xAxisColor, yAxisColor, zAxisColor, // Import color stores
  } from '$lib/stores/vectorBuilderState';
  import { get } from 'svelte/store';
  // Import a Toggle component if available, otherwise use checkbox
  // Assuming a simple checkbox for now
  // import Toggle from '$lib/components/ui/Toggle.svelte'; // Example path

  // Use $props() for runes mode
  let { extraClass = '' } = $props<{ extraClass?: string }>();

  // --- Interaction Tracking for Validation Styling ---
  let startInteracted = $state({ x: false, y: false, z: false });
  let endInteracted = $state({ x: false, y: false, z: false });

  // --- Input Sanitization ---
  function handleIntegerInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Allow only digits and an optional leading minus sign
    input.value = input.value.replace(/[^-\d]/g, '').replace(/(?!^)-/g, '');
    // Note: bind:value will automatically update the store with the sanitized value
  }

  // Function to handle triggering the trace (moved here)
  function handleTrace() {
    // TODO: Add input validation (ensure numbers, maybe check bounds)
    if (get(vectorData)) { // Only trace if vector is valid
        traceVectorRequested.set(true);
    }
  }

</script>

<div class="vector-input-panel {extraClass}">
  <h4>Define Vector</h4>
  <div class="input-section">
    <fieldset class="point-fieldset">
      <legend>Start Point (X1, Y1, Z1)</legend>
      <div class="coord-inputs">
        <!-- X Input Group -->
        <div class="axis-input-group" style="border-color: {$xAxisColor};" class:invalid={startInteracted.x && $startCoordsNum === null}>
          <span class="axis-label" style="color: {$xAxisColor};">X</span>
          <input
            type="number"
            step="1"
            bind:value={$startCoordsRaw.x}
            oninput={handleIntegerInput}
            onblur={() => startInteracted.x = true}
            placeholder="0"
          />
        </div>
        <!-- Y Input Group -->
        <div class="axis-input-group" style="border-color: {$yAxisColor};" class:invalid={startInteracted.y && $startCoordsNum === null}>
           <span class="axis-label" style="color: {$yAxisColor};">Y</span>
           <input
            type="number"
            step="1"
            bind:value={$startCoordsRaw.y}
            oninput={handleIntegerInput}
            onblur={() => startInteracted.y = true}
            placeholder="0"
          />
        </div>
        <!-- Z Input Group -->
        <div class="axis-input-group" style="border-color: {$zAxisColor};" class:invalid={startInteracted.z && $startCoordsNum === null}>
           <span class="axis-label" style="color: {$zAxisColor};">Z</span>
           <input
            type="number"
            step="1"
            bind:value={$startCoordsRaw.z}
            oninput={handleIntegerInput}
            onblur={() => startInteracted.z = true}
            placeholder="0"
          />
        </div>
      </div>
    </fieldset>

    <fieldset class="point-fieldset">
      <legend>End Point (X2, Y2, Z2)</legend>
      <div class="coord-inputs">
        <!-- X Input Group -->
        <div class="axis-input-group" style="border-color: {$xAxisColor};" class:invalid={endInteracted.x && $endCoordsNum === null}>
          <span class="axis-label" style="color: {$xAxisColor};">X</span>
          <input
            type="number"
            step="1"
            bind:value={$endCoordsRaw.x}
            oninput={handleIntegerInput}
            onblur={() => endInteracted.x = true}
            placeholder="X"
          />
        </div>
        <!-- Y Input Group -->
        <div class="axis-input-group" style="border-color: {$yAxisColor};" class:invalid={endInteracted.y && $endCoordsNum === null}>
          <span class="axis-label" style="color: {$yAxisColor};">Y</span>
          <input
            type="number"
            step="1"
            bind:value={$endCoordsRaw.y}
            oninput={handleIntegerInput}
            onblur={() => endInteracted.y = true}
            placeholder="Y"
          />
        </div>
        <!-- Z Input Group -->
        <div class="axis-input-group" style="border-color: {$zAxisColor};" class:invalid={endInteracted.z && $endCoordsNum === null}>
          <span class="axis-label" style="color: {$zAxisColor};">Z</span>
          <input
            type="number"
            step="1"
            bind:value={$endCoordsRaw.z}
            oninput={handleIntegerInput}
            onblur={() => endInteracted.z = true}
            placeholder="Z"
          />
        </div>
      </div>
    </fieldset>
  </div>

  <!-- Moved controls-section here -->
  <div class="controls-section">
    <button onclick={handleTrace} disabled={!$vectorData}>Create & Trace Vector</button>
  </div>
</div>

<style lang="scss">
	label {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: white
	}

  /* Styles specific to this panel - copy relevant styles from VectorBuilderHud */
  .vector-input-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-xs);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
		margin-block: var(--space-s);
    background-color: var(--color-surface-overlay);
    pointer-events: auto;
    user-select: none; /* Disable text selection */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE/Edge */
  }

  h4 {
    margin-bottom: var(--space-2xs);
    color: var(--color-text-secondary);
    font-weight: 600;
    font-size: 1.1em;
  }

  .input-section {
    display: grid;
    gap: var(--space-xs);
  }

  .point-fieldset {
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-sm);
    padding: var(--space-2xs);
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);

    legend {
        /* --- Updated Styles --- */
        background-color: var(--color-surface); /* Use theme surface color */
        color: var(--color-text-secondary); /* Use secondary text color */
        border-radius: var(--radius-pill); /* Use theme variable for capsule shape */
        padding: var(--space-2xs) var(--space-s); /* Adjust padding (vertical, horizontal) */
        margin-left: var(--space-xs); /* Indent slightly from the left edge */
        margin-bottom: var(--space-3xs); /* Add a little space below the legend */
        line-height: 1.2; /* Adjust line height for padding */
        display: inline-block; /* Treat as block for background/padding */
        max-width: max-content; /* Prevent stretching */
        font-weight: 500; /* Slightly bolder */
        font-size: 0.9em; /* Keep font size */
        border: 1px solid var(--color-border-light); /* Add a subtle border for definition */
        /* --- End Updated Styles --- */
    }
  }

  .coord-inputs {
    display: grid;
    grid-template-columns: repeat(3, max-content); /* Arrange X, Y, Z groups */
    gap: var(--space-xs); /* Gap between X, Y, Z groups */
    justify-content: center; /* Center the groups if space allows */
  }

  /* New styles for the input group */
  .axis-input-group {
      display: flex;
      align-items: center;
      border-radius: var(--radius-md); /* Rounded corners for the group */
      padding: var(--space-3xs) var(--space-2xs); /* Padding inside the group */
      gap: var(--space-2xs); /* Gap between label and input */
      border: 2px solid; /* Base border, now solid - color set inline */
      background-color: transparent; /* Ensure background is transparent */
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .axis-label {
      font-weight: 600;
      font-size: 0.9em;
      min-width: 1em; /* Ensure label takes some space */
      text-align: center;
  }

  /* Remove old label styles */
  /* Remove input border styling that conflicts */
  .axis-input-group input[type="number"] {
      width: 3ch; /* Reduced width from 5ch to 3ch */
      padding: var(--space-3xs); /* Adjust padding */
      font-size: 1em;
      background-color: var(--color-background); /* Grey background */
      border-radius: var(--radius-sm); /* Rounded corners for input */
      color: var(--color-text-primary);
      text-align: right;
      border: none; /* Remove default border */
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.1); /* Subtle inset shadow */
      transition: box-shadow 0.2s ease;

      /* Hide spinners for Webkit browsers */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
      }
      /* Hide spinners for Firefox */
      -moz-appearance: textfield;
  }

  /* Styling for focus state - apply to group */
  .axis-input-group:focus-within {
      /* border-color: var(--color-accent-light); /* Optional: change border color */
      box-shadow: 0 0 3px 1px var(--color-accent-light); /* Add focus shadow to group */
  }

  /* Styling for invalid state - apply to group */
  .axis-input-group.invalid {
       border-color: var(--color-error) !important; /* Use !important to override inline style */
       box-shadow: 0 0 0 1px var(--color-error);
  }

  /* Focus style when invalid */
  .axis-input-group.invalid:focus-within {
       box-shadow: 0 0 3px 1px var(--color-error); /* Keep error shadow on focus */
  }

  /* Add styles for controls-section (copied from old VectorOutputPanel) */
  .controls-section {
    display: flex;
    gap: var(--space-xs);
    justify-content: flex-end;

    button {
        padding: var(--space-2xs) var(--space-s);
        font-size: 0.95em;
    }
  }
</style>
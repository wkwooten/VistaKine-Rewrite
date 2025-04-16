<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { Minimize2, MessageCircle } from 'lucide-svelte'; // Import icons
  import type { DialogTurn } from '$lib/stores/calibrationState'; // Import the type

  // Use $props() for runes mode
  let { turns = $bindable([]), show = $bindable(false) } = $props<{ turns?: DialogTurn[], show?: boolean }>();

  let currentMessageIndex = $state(0);
  let isTyping = $state(false);
  let displayedText = $state('');
  let typingInterval: any;
  let currentSpeaker = $state(''); // Add state for the current speaker

  // State for collapsed mode
  let isCollapsed = $state(false);
  let hasUnread = $state(false); // To show notification dot

  onDestroy(() => {
    if (typingInterval) {
      clearInterval(typingInterval);
    }
  });

  let previousShow = $state(false);

  // Effect to handle showing/hiding AND ensuring turns are ready
  $effect(() => {
    // Make effect explicitly depend on show and turns
    const shouldBeVisible = show;
    const hasTurns = turns.length > 0;
    const _index = currentMessageIndex; // Depend on index too? Maybe not needed.

    console.log(`[DialogBox Effect] show: ${shouldBeVisible}, prev: ${previousShow}, hasTurns: ${hasTurns}, isTyping: ${isTyping}, displayed: ${displayedText !== ''}`);

    if (shouldBeVisible && hasTurns) {
        // If we should be visible and have turns...
        // Start typing only if dialog just appeared OR if turns changed while visible and idle
        if (!previousShow || (previousShow && !isTyping && displayedText === '')) {
            // Check if previousShow is false (just appeared) or if we are currently idle (turns might have updated)
            console.log('[DialogBox Effect] Conditions met, starting/restarting typing.');
            currentMessageIndex = 0; // Reset index when starting with new/initial turns
            isCollapsed = false;     // Ensure not collapsed when new dialog starts
            hasUnread = false;
            startTyping();
        }
    } else if (!shouldBeVisible && previousShow) {
        // --- Cleanup when hidden --- >
        console.log('[DialogBox Effect] Show became false, cleaning up.');
        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null; // Clear interval ref
        }
        // Reset state only if it needs resetting
        if (isTyping || displayedText !== '' || currentSpeaker !== '') {
            isTyping = false;
            displayedText = '';
            currentSpeaker = '';
            // Reset index when hiding? Safer to do it.
            currentMessageIndex = 0;
        }
        isCollapsed = false; // Reset collapse state
        hasUnread = false;
        // <--- Cleanup ---
    }

    // Update previousShow for the next run
    previousShow = shouldBeVisible; // Use derived value
  });

  // REMOVED the complex effect that tried to handle turns changing while shown
  // Advancing index is now solely handled by handleDialogBodyClick

  function startTyping() {
    // Add logging to see the index being used
    console.log(`[DialogBox] startTyping called for index: ${currentMessageIndex}`);
    if (typingInterval) clearInterval(typingInterval);

    // --- Guards --- >
    // Ensure turns array is populated
    if (!turns || turns.length === 0) {
        console.warn('[DialogBox] startTyping called with empty turns array.');
        isTyping = false;
        return;
    }
    // Ensure index is valid for the current turns array
    if (currentMessageIndex >= turns.length || currentMessageIndex < 0) {
      console.error(`[DialogBox] startTyping called with invalid message index: ${currentMessageIndex} for turns length: ${turns.length}`);
      isTyping = false;
      return; // Stop execution if index is invalid
    }
    // <--- Guards ---

    const currentTurn = turns[currentMessageIndex];
    // Ensure the turn itself and the message property exist
    if (!currentTurn || typeof currentTurn.message !== 'string') {
      console.error('[DialogBox] Attempted to type invalid turn data.', currentTurn);
      isTyping = false;
      return;
    }

    isTyping = true;
    displayedText = '';
    currentSpeaker = currentTurn.speaker; // Update speaker for the current turn
    const currentMessage = currentTurn.message;
    let charIndex = 0;

    console.log(`[DialogBox] Starting to type message from ${currentSpeaker}: "${currentMessage}"`);
    typingInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        displayedText += currentMessage[charIndex];
        charIndex++;
      } else {
        clearInterval(typingInterval);
        isTyping = false;
        console.log('[DialogBox] Finished typing.');
      }
    }, 20);
  }

  // Renamed to handleExpandClick for clarity
  function handleExpandClick() {
      console.log('[DialogBox] Expanding dialog.');
      isCollapsed = false;
      hasUnread = false; // Clear unread on expand
      // If not currently typing when expanding, start typing the current message
      if (!isTyping) {
          console.log('[DialogBox] Starting/resuming typing on expand.');
          startTyping();
      }
  }

  // Renamed to handleDialogBodyClick for clarity
  function handleDialogBodyClick() {
    // This advances text
    if (isTyping) {
      clearInterval(typingInterval);
      // Ensure index is valid before accessing
      if (currentMessageIndex < turns.length) {
          displayedText = turns[currentMessageIndex].message;
      }
      isTyping = false;
      console.log('[DialogBox] Skipped typing.');
    } else if (currentMessageIndex < turns.length - 1) {
      console.log(`[DialogBox] Advancing from index ${currentMessageIndex} to ${currentMessageIndex + 1}`);
      // Use assignment instead of ++ for potential reactivity clarity
      currentMessageIndex = currentMessageIndex + 1;
      startTyping(); // This will update speaker and message
    }
    // Removed the close logic
  }

  // Handle keydown for accessibility
  function handleDialogKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent default spacebar scrolling
        handleDialogBodyClick();
    }
  }

  const dispatch = createEventDispatcher();
</script>

{#if show}
    {#if !isCollapsed}
        <!-- Expanded View -->
        <div
            class="dialog-box expanded"
            onclick={handleDialogBodyClick}
            onkeydown={handleDialogKeyDown}
            role="button"
            tabindex="0"
            aria-live="polite"
        >
             <button
                class="collapse-button"
                aria-label="Collapse dialog"
                onclick={(event) => { event.stopPropagation(); console.log('[DialogBox] Collapse button clicked.'); isCollapsed = true; }}
            >
                <Minimize2 size={24} />
            </button>
            <!-- Display the dynamically updated currentSpeaker -->
            <div class="speaker" data-speaker={currentSpeaker}>{currentSpeaker}</div>
            <div class="message">{displayedText}</div>
            <!-- Updated active class condition -->
            <div
              class="click-to-continue"
              class:active={!isTyping && currentMessageIndex < turns.length - 1}
            >
              Click to continue...
            </div>
        </div>
    {:else}
        <!-- Collapsed View -->
        <button
            class="dialog-box collapsed"
            class:has-unread={hasUnread}
            aria-label="Expand dialog {hasUnread ? '(New message)' : ''}"
            onclick={handleExpandClick}
        >
            <MessageCircle size={24} />
        </button>
    {/if}
{/if}

<style lang="scss">
  /* Base styles common to both (z-index, etc.) */
  .dialog-box {
    cursor: pointer;
    z-index: 11;
    border-radius: var(--radius-lg);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text-primary);
    transition: width 0.2s ease, height 0.2s ease, min-width 0.2s ease, padding 0.2s ease, top 0.2s ease, right 0.2s ease;

    /* Nested styles for expanded content */
    .dialog-header {
      .title {
        font-weight: bold;
        color: var(--color-text-primary);
        font-family: var(--font-body);
        line-height: 1.5;
      }
      /* Add other header styles if needed */
    }

    .speaker {
      font-weight: bold;
      margin-bottom: 5px;
      min-height: 1.2em; /* Reserve space even if empty initially */
    }

    .message {
      margin-bottom: 10px;
      flex-grow: 1;
      min-height: 3em;
      font-family: var(--font-body);
      line-height: 1.5;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      padding: var(--space-s);
      overflow-y: auto;
      max-height: 300px; /* Limit height */

      label {
        font-size: 0.9em;
        color: var(--color-text-secondary);
        margin-bottom: 0.25rem;
      }

      input[type='range'] + span {
        font-size: 0.8em;
        color: var(--color-text-secondary);
        min-width: 2.5em; // Ensure space for value
        text-align: right;
        display: inline-block;
      }
    }

    .action-buttons button {
      padding: 0.5em 1em;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      background-color: var(--color-surface);
      color: var(--color-text-primary);
      transition: background-color 0.2s;
    }

    .action-buttons button:hover {
      background-color: var(--color-accent-hover-bg);
    }

    .click-to-continue {
      font-style: italic;
      color: var(--color-text-secondary);
      align-self: flex-end;
      font-size: 0.9em;
      /* Ensure it takes up space but is initially invisible */
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      height: 1.2em; /* Approximate height to reserve space */
      line-height: 1.2em;
    }

    /* Make it visible when active */
    .click-to-continue.active {
      opacity: 1;
      pointer-events: auto;
    }

    /* Collapse button within expanded view */
    .collapse-button {
      position: absolute;
      top: 5px;
      right: 5px;
      background: none;
      border: none;
      color: var(--color-text-secondary);
      font-size: 1.2em;
      line-height: 1;
      padding: 2px 5px;
      cursor: pointer;
      z-index: 1001; /* Above dialog content */
    }
    .collapse-button:hover {
      color: var(--color-text-primary);
    }
  }

  /* Make sure the expanded/collapsed box itself captures pointer events */
  .dialog-box.expanded,
  .dialog-box.collapsed {
    pointer-events: auto;
  }

  /* Expanded styles */
  .dialog-box.expanded {
    padding: 15px;
    /* max-width: 600px; */
    /* min-height: 80px;  */
    /* max-height: 300px; */
    text-align: left;
    /* box-shadow: var(--shadow-lg); */
    display: flex;
    flex-direction: column;
    position: relative;
    /* Width determined by parent now */

    .message {
      flex-grow: 1; /* Allow message area to grow */
      flex-shrink: 1; /* Allow message area to shrink */
      overflow-y: auto; /* Enable scroll *only* on message */
      max-height: 4.5em; /* Limit message height (approx 3 lines + padding) */
      /* Adjust margin if needed based on surrounding elements */
      margin-bottom: 5px; /* Space before continue prompt */
    }

    .speaker, .click-to-continue {
       flex-shrink: 0; /* Prevent speaker/prompt from shrinking */
    }
  }

  /* Collapsed styles */
  .dialog-box.collapsed {
    position: absolute;
    top: var(--space-s);
    right: var(--space-s);
    min-width: unset;
    display: flex;
    align-items: center;
    box-shadow: var(--shadow-sm); /* Match buttons */
    justify-content: center;
    padding: var(--space-s); /* Ensure no padding with fixed size */
    border-radius: 50%; /* Match buttons */
    border: 1px solid var(--color-accent); /* Match buttons */
    background-color: var(--color-surface); /* Match buttons */
    color: var(--color-accent); /* Match buttons */
    transition: transform 0.1s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease; /* Match buttons */

    &:hover { /* Add hover */
        background-color: var(--color-accent-hover-bg);
        color: var(--color-accent-light);
        border-color: var(--color-accent);
        transform: translateY(-1px);
    }

    &:active { /* Add active */
        background-color: var(--color-accent-active-bg);
        transform: translateY(0);
    }
  }

  /* Unread indicator dot */
  .dialog-box.collapsed.has-unread::after {
      content: '';
      position: absolute;
      top: 3px;
      right: 3px;
      width: 10px;
      height: 10px;
      background-color: var(--color-error, red);
      border-radius: 50%;
      border: 1px solid var(--color-surface);
  }

  /* Apply speaker-specific colors using data attributes */
  :global(.speaker[data-speaker="Surya"]) {
    color: var(--surya-color, var(--color-accent)); /* Fallback to accent */
  }

  :global(.speaker[data-speaker="Leo"]) {
    color: var(--leo-color, var(--secondary-color)); /* Fallback to secondary */
  }
</style>
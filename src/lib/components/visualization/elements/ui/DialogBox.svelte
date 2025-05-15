<script lang="ts">
  import { onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { Minimize2, MessageCircle } from 'lucide-svelte';
  import type { DialogTurn } from '$lib/components/visualization/interactions/printer-calibration/calibrationState';

  let {
    turns = $bindable([]),
    show = $bindable(false),
    isFullscreen = false
  } = $props<{
    turns?: DialogTurn[],
    show?: boolean,
    isFullscreen?: boolean
  }>();

  let currentMessageIndex = $state(0);
  let isTyping = $state(false);
  let displayedText = $state('');
  let typingInterval: any;
  let currentSpeaker = $state('');

  // State for collapsed mode
  let isCollapsed = $state(false);
  let hasUnread = $state(false);

  onDestroy(() => {
    // Ensure typing interval is cleared when component is destroyed
    if (typingInterval) {
      clearInterval(typingInterval);
    }
  });

  let previousShow = $state(false);

  // Effect to handle the lifecycle of the dialog based on `show` and `turns`.
  // This controls when typing starts and handles cleanup when the dialog is hidden.
  $effect(() => {
    const shouldBeVisible = show;
    const hasTurns = turns.length > 0;

    console.log(`[DialogBox Effect] show: ${shouldBeVisible}, prev: ${previousShow}, hasTurns: ${hasTurns}, isTyping: ${isTyping}, displayed: ${displayedText !== ''}`);

    if (shouldBeVisible && hasTurns) {
        // Start typing only if dialog just appeared OR if turns changed while visible and idle
        // This prevents restarting typing if `turns` updates mid-message.
        if (!previousShow || (previousShow && !isTyping && displayedText === '')) {
            console.log('[DialogBox Effect] Conditions met, starting/restarting typing.');
            currentMessageIndex = 0; // Reset index when starting with new/initial turns
            isCollapsed = false;     // Ensure not collapsed when new dialog starts
            hasUnread = false;
            startTyping();
        }
    } else if (!shouldBeVisible && previousShow) {
        // Cleanup state and interval when dialog is hidden
        console.log('[DialogBox Effect] Show became false, cleaning up.');
        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
        }
        if (isTyping || displayedText !== '' || currentSpeaker !== '') {
            isTyping = false;
            displayedText = '';
            currentSpeaker = '';
            currentMessageIndex = 0; // Reset index on hide
        }
        isCollapsed = false;
        hasUnread = false;
    }

    // Track previous `show` state for edge detection on next run
    previousShow = shouldBeVisible;
  });

  // Starts the typing animation for the message at `currentMessageIndex`.
  function startTyping() {
    console.log(`[DialogBox] startTyping called for index: ${currentMessageIndex}`);
    if (typingInterval) clearInterval(typingInterval); // Clear any existing interval

    // --- Guard Clauses ---
    // Prevent errors if `turns` is empty or index is out of bounds.
    if (!turns || turns.length === 0) {
        console.warn('[DialogBox] startTyping called with empty turns array.');
        isTyping = false;
        return;
    }
    if (currentMessageIndex >= turns.length || currentMessageIndex < 0) {
      console.error(`[DialogBox] startTyping called with invalid message index: ${currentMessageIndex} for turns length: ${turns.length}`);
      isTyping = false;
      return;
    }
    const currentTurn = turns[currentMessageIndex];
    if (!currentTurn || typeof currentTurn.message !== 'string') {
      console.error('[DialogBox] Attempted to type invalid turn data.', currentTurn);
      isTyping = false;
      return;
    }
    // --- End Guards ---

    isTyping = true;
    displayedText = '';
    currentSpeaker = currentTurn.speaker;
    const currentMessage = currentTurn.message;
    let charIndex = 0;

    console.log(`[DialogBox] Starting to type message from ${currentSpeaker}: "${currentMessage}"`);
    // Interval to append characters one by one
    typingInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        displayedText += currentMessage[charIndex];
        charIndex++;
      } else {
        clearInterval(typingInterval);
        isTyping = false;
        console.log('[DialogBox] Finished typing.');
      }
    }, 20); // Typing speed interval
  }

  // Handles clicks on the collapsed dialog icon.
  function handleExpandClick() {
      console.log('[DialogBox] Expanding dialog.');
      isCollapsed = false;
      hasUnread = false;
      // If dialog was idle, start typing the current message upon expansion.
      if (!isTyping) {
          console.log('[DialogBox] Starting/resuming typing on expand.');
          startTyping();
      }
  }

  // Handles clicks on the main expanded dialog body.
  function handleDialogBodyClick() {
    if (isTyping) {
      // Skip the typing animation to the end.
      clearInterval(typingInterval);
      if (currentMessageIndex < turns.length) { // Ensure index is valid
          displayedText = turns[currentMessageIndex].message;
      }
      isTyping = false;
      console.log('[DialogBox] Skipped typing.');
    } else if (currentMessageIndex < turns.length - 1) {
      // Advance to the next message turn if available.
      console.log(`[DialogBox] Advancing from index ${currentMessageIndex} to ${currentMessageIndex + 1}`);
      currentMessageIndex = currentMessageIndex + 1;
      startTyping(); // Start typing the new message
    }
  }

  // Handles keyboard interaction for accessibility (Enter/Space to advance).
  function handleDialogKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent spacebar scrolling
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
             {#if isFullscreen}
                 <button
                    class="collapse-button"
                    aria-label="Collapse dialog"
                    onclick={(event) => { event.stopPropagation(); isCollapsed = true; }}
                 >
                     <Minimize2 size={24} />
                 </button>
             {/if}
            <div class="speaker" data-speaker={currentSpeaker}>{currentSpeaker}</div>
            <div class="message">{displayedText}</div>
            <!-- Indicator shown when typing is finished and more messages remain -->
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
  /* Base styles common to both expanded and collapsed states */
  .dialog-box {
    cursor: pointer;
    z-index: 11; /* Above most scene elements, below specific overlays */
    border-radius: var(--radius-lg);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text-primary);
    transition: width 0.2s ease, height 0.2s ease, min-width 0.2s ease, padding 0.2s ease, top 0.2s ease, right 0.2s ease;

    .speaker {
      font-weight: bold;
      margin-bottom: 5px;
      min-height: 1.2em; /* Reserve space even if empty initially */
    }

    .message {
      margin-bottom: 10px;
      flex-grow: 1; /* Allow message area to fill space in flex container */
      min-height: 3em; /* Ensure a minimum height for short messages */
      font-family: var(--font-body);
      line-height: 1.5;
    }

    /* Unused dialog-content styles removed */

    .click-to-continue {
      font-style: italic;
      color: var(--color-text-secondary);
      align-self: flex-end;
      font-size: 0.9em;
      opacity: 0; /* Hidden by default */
      pointer-events: none;
      transition: opacity 0.2s ease;
      height: 1.2em; /* Reserve space to prevent layout shift */
      line-height: 1.2em;
    }

    .click-to-continue.active {
      opacity: 1; /* Visible when active */
      pointer-events: auto;
    }

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

  /* Ensure the component captures pointer events in both states */
  .dialog-box.expanded,
  .dialog-box.collapsed {
    pointer-events: auto;
  }

  /* Expanded styles */
  .dialog-box.expanded {
    padding: 15px;
    height: 200px; /* Fixed height to prevent layout shifts */
    text-align: left;
    display: flex;
    flex-direction: column;
    position: relative; /* Needed for absolute positioning of collapse button */
    /* Disable text selection */
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;

    .message {
      flex-grow: 1; /* Take available vertical space */
      flex-shrink: 1; /* Allow shrinking if content exceeds fixed height */
      overflow-y: auto; /* Enable scrolling *within* the message area if needed */
      margin-bottom: 5px; /* Space before continue prompt */
    }

    /* Prevent speaker/prompt from shrinking, ensuring visibility */
    .speaker, .click-to-continue {
       flex-shrink: 0;
    }
  }

  /* Collapsed styles */
  .dialog-box.collapsed {
    position: absolute; /* Positioned via parent or global styles */
    top: var(--space-s);
    right: var(--space-s);
    min-width: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-s);
    border-radius: 50%; /* Circular button style */
    border: 1px solid var(--color-accent);
    background-color: var(--color-surface);
    color: var(--color-accent);
    box-shadow: var(--shadow-sm);
    transition: transform 0.1s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

    &:hover {
        background-color: var(--color-accent-hover-bg);
        color: var(--color-accent-light);
        border-color: var(--color-accent);
        transform: translateY(-1px);
    }

    &:active {
        background-color: var(--color-accent-active-bg);
        transform: translateY(0);
    }
  }

  /* Unread indicator dot for collapsed state */
  .dialog-box.collapsed.has-unread::after {
      content: '';
      position: absolute;
      top: 3px;
      right: 3px;
      width: 10px;
      height: 10px;
      background-color: var(--color-error, red); /* Use theme variable or fallback */
      border-radius: 50%;
      border: 1px solid var(--color-surface); /* Border for contrast */
  }

  /* Apply speaker-specific colors using data attributes */
  :global(.speaker[data-speaker="Surya"]) {
    color: var(--surya-color, var(--color-accent)); /* Fallback to accent */
  }

  :global(.speaker[data-speaker="Leo"]) {
    color: var(--leo-color, var(--secondary-color)); /* Fallback to secondary */
  }
</style>
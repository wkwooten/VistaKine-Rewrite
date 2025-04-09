<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { Minimize2, MessageCircle } from 'lucide-svelte'; // Import icons

  export let messages: string[] = [];
  export let show: boolean = false;
  export let speaker: string = '';

  let currentMessageIndex = 0;
  let isTyping = false;
  let displayedText = '';
  let typingInterval: any;

  // State for collapsed mode
  let isCollapsed = false;
  let hasUnread = false; // To show notification dot

  onDestroy(() => {
    if (typingInterval) {
      clearInterval(typingInterval);
    }
  });

  let previousShow = false;
  $: {
    if (show && !previousShow && messages.length > 0) {
      console.log('[DialogBox] Show became true, starting typing.');
      currentMessageIndex = 0;
      // Ensure it's not collapsed when shown initially or with new messages via show=true
      isCollapsed = false;
      hasUnread = false;
      startTyping();
    } else if (!show && previousShow) {
      console.log('[DialogBox] Show became false, cleaning up.');
      if (typingInterval) clearInterval(typingInterval);
      isTyping = false;
      displayedText = '';
      isCollapsed = false; // Reset collapse state when hidden
      hasUnread = false;
    }
    previousShow = show;
  }

  let previousMessages = messages;
  $: if (show && messages !== previousMessages && messages.length > 0) {
    console.log('[DialogBox] Messages changed while shown.');
    currentMessageIndex = 0;
    // If collapsed when messages change, mark as unread and don't restart typing
    if (isCollapsed) {
        console.log('[DialogBox] Marking as unread because collapsed.');
        hasUnread = true;
    } else {
        console.log('[DialogBox] Restarting typing for new messages.');
        hasUnread = false; // New messages being shown, so not unread
        startTyping();
    }
    previousMessages = messages;
  }

  function startTyping() {
    if (typingInterval) clearInterval(typingInterval);

    isTyping = true;
    displayedText = '';
    const currentMessage = messages[currentMessageIndex];
    if (!currentMessage) {
      console.error('[DialogBox] Attempted to type undefined message.');
      isTyping = false;
      return;
    }
    let charIndex = 0;

    console.log(`[DialogBox] Starting to type: "${currentMessage}"`);
    typingInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        displayedText += currentMessage[charIndex];
        charIndex++;
      } else {
        clearInterval(typingInterval);
        isTyping = false;
        console.log('[DialogBox] Finished typing.');
      }
    }, 50);
  }

  // Renamed to handleExpandClick for clarity
  function handleExpandClick() {
      console.log('[DialogBox] Expanding dialog.');
      isCollapsed = false;
      hasUnread = false; // Clear unread on expand
      // Potentially restart typing if needed, or assume user will click through
      // If messages changed while collapsed, startTyping might be needed here
      if(previousMessages !== messages) {
          startTyping(); // Start typing the new message shown on expand
      }
  }

  // Renamed to handleDialogBodyClick for clarity
  function handleDialogBodyClick() {
    // This advances text or closes the box
    if (isTyping) {
      clearInterval(typingInterval);
      displayedText = messages[currentMessageIndex];
      isTyping = false;
      console.log('[DialogBox] Skipped typing.');
    } else if (currentMessageIndex < messages.length - 1) {
      console.log(`[DialogBox] Advancing to message index ${currentMessageIndex}`);
      currentMessageIndex++;
      startTyping();
    } else {
      console.log('[DialogBox] Last message clicked, dispatching close.');
      dispatch('close');
    }
  }

  const dispatch = createEventDispatcher();
</script>

{#if show}
    {#if !isCollapsed}
        <!-- Expanded View -->
        <div class="dialog-box expanded" on:click={handleDialogBodyClick}>
             <!-- Use a button for semantics and accessibility -->
             <button
                class="collapse-button"
                aria-label="Collapse dialog"
                on:click|stopPropagation={() => { console.log('[DialogBox] Collapse button clicked.'); isCollapsed = true; }}
            >
                <Minimize2 size={18} /> <!-- Use Minimize icon -->
            </button>
            <div class="speaker">{speaker}</div>
            <div class="message">{displayedText}</div>
            {#if !isTyping && currentMessageIndex < messages.length -1}
            <div class="click-to-continue">Click to continue...</div>
            {:else if !isTyping && currentMessageIndex === messages.length - 1}
            <div class="click-to-continue">Click to close</div>
            {/if}
        </div>
    {:else}
        <!-- Collapsed View -->
        <button
            class="dialog-box collapsed"
            class:has-unread={hasUnread}
            aria-label="Expand dialog {hasUnread ? '(New message)' : ''}"
            on:click={handleExpandClick}
        >
            <MessageCircle size={24} /> <!-- Use MessageCircle icon -->
        </button>
    {/if}
{/if}

<style>
  /* Base styles common to both (positioning, z-index, etc.) */
  .dialog-box {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    z-index: 1000;
    border-radius: 10px;
    background-color: white;
    border: 1px solid var(--border-color);
    color: var(--text-color);
    transition: width 0.2s ease, height 0.2s ease, min-width 0.2s ease, padding 0.2s ease; /* Add transition */
  }

  /* Expanded styles */
  .dialog-box.expanded {
    padding: 15px;
    width: 80%;
    max-width: 600px;
    min-width: 30ch; /* Keep min-width */
    min-height: 80px;
    text-align: left;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
  }

  .speaker {
    font-weight: bold;
    margin-bottom: 5px;
    color: var(--color-accent);
  }

  .message {
    margin-bottom: 10px;
    flex-grow: 1;
    min-height: 3em;
    font-family: var(--font-body);
    line-height: 1.5;
  }

  .click-to-continue {
    font-style: italic;
    color: var(--text-secondary);
    align-self: flex-end;
    font-size: 0.9em;
  }

  /* Collapse button within expanded view */
  .collapse-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.2em;
    line-height: 1;
    padding: 2px 5px;
    cursor: pointer;
    z-index: 1001; /* Above dialog content */
  }
  .collapse-button:hover {
      color: var(--text-color);
  }

  /* Collapsed styles */
  .dialog-box.collapsed {
    width: 45px; /* Adjust size as needed */
    height: 45px;
    min-width: unset; /* Remove min-width */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em; /* Adjust icon size */
    padding: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    border-radius: 50%; /* Make it circular */
    /* Add slight offset if needed */
    /* bottom: 25px; */
  }

  /* Unread indicator dot */
  .dialog-box.collapsed.has-unread::after {
      content: '';
      position: absolute;
      top: 5px;
      right: 5px;
      width: 10px;
      height: 10px;
      background-color: var(--color-error, red);
      border-radius: 50%;
      border: 1px solid var(--bg-secondary);
  }

</style>
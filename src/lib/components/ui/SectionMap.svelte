<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";

  type NavTarget = {
    id: string;
    title: string;
  };

  const debugObserver = false; // Set to false to hide visualizer

  let navTargets = $state<NavTarget[]>([]);
  let activeSectionId = $state<string | null>(null);
  let observer: IntersectionObserver | null = null;
  let activationOffset = $state(100); // Default, will be calculated

  // Selector for the elements we want to map
  const targetSelector = '[data-nav-target="true"]';
  // Selector for the container holding the slotted content
  const contentContainerSelector = ".section-content";

  function findNavTargetsAndObserve() {
    // Find the main content container
    const contentContainer = document.querySelector(contentContainerSelector);
    if (!contentContainer) {
      console.warn(
        "SectionMap: Could not find content container:",
        contentContainerSelector
      );
      navTargets = [];
      return;
    }

    // Find targets
    const targets =
      contentContainer.querySelectorAll<HTMLElement>(targetSelector);
    const newNavTargets: NavTarget[] = [];
    const elementsToObserve: Element[] = [];

    targets.forEach((target) => {
      const id = target.id;
      const title = target.textContent?.trim() || "Unnamed Section";
      if (id) {
        newNavTargets.push({ id, title });
        elementsToObserve.push(target);
      }
    });

    // Update state only if targets changed
    if (JSON.stringify(navTargets) !== JSON.stringify(newNavTargets)) {
      navTargets = newNavTargets;
      console.log("SectionMap: Updated targets:", navTargets);

      // --- Setup Intersection Observer ---
      setupObserver(elementsToObserve);
    }
  }

  function setupObserver(elements: Element[]) {
    // Disconnect previous observer if exists
    if (observer) {
      observer.disconnect();
    }

    if (elements.length === 0) {
      activeSectionId = null; // No targets, no active section
      return;
    }

    const navbarHeight = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--navbar-height")
        .trim() || "60",
      10
    );
    const offset = 20;
    const calculatedActivationOffset = navbarHeight + offset;
    activationOffset = calculatedActivationOffset; // Update state for visualizer

    // Define rootMargin: Start observing below navbar, extend to viewport bottom
    const rootMargin = `-${calculatedActivationOffset}px 0px 0px 0px`;

    const observerOptions: IntersectionObserverInit = {
      root: null, // Use the viewport
      rootMargin: rootMargin,
      threshold: 0, // Fire as soon as any part enters/leaves the adjusted viewport
    };

    let intersectingTargets: Map<string, IntersectionObserverEntry> = new Map();

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Update map based on intersection status
        if (entry.isIntersecting) {
          intersectingTargets.set(entry.target.id, entry);
        } else {
          intersectingTargets.delete(entry.target.id);
        }
      });

      // Determine the 'most active' target (highest one visible within the zone)
      let highestVisibleTargetId: string | null = null;
      let highestY = Infinity; // Use Infinity to correctly find the minimum top value

      intersectingTargets.forEach((entry, id) => {
        // Find the element whose top is closest to the top of the viewport (lowest top value)
        if (entry.boundingClientRect.top < highestY) {
          highestY = entry.boundingClientRect.top;
          highestVisibleTargetId = id;
        }
      });

      // Only update the active ID if a valid highest target is found within the zone.
      // If highestVisibleTargetId is null, it means nothing is intersecting the zone correctly,
      // so we keep the last known active ID.
      if (
        highestVisibleTargetId !== null &&
        activeSectionId !== highestVisibleTargetId
      ) {
        activeSectionId = highestVisibleTargetId;
        // console.log("Active section updated:", activeSectionId);
      } else if (intersectingTargets.size === 0 && elements.length > 0) {
        // Optional: If *nothing* is intersecting (e.g., scrolled way past last section or before first)
        // you might want to clear the active state. Uncomment the line below if needed.
        // activeSectionId = null;
      }
    }, observerOptions);

    // Observe all target elements
    elements.forEach((el) => {
      if (observer) {
        // Check observer is not null before observing
        observer.observe(el);
      }
    });
  }

  function handleClick(id: string, event: MouseEvent) {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  // Effect to find targets and set up observer on mount/update
  $effect(() => {
    async function runFinder() {
      await tick(); // Wait for DOM updates
      findNavTargetsAndObserve();
    }
    runFinder();

    // Cleanup function for the effect
    return () => {
      if (observer) {
        observer.disconnect();
        console.log("SectionMap: Observer disconnected.");
      }
    };
  });
</script>

{#if debugObserver}
  <div
    class="debug-observer-viz"
    style="--activation-offset: {activationOffset}px;"
  ></div>
{/if}

<aside class="section-map-container">
  {#if navTargets.length > 0}
    <nav aria-labelledby="section-map-heading">
      <h3 id="section-map-heading">Section Navigation</h3>
      <ul>
        {#each navTargets as target (target.id)}
          <li>
            <a
              href="#{target.id}"
              onclick={(e) => handleClick(target.id, e)}
              class:active={target.id === activeSectionId}
            >
              {target.title}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  {:else}
    <p class="no-targets-message">
      No navigation points found in this section.
    </p>
  {/if}
</aside>

<style lang="scss">
  .debug-observer-viz {
    position: fixed;
    top: var(--activation-offset);
    bottom: 0; // Extend to bottom of viewport
    left: 0;
    right: var(--section-map-width, 220px); // Avoid covering the map itself
    background-color: rgba(255, 0, 0, 0.1); // Semi-transparent red
    border-top: 1px dashed red;
    z-index: 9998; // Below potential modals but above most content
    pointer-events: none; // Allow clicks to pass through
    transition: top 0.1s linear; // Smooth updates if offset changes
  }

  .section-map-container {
    position: sticky;
    top: var(--navbar-height, 60px);
    align-self: flex-start;
    width: var(--section-map-width, 220px);
    max-height: calc(100vh - var(--navbar-height, 60px) - var(--space-l));
    overflow-y: auto;
    padding: var(--space-m) var(--space-s);
    flex-shrink: 0;
    z-index: 10; // Ensure map is above background viz if needed

    @media (max-width: var(--breakpoint-lg)) {
      display: none;
    }

    // Style for the heading
    #section-map-heading {
      font-size: var(--step-0);
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 var(--space-s) 0;
      padding-bottom: var(--space-xs);
      border-bottom: 1px solid var(--color-border);
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    li a {
      display: block;
      padding: var(--space-2xs) var(--space-xs);
      text-decoration: none;
      color: var(--color-text-secondary);
      font-size: var(--step--1);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      transition: all 0.2s ease;
      white-space: normal;
      line-height: 1.4;

      &:hover {
        background-color: var(--color-accent-hover-bg);
      }

      // Style for active link
      &.active {
        background-color: var(--color-surface);
        border-left: 1px solid var(--color-accent);
        color: var(--color-text-primary);
        /* font-weight: 500; */
      }
    }

    .no-targets-message {
      font-size: var(--step--1);
      color: var(--color-text-disabled);
      text-align: center;
      padding: var(--space-l) 0;
    }

    // visually-hidden class removed from component, but kept here for reference if needed elsewhere
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  }
</style>

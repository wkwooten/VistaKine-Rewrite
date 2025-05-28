<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import { X } from "lucide-svelte"; // Import close icon
  import { sectionMapOpen } from "$lib/stores/uiStores"; // ADD store import

  type NavTarget = {
    id: string;
    title: string;
  };

  // Define props including sectionSlug
  type SectionMapProps = {
    sectionSlug: string; // Add sectionSlug prop
  };
  let { sectionSlug }: SectionMapProps = $props();

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
      // Try getting title from aria-label first, then text content
      const title =
        target.getAttribute("aria-label") ||
        target.textContent?.trim() ||
        "Unnamed Section";
      if (id) {
        newNavTargets.push({ id, title });
        elementsToObserve.push(target);
      }
    });

    // Update state only if targets changed
    // Compare based on IDs only, titles might not change even if content does
    const currentTargetIds = JSON.stringify(navTargets.map((t) => t.id).sort());
    const newTargetIds = JSON.stringify(newNavTargets.map((t) => t.id).sort());

    if (currentTargetIds !== newTargetIds) {
      navTargets = newNavTargets;
      console.log(
        "SectionMap: Updated targets for section",
        sectionSlug,
        ":",
        navTargets
      );
      setupObserver(elementsToObserve);
    } else {
      console.log(
        "SectionMap: Targets haven't changed for section",
        sectionSlug
      );
      // Re-setup observer even if targets *seem* the same, DOM might have changed
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
      if (
        highestVisibleTargetId !== null &&
        activeSectionId !== highestVisibleTargetId
      ) {
        activeSectionId = highestVisibleTargetId;
      } else if (intersectingTargets.size === 0) {
        // If nothing is intersecting the active zone, check if we are above the first target
        // or below the last target based on scroll position to potentially clear active state.
        // This logic might need refinement based on exact desired behavior when scrolling
        // outside the bounds of all targets.
        // For now, let's keep the last active ID if nothing is in the zone.
      }
    }, observerOptions);

    // Observe all target elements
    elements.forEach((el) => {
      if (observer) {
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
      // Close mobile map after clicking a link
      $sectionMapOpen = false;
    }
  }

  function closeMap() {
    $sectionMapOpen = false;
  }

  // Effect to find targets and set up observer when sectionSlug changes
  $effect(() => {
    // Read sectionSlug to establish dependency
    const currentSlug = sectionSlug;
    console.log(`SectionMap: Effect triggered for sectionSlug: ${currentSlug}`);

    async function runFinder() {
      await tick(); // Wait for DOM updates after slug change
      findNavTargetsAndObserve();
    }
    runFinder();

    // Cleanup function for the effect
    return () => {
      if (observer) {
        observer.disconnect();
        console.log("SectionMap: Observer disconnected on cleanup.");
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

<!-- Mobile Overlay -->
{#if $sectionMapOpen}
  <div
    class="mobile-overlay"
    onclick={closeMap}
    role="button"
    aria-label="Close section navigation"
  ></div>
{/if}

<aside class="section-map-container" class:is-open={$sectionMapOpen}>
  {#if navTargets.length > 0}
    <nav aria-labelledby="section-map-heading">
      <div class="map-header">
        <h3 id="section-map-heading">In This Section</h3>
        <button
          class="close-button mobile-only"
          onclick={closeMap}
          aria-label="Close section navigation"
        >
          <X size={20} />
        </button>
      </div>
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
  @use "$lib/styles/variables" as vars; // Import variables

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
    display: none; // Hide debug visualizer by default

    @media (min-width: calc(var(--breakpoint-lg) + 1px)) {
      display: block; // Show only on larger screens if debugObserver is true
    }
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5); // Semi-transparent black
    z-index: 40; // Below map container, above content
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;

    @media (max-width: vars.$breakpoint-lg) {
      pointer-events: auto; // Enable clicks only on mobile when map is open
      opacity: 1;
    }
  }

  .section-map-container {
    // Default Desktop Styles (Fixed Sidebar)
    background-color: var(--color-background);
    width: var(--section-map-width, 220px);
    border: 1px solid var(--color-border);
    padding: var(--space-s) 0 var(--space-s) var(--space-s);
    overflow-y: auto;
    max-height: calc(100vh - vars.$navbar-height - var(--space-xl));
    z-index: 50; // Above overlay
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;

    // Only show on extra large screens by default (when positioned fixed)
    @media (max-width: vars.$breakpoint-xl) {
      opacity: 0;
      pointer-events: none;
      position: fixed;
      top: vars.$navbar-height;
      right: var(--space-m);
      transform: translateX(20px);

      &.is-open {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(0);
      }
    }

    // Mobile Styles (Off-canvas Drawer)
    @media (max-width: vars.$breakpoint-lg) {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: auto;
      width: min(80vw, 320px); // Responsive width
      height: 100vh; // Full height
      max-height: none;
      border-left: 1px solid var(--color-border); // Border on the left now
      transform: translateX(100%); // Start off-screen
      padding: var(--space-l); // More padding for mobile
      overflow-y: auto; // Ensure scrolling within the drawer
      border-radius: 0;
      opacity: 1; // Reset opacity on mobile

      &.is-open {
        transform: translateX(0); // Slide in when open
      }
    }

    .map-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-s);
      padding-right: var(--space-s); // Ensure padding consistency

      @media (max-width: vars.$breakpoint-lg) {
        padding-right: 0; // No right padding needed inside mobile drawer
      }
    }

    // Style for the heading
    #section-map-heading {
      font-size: var(--step--1);
      font-weight: 600;
      color: var(--color-text-secondary);
      margin: 0;
      padding-bottom: 0; // Remove padding moved to header
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: none;
    }

    .close-button {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      padding: var(--space-3xs);
      cursor: pointer;
      line-height: 0; // Ensure icon aligns well
      border-radius: var(--radius-round);
      transition: background-color 0.2s ease;

      &:hover {
        color: var(--color-text-primary);
        background-color: var(--color-surface-hover);
      }
    }

    /* Visibility for close button */
    .mobile-only {
      display: none;
      @media (max-width: vars.$breakpoint-lg) {
        display: inline-flex; // Show only on mobile
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    li a {
      display: block;
      padding: var(--space-2xs) var(--space-s);
      text-decoration: none;
      color: var(--color-text-secondary);
      font-size: var(--step--1);
      border-left: 2px solid transparent;
      transition: all 0.15s ease-in-out;
      white-space: normal;
      line-height: 1.4;
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      margin-left: 0;

      @media (max-width: vars.$breakpoint-lg) {
        margin-right: 0; // No right margin needed on mobile
        border-radius: var(--radius-sm); // Apply radius all around on mobile
        padding: var(--space-s); // Increase padding slightly on mobile
      }

      &:hover {
        background-color: var(--color-surface-hover);
        color: var(--color-text-primary);
        border-left-color: var(
          --color-border
        ); // Show border on hover (desktop)

        @media (max-width: vars.$breakpoint-lg) {
          border-left-color: transparent; // No left border highlight on mobile hover
        }
      }

      // Style for active link
      &.active {
        background-color: var(--color-accent-subtle-bg);
        border-left: 2px solid var(--color-accent);
        color: var(--color-accent-text-on-subtle);
        font-weight: 500;

        @media (max-width: vars.$breakpoint-lg) {
          // Mobile active style adjustments if needed (e.g., different bg)
          background-color: var(--color-accent-subtle-bg); // Keep subtle bg
          border-left-color: var(--color-accent); // Keep accent border
        }
      }
    }

    .no-targets-message {
      font-size: var(--step--1);
      color: var(--color-text-disabled);
      text-align: center;
      padding: var(--space-l) var(--space-s);
      margin-right: var(--space-s); // Align with potential link padding

      @media (max-width: vars.$breakpoint-lg) {
        margin-right: 0;
        padding: var(--space-xl) var(--space-s); // More padding on mobile
      }
    }
  }
</style>

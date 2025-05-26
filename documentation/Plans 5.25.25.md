This document provides a focused overview of the next major development priorities for VistaKine.

1.  **Streamline Interactive Exercise Architecture:**

    - [x] Audit and refactor `InteractiveExercise.svelte` and existing interactions (`PrinterCalibration`, `VectorBuilder`, `FullCoordinateExplorer`, `DisplacementVelocity`).  [completion:: 2025-05-26]
    - [x] Improve prop passing and state management (Svelte stores, context API).  [completion:: 2025-05-26]
    - [ ] Resolve iOS fullscreen issues for visualizations.
    - [ ] Document new architecture guidelines.

2.  **Finalize Authentication Flow:**

    - [ ] Resolve Google Sign-In console errors.
    - [ ] Design and implement a static header auth widget.
    - [ ] Thoroughly test all authentication paths.

3.  **Implement Subscription Model & Core Pricing:**

    - [ ] Integrate with a payment provider (e.g., Stripe).
    - [ ] Set up backend database schema and logic (Supabase functions) for subscriptions.
    - [ ] Develop frontend UI for `/subscribe` page and basic user account management of subscriptions.
    - [ ] Launch with initial pricing tiers (e.g., Monthly, Annual, Launch Sale).

4.  **Accessibility Audit (WCAG Compliance):**

    - [ ] Integrate `axe-core` and screen reader testing into workflow.
    - [ ] Address color contrast, keyboard navigation, and ARIA attributes.
    - [ ] Update style guide with accessibility best practices.

5.  **Develop User Account Management Flow:**

    - [ ] Design and implement `/profile` or `/settings` page.
    - [ ] Include: profile editing, subscription management view, bookmarked content view.

6.  **Refine User Experience & Content (Ongoing):**
    - [ ] Review and adjust bookmarking system for key terms.
    - [ ] Evaluate and potentially update/replace 2D exercises.
    - [ ] Plan for controlled beta testing and feedback collection.
    - [ ] Prioritize security best practices.

_This plan will be revisited and updated as development progresses._

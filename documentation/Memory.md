---
New field: 2025-03-31
---

# VistaKine Threlte Rewrite Memory and Project Management File

#projects #VistaKine

## Project Overview

VistaKine is an interactive 3D engineering textbook that aims to teach kinematic and dynamic concepts through visualizations and simulations. It combines educational content with interactive Three.js and Rapier physics simulations to create an engaging learning experience.

# Original Project

## Original Implementation Challenges

### 1. State Management

- Complex state management across multiple modules (navigation, content, visualization)
- Difficulties syncing state between different components
- Manual implementation of publish/subscribe patterns
- Inconsistent state updates leading to UI and visualization sync issues

### 2. Scroll Synchronization

- Multiple intersection observers competing and causing conflicts
- Scroll position restoration interfering with observer calculations
- Layout shifts during content loading affecting scroll positions
- Navigation lock mechanisms not consistently respected by all components

### 3. Organizational Issues

- Monolithic architecture with tightly coupled components
- Complex section loading/unloading system
- Visualization integration triggering layout shifts
- Manual DOM manipulation and event handling complexity

### 4. Performance Issues

- Performance degradation with multiple loaded sections
- Memory management for complex visualizations
- Inefficient rendering and physics calculations
- Observer callback processing causing frame rate drops

### 5. Styling System (SCSS/Utopia)

- **Fluid Typography**: Official Utopia package for type scale that adapts to viewport size
- **Fluid Spacing**: Utopia-generated spacing system that scales seamlessly
- **Component-Scoped Styles**: Using Svelte's component-local CSS with SCSS
- **Design System**: Modular SCSS structure with variables, mixins, and utility classes
- **Responsive Design**: Intrinsically responsive without excessive breakpoints

## Notes & Decisions

- **Resolved "already declared" errors by correctly implementing prop declarations in `ChapterTemplate.svelte` and prop usage in `+page.svelte` files.**
- We've chosen SvelteKit for routing and structure
- Threlte provides a declarative approach to Three.js that should simplify visualization code
- Each chapter will be a separate route for better code organization and performance
- We're using a component-based architecture for better maintainability
- Leveraging Svelte's reactivity should eliminate many of the state synchronization issues
- Adopted SCSS with the official Utopia package for fluid typography and spacing
- Using Utopia's SCSS functions instead of manual calculations for better maintainability
- Implemented a modular SCSS system with partials for variables, typography, spacing, grid, utilities, and animations
- Using component-scoped styles with SCSS nesting for cleaner, more maintainable CSS
- **Successfully implemented `ChapterTemplate.svelte` as a reusable layout component for chapter pages.**
- **Completed SCSS refactoring to improve organization and component encapsulation:**
  - Moved component-specific styles from `chapter-styles.scss` to their respective component files
  - Updated styles in `FormulaAccordion.svelte`, `Scenario.svelte`, `Quiz.svelte`, `GuidedCalculation.svelte`, and `SectionReview.svelte`
  - Removed redundant app.scss import from chapter-styles.scss
  - Deleted the unused \_theme.scss file
  - Consolidated and cleaned up chapter-styles.scss to remove redundant code and improve maintainability
  - Ensured component styles properly respect chapter theming variables
- **Svelte Styling Approach (Props vs. Style Block):**
  - **Sidebar Layout & Toggle Refinement (2025-03-25):**
    - **Resolved Layout Conflicts:** Fixed issues caused by conflicting `position: fixed` and `width`/`transition` rules between the parent grid layout (`+layout.svelte`) and the child `Navigation.svelte` component. Ensured parent controls overall layout/animation, child fills space.
    - **Implemented Toggle Bar Effects:**
      - Added hover effect (fade to primary color).
      - Added click effect: instant highlight to primary color, stays highlighted for 600ms, then fades back to base color (unless still hovering). Managed via JS `setTimeout` and `.click-highlighted` CSS class.
      - Adjusted toggle bar `::before` element positioning (`left: 0`) to remove visual gap.
    - **Diagnosed Fade-Out Bug:** Identified that the fade-out after click wasn't working in the expanded state due to low contrast between the original base blue (`--color-border`) and the highlight blue (`--primary-color`).
    - **Fixed Fade-Out Bug:** Changed the base color of the toggle bar (`::before`) to `var(--color-border-light)` (light grey) for both expanded and collapsed states, ensuring a high-contrast and reliable fade-out effect.
    - **Restored Mobile Navigation:** Fixed mobile slide-out menu regression (caused by removing `position: fixed` from `Navigation.svelte` base styles) by re-adding `position: fixed` and related styles specifically within the mobile media query (`@media (max-width: 768px)`).
    - **Key Findings:**
      - Avoid conflicting layout/positioning rules between parent/child components.
      - CSS transitions (especially with `transition-duration: 0s` overrides) require careful testing for interactions.
      - Use high-contrast temporary colors for debugging visual state changes.
      - Ensure mobile-specific positioning/styles are correctly scoped within media queries.
  - **Props (`export let`):** Used for styles intended to be easily customized when the component is used (e.g., `backgroundColor`, `padding`). Allows external control.
  - **`style:` directive:** Applies dynamic inline styles based on the values of props or other reactive variables (e.g., `style:padding={padding}`).
  - **`<style>` block:** Defines the component's internal, generally static base styles (e.g., `display: flex`, `backdrop-filter`).
  - **Benefit:** This combination makes components flexible and reusable. Base styles are encapsulated, while specific aspects can be easily overridden via props. Keeping props even if not immediately customized is often good for future-proofing.
- **Component Refactoring & Consistency (2025-03-31):**
  - Refined styles for `Quiz.svelte` and `SectionReview.svelte` to match `FormulaAccordion`.
  - Resolved Svelte transition conflicts with native `<details>` element.
  - Implemented a custom, accessible accordion pattern using `<div>`s and ARIA attributes (`role`, `aria-expanded`, `aria-controls`, `tabindex`, `:focus-visible`) to ensure reliable slide transitions for both opening and closing.
  - Added visual enhancements (hover background, rotating chevron icon) to the custom accordion header.
  - Created a reusable `Accordion.svelte` component encapsulating the structure, logic, styles, and accessibility features.
  - Refactored `FormulaAccordion.svelte`, `GuidedCalculation.svelte`, and `SectionReview.svelte` to utilize the new generic `Accordion.svelte` component, simplifying their code and ensuring consistency.
- **LaTeX Integration (2025-03-31):**
  - Installed `svelte-katex` package for rendering LaTeX math.
  - Added KaTeX CSS via CDN link in `app.html`.
  - Successfully integrated the `<Katex>` component into `kinematics.svelte` to render formulas.
  - Discussed methods for customizing KaTeX styles using CSS overrides in `app.scss`.
- **KaTeX Rendering Approach (2025-05-01):**
  - Encountered persistent parsing errors (`Undefined control sequence: \`) when using the `<Katex>` component (from `svelte-katex`) with complex LaTeX involving escaped characters (like `\vec`, `\|`, `\langle`) across different files.
  - Multiple attempts to adjust backslash escaping (`\`, `\\`, `\\\\`) within the component's string prop yielded inconsistent results between files.
  - **Resolution:** Adopted the direct functional approach using `import katex from 'katex';` and rendering via `{@html katex.renderToString('LATEX_STRING')}`. This requires only single backslash escaping within the JavaScript string (e.g., `\vec`, `\|`) and proved consistently reliable across components.
  - Installed `@types/katex` for TypeScript support.
- **Resolved fullscreen offset issue (2025-04-08):** Ensured fullscreen styling correctly targets both the wrapper div and the nested VisContainer for proper expansion when using an overlay HUD.
- **UI Architecture Decision (2025-04-08):** Explored using Threlte's `<HTML>` component for in-scene UI controls but pivoted to a dedicated screen-space overlay HUD component (`CalibrationHud.svelte`) placed alongside the `VisContainer` for better accessibility, responsiveness, and maintainability.
- **Resolved build/HMR issues (2025-04-08):** Debugged misleading console logs related to store values likely caused by HMR state inconsistencies, resolved by restarting the dev server. Addressed various import path and syntax errors.
- **Dialog Rendering Solution (2025-04-09):** Addressed issue where HTML-based `<DialogBox>` component wouldn't render correctly when placed inside `PrinterCalibration` (within the Threlte `<Canvas>`). Solved by wrapping `<DialogBox>` with the `@threlte/extras` `<HTML>` component within `PrinterCalibration`. The `<HTML>` component renders its children outside the WebGL context, allowing standard CSS positioning (`position: fixed`) to work as expected while keeping the dialog logic and declaration modular within the scene component.
- **Chapter 1 Styling & Layout Refinement (2025-04-15):**
  - [x] Established consistent vertical spacing using Utopia variables within `understanding-3d-space.svelte` and component-level `margin-bottom`.
  - [x] Applied consistent "card" styling (border, background, padding) to interactive components (`Scenario`, `Quiz`, `Exercise`, `Accordion`-based).
  - [x] Moved exercise title/description inside `exercise-wrapper` for better grouping, adjusted their styles, and hid them in fullscreen mode.
  - [x] Improved mobile layout (target: 375px) by removing outer chapter padding/border and reducing exercise control panel input widths/spinners.
- **Chapter Content Modularization (2025-04-22):**

  - Implemented a modular file structure for chapter content, moving from monolithic files to section-based components:
    - Created individual section files in `src/lib/content/chapters/understanding-3d-space/sections/`
    - Each section (coordinate-systems, vectors-and-components, vector-operations) exists as a standalone component
    - Updated routing system in `src/routes/chapter/[slug]/[section]/+page.ts` to dynamically load the correct section
    - Configured `src/lib/data/chapters.ts` to define the chapter/section structure
    - This approach improves maintainability, reduces file size, and enables partial loading
  - Potential improvements for the section-based architecture:
    - Add transition animations between sections for smoother navigation
    - Implement a caching mechanism for previously viewed sections
    - Consider lazy loading for section content (especially visualizations)
    - Add progress tracking to show completion status for each section
    - Standardize the section component interface for consistency

- **p5.js Integration for 2D Visuals (2025-04-27):**
  - **Decision:** Explored options for simple 2D interactive visualizations to support 1D/2D vector concepts before diving into 3D Threlte scenes. Libraries considered: `svelte-konva`, `svelte-pixi`, `p5-svelte`.
  - **`svelte-konva` Issue:** Attempted installation failed due to peer dependency conflict (`svelte@3-4` required, project uses Svelte 5). Package seems incompatible with Svelte 5 Runes API.
  - **`svelte-p5` Issue:** Attempted installation failed (`E404 Not Found`) as the specific package name `svelte-p5` does not exist on npm.
  - **Successful Library:** Identified and installed `p5-svelte` by `tonyketcham` along with its peer dependency `p5`.
  - **SSR Issue:** Encountered `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".svelte" for .../node_modules/p5-svelte/P5.svelte` during server-side rendering because Node.js couldn't process the library's internal `.svelte` file.
  - **SSR Fix:** Resolved the SSR error by adding `'p5-svelte'` to the `ssr.noExternal` array in `vite.config.js`, forcing Vite to process the library during SSR.
  - **Implementation Pattern:** Used dynamic `import()` within `onMount` in parent components (`vectors-and-components.svelte`) to load p5-dependent child components (`Vector1d.svelte`, `Vector2d.svelte`) only on the client-side, preventing SSR issues and using `<svelte:component this={...}>` for rendering.
  - **Styling:** Refactored p5 components (`Vector1d.svelte`, `Vector2d.svelte`) to:
    - Determine canvas size based on container width (`bind:this`, `clientWidth`).
    - Handle window resizing (`p5.windowResized`, `p5.resizeCanvas`).
    - Read CSS variables (`--color-surface`, `--color-text-primary`, etc.) using `getCSSVar` helper function within the sketch to apply theme colors.
  - **Interactivity:** Added drag functionality to `Vector1d.svelte` to allow users to interactively change the vector's value, involving continuous draw loop (`p5.draw`), mouse event handling (`mousePressed`, `mouseDragged`, `mouseReleased`), and state tracking (`isDragging`).
- **`anime.js` Exploration for 2D Visuals (2025-04-28):**
  - **Goal:** Explored `anime.js` as an alternative to `p5.js` for the interactive `Vector1d` component, aiming to leverage `createDraggable` for reduced boilerplate and built-in physics.
  - **Implementation:** Created `Vector1dAnime.svelte` using SVG for rendering and `anime.js` for interactivity.
  - **Issues Encountered:**
    - Persistent `DOMException: String contains an invalid character` errors during `createDraggable` initialization within `onMount`.
    - Errors likely stemmed from timing conflicts between `anime.js` needing stable layout/derived state (`originX`, `pixelsPerUnit`) and Svelte 5's reactivity during component mounting.
    - Attempts to resolve timing with `requestAnimationFrame` and `await tick()` were unsuccessful when the `x.mapTo` configuration was enabled.
    - Significant difficulties with TypeScript definitions (`@types/animejs`), requiring `any` type assertions for the `createDraggable` configuration and callback parameters to bypass incorrect type errors.
  - **Decision:** Reverted the `Vector1dAnime.svelte` implementation due to the unresolved initialization and typing challenges. The `p5.js`-based `Vector1d.svelte` will be used for now. `anime.js` remains installed for potential future use in less complex animation scenarios not dependent on initial derived state.
- **File Restoration:** Restored `src/lib/searchLogic.ts`, `src/routes/search/+page.ts`, and `src/routes/search/+page.svelte` after accidental deletion.
- **Hero SearchBar (`SearchBar.svelte`) Enhancements (2025-05-10):**

  - Implemented a dynamic, animated placeholder that cycles through chapter/section-related topics.
    - `preparePrompts()` function extracts and formats 1-2 word phrases from chapter/section titles and slugs.
    - Keywords are stored as `{text, href}` objects (`topicPromptLinks`) for direct navigation.
    - Svelte `$effect` and `setInterval` manage the cycling animation.
    - Placeholder uses Svelte `fly` transitions for text entry/exit.
  - Integrated a search suggestions dropdown, similar to `NavSearch.svelte`.
    - Uses `getSearchableData` and `filterSearchableData` from `src/lib/searchLogic.ts`.
    - Implements ARIA combobox pattern with keyboard navigation (`aria-activedescendant`).
    - Handles focus, blur, and click events for dropdown interaction.
  - Refined search submission logic (`handleSearch`):
    - Navigates to selected suggestion if active.
    - If input has text, navigates to `/search?q={query}`.
    - If input is empty, navigates using the `href` of the current animated `currentTopicPromptLink`.
  - **Debugging & Refinement:**
    - Addressed issues with dropdown visibility caused by `overflow: hidden` on parent containers and refined CSS positioning.
    - Tuned placeholder animation timings and keyword generation logic (e.g., "Word1 & Word3" formatting).
    - Resolved issues where `filteredResults` appeared empty due to subtle bugs, aided by `$inspect` logging.
  - **File Restoration:** Restored `src/lib/searchLogic.ts`, `src/routes/search/+page.ts`, and `src/routes/search/+page.svelte` after accidental deletion.

- **Authentication UX Enhancements & Refactor (2025-07-18):**
  - **Goal:** Improve the user experience of signup and login pages based on UX best practices.
  - **Key Enhancements Implemented:**
    - **Show/Hide Password Toggle:** Added to password fields on signup (`src/routes/signup/+page.svelte`) and login (`src/routes/login/+page.svelte`) pages.
    - **Caps Lock Indicator:** Implemented for password fields on both pages, warning users if Caps Lock is active.
    - **Clear Password Requirements:** Added a dynamic list of password requirements to the signup form, showing real-time validation status.
    - **Instant Input Validation:** Implemented for email (format, required), password (dynamic requirements check), and confirm password (match, required) on the signup page. Login page validation includes email (format, required) and password (required).
    - **"Forgot Password" Flow:** Added a "Forgot Password?" link on the login page, leading to `src/routes/forgot-password/+page.svelte` which handles the password reset email request via Supabase.
    - **"Remember Me" Option:** UI checkbox added to the login page (Supabase handles session persistence by default).
    - **Social Sign-In/Sign-Up (Apple & Google):** Added "Sign In/Up with Apple/Google" buttons to respective pages, integrating with Supabase OAuth. Created `src/lib/components/icons/AppleIcon.svelte`.
  - **Refactoring into Reusable Auth Components (`src/lib/components/auth/`):**
    - **`FormField.svelte`:** Encapsulates label, input, error messages, and a slot for extra content (like password toggles/requirements). Used across all auth forms.
    - **`AuthPageLayout.svelte`:** Provides a consistent page wrapper (container, title) for auth pages.
    - **`Button.svelte`:** A versatile button component with variants (primary, secondary, social), loading states, and disabled states. Used for all action and social login buttons.
    - **`SocialSignInButtons.svelte`:** Encapsulates Google and Apple sign-in/up buttons and their logic, configurable for login or signup modes.
  - **Styling:**
    - Moved common styles into respective components.
    - Added CSS custom properties for Google/Apple brand colors to `src/lib/styles/_variables.scss` for consistent theming.
  - **Linter Error Resolution:** Addressed various Svelte 5 and TypeScript related linter errors throughout the process.
  - **Next Steps (Planned):** Separate the signup process into multiple steps to gather more user information progressively without overwhelming the user.

## Content Philosophy and Complexity (2025-05-01)

- **Target Audience:** High school (AP) and introductory college physics students.
- **Core Goal:** Teach introductory physics concepts (kinematics, dynamics) using 3D visualization as a primary tool, enhancing intuition.
- **Bridge Goal:** Provide foundational 3D vector understanding to ease the transition to university-level mechanics (statics, dynamics).
- **Approach:**
  - **Intuition First:** Prioritize conceptual understanding and visualization over deep mathematical rigor initially. Leverage interactive elements heavily.
  - **Leverage 3D:** Use Threlte/Rapier to make 3D concepts (vectors, forces in space) more tangible and less abstract than traditional 2D diagrams.
  - **Connect to 1D/2D:** Explicitly show how 3D concepts extend familiar 1D/2D representations.
  - **Motivate 3D:** Use relevant examples (beyond the 3D printer) to show why 3D analysis is necessary in physics.
  - **Structured Complexity:** Introduce advanced topics (e.g., dot/cross products) conceptually first, focusing on physical meaning and geometric interpretation. Defer complex calculations (e.g., cross product determinant) to optional sections, accordions, or later chapters. Use `ContentCard` structure to allow flexible pacing.
- **Balance:** Aim for mastery of core introductory concepts accessible via the interactive 3D medium, while providing conceptual foundations for more advanced topics to serve the "bridge" audience. The 3D aspect should clarify, not overcomplicate.

# Phase 1: Minimum Viable Product (MVP)

## Core Structure (High Priority):

### Component Skeleton: Create basic Svelte components for:

- [x] PageLayout.svelte: Handles overall page layout (header, footer, etc.). ✅ 2025-03-23 - Add header and footer.
- [x] Chapter.svelte: Loads and displays chapter content (text and sections). ✅ 2025-03-23 - Renamed to `ChapterTemplate.svelte` for clarity as a reusable template. - Implemented prop system for chapter-specific data and styling. - Resolved "already declared" errors related to prop declarations.
- [x] Section.svelte: Displays a single section of content (text, visualization). ✅ 2025-03-23

- [x] Visualization.svelte: A placeholder or simple Threlte component for the 3D visualization. Initially, this can be a very basic Three.js scene (e.g., a rotating cube) to prove the integration works. [completion:: 2025-03-25]

  - [x] Create `src/lib/components/visualization/Visualization.svelte` component. [completion:: 2025-03-25]
  - [x] Set up a basic Threlte `<Canvas>` in `Visualization.svelte`. [completion:: 2025-03-25]
  - [x] Add a simple 3D object (e.g., `<Mesh>`, `<BoxGeometry>`, `<MeshStandardMaterial>`) - rotating cube. [completion:: 2025-03-25]
  - [x] Implement basic rotation animation for the cube. [completion:: 2025-03-25]
  - [x] Add a `<Camera>` component to the scene. [completion:: 2025-03-25]
  - [x] Add basic lighting (e.g., `<DirectionalLight>` or `<AmbientLight>`). [completion:: 2025-03-25]
  - [x] Integrate `<Visualization>` component into `src/routes/chapter/chapter1/+page.svelte`. [completion:: 2025-03-25]
  - [x] Verify the rotating cube visualization is visible in Chapter 1. [completion:: 2025-03-25]

- [x] Navigation.svelte: Basic navigation links to switch between the home page and the chapter page.

## Content and Styling (Medium Priority):

- [x] Basic Styling: Apply the Utopia fluid typography and spacing system. Focus on: [completion:: 2025-03-25]

- [x] Setting up the SCSS structure (priority:: high) (\_variables.scss, \_typography.scss, \_spacing.scss, etc., as described in your Memory.md). [completion:: 2025-03-25] - [x] need to discuss removing excess files in style library and establishing a better organization system going forwards [completion:: 2025-03-25]

- [x] Applying basic styles to the PageLayout, Chapter, and Section components to ensure readability. Don't get bogged down in detailed design at this stage. [completion:: 2025-03-25]

- [x] Ensure the CSS reset is applied correctly. [completion:: 2025-03-25]

- [x] Placeholder Interaction: Add a placeholder for interactivity. For example, a button that logs a message to the console when clicked. This demonstrates that you can connect UI elements to the visualization. This will later be replaced with actual physics interactions. [completion:: 2025-03-25]

## Home Page

- [x] Combine the hero and about sections as described in Memory.md. [completion:: 2025-03-25]

- [x] Include basic links to the chapter page. [completion:: 2025-03-25]

## Test Deployment

- [x] get the MVP deployed through vercel/netify [completion:: 2025-03-25]

# Phase 2: Expanding the MVP

## 1. Chapter 1 Enhancements (Iterative):

### Chapter 1 Plan: Foundations of 3D Space & Vectors

- [x] **Chapter 1 Content:** Populate src/routes/chapter/chapter1/+page.svelte with the textual content for the first section or two of Chapter 1. Don't worry about perfect formatting yet; focus on getting the content in place. [completion:: 2025-03-25]
- [x] **Develop characters** - create a small cast of characters (3-5) that the user will encounter throughout the book [completion:: 2025-03-29]
  - [x] [[VistaKine Cast]] - A wacky professor like Doc Brown who is super passionate about teaching physics and often gets into bizarre and improbable situations that demonstrate physical concepts. [completion:: 2025-03-29]

### Content and Structure:

#### **Immediate Goal: Testable Chapter 1**

- [x] **Finalize Section 1.1 Content:** Adjust tone and organize text for readbiilty [completion:: 2025-05-14]
      -cleanup the code for the visualization by moving reactive variables into the store file
- [x] **Finalize Section 1.2 Content:** Refine text for clarity and readability (bullet points, equation formatting, conciseness). [completion:: 2025-05-14]
- [x] **Finalize Section 1.2 Visualization:** Integrate component delta lines visualization feature. [completion:: 2025-05-14]
- [x] **Draft Section 1.3 Text:** Write core explanatory text for Vector Operations and Physical Vector Quantities. Use simple diagrams or reuse existing visualizations initially.
- [x] **Basic Mobile Pass:** Ensure exercises 1.1 (`PrinterCalibrationExercise`) and 1.2 (`VectorBuilderExercise`) are usable on mobile (avoid layout breakage, ensure core inputs work). [completion:: 2025-04-28]
- [ ] **Seek User Feedback:** Test Chapter 1 (esp. sections 1.1 & 1.2) with target students to validate learning goals and identify usability issues.

**Detailed Section Breakdown:**

- [ ] **Section 1.1: Introduction to Coordinate Systems:** (Complete - `PrinterCalibrationExercise`) Understanding how we locate points in 3D space (Cartesian coordinates).
- [x] **Section 1.2: Vectors and Components:** (In Progress - `VectorBuilderExercise`) Understanding vectors (magnitude/direction), representing them with coordinates, and visualizing their X, Y, Z components. Introduce unit vector concept/notation (i, j, k) visually. [completion:: 2025-04-28]
  - [x] **Created Core Components (2025-04-15):** `VectorBuilderExercise`, `VectorBuilderScene`, `VectorBuilderHud`, `VectorInputPanel`, `VectorOutputPanel`.
  - [x] **Implemented State Management (2025-04-15):** Created `vectorBuilderState.ts` using Svelte stores for coordinates, derived vector data, color themes, and control flags.
  - [x] **Scene Basics (2025-04-15):** Reused scene setup (bed, grid, axes, nozzle) from `PrinterCalibrationScene`. Added `ArrowHelper` to visualize the vector, start/end point markers, and coordinate labels.
  - [x] **HUD Implementation (2025-04-15):**
    - Implemented input fields (start/end points) in `VectorInputPanel`.
    - Added display for vector components and magnitude in `VectorOutputPanel`.
    - Implemented "Create & Trace" button (moved to `VectorInputPanel`) and Reset button.
    - Integrated `FullscreenButton` and `ResetButton`.
    - Used Threlte `<HTML>` overlay for fullscreen compatibility, resolving layout issues by positioning panels absolutely within the overlay.
    - Modularized HUD into `VectorInputPanel` and `VectorOutputPanel` for better layout control, positioning them independently.
  - [x] **Input Validation (2025-04-15):**
    - Added integer-only sanitization (`oninput`).
    - Implemented bounds checking in `vectorBuilderState.ts` derived stores.
    - Added visual feedback (`.invalid` class) for out-of-bounds/invalid inputs after user interaction (`onblur`).
  - [x] **Styling & Polish (2025-04-15):**
    - Color-coded input labels/borders and output components using shared axis color stores.
    - Refined input field appearance based on mockup (colored background group, white label text, smaller input field).
    - Disabled text selection on HUD panels.
    - Added axis ticks, numbers, labels, and nozzle height indicator to the scene.
  - [x] **Dialog Integration (2025-04-15):**
    - Updated state store for `DialogTurn[]` structure.
    - Integrated `DialogBox` into `VectorBuilderExercise` using the standard overlay pattern.
    - Added introductory dialog content in `VectorBuilderScene` `onMount`.
  - [ ] Different notation styles
        Be able to switch the display for the labels to see vectors displayed in different notation styles
- [ ] **Section 1.3: Vector Operations:** Introduce core operations (addition, subtraction, scalar multiplication, brief dot/cross product concepts). Conclude by bridging to physical quantities (position, velocity, force etc.).
  - [ ] **Addition/Subtraction:** Visualizing head-to-tail method and component-wise operations in 3D.
    - [ ] _Visualization Idea:_ Define two vectors, see the resultant visualized comparing graphical and component methods.
  - [ ] **Scalar Multiplication:** Show how multiplying a vector by a scalar changes magnitude/direction.
  - [ ] **Dot/Cross Product Concepts:** Introduce conceptually, focusing on geometric meaning (angle/projection for dot, RHR/area for cross) and physical relevance (work, torque).
    - [ ] _Visualization Idea:_ Interactive demo for dot product showing projection, interactive demo for cross product showing RHR and resulting vector.
- [x] **Refine Styling:** Improve the visual design and layout of Chapter 1, paying attention to spacing, typography, and overall aesthetics. [completion:: 2025-04-03]
  - [x] Look farther into the graphing paper theme [completion:: 2025-03-29]
    - [x] try to have grid line up with elements [completion:: 2025-03-29]
  - [x] Create a dark mode for the site (based on chalkboards?) [completion:: 2025-04-12]
  - [x] **Component styles:** update the styles of the components within the page to be more interesting [completion:: 2025-04-03]
    - [x] Refactored accordions (`FormulaAccordion`, `SectionReview`, `GuidedCalculation`) for consistent styling and animation. [completion:: 2025-03-31]
    - [x] Add LaTeX to formula dropdown [completion:: 2025-03-31]
- [x] ~~Create comics for scenarios (priority:: low) - have simple custom illustrated comics to make learning more engaging~~ **\*POSTPONED DUE TO HIGH COMPLEXITY/LOW IMPACT** [completion:: 2025-04-05]
- [x] **Mobile Responsiveness** (priority:: high) - adjust the taskbar to be a toggle button on mobile. [completion:: 2025-03-25]
- [ ] **Full Chapter 1 Content:** Complete the textual content for all sections of Chapter 1 (as outlined above).
- [ ] **Chapter 1 Content Review (Complexity & Clarity):**
  - [ ] Review section content to ensure explicit connections between 1D, 2D, and 3D concepts are clear.
  - [ ] Verify that the 3D presentation clarifies concepts rather than adding undue complexity for the target audience.
  - [ ] Ensure advanced mathematical details (e.g., cross product determinant calculation) are placed in optional/expandable sections (`Accordion` or similar).
  - [ ] Review quizzes to ensure they primarily test core conceptual understanding, potentially adding optional challenge questions for "bridge" concepts.

### Visualization and Interaction:

- [x] **Performance testing** To test performance and gauge how much can be placed in a scene [completion:: 2025-04-12] - [x] Access original project files to get raw data on rapier engine performance [completion:: 2025-04-12] - [x] Threlte/rapier should have similar if not the same original rapier so in depth performance testing is likely unnecessary. [completion:: 2025-04-12] - [x] Will need to create a performance monitor for physics playground to understand performance impact of features [completion:: 2025-04-12]

- [x] **Create physics playground** - for users to play around with features and learn how to interact with objects [completion:: 2025-04-05] - [x] We will be using the physics playground as a sort of 'Master File' to core features that will be used by most visualizations [completion:: 2025-04-05] - [x] After getting core features -> modularize and export - [x] This will be the main focus until further notice - [x] **HUD & FBD Implementation (2025-04-05):** - [x] Created `HudScene.svelte` to overlay UI elements. - [x] Extracted `ResetButton.svelte`, added rotation feedback, fixed reset logic in `Scene.svelte` (position, rotation, velocity, body type, gravity scale) and reset `controlMode` in `+page.svelte`. - [x] Created `FBDMenu.svelte` with checkboxes bound to `fbdVisibilityStore`. Positioned in `HudScene`. - [x] Added "Toggle All" button to `FBDMenu.svelte`. - [x] Created `uiStores.ts` with `isFBDMenuOpen` store. - [x] Added FBD menu toggle button ('Move' icon) to `ToolbarMain.svelte`, linked to `isFBDMenuOpen` store. - [x] `HudScene` now conditionally renders `FBDMenu` based on `isFBDMenuOpen` and clears FBD vector visibility when menu closes. - [x] Updated `fbdStores.ts` to include `axes` visibility state. - [x] Added toggleable, dotted XYZ axes (Red, Green, Blue `LineDashedMaterial`) to `FBD.svelte`, visibility tied to menu state and `fbdVisibilityStore.axes`. Origin dot visibility also tied to menu state. - [x] Ensured FBD helpers (`ArrowHelper`, axes, dot) use `depthTest: false` for overlay effect.
- [x] **Real Visualization:** Replace the placeholder visualization with a real interactive visualization relevant to Chapter 1. This is where you'll start using @threlte/rapier for physics simulations. Start with one key interactive element. [completion:: 2025-04-28]
  - [x] **Object Selection:** Implemented click-to-select functionality for `Cube` objects, showing an outline on hover and selection. Differentiated clicks from drags using event delta. [completion:: 2025-04-06]
  - [x] **Camera Following:** Implemented double-click-to-follow feature for `Cube` objects. Camera resets to default view upon unfollowing. Dynamically limits `maxDistance` when following to maintain proximity. [completion:: 2025-04-06]
  - [x] **Camera Polar Angle:** Discussed limiting camera rotation below the ground (`maxPolarAngle`). Decided to keep the default `Math.PI / 2` restriction for now to prevent ground clipping, with plans to potentially relax it contextually in future scenes (e.g., projectile motion zenith). [completion:: 2025-04-06]
- [x] **State Management:** Implement proper state management using Svelte stores (as you've started in `appState.js`) to control the visualization (play/pause, parameters, etc.). Connect this state to UI controls. [completion:: 2025-04-05]
  - [x] Added stores for `selectedObject` and `followedObject`. [completion:: 2025-04-06]
- [x] **Ui Components** (priority:: high) - we need to update the UI components [completion:: 2025-04-05] - [x] Update the main taskbar - move it to the bottom center begin adding placeholder buttons for the components. [completion:: 2025-04-05] - [x] UI buttons are consistently styled. [completion:: 2025-04-05] - [x] Add new Glassmorphic variables specifically for the buttons. [completion:: 2025-04-05]
- [x] **Chapter 1 Visualization - Printer Calibration (2025-04-08):** [completion:: 2025-04-08]
  - [x] Created `PrinterCalibration.svelte` scene demonstrating coordinate systems.
  - [x] Implemented core elements: printer bed, grid, nozzle, custom axes (X/Y/Z).
  - [x] Added interactive controls (initially external, then refactored).
  - [x] Implemented two-stage target system with hit detection (color change feedback).
  - [x] Added tweened animation for smooth nozzle movement.
  - [x] Implemented input validation with conversational feedback messages.
  - [x] **UI Implementation Iteration:**
    - Started with controls external to visualization.
    - Explored embedding UI using Threlte `<HTML>` for potential integration but faced visibility and potential accessibility challenges.
    - **Final Approach:** Created dedicated overlay component (`CalibrationHud.svelte`) positioned alongside `VisContainer` via the page component (`understanding-3d-space.svelte`) for better maintainability and standard UI behavior.
  - [x] **Dialog Rendering Solution (2025-04-09):** Addressed issue where HTML-based `<DialogBox>` component wouldn't render correctly when placed inside `PrinterCalibration` (within the Threlte `<Canvas>`). Solved by wrapping `<DialogBox>` with the `@threlte/extras` `<HTML>` component within `PrinterCalibration`. The `<HTML>` component renders its children outside the WebGL context, allowing standard CSS positioning (`position: fixed`) to work as expected while keeping the dialog logic and declaration modular within the scene component.
  - [x] **Visual Polishing:**
    - Added axis ticks and labels (X, Y, Z) for improved orientation.
    - Added nozzle height indicator cylinder.
    - Refined axis/tick opacity and number positioning for clarity.
  - [x] **Fullscreen Functionality:** Resolved issues with overlay HUD in fullscreen mode.

## 2. Navigation and Structure (High Priority):

### Glossary Functionality (2025-04-01):

- [x] **Completed Core Glossary Functionality:** Implemented search, chapter filtering, and sorting for the glossary page. [completion:: 2025-04-05]
- [x] **Dropdown Sort Menu:** Replaced sort buttons with a cleaner dropdown menu using a reusable `Dropdown.svelte` component for "Alphabetical" and "Chronological" sorting options. [completion:: 2025-04-28] - [x] Style the sort menu [completion:: 2025-04-28]
- [x] **Alphabetical Sorting Debugging:** Debugged and resolved an issue where alphabetical sorting was not visually updating in the DOM. Implemented a keyed `#each` block in `+page.svelte` to ensure correct Svelte reactivity and DOM updates for sorted lists. [completion:: 2025-04-05]
- [x] **Style Syntax Correction:** Identified and corrected a potential syntax error in the glossary styles within `+page.svelte`. [completion:: 2025-04-05]
- [x] **TypeScript Implementation (Partial):** [completion:: 2025-05-14]
  - [x] Converted `glossary-data.js` to `glossary-data.ts` to enable TypeScript type checking. [completion:: 2025-04-21]
  - [x] Added type definitions (interfaces `GlossaryTerm`, `GlossaryChapter`, and type `GlossaryData`) directly within `glossary-data.ts` for improved type safety and code maintainability. [completion:: 2025-04-21]
  - [x] Applied the `GlossaryData` type to the `glossaryData` constant in `glossary-data.ts`. [completion:: 2025-04-21]
  - [x] Updated imports in `+page.svelte` to reflect the `.ts` file and simplified type handling. [completion:: 2025-05-14]
- [x] **Glossary Data Repopulation:** Re-populated `glossary-data.ts` with a representative set of glossary terms for "Understanding 3D Space", "Kinematics", and "Forces and Motion" chapters to facilitate styling and testing. [completion:: 2025-04-28]

### Intra-Chapter Navigation:

- [x] **Section Navigation:** Add navigation _within_ the chapter page to jump between sections. This could be a sidebar or a table of contents. [completion:: 2025-03-25]
- [x] Sidebar update: Add styles to the sidebar navigation to reflect the chapter colors [completion:: 2025-03-31] - [x] Use lighter versions of colors to avoid being too distracting [completion:: 2025-03-31]
- [ ] Update the chapter.ts to include the home, settings, & glossary pages. - Will allow for correct highlighting in nav when on resp. page.

### Scroll Handling:

- [x] **Scroll Handling:** Implement smooth scrolling and address any potential issues with intersection observers (as mentioned in your Memory.md). Consider using Svelte actions for this. [completion:: 2025-04-21] - [ ] Set up smooth scrolling for when navigating within sections

## 3. Additional Chapters (Iterative):

### Chapter Creation Process:

- [x] **Repeat for Subsequent Chapters:** Repeat the process for subsequent chapters, focusing on one chapter at a time. Each new chapter will involve creating a new route, populating content, and developing the corresponding visualizations. (Focus on one chapter at a time.) [completion:: 2025-05-14]

## 4. Polishing and Sharing (Ongoing):

### Testing and Optimization:

- [x] **Testing:** Thoroughly test the site on different browsers and devices. [completion:: 2025-05-14]
- [x] **Initial Performance Optimization:** Profile the site and identify any performance bottlenecks [completion:: 2025-05-14]

### Deployment and Feedback:

- [x] **Production Deployment:** Deploy the site to a hosting platform (e.g., Netlify, Vercel). - [ ] get a super official domain name [completion:: 2025-05-14]
- [x] **Local Sharing:** Share the site with friends and family to get initial feedback on quality, UX and detect any bugs. [completion:: 2025-05-14]

# Phase 3: Scaling Content, Ensuring Quality, and Early Kinematics

This phase focuses on completing the foundational Chapter 1, preparing core components and an architecture for future chapter development, gathering user feedback, and beginning work on Chapter 2 (Kinematics).

## Post-Signup Flow and Onboarding Plan

This section outlines the refined user flow after initial signup or login, focusing on onboarding, profile completion, and clear disclosure of the freemium model.

**Core Principles:**

- Minimize friction for accessing free content (Chapter 1, Glossary, basic Physics Playground).
- Provide clear guidance to new users after account creation.
- Be transparent about the paywall for premium content (Chapter 2+ and advanced features).
- Offer optional profile completion to enhance user experience without being a barrier.

**Detailed Flow:**

1.  **Anonymous User Experience:**

    - Can freely access Chapter 1 sections (e.g., `/chapter/understanding-3d-space/coordinate-systems`), the Glossary (`/glossary`), and the basic Physics Playground (`/physics-pg`).
    - **Home Page (`src/routes/+page.svelte` updates):**
      - Primary CTA: "Start Chapter 1: Understanding 3D Space (Free!)" (or similar wording).
      - Secondary CTA: "View Pricing / Unlock All Chapters" (links to `/subscribe` page).
      - Clear, concise text explaining that Chapter 1 and basic features are free, while full access requires a subscription.

2.  **Signup Page (`src/routes/signup/+page.svelte`):**

    - Remains a single, streamlined form for Email/Password/Confirm Password and Social Sign-in options, incorporating existing UX enhancements (validation, caps lock, password requirements).

3.  **Login Page (`src/routes/login/+page.svelte`):**

    - Existing form structure for Email/Password and Social Sign-in.

4.  **Post-Signup/Login Redirection - Intermediary Welcome Page (New Route, e.g., `/welcome`):**

    - Users are redirected here immediately after successful signup or login.
    - **Content & Layout:**
      - **Primary Focus Area:**
        - Clear "Welcome to VistaKine!" message.
        - Prominent CTA button: "Start Learning Chapter 1" (links to the first section of Chapter 1).
        - Supporting CTA button: "Explore the Physics Playground".
      - **Secondary Optional Section (on the same page, less prominent):**
        - Heading: "Complete Your Profile (Optional)" or "Help Us Personalize Your Experience".
        - Inline form fields for: Preferred Name, Level of Education, School, Country, Physics Comfort Level.
        - A "Save Profile" button for this section.
        - Users can easily ignore this section and proceed with the primary CTAs.
    - **Rationale:** Keeps the user engaged on a single page, reduces clicks, leverages momentum, and provides an early opportunity for optional profile completion.

5.  **Authenticated User (Browsing Experience):**

    - Can navigate Chapter 1 content freely.
    - `AuthWidget.svelte` (in `Navigation.svelte` or main layout):
      - Displays user information and sign-out button.
      - Consider adding a subtle, non-intrusive hint like "Complete Profile" or a profile completion progress indicator if the user skipped it on the welcome page. This links to a dedicated profile page.
    - **Paywall Enforcement:** When attempting to access Chapter 2 (or any other premium content/feature not included in the free tier), the user is redirected to the `/subscribe` page.

6.  **Subscription/Paywall Page (New Route, e.g., `/subscribe`):**

    - Clearly displays pricing tiers (Monthly, Annual/Semester, Student Discount options as per `documentation/businessplan.md`).
    - Lists features included in the Free vs. Premium tiers.
    - Integrates with a payment provider (e.g., Stripe) to handle the subscription process.
    - This page is linked from the Home Page CTA ("Unlock All Chapters") and is the destination for users trying to access locked content.

7.  **Dedicated Profile Page (New or Existing Route, e.g., `/profile` or `/settings/profile`):**
    - Allows users to view, edit, and update their profile information at any time after the initial welcome page.
    - This is where the "Complete Profile" hint in `AuthWidget.svelte` would link.

**Benefits of this Flow:**

- Aligns with the "Freemium Subscription" model in `documentation/businessplan.md`.
- Maximizes discovery of free content.
- Reduces signup friction.
- Provides a guided onboarding experience.
- Sets clear expectations regarding paid content.

**Next Implementation Steps (To be prioritized):**

- Create the basic structure and routing for the Intermediary Welcome Page (`/welcome`).
- Update the Home Page (`src/routes/+page.svelte`) with the new CTA and paywall disclosure language.
- Create a placeholder for the Subscription/Paywall Page (`/subscribe`).
- Develop the inline profile form components/fields for the Welcome Page and later for the dedicated Profile Page.

## 1. Finalizing Chapter 1 Content & Polish

- [ ] **Complete Section 1.1 (Coordinate Systems):**
  - [ ] Develop and integrate an interactive exercise for exploring 3D coordinate systems with negative values (e.g., an extension of `AxisExplorer` or a new simple interaction).
- [ ] **Review and Refine All Chapter 1 Sections:**
  - [ ] Ensure consistent terminology, clarity of explanations, and flow between sections.
  - [ ] Polish existing visualizations (`PrinterCalibrationExercise`, `VectorBuilderExercise`) based on any internal review.
  - [ ] Verify all interactive elements are robust and mobile-friendly. - [ ] look into why the Fullscreen appears to be bugged for IOS on safari and firefox

## 2. Component Scalability & Architectural Refinements

- [ ] **Review Core Visualization Components:**
  - [x] Identify patterns and reusable elements in `PrinterCalibrationExercise` and `VectorBuilderExercise` to streamline development of future visualizations. [completion:: 2025-05-16]
  - [x] Refactor common Threlte scene setup, controls, or HUD elements into more generic, reusable components if beneficial. [completion:: 2025-05-16]
- [ ] **Simplify UI for Mobile & Touch:**
  - [ ] Prioritize touch/drag controls for interactions to reduce reliance on complex on-screen UI panels that need extensive responsive styling.
  - [ ] Evaluate existing UIs (e.g., `NozzleControlPanel`, `VectorInputPanel`) for further simplification on mobile.
  - [ ] look into creating separate component for handling Fullscreen logic and styles.
- [ ] **Physics Playground Integration Enhancements:**
  - [ ] Implement contextual information pop-ups/tooltips in the Physics Playground that link to relevant chapter sections when users interact with specific concepts or objects.

## 3. User Testing & Feedback Collection (Moved from Phase 2)

- [ ] **Seek User Feedback (Target Audience):** Test Chapter 1 (especially sections 1.1 & 1.2, including the new negative coordinate exercise) with target students (high school AP, introductory college physics) to validate learning goals and identify usability issues.
  - [ ] Gather qualitative feedback on engagement, clarity, and perceived value.
  - [ ] Observe how users interact with visualizations and the Physics Playground.
- [ ] **Testing (General - from Phase 2 "Polishing and Sharing"):** Thoroughly test the site on different browsers and devices.
- [ ] **Performance Optimization (from Phase 2 "Polishing and Sharing"):** Profile the site and identify any performance bottlenecks. Address these using techniques like lazy loading, code splitting, and optimizing Threlte/Three.js rendering. _(Ongoing, but crucial as content grows)_

## 4. Developing Chapter 2: Kinematics

- [ ] **Outline Core Concepts for Kinematics Sections:**
  - [ ] Motion in 1D (Displacement, Velocity, Acceleration, Kinematic Equations)
  - [ ] Motion in 2D (Vectors for 2D motion, Projectile Motion)
  - [ ] Motion in 3D (Extending concepts to 3D vectors)
  - [ ] Kinematics Graphs (Position-Time, Velocity-Time, Acceleration-Time)
- [ ] **Brainstorm Interactive Visualizations for Kinematics:**
  - [ ] 1D motion simulator with interactive graphs.
  - [ ] Projectile motion simulator with tunable launch parameters (angle, speed, initial height) and trajectory tracing.
  - [ ] Visualizations for vector addition/subtraction in the context of displacement/velocity.
  - [ ] Interactive tool for exploring relationships between motion graphs.
- [ ] **Begin Development of First Kinematics Section & Visualization:**
  - [ ] e.g., Start with "Motion in 1D" and a basic interactive simulation with a controllable object and corresponding graphs.

# Pre-Launch Checklist (Future Phase)

- [ ] **Security Review:**
  - [ ] **Verify Supabase Row Level Security (RLS):** Ensure RLS is enabled on all necessary tables (e.g., `profiles`, user progress, subscriptions) and that policies are correctly configured to prevent unauthorized data access or modification. Double-check policies for `SELECT`, `INSERT`, `UPDATE`, `DELETE` operations.
  - [ ] Review Supabase project access levels and API key usage.
  - [ ] Check for any exposed sensitive information in client-side code.
  - [ ] Update all dependencies to their latest secure versions.
- [ ] **Performance Optimization & Stress Testing:**
- [ ] **Final Content Review & Proofreading:**
- [ ] **Accessibility Audit (WCAG):**
- [ ] **Cross-Browser & Cross-Device Testing:**
- [ ] **Setup Analytics & Monitoring:**
- [ ] **Backup Strategy for Database:**

---

## New field: 2024-07-17

# Feature Development: User Bookmarks

This section details the implementation of a feature allowing authenticated users to bookmark content items like `ContentCard`s and `Keyword` definitions.

**Key Activities & Decisions:**

1.  **Reusable Bookmark Component (`src/lib/components/ui/BookmarkIcon.svelte`):**

    - Created a dedicated Svelte component `BookmarkIcon.svelte` to encapsulate all bookmarking logic and UI.
    - This component handles:
      - Props: `contentId` (string, unique ID of the content to bookmark), `contentType` (string, e.g., "card", "keyword"), `class` (optional, for additional styling).
      - Authentication check: Only renders and functions if a user is authenticated (derived from `authState`).
      - Fetching current bookmark status from Supabase for the given `contentId` and `contentType`.
      - Toggling the bookmark status (inserting or deleting a record in `user_bookmarks`).
      - Displaying different icon states (bookmarked ★, not bookmarked ☆, loading ⏳).
    - Corrected Svelte 5 Rune derivation for `isAuthenticated` and `currentUser` from the classic Svelte store `authState` using `const _authState = $derived(authState); let isAuthenticated = $derived(_authState.isAuthenticated);`.

2.  **`ContentCard.svelte` Integration:**

    - Refactored `ContentCard.svelte` to remove its direct bookmarking logic.
    - It now uses the `<BookmarkIcon />` component.
    - Props `contentId?: string` and `showBookmarkFeature?: boolean` were kept.
    - The `BookmarkIcon` is rendered if `showBookmarkFeature` is true and `contentId` is provided. `ContentCard.svelte` itself no longer directly checks `isAuthenticated` for rendering the icon, as `BookmarkIcon.svelte` handles this internally.
    - The `contentType` passed to `BookmarkIcon` is hardcoded as `"card"`.
    - Styling for the icon's position within the card is handled in `ContentCard.svelte` by targeting the `.card-bookmark-icon` class applied to the `BookmarkIcon` component.

3.  **`Keyword.svelte` Integration:**

    - Integrated `<BookmarkIcon />` into the `Keyword.svelte` component's popover.
    - The bookmark icon appears in the popover header, next to the keyword term.
    - The existing `keywordId` (derived from the `term`) is used as the `contentId`.
    - The `contentType` passed to `BookmarkIcon` is hardcoded as `"keyword"`.

4.  **Supabase `user_bookmarks` Table Modifications (Pending User Action):**

    - **Add New Column:**
      - Table: `user_bookmarks`
      - Column Name: `content_type`
      - Type: `text`
      - Constraints: Not Nullable
    - **Update Unique Constraint:**

      - The unique constraint on `user_bookmarks` needs to be updated to include `content_type`.
      - If an old unique constraint exists on `(user_id, content_id)`, it should be dropped.
      - New unique constraint: `UNIQUE (user_id, content_id, content_type)`.
      - SQL to drop old (if exists) and add new:

        ```sql
        -- Run this first IF you have the old constraint on just user_id, content_id
        ALTER TABLE public.user_bookmarks
        DROP CONSTRAINT IF EXISTS user_bookmarks_user_id_content_id_key; -- Adjust constraint name if different

        -- Add the new unique constraint
        ALTER TABLE public.user_bookmarks
        ADD CONSTRAINT user_bookmarks_user_content_type_key UNIQUE (user_id, content_id, content_type);
        ```

    - **RLS Policies:** Existing Row Level Security policies for basic `SELECT`, `INSERT`, `DELETE` operations (where users manage their own records based on `auth.uid() = user_id`) should continue to function correctly without modification for this structural change, as they primarily gate access based on `user_id`.

**Next Steps (User - Backend):**

1.  **Apply Supabase Schema Changes:**
    - Log in to your Supabase dashboard.
    - Modify the `user_bookmarks` table:
      - Add the `content_type` column (text, not nullable).
    - Using the SQL Editor in Supabase:
      - Drop the old unique constraint on `(user_id, content_id)` if it exists.
      - Add the new unique constraint on `(user_id, content_id, content_type)`.
2.  **Test Bookmarking Feature:**
    - For `ContentCard` instances where `showBookmarkFeature={true}` and a `contentId` is provided.
    - For `Keyword` popovers.
    - Verify icons appear correctly for authenticated users.
    - Test adding and removing bookmarks.
    - Check the `user_bookmarks` table in Supabase to confirm records are created/deleted with the correct `content_id` and `content_type`.

---

## Current Development Focus & Upcoming Objectives (as of 2024-07-19)

For a detailed breakdown of the immediate and near-term development priorities, please refer to the dedicated planning document:

- [**Upcoming Project Objectives**](Plans%205.25.25.md)

Key high-level priorities include:

1.  **Streamlining the Interactive Exercise Architecture:** Enhancing `InteractiveExercise.svelte`, improving prop/state management, and resolving iOS fullscreen issues.
2.  **Finalizing the Authentication Flow:** Polishing Google Sign-In, designing a static header auth widget, and comprehensive testing.
3.  **Implementing the Core Subscription Model:** Integrating with a payment provider, setting up backend logic, and building the initial subscription UI.
4.  **Conducting an Accessibility Audit:** Ensuring WCAG compliance for colors, keyboard navigation, and ARIA usage.
5.  **Developing User Account Management:** Creating pages for profile editing, subscription viewing, and accessing bookmarked content.
6.  **Ongoing UX/Content Refinement:** Including beta testing preparation and security considerations.

This focused plan aims to build a robust, marketable, and accessible platform efficiently.

---

- **Implemented a standardized architecture for interactive exercise control panels (2024-07-19):** Refactored existing interactions (`PrinterCalibration`, `VectorBuilder`, `VectorPrinter`) to manage control panel state using dedicated Svelte stores and pass the control panel component to the HUD via a Svelte 5 snippet prop (`controlsSnippet`) rendered with `{@render ...}`. This replaces the previous slot-based approach for control panels within the HUD and centralizes state management.
- [x] Audit and refactor `InteractiveExercise.svelte` and existing interactions (`PrinterCalibration`, `VectorBuilder`, `FullCoordinateExplorer`, `DisplacementVelocity`). [completion:: 2025-05-26]
- [x] Improve prop passing and state management (Svelte stores, context API). [completion:: 2025-05-26]
  - Implemented standardized control panel state management using Svelte stores and updated `InteractiveExercise.svelte` to pass the control panel to the HUD via a snippet prop.
- [ ] Resolve iOS fullscreen issues for visualizations.

---

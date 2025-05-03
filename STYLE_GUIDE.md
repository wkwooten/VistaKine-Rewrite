# VistaKine Style Guide

This document outlines the CSS architecture, conventions, and best practices for the VistaKine project, built with Svelte 5 and Threlte.

## File Structure

The styling is primarily managed within `src/lib/styles` and component-specific `<style>` blocks.

```
src/
├── app.scss                     # Global app styles (imports main.scss)
├── app.html                     # Main HTML template (includes font links, KaTeX CSS)
├── lib/
│   ├── styles/
│   │   ├── _variables.scss      # Core SCSS variables, CSS custom properties (light/dark/chapter themes)
│   │   ├── _typography.scss     # Utopia fluid typography scale mixins
│   │   ├── _spacing.scss        # Utopia fluid spacing scale variables & utility classes
│   │   ├── _reset.scss          # CSS reset/normalize
│   │   ├── _grid.scss           # Basic grid helpers (.container, .auto-grid)
│   │   ├── _animations.scss     # Animation utilities and keyframes
│   │   ├── _utilities.scss      # General utility classes
│   │   ├── _katex-custom.scss   # Custom overrides for KaTeX rendering
│   │   ├── chapter-styles.scss  # Base styles applicable across chapter sections (minimal)
│   │   └── main.scss            # Main SCSS partial that imports all other partials
│   ├── components/
│   │   ├── ui/                  # General UI components (Accordion, Button, DialogBox, etc.)
│   │   └── visualization/       # Threlte visualization components & scenes
│   │       └── elements/        # Reusable 3D elements (Axes, Grid, etc.)
│   │       └── interactions/    # Interactive exercises (PrinterCalibration, VectorBuilder)
│   │       └── scenes/          # Specific Threlte scenes
│   ├── content/
│   │   └── chapters/            # Chapter content root
│   │       └── [slug]/          # Specific chapter folder (e.g., understanding-3d-space)
│   │           └── sections/    # Individual section components
│   ├── data/                    # Data files (e.g., glossary-data.ts, chapters.ts)
│   └── stores/                  # Svelte stores for global/shared state
├── routes/                      # SvelteKit routes
│   ├── +layout.svelte           # Main application layout (sidebar, content area)
│   ├── chapter/
│   │   └── [slug]/
│   │       └── [section]/       # Dynamic route for chapter sections
│   │           └── +page.svelte # Loads section component
│   │           └── +page.ts     # Loads section data/component dynamically
│   │           └── +page.svelte  # Loads section component
│   └── ... (other routes like glossary, settings)
└── ...
```

## Layout System

### Main Application Layout (`src/routes/+layout.svelte`)

- **Flexbox Driven:** Uses `display: flex` on `.app-container` for the primary layout.
- **Sidebar (`.navigation`):**
  - Fixed position (`position: fixed`) on both desktop and mobile.
  - Desktop: Collapsible width controlled by `$sidebarExpanded` store, transitioning between `--sidebar-width` and `--sidebar-collapsed-width`. A toggle button (`.sidebar-toggle-button`) controls this.
  - Mobile: Slides in from the left, controlled by `mobileNavOpen` state. An overlay (`.mobile-overlay`) closes the menu on click. A floating action button (`.mobile-menu-button`) opens it.
- **Content Area (`.content`):**
  - Uses `flex-grow: 1` to occupy the remaining space.
  - `overflow-y: auto` enables scrolling for content longer than the viewport.
  - `position: relative` to act as a positioning context if needed.
- **Parallax Background:** A subtle `parallax-background` div with a `grid-background` provides visual depth.

### Content Structure

- **`.u-container`:** Applied within the `<main class="content">` area in `+layout.svelte`. Provides consistent padding (`--space-l` or `--space-s` on mobile) for the main content block.
- **Chapter/Section Wrappers:** Specific components (like those in `src/lib/content/chapters/[slug]/sections/`) manage their internal layout.
- **`.readable-content`:** (Defined in `chapter-styles.scss`) A utility class intended to wrap blocks of text (paragraphs, lists) within components to constrain their width to `--readable-max-width` (70ch) for optimal readability. Apply this inside components where appropriate.
- **Component Layout:** Interactive components (`Quiz`, `Accordion`, `Exercise` wrappers) often use a "card" style (defined within the component or via shared classes) with background, border, padding, and shadow.

## Core Styling Concepts

### Visual Theme & Aesthetics

- **Goal:** Achieve a technical yet approachable look inspired by **blueprints, graph paper, and engineering paper**.
- **Background:** A fixed `grid-background` within a `parallax-background` element provides a subtle sense of depth. The parallax effect (managed by [src/lib/scripts/parallax.ts](mdc:src/lib/scripts/parallax.ts)) moves the background opposite to the scroll direction, enhancing the feeling of moving down a large sheet of paper.
- **Alignment:** While not strictly required, aim to use dimensions (padding, margins, component heights where feasible) that are **multiples of 40px** (or fractions thereof, like 20px). This can help elements align visually with the background grid lines, contributing to a precise, engineered feel.
- **Color & Typography:** The color palettes (light/dark/chapter) and typography choices (defined in [\_variables.scss](mdc:src/lib/styles/_variables.scss) and [\_typography.scss](mdc:src/lib/styles/_typography.scss)) complement this theme, aiming for clarity and readability.

### SCSS & CSS Variables

- **SCSS:** Used within `<style lang="scss">` blocks and `.scss` partials. Enables nesting, mixins, and functions.
- **CSS Custom Properties:** The primary method for theming and configuration. Defined in `:root` within `_variables.scss`.
  - **Hierarchy:** SCSS variables (`$variable-name`) are often used to _define_ the initial values for CSS custom properties (`--variable-name`). Components should primarily consume the CSS custom properties.
  - **Theming:**
    - **Light/Dark Mode:** Handled via `@media (prefers-color-scheme: dark)` block in `_variables.scss` overriding base CSS variables.
    - **Chapter Themes:** Each chapter has a set of CSS variables (`--chapter-color-1`, `--chapter-bg-1`, etc.) defined in `_variables.scss`. These are applied dynamically via inline styles or classes based on the current chapter context (often managed in parent layout/route components).

### Utopia Fluid Design

- **Typography (`_typography.scss`):** Uses `clamp()` functions generated by Utopia to create a fluid type scale (`--step--2` to `--step-6`). Applied via SCSS mixins (`@mixin heading-1`, `@mixin body`, etc.).
- **Spacing (`_spacing.scss`):** Uses `clamp()` functions for a fluid spacing scale (`--space-3xs` to `--space-3xl`, plus common pairs like `--space-s-l`). Consumed directly as CSS variables or via utility classes (`.mb-s`, `.p-m`, etc.).

### Color System (`_variables.scss`)

- **Semantic Naming:** Variables aim for semantic names (e.g., `--color-background`, `--color-surface`, `--color-accent`, `--color-error`) rather than literal color names.
- **Palettes:** Organized into Core, Accent, Functional, Axis, Scene, and Character palettes for both light and dark modes.
- **Transparency:** Transparent axis colors are provided (`--axis-color-x-t50`).
- **Contrast:** Color choices aim for WCAG AA contrast, especially for text and UI elements. Dark mode themes are specifically designed for visibility on dark backgrounds.

## Svelte 5 Runes & Migration

This project utilizes **Svelte 5** and its **Runes API** (`$state`, `$derived`, `$effect`, `$props`, etc.) for reactivity and component structure.

- **Legacy Code:** Be aware that some older code might still use Svelte 3/4 patterns (e.g., `export let` for reactivity, lifecycle functions like `onMount` for effects).
- **Migration Goal:** The aim is to systematically refactor legacy patterns to their Svelte 5 Runes equivalents for improved performance, readability, and consistency. Prioritize Runes for all new components and features.

## Writing Tone & Content Style

The textual content is a crucial part of VistaKine. Aim for the following:

- **Tone:** Friendly, informative, engaging, and concise. Guide the student towards understanding complex topics in a digestible manner.
- **Audience:** Primarily high school and college students (approx. 16-25 years old). Keep the language accessible but accurate.
- **Structure:**
  - Avoid long "walls of text". Break down complex ideas into smaller paragraphs.
  - Vary sentence length to maintain a good rhythm.
  - Utilize HTML effectively:
    - Use headings (`<h2>`, `<h3>`, etc.) logically to structure content.
    - Employ lists (`<ul>`, `<ol>`) for sequential steps or related items.
    - Use `<strong>` and `<em>` for emphasis where appropriate.
- **Conciseness:** Provide valuable information efficiently. Eliminate redundant phrases or overly complex explanations.
- **Engagement:** While maintaining accuracy, make the content interesting. Occasional, subtle pop-culture references are acceptable but should be used sparingly and remain relevant.
- **Accessibility:** Ensure content structure and HTML usage support screen readers and other assistive technologies.

## Equations & Formulas (KaTeX)

- **Library:** Use the `katex` library directly for rendering LaTeX equations.
- **Implementation:** Render equations using the functional approach: `{@html katex.renderToString('LATEX_STRING', { displayMode: boolean_value })}`.
  - Import `katex` in the `<script>` section: `import katex from 'katex';`
  - Use `{ displayMode: true }` for block-level equations.
- **Escaping:** When writing LaTeX strings within the `katex.renderToString()` function in JavaScript/TypeScript:
  - Escape backslashes _once_. For example, `\vec` becomes `'\\vec'`, `\|` becomes `'\\|'`, `\langle` becomes `'\\langle'`.
- **Rationale:** While component wrappers like `svelte-katex` exist, direct use of `katex.renderToString` proved more reliable in this project for handling complex LaTeX syntax and avoiding inconsistent escaping issues encountered with component props.
- **Installation:** Ensure `katex` and its types (`@types/katex`) are installed (`npm i katex @types/katex --save-dev`).
- **Styling:** Ensure the KaTeX CSS is linked in `src/app.html` (e.g., via CDN). Apply custom styles or overrides using `src/lib/styles/_katex-custom.scss`. This file includes base font size adjustments and utility classes (`.katex-axis-x`, etc.) for colorizing parts of equations based on context (e.g., matching axis colors).

## Component Styling

- **Scoped Styles:** Styles are primarily defined within each Svelte component's `<style lang="scss">` block. This ensures encapsulation and avoids unintended global side effects.
- **`@use`:** Import necessary SCSS partials (especially `_variables.scss`) using `@use '$lib/styles/variables' as variables;`.
- **Global Styles (`app.scss`):** Contains minimal global styles, resets, font imports, and imports `main.scss`. Avoid adding component-specific styles here.
- **Props vs. Style Block:**
  - Use component props (`export let color = 'blue';`) for styles intended for easy external customization.
  - Use the `<style>` block for the component's internal base styles and structure.
  - Use the `style:` directive for applying dynamic inline styles based on props or state.

## Key Components Overview

This section highlights some of the core reusable or structural components within the project:

- **`src/lib/components/SectionTemplate.svelte`:**

  - Acts as the primary layout wrapper for individual chapter sections loaded via the dynamic `[slug]/[section]` route.
  - Receives `chapterSlug` and `sectionSlug` props to fetch and display the correct chapter/section data (title, number).
  - Renders the specific section's content via the default `{@render children()}` slot.
  - Includes the `PageNav.svelte` component for navigating between sections/chapters.
  - Manages the overall structure, placing the main content alongside the `SectionMap`.

- **`src/lib/components/ui/SectionMap.svelte`:**

  - Provides intra-section navigation based on elements marked with `data-nav-target="true"` within the slotted content of `SectionTemplate`.
  - Uses `IntersectionObserver` to detect the currently visible section based on scroll position and highlights the corresponding link.
  - Renders as a sticky sidebar on larger screens and a slide-out drawer on mobile.
  - Receives the current `sectionSlug` to dynamically find and observe targets for that specific section.

- **`src/lib/components/ContentCard.svelte`:**

  - A versatile wrapper component used to give content blocks (text, exercises, quizzes, visualizations) a consistent "card" appearance (background, border, padding, shadow).
  - Applies an optional subtle "lift" effect (`is-visible` class) when the card enters the viewport using an `IntersectionObserver` (via the `use:intersect` action).
  - Accepts a `layoutWidth` prop (`'full'` or `'condensed'`) to control the maximum width of the card, allowing for different visual treatments (e.g., centering smaller interactive elements).
  - Receives content via the default `{@render children()}` slot.

- **`src/lib/components/visualization/` (Directory):**

  - This directory houses all Threlte/Three.js related components.
  - **`VisContainer.svelte`:** Often used as a standard wrapper around Threlte scenes. Provides a consistent container with potential aspect ratio control, borders, and might handle common scene setup or overlays (like fullscreen buttons, although fullscreen logic is often pushed to the specific exercise component).
  - **`elements/`:** Contains reusable 3D building blocks like `Axes.svelte`, `Grid.svelte`, `Ground.svelte`.
  - **`interactions/`:** Holds complex interactive exercises built with Threlte, combining scenes, UI/HUDs, and state management. Examples include `printer-calibration/` and `vector-builder/`.
  - **`scenes/`:** Contains specific, self-contained Threlte scenes that might be used within exercises or directly in content.

- **`src/lib/components/visualization/interactions/printer-calibration/PrinterCalibrationExercise.svelte`:**

  - A self-contained interactive exercise component.
  - Uses `VisContainer` to wrap the `PrinterCalibrationScene.svelte` (the actual Threlte scene).
  - Renders the `PrinterCalibrationHud.svelte` and `NozzleControlPanel.svelte` as screen-space UI overlays (using absolute positioning or Threlte's `<HTML>` component for fullscreen compatibility).
  - Manages the exercise's state (current stage, target completion, nozzle position) often interacting with dedicated Svelte stores (e.g., `calibrationState.ts`).
  - Handles its own fullscreen logic for the entire exercise wrapper.
  - Communicates completion status via events or state changes.

- **`src/lib/components/visualization/interactions/vector-builder/` (Directory):**
  - Contains the components comprising the interactive Vector Builder exercise.
  - **`VectorBuilderExercise.svelte`:** The main component, orchestrating the scene, HUD, and state.
  - **`VectorBuilderScene.svelte`:** The Threlte scene displaying the 3D vector, axes, grid, and visual feedback.
  - **`VectorBuilderHud.svelte`:** The screen-space overlay containing input/output panels.
  - **`VectorInputPanel.svelte` / `VectorOutputPanel.svelte`:** Sub-components for the HUD, managing user input and displaying vector data.
  - **`vectorBuilderState.ts` (Store):** Manages the reactive state for the vector's start/end points, components, magnitude, validation, etc.

## Utility Classes (`_utilities.scss`)

- Provides common helper classes (e.g., `.visually-hidden`, `.centered-flex`). Kept minimal to encourage component-based styling.

## Naming Conventions

- **CSS Classes:** Use kebab-case (e.g., `.accordion-header`).
- **Component Prefix:** While not strictly enforced, prefixing classes specific to a complex component can help (e.g., `.vector-builder-input`).
- **State Classes:** Use descriptive names for state (e.g., `.is-active`, `.is-dragging`, `.invalid`).

## Responsiveness

- **Fluid First:** Utopia fluid scales handle much of the responsiveness intrinsically.
- **Breakpoints:** Defined in `_variables.scss` (`$breakpoint-sm`, `$breakpoint-md`, etc.). Use them in `@media` queries for layout changes that fluid scaling can't handle alone.
  - `@media (max-width: variables.$breakpoint-lg) { ... }`
- **Mobile Focus:** Ensure layouts reflow sensibly on smaller screens. Test interactive elements for usability. The main layout (`+layout.svelte`) handles the primary mobile navigation pattern.

## Accessibility (A11y)

- **Semantic HTML:** Use appropriate HTML elements (`<nav>`, `<button>`, `<main>`, headings, etc.).
- **ARIA:** Use ARIA attributes where necessary, especially for custom interactive components (e.g., `role="button"`, `aria-expanded` for accordions).
- **Focus Management:** Ensure clear `:focus-visible` styles (defined globally or per-component) for keyboard navigation.
- **Color Contrast:** Verify text and UI elements meet contrast requirements, considering both light and dark modes.
- **Labels:** Ensure all inputs and controls have associated labels (`<label for="...">` or `aria-label`).

## Performance

- **Minimize Specificity:** Keep CSS selectors as simple as possible.
- **Avoid Deep Nesting:** Limit SCSS nesting depth to maintain readability and performance.
- **Leverage CSS Variables:** Efficient for theming and dynamic style changes.
- **`will-change`:** Use sparingly and only when necessary for performance-critical animations.
- **Code Splitting:** SvelteKit handles automatic code splitting by route. The section-based chapter structure further enhances this.

## Chapter & Section Styling

- **Section Components:** Most chapter content resides in section-specific components (e.g., `src/lib/content/chapters/understanding-3d-space/sections/CoordinateSystems.svelte`). Styling related to a specific section should be within that component.
- **`chapter-styles.scss`:** Contains _minimal_ base styles shared across most chapter/section contexts (e.g., `.readable-content` definition, maybe base link styles).
- **Theme Application:** Chapter theme colors (`--chapter-color-X`, etc.) are typically applied at a higher level (e.g., in the `[slug]/[section]/+page.svelte` or a layout component wrapping sections) using inline `style` attributes or by adding a theme class (e.g., `class="chapter-theme-1"`) to a container element. Components within the chapter should then inherit or use these variables.
- **Consistency:** Aim for consistent application of spacing (`--component-space`, `--section-space`), card styling, and typography across different chapter components.

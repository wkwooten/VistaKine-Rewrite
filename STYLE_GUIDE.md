# VistaKine Style Guide

This document outlines the CSS architecture, conventions, and best practices for the VistaKine project.

## File Structure

```
src/
├── lib/
│   ├── styles/
│   │   ├── _animations.scss     # Animation utilities and keyframes
│   │   ├── _grid.scss           # Simplified grid system
│   │   ├── _reset.scss          # CSS reset/normalize
│   │   ├── _spacing.scss        # Spacing utilities and variables
│   │   ├── _typography.scss     # Typography styles and scale
│   │   ├── _utilities.scss      # Utility classes
│   │   ├── _variables.scss      # Global variables
│   │   ├── chapter-styles.scss  # Chapter-specific styles
│   │   └── main.scss            # Main stylesheet that imports partials
│   └── components/              # Svelte components
├── routes/                      # Svelte routes
│   ├── chapter/                 # Chapter pages
│   └── +layout.svelte           # Main app layout (uses Flexbox)
└── app.scss                     # Global app styles
```

## Layout System

### Main Application Layout

The main application uses a Flexbox-based layout:

- `.app-container`: Uses `display: flex` for the main sidebar + content layout
- `.navigation`: Uses `flex-shrink: 0` with explicit width for the sidebar
- `.content`: Uses `flex-grow: 1` to take up remaining space

### Content Structure

For consistent content layout:

- `.container`: Centers content with a max-width and horizontal padding
  - Located in `_grid.scss`
  - Controls overall site width constraints
  - Applied at the top level of page content within `<main class="content">`

- `.readable-content`: Optimizes text readability
  - Located in `chapter-styles.scss`
  - Sets an optimal width for reading (70ch)
  - Used for wrapping text content blocks within chapter sections
  - Contains proper spacing and line height for text readability

### Grid System

The grid system has been simplified:

- `.container`: For centered, width-constrained content
- `.auto-grid`: For responsive, auto-fitting grid layouts (like cards)

## Core Concepts

### Variables

Variables are defined in `_variables.scss` and exported as CSS custom properties:

```scss
// SCSS variable
$primary-color: #3b82f6;

// CSS custom property
:root {
  --primary-color: #{$primary-color};
}
```

Key variable categories:
- Colors (primary, text, background, brand colors)
- Typography (font families, sizes)
- Spacing
- Dimensions (content widths, sidebar widths)
- Transitions
- Shadows
- Border radius

### Spacing

Spacing follows a consistent scale:

- Uses a fluid spacing scale with variables like `--space-xs`, `--space-s`, `--space-m`, etc.
- Prefer these variables over arbitrary pixel values

### Typography

- Font families: `--font-family-base` for body text, `--font-family-heading` for headings
- Font scale: Uses CSS variables with a fluid type scale

## Component Styling

- Component styles should be placed in the component's `<style>` block
- Use SCSS syntax for nesting and other features
- Import global variables with `@use` when needed
- Prefer local component styles over global styles when possible

## Utility Classes

- Located in `_utilities.scss`
- Should be minimal and focused on common needs
- Examples: `.visually-hidden`, `.centered`

## Naming Conventions

- Use kebab-case for CSS classes: `.example-class`
- Use descriptive, purpose-based names: `.card-header` instead of `.blue-text`
- Component-specific classes should start with the component name: `.chapter-header`

## Responsiveness

- Mobile-first approach
- Use media queries based on breakpoint variables:
  ```scss
  @media (max-width: variables.$breakpoint-md) {
    // Styles for medium screens and below
  }
  ```
- Key breakpoints:
  - `$breakpoint-sm`: 640px
  - `$breakpoint-md`: 768px
  - `$breakpoint-lg`: 1024px
  - `$breakpoint-xl`: 1280px

## Accessibility

- Ensure sufficient color contrast
- Use semantic HTML
- Include focus styles (`:focus-visible`)
- Test with keyboard navigation

## Performance

- Minimize CSS specificity
- Avoid deep nesting
- Prefer CSS variables for theming
- Use `will-change` sparingly

## Chapter Styling

Chapter content follows a specific structure:

- `.chapter-wrapper`: Wrapper for entire chapter content
- `.chapter-header`: Chapter title and intro section
- `.content-section`: Individual chapter sections
- `.readable-content`: Wrapper for optimal reading width
- Use theme classes (e.g., `.chapter-1-theme`) for chapter-specific styling

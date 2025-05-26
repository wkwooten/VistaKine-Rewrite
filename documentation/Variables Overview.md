# VistaKine Variables Overview

## Core Palette

// Purpose: Base colors for UI structure, text, and backgrounds.

| Variable                     | Value          | Description                                       |
| ---------------------------- | -------------- | ------------------------------------------------- |
| `$color-background`          | `#f0f8ff`      | Main page background                              |
| `$color-surface`             | `#fefeff`      | Card/Sidebar/distinct element backgrounds         |
| `$color-text-primary`        | `#1f2937`      | Primary text color                                |
| `$color-text-secondary`      | `#37474F`      | Lighter text for secondary info (kept from brand) |
| `$color-white`               | `#ffffff`      |                                                   |
| `$color-text-inverted-light` | `$color-white` | Value for light mode                              |
| `$parallax-background-color` | `#1e65c821`    |                                                   |

## Accent Palette

// Purpose: Interactive elements, highlights, calls to action.

| Variable                  | Value                             | Description                                               |
| ------------------------- | --------------------------------- | --------------------------------------------------------- |
| `$color-accent`           | `#004d9f`                         | Primary interactive color (was \$brand-primary)           |
| `$color-border`           | `rgba($color-accent, 0.2)`        | Default border color                                      |
| `$color-border-light`     | `rgba($color-border, 0.2)`        | Subtle borders/dividers                                   |
| `$color-accent-hover`     | `#1565C0`                         | Hover state for accent elements (was \$brand-accent-dark) |
| `$color-accent-light`     | `#64B5F6`                         | Lighter accent variation (was \$brand-accent)             |
| `$color-accent-active-bg` | `rgba($color-accent, 0.08)`       | Background for active state (was \$brand-active-bg)       |
| `$color-accent-hover-bg`  | `rgba($color-accent-light, 0.15)` | Background for hover state (was \$brand-hover-bg)         |

## Functional Colors

// Purpose: Specific UI states like success, error, warnings.

| Variable                   | Value                     | Description                                     |
| -------------------------- | ------------------------- | ----------------------------------------------- |
| `$color-success`           | `#10b981`                 |                                                 |
| `$color-error`             | `#d32f2f`                 |                                                 |
| `$color-error-bg`          | `rgba($color-error, 0.1)` |                                                 |
| `$color-error-border`      | `rgba($color-error, 0.3)` |                                                 |
| `$color-text-on-dark`      | `#F0F8FF`                 | Text used on dark/accent backgrounds            |
| `$color-google-blue`       | `#4285F4`                 |                                                 |
| `$color-google-blue-hover` | `#357AE8`                 |                                                 |
| `$color-apple-black`       | `#000000`                 |                                                 |
| `$color-apple-black-hover` | `#1a1a1a`                 | A slightly lighter black or dark grey for hover |
| `$color-apple-white`       | `#ffffff`                 |                                                 |

## Axis Colors

// (Used, Keep As Is)

| Variable            | Value                       | Description                          |
| ------------------- | --------------------------- | ------------------------------------ |
| `$axis-color-x`     | `#B71C1C`                   | Darker Red for light mode contrast   |
| `$axis-color-y`     | `#1B5E20`                   | Darker Green for light mode contrast |
| `$axis-color-z`     | `#0D47A1`                   | Darker Blue for light mode contrast  |
| `$axis-color-x-t75` | `rgba($axis-color-x, 0.75)` |                                      |
| `$axis-color-y-t75` | `rgba($axis-color-y, 0.75)` |                                      |
| `$axis-color-z-t75` | `rgba($axis-color-z, 0.75)` |                                      |
| `$axis-color-x-t50` | `rgba($axis-color-x, 0.5)`  |                                      |
| `$axis-color-y-t50` | `rgba($axis-color-y, 0.5)`  |                                      |
| `$axis-color-z-t50` | `rgba($axis-color-z, 0.5)`  |                                      |
| `$axis-color-x-t25` | `rgba($axis-color-x, 0.25)` |                                      |
| `$axis-color-y-t25` | `rgba($axis-color-y, 0.25)` |                                      |
| `$axis-color-z-t25` | `rgba($axis-color-z, 0.25)` |                                      |

## Typography

| Variable                 | Value                         | Description |
| ------------------------ | ----------------------------- | ----------- |
| `$font-family-base`      | `'IBM Plex Sans', sans-serif` |             |
| `$font-family-heading`   | `'Titillium Web', sans-serif` |             |
| `$font-family-monospace` | `'IBM Plex Mono', monospace`  |             |

## Breakpoints

// (matching Utopia setup)

| Variable          | Value    | Description |
| ----------------- | -------- | ----------- |
| `$min-viewport`   | `300px`  |             |
| `$max-viewport`   | `1240px` |             |
| `$breakpoint-sm`  | `640px`  |             |
| `$breakpoint-md`  | `768px`  |             |
| `$breakpoint-lg`  | `1024px` |             |
| `$breakpoint-xl`  | `1280px` |             |
| `$breakpoint-2xl` | `1536px` |             |

## Transitions

// Match with \_animations.scss

| Variable             | Value                          | Description |
| -------------------- | ------------------------------ | ----------- |
| `$transition-fast`   | `150ms`                        |             |
| `$transition-normal` | `250ms`                        |             |
| `$transition-slow`   | `350ms`                        |             |
| `$transition-slower` | `500ms`                        |             |
| `$transition-bezier` | `cubic-bezier(0.4, 0, 0.2, 1)` |             |

## Dimensions

| Variable                       | Value                | Description                                                 |
| ------------------------------ | -------------------- | ----------------------------------------------------------- |
| `$max-content-width`           | `1000px`             |                                                             |
| `$wide-content-width`          | `1400px`             |                                                             |
| `$section-map-width`           | `320px`              |                                                             |
| `$readable-max-width`          | `70ch`               | Optimal reading width (ch units are width of "0" character) |
| `$sidebar-width`               | `400px`              |                                                             |
| `$sidebar-collapsed-width`     | `80px`               |                                                             |
| `$sidebar-width-full`          | `300px`              | Consider consolidating with \$sidebar-width                 |
| `$sidebar-width-mini`          | `100px`              |                                                             |
| `$sidebar-transition-duration` | `$transition-normal` |                                                             |
| `$sidebar-transition-timing`   | `$transition-bezier` |                                                             |

## Shadows

| Variable        | Value                                   | Description                                     |
| --------------- | --------------------------------------- | ----------------------------------------------- |
| `$shadow-color` | `rgb(9, 4, 48)`                         | Define the natural shadow base color            |
| `$shadow-sm`    | `0 2px 4px rgba($shadow-color, 0.05)`   | Was rgba(9, 4, 48, 0.05) - effectively the same |
| `$shadow-md`    | `0 2px 10px rgba($shadow-color, 0.05)`  | Was rgba(0, 0, 0, 0.05)                         |
| `$shadow-lg`    | `0 4px 15px rgba($shadow-color, 0.1)`   | Was rgba(0, 0, 0, 0.1)                          |
| `$shadow-xl`    | `0 10px 25px rgba($shadow-color, 0.15)` | Was rgba(0, 0, 0, 0.25)                         |

## UI States

| Variable                | Value     | Description |
| ----------------------- | --------- | ----------- |
| `$state-selected-color` | `#007bff` |             |

## Border Radius

// Migrated from old variables

| Variable        | Value    | Description |
| --------------- | -------- | ----------- |
| `$radius-xs`    | `2px`    |             |
| `$radius-sm`    | `4px`    |             |
| `$radius-md`    | `6px`    |             |
| `$radius-lg`    | `8px`    |             |
| `$radius-xl`    | `12px`   |             |
| `$radius-round` | `50%`    |             |
| `$radius-pill`  | `9999px` |             |

## Scene element colors (light)

| Variable                          | Value                 | Description |
| --------------------------------- | --------------------- | ----------- |
| `$scene-grid-cell-color-light`    | `#ADD8E6`             |             |
| `$scene-grid-section-color-light` | `$color-accent-light` | #64B5F6     |
| `$scene-ground-color-light`       | `#e0e0e0`             |             |

## Calibration Scene Specific (Light)

| Variable                                    | Value          | Description |
| ------------------------------------------- | -------------- | ----------- |
| `$calibration-nozzle-color-light`           | `#4682b4`      | steelblue   |
| `$calibration-nozzle-edges-color-light`     | `#ADD8E6`      |             |
| `$calibration-height-indicator-color-light` | `#ADD8E6`      |             |
| `$calibration-bed-color-light`              | `$color-white` | white       |
| `$calibration-bed-edges-color-light`        | `#ADD8E6`      |             |
| `$calibration-target-pending-color-light`   | `#FFA500`      | orange      |
| `$calibration-target-hit-color-light`       | `#32CD32`      | limegreen   |

## Vector Builder Colors (Light)

| Variable                            | Value                 | Description |
| ----------------------------------- | --------------------- | ----------- |
| `$vector-color`                     | `#8f2fd3`             |             |
| `$vector-builder-start-color-light` | `$color-accent`       |             |
| `$vector-builder-end-color-light`   | `$color-accent-hover` |             |

## Character Colors

| Variable             | Value     | Description |
| -------------------- | --------- | ----------- |
| `$surya-color-light` | `#0D9488` | Teal 600    |
| `$leo-color-light`   | `#1E40AF` | Blue 800    |

## Dark Mode Palette (Midnight Purple Theme)

### Core Dark

| Variable                                | Value                                 | Description                                                  |
| --------------------------------------- | ------------------------------------- | ------------------------------------------------------------ |
| `$color-dark-background`                | `#1a1a2e`                             | Very dark desaturated midnight blue/purple                   |
| `$color-dark-surface`                   | `#2a2844`                             | Slightly lighter dark purple for cards/sidebars              |
| `$color-dark-text-primary`              | `#f0f8ff`                             | AliceBlue (re-using light bg) - very light for high contrast |
| `$color-dark-text-secondary`            | `#a0a0c0`                             | Desaturated light purple/grey for secondary text             |
| `$color-dark-border`                    | `#4d4a6d`                             | Muted purple/grey border                                     |
| `$color-dark-border-light`              | `rgba($color-dark-text-primary, 0.1)` | Very subtle divider                                          |
| `$color-dark-text-inverted-dark`        | `$color-dark-text-primary`            | Value for dark mode (using light primary text)               |
| `$color-dark-parallax-background-color` | `#1e64c813`                           |                                                              |

### Accent Dark

| Variable                       | Value                                 | Description                                    |
| ------------------------------ | ------------------------------------- | ---------------------------------------------- |
| `$color-dark-accent`           | `#66A3FF`                             | NEW - Medium-light, vibrant blue               |
| `$color-dark-accent-hover`     | `#80BFFF`                             | NEW - Lighter blue for hover                   |
| `$color-dark-accent-light`     | `#619AE6`                             | NEW - Slightly less saturated/darker blue      |
| `$color-dark-accent-active-bg` | `rgba($color-dark-accent, 0.15)`      |                                                |
| `$color-dark-accent-hover-bg`  | `rgba($color-dark-accent-hover, 0.1)` | Use the new hover color here                   |
| `$color-dark-accent-contrast`  | `#48d1cc`                             | Vibrant Cyan/Teal (Keeping this as is for now) |

### Functional Dark

| Variable                     | Value                           | Description                                               |
| ---------------------------- | ------------------------------- | --------------------------------------------------------- |
| `$color-dark-success`        | `#2ecc71`                       | Bright green                                              |
| `$color-dark-error`          | `#ff6b6b`                       | Soft, bright red/pink                                     |
| `$color-dark-error-bg`       | `rgba($color-dark-error, 0.15)` |                                                           |
| `$color-dark-error-border`   | `rgba($color-dark-error, 0.3)`  |                                                           |
| `$color-dark-text-on-dark`   | `$color-dark-text-primary`      | Primary light text works here                             |
| `$color-dark-text-on-accent` | `#111`                          | Dark text might be needed on the bright dark-mode accents |

### Axis Dark

// (Brighter versions for visibility)

| Variable                 | Value                            | Description           |
| ------------------------ | -------------------------------- | --------------------- |
| `$axis-dark-color-x`     | `#EF5350`                        | Adjusted Bright Red   |
| `$axis-dark-color-y`     | `#4CAF50`                        | Adjusted Bright Green |
| `$axis-dark-color-z`     | `#2979FF`                        | Adjusted Bright Blue  |
| `$axis-dark-color-x-t75` | `rgba($axis-dark-color-x, 0.75)` |                       |
| `$axis-dark-color-y-t75` | `rgba($axis-dark-color-y, 0.75)` |                       |
| `$axis-dark-color-z-t75` | `rgba($axis-dark-color-z, 0.75)` |                       |
| `$axis-dark-color-x-t50` | `rgba($axis-dark-color-x, 0.5)`  |                       |
| `$axis-dark-color-y-t50` | `rgba($axis-dark-color-y, 0.5)`  |                       |
| `$axis-dark-color-z-t50` | `rgba($axis-dark-color-z, 0.5)`  |                       |
| `$axis-dark-color-x-t25` | `rgba($axis-dark-color-x, 0.25)` |                       |
| `$axis-dark-color-y-t25` | `rgba($axis-dark-color-y, 0.25)` |                       |
| `$axis-dark-color-z-t25` | `rgba($axis-dark-color-z, 0.25)` |                       |

### Scene element colors (dark)

| Variable                           | Value                        | Description                     |
| ---------------------------------- | ---------------------------- | ------------------------------- |
| `$scene-grid-cell-color-dark`      | `$color-dark-text-secondary` | #a0a0c0 (Brighter for contrast) |
| `$scene-grid-section-color-dark`   | `$color-dark-accent`         | #a779e1 (Even brighter accent)  |
| `$scene-ground-color-dark`         | `#2A2844`                    | Darker purple ground center     |
| `$scene-ground-gradient-edge-dark` | `#24203d`                    | Even darker purple ground edge  |

### Calibration Scene Specific (Dark)

| Variable                                   | Value                         | Description                 |
| ------------------------------------------ | ----------------------------- | --------------------------- |
| `$calibration-nozzle-color-dark`           | `$color-dark-accent-contrast` | #48d1cc (Vibrant Cyan/Teal) |
| `$calibration-nozzle-edges-color-dark`     | `$color-dark-border`          | #4d4a6d                     |
| `$calibration-height-indicator-color-dark` | `$color-dark-border`          | #4d4a6d                     |
| `$calibration-bed-color-dark`              | `$color-dark-surface`         | #2a2844                     |
| `$calibration-bed-edges-color-dark`        | `$color-dark-border-light`    | rgba(dark-text, 0.1)        |
| `$calibration-target-pending-color-dark`   | `#072fa6`                     | gold (stands out on dark)   |
| `$calibration-target-hit-color-dark`       | `#50C878`                     | emerald (brighter green)    |

### Vector Builder Colors (Dark)

| Variable                           | Value                      | Description |
| ---------------------------------- | -------------------------- | ----------- |
| `$vector-builder-start-color-dark` | `$color-dark-accent`       |             |
| `$vector-builder-end-color-dark`   | `$color-dark-accent-hover` |             |

### Character Colors (Dark)

| Variable            | Value     | Description |
| ------------------- | --------- | ----------- |
| `$surya-color-dark` | `#5EEAD4` | Teal 300    |
| `$leo-color-dark`   | `#93C5FD` | Blue 300    |

## Color Palettes

```palette
#3b82f6
#1f2937
#F0F8FF
#f9fafb
#1565C0
#1E88E5
#64B5F6
#212121
#37474F
#d32f2f
```

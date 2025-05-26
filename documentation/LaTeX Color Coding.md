**Future Enhancement: Custom LaTeX Colors for Equations**

*   **Goal:** Enhance equation readability and theme consistency by color-coding terms using colors derived from the site's CSS variables (e.g., `--primary-color`, `--chapter-color`).
*   **Challenge:** KaTeX processes LaTeX strings *before* the browser applies CSS variables, so `\textcolor{var(--primary-color)}{...}` won't work directly.
*   **Potential Solution:** Investigate methods to define custom LaTeX colors (e.g., using `\definecolor`) dynamically based on the current theme's CSS variables, possibly involving some JavaScript preprocessing or build-step magic.
*   **Consideration:** Need a clear, semantic color-coding strategy to avoid visual clutter, especially in complex equations.
*   **Status:** Deferred until the chapter color system/variables are finalized. Currently using standard color names (`blue`, `red`, etc.) as placeholders.
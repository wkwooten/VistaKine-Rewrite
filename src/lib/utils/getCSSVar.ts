/**
 * Helper function to get the computed value of a CSS custom property.
 * Provides fallbacks for SSR or if the element isn't available.
 * @param varName The name of the CSS variable (e.g., '--color-primary').
 * @param element The HTML element to get the computed style from (defaults to document.body).
 * @returns The variable's value as a string, or a fallback/empty string.
 */
export function getCSSVar(
	varName: string,
	element: HTMLElement | null | undefined = typeof document !== 'undefined' ? document.body : null
): string {
	if (typeof window !== 'undefined' && element) {
		try {
			return getComputedStyle(element).getPropertyValue(varName).trim();
		} catch (e) {
			console.warn(`Could not get CSS variable "${varName}"`, e);
			return ''; // Return empty string on error
		}
	}
	// Basic fallbacks for SSR - Consider expanding if more are needed
	switch (varName) {
		case '--color-surface':
			return '#fefeff';
		case '--color-text-primary':
			return '#1f2937';
		case '--color-text-secondary':
			return '#37474F';
		case '--color-error':
			return '#d32f2f';
		case '--color-accent-hover':
			return '#1565C0';
		case '--color-border':
			return '#ccc';
		default:
			return ''; // Default fallback: empty string
	}
}
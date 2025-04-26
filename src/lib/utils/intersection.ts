import { browser } from '$app/environment';

// Define the shape of the details passed to the callback
export interface IntersectDetail {
	isIntersecting: boolean;
	intersectionRatio: number;
}

// Define the shape of the options the action accepts
interface IntersectOptions extends IntersectionObserverInit {
	onIntersect?: (detail: IntersectDetail, node: HTMLElement) => void;
}

/**
 * Svelte action for intersection observer
 * Use this to detect when elements come into view
 */
export function intersect(node: HTMLElement, options: IntersectOptions = {}) {
	let observer: IntersectionObserver | null = null;
	let currentOptions = options; // Store options to access callback

	const defaultOptions: IntersectionObserverInit = {
		root: null,
		rootMargin: '0px',
		threshold: 0.5
	};

	if (browser) {
		// Separate observer options from our custom onIntersect callback
		const { onIntersect, ...observerOptions } = currentOptions;
		const mergedObserverOptions = { ...defaultOptions, ...observerOptions };

		observer = new IntersectionObserver((entries) => {
			const entry = entries[0];
			const detail: IntersectDetail = {
				isIntersecting: entry.isIntersecting,
				intersectionRatio: entry.intersectionRatio
			};
			// Call the callback directly if provided, passing the node
			if (typeof onIntersect === 'function') {
				onIntersect(detail, node);
			}
			// Removed node.dispatchEvent
		}, mergedObserverOptions);

		observer.observe(node);
	}

	return {
		destroy() {
			if (observer) {
				observer.disconnect();
			}
		},
		update(newOptions: IntersectOptions) {
			currentOptions = newOptions; // Update stored options
			if (observer) {
				observer.disconnect();
				// Separate observer options from our custom onIntersect callback
				const { onIntersect, ...observerOptions } = currentOptions;
				const mergedObserverOptions = { ...defaultOptions, ...observerOptions };

				observer = new IntersectionObserver((entries) => {
					const entry = entries[0];
					const detail: IntersectDetail = {
						isIntersecting: entry.isIntersecting,
						intersectionRatio: entry.intersectionRatio
					};
					// Call the callback directly if provided, passing the node
					if (typeof onIntersect === 'function') {
						onIntersect(detail, node);
					}
					// Removed node.dispatchEvent
				}, mergedObserverOptions);
				observer.observe(node);
			}
		}
	};
}
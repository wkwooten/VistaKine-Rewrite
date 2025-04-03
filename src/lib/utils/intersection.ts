import { browser } from '$app/environment';

/**
 * Svelte action for intersection observer
 * Use this to detect when elements come into view
 */
export function intersect(node: HTMLElement, options: IntersectionObserverInit = {}) {
	let observer: IntersectionObserver | null = null;

	const defaultOptions: IntersectionObserverInit = {
		root: null,
		rootMargin: '0px',
		threshold: 0.5
	};

	if (browser) {
		observer = new IntersectionObserver((entries) => {
			const entry = entries[0];
			node.dispatchEvent(new CustomEvent('intersect', {
				detail: {
					isIntersecting: entry.isIntersecting,
					intersectionRatio: entry.intersectionRatio
				}
			}));
		}, { ...defaultOptions, ...options });

		observer.observe(node);
	}

	return {
		destroy() {
			if (observer) {
				observer.disconnect();
			}
		},
		update(newOptions: IntersectionObserverInit) {
			if (observer) {
				observer.disconnect();
				const updatedOptions = { ...defaultOptions, ...newOptions };
				observer = new IntersectionObserver((entries) => {
					const entry = entries[0];
					node.dispatchEvent(new CustomEvent('intersect', {
						detail: {
							isIntersecting: entry.isIntersecting,
							intersectionRatio: entry.intersectionRatio
						}
					}));
				}, updatedOptions);
				observer.observe(node);
			}
		}
	};
}
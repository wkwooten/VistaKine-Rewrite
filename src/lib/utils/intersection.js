/**
 * Svelte action for intersection observer
 * Use this to detect when elements come into view
 */
export function intersect(node, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    node.dispatchEvent(new CustomEvent('intersect', {
      detail: {
        isIntersecting: entry.isIntersecting,
        intersectionRatio: entry.intersectionRatio
      }
    }));
  }, { ...defaultOptions, ...options });

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
    update(newOptions) {
      observer.disconnect();
      const updatedOptions = { ...defaultOptions, ...newOptions };
      observer.observe(node);
    }
  };
}
import { writable } from 'svelte/store';

export type PerformanceSetting = 'low' | 'medium' | 'high';

// Default to 'low' for broader compatibility initially
export const performanceSetting = writable<PerformanceSetting>('low');

// Optional: You can add functions here to easily update the setting, e.g.:
// export const setPerformanceLow = () => performanceSetting.set('low');
// export const setPerformanceMedium = () => performanceSetting.set('medium');
// export const setPerformanceHigh = () => performanceSetting.set('high');
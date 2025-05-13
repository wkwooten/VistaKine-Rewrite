import { writable } from 'svelte/store';

// Current chapter and section tracking
export const currentChapter = writable(null);
export const currentSection = writable(null);

// Sidebar state
export const sidebarExpanded = writable(false);

// User preferences
export const userPreferences = writable({
  highQualityGraphics: true,
  showCoordinateLabels: true,
  showPhysicsDebug: false
});

// Visualization state
export const visualizationState = writable({
  playing: false,
  speed: 1.0,
  showTrails: true
});
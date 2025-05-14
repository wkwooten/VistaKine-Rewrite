import { writable, type Writable } from 'svelte/store';

// Define interfaces for complex store objects
export interface UserPreferences {
  highQualityGraphics: boolean;
  showCoordinateLabels: boolean;
  showPhysicsDebug: boolean;
}

export interface VisualizationState {
  playing: boolean;
  speed: number;
  showTrails: boolean;
}

// Current chapter and section tracking
export const currentChapter: Writable<string | null> = writable(null);
export const currentSection: Writable<string | null> = writable(null);

// Sidebar state
export const sidebarExpanded: Writable<boolean> = writable(false);

// User preferences
export const userPreferences: Writable<UserPreferences> = writable({
  highQualityGraphics: true,
  showCoordinateLabels: true,
  showPhysicsDebug: false
});

// Visualization state
export const visualizationState: Writable<VisualizationState> = writable({
  playing: false,
  speed: 1.0,
  showTrails: true
});
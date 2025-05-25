import { writable } from 'svelte/store';

export type ExplorerTransformMode = 'translate' | 'rotate';

export const transformModeStore = writable<ExplorerTransformMode>('translate');
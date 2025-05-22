type AuthModalView = 'login' | 'signup';

export interface AuthModalConfig {
  reasonMessage: string;
  defaultView: AuthModalView;
}

// Internal reactive states
let isOpen = $state(false);
let reasonMessage = $state("You need an account to proceed. Please sign up or sign in.");
let defaultView = $state<AuthModalView>('signup');

// Export getters for the states
export const getIsOpen = () => isOpen;
export const getReasonMessage = () => reasonMessage;
export const getDefaultView = () => defaultView;

export function openModal(config: AuthModalConfig) {
  reasonMessage = config.reasonMessage;
  defaultView = config.defaultView;
  isOpen = true;
  console.log('[AuthModalStore] Modal opened. Config:', config, 'Current state:', { isOpen, reasonMessage, defaultView });
}

export function closeModalStore() {
  isOpen = false;
  console.log('[AuthModalStore] Modal closed.');
  // Reset to defaults after a short delay to allow animations and prevent stale state on quick reopen
  setTimeout(() => {
    if (!isOpen) { // Only reset if it hasn't been reopened immediately
        reasonMessage = "You need an account to proceed. Please sign up or sign in.";
        defaultView = 'signup';
        console.log('[AuthModalStore] State reset after timeout.');
    }
  }, 300);
}
type AuthModalView = 'login' | 'signup';

export interface AuthModalConfig {
  reasonMessage: string;
  defaultView: AuthModalView;
  redirectTo?: string;
}

// Internal reactive states
let isOpen = $state(false);
let reasonMessage = $state("You need an account to proceed. Please sign up or sign in.");
let defaultView = $state<AuthModalView>('signup');
let redirectTo = $state<string | undefined>(undefined);

// Export getters for the states
export const getIsOpen = () => isOpen;
export const getReasonMessage = () => reasonMessage;
export const getDefaultView = () => defaultView;
export const getRedirectTo = () => redirectTo;

export function openModal(config: AuthModalConfig) {
  reasonMessage = config.reasonMessage;
  defaultView = config.defaultView;
  redirectTo = config.redirectTo;
  isOpen = true;
  console.log('[AuthModalStore] Modal opened. Config:', config, 'Current state:', { isOpen, reasonMessage, defaultView, redirectTo });
}

export function closeModalStore() {
  isOpen = false;
  console.log('[AuthModalStore] Modal closed.');
  // Reset to defaults after a short delay to allow animations and prevent stale state on quick reopen
  setTimeout(() => {
    if (!isOpen) { // Only reset if it hasn't been reopened immediately
        reasonMessage = "You need an account to proceed. Please sign up or sign in.";
        defaultView = 'signup';
        redirectTo = undefined;
        console.log('[AuthModalStore] State reset after timeout.');
    }
  }, 300);
}
<script lang="ts">
  let { close }: { close: () => void } = $props();
</script>

<div class="account-modal-overlay" onclick={close}>
  <div class="account-modal-content" onclick={(e) => e.stopPropagation()}>
    <header>
      <h2>Account</h2>
      <button class="close-button" onclick={close} aria-label="Close modal">
        &times; <!-- Recommended for close icons -->
      </button>
    </header>
    <div class="modal-body">
      <p>User profile information and settings will go here.</p>
      <ul>
        <li><a href="/profile">View Profile</a></li>
        <li><a href="/settings">Account Settings</a></li>
        <li><button class="logout-button">Sign Out</button></li>
      </ul>
    </div>
    <footer>
      <button class="button-secondary" onclick={close}>Close</button>
    </footer>
  </div>
</div>

<style lang="scss">
  .account-modal-overlay {
    position: fixed;
    inset: 0;
    background-color: var(--color-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; // Ensure it's above other content
    padding: var(--space-s);
  }

  .account-modal-content {
    background-color: var(--color-surface);
    color: var(--color-text);
    padding: var(--space-l);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    width: 100%;
    max-width: 500px; // Sensible default max-width
    display: flex;
    flex-direction: column;
    gap: var(--space-m);

    animation:
      fadeIn 0.2s ease-out,
      slideIn 0.2s ease-out;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-border-soft);
    padding-bottom: var(--space-s);

    h2 {
      margin: 0;
      font-size: var(--step-2);
      color: var(--color-heading);
    }
  }

  .close-button {
    background: none;
    border: none;
    font-size: var(--step-2);
    color: var(--color-text-muted);
    cursor: pointer;
    padding: var(--space-3xs);
    line-height: 1;

    &:hover {
      color: var(--color-text);
    }
  }

  .modal-body {
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-s);

      li a,
      li button.logout-button {
        display: block;
        padding: var(--space-xs) var(--space-s);
        text-decoration: none;
        color: var(--color-text);
        border-radius: var(--radius-md);
        transition: background-color 0.2s ease;

        &:hover {
          background-color: var(--color-surface-hover);
          color: var(--color-accent-hover); // Or a more specific hover color
        }
      }

      li button.logout-button {
        width: 100%;
        text-align: left;
        background-color: transparent;
        border: none;
        cursor: pointer;
      }
    }
  }

  footer {
    border-top: 1px solid var(--color-border-soft);
    padding-top: var(--space-s);
    display: flex;
    justify-content: flex-end;
  }

  // Utopia-inspired button styling (example - adapt as needed)
  .button-secondary {
    background-color: var(--color-surface-strong);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    padding: var(--space-xs) var(--space-m);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-surface-hover);
    }
  }

  .logout-button {
    // Ensure it looks distinct, perhaps more like a destructive action
    &:hover {
      background-color: var(
        --color-error-bg,
        var(--color-surface-hover)
      ) !important;
      color: var(--color-error-text, var(--color-accent-hover)) !important;
    }
  }

  // Animations (optional, but nice for modals)
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
    }
    to {
      transform: translateY(0);
    }
  }
</style>

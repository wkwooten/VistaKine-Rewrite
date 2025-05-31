<script lang="ts">
  import Button from "$lib/components/auth/Button.svelte";
  import FormField from "$lib/components/auth/FormField.svelte";
  import SocialSignInButtons from "$lib/components/auth/SocialSignInButtons.svelte";
  import { supabase } from "$lib/supabaseClient";
  import { X } from "lucide-svelte";
  import {
    closeModalStore,
    getRedirectTo,
  } from "$lib/stores/authModalStore.svelte.ts";
  import { fade, fly } from "svelte/transition";
  import { goto } from "$app/navigation";

  type ModalView = "login" | "signup";

  let {
    isOpen = false,
    view: initialViewFromProps = "signup" as ModalView,
    message = "To proceed, please sign up or sign in.",
  } = $props<{
    isOpen: boolean;
    view: ModalView;
    message: string;
  }>();

  let currentView = $state<ModalView>(initialViewFromProps);

  let email = $state("");
  let password = $state("");
  let loading = $state(false);
  let showPassword = $state(false);

  let emailError = $state("");
  let passwordError = $state("");

  let capsLockOn = $state(false);

  const passwordRequirements = $state([
    { regex: /.{8,}/, text: "At least 8 characters", valid: false },
    { regex: /[A-Z]/, text: "At least one uppercase letter", valid: false },
    { regex: /[a-z]/, text: "At least one lowercase letter", valid: false },
    { regex: /[0-9]/, text: "At least one number", valid: false },
    {
      regex: /[^A-Za-z0-9]/,
      text: "At least one special character",
      valid: false,
    },
  ]);

  function handleCloseTrigger() {
    closeModalStore();
  }

  function switchToLogin() {
    currentView = "login";
    resetFormFields();
  }

  function switchToSignup() {
    currentView = "signup";
    resetFormFields();
  }

  function resetFormFields() {
    email = "";
    password = "";
    emailError = "";
    passwordError = "";
    showPassword = false;
    capsLockOn = false;
    passwordRequirements.forEach((req) => (req.valid = false));
    loading = false;
  }

  $effect(() => {
    currentView = initialViewFromProps;
    if (isOpen) {
      resetFormFields();
    }
  });

  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) emailError = "Email is required.";
    else if (!emailRegex.test(email)) emailError = "Invalid email format.";
    else emailError = "";
  }

  function validatePasswordLogin() {
    if (!password) passwordError = "Password is required.";
    else passwordError = "";
  }

  function validatePasswordSignup() {
    passwordError = "";
    let allValid = true;
    passwordRequirements.forEach((req) => {
      req.valid = req.regex.test(password);
      if (!req.valid) allValid = false;
    });
    if (!allValid && password) {
      passwordError = "Password does not meet all requirements.";
    } else if (!password && currentView === "signup") {
      passwordError = "Password is required.";
    }
  }

  function checkCapsLock(event: KeyboardEvent | FocusEvent) {
    if (typeof (event as KeyboardEvent).getModifierState === "function") {
      capsLockOn = (event as KeyboardEvent).getModifierState("CapsLock");
    }
  }

  async function handleLogin(event: SubmitEvent) {
    event.preventDefault();
    validateEmail();
    validatePasswordLogin();
    if (emailError || passwordError) return;

    loading = true;
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    loading = false;

    if (error) {
      passwordError = error.message;
    } else {
      const redirectToPath = getRedirectTo();
      goto(redirectToPath || "/");
      handleCloseTrigger();
    }
  }

  async function handleSignUp(event: SubmitEvent) {
    event.preventDefault();
    validateEmail();
    validatePasswordSignup();
    if (emailError || passwordError) return;

    loading = true;
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    loading = false;

    if (error) {
      passwordError = error.message;
    } else if (data.user || data.session) {
      const redirectToPath = getRedirectTo();
      goto(redirectToPath || "/");
      handleCloseTrigger();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      handleCloseTrigger();
    }
  }

  let modalTitle = $derived(
    currentView === "login" ? "Sign In" : "Create Account"
  );
</script>

{#if isOpen}
  <div
    class="modal-overlay"
    transition:fade={{ duration: 200 }}
    onclick={handleCloseTrigger}
    role="dialog"
    aria-modal="true"
    aria-labelledby="auth-modal-title"
    onkeydown={handleKeydown}
  >
    <div
      class="modal-content"
      transition:fly={{ y: 20, duration: 300, delay: 50 }}
      onclick={(e) => e.stopPropagation()}
    >
      <button
        class="close-button"
        onclick={handleCloseTrigger}
        aria-label="Close modal"
      >
        <X size={24} />
      </button>
      <h2 id="auth-modal-title" class="modal-title">{modalTitle}</h2>
      <p class="modal-message">{message}</p>

      {#if currentView === "login"}
        <form onsubmit={handleLogin} class="auth-form">
          <SocialSignInButtons mode="login" />
          <div class="divider"><span>OR</span></div>
          <FormField
            id="modal-login-email"
            label="Email"
            type="email"
            bind:value={email}
            oninput={validateEmail}
            onblur={validateEmail}
            errorMessage={emailError}
            required
          />
          <FormField
            id="modal-login-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            bind:value={password}
            oninput={validatePasswordLogin}
            onblur={(e: FocusEvent) => {
              validatePasswordLogin();
              capsLockOn = false;
            }}
            onkeyup={checkCapsLock}
            onfocus={checkCapsLock}
            errorMessage={passwordError}
            required
            showPasswordToggle={true}
            bind:isPasswordVisible={showPassword}
          >
            {#snippet children()}
              {#if capsLockOn}
                <small class="caps-lock-warning">Caps Lock is ON</small>
              {/if}
            {/snippet}
          </FormField>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !!(emailError || passwordError)}
          >
            {#if loading}Loading...{:else}Sign In{/if}
          </Button>
        </form>
        <p class="switch-view-text">
          Don't have an account? <button
            class="link-button"
            onclick={switchToSignup}>Sign Up</button
          >
        </p>
      {:else if currentView === "signup"}
        <form onsubmit={handleSignUp} class="auth-form">
          <SocialSignInButtons mode="signup" />
          <div class="divider"><span>OR</span></div>
          <FormField
            id="modal-signup-email"
            label="Email"
            type="email"
            bind:value={email}
            oninput={validateEmail}
            onblur={validateEmail}
            errorMessage={emailError}
            required
          />
          <FormField
            id="modal-signup-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            bind:value={password}
            oninput={validatePasswordSignup}
            onblur={(e: FocusEvent) => {
              validatePasswordSignup();
              capsLockOn = false;
            }}
            onkeyup={(e: KeyboardEvent) => checkCapsLock(e)}
            onfocus={(e: FocusEvent) => checkCapsLock(e)}
            errorMessage={passwordError}
            required
            showPasswordToggle={true}
            bind:isPasswordVisible={showPassword}
          />
          <div class="password-requirements-container">
            <div class="password-requirements">
              <ul>
                {#each passwordRequirements as req}
                  <li
                    class:valid={req.valid && password.length > 0}
                    class:neutral={password.length === 0}
                  >
                    <small>{req.text}</small>
                  </li>
                {/each}
              </ul>
            </div>
            {#if capsLockOn}
              <small class="caps-lock-warning signup-caps-warning"
                >Caps Lock is ON</small
              >
            {/if}
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={loading ||
              !!(emailError || passwordError) ||
              !passwordRequirements.every((r) => r.valid)}
          >
            {#if loading}Loading...{:else}Create Account{/if}
          </Button>
        </form>
        <p class="switch-view-text">
          Already have an account? <button
            class="link-button"
            onclick={switchToLogin}>Sign In</button
          >
        </p>
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-overlay, rgba(255, 255, 255, 0.6));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-index-modal, 10000);
    padding: var(--space-s);
  }

  .modal-content {
    background-color: var(--color-surface);
    padding: var(--space-l);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-xl);
    max-width: 500px;
    max-height: 90vh;
    overflow-y: scroll;
    width: 100%;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: var(--space-s);
    right: var(--space-s);
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: var(--space-xs);
    line-height: 1;

    &:hover {
      color: var(--color-text-primary);
    }
  }

  .modal-title {
    font-size: var(--step-2);
    font-family: var(--font-family-heading);
    color: var(--color-text-primary);
    margin-bottom: var(--space-xs);
    margin-top: 0;
    text-align: center;
  }

  .modal-message {
    font-size: var(--step-0);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-l);
    line-height: 1.6;
    text-align: center;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    width: 100%;
  }

  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: var(--space-xs) 0;
    color: var(--color-text-secondary);
    font-size: var(--step--1);

    &::before,
    &::after {
      content: "";
      flex: 1;
      border-bottom: 1px solid var(--color-border);
    }

    span {
      padding: 0 var(--space-s);
    }
  }
  .password-requirements-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-3xs);
    margin-top: calc(var(--space-m) * -1 + var(--space-3xs));
  }

  .caps-lock-warning {
    color: var(--color-warning);
    font-size: var(--step--2);
    display: block;
    text-align: left;
    padding-left: var(--space-xs);
    &.signup-caps-warning {
      margin-top: var(--space-3xs);
    }
  }

  .password-requirements {
    font-size: var(--step--1);
    color: var(--color-text-secondary);
    padding-left: var(--space-xs);

    ul {
      list-style-type: none;
      padding-left: 0;
      margin-top: var(--space-3xs);
      li {
        margin-bottom: 0;
        line-height: 1.4;
        small {
          display: inline-block;
        }
        &.valid::before {
          content: "✓ ";
          color: var(--color-success);
          margin-right: var(--space-3xs);
        }
        &:not(.valid):not(.neutral)::before {
          content: "✗ ";
          color: var(--color-error);
          margin-right: var(--space-3xs);
        }
        &.neutral::before {
          content: "• ";
          color: var(--color-text-secondary);
          margin-right: var(--space-3xs);
        }
      }
    }
  }

  .switch-view-text {
    text-align: center;
    margin-top: var(--space-m);
    font-size: var(--step--1);
  }

  .link-button {
    background: none;
    border: none;
    color: var(--color-accent);
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-size: inherit;
    font-family: inherit;

    &:hover {
      text-decoration: none;
    }
  }
</style>

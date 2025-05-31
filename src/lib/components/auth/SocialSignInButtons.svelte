<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import Button from "./Button.svelte";
  import GoogleIcon from "../icons/GoogleIcon.svelte";
  import AppleIcon from "../icons/AppleIcon.svelte";
  import { getRedirectTo } from "$lib/stores/authModalStore.svelte.ts";

  type Props = {
    mode: "login" | "signup";
  };

  let { mode }: Props = $props();

  const buttonText = mode === "login" ? "Sign In" : "Sign Up";

  async function signInWithProvider(provider: "google" | "apple") {
    const originalRedirectPath = getRedirectTo();
    const supabaseCallbackUrl = `${window.location.origin}/auth/callback`;

    const options: { redirectTo?: string } = {};
    if (originalRedirectPath) {
      options.redirectTo = `${supabaseCallbackUrl}?redirectTo=${encodeURIComponent(originalRedirectPath)}`;
    } else {
      options.redirectTo = supabaseCallbackUrl; // Fallback if no specific path
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });

    if (error) {
      console.error(
        `Error signing ${mode === "login" ? "in" : "up"} with ${provider}:`,
        error.message
      );
      alert(
        `Error signing ${mode === "login" ? "in" : "up"} with ${provider}: ${error.message}`
      );
    }
    // onAuthStateChange will handle success
  }
</script>

<Button
  type="button"
  variant="google"
  onclick={() => signInWithProvider("google")}
>
  {#snippet children()}
    <GoogleIcon />
    <span>{buttonText} with Google</span>
  {/snippet}
</Button>

<Button
  type="button"
  variant="apple"
  onclick={() => signInWithProvider("apple")}
>
  {#snippet children()}
    <AppleIcon />
    <span>{buttonText} with Apple</span>
  {/snippet}
</Button>

<style lang="scss">
  /* Add any specific styles for the layout of these buttons if needed */
  /* For example, if they need to be in a row or have specific spacing */
  /* However, a common parent in the login/signup pages already handles flex direction column */
</style>

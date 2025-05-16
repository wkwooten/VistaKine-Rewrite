import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

if (!PUBLIC_SUPABASE_URL) {
  throw new Error("VITE_SUPABASE_URL is not defined. Did you forget to add it to .env or prefix with PUBLIC_?");
}

if (!PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("VITE_SUPABASE_ANON_KEY is not defined. Did you forget to add it to .env or prefix with PUBLIC_?");
}

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
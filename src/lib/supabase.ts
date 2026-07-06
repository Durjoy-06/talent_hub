import { createClient } from '@supabase/supabase-js';

// Access variables safely with fallbacks
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

<<<<<<< HEAD
// Check if variables are properly configured and not set to placeholder strings
const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-url.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key-here';
=======
// Treat the env vars as "configured" as long as they're non-empty strings.
// We deliberately do NOT blocklist specific values here — the dev panel's
// network round-trip is what actually proves the keys work, and a hardcoded
// blocklist will silently reject legitimate keys that happen to match an
// old placeholder string.
const isConfigured =
  typeof supabaseUrl === 'string' &&
  supabaseUrl.length > 0 &&
  typeof supabaseAnonKey === 'string' &&
  supabaseAnonKey.length > 0;
>>>>>>> pr/chat-and-local-dev-fix

// Lazy client creator helper - avoids crashing if keys are missing
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!isConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

export function isSupabaseConfigured() {
  return !!isConfigured;
}

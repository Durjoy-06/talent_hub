import { createClient } from '@supabase/supabase-js';

// এখানে আপনার .env এর একদম সঠিক নাম বসানো হয়েছে (VITE_ সহ)
// Next.js এ ব্রাউজারে কাজ করার জন্য নামের আগে NEXT_PUBLIC_ দিতে হয়।
// তবে আপনার .env এ যেহেতু VITE_ আছে, তাই আমরা NEXT_PUBLIC_VITE_ দিয়ে ধরি
const supabaseUrl = process.env.NEXT_PUBLIC_VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_VITE_SUPABASE_ANON_KEY;

const isConfigured =
  typeof supabaseUrl === 'string' &&
  supabaseUrl.length > 0 &&
  typeof supabaseAnonKey === 'string' &&
  supabaseAnonKey.length > 0;

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!isConfigured) {
    console.error("Supabase is not configured. Check your .env file.");
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

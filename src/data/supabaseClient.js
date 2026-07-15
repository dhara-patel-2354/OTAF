import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const authStorageKey = 'that-worker-auth';

// Sessions used to be persisted in localStorage, which kept workers signed in
// indefinitely. Drop any leftover token so an old browser does not keep a
// refresh token around after the move to sessionStorage.
try {
  window.localStorage.removeItem(authStorageKey);
} catch {
  // Storage can be unavailable (private mode, blocked cookies); ignore.
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
        // Sessions live in sessionStorage so closing the browser signs the
        // worker out and credentials are required again on the next visit.
        // Refreshing or navigating within the same tab stays signed in.
        storage: window.sessionStorage,
        storageKey: authStorageKey
      }
    })
  : null;

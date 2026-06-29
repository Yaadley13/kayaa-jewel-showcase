/**
 * Singleton Supabase client for server-side use.
 * Re-using one instance avoids re-initialising the client (and its internal
 * connection pool) on every server function call.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (_client) return _client;

  const url = process.env["VITE_SUPABASE_URL"];
  const key = process.env["VITE_SUPABASE_ANON_KEY"];
  if (!url || !key) throw new Error("Missing Supabase env vars");

  _client = createClient<Database>(url, key, {
    auth: {
      // Server side — no browser storage, no auto-refresh
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    db: { schema: "public" },
    global: {
      headers: {
        // Enables HTTP keep-alive so the TCP connection is reused across requests
        Connection: "keep-alive",
      },
    },
  });

  return _client;
}

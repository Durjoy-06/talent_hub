import { apiUrl } from './api';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

/**
 * Structured result returned by `runSupabaseConnectionTest`.
 *
 * `stage` tells you exactly which step failed (or succeeded):
 *   - 'config'   : env vars missing or still placeholders
 *   - 'client'   : createClient threw or returned null
 *   - 'network'  : request never reached Supabase (DNS, offline, CORS)
 *   - 'auth'     : 401 / Invalid API key
 *   - 'rls'      : RLS blocked the read (PGRST301 / permission denied)
 *   - 'schema'   : table doesn't exist or wrong name
 *   - 'query'    : any other Supabase query error
 *   - 'ok'       : everything worked
 */
export type ConnectionTestResult =
  | { ok: true; stage: 'ok'; rowCount: number; sample: Record<string, unknown> | null; elapsedMs: number }
  | { ok: false; stage: 'config'; message: string; hint: string }
  | { ok: false; stage: 'client'; message: string; hint: string }
  | { ok: false; stage: 'network'; message: string; hint: string }
  | { ok: false; stage: 'auth'; code?: string; message: string; hint: string }
  | { ok: false; stage: 'rls'; code?: string; message: string; hint: string }
  | { ok: false; stage: 'schema'; code?: string; message: string; hint: string }
  | { ok: false; stage: 'query'; code?: string; message: string; hint: string };

export interface RunConnectionTestOptions {
  /**
   * Table to query. Defaults to 'organizations'.
   * Use this to test other tables if 'organizations' is empty/blocked.
   */
  table?: string;
  /**
   * Columns to select. Defaults to '*'.
   */
  columns?: string;
  /**
   * Max rows to fetch. Defaults to 1 — we only need to prove the round-trip works.
   */
  limit?: number;
  /**
   * Skip the env-var check and force-create the client.
   * Useful when you want to test a partially-configured project.
   */
  skipConfigCheck?: boolean;
}

/**
 * Runs a multi-stage connection test against Supabase and returns a
 * structured result that can be rendered directly in the UI.
 *
 * Stages:
 *   1. config  — verify env vars are set and not placeholders
 *   2. client  — verify createClient returns a usable object
 *   3. query   — perform a minimal SELECT and classify the error if any
 */
export async function runSupabaseConnectionTest(
  options: RunConnectionTestOptions = {}
): Promise<ConnectionTestResult> {
  const { table = 'organizations', columns = '*', limit = 1 } = options;
  const startedAt = performance.now();

  // ----- Stage 1: config -----
  if (!options.skipConfigCheck && !isSupabaseConfigured()) {
    return {
      ok: false,
      stage: 'config',
      message:
        'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing, undefined, or still set to placeholder values.',
      hint:
        "Open .env.local in the project root and replace the placeholder URL/key with real values from Supabase Dashboard → Settings → API. Then restart `npm run dev` (Vite only reads .env at startup).",
    };
  }

  // ----- Stage 2: client -----
  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (err) {
    return {
      ok: false,
      stage: 'client',
      message: err instanceof Error ? err.message : String(err),
      hint: 'createClient() threw. Check that VITE_SUPABASE_URL is a valid https URL.',
    };
  }

  if (!supabase) {
    return {
      ok: false,
      stage: 'client',
      message: 'getSupabaseClient() returned null even though isSupabaseConfigured() was true.',
      hint: 'This usually means the env vars contain placeholder text. Re-check .env.local.',
    };
  }

  // ----- Stage 3: query -----
  let data: unknown = null;
  let error: { message?: string; code?: string } | null = null;

  try {
    const serverResponse = await fetch(apiUrl('/api/supabase-test'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, columns, limit })
    });
    const serverPayload = await serverResponse.json();

    if (serverPayload && serverPayload.success) {
      data = serverPayload.sample ? [serverPayload.sample] : [];
      return {
        ok: true,
        stage: 'ok',
        rowCount: serverPayload.rowCount ?? 0,
        sample: serverPayload.sample ?? null,
        elapsedMs: Math.round(performance.now() - startedAt),
      };
    }

    if (serverPayload && serverPayload.stage) {
      return {
        ok: false,
        stage: serverPayload.stage as ConnectionTestResult['stage'],
        message: serverPayload.message ?? 'Supabase test failed.',
        hint: serverPayload.hint ?? 'Check the server logs for the full error.',
        code: serverPayload.code,
      } as ConnectionTestResult;
    }
  } catch (err) {
    // Fall back to direct browser queries if the server endpoint is unavailable.
  }

  try {
    const result = await supabase
      .from(table)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .select(columns as any)
      .limit(limit);
    data = result.data;
    error = result.error;
  } catch (err) {
    // Network failures (DNS, offline, CORS) throw before Supabase can respond
    return {
      ok: false,
      stage: 'network',
      message: err instanceof Error ? err.message : String(err),
      hint: 'Check your internet connection and that VITE_SUPABASE_URL is correct (should look like https://YOUR-REF.supabase.co).',
    };
  }

  if (error) {
    return classifyQueryError(error);
  }

  const elapsedMs = Math.round(performance.now() - startedAt);
  const rows = (data as Array<Record<string, unknown>> | null) ?? [];
  return {
    ok: true,
    stage: 'ok',
    rowCount: rows.length,
    sample: rows[0] ?? null,
    elapsedMs,
  };
}

function classifyQueryError(error: { message?: string; code?: string }): ConnectionTestResult {
  const message = error.message ?? '';
  const code = error.code;

  // 401 / Invalid API key
  if (
    code === '401' ||
    /invalid api key/i.test(message) ||
    /jwt/i.test(message) && /invalid|expired/i.test(message)
  ) {
    return {
      ok: false,
      stage: 'auth',
      code,
      message,
      hint:
        'The anon key is wrong or stale. Re-copy it from Supabase Dashboard → Settings → API → "anon public" key. Watch for stray whitespace or quote characters.',
    };
  }

  // RLS / permission denied
  if (
    code === 'PGRST301' ||
    /permission denied/i.test(message) ||
    /row-level security/i.test(message) ||
    /new row violates/i.test(message)
  ) {
    return {
      ok: false,
      stage: 'rls',
      code,
      message,
      hint:
        "Connection works — Supabase is responding. Your RLS policies block the anon key. Run this in Supabase SQL Editor to allow public reads:\n\nCREATE POLICY \"public_read_organizations\" ON public.organizations FOR SELECT TO anon USING (true);",
    };
  }

  // Schema / table not found
  if (
    code === '42P01' ||
    /relation .* does not exist/i.test(message) ||
    /schema .* does not exist/i.test(message)
  ) {
    return {
      ok: false,
      stage: 'schema',
      code,
      message,
      hint:
        'The table does not exist or has a different name. Check the Table Editor in Supabase and pass the correct `table` option.',
    };
  }

  // Generic fallback
  return {
    ok: false,
    stage: 'query',
    code,
    message,
    hint: 'Unhandled Supabase error. Check the error code in the Supabase docs (https://supabase.com/docs/reference/javascript).',
  };
}
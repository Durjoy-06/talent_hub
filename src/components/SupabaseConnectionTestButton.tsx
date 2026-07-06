import React, { useState } from 'react';
import { runSupabaseConnectionTest, ConnectionTestResult } from '../lib/connectionTest';

interface EnvDebugInfo {
  urlSet: boolean;
  urlLooksReal: boolean;
  keySet: boolean;
  keyLooksReal: boolean;
  keyPrefix: string;
}

function isFailureResult(result: ConnectionTestResult): result is Extract<ConnectionTestResult, { ok: false }> {
  return result.ok === false;
}

function readEnvInfo(): EnvDebugInfo {
  const env = (import.meta as any).env ?? {};
  const url: string | undefined = env.VITE_SUPABASE_URL;
  const key: string | undefined = env.VITE_SUPABASE_ANON_KEY;
  // A "real-looking" Supabase URL ends in .supabase.co (no /rest/v1/ suffix)
  // and a "real-looking" publishable key starts with sb_publishable_ or is a
  // long JWT starting with eyJ. We only use these to colour the badge in the
  // dev panel — the real validation is the network round-trip in
  // runSupabaseConnectionTest().
  const urlLooksReal =
    typeof url === 'string' &&
    /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url);
  const keyLooksReal =
    typeof key === 'string' &&
    (key.startsWith('sb_publishable_') || key.startsWith('eyJ'));
  return {
    urlSet: typeof url === 'string' && url.length > 0,
    urlLooksReal,
    keySet: typeof key === 'string' && key.length > 0,
    keyLooksReal,
    keyPrefix: typeof key === 'string' ? key.slice(0, 12) : '',
  };
}

/**
 * Dev-only floating panel that surfaces a multi-stage Supabase connection
 * diagnostic. Render this anywhere in the app to get a one-click sanity
 * check for:
 *   1. env var presence (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
 *   2. placeholder detection (real keys vs. .env.example stubs)
 *   3. client initialization
 *   4. live SELECT against the public schema
 *
 * It does NOT auto-run on mount — the user must click "Run test". This
 * keeps the dev panel quiet and avoids throwing on the landing page.
 */
export default function SupabaseConnectionTestButton() {
  const [result, setResult] = useState<ConnectionTestResult | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const r = await runSupabaseConnectionTest();
      setResult(r);
      // Surface to console too — devs usually have it open.
      // eslint-disable-next-line no-console
      console.log('[SupabaseConnectionTest]', r);
    } catch (err) {
      setResult({
        ok: false,
        stage: 'client',
        message:
          'Test runner threw an exception: ' +
          (err instanceof Error ? err.message : String(err)),
        hint: 'See browser devtools console for the full error.',
      });
    } finally {
      setBusy(false);
    }
  };

  const envInfo = readEnvInfo();

  const stageColor: Record<ConnectionTestResult['stage'], string> = {
    ok: 'text-emerald-400',
    config: 'text-amber-400',
    client: 'text-orange-400',
    network: 'text-rose-400',
    auth: 'text-rose-400',
    rls: 'text-rose-400',
    schema: 'text-sky-400',
    query: 'text-rose-400',
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-[min(92vw,380px)] rounded-2xl border border-slate-700 bg-slate-950/95 backdrop-blur-md p-3 shadow-2xl font-mono text-[11px] text-slate-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-slate-400">
          Supabase · dev panel
        </span>
        <span
          className={`text-[10px] uppercase tracking-widest ${
            result?.ok ? 'text-emerald-400' : result ? 'text-rose-400' : 'text-slate-500'
          }`}
        >
          {result?.ok ? 'OK' : result ? 'FAIL' : 'IDLE'}
        </span>
      </div>

      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="w-full rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[11px] font-semibold py-2 px-3 transition-colors"
      >
        {busy ? 'Running…' : 'Run connection test'}
      </button>

      <div className="mt-3 space-y-1">
        <div className="flex justify-between gap-2">
          <span className="text-slate-400">VITE_SUPABASE_URL</span>
          <span
            className={
              envInfo.urlSet
                ? envInfo.urlLooksReal
                  ? 'text-emerald-400'
                  : 'text-amber-400'
                : 'text-rose-400'
            }
          >
            {envInfo.urlSet
              ? envInfo.urlLooksReal
                ? 'set (real?)'
                : 'set (placeholder)'
              : 'missing'}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-slate-400">VITE_SUPABASE_ANON_KEY</span>
          <span
            className={
              envInfo.keySet
                ? envInfo.keyLooksReal
                  ? 'text-emerald-400'
                  : 'text-amber-400'
                : 'text-rose-400'
            }
          >
            {envInfo.keySet
              ? envInfo.keyLooksReal
                ? `set (${envInfo.keyPrefix}…)`
                : 'set (placeholder)'
              : 'missing'}
          </span>
        </div>
      </div>

      {result && (
        <div className="mt-3 border-t border-slate-800 pt-2 space-y-1">
          <div className="flex justify-between gap-2">
            <span className="text-slate-400">stage</span>
            <span className={stageColor[result.stage]}>{result.stage}</span>
          </div>

          {isFailureResult(result) ? (
            <>
              <div className="text-slate-100 break-words leading-snug">
                {result.message}
              </div>
              {'code' in result && result.code && (
                <div className="text-[10px] text-slate-500">
                  code: <span className="text-slate-300">{result.code}</span>
                </div>
              )}
              <div className="text-[10px] text-slate-400 whitespace-pre-wrap leading-snug">
                {result.hint}
              </div>
            </>
          ) : (
            <div className="text-slate-100 leading-snug">
              <div>
                <span className="text-slate-400">rows:</span>{' '}
                <span className="text-emerald-300">{result.rowCount}</span>
              </div>
              <div>
                <span className="text-slate-400">elapsed:</span>{' '}
                <span className="text-slate-200">{result.elapsedMs} ms</span>
              </div>
              {result.sample && (
                <pre className="mt-1 max-h-32 overflow-auto rounded bg-slate-900 p-2 text-[10px] text-slate-300 whitespace-pre-wrap break-words">
                  {JSON.stringify(result.sample, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
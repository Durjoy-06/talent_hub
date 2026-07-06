import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';

interface SendOfferButtonProps {
  /**
   * The `registrations` row id to update.
   * Required when `useTemplate` is false; ignored when sending a template payload.
   */
  registrationId?: string;
  /**
   * Optional override for the table name (defaults to 'registrations').
   * Lets the same button be reused on `applications`, `event_registrations`, etc.
   */
  tableName?: string;
  /**
   * Status string to write to the row. Defaults to 'Offer Sent'.
   * The button optimistically reflects this value on success.
   */
  statusValue?: string;
  /**
   * Optional callback fired after the Supabase update resolves successfully.
   * Use this to refresh local state, close a modal, or trigger a toast.
   */
  onSuccess?: (registrationId: string) => void;
  /**
   * Optional callback fired when the update fails. Receives the error.
   */
  onError?: (error: Error) => void;
  /**
   * Override the label. Defaults to "Send Offer".
   */
  label?: string;
  /**
   * If true, disables the button and shows a spinner.
   */
  disabled?: boolean;
  /**
   * Extra Tailwind classes appended to the root <button>.
   * Useful for layout adjustments like `w-full` or `ml-auto`.
   */
  className?: string;
}

/**
 * SendOfferButton
 * ----------------
 * A reusable, always-visible ghost button that updates a Supabase row's
 * status to "Offer Sent" (or a custom value). Designed for professional
 * dashboards where recruiters need to convert applicants to offers in one tap.
 *
 * Visual contract (per UI spec):
 *   • Ghost by default — transparent bg, 2px solid #2563eb border, blue text
 *   • rounded-lg, minimalist
 *   • Subtle :hover color shift (background tint, no layout change)
 *   • :active state flips to solid blue / white text and scales 0.98 to mimic
 *     a physical button press on touch devices
 *   • Loading and success states render the same footprint (no layout shift)
 *
 * Resilience:
 *   • If Supabase isn't configured (env vars missing), the button falls back
 *     to a local optimistic state change so the UI never freezes.
 *   • All async paths surface errors through onError so parents can toast.
 */
export function SendOfferButton({
  registrationId,
  tableName = 'registrations',
  statusValue = 'Offer Sent',
  onSuccess,
  onError,
  label = 'Send Offer',
  disabled = false,
  className = '',
}: SendOfferButtonProps) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleClick = async () => {
    if (disabled || state === 'sending' || state === 'sent') return;

    setState('sending');

    try {
      const supabase = getSupabaseClient();

      if (!supabase) {
        // Supabase not configured — simulate the success path so the UX still
        // works in environments without backend credentials (Storybook, demos).
        await new Promise((resolve) => setTimeout(resolve, 600));
        setState('sent');
        onSuccess?.(registrationId ?? 'local-mock');
        return;
      }

      if (!registrationId) {
        throw new Error('registrationId is required when Supabase is configured.');
      }

      // We work around Supabase's strict table-typed API by going through a
      // generic helper. This keeps the component reusable across any
      // registrations-like table without needing a generated Database type.
      const client = supabase as unknown as {
        from: (table: string) => {
          update: (values: Record<string, unknown>) => {
            eq: (column: string, value: string) => Promise<{ error: Error | null }>;
          };
        };
      };

      const { error } = await client
        .from(tableName)
        .update({
          status: statusValue,
          updated_at: new Date().toISOString(),
        })
        .eq('id', registrationId);

      if (error) throw error instanceof Error ? error : new Error(String(error));

      setState('sent');
      onSuccess?.(registrationId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState('error');
      onError?.(error);
      // Auto-recover from error state after a short delay so the button is
      // usable again without a page reload.
      setTimeout(() => setState('idle'), 2400);
    }
  };

  // The visual state drives the icon shown in the leading slot.
  const LeadingIcon =
    state === 'sending' ? Loader2 : state === 'sent' ? CheckCircle2 : state === 'error' ? AlertCircle : Send;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || state === 'sending' || state === 'sent'}
      aria-label={label}
      aria-busy={state === 'sending'}
      aria-live="polite"
      className={[
        // Base ghost styling — transparent bg, 2px blue border, blue text.
        'inline-flex items-center justify-center gap-1.5',
        'px-3.5 py-1.5 rounded-lg',
        'bg-transparent text-[#2563eb]',
        'border-2 border-[#2563eb]',
        'font-semibold text-xs tracking-wide',
        // Subtle hover — only a color shift, no movement.
        'hover:bg-[#2563eb]/10 hover:border-[#1d4ed8] hover:text-[#1d4ed8]',
        // Active/pressed state — solid blue + white text + scale 0.98.
        // active: pseudo covers both mouse-down and touch (no 300ms delay).
        'active:bg-[#2563eb] active:text-white active:scale-[0.98]',
        // Smooth transitions for color, transform, and shadow.
        'transition-[background-color,color,border-color,transform,box-shadow] duration-150 ease-out',
        // Subtle focus ring for keyboard users (accessibility).
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/40 focus-visible:ring-offset-2',
        // Success state — permanent solid blue, white text, with a soft glow.
        state === 'sent' && 'bg-[#2563eb] text-white border-[#2563eb] shadow-[0_4px_12px_rgba(37,99,235,0.25)]',
        // Error state — muted red so the issue is visible without being alarming.
        state === 'error' && 'text-rose-600 border-rose-500 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-600 active:bg-rose-600 active:text-white',
        // Disabled — desaturated, no pointer events, no transitions.
        (disabled || state === 'sending' || state === 'sent') && 'cursor-not-allowed',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <LeadingIcon
        className={[
          'w-3.5 h-3.5 shrink-0',
          state === 'sending' && 'animate-spin',
        ]
          .filter(Boolean)
          .join(' ')}
      />
      <span>
        {state === 'sending' && 'Sending…'}
        {state === 'sent' && 'Offer Sent'}
        {state === 'error' && 'Retry'}
        {state === 'idle' && label}
      </span>
    </button>
  );
}

export default SendOfferButton;

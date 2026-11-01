import { CheckCircle2, XCircle } from 'lucide-react';
import { DAY_MINUTES, minutesToHHMM } from '@/domain/time';
import type { AvailabilityResult } from '@/types';

interface BookingPanelProps {
  now: string;
  start: string;
  end: string;
  onNowChange: (v: string) => void;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onCheck: () => void;
  /** Result of the last check, or null when nothing has been checked for the current input. */
  result: AvailabilityResult | null;
  /** True when no room is selected (empty filter result). */
  disabled?: boolean;
}

/** Time inputs, the check button and the Available / Unavailable result. */
export default function BookingPanel({
  now,
  start,
  end,
  onNowChange,
  onStartChange,
  onEndChange,
  onCheck,
  result,
  disabled = false,
}: BookingPanelProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <TimeField label="Current time" value={now} onChange={onNowChange} />
        <TimeField label="Start time" value={start} onChange={onStartChange} />
        <TimeField label="End time" value={end} onChange={onEndChange} />
      </div>

      <p className="mt-3 text-xs text-slate-400">
        All values are minutes since midnight (0–{DAY_MINUTES}).
      </p>

      <button
        onClick={onCheck}
        disabled={disabled}
        className="mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-600 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-300"
      >
        Check availability
      </button>

      {result && (
        <div
          role="status"
          className={`mt-6 rounded-xl border p-4 transition ${
            result.available ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.available ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            )}
            <div>
              <p
                className={`text-sm font-bold ${
                  result.available ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {result.available ? 'Available' : 'Unavailable'}
              </p>
              <p className="mt-0.5 text-sm text-slate-600">{result.reason}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface TimeFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function TimeField({ label, value, onChange }: TimeFieldProps) {
  const id = `time-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          min={0}
          max={DAY_MINUTES}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`0–${DAY_MINUTES}`}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {value === '' ? 'Empty' : minutesToHHMM(Number(value))}
      </p>
    </div>
  );
}

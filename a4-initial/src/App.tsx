import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, MapPin, CalendarClock, DoorOpen } from 'lucide-react';
import { ROOMS } from '@/data';
import { checkAvailability } from '@/availability';
import { minutesToHHMM } from '@/utils';
import type { AvailabilityResult, Room } from '@/types';

const EMPTY_RESULT: AvailabilityResult = { available: false, reason: '' };

export default function App() {
  const [roomId, setRoomId] = useState<string>(ROOMS[0].id);
  const [now, setNow] = useState<string>('540');
  const [start, setStart] = useState<string>('660');
  const [end, setEnd] = useState<string>('720');
  const [result, setResult] = useState<AvailabilityResult>(EMPTY_RESULT);
  const [hasChecked, setHasChecked] = useState(false);

  const room: Room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];

  const nowNum = Number(now);
  const startNum = Number(start);
  const endNum = Number(end);

  function handleCheck() {
    const r = checkAvailability(room, nowNum, startNum, endNum);
    setResult(r);
    setHasChecked(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-8 text-center sm:mb-12">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-200">
            <DoorOpen className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Smart Campus Room Availability
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Check whether a campus room is free for your requested time slot.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          {/* Left: Form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <CalendarClock className="h-5 w-5 text-emerald-600" />
              Check a room
            </h2>

            {/* Room selector */}
            <div className="mb-5">
              <label htmlFor="room" className="mb-1.5 block text-sm font-medium text-slate-700">
                Room
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  id="room"
                  value={roomId}
                  onChange={(e) => {
                    setRoomId(e.target.value);
                    setHasChecked(false);
                    setResult(EMPTY_RESULT);
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {ROOMS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                      {r.blocked ? ' — Blocked' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time inputs */}
            <div className="grid gap-4 sm:grid-cols-3">
              <TimeField label="Current time" value={now} onChange={setNow} />
              <TimeField label="Start time" value={start} onChange={setStart} />
              <TimeField label="End time" value={end} onChange={setEnd} />
            </div>

            <p className="mt-3 text-xs text-slate-400">
              All values are minutes since midnight (0–1440).
            </p>

            <button
              onClick={handleCheck}
              className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-600 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Check availability
            </button>

            {/* Result panel */}
            {hasChecked && (
              <div
                className={`mt-6 rounded-xl border p-4 transition ${
                  result.available
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-rose-200 bg-rose-50'
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
          </section>

          {/* Right: Room details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                <DoorOpen className="h-5 w-5 text-emerald-600" />
                Room details
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  room.blocked
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    room.blocked ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                />
                {room.blocked ? 'Blocked' : 'Open'}
              </span>
            </div>

            <div className="mb-5 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">{room.name}</p>
              <p className="mt-1 text-xs text-slate-500">
                {room.blocked
                  ? 'This room is blocked and cannot be booked at this time.'
                  : 'This room is available for booking requests.'}
              </p>
            </div>

            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Clock className="h-4 w-4 text-slate-400" />
              Existing bookings
            </h3>

            {room.bookings.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
                No existing bookings for this room.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {room.bookings.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {minutesToHHMM(b.start)} – {minutesToHHMM(b.end)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {b.start}–{b.end} min
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Fictional sample data only — no bookings are saved.
        </footer>
      </div>
    </div>
  );
}

interface TimeFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function TimeField({ label, value, onChange }: TimeFieldProps) {
  const num = Number(value);
  const valid = value !== '' && !Number.isNaN(num);
  const preview = valid ? minutesToHHMM(num) : '--:--';

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          type="number"
          min={0}
          max={1440}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0–1440"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {value === '' ? 'Empty' : preview}
      </p>
    </div>
  );
}

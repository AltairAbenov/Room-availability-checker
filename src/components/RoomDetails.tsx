import { Clock, DoorOpen } from 'lucide-react';
import { minutesToHHMM } from '@/domain/time';
import type { Room } from '@/types';

/** Read-only view of one room: open/blocked status and its existing bookings. */
export default function RoomDetails({ room }: { room: Room }) {
  const tone = room.blocked
    ? { badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500', label: 'Blocked' }
    : { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Open' };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <DoorOpen className="h-5 w-5 text-emerald-600" />
          Room details
        </h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${tone.badge}`}
        >
          <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
          {tone.label}
        </span>
      </div>

      <div className="mb-5 rounded-xl bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700">{room.name}</p>
        <p className="mt-1 text-xs text-slate-500">
          {room.capacity} seats · {room.equipment.join(', ')}
        </p>
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
          {room.bookings.map((b) => (
            <li
              key={`${b.start}-${b.end}`}
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
  );
}

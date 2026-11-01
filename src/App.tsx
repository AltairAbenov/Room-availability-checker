import { useState } from 'react';
import { CalendarClock, DoorOpen } from 'lucide-react';
import { ROOMS } from '@/data/rooms';
import { checkAvailability } from '@/domain/availability';
import { filterRooms } from '@/domain/filters';
import RoomFilter from '@/components/RoomFilter';
import BookingPanel from '@/components/BookingPanel';
import RoomDetails from '@/components/RoomDetails';
import type { AvailabilityResult, Equipment } from '@/types';

/** Owns the screen state and composes the panels; no booking or filter rules live here. */
export default function App() {
  const [attendees, setAttendees] = useState<string>('10');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [roomId, setRoomId] = useState<string>(ROOMS[0].id);
  const [now, setNow] = useState<string>('540');
  const [start, setStart] = useState<string>('660');
  const [end, setEnd] = useState<string>('720');
  // The result remembers which input produced it, so it disappears as soon as anything changes (F5).
  const [checked, setChecked] = useState<{ key: string; result: AvailabilityResult } | null>(null);

  const matching = filterRooms(ROOMS, { attendees: Number(attendees), equipment });
  // Only rooms in the filtered list can be selected: no silent fallback to a hidden room (R1).
  const room = matching.find((r) => r.id === roomId) ?? matching[0] ?? null;
  const key = room ? [room.id, now, start, end].join('|') : '';
  const result = checked && checked.key === key ? checked.result : null;

  function toggleEquipment(item: Equipment) {
    setEquipment((prev) => (prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]));
  }

  function handleCheck() {
    if (!room) return;
    setChecked({ key, result: checkAvailability(room, Number(now), Number(start), Number(end)) });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center sm:mb-12">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-200">
            <DoorOpen className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Smart Campus Room Availability
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Find a room that fits your group, then check whether it is free for your time slot.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <CalendarClock className="h-5 w-5 text-emerald-600" />
              Check a room
            </h2>

            <RoomFilter
              attendees={attendees}
              onAttendeesChange={setAttendees}
              equipment={equipment}
              onToggleEquipment={toggleEquipment}
              rooms={matching}
              selectedId={room ? room.id : null}
              onSelect={setRoomId}
            />

            <BookingPanel
              now={now}
              start={start}
              end={end}
              onNowChange={setNow}
              onStartChange={setStart}
              onEndChange={setEnd}
              onCheck={handleCheck}
              result={result}
              disabled={!room}
            />
          </section>

          {room ? (
            <RoomDetails room={room} />
          ) : (
            <section className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500 sm:p-7">
              No room selected — adjust the requirements to see matching rooms.
            </section>
          )}
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Fictional sample data only — no bookings are saved.
        </footer>
      </div>
    </div>
  );
}

import { MapPin, SearchX, Users } from 'lucide-react';
import { EQUIPMENT_OPTIONS } from '@/domain/filters';
import type { Equipment, Room } from '@/types';

interface RoomFilterProps {
  attendees: string;
  onAttendeesChange: (v: string) => void;
  equipment: Equipment[];
  onToggleEquipment: (item: Equipment) => void;
  /** Rooms that already satisfy the requirements (F1, F2). */
  rooms: Room[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Requirements (attendees, equipment) and the list of matching rooms, or an empty state (F4). */
export default function RoomFilter({
  attendees,
  onAttendeesChange,
  equipment,
  onToggleEquipment,
  rooms,
  selectedId,
  onSelect,
}: RoomFilterProps) {
  return (
    <div className="mb-6 space-y-4">
      <div>
        <label htmlFor="attendees" className="mb-1.5 block text-sm font-medium text-slate-700">
          Attendees
        </label>
        <div className="relative">
          <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="attendees"
            type="number"
            min={1}
            value={attendees}
            onChange={(e) => onAttendeesChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-medium text-slate-700">Required equipment</legend>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((item) => {
            const on = equipment.includes(item);
            return (
              <label
                key={item}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition ${
                  on ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-300 bg-white text-slate-600'
                }`}
              >
                <input type="checkbox" className="sr-only" checked={on} onChange={() => onToggleEquipment(item)} />
                {item}
              </label>
            );
          })}
        </div>
      </fieldset>

      {rooms.length === 0 ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4"
        >
          <SearchX className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-bold text-amber-800">No rooms match your requirements</p>
            <p className="mt-0.5 text-sm text-amber-700">Try fewer attendees or less equipment.</p>
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="room" className="mb-1.5 block text-sm font-medium text-slate-700">
            Room ({rooms.length} matching)
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              id="room"
              value={selectedId ?? ''}
              onChange={(e) => onSelect(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · {r.capacity} seats{r.blocked ? ' — Blocked' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

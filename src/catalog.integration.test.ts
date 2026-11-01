import { describe, it, expect } from 'vitest';
import { ROOMS } from '@/data/rooms';
import { filterRooms } from '@/domain/filters';
import { checkAvailability } from '@/domain/availability';

// Integration: real catalog -> filter -> pick a room -> availability check.
describe('Integration: catalog, filtering and availability together', () => {
  it('I-1 catalog has at least four rooms, each with id, name, capacity, equipment, blocked flag and bookings', () => {
    expect(ROOMS.length).toBeGreaterThanOrEqual(4);
    for (const r of ROOMS) {
      expect(r.id && r.name).toBeTruthy();
      expect(r.capacity).toBeGreaterThan(0);
      expect(Array.isArray(r.equipment)).toBe(true);
      expect(typeof r.blocked).toBe('boolean');
      expect(Array.isArray(r.bookings)).toBe(true);
    }
  });
  it('I-2 25 people + projector: only D-404 and B-202 match; switching between them changes the result', () => {
    const matched = filterRooms(ROOMS, { attendees: 25, equipment: ['projector'] });
    expect(matched.map((r) => r.id).sort()).toEqual(['B-202', 'D-404']);
    const lab = matched.find((r) => r.id === 'D-404')!;
    const hall = matched.find((r) => r.id === 'B-202')!;
    expect(checkAvailability(lab, 540, 900, 960).available).toBe(true); // free afternoon slot
    expect(checkAvailability(lab, 540, 660, 720).available).toBe(false); // D-404's own booking
    expect(checkAvailability(hall, 540, 900, 960).available).toBe(false); // blocked (F3)
  });
});

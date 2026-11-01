import { describe, it, expect } from 'vitest';
import { filterRooms } from './filters';
import { checkAvailability } from './availability';
import type { Room } from '@/types';

const NOW = 540;

// Fresh fixture per test.
function rooms(): Room[] {
  return [
    { id: 'S', name: 'Small', capacity: 6, equipment: ['whiteboard'], blocked: false, bookings: [] },
    { id: 'M', name: 'Medium', capacity: 20, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
    { id: 'L', name: 'Large', capacity: 120, equipment: ['projector', 'video'], blocked: true, bookings: [] },
  ];
}
const ids = (rs: Room[]) => rs.map((r) => r.id);

describe('F1: capacity filter', () => {
  it('F1-1 keeps a room whose capacity equals the attendees (boundary)', () => {
    expect(ids(filterRooms(rooms(), { attendees: 6, equipment: [] }))).toContain('S');
  });
  it('F1-2 drops a room one seat short (boundary)', () => {
    expect(ids(filterRooms(rooms(), { attendees: 7, equipment: [] }))).not.toContain('S');
  });
});

describe('F2: equipment filter', () => {
  it('F2-1 keeps a room that has every selected item', () => {
    expect(ids(filterRooms(rooms(), { attendees: 1, equipment: ['projector', 'whiteboard'] }))).toEqual(['M']);
  });
  it('F2-2 drops a room missing one selected item', () => {
    expect(ids(filterRooms(rooms(), { attendees: 1, equipment: ['projector', 'video'] }))).not.toContain('M');
  });
  it('F2-3 keeps all rooms with enough seats when no equipment is selected', () => {
    expect(ids(filterRooms(rooms(), { attendees: 1, equipment: [] }))).toEqual(['S', 'M', 'L']);
  });
});

describe('F3: blocked room', () => {
  it('F3-1 a blocked room can match the filters but is never reported available', () => {
    const matched = filterRooms(rooms(), { attendees: 100, equipment: ['video'] });
    expect(ids(matched)).toEqual(['L']);
    expect(checkAvailability(matched[0], NOW, 900, 960).available).toBe(false);
  });
});

describe('F4: no matching rooms', () => {
  it('F4-1 returns an empty list when nothing matches', () => {
    expect(filterRooms(rooms(), { attendees: 500, equipment: [] })).toEqual([]);
  });
});

describe('F5 / AC5: selected room data', () => {
  it('F5-1 the same request gives different results for different rooms (uses each room\'s own bookings)', () => {
    const [s, m] = rooms();
    expect(checkAvailability(s, NOW, 630, 690).available).toBe(true);
    expect(checkAvailability(m, NOW, 630, 690).available).toBe(false);
  });
  it('F5-2 filtering does not change the room list or any bookings', () => {
    const input = rooms();
    const before = structuredClone(input);
    filterRooms(input, { attendees: 10, equipment: ['projector'] });
    expect(input).toEqual(before);
  });
});

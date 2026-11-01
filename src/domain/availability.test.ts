import { describe, it, expect } from 'vitest';
import { checkAvailability } from './availability';
import type { Room } from '@/types';

// Fixed clock: 09:00 (540 minutes after midnight). No real Date is used.
const NOW = 540;

// Fresh fixture for every test, so one test cannot affect another.
function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: 'T-101',
    name: 'Test Room',
    capacity: 10,
    equipment: [],
    blocked: false,
    bookings: [
      { start: 600, end: 660 }, // 10:00-11:00
      { start: 780, end: 840 }, // 13:00-14:00
    ],
    ...overrides,
  };
}

describe('AC1: invalid interval and past requests', () => {
  it('AC1-1 rejects start equal to end', () => {
    expect(checkAvailability(makeRoom(), NOW, 700, 700).available).toBe(false);
  });
  it('AC1-2 rejects start after end', () => {
    expect(checkAvailability(makeRoom(), NOW, 720, 700).available).toBe(false);
  });
  it('AC1-3 rejects a request that starts in the past', () => {
    expect(checkAvailability(makeRoom(), NOW, 500, 560).available).toBe(false);
  });
  it('AC1-4 rejects a request that starts exactly now', () => {
    expect(checkAvailability(makeRoom(), NOW, 540, 580).available).toBe(false);
  });
});

describe('AC2: maximum duration 120 minutes', () => {
  it('AC2-1 accepts exactly 120 minutes', () => {
    expect(checkAvailability(makeRoom({ bookings: [] }), NOW, 900, 1020).available).toBe(true);
  });
  it('AC2-2 rejects 121 minutes', () => {
    expect(checkAvailability(makeRoom({ bookings: [] }), NOW, 900, 1021).available).toBe(false);
  });
});

describe('AC3: blocked room', () => {
  it('AC3-1 rejects any request for a blocked room', () => {
    expect(checkAvailability(makeRoom({ blocked: true, bookings: [] }), NOW, 900, 960).available).toBe(false);
  });
});

describe('AC4: overlaps', () => {
  it('AC4-1 rejects a request that overlaps an existing booking', () => {
    expect(checkAvailability(makeRoom(), NOW, 630, 700).available).toBe(false);
  });
  it('AC4-2 rejects a request that contains an existing booking', () => {
    expect(checkAvailability(makeRoom(), NOW, 590, 670).available).toBe(false);
  });
  it('AC4-3 allows a request that starts exactly when a booking ends (BUG-A)', () => {
    expect(checkAvailability(makeRoom(), NOW, 660, 720).available).toBe(true);
  });
  it('AC4-4 allows a request that ends exactly when a booking starts (BUG-A)', () => {
    expect(checkAvailability(makeRoom(), NOW, 720, 780).available).toBe(true);
  });
});

describe('AC5: result without changing booking data', () => {
  it('AC5-1 returns Available for a free slot', () => {
    const result = checkAvailability(makeRoom(), NOW, 900, 960);
    expect(result.available).toBe(true);
    expect(result.reason).toContain('available');
  });
  it('AC5-2 does not modify the bookings array when the slot is free (BUG-B)', () => {
    const room = makeRoom();
    const before = structuredClone(room.bookings);
    const ref = room.bookings;
    checkAvailability(room, NOW, 900, 960);
    expect(room.bookings).toBe(ref);
    expect(room.bookings).toEqual(before);
  });
  it('AC5-3 does not modify the bookings array when the slot is taken (BUG-B)', () => {
    const room = makeRoom();
    const before = structuredClone(room.bookings);
    checkAvailability(room, NOW, 630, 700);
    expect(room.bookings).toEqual(before);
  });
});

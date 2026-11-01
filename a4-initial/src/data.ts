import type { Room } from '@/types';

export const ROOMS: Room[] = [
  {
    id: 'A-101',
    name: 'Room A-101',
    blocked: false,
    bookings: [
      { start: 600, end: 660 },
      { start: 780, end: 840 },
    ],
  },
  {
    id: 'B-202',
    name: 'Room B-202',
    blocked: true,
    bookings: [],
  },
  {
    id: 'C-303',
    name: 'Room C-303',
    blocked: false,
    bookings: [],
  },
];

import type { Room } from '@/types';

/** Fictional catalog: no real rooms, people or bookings. */
export const ROOMS: Room[] = [
  {
    id: 'A-101',
    name: 'Seminar room A-101',
    capacity: 20,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [
      { start: 600, end: 660 },
      { start: 780, end: 840 },
    ],
  },
  {
    id: 'B-202',
    name: 'Lecture hall B-202',
    capacity: 120,
    equipment: ['projector', 'video'],
    blocked: true,
    bookings: [],
  },
  {
    id: 'C-303',
    name: 'Study room C-303',
    capacity: 6,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'D-404',
    name: 'Computer lab D-404',
    capacity: 30,
    equipment: ['projector', 'computers'],
    blocked: false,
    bookings: [{ start: 660, end: 720 }],
  },
  {
    id: 'E-505',
    name: 'Meeting room E-505',
    capacity: 12,
    equipment: ['video', 'whiteboard'],
    blocked: false,
    bookings: [{ start: 720, end: 840 }],
  },
];

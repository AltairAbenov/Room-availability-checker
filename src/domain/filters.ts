import type { Equipment, Room } from '@/types';

export const EQUIPMENT_OPTIONS: readonly Equipment[] = ['projector', 'whiteboard', 'video', 'computers'];

export interface RoomRequirements {
  attendees: number;
  equipment: readonly Equipment[];
}

/**
 * F1: capacity >= attendees. F2: room has ALL required equipment.
 * Blocked rooms are kept in the list (marked in the UI); F3 is enforced by checkAvailability.
 * Returns a new array and never changes the input rooms.
 */
export function filterRooms(rooms: readonly Room[], req: RoomRequirements): Room[] {
  return rooms.filter(
    (r) => r.capacity >= req.attendees && req.equipment.every((e) => r.equipment.includes(e)),
  );
}

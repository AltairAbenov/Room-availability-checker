export type Equipment = 'projector' | 'whiteboard' | 'video' | 'computers';

export interface Booking {
  start: number;
  end: number;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  equipment: Equipment[];
  blocked: boolean;
  bookings: Booking[];
}

export interface AvailabilityResult {
  available: boolean;
  reason: string;
}

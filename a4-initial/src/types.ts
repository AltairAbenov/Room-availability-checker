export interface Booking {
  start: number;
  end: number;
}

export interface Room {
  id: string;
  name: string;
  blocked: boolean;
  bookings: Booking[];
}

export interface AvailabilityResult {
  available: boolean;
  reason: string;
}

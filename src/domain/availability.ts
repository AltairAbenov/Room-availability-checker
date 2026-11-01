import type { AvailabilityResult, Room } from '@/types';
import { DAY_MINUTES, MAX_DURATION, minutesToHHMM } from '@/domain/time';

export function checkAvailability(
  room: Room,
  now: number,
  start: number,
  end: number,
): AvailabilityResult {
  if (Number.isNaN(now) || Number.isNaN(start) || Number.isNaN(end)) {
    return { available: false, reason: 'Please enter valid numeric values for all time fields.' };
  }

  if (now < 0 || now > DAY_MINUTES) {
    return { available: false, reason: `Current time must be between 0 and ${DAY_MINUTES}.` };
  }

  if (!(0 <= start && start < end && end <= DAY_MINUTES)) {
    return {
      available: false,
      reason: `Interval must satisfy 0 <= start < end <= ${DAY_MINUTES}.`,
    };
  }

  if (!(start > now)) {
    return {
      available: false,
      reason: 'Start time must be strictly after the current time.',
    };
  }

  if (room.blocked) {
    return { available: false, reason: `${room.name} is currently blocked and cannot be booked.` };
  }

  const duration = end - start;
  if (duration > MAX_DURATION) {
    return {
      available: false,
      reason: `Booking duration (${duration} min) exceeds the maximum of ${MAX_DURATION} minutes.`,
    };
  }

  for (const b of room.bookings) {
    const overlaps = start < b.end && b.start < end;
    if (overlaps) {
      return {
        available: false,
        reason: `Overlaps existing booking ${b.start}-${b.end} (${minutesToHHMM(b.start)}–${minutesToHHMM(b.end)}).`,
      };
    }
  }

  return {
    available: true,
    reason: `${room.name} is available from ${start}-${end} (${minutesToHHMM(start)}–${minutesToHHMM(end)}).`,
  };
}

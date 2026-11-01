import type { AvailabilityResult, Room } from '@/types';

const MAX_DURATION = 120;

export function checkAvailability(
  room: Room,
  now: number,
  start: number,
  end: number,
): AvailabilityResult {
  if (Number.isNaN(now) || Number.isNaN(start) || Number.isNaN(end)) {
    return { available: false, reason: 'Please enter valid numeric values for all time fields.' };
  }

  if (now < 0 || now > 1440) {
    return { available: false, reason: 'Current time must be between 0 and 1440.' };
  }

  if (!(0 <= start && start < end && end <= 1440)) {
    return {
      available: false,
      reason: 'Interval must satisfy 0 <= start < end <= 1440.',
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
        reason: `Overlaps existing booking ${b.start}-${b.end} (${formatHHMM(b.start)}–${formatHHMM(b.end)}).`,
      };
    }
  }

  return {
    available: true,
    reason: `${room.name} is available from ${start}-${end} (${formatHHMM(start)}–${formatHHMM(end)}).`,
  };
}

function formatHHMM(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

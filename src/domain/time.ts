/** Minutes in a day: valid times are 0..DAY_MINUTES (minutes after midnight). */
export const DAY_MINUTES = 1440;

/** Maximum allowed booking length in minutes (AC2). */
export const MAX_DURATION = 120;

/** Formats minutes after midnight as HH:MM; returns '--:--' outside 0..DAY_MINUTES. */
export function minutesToHHMM(min: number): string {
  if (Number.isNaN(min) || min < 0 || min > DAY_MINUTES) return '--:--';
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

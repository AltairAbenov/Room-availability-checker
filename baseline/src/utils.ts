export function minutesToHHMM(min: number): string {
  if (Number.isNaN(min) || min < 0 || min > 1440) return '--:--';
  const clamped = Math.min(min, 1440);
  const h = Math.floor(clamped / 60) % 24;
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

import { describe, it, expect } from 'vitest';
import { minutesToHHMM, DAY_MINUTES, MAX_DURATION } from './time';

describe('time helpers (single shared formatter)', () => {
  it('T-1 formats minutes after midnight as HH:MM', () => {
    expect(minutesToHHMM(0)).toBe('00:00');
    expect(minutesToHHMM(660)).toBe('11:00');
    expect(minutesToHHMM(785)).toBe('13:05');
  });
  it('T-2 formats the end of the day (1440) as 00:00', () => {
    expect(minutesToHHMM(DAY_MINUTES)).toBe('00:00');
  });
  it('T-3 returns --:-- for values outside 0..1440 or NaN', () => {
    expect(minutesToHHMM(-1)).toBe('--:--');
    expect(minutesToHHMM(1441)).toBe('--:--');
    expect(minutesToHHMM(Number.NaN)).toBe('--:--');
  });
  it('T-4 exposes the shared limits', () => {
    expect(DAY_MINUTES).toBe(1440);
    expect(MAX_DURATION).toBe(120);
  });
});

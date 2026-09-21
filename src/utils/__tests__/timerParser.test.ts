import { describe, it, expect } from 'vitest';
import { extractDurationSeconds } from '../timerParser';

describe('timerParser', () => {
  describe('extractDurationSeconds', () => {
    it('extracts minutes correctly', () => {
      expect(extractDurationSeconds('Sear salmon for 4 mins')).toBe(240);
      expect(extractDurationSeconds('Cook for 1 minute')).toBe(60);
      expect(extractDurationSeconds('Boil for 10 minutes')).toBe(600);
    });

    it('extracts seconds correctly', () => {
      expect(extractDurationSeconds('Wait 30 seconds')).toBe(30);
      expect(extractDurationSeconds('Hold for 1 sec')).toBe(1);
    });

    it('extracts hours correctly', () => {
      expect(extractDurationSeconds('Simmer for 1 hour')).toBe(3600);
      expect(extractDurationSeconds('Bake for 2 hrs')).toBe(7200);
    });

    it('returns null when no duration is found', () => {
      expect(extractDurationSeconds('Chop the vegetables')).toBeNull();
    });

    it('handles mixed case and weird spacing', () => {
      expect(extractDurationSeconds('Rest for 5   MiNs')).toBe(300);
    });
  });
});

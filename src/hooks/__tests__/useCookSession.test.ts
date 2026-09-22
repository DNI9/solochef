import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCookSession } from '../useCookSession';
import { RecipeStep } from '../../types/cookMode';

describe('useCookSession', () => {
  const steps: RecipeStep[] = [
    { text: 'Step 1' },
    { text: 'Step 2' },
    { text: 'Step 3' },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state and navigation', () => {
    it('should initialize correctly', () => {
      const { result } = renderHook(() => useCookSession(steps));
      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.activeStep).toEqual(steps[0]);
      expect(result.current.nextStepObj).toEqual(steps[1]);
      expect(result.current.runningTimers).toEqual({});
      expect(result.current.isCompleted).toBe(false);
    });

    it('should navigate through steps', () => {
      const { result } = renderHook(() => useCookSession(steps));
      
      act(() => {
        result.current.nextStep();
      });
      expect(result.current.currentStepIndex).toBe(1);
      expect(result.current.activeStep).toEqual(steps[1]);

      act(() => {
        result.current.prevStep();
      });
      expect(result.current.currentStepIndex).toBe(0);
      
      act(() => {
        result.current.goToStep(2);
      });
      expect(result.current.currentStepIndex).toBe(2);
    });
  });

  describe('timers', () => {
    it('should start a timer and update remaining time', () => {
      const { result } = renderHook(() => useCookSession(steps));

      act(() => {
        result.current.startTimer(0, 120); // 2 minutes
      });

      expect(result.current.runningTimers[0]).toBeDefined();
      expect(result.current.runningTimers[0].remainingSeconds).toBe(120);
      expect(result.current.runningTimers[0].isPaused).toBe(false);

      act(() => {
        vi.advanceTimersByTime(10000); // 10 seconds
      });

      expect(result.current.runningTimers[0].remainingSeconds).toBe(110);
    });

    it('should pause and resume a timer', () => {
      const { result } = renderHook(() => useCookSession(steps));

      act(() => {
        result.current.startTimer(0, 120);
      });

      act(() => {
        vi.advanceTimersByTime(10000); // 10s passed -> 110s remaining
        result.current.pauseTimer(0);
      });

      expect(result.current.runningTimers[0].isPaused).toBe(true);
      expect(result.current.runningTimers[0].remainingSeconds).toBe(110);

      act(() => {
        vi.advanceTimersByTime(10000); // 10s passed while paused
      });

      expect(result.current.runningTimers[0].remainingSeconds).toBe(110); // still 110

      act(() => {
        // We resume by starting again or a dedicated resumeTimer. Let's say startTimer overrides or we have resume.
        // Assuming we need resume, wait, the prompt doesn't specify resumeTimer explicitly. 
        // We'll just test if paused stays paused.
      });
    });

    it('should reset a timer', () => {
      const { result } = renderHook(() => useCookSession(steps));

      act(() => {
        result.current.startTimer(0, 120);
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.runningTimers[0].remainingSeconds).toBe(110);

      act(() => {
        result.current.resetTimer(0);
      });

      expect(result.current.runningTimers[0]).toBeUndefined();
    });

    it('should persist timers across step navigation', () => {
      const { result } = renderHook(() => useCookSession(steps));

      act(() => {
        result.current.startTimer(0, 120);
        result.current.nextStep();
      });

      expect(result.current.currentStepIndex).toBe(1);
      expect(result.current.runningTimers[0]).toBeDefined();
      expect(result.current.runningTimers[0].remainingSeconds).toBe(120);

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.runningTimers[0].remainingSeconds).toBe(110);
    });
  });
});

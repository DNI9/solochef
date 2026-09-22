import { useState, useEffect, useCallback } from 'react';
import { RecipeStep, RunningTimer } from '../types/cookMode';
import { getAudioContext } from '../utils/audio';

export interface CookSessionState {
  currentStepIndex: number;
  activeStep: RecipeStep;
  nextStepObj?: RecipeStep;
  runningTimers: Record<number, RunningTimer>;
  isCompleted: boolean;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  startTimer: (stepIndex: number, durationSeconds: number) => void;
  pauseTimer: (stepIndex: number) => void;
  resetTimer: (stepIndex: number) => void;
}

const EMPTY_STEP: RecipeStep = { text: '' };

export function useCookSession(steps: RecipeStep[]): CookSessionState {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [runningTimers, setRunningTimers] = useState<Record<number, RunningTimer>>({});

  const playAlarm = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.onended = () => {
          try {
            osc.disconnect();
            gain.disconnect();
          } catch {
            // ignore
          }
        };
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1);
        osc.stop(ctx.currentTime + 1);
      }
    } catch {
      // ignore
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  }, [steps.length]);

  const startTimer = useCallback((stepIndex: number, durationSeconds: number) => {
    const now = Date.now();
    setRunningTimers(prev => {
      const existing = prev[stepIndex];
      // If resuming an already paused timer
      if (existing && existing.isPaused && existing.remainingSeconds > 0) {
        return {
          ...prev,
          [stepIndex]: {
            ...existing,
            isPaused: false,
            endTime: now + existing.remainingSeconds * 1000,
          },
        };
      }

      // Starting fresh
      return {
        ...prev,
        [stepIndex]: {
          stepIndex,
          durationSeconds,
          remainingSeconds: durationSeconds,
          startTime: now,
          isPaused: false,
          endTime: now + durationSeconds * 1000,
        },
      };
    });
  }, []);

  const pauseTimer = useCallback((stepIndex: number) => {
    setRunningTimers(prev => {
      const timer = prev[stepIndex];
      if (!timer || timer.isPaused) return prev;
      return {
        ...prev,
        [stepIndex]: {
          ...timer,
          isPaused: true,
        },
      };
    });
  }, []);

  const resetTimer = useCallback((stepIndex: number) => {
    setRunningTimers(prev => {
      const next = { ...prev };
      delete next[stepIndex];
      return next;
    });
  }, []);

  // Interval to update running timers
  useEffect(() => {
    const interval = setInterval(() => {
      let triggeredAlarm = false;

      setRunningTimers(prev => {
        let changed = false;
        const now = Date.now();
        const updated: Record<number, RunningTimer> = {};

        for (const key of Object.keys(prev)) {
          const idx = Number(key);
          const timer = prev[idx];

          if (timer.isPaused) {
            updated[idx] = timer;
            continue;
          }

          if (timer.endTime) {
            const remaining = Math.max(0, Math.ceil((timer.endTime - now) / 1000));
            if (remaining !== timer.remainingSeconds) {
              changed = true;
              if (remaining === 0 && timer.remainingSeconds > 0) {
                triggeredAlarm = true;
              }
              updated[idx] = {
                ...timer,
                remainingSeconds: remaining,
              };
            } else {
              updated[idx] = timer;
            }
          } else {
            updated[idx] = timer;
          }
        }

        return changed ? updated : prev;
      });

      if (triggeredAlarm) {
        playAlarm();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [playAlarm]);

  return {
    currentStepIndex,
    activeStep: steps[currentStepIndex] || EMPTY_STEP,
    nextStepObj: steps[currentStepIndex + 1],
    runningTimers,
    isCompleted: steps.length > 0 && currentStepIndex === steps.length - 1,
    nextStep,
    prevStep,
    goToStep,
    startTimer,
    pauseTimer,
    resetTimer,
  };
}

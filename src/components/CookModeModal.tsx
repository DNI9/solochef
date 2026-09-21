'use client';
import React, { useEffect, useRef } from 'react';
import { useCookTimer } from '../hooks/useCookTimer';
import { extractDurationSeconds } from '../utils/timerParser';
import { normalizeRecipeSteps, cleanStepText } from './MealCard';

interface WakeLockSentinelLike {
  release: () => Promise<void>;
}

interface NavigatorWithWakeLock {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>;
  };
}

interface CookModeModalProps {
  meal: {
    title: string;
    recipe: string[] | string;
    [key: string]: unknown;
  } | null;
  onClose: () => void;
}

export function CookModeModal({ meal, onClose }: CookModeModalProps) {
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);

  useEffect(() => {
    let isMounted = true;

    const requestWakeLock = async () => {
      try {
        const nav = navigator as unknown as NavigatorWithWakeLock;
        if (nav.wakeLock) {
          const lock = await nav.wakeLock.request('screen');
          if (isMounted) {
            wakeLockRef.current = lock;
          } else {
            void lock.release();
          }
        }
      } catch (err) {
        console.error('Wake Lock request failed', err);
      }
    };

    if (meal) {
      requestWakeLock();
      
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          requestWakeLock();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        isMounted = false;
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (wakeLockRef.current) {
          wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
      };
    }
  }, [meal]);

  if (!meal) return null;

  const steps = normalizeRecipeSteps(meal.recipe);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="fixed inset-0 z-50 bg-white flex flex-col p-6 overflow-y-auto">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute top-4 right-4 p-2 font-bold text-zinc-500 cursor-pointer">
        Close
      </button>
      <div className="mt-10 space-y-6">
        <h2 id="modal-title" className="text-2xl font-bold">{meal.title}</h2>
        {steps.map((step, idx) => {
          const cleanText = cleanStepText(step);
          const duration = extractDurationSeconds(cleanText);
          return (
            <div key={idx} className="p-4 border rounded-xl shadow-sm">
              <p className="text-lg font-medium">{cleanText}</p>
              {duration !== null && (
                <Timer duration={duration} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Timer({ duration }: { duration: number }) {
  const { timeLeft, isRunning, start, pause, formatTime } = useCookTimer(duration);
  return (
    <div className="mt-4 flex items-center gap-4 bg-zinc-100 p-3 rounded-lg w-fit">
      <div className="font-mono text-xl tabular-nums font-bold" aria-hidden="true">
        {formatTime(timeLeft)}
      </div>
      <button 
        type="button"
        aria-label={`${isRunning ? 'Pause' : 'Start'} timer for ${formatTime(timeLeft)}`} 
        onClick={() => isRunning ? pause() : start()}
        className="px-4 py-2 bg-orange-500 text-white rounded font-bold transition-transform active:scale-95 cursor-pointer"
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
    </div>
  );
}

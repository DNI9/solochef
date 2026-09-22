'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Clock, Sparkles, Check } from 'lucide-react';
import { useCookSession } from '../hooks/useCookSession';
import { normalizeRecipeSteps, extractStepIngredients } from '../utils/recipeParser';
import { RecipeInput } from '../types/cookMode';

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
    emoji?: string;
    bg?: string;
    border?: string;
    text?: string;
    ingredients?: string[];
    recipe: RecipeInput;
    [key: string]: unknown;
  } | null;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function CookModeModal({ meal, onClose }: CookModeModalProps) {
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    let isMounted = true;

    const requestWakeLock = async () => {
      try {
        const nav = navigator as unknown as NavigatorWithWakeLock;
        if (nav.wakeLock) {
          if (wakeLockRef.current) {
            try {
              await wakeLockRef.current.release();
            } catch {
              // ignore
            }
            wakeLockRef.current = null;
          }
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
      void requestWakeLock();

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          void requestWakeLock();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        isMounted = false;
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (wakeLockRef.current) {
          void wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
      };
    }
  }, [meal]);

  const steps = useMemo(() => {
    if (!meal) return [];
    return normalizeRecipeSteps(meal.recipe);
  }, [meal]);

  const {
    currentStepIndex,
    activeStep,
    nextStepObj,
    runningTimers,
    isCompleted,
    nextStep,
    prevStep,
    goToStep,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useCookSession(steps);

  const handleNext = useCallback(() => {
    setDirection(1);
    nextStep();
  }, [nextStep]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    prevStep();
  }, [prevStep]);

  const activeIngredients = useMemo(() => {
    if (!meal?.ingredients || !activeStep) return [];
    return extractStepIngredients(activeStep.text, meal.ingredients);
  }, [activeStep, meal]);

  const nextIngredients = useMemo(() => {
    if (!meal?.ingredients || !nextStepObj) return [];
    return extractStepIngredients(nextStepObj.text, meal.ingredients);
  }, [nextStepObj, meal]);

  if (!meal || steps.length === 0) return null;

  const currentTimer = runningTimers[currentStepIndex];
  const stepDuration = activeStep?.timer;
  const isTimerRunning = currentTimer && !currentTimer.isPaused && currentTimer.remainingSeconds > 0;
  const isTimerFinished = currentTimer && currentTimer.remainingSeconds === 0;

  // Background active timers from other steps
  const backgroundTimers = Object.values(runningTimers).filter(
    t => t.stepIndex !== currentStepIndex && t.remainingSeconds > 0
  );

  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cook-mode-title"
      className="fixed inset-0 z-50 bg-zinc-50 flex flex-col justify-between overflow-hidden select-none safe-area-inset"
    >
      {/* 1. TOP HEADER */}
      <header className="bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 pt-3 pb-3 shrink-0 shadow-2xs">
        <div className="flex items-center justify-between gap-3 mb-2">
          {/* Close Button */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-zinc-500 hover:text-zinc-900 active:scale-95 transition-all rounded-full cursor-pointer"
          >
            <X size={22} strokeWidth={2.5} />
          </button>

          {/* Title & Emoji */}
          <div className="flex items-center gap-2 truncate text-center">
            <span className="text-xl" aria-hidden="true">{meal.emoji || '🍳'}</span>
            <h2 id="cook-mode-title" className="font-bold text-sm text-zinc-900 truncate">
              {meal.title}
            </h2>
          </div>

          {/* Wake Lock Status Badge */}
          <div
            role="status"
            aria-label="Screen kept awake"
            className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] font-bold px-2 py-1 rounded-full shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Screen On</span>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-3">
          <div
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Step ${currentStepIndex + 1} of ${steps.length}`}
            className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50"
          >
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-zinc-500 tabular-nums shrink-0">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>

        {/* Sticky Background Timers Tray */}
        {backgroundTimers.length > 0 && (
          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {backgroundTimers.map(t => (
              <div
                key={t.stepIndex}
                className="inline-flex items-center gap-2 bg-orange-50/90 border border-orange-200 px-2.5 py-1 rounded-lg text-xs font-bold text-orange-900 shrink-0 shadow-2xs"
              >
                <Clock size={12} className="text-orange-600 animate-spin shrink-0" />
                <span className="tabular-nums">
                  Step {t.stepIndex + 1}: {formatTime(t.remainingSeconds)}
                </span>
                <button
                  type="button"
                  onClick={() => goToStep(t.stepIndex)}
                  className="text-[10px] uppercase font-black underline text-orange-700 hover:text-orange-900 cursor-pointer ml-1"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* 2. MAIN VIEWPORT: ACTIVE STEP CARD + UP NEXT DOCK */}
      <main className="flex-1 overflow-y-auto px-4 py-3 flex flex-col justify-between gap-3 max-w-lg mx-auto w-full">
        {/* HERO ACTIVE STEP CARD (Upper 60-65%) */}
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.article
            key={currentStepIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="flex-1 bg-white rounded-3xl p-5 border border-zinc-200/90 shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Step Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-orange-800 bg-orange-100/70 border border-orange-200/70 px-2.5 py-1 rounded-md">
                  <Sparkles size={13} className="text-orange-600" />
                  <span>Active Step {currentStepIndex + 1}</span>
                </span>
                {activeStep?.timer && (
                  <span className="text-xs font-bold text-zinc-500 tabular-nums flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded-md">
                    <Clock size={12} />
                    <span>{Math.round(activeStep.timer / 60)}m action</span>
                  </span>
                )}
              </div>

              {/* Step Text (Large, Legible 22-26px typography) */}
              <p className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug mb-4 tracking-tight">
                {activeStep?.text}
              </p>

              {/* Contextual Ingredients For This Step */}
              {activeIngredients.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-600 mb-1.5">
                    Ingredients for this step:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeIngredients.map((ing, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 bg-zinc-100/90 text-zinc-800 border border-zinc-200/70 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                        <span>{ing}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* In-Situ Hero Step Timer */}
            {stepDuration !== undefined && stepDuration > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-orange-600" />
                  <span className="font-mono text-3xl sm:text-4xl font-black text-zinc-900 tabular-nums tracking-tight">
                    {formatTime(currentTimer?.remainingSeconds ?? stepDuration)}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full">
                  {!isTimerRunning && !isTimerFinished && (
                    <button
                      type="button"
                      aria-label={`Start timer for ${formatTime(stepDuration)}`}
                      onClick={() => startTimer(currentStepIndex, stepDuration)}
                      className="min-h-[48px] flex-1 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
                    >
                      <Play size={16} fill="currentColor" />
                      <span>Start Timer ({Math.round(stepDuration / 60)}m)</span>
                    </button>
                  )}

                  {isTimerRunning && (
                    <>
                      <button
                        type="button"
                        aria-label={`Pause timer for ${formatTime(currentTimer.remainingSeconds)}`}
                        onClick={() => pauseTimer(currentStepIndex)}
                        className="min-h-[48px] flex-1 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
                      >
                        <Pause size={16} fill="currentColor" />
                        <span>Pause</span>
                      </button>
                      <button
                        type="button"
                        aria-label="Reset timer"
                        onClick={() => resetTimer(currentStepIndex)}
                        className="min-h-[48px] min-w-[48px] bg-zinc-200 hover:bg-zinc-300 active:scale-95 text-zinc-700 rounded-xl flex items-center justify-center cursor-pointer transition-all"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </>
                  )}

                  {isTimerFinished && (
                    <div className="min-h-[48px] w-full bg-emerald-600 text-white font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2">
                      <Check size={18} strokeWidth={3} />
                      <span>Timer Complete!</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.article>
        </AnimatePresence>

        {/* LOOKAHEAD "UP NEXT" DOCK (Lower 30-35%) */}
        {nextStepObj ? (
          <aside className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 shadow-2xs shrink-0">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                <span>👀 Up Next: Step {currentStepIndex + 2}</span>
              </span>
              {nextStepObj.timer && (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded-md tabular-nums">
                  ⏱️ {Math.round(nextStepObj.timer / 60)}m next
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-zinc-800 line-clamp-2 leading-snug mb-2">
              {nextStepObj.text}
            </p>

            {/* Mise-en-place prep hint */}
            {(activeStep?.prep || nextStepObj.prep) && (
              <p className="text-[11px] font-bold text-orange-900 bg-orange-100/80 border border-orange-200/60 px-2 py-1 rounded-lg mb-2 flex items-center gap-1.5">
                <span>🔪 Prep ahead:</span>
                <span className="font-medium text-orange-950">
                  {activeStep?.prep || nextStepObj.prep}
                </span>
              </p>
            )}

            {/* Next step ingredients */}
            {nextIngredients.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] font-bold text-amber-900 opacity-70">Need:</span>
                {nextIngredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold bg-white/90 border border-amber-200/60 text-zinc-700 px-1.5 py-0.5 rounded-md"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            )}
          </aside>
        ) : (
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 text-center shrink-0">
            <p className="text-xs font-bold text-emerald-900 flex items-center justify-center gap-1.5">
              <Check size={15} className="text-emerald-600" />
              <span>Final step! Almost ready to plate and enjoy.</span>
            </p>
          </div>
        )}
      </main>

      {/* 3. KITCHEN BOTTOM CONTROLS (56px Hero Touch Targets) */}
      <footer className="bg-white border-t border-zinc-200/80 px-4 pt-3 pb-6 shrink-0 shadow-md">
        <div className="flex items-center gap-3 max-w-lg mx-auto w-full">
          {/* Previous Step Button */}
          <button
            type="button"
            disabled={currentStepIndex === 0}
            onClick={handlePrev}
            aria-label="Previous step"
            className={`min-h-[52px] px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer select-none ${
              currentStepIndex === 0
                ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
                : 'bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-700'
            }`}
          >
            <ChevronLeft size={18} />
            <span>Prev</span>
          </button>

          {/* Next / Finish Step Button */}
          {isCompleted ? (
            <button
              type="button"
              onClick={onClose}
              className="min-h-[52px] flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <Check size={18} strokeWidth={3} />
              <span>Finish Cooking 🎉</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="min-h-[52px] flex-1 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <span>Next Step</span>
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock } from 'lucide-react';
import AskGeminiButton from './AskGeminiButton';
import { CookModeModal } from './CookModeModal';
import { resumeAudioContext } from '../utils/audio';
import { normalizeRecipeSteps } from '../utils/recipeParser';
import { RecipeInput } from '../types/cookMode';

interface MealCardProps {
  mealName: string;
  data: {
    title: string;
    type: string;
    time: string;
    emoji: string;
    bg: string;
    border: string;
    text: string;
    ingredients?: string[];
    recipe: RecipeInput;
  };
  isOpen: boolean;
  onClick: () => void;
  onStartCooking?: (e: React.MouseEvent) => void;
}

export default function MealCard({ mealName, data, isOpen, onClick, onStartCooking }: MealCardProps) {
  const steps = useMemo(() => normalizeRecipeSteps(data.recipe), [data.recipe]);
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);

  const handleStartCooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    resumeAudioContext();
    
    if (onStartCooking) {
      onStartCooking(e);
    }
    setIsCookModeOpen(true);
  };


  return (
    <motion.div 
      layout
      className={`relative w-full rounded-[1.5rem] overflow-hidden border-2 ${data.bg} ${data.border} shadow-xs`}
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
    >
      <button 
        type="button"
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${mealName}: ${data.title}`}
        onClick={onClick}
        className="w-full text-left p-4 flex items-stretch justify-between cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2"
      >
        <div className="flex items-center gap-3.5 w-[75%]">
          <div className="w-12 h-12 bg-white/80 backdrop-blur-xs rounded-lg flex items-center justify-center text-2xl shadow-xs shrink-0">
            {data.emoji}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-extrabold uppercase tracking-widest opacity-60 mb-0.5">{mealName}</p>
            <h3 className={`font-bold text-[15px] leading-snug text-balance ${data.text}`}>{data.title}</h3>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between py-0.5 shrink-0">
          <span className="text-[11px] font-bold tabular-nums bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-lg flex items-center gap-1 text-zinc-800 shadow-xs mb-2">
            <Clock size={11} strokeWidth={3} /> {data.time}
          </span>
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="w-6 h-6 rounded-full flex items-center justify-center bg-white/60 shadow-sm text-zinc-800"
          >
             <ChevronDown size={14} strokeWidth={3} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 overflow-hidden"
          >
            <div className="pt-2 border-t border-black/5 pb-4">
              <div className="flex items-center justify-between gap-2 mb-3 mt-1">
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold uppercase bg-black/5 px-2 py-1 rounded-md">{data.type}</span>
                  {data.type === 'Fiber-First' && (
                    <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-900 px-2 py-1 rounded-md animate-pulse">Anti-Slump Hack 🛡️</span>
                  )}
                </div>
                {steps.length > 0 && (
                  <span className="text-[10px] font-bold opacity-60 tabular-nums">
                    {steps.length} {steps.length === 1 ? 'step' : 'steps'}
                  </span>
                )}
              </div>

              {data.ingredients && data.ingredients.length > 0 && (
                <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3.5 mb-3 border border-white/90 shadow-2xs">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-2">
                    Ingredients
                  </h4>
                  <ul className="space-y-1.5 select-text">
                    {data.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {steps.length > 0 && (
                <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3.5 mb-3.5 border border-white/90 shadow-2xs">
                  <ol className="space-y-2.5 select-text">
                    {steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white text-zinc-900 border border-black/10 flex items-center justify-center text-[10px] font-black tabular-nums shrink-0 mt-0.5 shadow-2xs">
                          {idx + 1}
                        </span>
                        <span className={`${data.text} text-xs leading-relaxed font-medium flex-1 pt-0.5`}>
                          {step.text}
                          {step.timer ? (
                            <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-bold text-orange-700 bg-orange-100/70 border border-orange-200 px-1.5 py-0.5 rounded-md">
                              ⏱️ {Math.round(step.timer / 60)}m
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  aria-label={`Start cooking ${data.title}`}
                  onClick={handleStartCooking}
                  className="min-h-[44px] w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer select-none"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  <span>Start Cooking</span>
                </button>

                <AskGeminiButton
                  meal={{
                    title: data.title,
                    ingredients: data.ingredients,
                    recipe: data.recipe,
                  }}
                />

                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${data.title} recipe`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  aria-label={`Search ${data.title} recipe on YouTube`}
                  className="min-h-[44px] w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100/80 active:scale-[0.98] text-red-700 border border-red-200/70 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer select-none"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="shrink-0 text-red-600"
                    aria-hidden="true"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span>Search Recipe on YouTube</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isCookModeOpen && (
        <CookModeModal meal={data} onClose={() => setIsCookModeOpen(false)} />
      )}
    </motion.div>
  );
}

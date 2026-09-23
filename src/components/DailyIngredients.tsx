"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { MealData } from '@/data/meals';
import { aggregateDayIngredients, filterIngredientsByMeal } from '@/utils/ingredients';

interface DailyIngredientsProps {
  dayName: string;
  meals?: MealData[];
  checkedItems: Record<string, boolean>;
  onToggleItem: (itemId: string) => void;
}

export default function DailyIngredients({
  dayName,
  meals = [],
  checkedItems,
  onToggleItem
}: DailyIngredientsProps) {
  // Hidden / collapsed by default
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const shouldReduceMotion = useReducedMotion();

  const allIngredients = useMemo(() => {
    return aggregateDayIngredients(meals);
  }, [meals]);

  const filteredIngredients = useMemo(() => {
    return filterIngredientsByMeal(allIngredients, selectedFilter);
  }, [allIngredients, selectedFilter]);

  const availableMealNames = useMemo(() => {
    const names = new Set<string>();
    for (const item of allIngredients) {
      names.add(item.mealName);
    }
    return ['All', ...Array.from(names)];
  }, [allIngredients]);

  if (!allIngredients || allIngredients.length === 0) {
    return null;
  }

  const checkedCount = allIngredients.filter(
    item => checkedItems[`${dayName}-${item.id}`]
  ).length;

  const totalCount = allIngredients.length;
  const countBadgeText = checkedCount > 0 
    ? `${checkedCount}/${totalCount} ready` 
    : `${totalCount} items`;

  return (
    <motion.div 
      layout="position"
      transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.3 }}
      className="relative w-full rounded-[1.5rem] overflow-hidden border-2 bg-amber-50/80 border-amber-200/90 shadow-xs mb-4"
    >
      {/* Top Header matching MealCard layout */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={`Toggle today's ingredients, ${countBadgeText}`}
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full text-left p-4 flex items-stretch justify-between cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2"
      >
        <div className="flex items-center gap-3.5 w-[75%]">
          <div className="w-12 h-12 bg-white/80 backdrop-blur-xs rounded-lg flex items-center justify-center text-2xl shadow-xs shrink-0">
            🥕
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-extrabold uppercase tracking-widest opacity-60 mb-0.5 text-amber-900">
              Daily Pantry
            </p>
            <h3 className="font-bold text-[15px] leading-snug text-balance text-amber-950">
              Today&apos;s Ingredients
            </h3>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between py-0.5 shrink-0">
          <span 
            className={`text-[11px] font-bold tabular-nums backdrop-blur-xs px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs mb-2 transition-colors ${
              checkedCount === totalCount && totalCount > 0
                ? 'bg-green-100 text-green-800'
                : checkedCount > 0
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-white/70 text-zinc-800'
            }`}
          >
            {countBadgeText}
          </span>
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="w-6 h-6 rounded-full flex items-center justify-center bg-white/60 shadow-sm text-zinc-800"
          >
            <ChevronDown size={14} strokeWidth={3} />
          </motion.div>
        </div>
      </button>

      {/* Expand/Collapse Section with framer-motion matching MealCard */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 overflow-hidden"
          >
            <div className="pt-2 border-t border-amber-200/50 pb-4">
              {/* Filter Chips */}
              {availableMealNames.length > 2 && (
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2.5">
                  {availableMealNames.map((meal) => {
                    const isActive = selectedFilter.toLowerCase() === meal.toLowerCase();
                    return (
                      <button
                        key={meal}
                        type="button"
                        aria-pressed={isActive}
                        aria-controls="daily-ingredients-list"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFilter(meal);
                        }}
                        className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-orange-500 ${
                          isActive
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'bg-white/80 text-zinc-700 hover:bg-white'
                        }`}
                      >
                        {meal}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Checklist Box */}
              <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2.5 border border-white/90 shadow-2xs">
                <motion.ul 
                  id="daily-ingredients-list"
                  aria-label="Filtered ingredients"
                  aria-live="polite"
                  className="space-y-1 select-text"
                >
                  {filteredIngredients.map((item) => {
                    const fullKey = `${dayName}-${item.id}`;
                    const isChecked = Boolean(checkedItems[fullKey]);

                    return (
                      <motion.li 
                        key={item.id}
                        layout={!shouldReduceMotion ? "position" : false}
                        initial={shouldReduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ 
                          opacity: { duration: 0.15 },
                          layout: { duration: 0.2, ease: "easeOut" }
                        }}
                      >
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={isChecked}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleItem(fullKey);
                            }}
                            className="min-h-[44px] w-full flex items-center justify-between text-left p-2 rounded-xl transition hover:bg-white active:scale-[0.99] cursor-pointer select-none group focus-visible:outline-2 focus-visible:outline-orange-500"
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center border-2 shrink-0 transition-colors ${
                                  isChecked
                                    ? 'bg-orange-600 border-orange-600 text-white'
                                    : 'border-zinc-300 bg-white group-hover:border-zinc-400'
                                }`}
                              >
                                {isChecked && <Check size={14} strokeWidth={3} />}
                              </div>
                              <span
                                className={`text-xs font-medium truncate transition-opacity ${
                                  isChecked
                                    ? 'line-through text-zinc-400 opacity-60'
                                    : 'text-zinc-800'
                                }`}
                              >
                                {item.text}
                              </span>
                            </div>

                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md shrink-0">
                              {item.mealName}
                            </span>
                          </button>
                        </motion.li>
                      );
                    })}
                </motion.ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

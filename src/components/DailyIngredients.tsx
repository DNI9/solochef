"use client";

import React, { useState, useMemo } from 'react';
import { ChevronDown, Check, Carrot } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');

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
    <section 
      aria-label={`Ingredients required for ${dayName}`}
      className="w-full bg-white rounded-2xl p-4 shadow-xs border border-zinc-200/80 mb-4 select-none"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-label="Toggle today's ingredients"
        className="min-h-[44px] w-full flex items-center justify-between text-left cursor-pointer select-none rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <Carrot size={16} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-900 leading-tight">
              Today&apos;s Ingredients
            </h3>
            <p className="text-[11px] font-medium text-zinc-500 mt-0.5">
              Pull from fridge &amp; pantry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span 
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full transition-colors ${
              checkedCount === totalCount && totalCount > 0
                ? 'bg-green-100 text-green-800'
                : checkedCount > 0
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            {countBadgeText}
          </span>
          <div 
            className={`w-6 h-6 rounded-full flex items-center justify-center text-zinc-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            <ChevronDown size={16} />
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-zinc-100">
          {/* Filter Chips */}
          {availableMealNames.length > 2 && (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2">
              {availableMealNames.map((meal) => {
                const isActive = selectedFilter.toLowerCase() === meal.toLowerCase();
                return (
                  <button
                    key={meal}
                    type="button"
                    onClick={() => setSelectedFilter(meal)}
                    className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {meal}
                  </button>
                );
              })}
            </div>
          )}

          {/* Checklist Items */}
          <ul className="space-y-1.5 mt-2">
            {filteredIngredients.map((item) => {
              const fullKey = `${dayName}-${item.id}`;
              const isChecked = Boolean(checkedItems[fullKey]);

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    onClick={() => onToggleItem(fullKey)}
                    className="min-h-[44px] w-full flex items-center justify-between text-left p-2 rounded-xl transition-all hover:bg-zinc-50 active:scale-[0.99] cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border-2 shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-orange-500 border-orange-500 text-white'
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
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

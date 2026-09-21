"use client";

import React, { useState, useEffect } from 'react';
import { MEAL_DATABASE, GROCERY_LIST, MealPlanData, GroceryCategory } from '@/data/meals';
import DayPill from '@/components/DayPill';
import MealCard from '@/components/MealCard';
import ImportTab from '@/components/ImportTab';
import DailyIngredients from '@/components/DailyIngredients';
import { Calendar, ShoppingCart, Bell, Check, FileJson, Sparkles, Wand2 } from 'lucide-react';
import { LayoutGroup } from 'framer-motion';
import { validateMealPlan } from '@/utils/schema';
import { PRESETS } from '@/data/presets';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export default function BentoMealPlanner() {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'groceries' | 'import'>('plan');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [dailyCheckedItems, setDailyCheckedItems] = useState<Record<string, boolean>>({});
  const [mealDb, setMealDb] = useState<MealPlanData>(MEAL_DATABASE);

  useEffect(() => {
    const today = new Date().getDay(); 
    const mappedIndex = today === 0 ? 6 : today - 1;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentDayIndex(mappedIndex);
    
    // Load custom plan from localStorage if available
    const savedPlan = localStorage.getItem('solochef_meal_plan');
    if (savedPlan) {
      try {
        const parsed = validateMealPlan(savedPlan);
        setMealDb(parsed);
      } catch (e: unknown) {
        console.error("Failed to load saved plan", e instanceof Error ? e.message : e);
      }
    }

    // Load daily checked ingredients from localStorage
    const savedDaily = localStorage.getItem('solochef_daily_checked_items');
    if (savedDaily) {
      try {
        const parsed = JSON.parse(savedDaily);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setDailyCheckedItems(parsed);
        }
      } catch (e: unknown) {
        console.error("Failed to load daily checked items", e instanceof Error ? e.message : e);
      }
    }

    // Load grocery checked items from localStorage
    const savedGrocery = localStorage.getItem('solochef_grocery_checked_items');
    if (savedGrocery) {
      try {
        const parsed = JSON.parse(savedGrocery);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setCheckedItems(parsed);
        }
      } catch (e: unknown) {
        console.error("Failed to load grocery checked items", e instanceof Error ? e.message : e);
      }
    }
  }, []);

  const toggleGroceryItem = (category: string, itemIndex: number) => {
    const key = `${category}-${itemIndex}`;
    const updated = {
      ...checkedItems,
      [key]: !checkedItems[key]
    };
    setCheckedItems(updated);
    try {
      localStorage.setItem('solochef_grocery_checked_items', JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save grocery checked items", e);
    }
  };

  const toggleDailyIngredientItem = (key: string) => {
    const updated = {
      ...dailyCheckedItems,
      [key]: !dailyCheckedItems[key]
    };
    setDailyCheckedItems(updated);
    try {
      localStorage.setItem('solochef_daily_checked_items', JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save daily checked items", e);
    }
  };

  const currentDayName = DAYS[currentDayIndex];
  const dayData = mealDb[currentDayName] || MEAL_DATABASE[currentDayName];
  // Check if we have at least one day defined in the plan to consider it loaded
  const hasPlan = DAYS.some(day => mealDb[day]);

  const handleMealClick = (meal: string) => {
    setExpandedMeal(expandedMeal === meal ? null : meal);
  };
  
  const handleImportPlan = (newPlan: MealPlanData) => {
    setMealDb(newPlan);
    setCheckedItems({});
    setDailyCheckedItems({});
    try {
      localStorage.setItem('solochef_meal_plan', JSON.stringify(newPlan));
      localStorage.removeItem('solochef_grocery_checked_items');
      localStorage.removeItem('solochef_daily_checked_items');
    } catch (e) {
      console.error("Failed to save plan to localStorage", e);
    }
  };

  return (
    <div className="bg-zinc-100/80 h-[100dvh] w-full overflow-hidden text-zinc-900 font-sans selection:bg-orange-200 select-none touch-manipulation flex justify-center">
      <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Native App Top Header with Safe Area Inset */}
        <header className="pt-[max(1.25rem,env(safe-area-inset-top))] pb-3.5 px-6 bg-white/95 backdrop-blur-md border-b border-zinc-100 shrink-0 z-20">
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2 text-zinc-900">
            Solo Chef&apos;s Dabba <span className="text-xl">🍱</span>
          </h1>
          <p className="text-xs text-zinc-500 font-medium">Zero-crash meals for one.</p>
        </header>

        {activeTab === 'plan' && (
          <>
            {hasPlan ? (
              <>
                <div className="w-full overflow-x-auto no-scrollbar py-3 px-6 border-b border-zinc-100 bg-zinc-50/70 shrink-0 native-scroll">
                  <div className="flex gap-2.5 w-max">
                    {DAYS.map((day, idx) => (
                      <DayPill 
                        key={day} 
                        day={day} 
                        active={idx === currentDayIndex} 
                        onClick={() => { setCurrentDayIndex(idx); setExpandedMeal(null); }} 
                      />
                    ))}
                  </div>
                </div>

                <main className="flex-1 overflow-y-auto px-5 py-5 pb-28 native-scroll no-scrollbar hide-scrollbar overscroll-contain">
                  {dayData?.prepAlert && (
                    <div className="mb-5 bg-amber-50/90 border border-amber-200/80 text-amber-900 px-4 py-3 rounded-2xl flex items-start gap-3 shadow-xs">
                      <Bell className="text-amber-600 mt-0.5 shrink-0" size={18} />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">Batch Prep Alert</h4>
                        <p className="text-sm font-medium opacity-90 mt-0.5">{dayData.prepAlert}</p>
                      </div>
                    </div>
                  )}

                  <LayoutGroup>
                    <DailyIngredients
                      key={currentDayName}
                      dayName={currentDayName}
                      meals={dayData?.meals}
                      checkedItems={dailyCheckedItems}
                      onToggleItem={toggleDailyIngredientItem}
                    />

                    <div className="flex flex-col items-stretch gap-4">
                      {dayData?.meals && dayData.meals.map((meal, index) => (
                        <MealCard 
                          key={`${meal.name}-${index}`}
                          mealName={meal.name} 
                          data={meal} 
                          isOpen={expandedMeal === meal.name.toLowerCase()} 
                          onClick={() => handleMealClick(meal.name.toLowerCase())} 
                        />
                      ))}
                    </div>
                  </LayoutGroup>

                  <div className="h-6"></div>
                </main>
              </>
            ) : (
              <main className="flex-1 overflow-y-auto px-5 py-6 pb-28 native-scroll no-scrollbar hide-scrollbar overscroll-contain">
                {/* Header Welcome */}
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 text-orange-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles size={13} className="text-orange-600 shrink-0" />
                    <span>Quick-Start Presets</span>
                  </div>
                  <h2 className="text-xl font-black text-zinc-900 tracking-tight mb-1">
                    Pick Your Starter Dabba
                  </h2>
                  <p className="text-xs text-zinc-500 max-w-[280px] mx-auto leading-relaxed">
                    Zero energy crashes. 15-minute solo meals. 1-click loading with zero network delay.
                  </p>
                </div>

                {/* Presets List */}
                <div className="space-y-3.5 mb-6">
                  {PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs hover:border-orange-300 transition-all flex flex-col gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl p-2 bg-zinc-50 border border-zinc-100 rounded-xl shrink-0">
                          {preset.emoji}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <h3 className="font-bold text-sm text-zinc-900 leading-tight">
                              {preset.title}
                            </h3>
                            <span className="text-[10px] font-semibold text-orange-800 bg-orange-50 border border-orange-200/60 px-1.5 py-0.5 rounded-md">
                              {preset.prepTime}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            {preset.description}
                          </p>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-zinc-100">
                        {preset.highlights.map((h, i) => (
                          <span key={i} className="text-[10px] font-medium text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-orange-500 shrink-0"></span>
                            <span>{h}</span>
                          </span>
                        ))}
                      </div>

                      {/* 1-Click Load Action Button */}
                      <button
                        type="button"
                        onClick={() => handleImportPlan(preset.data)}
                        aria-label={`Load ${preset.title}`}
                        className="min-h-[44px] w-full bg-zinc-900 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
                      >
                        <Wand2 size={15} />
                        <span>Load This Dabba</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Secondary Option: Import Custom JSON */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 text-center flex flex-col items-center gap-2">
                  <p className="text-xs text-zinc-500 font-medium">
                    Have your own AI-generated meal plan?
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('import')}
                    className="min-h-[44px] px-4 py-2 text-xs font-bold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 active:scale-95 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileJson size={16} />
                    <span>Import custom JSON from ChatGPT/Claude</span>
                  </button>
                </div>
              </main>
            )}
          </>
        )}
        
        {activeTab === 'groceries' && (
          <main className="flex-1 overflow-y-auto px-5 py-5 pb-28 bg-yellow-50/30 native-scroll no-scrollbar hide-scrollbar overscroll-contain">
            <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-zinc-900">
              🛒 Weekly Haul
            </h2>
            {(!mealDb.groceries || mealDb.groceries.length === 0) && GROCERY_LIST.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 border border-zinc-100">
                  <ShoppingCart size={32} className="text-zinc-400" />
                </div>
                <h2 className="text-lg font-bold text-zinc-800 mb-2">Empty Cart</h2>
                <p className="text-zinc-500 max-w-[250px] text-sm">
                  Import a meal plan to automatically generate your organized weekly grocery list.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(mealDb.groceries || GROCERY_LIST).map((list: GroceryCategory, idx: number) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl shadow-xs border border-zinc-100">
                    <h3 className="font-bold text-base mb-3 border-b border-zinc-100 pb-2 text-zinc-800 flex items-center justify-between">
                      <span>{list.category}</span>
                      <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{list.items.length} items</span>
                    </h3>
                    <ul className="space-y-2">
                      {list.items.map((item: string, i: number) => {
                        const isChecked = checkedItems[`${list.category}-${i}`];
                        return (
                          <li key={i}>
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={Boolean(isChecked)}
                              className="min-h-[44px] flex items-center gap-3 text-sm font-medium text-zinc-700 cursor-pointer select-none text-left w-full active:scale-[0.99] transition-transform rounded-xl px-2 py-1 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-orange-500"
                              onClick={() => toggleGroceryItem(list.category, i)}
                            >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 shrink-0 transition-colors ${isChecked ? 'bg-orange-600 border-orange-600 text-white' : 'border-zinc-300 bg-white'}`}>
                                {isChecked && <Check size={14} strokeWidth={3} />}
                              </div>
                              <span className={`transition-opacity ${isChecked ? 'line-through text-zinc-400 opacity-60' : ''}`}>{item}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}
        
        {activeTab === 'import' && (
          <ImportTab onImport={handleImportPlan} />
        )}

        {/* Native-style Frosted Glass Bottom Tab Bar */}
        <nav className="absolute bottom-0 left-0 right-0 w-full bg-white/90 backdrop-blur-xl border-t border-zinc-200/70 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] flex justify-around items-center z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
          <button 
            onClick={() => setActiveTab('plan')}
            className={`min-h-[44px] min-w-[44px] px-4 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl active:scale-90 transition-all duration-150 ${activeTab === 'plan' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-zinc-400 hover:text-zinc-600'}`}
            aria-label="Plan"
          >
            <Calendar size={22} strokeWidth={activeTab === 'plan' ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-wider">Plan</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('groceries')}
            className={`min-h-[44px] min-w-[44px] px-4 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl active:scale-90 transition-all duration-150 ${activeTab === 'groceries' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-zinc-400 hover:text-zinc-600'}`}
            aria-label="Groceries"
          >
            <ShoppingCart size={22} strokeWidth={activeTab === 'groceries' ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-wider">Groceries</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('import')}
            className={`min-h-[44px] min-w-[44px] px-4 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl active:scale-90 transition-all duration-150 ${activeTab === 'import' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-zinc-400 hover:text-zinc-600'}`}
            aria-label="Import"
          >
            <FileJson size={22} strokeWidth={activeTab === 'import' ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-wider">Import</span>
          </button>
        </nav>

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { MEAL_DATABASE, GROCERY_LIST, MealPlanData, GroceryCategory } from '@/data/meals';
import DayPill from '@/components/DayPill';
import MealCard from '@/components/MealCard';
import ImportTab from '@/components/ImportTab';
import { Calendar, ShoppingCart, Bell, Check, FileJson } from 'lucide-react';
import { validateMealPlan } from '@/utils/schema';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export default function BentoMealPlanner() {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'groceries' | 'import'>('plan');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
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
  }, []);

  const toggleGroceryItem = (category: string, itemIndex: number) => {
    const key = `${category}-${itemIndex}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
    try {
      localStorage.setItem('solochef_meal_plan', JSON.stringify(newPlan));
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

                <main className="flex-1 overflow-y-auto px-5 py-5 pb-28 native-scroll no-scrollbar hide-scrollbar">
                  {dayData?.prepAlert && (
                    <div className="mb-5 bg-amber-50/90 border border-amber-200/80 text-amber-900 px-4 py-3 rounded-2xl flex items-start gap-3 shadow-xs">
                      <Bell className="text-amber-600 mt-0.5 shrink-0" size={18} />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">Batch Prep Alert</h4>
                        <p className="text-sm font-medium opacity-90 mt-0.5">{dayData.prepAlert}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-3">
                    {dayData?.meals && dayData.meals.map((meal, index) => (
                      <React.Fragment key={`${meal.name}-${index}`}>
                        <MealCard 
                          mealName={meal.name} 
                          data={meal} 
                          isOpen={expandedMeal === meal.name.toLowerCase()} 
                          onClick={() => handleMealClick(meal.name.toLowerCase())} 
                        />
                        
                        {index < dayData.meals.length - 1 && (
                          <div className="w-1 h-2.5 bg-zinc-300 rounded-full opacity-60"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="h-6"></div>
                </main>
              </>
            ) : (
              <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center pb-28 native-scroll no-scrollbar hide-scrollbar">
                <div className="w-20 h-20 bg-orange-50 border border-orange-100 rounded-full flex items-center justify-center mb-6 shadow-xs">
                  <Calendar size={32} className="text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 mb-2">No meal plan found</h2>
                <p className="text-zinc-500 mb-8 max-w-[260px] text-sm leading-relaxed">
                  You haven&apos;t loaded a meal plan yet. Head over to the Import tab to load your custom JSON plan.
                </p>
                <button 
                  onClick={() => setActiveTab('import')}
                  className="min-h-[44px] min-w-[44px] bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileJson size={18} />
                  <span>Go to Import Tab</span>
                </button>
              </main>
            )}
          </>
        )}
        
        {activeTab === 'groceries' && (
          <main className="flex-1 overflow-y-auto px-5 py-5 pb-28 bg-yellow-50/30 native-scroll no-scrollbar hide-scrollbar">
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
                              className="min-h-[44px] flex items-center gap-3 text-sm font-medium text-zinc-700 cursor-pointer select-none text-left w-full active:scale-[0.99] transition-transform rounded-xl px-2 py-1 hover:bg-zinc-50"
                              onClick={() => toggleGroceryItem(list.category, i)}
                            >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 shrink-0 transition-colors ${isChecked ? 'bg-orange-500 border-orange-500 text-white' : 'border-zinc-300 bg-white'}`}>
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
            className={`min-h-[44px] min-w-[44px] px-4 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl active:scale-90 transition-all duration-150 ${activeTab === 'plan' ? 'text-orange-600 font-bold' : 'text-zinc-400 hover:text-zinc-600'}`}
            aria-label="Plan"
          >
            <Calendar size={22} strokeWidth={activeTab === 'plan' ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-wider">Plan</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('groceries')}
            className={`min-h-[44px] min-w-[44px] px-4 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl active:scale-90 transition-all duration-150 ${activeTab === 'groceries' ? 'text-orange-600 font-bold' : 'text-zinc-400 hover:text-zinc-600'}`}
            aria-label="Groceries"
          >
            <ShoppingCart size={22} strokeWidth={activeTab === 'groceries' ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-wider">Groceries</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('import')}
            className={`min-h-[44px] min-w-[44px] px-4 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl active:scale-90 transition-all duration-150 ${activeTab === 'import' ? 'text-orange-600 font-bold' : 'text-zinc-400 hover:text-zinc-600'}`}
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

"use client";

import React, { useState, useEffect } from 'react';
import { MEAL_DATABASE, GROCERY_LIST, DayPlan } from '@/data/meals';
import DayPill from '@/components/DayPill';
import MealCard from '@/components/MealCard';
import ImportTab from '@/components/ImportTab';
import { Calendar, ShoppingCart, Bell, Check, FileJson } from 'lucide-react';
import { validateMealPlan } from '@/utils/schema';

const DAYS = Object.keys(MEAL_DATABASE);

export default function BentoMealPlanner() {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [expandedMeal, setExpandedMeal] = useState<string | null>('lunch');
  const [activeTab, setActiveTab] = useState<'plan' | 'groceries' | 'import'>('plan');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [mealDb, setMealDb] = useState<Record<string, DayPlan>>(MEAL_DATABASE);

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

  const handleMealClick = (meal: string) => {
    setExpandedMeal(expandedMeal === meal ? null : meal);
  };
  
  const handleImportPlan = (newPlan: Record<string, DayPlan>) => {
    setMealDb(newPlan);
    localStorage.setItem('solochef_meal_plan', JSON.stringify(newPlan));
  };

  return (
    <div className="bg-zinc-50 h-[100dvh] overflow-hidden text-zinc-900 font-sans selection:bg-orange-200">
      <div className="max-w-md mx-auto bg-white h-full shadow-xl overflow-hidden flex flex-col relative pb-24">
        
        {/* Header */}
        <header className="pt-8 pb-4 px-6 bg-white border-b border-zinc-100">
          <h1 className="text-2xl font-extrabold tracking-tight mb-1 flex items-center gap-2">
            Solo Chef&apos;s Dabba <span className="text-xl">🍱</span>
          </h1>
          <p className="text-sm text-zinc-500 font-medium">Zero-crash meals for one.</p>
        </header>

        {activeTab === 'plan' && (
          <>
            <div className="w-full overflow-x-auto no-scrollbar py-4 px-6 border-b border-zinc-100 bg-zinc-50/50">
              <div className="flex gap-3 w-max">
                {DAYS.map((day, idx) => (
                  <DayPill 
                    key={day} 
                    day={day} 
                    active={idx === currentDayIndex} 
                    onClick={() => { setCurrentDayIndex(idx); setExpandedMeal('lunch'); }} 
                  />
                ))}
              </div>
            </div>

            <main className="flex-1 overflow-y-auto px-6 py-6 pb-12 hide-scrollbar">
              {dayData.prepAlert && (
                <div className="mb-6 bg-amber-100 border border-amber-300 text-amber-900 px-4 py-3 rounded-2xl flex items-start gap-3 shadow-sm">
                  <Bell className="text-amber-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide">Batch Prep Alert</h4>
                    <p className="text-sm font-medium opacity-80">{dayData.prepAlert}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center">
                {dayData.meals && dayData.meals.map((meal, index) => (
                  <React.Fragment key={`${meal.name}-${index}`}>
                    <MealCard 
                      mealName={meal.name} 
                      data={meal} 
                      isOpen={expandedMeal === meal.name.toLowerCase()} 
                      onClick={() => handleMealClick(meal.name.toLowerCase())} 
                    />
                    
                    {index < dayData.meals.length - 1 && (
                      <div className="w-1 h-3 bg-zinc-400 rounded-full my-1.5 opacity-40"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="h-10"></div>
            </main>
          </>
        )}
        
        {activeTab === 'groceries' && (
          <main className="flex-1 overflow-y-auto px-6 py-6 bg-yellow-50/30">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">🛒 Weekly Haul</h2>
            <div className="space-y-6">
              {GROCERY_LIST.map((list, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100">
                  <h3 className="font-bold text-lg mb-3 border-b border-zinc-100 pb-2 text-zinc-800">{list.category}</h3>
                  <ul className="space-y-3">
                    {list.items.map((item, i) => {
                      const isChecked = checkedItems[`${list.category}-${i}`];
                      return (
                        <li key={i}>
                          <button
                            type="button"
                            className="flex items-start gap-3 text-sm font-medium text-zinc-600 cursor-pointer select-none text-left w-full focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md p-1"
                            onClick={() => toggleGroceryItem(list.category, i)}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 mt-0.5 flex-shrink-0 transition-colors ${isChecked ? 'bg-orange-500 border-orange-500 text-white' : 'border-zinc-300'}`}>
                              {isChecked && <Check size={14} strokeWidth={3} />}
                            </div>
                            <span className={isChecked ? 'line-through text-zinc-400' : ''}>{item}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </main>
        )}
        
        {activeTab === 'import' && (
          <ImportTab onImport={handleImportPlan} />
        )}

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-zinc-100 px-6 py-4 flex justify-around items-center pb-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <button 
            onClick={() => setActiveTab('plan')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'plan' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <Calendar size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Plan</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('groceries')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'groceries' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <ShoppingCart size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Groceries</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('import')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'import' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <FileJson size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Import</span>
          </button>
        </nav>

      </div>
    </div>
  );
}

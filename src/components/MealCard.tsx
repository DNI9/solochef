import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock } from 'lucide-react';

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
    recipe: string;
  };
  isOpen: boolean;
  onClick: () => void;
}

export default function MealCard({ mealName, data, isOpen, onClick }: MealCardProps) {
  return (
    <motion.div 
      layout
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative w-full rounded-[1.5rem] cursor-pointer overflow-hidden border-2 ${data.bg} ${data.border} shadow-sm`}
      onClick={onClick}
      animate={{ scale: isOpen ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="p-4 flex items-stretch justify-between">
        <div className="flex items-center gap-3 w-[75%]">
          <div className="w-12 h-12 bg-white/70 rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0">
            {data.emoji}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-50 mb-0.5">{mealName}</p>
            <h3 className={`font-bold text-[15px] leading-tight ${data.text}`}>{data.title}</h3>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between py-0.5 shrink-0">
          <span className="text-[10px] font-bold bg-white/60 px-1.5 py-0.5 rounded-md flex items-center gap-1 text-zinc-800 shadow-sm mb-2">
            <Clock size={10} strokeWidth={3} /> {data.time}
          </span>
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="w-6 h-6 rounded-full flex items-center justify-center bg-white/60 shadow-sm text-zinc-800"
          >
             <ChevronDown size={14} strokeWidth={3} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 overflow-hidden"
          >
            <div className="pt-2 border-t border-black/5 pb-4">
              <div className="flex gap-2 mb-3 mt-1">
                 <span className="text-[10px] font-bold uppercase bg-black/5 px-2 py-1 rounded-md">{data.type}</span>
                 {data.type === 'Fiber-First' && (
                   <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-900 px-2 py-1 rounded-md animate-pulse">Anti-Slump Hack 🛡️</span>
                 )}
              </div>
              <p className={`${data.text} text-sm leading-relaxed font-medium opacity-90`}>
                {data.recipe}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

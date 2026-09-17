import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
      className={`relative w-full rounded-3xl cursor-pointer overflow-hidden border-2 ${data.bg} ${data.border} shadow-sm`}
      onClick={onClick}
      animate={{ scale: isOpen ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
            {data.emoji}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{mealName}</p>
            <h3 className={`font-bold text-lg leading-tight ${data.text} w-[90%]`}>{data.title}</h3>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs font-bold bg-white/50 px-2 py-1 rounded-lg flex items-center gap-1">
            ⏱ {data.time}
          </span>
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/50"
          >
             <ChevronDown size={18} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 overflow-hidden"
          >
            <div className="pt-2 border-t border-black/10 pb-5">
              <div className="flex gap-2 mb-3 mt-2">
                 <span className="text-[10px] font-bold uppercase bg-black/10 px-2 py-1 rounded-md">{data.type}</span>
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

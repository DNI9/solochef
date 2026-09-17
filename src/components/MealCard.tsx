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
      className={`relative w-full rounded-[1.5rem] cursor-pointer overflow-hidden border-2 ${data.bg} ${data.border} shadow-xs select-none`}
      onClick={onClick}
      animate={{ scale: isOpen ? 1.01 : 1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="p-4 flex items-stretch justify-between">
        <div className="flex items-center gap-3.5 w-[75%]">
          <div className="w-12 h-12 bg-white/80 backdrop-blur-xs rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0">
            {data.emoji}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-60 mb-0.5">{mealName}</p>
            <h3 className={`font-bold text-[15px] leading-snug ${data.text}`}>{data.title}</h3>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between py-0.5 shrink-0">
          <span className="text-[10px] font-bold tabular-nums bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-lg flex items-center gap-1 text-zinc-800 shadow-xs mb-2">
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
              <p className={`${data.text} text-sm leading-relaxed font-medium opacity-90 mb-3.5 select-text`}>
                {data.recipe}
              </p>

              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${data.title} recipe`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                aria-label={`Search ${data.title} recipe on YouTube`}
                className="min-h-[44px] w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer select-none"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>Search Recipe on YouTube</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import React from 'react';

interface DayPillProps {
  day: string;
  active: boolean;
  onClick: () => void;
}

export default function DayPill({ day, active, onClick }: DayPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 min-h-[44px] min-w-[44px] px-5 py-2.5 rounded-full font-bold text-xs tracking-wide transition-all duration-200 active:scale-95 cursor-pointer select-none shadow-xs flex items-center justify-center ${
        active 
        ? 'bg-zinc-900 text-white shadow-sm' 
        : 'bg-white text-zinc-600 border border-zinc-200/80 hover:bg-zinc-50'
      }`}
    >
      {day.slice(0, 3).toUpperCase()}
    </button>
  );
}

import React from 'react';

interface DayPillProps {
  day: string;
  active: boolean;
  onClick: () => void;
}

export default function DayPill({ day, active, onClick }: DayPillProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-sm ${
        active 
        ? 'bg-zinc-900 text-white scale-105 shadow-md' 
        : 'bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50'
      }`}
    >
      {day.slice(0, 3).toUpperCase()}
    </button>
  );
}

import React from 'react';
import Link from 'next/link';
import { WifiOff, Home } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="bg-zinc-100/80 min-h-[100dvh] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-zinc-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-5 shadow-xs">
          <WifiOff size={32} />
        </div>

        <span className="text-3xl mb-2">🍱</span>
        <h1 className="text-xl font-black text-zinc-900 tracking-tight mb-2">
          You&apos;re Offline
        </h1>

        <p className="text-sm text-zinc-600 font-medium mb-6 leading-relaxed">
          No internet connection was detected. Don&apos;t worry &mdash; your saved meal plans and grocery lists are still safe in your local storage.
        </p>

        <div className="w-full space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-sm font-semibold rounded-2xl transition-colors shadow-sm"
          >
            <Home size={16} />
            Return to Meal Planner
          </Link>
        </div>
      </div>
    </div>
  );
}

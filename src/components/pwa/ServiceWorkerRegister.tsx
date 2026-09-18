"use client";

import { useEffect, useSyncExternalStore } from 'react';
import { WifiOff } from 'lucide-react';

function subscribeOnline(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

function getServerSnapshot() {
  return true;
}

export default function ServiceWorkerRegister() {
  const isOnline = useSyncExternalStore(
    subscribeOnline,
    getOnlineSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker) {
      const registerSW = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .catch((error: unknown) => {
            console.error('Service Worker registration failed:', error);
          });
      };

      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW, { once: true });
        return () => {
          window.removeEventListener('load', registerSW);
        };
      }
    }
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-zinc-900/95 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-2 border border-zinc-700/50 transition-transform duration-200"
    >
      <WifiOff size={14} className="text-amber-400 shrink-0" />
      <span>Offline Mode &mdash; using saved meal plan</span>
    </div>
  );
}

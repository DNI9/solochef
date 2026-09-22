'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  buildGeminiRecipePrompt,
  shareToGemini,
  RecipePromptOptions,
} from '../utils/geminiPrompt';

export interface AskGeminiButtonProps {
  meal: RecipePromptOptions;
  showPromptPreview?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function AskGeminiButton({
  meal,
  showPromptPreview: initialShowPreview = false,
  className = '',
  children,
}: AskGeminiButtonProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(initialShowPreview);
  const [isSharing, setIsSharing] = useState(false);

  const promptText = buildGeminiRecipePrompt(meal);

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (isSharing) return;

    setIsSharing(true);
    try {
      await shareToGemini(meal);
    } finally {
      setIsSharing(false);
    }
  };

  const togglePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPreviewOpen(!isPreviewOpen);
  };

  return (
    <div className={`w-full flex flex-col gap-2.5 ${className}`}>
      <div className={children ? "grid grid-cols-2 gap-2.5" : "flex items-center gap-2"}>
        <div className="flex items-center gap-1.5 min-w-0">
          <motion.button
            type="button"
            onClick={handleShare}
            disabled={isSharing}
            whileTap={{ scale: 0.98 }}
            aria-label={`Ask Gemini about ${meal.title}`}
            className="min-h-[44px] flex-1 min-w-0 flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white px-2.5 py-2.5 rounded-xl font-bold text-xs shadow-xs border border-zinc-800/80 transition-all cursor-pointer select-none disabled:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              className="shrink-0"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="gemini-sparkle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="50%" stopColor="#C084FC" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <path
                d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
                fill="url(#gemini-sparkle-grad)"
              />
            </svg>
            <span className="tracking-wide truncate">Ask Gemini</span>
            <span className="hidden sm:inline-block text-[10px] font-semibold text-zinc-400 bg-white/10 px-1.5 py-0.5 rounded-md shrink-0">
              AI Chef
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={togglePreview}
            aria-expanded={isPreviewOpen}
            aria-label={isPreviewOpen ? "Hide Gemini prompt preview" : "Show Gemini prompt preview"}
            whileTap={{ scale: 0.94 }}
            className="min-h-[44px] min-w-[36px] sm:min-w-[40px] flex items-center justify-center rounded-xl bg-white/80 hover:bg-white border border-black/10 text-zinc-700 shadow-2xs transition-all cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700"
            title="Toggle Gemini prompt preview for text selection"
          >
            <motion.div
              animate={{ rotate: isPreviewOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="flex items-center justify-center"
            >
              <ChevronDown size={16} strokeWidth={2.5} />
            </motion.div>
          </motion.button>
        </div>

        {children}
      </div>

      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="overflow-hidden"
          >
            <div className="bg-white/70 backdrop-blur-xs border border-black/5 rounded-2xl p-3.5 text-left shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  Prompt Preview
                </span>
                <span className="text-[10px] text-zinc-500 font-medium">
                  Tap to highlight
                </span>
              </div>

              <div
                data-testid="gemini-prompt-preview"
                role="region"
                aria-label="Gemini recipe prompt preview"
                tabIndex={0}
                className="select-all p-3 bg-black/5 rounded-xl text-xs font-mono text-zinc-800 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap cursor-pointer border border-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700"
                onClick={(e) => e.stopPropagation()}
              >
                {promptText}
              </div>

              <p className="mt-2.5 text-[10px] text-zinc-500 font-medium italic text-center">
                Tip: Long press text above for Android &apos;Ask Gemini&apos; menu
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

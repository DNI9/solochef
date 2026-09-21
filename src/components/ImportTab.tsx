import React, { useState, useEffect, useRef } from 'react';
import { Copy, CheckCircle2, AlertCircle, Sparkles, Wand2 } from 'lucide-react';
import { SCHEMA_TEMPLATE, LLM_INSTRUCTION, validateMealPlan } from '@/utils/schema';
import { MealPlanData } from '@/data/meals';
import { PRESETS, PresetMeta } from '@/data/presets';

interface ImportTabProps {
  onImport: (newPlan: MealPlanData) => void;
}

export default function ImportTab({ onImport }: ImportTabProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'schema' | 'prompt' | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Plan imported successfully!');
  
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

  const copyToClipboard = async (text: string, type: 'schema' | 'prompt') => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedType(type);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleImport = () => {
    setError(null);
    setSuccess(false);
    
    if (!jsonInput.trim()) {
      setError("Please paste a JSON plan first.");
      return;
    }

    try {
      const parsedPlan = validateMealPlan(jsonInput);
      onImport(parsedPlan);
      setSuccessMessage('Plan imported successfully!');
      setSuccess(true);
      setJsonInput('');
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to parse JSON plan");
    }
  };

  const handleLoadPreset = (preset: PresetMeta) => {
    setError(null);
    onImport(preset.data);
    setSuccessMessage(`Loaded "${preset.title}" preset!`);
    setSuccess(true);
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    successTimeoutRef.current = setTimeout(() => setSuccess(false), 3500);
  };

  return (
    <main className="flex-1 overflow-y-auto px-5 py-5 pb-28 bg-zinc-50 native-scroll no-scrollbar hide-scrollbar">
      <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-zinc-900">
        🔄 Import Plan
      </h2>

      {success && (
        <div className="mb-5 bg-green-50 text-green-700 p-3.5 rounded-2xl flex items-center gap-2.5 text-sm border border-green-200/80 shadow-xs">
          <CheckCircle2 size={18} className="shrink-0 text-green-600" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Curated Presets Section */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-zinc-100 mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-bold text-zinc-900 flex items-center gap-1.5">
            <Wand2 size={16} className="text-orange-500" />
            <span>Curated Starter Presets</span>
          </h3>
          <span className="text-[11px] font-semibold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full">
            1-Click Load
          </span>
        </div>
        <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
          Skip prompt writing. Choose a pre-built, nutritionist-vetted 7-day plan ready for immediate cooking.
        </p>

        <div className="space-y-3">
          {PRESETS.map((preset) => (
            <div 
              key={preset.id}
              className="p-3.5 rounded-xl border border-zinc-100 bg-zinc-50/70 hover:bg-zinc-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-2xl shrink-0 mt-0.5">{preset.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-zinc-900">{preset.title}</h4>
                    <span className="text-[10px] font-medium bg-zinc-200/70 text-zinc-700 px-1.5 py-0.5 rounded-md">
                      {preset.tag}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-snug">
                    {preset.description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleLoadPreset(preset)}
                aria-label={`Load ${preset.title}`}
                className="min-h-[44px] min-w-[110px] shrink-0 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer select-none"
              >
                <span>Load Preset</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-zinc-100 mb-5 select-text">
        <h3 className="font-bold text-zinc-900 mb-2">1. Get Schema &amp; Instructions</h3>
        <p className="text-sm text-zinc-500 mb-3.5 leading-relaxed">
          Copy the prompt or schema and ask an LLM (like ChatGPT or Claude) to generate a week&apos;s meal plan in this exact JSON format.
        </p>

        <div className="p-3.5 bg-orange-50/80 border border-orange-200/80 rounded-xl mb-4 text-xs text-orange-950 flex items-start gap-2">
          <Sparkles size={16} className="text-orange-600 mt-0.5 shrink-0" />
          <div className="leading-relaxed">
            <span className="font-bold">Step-by-Step Recipes:</span> Each meal must include an <code className="bg-orange-100/90 text-orange-900 px-1 py-0.5 rounded font-mono text-[11px]">ingredients</code> list and sequential numbered <code className="bg-orange-100/90 text-orange-900 px-1 py-0.5 rounded font-mono text-[11px]">recipe</code> instructions (e.g. <code className="bg-orange-100/90 text-orange-900 px-1 py-0.5 rounded font-mono text-[11px]">[&quot;Step 1: ...&quot;, &quot;Step 2: ...&quot;]</code>).
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button 
            type="button"
            onClick={() => copyToClipboard(LLM_INSTRUCTION, 'prompt')}
            className="min-h-[44px] flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 justify-center cursor-pointer select-none shadow-xs"
          >
            {copiedType === 'prompt' ? <CheckCircle2 size={16} className="text-white" /> : <Copy size={16} />}
            <span>{copiedType === 'prompt' ? "Prompt Copied!" : "Copy LLM Prompt"}</span>
          </button>
          
          <button 
            type="button"
            onClick={() => copyToClipboard(SCHEMA_TEMPLATE, 'schema')}
            className="min-h-[44px] flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 active:scale-[0.98] text-zinc-800 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 justify-center cursor-pointer select-none"
          >
            {copiedType === 'schema' ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} />}
            <span>{copiedType === 'schema' ? "Schema Copied!" : "Copy LLM Schema"}</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-xs border border-zinc-100 select-text">
        <h3 className="font-bold text-zinc-900 mb-2">2. Paste New Plan</h3>
        <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
          Paste the JSON generated by the LLM here to update your week&apos;s plan.
        </p>
        
        <textarea
          aria-label="Paste JSON meal plan here"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste JSON here..."
          spellCheck={false}
          autoCapitalize="none"
          className="w-full h-40 p-3.5 border border-zinc-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4 resize-none select-text touch-manipulation bg-zinc-50/50"
        />

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl flex items-start gap-2 text-sm border border-red-100">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button 
          type="button"
          onClick={handleImport}
          className="min-h-[44px] w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white px-4 py-3 rounded-xl text-sm font-bold shadow-sm transition-all flex justify-center items-center gap-2 cursor-pointer select-none"
        >
          Import Plan
        </button>
      </div>
      
      <div className="h-6"></div>
    </main>
  );
}

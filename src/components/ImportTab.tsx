import React, { useState, useEffect, useRef } from 'react';
import { Copy, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { SCHEMA_TEMPLATE, LLM_INSTRUCTION, validateMealPlan } from '@/utils/schema';
import { MealPlanData } from '@/data/meals';

interface ImportTabProps {
  onImport: (newPlan: MealPlanData) => void;
}

export default function ImportTab({ onImport }: ImportTabProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'schema' | 'prompt' | null>(null);
  const [success, setSuccess] = useState(false);
  
  const copyTimeoutRef = useRef<NodeJS.Timeout>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout>(null);
  
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
      setSuccess(true);
      setJsonInput('');
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to parse JSON plan");
    }
  };

  return (
    <main className="flex-1 overflow-y-auto px-5 py-5 pb-28 bg-zinc-50 native-scroll no-scrollbar hide-scrollbar">
      <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-zinc-900">
        🔄 Import Plan
      </h2>
      
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-zinc-100 mb-5 select-text">
        <h3 className="font-bold text-zinc-900 mb-2">1. Get Schema &amp; Instructions</h3>
        <p className="text-sm text-zinc-500 mb-3.5 leading-relaxed">
          Copy the prompt or schema and ask an LLM (like ChatGPT or Claude) to generate a week&apos;s meal plan in this exact JSON format.
        </p>

        <div className="p-3.5 bg-orange-50/80 border border-orange-200/80 rounded-xl mb-4 text-xs text-orange-950 flex items-start gap-2">
          <Sparkles size={16} className="text-orange-600 mt-0.5 shrink-0" />
          <div className="leading-relaxed">
            <span className="font-bold">Step-by-Step Recipes:</span> Each meal must include a <code className="bg-orange-100/90 text-orange-900 px-1 py-0.5 rounded font-mono text-[11px]">recipe</code> array containing sequential numbered instructions (e.g. <code className="bg-orange-100/90 text-orange-900 px-1 py-0.5 rounded font-mono text-[11px]">[&quot;Step 1: ...&quot;, &quot;Step 2: ...&quot;]</code>).
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

        {success && (
          <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-xl flex items-center gap-2 text-sm border border-green-100">
            <CheckCircle2 size={16} className="shrink-0" />
            <span className="font-medium">Plan imported successfully!</span>
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

import React, { useState, useEffect, useRef, useId } from 'react';
import { 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Wand2, 
  Download, 
  Upload, 
  Share2, 
  Archive, 
  Trash2, 
  FileJson,
  X
} from 'lucide-react';
import { SCHEMA_TEMPLATE, LLM_INSTRUCTION, validateMealPlan } from '@/utils/schema';
import { MealPlanData, SavedPlanItem } from '@/data/meals';
import { PRESETS, PresetMeta } from '@/data/presets';
import { exportPlanToFile, exportPlanToShare, createExportEnvelope, createSavedPlanItem } from '@/utils/planExport';

interface ImportTabProps {
  onImport: (newPlan: MealPlanData) => void;
  currentPlan?: MealPlanData;
}

export default function ImportTab({ onImport, currentPlan }: ImportTabProps) {
  const [activeSection, setActiveSection] = useState<'export' | 'import' | 'vault'>('import');
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'schema' | 'prompt' | 'json' | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Plan imported successfully!');
  const [exportPlanName, setExportPlanName] = useState('');
  
  // Pending plan for Import Confirmation Modal
  const [pendingPlan, setPendingPlan] = useState<MealPlanData | null>(null);
  const [pendingPlanMeta, setPendingPlanMeta] = useState<{ dayCount: number; mealCount: number } | null>(null);

  // Vault state
  const [savedPlans, setSavedPlans] = useState<SavedPlanItem[]>([]);
  const [newVaultName, setNewVaultName] = useState('');

  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputId = useId();

  // Load saved plans from localStorage on mount (hydration safe)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('solochef_saved_plans');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSavedPlans(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setSuccess(true);
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    successTimeoutRef.current = setTimeout(() => setSuccess(false), 3500);
  };

  const copyToClipboard = async (text: string, type: 'schema' | 'prompt' | 'json') => {
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

  // 1. Export Handlers
  const handleDownloadFile = () => {
    setError(null);
    if (!currentPlan) {
      setError("No active plan to export.");
      return;
    }
    try {
      exportPlanToFile(currentPlan, exportPlanName || 'My Week');
      triggerSuccess('Plan downloaded as .json!');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export plan.");
    }
  };

  const handleSharePlan = async () => {
    setError(null);
    if (!currentPlan) {
      setError("No active plan to export.");
      return;
    }
    const shared = await exportPlanToShare(currentPlan, exportPlanName || 'My Week');
    if (shared) {
      triggerSuccess('Share sheet opened!');
    } else {
      // Fallback: copy to clipboard
      const envelope = createExportEnvelope(currentPlan, exportPlanName || 'My Week');
      await copyToClipboard(JSON.stringify(envelope, null, 2), 'json');
      triggerSuccess('Share not supported on this device. JSON copied to clipboard!');
    }
  };

  const handleCopyJson = async () => {
    setError(null);
    if (!currentPlan) {
      setError("No active plan to export.");
      return;
    }
    const envelope = createExportEnvelope(currentPlan, exportPlanName || 'My Week');
    await copyToClipboard(JSON.stringify(envelope, null, 2), 'json');
    triggerSuccess('Plan JSON copied to clipboard!');
  };

  // 2. Import Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    if (file.size > 1024 * 1024) {
      setError("File size exceeds 1MB limit.");
      e.target.value = '';
      return;
    }

    try {
      const text = await file.text();
      const parsed = validateMealPlan(text);

      // Calculate days and meals
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
      let dayCount = 0;
      let mealCount = 0;
      for (const d of days) {
        if (parsed[d]) {
          dayCount++;
          mealCount += parsed[d]?.meals?.length || 0;
        }
      }

      setPendingPlan(parsed);
      setPendingPlanMeta({ dayCount, mealCount });
      e.target.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse JSON plan file");
      e.target.value = '';
    }
  };

  const handlePasteImport = () => {
    setError(null);
    if (!jsonInput.trim()) {
      setError("Please paste a JSON plan first.");
      return;
    }

    try {
      const parsedPlan = validateMealPlan(jsonInput);
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
      let dayCount = 0;
      let mealCount = 0;
      for (const d of days) {
        if (parsedPlan[d]) {
          dayCount++;
          mealCount += parsedPlan[d]?.meals?.length || 0;
        }
      }

      setPendingPlan(parsedPlan);
      setPendingPlanMeta({ dayCount, mealCount });
      setJsonInput('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to parse JSON plan");
    }
  };

  const handleConfirmImport = () => {
    if (!pendingPlan) return;
    onImport(pendingPlan);
    setPendingPlan(null);
    setPendingPlanMeta(null);
    triggerSuccess('Plan imported successfully!');
  };

  // 3. Vault Handlers
  const handleSaveToVault = () => {
    if (!currentPlan) {
      setError("No active plan to save.");
      return;
    }
    const newItem = createSavedPlanItem(currentPlan, newVaultName);
    const updated = [newItem, ...savedPlans];
    setSavedPlans(updated);
    try {
      localStorage.setItem('solochef_saved_plans', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setNewVaultName('');
    triggerSuccess(`Saved "${newItem.name}" to vault!`);
  };

  const handleLoadSavedPlan = (item: SavedPlanItem) => {
    onImport(item.plan);
    triggerSuccess(`Loaded "${item.name}"!`);
  };

  const handleDeleteSavedPlan = (id: string) => {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    try {
      localStorage.setItem('solochef_saved_plans', JSON.stringify(updated));
    } catch {
      // ignore
    }
    triggerSuccess('Plan removed from vault.');
  };

  const handleLoadPreset = (preset: PresetMeta) => {
    setError(null);
    onImport(preset.data);
    triggerSuccess(`Loaded "${preset.title}" preset!`);
  };

  return (
    <main className="flex-1 overflow-y-auto px-4 py-5 pb-28 bg-zinc-50 native-scroll no-scrollbar hide-scrollbar max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-black flex items-center gap-2 text-zinc-900 tracking-tight">
          <span>🔄 Import Plan</span>
        </h2>
        <span className="text-[11px] font-bold text-zinc-500 bg-zinc-200/70 px-2 py-0.5 rounded-full">
          Backup &amp; Export
        </span>
      </div>

      {/* Status Alerts */}
      {success && (
        <div role="status" aria-live="polite" className="mb-4 bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-semibold border border-emerald-200/80 shadow-xs">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div role="alert" aria-live="assertive" className="mb-4 bg-red-50 text-red-700 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-semibold border border-red-200/80 shadow-xs">
          <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Segmented Control Bar (Min 44px Touch Targets) */}
      <div className="bg-zinc-200/80 p-1 rounded-2xl flex items-center gap-1 mb-5 shadow-inner">
        <button
          type="button"
          onClick={() => { setActiveSection('export'); setError(null); }}
          className={`min-h-[44px] flex-1 font-bold text-xs rounded-xl transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 ${
            activeSection === 'export'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Download size={14} />
          <span>Export</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveSection('import'); setError(null); }}
          className={`min-h-[44px] flex-1 font-bold text-xs rounded-xl transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 ${
            activeSection === 'import'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Upload size={14} />
          <span>Import</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveSection('vault'); setError(null); }}
          className={`min-h-[44px] flex-1 font-bold text-xs rounded-xl transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 ${
            activeSection === 'vault'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Archive size={14} />
          <span>Vault</span>
        </button>
      </div>

      {/* SECTION 1: EXPORT VIEW */}
      {activeSection === 'export' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-zinc-200/80">
            <h3 className="font-bold text-sm text-zinc-900 mb-1.5 flex items-center gap-1.5">
              <FileJson size={16} className="text-orange-500" />
              <span>Export Active Week</span>
            </h3>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              Export your current 7-day meal plan and grocery list into a portable file, share it to another device, or copy its JSON.
            </p>

            {/* Optional Plan Name */}
            <div className="mb-4">
              <label htmlFor="export-plan-name" className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 mb-1.5">
                Plan Label (Optional)
              </label>
              <input
                id="export-plan-name"
                type="text"
                value={exportPlanName}
                onChange={(e) => setExportPlanName(e.target.value)}
                placeholder="e.g. High-Protein Salmon Week"
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleDownloadFile}
                className="min-h-[48px] w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-xs px-4 py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                <Download size={16} />
                <span>Download .json File</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSharePlan}
                  className="min-h-[44px] flex-1 bg-zinc-100 hover:bg-zinc-200 active:scale-[0.98] text-zinc-800 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <Share2 size={15} />
                  <span>Share Plan</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="min-h-[44px] flex-1 bg-zinc-100 hover:bg-zinc-200 active:scale-[0.98] text-zinc-800 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <Copy size={15} />
                  <span>{copiedType === 'json' ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: IMPORT VIEW */}
      {activeSection === 'import' && (
        <div className="space-y-4">
          {/* File Upload Dropzone */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-zinc-200/80">
            <h3 className="font-bold text-sm text-zinc-900 mb-1.5 flex items-center gap-1.5">
              <Upload size={16} className="text-orange-500" />
              <span>Upload Plan File</span>
            </h3>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              Select a previously exported <code className="bg-zinc-100 px-1 py-0.5 rounded text-[11px] font-mono">.json</code> file to restore your week.
            </p>

            <div className="border-2 border-dashed border-zinc-200 hover:border-orange-400 bg-zinc-50/70 hover:bg-orange-50/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative">
              <Upload size={28} className="text-zinc-400 mb-2" />
              <p className="text-xs font-bold text-zinc-700 mb-1">
                Tap to select a .json file
              </p>
              <p className="text-[10px] text-zinc-400">
                Max file size: 1 MB
              </p>

              <label htmlFor={fileInputId} className="sr-only">
                Select .json file
              </label>
              <input
                id={fileInputId}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Paste JSON / LLM Prompts Section */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-zinc-200/80 select-text">
            <h3 className="font-bold text-sm text-zinc-900 mb-1.5 flex items-center gap-1.5">
              <Sparkles size={16} className="text-orange-500" />
              <span>Paste JSON or Use Prompts</span>
            </h3>
            <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
              Generate a meal plan with ChatGPT or Claude and paste the output below.
            </p>

            {/* Copy Prompt / Schema Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3.5">
              <button
                type="button"
                onClick={() => copyToClipboard(LLM_INSTRUCTION, 'prompt')}
                className="min-h-[44px] flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex-1 justify-center cursor-pointer select-none shadow-xs"
              >
                {copiedType === 'prompt' ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                <span>{copiedType === 'prompt' ? "Prompt Copied!" : "Copy LLM Prompt"}</span>
              </button>
              
              <button
                type="button"
                onClick={() => copyToClipboard(SCHEMA_TEMPLATE, 'schema')}
                className="min-h-[44px] flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 active:scale-[0.98] text-zinc-800 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex-1 justify-center cursor-pointer select-none"
              >
                {copiedType === 'schema' ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                <span>{copiedType === 'schema' ? "Schema Copied!" : "Copy LLM Schema"}</span>
              </button>
            </div>

            <textarea
              aria-label="Paste JSON meal plan here"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON plan here..."
              spellCheck={false}
              autoCapitalize="none"
              className="w-full h-32 p-3 border border-zinc-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3 resize-none select-text touch-manipulation bg-zinc-50/60"
            />

            <button
              type="button"
              onClick={handlePasteImport}
              className="min-h-[44px] w-full bg-zinc-900 hover:bg-black active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all flex justify-center items-center gap-1.5 cursor-pointer select-none"
            >
              <span>Validate &amp; Load Pasted Plan</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: VAULT & PRESETS VIEW */}
      {activeSection === 'vault' && (
        <div className="space-y-4">
          {/* Save Active Plan to Vault Card */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-zinc-200/80">
            <h3 className="font-bold text-sm text-zinc-900 mb-1.5 flex items-center gap-1.5">
              <Archive size={16} className="text-orange-500" />
              <span>Saved Plans Vault</span>
            </h3>
            <p className="text-xs text-zinc-500 mb-3.5 leading-relaxed">
              Archive your current week into local storage so you can easily rotate between your favorite plans without managing files.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
              <label htmlFor="vault-plan-name" className="sr-only">
                New plan name for vault
              </label>
              <input
                id="vault-plan-name"
                type="text"
                aria-label="New plan name for vault"
                value={newVaultName}
                onChange={(e) => setNewVaultName(e.target.value)}
                placeholder="Plan name (e.g. Energy Boost Week)"
                className="flex-1 min-w-0 min-h-[44px] px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={handleSaveToVault}
                className="min-h-[44px] w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer select-none shrink-0"
              >
                <Archive size={14} />
                <span>Save Current Plan</span>
              </button>
            </div>

            {/* List of Saved Plans */}
            {savedPlans.length > 0 ? (
              <div className="space-y-2 mt-3 pt-3 border-t border-zinc-100">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">
                  Your Archived Weeks ({savedPlans.length})
                </p>
                {savedPlans.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-between gap-3"
                  >
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-zinc-900 truncate">{item.name}</h4>
                      <p className="text-[10px] text-zinc-500">
                        {new Date(item.savedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleLoadSavedPlan(item)}
                        aria-label={`Load ${item.name}`}
                        className="min-h-[38px] px-3 bg-white hover:bg-zinc-100 active:scale-95 text-zinc-900 border border-zinc-200/80 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSavedPlan(item.id)}
                        aria-label={`Delete ${item.name}`}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center text-zinc-400 hover:text-red-600 active:scale-90 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 text-center">
                <p className="text-xs text-zinc-400">
                  No plans archived in your vault yet. Click above to save your active week!
                </p>
              </div>
            )}
          </div>

          {/* Curated Starter Presets Section */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-zinc-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                <Wand2 size={16} className="text-orange-500" />
                <span>Curated Starter Presets</span>
              </h3>
              <span className="text-[10px] font-bold text-orange-800 bg-orange-100/70 px-2 py-0.5 rounded-full">
                1-Click Load
              </span>
            </div>
            <p className="text-xs text-zinc-500 mb-3.5 leading-relaxed">
              Nutritionist-vetted 7-day starter meal plans for immediate cooking.
            </p>

            <div className="space-y-2.5">
              {PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3 rounded-2xl border border-zinc-200/70 bg-zinc-50/80 hover:bg-zinc-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-xl shrink-0" aria-hidden="true">{preset.emoji}</span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-zinc-900 truncate">{preset.title}</h4>
                        <span className="text-[9px] font-semibold bg-zinc-200/70 text-zinc-700 px-1.5 py-0.2 rounded">
                          {preset.tag}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate">
                        {preset.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLoadPreset(preset)}
                    aria-label={`Load ${preset.title}`}
                    className="min-h-[38px] px-3 shrink-0 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center cursor-pointer select-none"
                  >
                    <span>Load</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION & PREVIEW MODAL */}
      {pendingPlan && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none"
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-zinc-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">⚠️</span>
              <button
                type="button"
                onClick={() => setPendingPlan(null)}
                aria-label="Cancel preview"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 text-zinc-400 hover:text-zinc-700 rounded-full cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <h3 id="confirm-modal-title" className="text-base font-black text-zinc-900 mb-1.5">
              Replace Active Plan?
            </h3>
            
            <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
              You are about to load a plan containing{' '}
              <strong className="text-zinc-900">{pendingPlanMeta?.dayCount || 7} days</strong> and{' '}
              <strong className="text-zinc-900">{pendingPlanMeta?.mealCount || 21} meals</strong>.
              This will replace your currently active week in SoloChef.
            </p>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPendingPlan(null)}
                className="min-h-[44px] flex-1 bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="min-h-[44px] flex-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
              >
                <span>Replace Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-6"></div>
    </main>
  );
}

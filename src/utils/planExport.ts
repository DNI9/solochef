import { MealPlanData, SavedPlanItem } from '../data/meals';

export interface ExportEnvelope {
  version: 1;
  app: 'solochef';
  exportedAt: string;
  planName?: string;
  plan: MealPlanData;
}

export function createSavedPlanItem(plan: MealPlanData, name?: string): SavedPlanItem {
  const trimmed = name?.trim() || `Plan ${new Date().toLocaleDateString()}`;
  return {
    id: `plan-${Date.now()}`,
    name: trimmed,
    savedAt: new Date().toISOString(),
    plan,
  };
}

export function createExportEnvelope(plan: MealPlanData, planName?: string): ExportEnvelope {
  return {
    version: 1,
    app: 'solochef',
    exportedAt: new Date().toISOString(),
    ...(planName ? { planName: planName.trim() } : {}),
    plan,
  };
}

export function generateExportFilename(planName?: string, date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dateSlug = `${yyyy}-${mm}-${dd}`;

  if (!planName || !planName.trim()) {
    return `solochef-plan-${dateSlug}.json`;
  }

  const cleanName = planName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `solochef-${cleanName || 'plan'}-${dateSlug}.json`;
}

export function exportPlanToFile(plan: MealPlanData, planName?: string): void {
  const envelope = createExportEnvelope(plan, planName);
  const jsonString = JSON.stringify(envelope, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const filename = generateExportFilename(planName);
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportPlanToShare(plan: MealPlanData, planName?: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return false;
  }

  try {
    const envelope = createExportEnvelope(plan, planName);
    const title = `Solochef Plan${planName ? ` - ${planName}` : ''}`;
    const text = `Weekly meal plan${planName ? ` "${planName}"` : ''} exported from SoloChef.`;

    await navigator.share({
      title,
      text: `${text}\n\n${JSON.stringify(envelope, null, 2)}`,
    });
    return true;
  } catch {
    return false;
  }
}

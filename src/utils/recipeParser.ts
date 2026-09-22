import { RecipeStep, RecipeInput } from '../types/cookMode';
import { extractDurationSeconds } from './timerParser';

const STOP_WORDS = new Set([
  'tsp', 'tbsp', 'cup', 'cups', 'pinch', 'pinches', 'oz', 'gram', 'grams', 'g', 'kg',
  'ml', 'liter', 'liters', 'clove', 'cloves', 'slice', 'slices', 'piece', 'pieces',
  'diced', 'chopped', 'sliced', 'minced', 'halved', 'grated', 'shredded', 'crushed',
  'cooked', 'uncooked', 'fresh', 'dried', 'warm', 'cold', 'hot', 'to', 'taste',
  'small', 'medium', 'large'
]);

export function cleanStepText(step: string): string {
  const cleaned = step.replace(/^(?:step\s*\d+[:\-.]?\s*|\d+[\.\)]\s*)/i, '').trim();
  return cleaned || step;
}

export function normalizeRecipeSteps(recipe?: RecipeInput | null): RecipeStep[] {
  if (!recipe) return [];

  if (Array.isArray(recipe)) {
    if (recipe.length === 0) return [];

    return recipe
      .filter((s): s is RecipeStep | string => s !== null && s !== undefined)
      .map(s => {
        if (typeof s === 'object' && 'text' in s) {
          return {
            ...s,
            text: cleanStepText(s.text)
          };
        }
        const str = typeof s === 'string' ? s.trim() : '';
        const cleaned = cleanStepText(str);
        const timer = extractDurationSeconds(cleaned);
        const step: RecipeStep = { text: cleaned };
        if (timer !== null) {
          step.timer = timer;
        }
        return step;
      })
      .filter(s => s.text.length > 0);
  }

  if (typeof recipe === 'string') {
    const trimmed = recipe.trim();
    if (!trimmed) return [];
    const lines = trimmed.split(/\r?\n+/).map(s => s.trim()).filter(Boolean);
    return lines.map(s => {
      const cleaned = cleanStepText(s);
      const timer = extractDurationSeconds(cleaned);
      const step: RecipeStep = { text: cleaned };
      if (timer !== null) {
        step.timer = timer;
      }
      return step;
    });
  }

  return [];
}

export function extractStepIngredients(stepText: string, ingredients: string[]): string[] {
  if (!stepText || !ingredients || ingredients.length === 0) return [];
  const normalizedStep = stepText.toLowerCase();

  return ingredients.filter(ing => {
    if (!ing || typeof ing !== 'string') return false;
    const raw = ing.toLowerCase();
    
    // 1. Remove parenthetical instructions: "1/2 onion (diced)" -> "1/2 onion"
    // 2. Remove leading quantities, fractions, and units
    const cleaned = raw
      .replace(/\(.*?\)/g, '')
      .replace(/^[\d/\s.-]+(tsp|tbsp|cup|cups|pinch|oz|gram|grams|g|kg|ml|liter|liters|clove|cloves|slice|slices)?\b/i, '')
      .trim();

    const escapeRegex = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (cleaned.length >= 3) {
      const phraseRegex = new RegExp(`\\b${escapeRegex(cleaned)}\\b`, 'i');
      if (phraseRegex.test(normalizedStep)) {
        return true;
      }
    }

    // Token-based keyword matching for compound ingredient names
    const tokens = cleaned
      .split(/[^a-z0-9]+/i)
      .filter(t => t.length >= 3 && !STOP_WORDS.has(t));

    for (const token of tokens) {
      const regex = new RegExp(`\\b${escapeRegex(token)}\\b`, 'i');
      if (regex.test(normalizedStep)) {
        return true;
      }
    }

    return false;
  });
}

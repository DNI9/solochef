import { describe, it, expect } from 'vitest';
import { PRESETS, PRESET_MAP } from '../presets';
import { validateMealPlan } from '@/utils/schema';
import { normalizeRecipeSteps } from '@/utils/recipeParser';
import { MealPlanData } from '../meals';

const REQUIRED_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const EXPECTED_MEAL_NAMES = ['Breakfast', 'Lunch', 'Dinner'];

describe('Curated Presets Data Engine', () => {
  it('exports exactly 4 curated presets', () => {
    expect(PRESETS).toHaveLength(4);
    expect(PRESETS.map(p => p.id)).toEqual([
      'anti-slump',
      'solo-vegetarian',
      'one-pan',
      'global-classics'
    ]);
  });

  it('exports PRESET_MAP for direct lookup by ID', () => {
    expect(PRESET_MAP['anti-slump']).toBeDefined();
    expect(PRESET_MAP['solo-vegetarian']).toBeDefined();
    expect(PRESET_MAP['one-pan']).toBeDefined();
    expect(PRESET_MAP['global-classics']).toBeDefined();
  });

  it.each(PRESETS)('preset "$id" contains valid metadata', (preset) => {
    expect(preset.id).toBeTruthy();
    expect(preset.title).toBeTruthy();
    expect(preset.description).toBeTruthy();
    expect(preset.emoji).toBeTruthy();
    expect(preset.tag).toBeTruthy();
    expect(preset.prepTime).toBeTruthy();
    expect(Array.isArray(preset.highlights)).toBe(true);
    expect(preset.highlights.length).toBeGreaterThan(0);
    expect(preset.data).toBeDefined();
  });

  it.each(PRESETS)('preset "$id" satisfies all 7 days with 3 meals per day', (preset) => {
    const data = preset.data as MealPlanData;

    for (const day of REQUIRED_DAYS) {
      const dayPlan = data[day];
      expect(dayPlan, `Day ${day} must exist in preset ${preset.id}`).toBeDefined();
      expect(dayPlan?.meals, `Meals for ${day} must be defined`).toBeDefined();
      expect(dayPlan?.meals).toHaveLength(3);

      const mealNames = dayPlan?.meals.map(m => m.name);
      expect(mealNames).toEqual(EXPECTED_MEAL_NAMES);

      dayPlan?.meals.forEach(meal => {
        expect(meal.title).toBeTruthy();
        expect(meal.type).toBeTruthy();
        expect(meal.time).toBeTruthy();
        expect(meal.emoji).toBeTruthy();
        expect(meal.bg).toBeTruthy();
        expect(meal.border).toBeTruthy();
        expect(meal.text).toBeTruthy();

        // Ingredients
        expect(Array.isArray(meal.ingredients)).toBe(true);
        expect(meal.ingredients?.length).toBeGreaterThan(0);

        // Recipe steps
        expect(Array.isArray(meal.recipe)).toBe(true);
        expect((meal.recipe as string[]).length).toBeGreaterThan(0);
      });
    }
  });

  it.each(PRESETS)('preset "$id" has categorized groceries', (preset) => {
    const data = preset.data as MealPlanData;
    expect(Array.isArray(data.groceries)).toBe(true);
    expect(data.groceries?.length).toBeGreaterThan(0);

    data.groceries?.forEach(cat => {
      expect(cat.category).toBeTruthy();
      expect(Array.isArray(cat.items)).toBe(true);
      expect(cat.items.length).toBeGreaterThan(0);
    });
  });

  it.each(PRESETS)('preset "$id" passes strict validateMealPlan parsing without errors', (preset) => {
    const jsonString = JSON.stringify(preset.data);
    expect(() => validateMealPlan(jsonString)).not.toThrow();

    const validated = validateMealPlan(jsonString);
    expect(validated).toBeDefined();
    for (const day of REQUIRED_DAYS) {
      expect(validated[day]?.meals).toHaveLength(3);
    }
  });

  it.each(PRESETS)('preset "$id" produces normalized RecipeStep items with valid text', (preset) => {
    const data = preset.data as MealPlanData;
    for (const day of REQUIRED_DAYS) {
      const dayPlan = data[day];
      dayPlan?.meals.forEach(meal => {
        const steps = normalizeRecipeSteps(meal.recipe);
        expect(steps.length).toBeGreaterThan(0);
        steps.forEach((step, idx) => {
          expect(step.text, `Meal "${meal.title}" step ${idx + 1} text must not be empty`).toBeTruthy();
          if (step.timer !== undefined) {
            expect(step.timer).toBeGreaterThan(0);
          }
        });
      });
    }
  });
});

import { MealData } from '../data/meals';

export interface DailyIngredient {
  id: string;
  text: string;
  mealName: string;
}

/**
 * Extracts candidate ingredient fragments from recipe step instructions
 * for legacy meal plans that do not have explicit ingredient lists.
 */
export function extractFallbackIngredients(recipe: string[] | string): string[] {
  const steps: string[] = Array.isArray(recipe)
    ? recipe
    : typeof recipe === 'string'
      ? recipe.split(/\r?\n+/).filter(Boolean)
      : [];

  if (steps.length === 0) return [];

  const extracted: string[] = [];

  for (const step of steps) {
    // Strip step prefixes like "Step 1: " or "1. "
    const cleaned = step.replace(/^(?:step\s*\d+[:\-.]?\s*|\d+[\.\)]\s*)/i, '').trim();
    if (!cleaned) continue;

    // Look for clauses containing measurements or common culinary keywords (preserve decimals like 1.5 cups)
    const segments = cleaned.split(/[,;]|\.\s+/).map(s => s.trim()).filter(Boolean);
    for (const segment of segments) {
      if (
        /\b(?:\d+|cup|cups|tbsp|tsp|pinch|handful|g|gram|kg|oz|clove|cloves|bunch|fillet|can|slice|slices)\b/i.test(segment) ||
        /\b(?:oil|butter|garlic|onion|ginger|egg|eggs|paneer|tofu|chicken|salmon|spinach|tomato|chickpea|chickpeas|salt|pepper|coriander|chili|cumin|turmeric)\b/i.test(segment)
      ) {
        // Clean out leading action verbs if convenient
        const simplified = segment.replace(/^(?:whisk|saut[ée]|heat|stir in|add|pour|toss|pat|sear|drain and rinse|dice|chop)\s+/i, '').trim();
        if (simplified && simplified.length > 2 && simplified.length <= 80) {
          extracted.push(simplified);
        }
      }
    }
  }

  // Deduplicate case-insensitively
  const seen = new Set<string>();
  const uniqueList: string[] = [];
  for (const item of extracted) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push(item);
    }
  }

  return uniqueList;
}

/**
 * Deterministically aggregates all ingredients across a day's meals.
 * Maintains meal source association (e.g. Breakfast vs Lunch vs Dinner).
 */
export function aggregateDayIngredients(meals: MealData[]): DailyIngredient[] {
  if (!Array.isArray(meals) || meals.length === 0) {
    return [];
  }

  const result: DailyIngredient[] = [];

  for (const meal of meals) {
    const mealName = meal.name || 'Meal';

    if (Array.isArray(meal.ingredients) && meal.ingredients.length > 0) {
      let index = 0;
      for (const rawItem of meal.ingredients) {
        if (typeof rawItem === 'string') {
          const trimmed = rawItem.trim();
          if (trimmed) {
            result.push({
              id: `${mealName}-${index++}`,
              text: trimmed,
              mealName
            });
          }
        }
      }
    } else if (meal.recipe) {
      const fallbackList = extractFallbackIngredients(meal.recipe);
      let index = 0;
      for (const fallback of fallbackList) {
        result.push({
          id: `${mealName}-fb-${index++}`,
          text: fallback,
          mealName
        });
      }
    }
  }

  return result;
}

/**
 * Filters aggregated daily ingredients by selected meal category.
 */
export function filterIngredientsByMeal(
  items: DailyIngredient[],
  selectedMeal: string
): DailyIngredient[] {
  if (!selectedMeal || selectedMeal.toLowerCase() === 'all') {
    return items;
  }
  return items.filter(
    item => item.mealName.toLowerCase() === selectedMeal.toLowerCase()
  );
}

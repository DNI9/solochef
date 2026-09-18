// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { 
  aggregateDayIngredients, 
  extractFallbackIngredients,
  filterIngredientsByMeal,
  DailyIngredient
} from '../ingredients';
import { MealData } from '../../data/meals';

describe('aggregateDayIngredients', () => {
  it('aggregates ingredients from multiple meals with meal source association', () => {
    const meals: MealData[] = [
      {
        name: 'Breakfast',
        title: 'Bhurji',
        type: 'Protein',
        time: '10m',
        emoji: '🍳',
        bg: 'bg-orange-100',
        border: 'border-orange-300',
        text: 'text-orange-900',
        ingredients: ['3 large eggs', '1 small onion (diced)', '1 tsp oil'],
        recipe: ['Step 1: Whisk eggs.']
      },
      {
        name: 'Lunch',
        title: 'Chickpea Bowl',
        type: 'Fiber',
        time: '15m',
        emoji: '🍛',
        bg: 'bg-green-100',
        border: 'border-green-300',
        text: 'text-green-900',
        ingredients: ['1 cup chickpeas', '1 cucumber', '1 tbsp olive oil'],
        recipe: ['Step 1: Drain chickpeas.']
      },
      {
        name: 'Dinner',
        title: 'Salmon',
        type: 'Protein',
        time: '20m',
        emoji: '🥣',
        bg: 'bg-indigo-100',
        border: 'border-indigo-300',
        text: 'text-indigo-900',
        ingredients: ['1 salmon fillet (6 oz)', '2 cloves garlic', '1 cup broccoli'],
        recipe: ['Step 1: Sear salmon.']
      }
    ];

    const result = aggregateDayIngredients(meals);

    expect(result).toHaveLength(9);
    expect(result[0]).toEqual({
      id: 'Breakfast-0',
      text: '3 large eggs',
      mealName: 'Breakfast'
    });
    expect(result[3]).toEqual({
      id: 'Lunch-0',
      text: '1 cup chickpeas',
      mealName: 'Lunch'
    });
    expect(result[6]).toEqual({
      id: 'Dinner-0',
      text: '1 salmon fillet (6 oz)',
      mealName: 'Dinner'
    });
  });

  it('handles empty meals array gracefully', () => {
    const result = aggregateDayIngredients([]);
    expect(result).toEqual([]);
  });

  it('uses fallback extractor when meals lack explicit ingredients', () => {
    const legacyMeals: MealData[] = [
      {
        name: 'Breakfast',
        title: 'Veggie Omelet',
        type: 'Protein',
        time: '10m',
        emoji: '🍳',
        bg: 'bg-orange-100',
        border: 'border-orange-300',
        text: 'text-orange-900',
        recipe: [
          'Step 1: Whisk 2 eggs in a bowl with salt and pepper.',
          'Step 2: Sauté diced bell pepper and spinach in olive oil.',
          'Step 3: Pour eggs and fold omelet gently.'
        ]
      }
    ];

    const result = aggregateDayIngredients(legacyMeals);
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(item => item.mealName === 'Breakfast')).toBe(true);
  });

  it('trims whitespace and ignores blank ingredient entries', () => {
    const meals: MealData[] = [
      {
        name: 'Lunch',
        title: 'Salad',
        type: 'Veg',
        time: '5m',
        emoji: '🥗',
        bg: 'bg-green-100',
        border: 'border-green-300',
        text: 'text-green-900',
        ingredients: ['  Crisp romaine lettuce  ', '   ', 'Cherry tomatoes'],
        recipe: ['Toss salad.']
      }
    ];

    const result = aggregateDayIngredients(meals);
    expect(result).toHaveLength(2);
    expect(result[0].text).toBe('Crisp romaine lettuce');
    expect(result[1].text).toBe('Cherry tomatoes');
  });
});

describe('filterIngredientsByMeal', () => {
  const items: DailyIngredient[] = [
    { id: 'Breakfast-0', text: 'Eggs', mealName: 'Breakfast' },
    { id: 'Lunch-0', text: 'Salad', mealName: 'Lunch' },
    { id: 'Dinner-0', text: 'Soup', mealName: 'Dinner' }
  ];

  it('returns all items when filter is "All"', () => {
    expect(filterIngredientsByMeal(items, 'All')).toHaveLength(3);
  });

  it('filters items correctly for a specific meal', () => {
    const lunchItems = filterIngredientsByMeal(items, 'Lunch');
    expect(lunchItems).toHaveLength(1);
    expect(lunchItems[0].text).toBe('Salad');
  });

  it('is case-insensitive when matching meal names', () => {
    const breakfastItems = filterIngredientsByMeal(items, 'breakfast');
    expect(breakfastItems).toHaveLength(1);
    expect(breakfastItems[0].text).toBe('Eggs');
  });
});

describe('extractFallbackIngredients', () => {
  it('extracts ingredient lines from step-by-step instructions', () => {
    const steps = [
      'Step 1: Heat 2 tbsp olive oil and add chopped onions.',
      'Step 2: Stir in minced garlic and cumin powder.',
      'Step 3: Serve warm.'
    ];

    const fallback = extractFallbackIngredients(steps);
    expect(fallback.length).toBeGreaterThan(0);
  });

  it('preserves decimal numbers in measurement clauses', () => {
    const steps = [
      'Step 1: Pour 1.5 cups of almond milk into saucepan and add 0.5 tsp cinnamon.'
    ];

    const fallback = extractFallbackIngredients(steps);
    expect(fallback.some(item => item.includes('1.5 cups'))).toBe(true);
  });

  it('returns empty array when recipe steps are empty', () => {
    expect(extractFallbackIngredients([])).toEqual([]);
  });
});


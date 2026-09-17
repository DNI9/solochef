import { describe, it, expect } from 'vitest';
import { validateMealPlan } from '../schema';

describe('validateMealPlan', () => {
  it('should parse valid meal plan', () => {
    const validJson = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          { name: 'Breakfast', title: 'A', type: 'B', time: '10m', emoji: '🍳', bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-900', recipe: 'C' },
          { name: 'Lunch', title: 'A', type: 'B', time: '10m', emoji: '🍛', bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-900', recipe: 'C' }
        ]
      },
      Tuesday: {
        prepAlert: "Prep this",
        meals: [
          { name: 'Breakfast', title: 'A', type: 'B', time: '10m', emoji: '🍳', bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-900', recipe: 'C' }
        ]
      },
      Wednesday: {
        prepAlert: null,
        meals: []
      },
      Thursday: {
        prepAlert: null,
        meals: []
      },
      Friday: {
        prepAlert: null,
        meals: []
      },
      Saturday: {
        prepAlert: null,
        meals: []
      },
      Sunday: {
        prepAlert: null,
        meals: []
      }
    });

    const parsed = validateMealPlan(validJson);
    expect(parsed.Monday.meals[0].title).toBe('A');
  });

  it('should throw on missing meal array', () => {
    const invalidJson = JSON.stringify({
      Monday: {}
    });
    expect(() => validateMealPlan(invalidJson)).toThrow('Missing or invalid meals array for Monday');
  });

  it('should throw on invalid JSON', () => {
    expect(() => validateMealPlan('{ invalid json }')).toThrow(/JSON/i);
  });
});

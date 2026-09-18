// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { validateMealPlan, SCHEMA_TEMPLATE, LLM_INSTRUCTION } from '../schema';

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
    expect(parsed.Monday?.meals[0]?.title).toBe('A');
  });

  it('should parse valid meal plan with recipe as an array of step strings', () => {
    const validJson = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Veggie Scramble',
            type: 'High-Protein',
            time: '10m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            recipe: [
              'Chop vegetables finely.',
              'Heat pan with 1 tsp oil.',
              'Scramble eggs and serve hot.'
            ]
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    });

    const parsed = validateMealPlan(validJson);
    expect(parsed.Monday?.meals[0]?.recipe).toEqual([
      'Chop vegetables finely.',
      'Heat pan with 1 tsp oil.',
      'Scramble eggs and serve hot.'
    ]);
  });

  it('should normalize single string recipe into an array of steps', () => {
    const validJson = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Simple Eggs',
            type: 'High-Protein',
            time: '5m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            recipe: 'Scramble 2 whole eggs.'
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    });

    const parsed = validateMealPlan(validJson);
    expect(parsed.Monday?.meals[0]?.recipe).toEqual(['Scramble 2 whole eggs.']);
  });

  it('should split multiline string recipe into an array of steps', () => {
    const validJson = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Multi-step Eggs',
            type: 'High-Protein',
            time: '10m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            recipe: '1. Heat pan.\n2. Crack eggs.\n3. Stir gently.'
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    });

    const parsed = validateMealPlan(validJson);
    expect(parsed.Monday?.meals[0]?.recipe).toEqual([
      '1. Heat pan.',
      '2. Crack eggs.',
      '3. Stir gently.'
    ]);
  });

  it('should throw when recipe array is empty', () => {
    const invalidJson = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Eggs',
            type: 'High-Protein',
            time: '5m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            recipe: []
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    });

    expect(() => validateMealPlan(invalidJson)).toThrow(/Invalid recipe for Monday Breakfast/i);
  });

  it('should throw when recipe array contains non-string items', () => {
    const invalidJson = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Eggs',
            type: 'High-Protein',
            time: '5m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            recipe: [123]
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    });

    expect(() => validateMealPlan(invalidJson)).toThrow(/Invalid recipe step at index 0 for Monday Breakfast/i);
  });

  it('should throw when recipe steps exceed maximum count of 25', () => {
    const tooManySteps = Array.from({ length: 26 }, (_, idx) => `Step ${idx + 1}`);
    const invalidJson = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Eggs',
            type: 'High-Protein',
            time: '5m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            recipe: tooManySteps
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    });

    expect(() => validateMealPlan(invalidJson)).toThrow(/Too many recipe steps for Monday Breakfast/i);
  });

  it('should throw when an individual recipe step is excessively long', () => {
    const hugeStep = 'a'.repeat(2001);
    const invalidJson = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Eggs',
            type: 'High-Protein',
            time: '5m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            recipe: [hugeStep]
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    });

    expect(() => validateMealPlan(invalidJson)).toThrow(/Recipe step at index 0 too long/i);
  });

  it('should parse valid meal plan with ingredients array', () => {
    const validJson = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Veggie Scramble',
            type: 'High-Protein',
            time: '10m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            ingredients: ['3 eggs', '1 onion', '1 tomato'],
            recipe: ['Whisk and cook.']
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    });

    const parsed = validateMealPlan(validJson);
    expect(parsed.Monday?.meals[0]?.ingredients).toEqual(['3 eggs', '1 onion', '1 tomato']);
  });

  it('should maintain backward compatibility when meals do not have ingredients', () => {
    const validLegacyJson = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Eggs',
            type: 'Protein',
            time: '5m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            recipe: ['Cook eggs.']
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    });

    const parsed = validateMealPlan(validLegacyJson);
    expect(parsed.Monday?.meals[0]?.ingredients).toBeUndefined();
  });

  it('should throw when ingredients is not an array of strings', () => {
    const invalidJson = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Eggs',
            type: 'Protein',
            time: '5m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            ingredients: 'not-an-array',
            recipe: ['Cook eggs.']
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    });

    expect(() => validateMealPlan(invalidJson)).toThrow(/Invalid ingredients for Monday Breakfast/i);
  });

  it('should throw when ingredients array exceeds maximum limit of 50 items', () => {
    const tooManyIngredients = Array.from({ length: 51 }, (_, i) => `Ingredient ${i + 1}`);
    const invalidJson = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Eggs',
            type: 'Protein',
            time: '5m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            ingredients: tooManyIngredients,
            recipe: ['Cook eggs.']
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    });

    expect(() => validateMealPlan(invalidJson)).toThrow(/Too many ingredients for Monday Breakfast/i);
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

describe('SCHEMA_TEMPLATE and LLM_INSTRUCTION', () => {
  it('SCHEMA_TEMPLATE should show recipe as an array of step instructions', () => {
    expect(SCHEMA_TEMPLATE).toContain('"recipe": [');
    expect(SCHEMA_TEMPLATE).toMatch(/Step 1/i);
  });

  it('SCHEMA_TEMPLATE should include quantified ingredients per meal', () => {
    expect(SCHEMA_TEMPLATE).toContain('"ingredients": [');
    expect(SCHEMA_TEMPLATE).toMatch(/3 large eggs/i);
  });

  it('LLM_INSTRUCTION should instruct LLMs to generate step-by-step numbered recipe instructions and meal ingredients', () => {
    expect(LLM_INSTRUCTION).toBeTruthy();
    expect(LLM_INSTRUCTION).toMatch(/step-by-step/i);
    expect(LLM_INSTRUCTION).toMatch(/ingredients/i);
    expect(LLM_INSTRUCTION).toContain(SCHEMA_TEMPLATE);
  });
});



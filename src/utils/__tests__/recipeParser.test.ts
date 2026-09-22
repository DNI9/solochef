import { describe, it, expect } from 'vitest';
import { normalizeRecipeSteps, extractStepIngredients } from '../recipeParser';
import { RecipeStep } from '../../types/cookMode';

describe('recipeParser', () => {
  describe('normalizeRecipeSteps', () => {
    it('should handle structured RecipeStep[]', () => {
      const input: RecipeStep[] = [{ text: "Heat oil", timer: 120, timerLabel: "Heat oil", prep: "Chop onion" }];
      const output = normalizeRecipeSteps(input);
      expect(output).toEqual(input);
    });

    it('should handle string array with legacy "Step 1: ..." prefixes', () => {
      const input = [
        "Step 1: Heat oil in kadai.",
        "Step 2: Sauté for 2 mins until golden.",
        "Step 3: Serve hot."
      ];
      const output = normalizeRecipeSteps(input);
      expect(output).toHaveLength(3);
      expect(output[0].text).toBe("Heat oil in kadai.");
      expect(output[1].text).toBe("Sauté for 2 mins until golden.");
      expect(output[1].timer).toBe(120);
      expect(output[2].text).toBe("Serve hot.");
    });

    it('should handle newline-delimited string', () => {
      const input = "Step 1: Boil water\nStep 2: Add pasta for 10 minutes\nStep 3: Drain";
      const output = normalizeRecipeSteps(input);
      expect(output).toHaveLength(3);
      expect(output[0].text).toBe("Boil water");
      expect(output[1].text).toBe("Add pasta for 10 minutes");
      expect(output[1].timer).toBe(600);
      expect(output[2].text).toBe("Drain");
    });

    it('should handle empty or invalid inputs', () => {
      expect(normalizeRecipeSteps([])).toEqual([]);
      expect(normalizeRecipeSteps("")).toEqual([]);
      expect(normalizeRecipeSteps(["", "  "])).toEqual([]);
    });
  });

  describe('extractStepIngredients', () => {
    it('should extract ingredients present in the step text', () => {
      const ingredients = ["1 tsp oil", "1 tbsp raw peanuts", "1/2 onion (diced)"];
      const stepText = "Heat oil in kadai and fry raw peanuts.";
      const result = extractStepIngredients(stepText, ingredients);
      // It is acceptable if order is different, but checking exact match for now
      expect(result).toEqual(expect.arrayContaining(["1 tsp oil", "1 tbsp raw peanuts"]));
      expect(result.length).toBe(2);
    });

    it('should use case-insensitive keyword matching', () => {
      const ingredients = ["1 Tbsp RAW Peanuts", "Oil"];
      const stepText = "Heat oil in kadai and fry raw peanuts.";
      const result = extractStepIngredients(stepText, ingredients);
      expect(result).toEqual(expect.arrayContaining(["1 Tbsp RAW Peanuts", "Oil"]));
      expect(result.length).toBe(2);
    });

    it('should return empty array if no matches', () => {
      const ingredients = ["1 tsp oil", "1 tbsp raw peanuts"];
      const stepText = "Boil water in a pan.";
      const result = extractStepIngredients(stepText, ingredients);
      expect(result).toEqual([]);
    });
  });
});

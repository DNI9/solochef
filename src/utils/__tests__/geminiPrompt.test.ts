import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildGeminiRecipePrompt,
  canUseWebShare,
  shareToGemini,
} from '../geminiPrompt';

describe('geminiPrompt utility', () => {
  describe('buildGeminiRecipePrompt', () => {
    it('generates a formatted prompt with title, ingredients, and recipe steps', () => {
      const prompt = buildGeminiRecipePrompt({
        title: 'Lemon Garlic Salmon',
        ingredients: ['200g salmon fillet', '2 cloves garlic', '1 tbsp olive oil', '1/2 lemon'],
        recipe: ['Season the salmon', 'Sear in olive oil for 4 mins per side', 'Drizzle lemon juice'],
      });

      expect(prompt).toContain('I am cooking Lemon Garlic Salmon.');
      expect(prompt).toContain('Ingredients:');
      expect(prompt).toContain('- 200g salmon fillet');
      expect(prompt).toContain('- 2 cloves garlic');
      expect(prompt).toContain('Instructions:');
      expect(prompt).toContain('1. Season the salmon');
      expect(prompt).toContain('2. Sear in olive oil for 4 mins per side');
      expect(prompt).toContain('3. Drizzle lemon juice');
      expect(prompt).toContain('Cooking techniques, tips, and common mistakes to avoid');
      expect(prompt).toContain('Ingredient substitutions');
      expect(prompt).toContain('Nutritional overview');
    });

    it('handles missing ingredients gracefully', () => {
      const prompt = buildGeminiRecipePrompt({
        title: 'Quick Scrambled Eggs',
        recipe: 'Whisk eggs and cook on low heat.',
      });

      expect(prompt).toContain('I am cooking Quick Scrambled Eggs.');
      expect(prompt).not.toContain('Ingredients:');
      expect(prompt).toContain('Instructions:');
      expect(prompt).toContain('1. Whisk eggs and cook on low heat.');
    });

    it('handles string recipe with newlines', () => {
      const prompt = buildGeminiRecipePrompt({
        title: 'Simple Toast',
        recipe: 'Toast bread.\nSpread butter.',
      });

      expect(prompt).toContain('1. Toast bread.');
      expect(prompt).toContain('2. Spread butter.');
    });

    it('handles empty recipe steps gracefully', () => {
      const prompt = buildGeminiRecipePrompt({
        title: 'Fresh Apple Slices',
        ingredients: ['1 crisp apple'],
      });

      expect(prompt).toContain('I am cooking Fresh Apple Slices.');
      expect(prompt).toContain('- 1 crisp apple');
      expect(prompt).not.toContain('Instructions:');
    });

    it('sanitizes input strings and handles special characters safely', () => {
      const prompt = buildGeminiRecipePrompt({
        title: 'Mom\'s "Special" & <Zesty> Pasta 🍝',
        ingredients: ['Pasta & tomato sauce', '<Basil leaves>'],
        recipe: ['Boil & drain', 'Mix with "secret" sauce'],
      });

      expect(prompt).toContain('Mom\'s "Special" & <Zesty> Pasta 🍝');
      expect(prompt).toContain('- Pasta & tomato sauce');
      expect(prompt).toContain('- <Basil leaves>');
    });
  });

  describe('canUseWebShare', () => {
    const originalNavigator = globalThis.navigator;

    afterEach(() => {
      Object.defineProperty(globalThis, 'navigator', {
        value: originalNavigator,
        configurable: true,
        writable: true,
      });
    });

    it('returns true when navigator.share is a function', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: { share: vi.fn() },
        configurable: true,
        writable: true,
      });

      expect(canUseWebShare()).toBe(true);
    });

    it('returns false when navigator.share is undefined', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {},
        configurable: true,
        writable: true,
      });

      expect(canUseWebShare()).toBe(false);
    });
  });

  describe('shareToGemini', () => {
    const originalNavigator = globalThis.navigator;
    const originalOpen = window.open;

    beforeEach(() => {
      window.open = vi.fn();
    });

    afterEach(() => {
      Object.defineProperty(globalThis, 'navigator', {
        value: originalNavigator,
        configurable: true,
        writable: true,
      });
      window.open = originalOpen;
      vi.restoreAllMocks();
    });

    it('calls navigator.share when available and returns "shared"', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(globalThis, 'navigator', {
        value: { share: mockShare },
        configurable: true,
        writable: true,
      });

      const result = await shareToGemini({
        title: 'Lemon Salmon',
        ingredients: ['Salmon', 'Lemon'],
      });

      expect(result).toBe('shared');
      expect(mockShare).toHaveBeenCalledTimes(1);
      const shareArg = mockShare.mock.calls[0][0];
      expect(shareArg.title).toBe('Ask Gemini: Lemon Salmon');
      expect(shareArg.text).toContain('I am cooking Lemon Salmon.');
      expect(window.open).not.toHaveBeenCalled();
    });

    it('catches AbortError when user dismisses the native share sheet and returns "aborted"', async () => {
      const abortError = new DOMException('Share canceled', 'AbortError');
      const mockShare = vi.fn().mockRejectedValue(abortError);
      Object.defineProperty(globalThis, 'navigator', {
        value: { share: mockShare },
        configurable: true,
        writable: true,
      });

      const result = await shareToGemini({
        title: 'Lemon Salmon',
      });

      expect(result).toBe('aborted');
      expect(mockShare).toHaveBeenCalledTimes(1);
      expect(window.open).not.toHaveBeenCalled();
    });

    it('falls back to opening gemini.google.com/app when navigator.share is unsupported', async () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {},
        configurable: true,
        writable: true,
      });

      const result = await shareToGemini({
        title: 'Lemon Salmon',
      });

      expect(result).toBe('fallback');
      expect(window.open).toHaveBeenCalledWith('https://gemini.google.com/app', '_blank', 'noopener,noreferrer');
    });

    it('falls back to opening gemini.google.com/app if navigator.share throws a non-abort error', async () => {
      const genericError = new Error('Permission denied');
      const mockShare = vi.fn().mockRejectedValue(genericError);
      Object.defineProperty(globalThis, 'navigator', {
        value: { share: mockShare },
        configurable: true,
        writable: true,
      });

      const result = await shareToGemini({
        title: 'Lemon Salmon',
      });

      expect(result).toBe('fallback');
      expect(window.open).toHaveBeenCalledWith('https://gemini.google.com/app', '_blank', 'noopener,noreferrer');
    });
  });
});

/**
 * Utility for constructing and sharing recipe prompts to Google Gemini.
 * Uses the Web Share API (ACTION_SEND) so mobile devices pre-fill the prompt
 * directly in Gemini with zero manual copying or pasting.
 */

export interface RecipePromptOptions {
  title: string;
  ingredients?: string[];
  recipe?: string[] | string;
}

/**
 * Builds a structured, context-rich recipe prompt suitable for asking Gemini.
 */
export function buildGeminiRecipePrompt({
  title,
  ingredients,
  recipe,
}: RecipePromptOptions): string {
  const parts: string[] = [];

  parts.push(`I am cooking ${title.trim()}.`);

  // Ingredients section
  if (ingredients && ingredients.length > 0) {
    const validIngredients = ingredients.map((i) => i.trim()).filter(Boolean);
    if (validIngredients.length > 0) {
      parts.push('\nIngredients:');
      for (const ing of validIngredients) {
        parts.push(`- ${ing}`);
      }
    }
  }

  // Instructions section
  if (recipe) {
    const steps: string[] = [];
    if (Array.isArray(recipe)) {
      for (const step of recipe) {
        const trimmed = step.trim();
        if (trimmed) steps.push(trimmed);
      }
    } else if (typeof recipe === 'string') {
      const splitSteps = recipe.split(/\r?\n+/);
      for (const step of splitSteps) {
        const trimmed = step.trim();
        if (trimmed) steps.push(trimmed);
      }
    }

    if (steps.length > 0) {
      parts.push('\nInstructions:');
      steps.forEach((step, idx) => {
        // Strip duplicate numbering if present
        const cleaned = step.replace(/^(?:step\s*\d+[:\-.]?\s*|\d+[\.\)]\s*)/i, '').trim();
        parts.push(`${idx + 1}. ${cleaned || step}`);
      });
    }
  }

  // Gemini guidance questions
  parts.push('\nPlease provide detailed guidance on this recipe:');
  parts.push('1. Cooking techniques, tips, and common mistakes to avoid.');
  parts.push('2. Ingredient substitutions if anything is missing.');
  parts.push('3. Nutritional overview and portion sizing.');
  parts.push('4. Quick pairing suggestions or side dishes.');

  return parts.join('\n');
}

/**
 * Checks if the browser supports the Web Share API for sharing text.
 */
export function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Shares the recipe prompt directly to the Gemini app (or native share sheet) via Web Share API.
 * If unsupported or error occurs, falls back gracefully to opening gemini.google.com/app.
 */
export async function shareToGemini(
  options: RecipePromptOptions
): Promise<'shared' | 'fallback' | 'aborted'> {
  const promptText = buildGeminiRecipePrompt(options);

  if (canUseWebShare()) {
    try {
      await navigator.share({
        title: `Ask Gemini: ${options.title}`,
        text: promptText,
      });
      return 'shared';
    } catch (err: unknown) {
      const errorName =
        err && typeof err === 'object' && 'name' in err
          ? (err as { name?: string }).name
          : '';
      if (errorName === 'AbortError') {
        // User closed or dismissed the share sheet - not an error
        return 'aborted';
      }
      // Any other error (e.g. permission or platform restriction): fall back to web
    }
  }

  // Fallback: Attempt to copy to clipboard for user convenience, then open Gemini web app
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(promptText);
    } catch {
      // Non-critical: clipboard write failed or was blocked by permissions
    }
  }

  if (typeof window !== 'undefined') {
    window.open('https://gemini.google.com/app', '_blank', 'noopener,noreferrer');
  }
  return 'fallback';
}

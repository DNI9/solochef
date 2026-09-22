import { RecipeStep, RecipeInput } from '../types/cookMode';
import type { ExportEnvelope } from '../utils/planExport';

export type { RecipeStep, RecipeInput, ExportEnvelope };

export interface SavedPlanItem {
  id: string;
  name: string;
  savedAt: string;
  plan: MealPlanData;
}

export interface MealData {
  name: string;
  title: string;
  type: string;
  time: string;
  emoji: string;
  bg: string;
  border: string;
  text: string;
  ingredients?: string[];
  recipe: RecipeInput;
}
export interface DayPlan { prepAlert: string | null; meals: MealData[]; }

export interface GroceryCategory {
  category: string;
  items: string[];
}

export type MealPlanData = {
  [day in 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday']?: DayPlan;
} & {
  groceries?: GroceryCategory[];
};

export const MEAL_DATABASE: MealPlanData = {};

export const GROCERY_LIST: GroceryCategory[] = [];

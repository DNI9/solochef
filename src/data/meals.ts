export interface MealData { name: string; title: string; type: string; time: string; emoji: string; bg: string; border: string; text: string; recipe: string; }
export interface DayPlan { prepAlert: string | null; meals: MealData[]; }
export const MEAL_DATABASE: Record<string, DayPlan> = {};

export const GROCERY_LIST: { category: string; items: string[] }[] = [];

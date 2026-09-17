import { MealPlanData, GroceryCategory } from '../data/meals';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const SCHEMA_TEMPLATE = `{
  "Monday": {
    "prepAlert": "String or null",
    "meals": [
      { "name": "Breakfast", "title": "String", "type": "String", "time": "String", "emoji": "🍳", "bg": "bg-orange-100", "border": "border-orange-300", "text": "text-orange-900", "recipe": "String" },
      { "name": "Lunch", "title": "String", "type": "String", "time": "String", "emoji": "🍛", "bg": "bg-green-100", "border": "border-green-300", "text": "text-green-900", "recipe": "String" },
      { "name": "Dinner", "title": "String", "type": "String", "time": "String", "emoji": "🥣", "bg": "bg-indigo-100", "border": "border-indigo-300", "text": "text-indigo-900", "recipe": "String" }
    ]
  },
  "Tuesday": { /* same structure as Monday */ },
  "Wednesday": { /* same structure as Monday */ },
  "Thursday": { /* same structure as Monday */ },
  "Friday": { /* same structure as Monday */ },
  "Saturday": { /* same structure as Monday */ },
  "Sunday": { /* same structure as Monday */ },
  "groceries": [
    {
      "category": "String",
      "items": ["String"]
    }
  ]
}`;

export function validateMealPlan(jsonString: string): MealPlanData {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error("Root must be a JSON object");

    const sanitizedPlan: MealPlanData = {};

    for (const day of DAYS) {
      if (!data[day]) throw new Error(`Missing day: ${day}`);
      const dayData = data[day];
      
      if (dayData.prepAlert !== undefined && dayData.prepAlert !== null && typeof dayData.prepAlert !== 'string') {
         throw new Error(`Invalid prepAlert for ${day}, must be string or null`);
      }

      if (!Array.isArray(dayData.meals)) {
        throw new Error(`Missing or invalid meals array for ${day}`);
      }
      
      if (dayData.meals.length > 10) {
        throw new Error(`Too many meals for ${day} (max 10)`);
      }

      const sanitizedMeals = [];
      for (let i = 0; i < dayData.meals.length; i++) {
        const m = dayData.meals[i];
        if (!m || typeof m !== 'object') throw new Error(`Invalid meal object for ${day} at index ${i}`);
        if (typeof m.name !== 'string') throw new Error(`Invalid name for ${day} meal at index ${i}`);
        if (typeof m.title !== 'string') throw new Error(`Invalid title for ${day} ${m.name}`);
        if (typeof m.type !== 'string') throw new Error(`Invalid type for ${day} ${m.name}`);
        if (typeof m.time !== 'string') throw new Error(`Invalid time for ${day} ${m.name}`);
        if (typeof m.emoji !== 'string') throw new Error(`Invalid emoji for ${day} ${m.name}`);
        if (typeof m.bg !== 'string' || !/^[a-zA-Z0-9\-\[\]#\/]+$/.test(m.bg)) throw new Error(`Invalid bg for ${day} ${m.name}`);
        if (typeof m.border !== 'string' || !/^[a-zA-Z0-9\-\[\]#\/]+$/.test(m.border)) throw new Error(`Invalid border for ${day} ${m.name}`);
        if (typeof m.text !== 'string' || !/^[a-zA-Z0-9\-\[\]#\/]+$/.test(m.text)) throw new Error(`Invalid text for ${day} ${m.name}`);
        if (typeof m.recipe !== 'string') throw new Error(`Invalid recipe for ${day} ${m.name}`);
        
        sanitizedMeals.push({
          name: m.name, title: m.title, type: m.type, time: m.time, emoji: m.emoji, bg: m.bg, border: m.border, text: m.text, recipe: m.recipe
        });
      }
      
      sanitizedPlan[day] = {
        prepAlert: dayData.prepAlert || null,
        meals: sanitizedMeals
      };
    }
    
    // Validate groceries if present
    if (data.groceries) {
      if (!Array.isArray(data.groceries)) {
        throw new Error("groceries must be an array");
      }
      if (data.groceries.length > 50) {
        throw new Error("Too many grocery categories (max 50)");
      }
      
      const sanitizedGroceries: GroceryCategory[] = [];
      for (let i = 0; i < data.groceries.length; i++) {
        const g = data.groceries[i];
        if (!g || typeof g !== 'object') throw new Error(`Invalid grocery category object at index ${i}`);
        if (typeof g.category !== 'string') throw new Error(`Invalid category for grocery list at index ${i}`);
        if (!Array.isArray(g.items)) throw new Error(`Invalid items array for grocery list at index ${i}`);
        if (g.items.length > 100) throw new Error(`Too many grocery items in category ${g.category} (max 100)`);
        
        const sanitizedItems = [];
        for (let j = 0; j < g.items.length; j++) {
          if (typeof g.items[j] !== 'string') throw new Error(`Invalid item for grocery list at index ${i}, item ${j}`);
          sanitizedItems.push(g.items[j]);
        }
        sanitizedGroceries.push({
          category: g.category,
          items: sanitizedItems
        });
      }
      sanitizedPlan.groceries = sanitizedGroceries;
    }
    
    return sanitizedPlan;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Invalid JSON format");
  }
}

import { DayPlan } from '../data/meals';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

export function validateMealPlan(jsonString: string): any {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error("Root must be a JSON object");

    for (const day of DAYS) {
      if (!data[day]) throw new Error(`Missing day: ${day}`);
      const dayData = data[day];
      
      if (dayData.prepAlert !== undefined && dayData.prepAlert !== null && typeof dayData.prepAlert !== 'string') {
         throw new Error(`Invalid prepAlert for ${day}, must be string or null`);
      }

      if (!Array.isArray(dayData.meals)) {
        throw new Error(`Missing or invalid meals array for ${day}`);
      }

      for (let i = 0; i < dayData.meals.length; i++) {
        const m = dayData.meals[i];
        if (typeof m.name !== 'string') throw new Error(`Invalid name for ${day} meal at index ${i}`);
        if (typeof m.title !== 'string') throw new Error(`Invalid title for ${day} ${m.name}`);
        if (typeof m.type !== 'string') throw new Error(`Invalid type for ${day} ${m.name}`);
        if (typeof m.time !== 'string') throw new Error(`Invalid time for ${day} ${m.name}`);
        if (typeof m.emoji !== 'string') throw new Error(`Invalid emoji for ${day} ${m.name}`);
        if (typeof m.bg !== 'string') throw new Error(`Invalid bg for ${day} ${m.name}`);
        if (typeof m.border !== 'string') throw new Error(`Invalid border for ${day} ${m.name}`);
        if (typeof m.text !== 'string') throw new Error(`Invalid text for ${day} ${m.name}`);
        if (typeof m.recipe !== 'string') throw new Error(`Invalid recipe for ${day} ${m.name}`);
      }
    }
    
    // Validate groceries if present
    if (data.groceries) {
      if (!Array.isArray(data.groceries)) {
        throw new Error("groceries must be an array");
      }
      for (let i = 0; i < data.groceries.length; i++) {
        const g = data.groceries[i];
        if (typeof g.category !== 'string') throw new Error(`Invalid category for grocery list at index ${i}`);
        if (!Array.isArray(g.items)) throw new Error(`Invalid items array for grocery list at index ${i}`);
        for (let j = 0; j < g.items.length; j++) {
          if (typeof g.items[j] !== 'string') throw new Error(`Invalid item for grocery list at index ${i}, item ${j}`);
        }
      }
    }
    
    return data as any;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Invalid JSON format");
  }
}

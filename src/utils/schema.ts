import { MealPlanData, GroceryCategory } from '../data/meals';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const SCHEMA_TEMPLATE = `{
  "Monday": {
    "prepAlert": "String or null (e.g. 'Chop 2 onions and store in airtight container')",
    "meals": [
      {
        "name": "Breakfast",
        "title": "String (e.g. '3-Egg Veggie Bhurji')",
        "type": "String (e.g. 'High-Protein')",
        "time": "String (e.g. '10m')",
        "emoji": "🍳",
        "bg": "bg-orange-100",
        "border": "border-orange-300",
        "text": "text-orange-900",
        "recipe": [
          "Step 1: Whisk 3 eggs with a pinch of turmeric, chili powder, and salt.",
          "Step 2: Heat 1 tsp oil in a skillet and sauté finely chopped onions and tomatoes for 2 mins.",
          "Step 3: Pour eggs into the pan and scramble gently over medium-low heat until soft curds form.",
          "Step 4: Garnish with fresh coriander and serve immediately."
        ]
      },
      {
        "name": "Lunch",
        "title": "String (e.g. 'Mediterranean Chickpea Power Bowl')",
        "type": "String (e.g. 'Fiber-First')",
        "time": "String (e.g. '15m')",
        "emoji": "🍛",
        "bg": "bg-green-100",
        "border": "border-green-300",
        "text": "text-green-900",
        "recipe": [
          "Step 1: Drain and rinse 1 cup of canned chickpeas.",
          "Step 2: Dice cucumbers, cherry tomatoes, and kalamata olives.",
          "Step 3: Whisk olive oil, lemon juice, dried oregano, salt, and black pepper.",
          "Step 4: Toss chickpeas, vegetables, and dressing together over a bed of baby spinach."
        ]
      },
      {
        "name": "Dinner",
        "title": "String (e.g. 'Garlic Herb Butter Salmon')",
        "type": "String (e.g. 'High-Protein')",
        "time": "String (e.g. '20m')",
        "emoji": "🥣",
        "bg": "bg-indigo-100",
        "border": "border-indigo-300",
        "text": "text-indigo-900",
        "recipe": [
          "Step 1: Pat salmon fillet dry and season both sides with salt and black pepper.",
          "Step 2: Melt butter in a non-stick skillet over medium-high heat with minced garlic.",
          "Step 3: Sear salmon skin-side down for 4 mins, flip and baste for 3 more mins.",
          "Step 4: Drizzle with fresh lemon juice and serve with steamed broccoli."
        ]
      }
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
      "category": "String (e.g. 'Fresh Produce')",
      "items": ["String (e.g. 'Eggs (1 dozen)')", "String (e.g. 'Spinach (200g)')"]
    }
  ]
}`;

export const LLM_INSTRUCTION = `You are an expert chef and solo-living meal planner. Generate a complete 7-day meal plan (Monday through Sunday) designed for zero energy crashes and maximum cooking efficiency.

CRITICAL REQUIREMENTS:
1. Days: Include all 7 days: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday".
2. Meals: For each day, include 3 meals ("Breakfast", "Lunch", "Dinner").
3. Step-by-Step Recipes: The "recipe" field for EVERY meal MUST be an array of strings representing sequential, numbered step-by-step cooking instructions (e.g. ["Step 1: ...", "Step 2: ...", "Step 3: ..."]). Do NOT return a single text block.
4. Meal Styling:
   - Breakfast: bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-900"
   - Lunch: bg: "bg-green-100", border: "border-green-300", text: "text-green-900"
   - Dinner: bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-900"
5. Grocery List: Include a consolidated "groceries" array grouped by category with quantified items.
6. Output: Output strictly valid JSON matching this schema with no markdown formatting ticks or conversational filler.

JSON SCHEMA:
${SCHEMA_TEMPLATE}`;

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
        if (typeof m.name !== 'string' || m.name.length > 100) throw new Error(`Invalid name for ${day} meal at index ${i}`);
        if (typeof m.title !== 'string' || m.title.length > 200) throw new Error(`Invalid title for ${day} ${m.name}`);
        if (typeof m.type !== 'string' || m.type.length > 100) throw new Error(`Invalid type for ${day} ${m.name}`);
        if (typeof m.time !== 'string' || m.time.length > 50) throw new Error(`Invalid time for ${day} ${m.name}`);
        if (typeof m.emoji !== 'string' || m.emoji.length > 20) throw new Error(`Invalid emoji for ${day} ${m.name}`);
        if (typeof m.bg !== 'string' || m.bg.length > 100 || !/^[a-zA-Z0-9\-\[\]#\/]+$/.test(m.bg)) throw new Error(`Invalid bg for ${day} ${m.name}`);
        if (typeof m.border !== 'string' || m.border.length > 100 || !/^[a-zA-Z0-9\-\[\]#\/]+$/.test(m.border)) throw new Error(`Invalid border for ${day} ${m.name}`);
        if (typeof m.text !== 'string' || m.text.length > 100 || !/^[a-zA-Z0-9\-\[\]#\/]+$/.test(m.text)) throw new Error(`Invalid text for ${day} ${m.name}`);
        
        let recipeSteps: string[] = [];
        if (Array.isArray(m.recipe)) {
          if (m.recipe.length === 0) {
            throw new Error(`Invalid recipe for ${day} ${m.name}: recipe steps array cannot be empty`);
          }
          if (m.recipe.length > 25) {
            throw new Error(`Too many recipe steps for ${day} ${m.name} (max 25)`);
          }
          for (let s = 0; s < m.recipe.length; s++) {
            const step = m.recipe[s];
            if (typeof step !== 'string' || !step.trim()) {
              throw new Error(`Invalid recipe step at index ${s} for ${day} ${m.name}`);
            }
            if (step.length > 2000) {
              throw new Error(`Recipe step at index ${s} too long for ${day} ${m.name} (max 2000 chars)`);
            }
            recipeSteps.push(step.trim());
          }
        } else if (typeof m.recipe === 'string' && m.recipe.trim()) {
          if (m.recipe.length > 10000) {
            throw new Error(`Recipe text too long for ${day} ${m.name} (max 10000 chars)`);
          }
          const lines = m.recipe
            .split(/\r?\n+/)
            .map((s: string) => s.trim())
            .filter(Boolean);
          if (lines.length > 25) {
            throw new Error(`Too many recipe steps for ${day} ${m.name} (max 25)`);
          }
          recipeSteps = lines.length > 0 ? lines : [m.recipe.trim()];
        } else {
          throw new Error(`Invalid recipe for ${day} ${m.name}`);
        }
        
        sanitizedMeals.push({
          name: m.name, title: m.title, type: m.type, time: m.time, emoji: m.emoji, bg: m.bg, border: m.border, text: m.text, recipe: recipeSteps
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

import { MealPlanData } from './meals';

export interface PresetMeta {
  id: string;
  title: string;
  description: string;
  emoji: string;
  tag: string;
  prepTime: string;
  highlights: string[];
  data: MealPlanData;
}

export const ANTI_SLUMP_PLAN: MealPlanData = {
  Monday: {
    prepAlert: "Hard boil 4 eggs and rinse canned chickpeas for quick lunches.",
    meals: [
      {
        name: "Breakfast",
        title: "3-Egg Veggie Bhurji",
        type: "High-Protein",
        time: "10m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "3 large eggs",
          "1/2 red onion (finely diced)",
          "1 medium tomato (diced)",
          "1 green chili (finely chopped)",
          "1/4 tsp turmeric & salt",
          "1 tsp olive oil"
        ],
        recipe: [
          "Step 1: Whisk eggs with turmeric and a pinch of salt.",
          "Step 2: Sauté onion, tomato, and chili in oil for 2 mins.",
          "Step 3: Pour eggs and scramble gently until soft curds form."
        ]
      },
      {
        name: "Lunch",
        title: "Mediterranean Chickpea Power Bowl",
        type: "Fiber-First",
        time: "10m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup canned chickpeas (rinsed)",
          "1 cup baby spinach",
          "8 cherry tomatoes (halved)",
          "1/2 cucumber (diced)",
          "1 tbsp olive oil & lemon juice",
          "1 tbsp crumbled feta"
        ],
        recipe: [
          "Step 1: Place spinach in a bowl and top with rinsed chickpeas.",
          "Step 2: Add tomatoes, cucumber, and feta.",
          "Step 3: Whisk olive oil, lemon juice, salt, and pepper; toss together."
        ]
      },
      {
        name: "Dinner",
        title: "Garlic Butter Salmon & Broccoli",
        type: "High-Protein",
        time: "15m",
        emoji: "🐟",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 salmon fillet (6 oz)",
          "1.5 cups broccoli florets",
          "1 tbsp butter",
          "2 cloves garlic (minced)",
          "1 tbsp lemon juice"
        ],
        recipe: [
          "Step 1: Melt butter in a skillet over medium-high heat with minced garlic.",
          "Step 2: Sear salmon 4 mins per side until golden.",
          "Step 3: Steam broccoli alongside with a splash of water for 3 mins."
        ]
      }
    ]
  },
  Tuesday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Greek Yogurt Berry & Chia Bowl",
        type: "High-Protein",
        time: "5m",
        emoji: "🫐",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1 cup Greek yogurt (plain)",
          "1/2 cup mixed berries",
          "1 tbsp chia seeds",
          "1 tbsp crushed walnuts",
          "1 tsp honey"
        ],
        recipe: [
          "Step 1: Spoon Greek yogurt into a bowl.",
          "Step 2: Top with berries, chia seeds, and walnuts.",
          "Step 3: Drizzle with honey and serve cold."
        ]
      },
      {
        name: "Lunch",
        title: "Turkey & Avocado High-Fiber Wrap",
        type: "Balanced",
        time: "10m",
        emoji: "🌯",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 whole wheat tortilla wrap",
          "4 slices roast turkey breast",
          "1/2 avocado (sliced)",
          "1 cup mixed greens",
          "1 tsp Dijon mustard"
        ],
        recipe: [
          "Step 1: Spread mustard across the center of the tortilla.",
          "Step 2: Layer turkey slices, avocado, and greens.",
          "Step 3: Roll tightly, slice in half, and enjoy."
        ]
      },
      {
        name: "Dinner",
        title: "One-Skillet Lemon Herb Chicken Breast",
        type: "High-Protein",
        time: "20m",
        emoji: "🍗",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 chicken breast (cut into cutlets)",
          "1 zucchini (sliced into rounds)",
          "1 tbsp olive oil",
          "1 tsp Italian seasoning",
          "1/2 lemon (juiced)"
        ],
        recipe: [
          "Step 1: Season chicken cutlets with herbs, salt, and pepper.",
          "Step 2: Pan-sear chicken in olive oil for 4 mins per side.",
          "Step 3: Toss zucchini in the pan for the last 3 mins with lemon juice."
        ]
      }
    ]
  },
  Wednesday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Avocado & Jammy Boiled Egg Toast",
        type: "Fiber-First",
        time: "8m",
        emoji: "🥑",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1 thick slice sourdough or sprouted bread",
          "1/2 ripe avocado",
          "2 pre-boiled eggs (sliced)",
          "Pinch red pepper flakes & salt"
        ],
        recipe: [
          "Step 1: Toast bread until crunchy.",
          "Step 2: Mash avocado directly on toast with salt.",
          "Step 3: Top with sliced boiled eggs and chili flakes."
        ]
      },
      {
        name: "Lunch",
        title: "Tuna & White Bean Protein Salad",
        type: "High-Protein",
        time: "10m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 can solid light tuna (drained)",
          "1 cup canned white cannellini beans",
          "1 stalk celery (diced)",
          "1 tbsp olive oil",
          "1 tbsp lemon juice & parsley"
        ],
        recipe: [
          "Step 1: Combine drained tuna and white beans in a bowl.",
          "Step 2: Stir in diced celery, olive oil, and lemon juice.",
          "Step 3: Season with black pepper and parsley."
        ]
      },
      {
        name: "Dinner",
        title: "15-Minute Ground Turkey & Zucchini Sauté",
        type: "Low-GI",
        time: "15m",
        emoji: "🥘",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "150g lean ground turkey",
          "1 medium zucchini (diced)",
          "1/2 bell pepper (diced)",
          "1 tsp garlic powder & cumin",
          "1 tbsp olive oil"
        ],
        recipe: [
          "Step 1: Brown ground turkey in olive oil for 5 mins.",
          "Step 2: Add zucchini, bell pepper, garlic, and cumin.",
          "Step 3: Sauté on high heat for 4 mins until tender-crisp."
        ]
      }
    ]
  },
  Thursday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Spinach & Feta Protein Omelette",
        type: "High-Protein",
        time: "10m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "3 large eggs",
          "1 cup baby spinach",
          "2 tbsp feta cheese",
          "1 tsp olive oil",
          "Pinch black pepper"
        ],
        recipe: [
          "Step 1: Whisk eggs with black pepper.",
          "Step 2: Wilt spinach in olive oil for 1 min in a small non-stick pan.",
          "Step 3: Pour eggs over spinach, scatter feta, and fold over after 3 mins."
        ]
      },
      {
        name: "Lunch",
        title: "Warm Spiced Chickpea & Hummus Bowl",
        type: "Fiber-First",
        time: "10m",
        emoji: "🍲",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup canned chickpeas",
          "2 tbsp classic hummus",
          "1 mini cucumber (diced)",
          "1/2 tsp cumin & paprika",
          "1 tsp olive oil"
        ],
        recipe: [
          "Step 1: Toss chickpeas in a pan with olive oil, cumin, and paprika for 3 mins.",
          "Step 2: Spread hummus at the base of your bowl.",
          "Step 3: Top with warm chickpeas and diced cucumber."
        ]
      },
      {
        name: "Dinner",
        title: "Pan-Seared White Fish with Asparagus",
        type: "High-Protein",
        time: "15m",
        emoji: "🐟",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 cod or tilapia fillet (6 oz)",
          "8 spears asparagus (trimmed)",
          "1 tbsp butter",
          "1 tbsp fresh lemon juice",
          "1 clove garlic (sliced)"
        ],
        recipe: [
          "Step 1: Season white fish fillet with salt and lemon pepper.",
          "Step 2: Sauté asparagus and sliced garlic in melted butter for 3 mins.",
          "Step 3: Add fish to pan and cook 3 mins per side until opaque and flaky."
        ]
      }
    ]
  },
  Friday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "High-Protein Berry Cottage Cheese Bowl",
        type: "High-Protein",
        time: "3m",
        emoji: "🥣",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1 cup low-fat cottage cheese",
          "1/2 cup fresh berries",
          "1 tbsp toasted pumpkin seeds",
          "1/2 tsp cinnamon"
        ],
        recipe: [
          "Step 1: Scoop cottage cheese into a bowl.",
          "Step 2: Top with berries and pumpkin seeds.",
          "Step 3: Dust with cinnamon and serve immediately."
        ]
      },
      {
        name: "Lunch",
        title: "Salmon & Greens Anti-Slump Salad",
        type: "Brain-Fuel",
        time: "10m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 pouch or can pink salmon (5 oz)",
          "2 cups mixed salad greens",
          "1/2 avocado (diced)",
          "1 tbsp olive oil & balsamic vinegar"
        ],
        recipe: [
          "Step 1: Arrange mixed greens in a serving bowl.",
          "Step 2: Flake salmon over greens and add diced avocado.",
          "Step 3: Drizzle with olive oil and balsamic vinegar."
        ]
      },
      {
        name: "Dinner",
        title: "Garlic Beef Strips with Green Beans",
        type: "High-Protein",
        time: "15m",
        emoji: "🥩",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "150g sirloin strips",
          "1 cup green beans (trimmed)",
          "1 tbsp sesame oil or olive oil",
          "1 clove garlic & ginger (minced)",
          "1 tbsp soy sauce"
        ],
        recipe: [
          "Step 1: Sear beef strips in smoking hot oil for 2 mins.",
          "Step 2: Toss in green beans, garlic, and ginger.",
          "Step 3: Glaze with soy sauce for 1 min and serve hot."
        ]
      }
    ]
  },
  Saturday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Weekend Solo Shakshuka",
        type: "Fiber & Protein",
        time: "15m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "2 large eggs",
          "1 cup crushed canned tomatoes",
          "1/4 red bell pepper (diced)",
          "1/2 tsp cumin & smoked paprika",
          "1 tbsp crumbled feta"
        ],
        recipe: [
          "Step 1: Simmer tomatoes, diced pepper, cumin, and paprika for 5 mins.",
          "Step 2: Make two wells in sauce and crack eggs directly inside.",
          "Step 3: Cover skillet and cook 4 mins until whites set; top with feta."
        ]
      },
      {
        name: "Lunch",
        title: "Grilled Chicken Pesto Salad",
        type: "High-Protein",
        time: "10m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cooked chicken breast (shredded)",
          "1 tbsp basil pesto",
          "1 cup baby spinach",
          "6 cherry tomatoes (halved)",
          "1 tbsp pine nuts or walnuts"
        ],
        recipe: [
          "Step 1: Toss shredded chicken with basil pesto.",
          "Step 2: Serve over fresh spinach with cherry tomatoes.",
          "Step 3: Sprinkle nuts over the top."
        ]
      },
      {
        name: "Dinner",
        title: "Crispy Pan Tofu with Bok Choy",
        type: "Balanced",
        time: "15m",
        emoji: "🍲",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "150g extra-firm tofu (pressed and cubed)",
          "2 baby bok choy (halved)",
          "1 tbsp olive or sesame oil",
          "1 tbsp tamari or soy sauce",
          "1 tsp chili crunch"
        ],
        recipe: [
          "Step 1: Pan-sear tofu cubes in oil until crisp on all sides (6 mins).",
          "Step 2: Add bok choy to the pan with 1 tbsp water; cover for 2 mins.",
          "Step 3: Drizzle with soy sauce and chili crunch."
        ]
      }
    ]
  },
  Sunday: {
    prepAlert: "Review the upcoming week's grocery list and prep basic ingredients.",
    meals: [
      {
        name: "Breakfast",
        title: "Fluffy 2-Ingredient Banana Egg Pancakes",
        type: "Fiber-First",
        time: "12m",
        emoji: "🥞",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1 ripe banana",
          "2 large eggs",
          "1/4 tsp cinnamon",
          "1 tsp coconut oil for pan"
        ],
        recipe: [
          "Step 1: Mash banana thoroughly in a bowl and whisk in eggs and cinnamon.",
          "Step 2: Heat oil in a pan and pour small silver-dollar pancakes.",
          "Step 3: Cook 2 mins, gently flip, and cook 1 more min."
        ]
      },
      {
        name: "Lunch",
        title: "Warm Lentil & Roasted Pepper Salad",
        type: "Fiber-First",
        time: "10m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup canned brown lentils (rinsed)",
          "1/2 jar roasted red peppers (sliced)",
          "1 cup arugula or spinach",
          "1 tbsp olive oil & lemon juice"
        ],
        recipe: [
          "Step 1: Warm lentils in a small skillet for 2 mins.",
          "Step 2: Toss lentils, sliced roasted peppers, and arugula together.",
          "Step 3: Dress with olive oil, lemon juice, and a pinch of salt."
        ]
      },
      {
        name: "Dinner",
        title: "Baked Herb Chicken Thigh & Asparagus",
        type: "High-Protein",
        time: "20m",
        emoji: "🍗",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 boneless chicken thigh",
          "1/2 bunch asparagus",
          "1 tbsp olive oil",
          "1 tsp garlic powder & oregano",
          "Lemon wedge"
        ],
        recipe: [
          "Step 1: Season chicken thigh and asparagus with olive oil, garlic, and oregano.",
          "Step 2: Pan-sear or broil chicken thigh skin-side down for 6 mins, flip for 5 mins.",
          "Step 3: Serve with blistered asparagus and lemon."
        ]
      }
    ]
  },
  groceries: [
    {
      category: "Produce",
      items: [
        "Eggs (1 dozen)",
        "Baby spinach (1 large tub)",
        "Cherry tomatoes (1 pint)",
        "Cucumbers (2)",
        "Avocados (3)",
        "Broccoli (1 head)",
        "Zucchini (2)",
        "Asparagus (1 bunch)",
        "Baby bok choy (2 heads)",
        "Lemons (3)",
        "Fresh berries (1 cup)"
      ]
    },
    {
      category: "Protein",
      items: [
        "Salmon fillets (2 x 6 oz)",
        "Chicken breasts (2 x 6 oz)",
        "Chicken thigh (1)",
        "Lean ground turkey (1 pack)",
        "Roast turkey breast slices (1 pack)",
        "Cod or white fish fillet (1 x 6 oz)",
        "Sirloin beef strips (150g)",
        "Extra-firm tofu (1 block)",
        "Canned pink salmon / tuna (2 cans)"
      ]
    },
    {
      category: "Pantry & Spices",
      items: [
        "Canned chickpeas (2 cans)",
        "Canned white cannellini beans (1 can)",
        "Canned brown lentils (1 can)",
        "Canned crushed tomatoes (1 can)",
        "Whole wheat tortilla wraps (1 pack)",
        "Sourdough or sprouted bread (1 loaf)",
        "Olive oil",
        "Turmeric, cumin, paprika, Italian seasoning",
        "Soy sauce / tamari",
        "Walnuts / pumpkin seeds"
      ]
    },
    {
      category: "Dairy & Refrigerated",
      items: [
        "Greek yogurt plain (1 tub)",
        "Feta cheese (1 block)",
        "Cottage cheese (1 tub)",
        "Unsalted butter",
        "Classic hummus (1 tub)",
        "Basil pesto (1 small jar)"
      ]
    }
  ]
};

export const SOLO_VEGETARIAN_PLAN: MealPlanData = {
  Monday: {
    prepAlert: "Drain and press tofu; chop onion and bell pepper for the week.",
    meals: [
      {
        name: "Breakfast",
        title: "Turmeric Spiced Tofu Scramble",
        type: "High-Protein",
        time: "10m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "150g firm tofu (crumbled)",
          "1/4 red onion (diced)",
          "1/2 tomato (chopped)",
          "1/4 tsp turmeric & black salt (kala namak)",
          "1 tsp cooking oil"
        ],
        recipe: [
          "Step 1: Sauté onion and tomato in oil for 2 mins.",
          "Step 2: Add crumbled tofu, turmeric, and black salt.",
          "Step 3: Scramble over medium heat for 4 mins until heated through."
        ]
      },
      {
        name: "Lunch",
        title: "Chickpea Cucumber Salad",
        type: "Fiber-First",
        time: "8m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup canned chickpeas (rinsed)",
          "1 cucumber (diced)",
          "1 tomato (diced)",
          "1 tbsp lemon juice & olive oil",
          "Fresh cilantro/coriander"
        ],
        recipe: [
          "Step 1: Toss chickpeas, cucumber, and tomato in a bowl.",
          "Step 2: Drizzle with olive oil, lemon juice, and salt.",
          "Step 3: Garnish with cilantro."
        ]
      },
      {
        name: "Dinner",
        title: "Quick Paneer & Bell Pepper Skillet",
        type: "High-Protein",
        time: "15m",
        emoji: "🥘",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "150g paneer cubes",
          "1 bell pepper (sliced)",
          "1/2 onion (sliced)",
          "1 tsp garam masala & cumin",
          "1 tbsp oil"
        ],
        recipe: [
          "Step 1: Sear paneer cubes in oil until golden (3 mins).",
          "Step 2: Add sliced onion, bell pepper, and spices.",
          "Step 3: Sauté on high heat for 4 mins and serve."
        ]
      }
    ]
  },
  Tuesday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Warm Spiced Oatmeal with Chia",
        type: "Fiber-First",
        time: "8m",
        emoji: "🥣",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1/2 cup rolled oats",
          "1 cup almond milk or water",
          "1 tbsp chia seeds",
          "1/2 apple (diced)",
          "1/2 tsp cinnamon"
        ],
        recipe: [
          "Step 1: Simmer oats and liquid for 4 mins.",
          "Step 2: Stir in chia seeds and cinnamon.",
          "Step 3: Top with diced apple and a splash of milk."
        ]
      },
      {
        name: "Lunch",
        title: "Hummus & Veggie Whole Wheat Wrap",
        type: "Balanced",
        time: "5m",
        emoji: "🌯",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 whole wheat tortilla",
          "3 tbsp hummus",
          "1/2 cucumber (sliced)",
          "1/2 bell pepper (sliced)",
          "1 cup spinach"
        ],
        recipe: [
          "Step 1: Spread hummus evenly over the wrap.",
          "Step 2: Add sliced cucumber, peppers, and spinach.",
          "Step 3: Roll up tightly and cut in half."
        ]
      },
      {
        name: "Dinner",
        title: "Spinach & Red Lentil Dahi Bowl",
        type: "High-Protein",
        time: "18m",
        emoji: "🍲",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1/2 cup red lentils (washed)",
          "1.5 cups water",
          "1 cup baby spinach",
          "1/2 tsp cumin & turmeric",
          "2 tbsp plain yogurt (dahi)"
        ],
        recipe: [
          "Step 1: Simmer red lentils in water with turmeric for 12 mins.",
          "Step 2: Stir in baby spinach until wilted (2 mins).",
          "Step 3: Temper with cumin seeds in 1 tsp oil and dollop with cold yogurt."
        ]
      }
    ]
  },
  Wednesday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Paneer Bhurji on Toast",
        type: "High-Protein",
        time: "10m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "100g crumbled paneer",
          "1/4 onion (finely chopped)",
          "1 slice toasted whole wheat bread",
          "1/4 tsp turmeric & chili powder",
          "1 tsp butter"
        ],
        recipe: [
          "Step 1: Sauté onion in butter for 2 mins.",
          "Step 2: Add crumbled paneer and spices; stir 3 mins.",
          "Step 3: Spoon over toasted bread and serve hot."
        ]
      },
      {
        name: "Lunch",
        title: "Edamame & Bell Pepper Salad",
        type: "High-Protein",
        time: "8m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup shelled edamame (thawed)",
          "1/2 red bell pepper (diced)",
          "1 cup mixed greens",
          "1 tbsp sesame dressing or olive oil/lemon"
        ],
        recipe: [
          "Step 1: Place mixed greens in a salad bowl.",
          "Step 2: Add edamame and diced red bell pepper.",
          "Step 3: Toss with dressing and a pinch of black pepper."
        ]
      },
      {
        name: "Dinner",
        title: "1-Pot Chickpea & Coconut Curry",
        type: "Fiber-First",
        time: "15m",
        emoji: "🍛",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 cup canned chickpeas",
          "1/2 cup coconut milk",
          "1/2 cup canned tomato purée",
          "1 tsp curry powder",
          "1 cup spinach"
        ],
        recipe: [
          "Step 1: Heat curry powder in 1 tsp oil for 30 seconds.",
          "Step 2: Add chickpeas, tomato purée, and coconut milk; simmer 8 mins.",
          "Step 3: Fold in spinach for 1 min and serve warm."
        ]
      }
    ]
  },
  Thursday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Green Protein Smoothie",
        type: "Energy",
        time: "5m",
        emoji: "🥤",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1 cup baby spinach",
          "1 banana (frozen or fresh)",
          "1 cup plant milk or water",
          "1 tbsp peanut butter",
          "1 tbsp hemp or chia seeds"
        ],
        recipe: [
          "Step 1: Place all ingredients into a blender.",
          "Step 2: Blend on high speed for 60 seconds until silky smooth.",
          "Step 3: Pour into a glass and drink immediately."
        ]
      },
      {
        name: "Lunch",
        title: "Black Bean & Corn Fiesta Bowl",
        type: "Fiber-First",
        time: "8m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup canned black beans (rinsed)",
          "1/2 cup sweet corn",
          "1/2 avocado (diced)",
          "1 tbsp lime juice & salsa"
        ],
        recipe: [
          "Step 1: Mix rinsed black beans and corn in a bowl.",
          "Step 2: Top with diced avocado.",
          "Step 3: Dress with salsa and lime juice."
        ]
      },
      {
        name: "Dinner",
        title: "Pan-Seared Tofu & Broccoli with Garlic Soy",
        type: "High-Protein",
        time: "15m",
        emoji: "🥦",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "150g firm tofu (cubed)",
          "1.5 cups broccoli florets",
          "1 tbsp soy sauce",
          "1 clove garlic (minced)",
          "1 tbsp sesame or olive oil"
        ],
        recipe: [
          "Step 1: Pan-sear tofu cubes until golden crisp (5 mins).",
          "Step 2: Add broccoli and garlic with 2 tbsp water; cover for 3 mins.",
          "Step 3: Drizzle with soy sauce and toss well."
        ]
      }
    ]
  },
  Friday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Avocado & Hemp Seed Toast",
        type: "Fiber-First",
        time: "5m",
        emoji: "🥑",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1 slice seeded or sourdough bread",
          "1/2 ripe avocado",
          "1 tbsp hemp seeds",
          "Pinch red chili flakes & sea salt"
        ],
        recipe: [
          "Step 1: Toast bread until golden and crisp.",
          "Step 2: Mash avocado directly on toast.",
          "Step 3: Sprinkle with hemp seeds, chili flakes, and salt."
        ]
      },
      {
        name: "Lunch",
        title: "Greek Salad with Tofu Feta",
        type: "Light & Fresh",
        time: "8m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup diced cucumber",
          "1 cup cherry tomatoes (halved)",
          "100g cubed firm tofu or feta",
          "1 tbsp olive oil & oregano",
          "1 tbsp kalamata olives"
        ],
        recipe: [
          "Step 1: Combine cucumber, cherry tomatoes, and olives in a bowl.",
          "Step 2: Add cubed tofu or feta.",
          "Step 3: Drizzle with olive oil and oregano."
        ]
      },
      {
        name: "Dinner",
        title: "Solo Paneer Tikka Skillet with Peppers",
        type: "High-Protein",
        time: "15m",
        emoji: "🥘",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "150g paneer (cubed)",
          "1/2 bell pepper (cubed)",
          "1/2 red onion (cubed)",
          "1 tbsp yogurt & 1 tsp tikka spice",
          "1 tsp oil"
        ],
        recipe: [
          "Step 1: Coat paneer, peppers, and onions in yogurt and tikka spice.",
          "Step 2: Heat oil in a skillet and cook on high heat for 6 mins until charred.",
          "Step 3: Squeeze fresh lemon juice over the top."
        ]
      }
    ]
  },
  Saturday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Yogurt Berry & Nut Muesli",
        type: "High-Protein",
        time: "5m",
        emoji: "🥣",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1 cup Greek yogurt or soy yogurt",
          "1/3 cup rolled oats or muesli",
          "1/2 cup mixed berries",
          "1 tbsp pumpkin seeds"
        ],
        recipe: [
          "Step 1: Spoon yogurt into a breakfast bowl.",
          "Step 2: Layer with muesli and berries.",
          "Step 3: Top with pumpkin seeds."
        ]
      },
      {
        name: "Lunch",
        title: "Warm Hummus & Spiced Chickpea Pitta",
        type: "Fiber-First",
        time: "10m",
        emoji: "🥙",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 whole wheat pitta or wrap",
          "3 tbsp hummus",
          "1/2 cup warm chickpeas with cumin",
          "1/2 cup shredded lettuce or spinach"
        ],
        recipe: [
          "Step 1: Warm chickpeas in a pan with cumin for 2 mins.",
          "Step 2: Open or spread pitta with hummus.",
          "Step 3: Stuff with greens and warm chickpeas."
        ]
      },
      {
        name: "Dinner",
        title: "Spicy Garlic Edamame & Veggie Noodle Bowl",
        type: "Satisfying",
        time: "15m",
        emoji: "🍜",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 portion quick-cooking noodles",
          "1 cup shelled edamame",
          "1 cup spinach or bok choy",
          "1 tbsp soy sauce & chili garlic sauce",
          "1 tsp sesame oil"
        ],
        recipe: [
          "Step 1: Boil noodles for 3 mins and drain.",
          "Step 2: Sauté edamame and greens in sesame oil with garlic sauce for 2 mins.",
          "Step 3: Toss noodles with veggies and soy sauce."
        ]
      }
    ]
  },
  Sunday: {
    prepAlert: "Review fridge vegetables and freeze any extra bread slices.",
    meals: [
      {
        name: "Breakfast",
        title: "Cheesy Herb Toast with Tomatoes",
        type: "Comfort",
        time: "8m",
        emoji: "🧀",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1 thick slice bread",
          "2 tbsp shredded mozzarella or cheese",
          "1/2 tomato (sliced)",
          "1/4 tsp dried oregano"
        ],
        recipe: [
          "Step 1: Place tomato slices on bread and cover with cheese and oregano.",
          "Step 2: Toast under broiler or covered in a skillet for 4 mins until melted.",
          "Step 3: Serve warm."
        ]
      },
      {
        name: "Lunch",
        title: "Cold Sesame Tofu Salad",
        type: "High-Protein",
        time: "8m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "150g firm tofu (cubed)",
          "1 mini cucumber (sliced)",
          "1 tbsp sesame oil & soy sauce",
          "1 tsp sesame seeds"
        ],
        recipe: [
          "Step 1: Toss tofu cubes and sliced cucumber in a bowl.",
          "Step 2: Whisk sesame oil, soy sauce, and a drop of vinegar.",
          "Step 3: Pour over salad and top with sesame seeds."
        ]
      },
      {
        name: "Dinner",
        title: "Comforting Red Lentil & Vegetable Stew",
        type: "Warm & Fiber",
        time: "18m",
        emoji: "🍲",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1/2 cup red lentils",
          "1 zucchini (diced)",
          "1 cup canned crushed tomatoes",
          "1 tsp Italian seasoning",
          "1.5 cups vegetable broth or water"
        ],
        recipe: [
          "Step 1: Combine lentils, diced zucchini, tomatoes, and broth in a pot.",
          "Step 2: Simmer for 15 mins until lentils are creamy and tender.",
          "Step 3: Season with salt, pepper, and Italian herbs."
        ]
      }
    ]
  },
  groceries: [
    {
      category: "Produce",
      items: [
        "Firm / Extra-firm tofu (3 blocks)",
        "Paneer (2 packs / 300g)",
        "Baby spinach (1 large tub)",
        "Red bell peppers (3)",
        "Cucumbers (3)",
        "Tomatoes (4)",
        "Red onions (3)",
        "Apples & Bananas (4)",
        "Lemons (2)",
        "Cilantro / Coriander"
      ]
    },
    {
      category: "Plant Protein & Legumes",
      items: [
        "Canned chickpeas (3 cans)",
        "Canned black beans (1 can)",
        "Shelled frozen edamame (1 bag)",
        "Dry red lentils (1 bag / 500g)"
      ]
    },
    {
      category: "Pantry & Spices",
      items: [
        "Rolled oats (1 bag)",
        "Whole wheat wraps / pitta (1 pack)",
        "Whole wheat / sourdough bread (1 loaf)",
        "Chia seeds & hemp seeds",
        "Classic hummus (1 tub)",
        "Canned crushed tomatoes (2 cans)",
        "Coconut milk (1 can)",
        "Quick noodles (1 pack)",
        "Turmeric, cumin, garam masala, curry powder"
      ]
    },
    {
      category: "Dairy & Oils",
      items: [
        "Plain Greek yogurt / dahi (1 large tub)",
        "Olive oil & sesame oil",
        "Soy sauce / tamari",
        "Peanut butter",
        "Almond milk (1 carton)"
      ]
    }
  ]
};

export const ONE_PAN_PLAN: MealPlanData = {
  Monday: {
    prepAlert: "One skillet used all day. Wipe clean with a paper towel between simple meals.",
    meals: [
      {
        name: "Breakfast",
        title: "1-Skillet Fried Eggs & Tomato Toast",
        type: "Quick",
        time: "8m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "2 large eggs",
          "1 slice bread",
          "1/2 tomato (sliced)",
          "1 tsp butter"
        ],
        recipe: [
          "Step 1: Melt butter in skillet, toast bread on both sides, and set on plate.",
          "Step 2: In the same pan, fry sliced tomatoes for 1 min, then crack eggs alongside.",
          "Step 3: Cook eggs sunny-side up for 2 mins; slide onto toast."
        ]
      },
      {
        name: "Lunch",
        title: "1-Pan Warm Chickpea & Spinach Sauté",
        type: "Fiber-First",
        time: "8m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup canned chickpeas (rinsed)",
          "2 cups baby spinach",
          "1 tbsp olive oil",
          "1/2 tsp cumin & garlic powder",
          "Lemon squeeze"
        ],
        recipe: [
          "Step 1: Heat olive oil in skillet with garlic powder and cumin.",
          "Step 2: Add chickpeas and sauté for 3 mins until warmed through.",
          "Step 3: Toss in spinach until wilted (1 min); finish with lemon."
        ]
      },
      {
        name: "Dinner",
        title: "1-Skillet Pesto Chicken & Zucchini",
        type: "High-Protein",
        time: "15m",
        emoji: "🍗",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 chicken breast (cut into bite-sized pieces)",
          "1 medium zucchini (sliced into half-moons)",
          "2 tbsp basil pesto",
          "1 tbsp olive oil"
        ],
        recipe: [
          "Step 1: Heat oil in skillet and brown chicken pieces for 5 mins.",
          "Step 2: Add sliced zucchini and cook for 4 mins.",
          "Step 3: Turn off heat, stir in basil pesto, and serve directly from pan."
        ]
      }
    ]
  },
  Tuesday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "1-Pan Cheesy Scramble with Spinach",
        type: "High-Protein",
        time: "7m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "3 eggs",
          "1 cup baby spinach",
          "2 tbsp grated cheese",
          "1 tsp butter"
        ],
        recipe: [
          "Step 1: Melt butter in pan and toss spinach for 1 min.",
          "Step 2: Pour whisked eggs over spinach and scramble gently for 2 mins.",
          "Step 3: Stir in cheese until melted."
        ]
      },
      {
        name: "Lunch",
        title: "1-Skillet Crispy Bean Quesadilla",
        type: "Balanced",
        time: "8m",
        emoji: "🧀",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 tortilla",
          "1/2 cup canned black beans",
          "2 tbsp salsa",
          "3 tbsp shredded cheese"
        ],
        recipe: [
          "Step 1: Place tortilla in dry skillet; fill one half with beans, salsa, and cheese.",
          "Step 2: Fold tortilla over and toast over medium heat 3 mins per side.",
          "Step 3: Slice and serve hot."
        ]
      },
      {
        name: "Dinner",
        title: "1-Pan Garlic Herb Butter Salmon & Asparagus",
        type: "High-Protein",
        time: "14m",
        emoji: "🐟",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 salmon fillet",
          "8 asparagus spears",
          "1 tbsp butter",
          "1 clove garlic (minced)",
          "1 lemon wedge"
        ],
        recipe: [
          "Step 1: Melt butter with garlic in skillet over medium heat.",
          "Step 2: Place salmon and asparagus side-by-side in pan.",
          "Step 3: Sear salmon 4 mins per side; roll asparagus around until tender."
        ]
      }
    ]
  },
  Wednesday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Skillet Sautéed Apple & Cinnamon Oats",
        type: "Fiber-First",
        time: "10m",
        emoji: "🍎",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1/2 apple (diced)",
          "1/2 cup rolled oats",
          "1 cup water or milk",
          "1 tsp butter",
          "1/2 tsp cinnamon"
        ],
        recipe: [
          "Step 1: Sauté diced apple in butter with cinnamon for 2 mins.",
          "Step 2: Pour oats and liquid directly into the skillet.",
          "Step 3: Simmer for 4 mins until creamy; eat right from bowl."
        ]
      },
      {
        name: "Lunch",
        title: "1-Skillet Turkey & Veggie Hash",
        type: "High-Protein",
        time: "12m",
        emoji: "🍳",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "100g ground turkey or sliced turkey",
          "1/2 bell pepper (diced)",
          "1/2 zucchini (diced)",
          "1 tbsp olive oil",
          "Pinch garlic salt"
        ],
        recipe: [
          "Step 1: Heat olive oil and brown turkey in skillet for 4 mins.",
          "Step 2: Add diced peppers and zucchini.",
          "Step 3: Sauté on high heat for 4 mins until charred and tender."
        ]
      },
      {
        name: "Dinner",
        title: "1-Pan Crispy Tofu & Green Beans",
        type: "Plant Power",
        time: "15m",
        emoji: "🥢",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "150g firm tofu (cubed)",
          "1 cup green beans",
          "1 tbsp cooking oil",
          "1 tbsp soy sauce",
          "1 tsp chili crunch"
        ],
        recipe: [
          "Step 1: Pan-sear tofu cubes in oil until crisp (5 mins).",
          "Step 2: Push tofu to the side; add green beans with 1 tbsp water and cover 3 mins.",
          "Step 3: Toss together with soy sauce and chili crunch."
        ]
      }
    ]
  },
  Thursday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "1-Pan Egg & Cheese Breakfast Wrap",
        type: "High-Protein",
        time: "8m",
        emoji: "🌯",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "2 eggs (whisked)",
          "1 tortilla",
          "2 tbsp shredded cheese",
          "1 tsp butter"
        ],
        recipe: [
          "Step 1: Melt butter and pour eggs into skillet.",
          "Step 2: Place tortilla directly on top of liquid eggs; cook 2 mins.",
          "Step 3: Flip over so tortilla toasts; sprinkle cheese, roll up, and slide out."
        ]
      },
      {
        name: "Lunch",
        title: "1-Skillet Warm Tomato White Bean Bowl",
        type: "Fiber-First",
        time: "8m",
        emoji: "🥣",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup canned cannellini or white beans",
          "1/2 cup crushed canned tomatoes",
          "1 cup spinach",
          "1 tsp olive oil & oregano"
        ],
        recipe: [
          "Step 1: Heat olive oil with oregano in skillet.",
          "Step 2: Add white beans and tomatoes; simmer 4 mins.",
          "Step 3: Wilt in spinach and season with black pepper."
        ]
      },
      {
        name: "Dinner",
        title: "1-Pan Honey Garlic Chicken Thigh & Broccoli",
        type: "High-Protein",
        time: "16m",
        emoji: "🍗",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 boneless chicken thigh",
          "1 cup broccoli florets",
          "1 tbsp soy sauce",
          "1 tsp honey",
          "1 clove garlic (minced)"
        ],
        recipe: [
          "Step 1: Sear chicken thigh in skillet skin-side down for 5 mins; flip.",
          "Step 2: Add broccoli around chicken with 2 tbsp water; cover 4 mins.",
          "Step 3: Drizzle soy sauce, honey, and garlic over pan for 1 min to glaze."
        ]
      }
    ]
  },
  Friday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "1-Skillet French Toast for One",
        type: "Treat",
        time: "8m",
        emoji: "🍞",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1 thick slice bread",
          "1 egg",
          "2 tbsp milk",
          "1/4 tsp cinnamon",
          "1 tsp butter"
        ],
        recipe: [
          "Step 1: Whisk egg, milk, and cinnamon directly in a shallow dish.",
          "Step 2: Dip bread to coat both sides.",
          "Step 3: Fry in buttered skillet 3 mins per side until golden brown."
        ]
      },
      {
        name: "Lunch",
        title: "1-Pan Sautéed Tuna Melt",
        type: "High-Protein",
        time: "8m",
        emoji: "🥪",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 can tuna (drained)",
          "1 tbsp mayo or Greek yogurt",
          "2 slices bread",
          "1 slice cheddar cheese",
          "1 tsp butter"
        ],
        recipe: [
          "Step 1: Mix tuna with mayo, salt, and pepper.",
          "Step 2: Build sandwich with cheese.",
          "Step 3: Toast in buttered skillet 3 mins per side until golden and cheese melts."
        ]
      },
      {
        name: "Dinner",
        title: "1-Skillet Beef & Bell Pepper Fajita Bowl",
        type: "High-Protein",
        time: "15m",
        emoji: "🥩",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "150g beef steak strips",
          "1 bell pepper (sliced)",
          "1/2 onion (sliced)",
          "1 tsp fajita spice",
          "1 tbsp olive oil"
        ],
        recipe: [
          "Step 1: Heat olive oil in skillet on high heat.",
          "Step 2: Sauté beef strips for 3 mins until browned; push aside.",
          "Step 3: Add peppers, onions, and spice; sear 4 mins and mix together."
        ]
      }
    ]
  },
  Saturday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "1-Skillet Shakshuka for One",
        type: "Healthy",
        time: "14m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "2 eggs",
          "1 cup canned crushed tomatoes",
          "1/2 bell pepper (chopped)",
          "1/2 tsp cumin & paprika",
          "1 tbsp crumbled feta"
        ],
        recipe: [
          "Step 1: Simmer tomatoes, peppers, and spices in skillet for 5 mins.",
          "Step 2: Crack eggs directly into simmering sauce.",
          "Step 3: Cover and cook 4 mins until egg whites set; top with feta."
        ]
      },
      {
        name: "Lunch",
        title: "1-Pan Warm Chickpea Caesar Bowl",
        type: "Fiber-First",
        time: "8m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup chickpeas",
          "1 tbsp olive oil & garlic powder",
          "2 cups romaine or spinach",
          "1 tbsp Caesar dressing or yogurt-lemon"
        ],
        recipe: [
          "Step 1: Crisp chickpeas in olive oil with garlic powder in skillet for 4 mins.",
          "Step 2: Place greens in a bowl.",
          "Step 3: Top with warm crunchy chickpeas and dressing."
        ]
      },
      {
        name: "Dinner",
        title: "1-Skillet White Fish Piccata",
        type: "High-Protein",
        time: "12m",
        emoji: "🐟",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 white fish fillet (cod/tilapia)",
          "1 tbsp butter",
          "1 tbsp capers or lemon juice",
          "1 cup baby spinach"
        ],
        recipe: [
          "Step 1: Melt butter in skillet over medium-high heat.",
          "Step 2: Sear fish fillet 3 mins per side until flaky.",
          "Step 3: Add spinach and lemon juice for 1 min until wilted."
        ]
      }
    ]
  },
  Sunday: {
    prepAlert: "Quick wipe-down of skillet and store remaining pantry staples.",
    meals: [
      {
        name: "Breakfast",
        title: "1-Pan Fluffy Omelette with Herbs",
        type: "High-Protein",
        time: "8m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "3 eggs",
          "1 tbsp chopped parsley or coriander",
          "1 tsp butter",
          "Pinch black pepper"
        ],
        recipe: [
          "Step 1: Whisk eggs with herbs, salt, and pepper.",
          "Step 2: Melt butter in skillet over medium heat.",
          "Step 3: Pour eggs, let set for 2 mins, fold in half, and slide out."
        ]
      },
      {
        name: "Lunch",
        title: "1-Skillet Cheesy Black Bean Quesadilla",
        type: "Comfort",
        time: "8m",
        emoji: "🧀",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 tortilla",
          "1/2 cup black beans",
          "2 tbsp salsa",
          "3 tbsp cheese"
        ],
        recipe: [
          "Step 1: Lay tortilla flat in hot dry skillet.",
          "Step 2: Cover half with beans, salsa, and cheese; fold in half.",
          "Step 3: Brown 3 mins per side until crisp and melted."
        ]
      },
      {
        name: "Dinner",
        title: "1-Pan Garlic Sausage & Veggie Sauté",
        type: "Hearty",
        time: "15m",
        emoji: "🥘",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 pre-cooked chicken or pork sausage (sliced)",
          "1 zucchini (sliced)",
          "1/2 bell pepper (sliced)",
          "1 tbsp olive oil"
        ],
        recipe: [
          "Step 1: Heat oil in skillet and brown sausage slices for 3 mins.",
          "Step 2: Add sliced zucchini and peppers.",
          "Step 3: Sauté on medium-high for 5 mins until caramelized."
        ]
      }
    ]
  },
  groceries: [
    {
      category: "Produce",
      items: [
        "Eggs (1 dozen)",
        "Baby spinach (1 large tub)",
        "Zucchini (3)",
        "Bell peppers (3)",
        "Asparagus (1 bunch)",
        "Broccoli (1 head)",
        "Apples (2)",
        "Lemons (2)",
        "Tomatoes (3)"
      ]
    },
    {
      category: "Protein",
      items: [
        "Chicken breasts (2 x 6 oz)",
        "Chicken thigh (1)",
        "Salmon fillet (1 x 6 oz)",
        "White fish fillet (1 x 6 oz)",
        "Sirloin beef strips (150g)",
        "Pre-cooked sausage (1 pack)",
        "Canned solid tuna (2 cans)",
        "Firm tofu (1 block)"
      ]
    },
    {
      category: "Pantry & Canned Goods",
      items: [
        "Canned chickpeas (2 cans)",
        "Canned black beans (2 cans)",
        "Canned white beans (1 can)",
        "Canned crushed tomatoes (2 cans)",
        "Tortillas (1 pack)",
        "Bread (1 loaf)",
        "Rolled oats (1 bag)",
        "Basil pesto (1 jar)",
        "Soy sauce & chili crunch",
        "Olive oil & salsa"
      ]
    },
    {
      category: "Dairy",
      items: [
        "Butter (1 block)",
        "Shredded cheese / cheddar (1 bag)",
        "Feta cheese (1 block)",
        "Milk (1 small carton)"
      ]
    }
  ]
};

export const GLOBAL_CLASSICS_PLAN: MealPlanData = {
  Monday: {
    prepAlert: "Cook a small batch of jasmine or basmati rice for Monday/Tuesday dinners.",
    meals: [
      {
        name: "Breakfast",
        title: "Classic Turkish Menemen",
        type: "Mediterranean",
        time: "10m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "2 large eggs",
          "1 ripe tomato (grated or finely chopped)",
          "1 green chili or mild pepper (sliced)",
          "1 tbsp butter or olive oil",
          "Pinch oregano & black pepper"
        ],
        recipe: [
          "Step 1: Sauté pepper in butter in a skillet for 2 mins.",
          "Step 2: Add chopped tomatoes and simmer for 4 mins until juicy.",
          "Step 3: Crack eggs into tomatoes and gently stir whites, leaving yolks soft."
        ]
      },
      {
        name: "Lunch",
        title: "Greek Chickpea Lemon Herb Salad",
        type: "Mediterranean",
        time: "8m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup canned chickpeas",
          "1 cucumber (diced)",
          "6 cherry tomatoes (halved)",
          "1 tbsp olive oil & lemon juice",
          "2 tbsp crumbled feta"
        ],
        recipe: [
          "Step 1: Combine rinsed chickpeas, cucumber, and cherry tomatoes in a bowl.",
          "Step 2: Whisk olive oil, lemon juice, salt, and oregano.",
          "Step 3: Toss salad with dressing and top with crumbled feta."
        ]
      },
      {
        name: "Dinner",
        title: "15-Minute Thai Basil Chicken (Pad Krapow)",
        type: "Asian Classic",
        time: "15m",
        emoji: "🍛",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "150g ground chicken or turkey",
          "1 cup fresh holy basil or Thai/sweet basil leaves",
          "2 cloves garlic & 1 chili (minced)",
          "1 tbsp soy sauce & oyster sauce",
          "1 cup cooked rice"
        ],
        recipe: [
          "Step 1: Sauté garlic and chili in 1 tbsp oil over high heat for 30 seconds.",
          "Step 2: Add ground meat and stir-fry for 4 mins until cooked through.",
          "Step 3: Add sauces, toss in basil leaves until wilted, and serve over warm rice."
        ]
      }
    ]
  },
  Tuesday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Japanese Tamagoyaki-Style Rolled Omelette",
        type: "Japanese",
        time: "10m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "3 large eggs",
          "1 tsp soy sauce",
          "1/2 tsp sugar",
          "1 tsp cooking oil"
        ],
        recipe: [
          "Step 1: Whisk eggs with soy sauce and sugar.",
          "Step 2: Pour a thin layer into heated oiled pan; roll when set.",
          "Step 3: Pour next layer, roll together, slice, and serve."
        ]
      },
      {
        name: "Lunch",
        title: "Mexican Street Corn & Black Bean Salad",
        type: "Mexican",
        time: "8m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup black beans",
          "1/2 cup sweet corn",
          "1 tbsp mayonnaise or Greek yogurt",
          "1 tbsp cotija or feta cheese",
          "1/2 tsp chili powder & lime juice"
        ],
        recipe: [
          "Step 1: Toss black beans and corn together in a bowl.",
          "Step 2: Fold in mayo, lime juice, and chili powder.",
          "Step 3: Sprinkle with cheese and cilantro."
        ]
      },
      {
        name: "Dinner",
        title: "Italian Garlic & Herb Pan-Seared Salmon",
        type: "Italian",
        time: "15m",
        emoji: "🐟",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 salmon fillet (6 oz)",
          "1 cup cherry tomatoes",
          "1 tbsp olive oil",
          "1 clove garlic (sliced)",
          "1 tbsp lemon juice & capers"
        ],
        recipe: [
          "Step 1: Heat olive oil in skillet with garlic slices.",
          "Step 2: Sear salmon 4 mins per side until flaky.",
          "Step 3: Blister cherry tomatoes in the pan juices with lemon."
        ]
      }
    ]
  },
  Wednesday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "French Bistro Omelette with Herbs",
        type: "French",
        time: "8m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "3 eggs",
          "1 tbsp butter",
          "1 tbsp fresh chives or parsley",
          "Pinch sea salt & white pepper"
        ],
        recipe: [
          "Step 1: Beat eggs vigorously with a pinch of salt.",
          "Step 2: Melt butter in non-stick pan over medium heat; pour eggs and swirl constantly.",
          "Step 3: Roll into a neat cylinder with soft creamy center and garnish with chives."
        ]
      },
      {
        name: "Lunch",
        title: "Mediterranean Tuna & Olive Pitta",
        type: "Mediterranean",
        time: "6m",
        emoji: "🥙",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 whole wheat pitta pocket",
          "1 can tuna (drained)",
          "1 tbsp olive oil & lemon juice",
          "4 kalamata olives (chopped)",
          "1/2 cup spinach"
        ],
        recipe: [
          "Step 1: Flake tuna with olive oil, lemon juice, and chopped olives.",
          "Step 2: Warm pitta pocket and fill with fresh spinach.",
          "Step 3: Spoon tuna mixture inside and enjoy."
        ]
      },
      {
        name: "Dinner",
        title: "Korean Kimchi Fried Rice with Fried Egg",
        type: "Korean",
        time: "15m",
        emoji: "🍳",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 cup cooked cold rice",
          "1/2 cup kimchi (chopped with juice)",
          "1 tbsp sesame oil",
          "1 tbsp soy sauce",
          "1 egg"
        ],
        recipe: [
          "Step 1: Sauté chopped kimchi in sesame oil for 3 mins.",
          "Step 2: Add cold rice and soy sauce, pressing down to crisp the rice (4 mins).",
          "Step 3: Fry an egg sunny-side up in a separate spot and slide over the top."
        ]
      }
    ]
  },
  Thursday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Spanish Pan con Tomate with Fried Egg",
        type: "Spanish",
        time: "10m",
        emoji: "🍅",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1 thick slice rustic bread (toasted)",
          "1 ripe tomato (halved and rubbed)",
          "1 clove garlic (halved)",
          "1 tbsp extra virgin olive oil",
          "1 fried egg"
        ],
        recipe: [
          "Step 1: Rub toasted bread with raw garlic clove, then rub halved tomato vigorously.",
          "Step 2: Drizzle generously with olive oil and flaky sea salt.",
          "Step 3: Crown with a crisp fried egg."
        ]
      },
      {
        name: "Lunch",
        title: "Vietnamese-Inspired Tofu Noodle Salad",
        type: "Vietnamese",
        time: "10m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 portion rice vermicelli or noodles",
          "100g pan-fried tofu or chicken",
          "1/2 cucumber (julienned)",
          "Fresh mint & cilantro",
          "1 tbsp lime juice & soy sauce"
        ],
        recipe: [
          "Step 1: Soak or boil noodles for 3 mins; rinse in cold water.",
          "Step 2: Top with pan-fried tofu, cucumber, and fresh herbs.",
          "Step 3: Pour lime soy dressing over noodles and toss."
        ]
      },
      {
        name: "Dinner",
        title: "Classic North Indian Egg Curry",
        type: "Indian",
        time: "18m",
        emoji: "🍛",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "2 hard-boiled eggs (poked with fork)",
          "1/2 onion & 1 tomato (pureed or finely diced)",
          "1/2 tsp turmeric, cumin, garam masala",
          "1 tbsp oil",
          "1/2 cup water"
        ],
        recipe: [
          "Step 1: Pan-fry boiled eggs in oil with a pinch of turmeric for 2 mins; set aside.",
          "Step 2: In same oil, cook onion, tomato, and spices for 8 mins until oil separates.",
          "Step 3: Add water, simmer eggs in gravy for 5 mins, and serve."
        ]
      }
    ]
  },
  Friday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Avocado & Za'atar Labneh Toast",
        type: "Middle Eastern",
        time: "6m",
        emoji: "🥑",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1 slice bread (toasted)",
          "2 tbsp Greek yogurt or labneh",
          "1/2 avocado (sliced)",
          "1 tsp za'atar or oregano",
          "1 tsp olive oil"
        ],
        recipe: [
          "Step 1: Spread Greek yogurt or labneh over toasted bread.",
          "Step 2: Fan sliced avocado over the top.",
          "Step 3: Dust with za'atar and drizzle with olive oil."
        ]
      },
      {
        name: "Lunch",
        title: "Italian Caprese & White Bean Bowl",
        type: "Italian",
        time: "6m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cup canned cannellini beans",
          "1 cup cherry tomatoes (halved)",
          "1 tbsp mozzarella or feta",
          "1 tbsp olive oil & balsamic glaze",
          "Fresh basil leaves"
        ],
        recipe: [
          "Step 1: Rinse and drain white beans; place in bowl.",
          "Step 2: Add cherry tomatoes, mozzarella, and torn basil.",
          "Step 3: Drizzle with olive oil and balsamic glaze."
        ]
      },
      {
        name: "Dinner",
        title: "Mexican Chicken & Black Bean Skillet",
        type: "Mexican",
        time: "15m",
        emoji: "🥘",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 chicken breast (cubed)",
          "1/2 cup black beans",
          "1/2 bell pepper (sliced)",
          "1 tsp taco or fajita spice",
          "2 tbsp salsa & lime"
        ],
        recipe: [
          "Step 1: Brown chicken pieces in 1 tbsp oil with fajita spice (5 mins).",
          "Step 2: Add bell pepper and black beans; sauté for 4 mins.",
          "Step 3: Stir in salsa and squeeze lime over the top."
        ]
      }
    ]
  },
  Saturday: {
    prepAlert: null,
    meals: [
      {
        name: "Breakfast",
        title: "Classic Shakshuka with Feta",
        type: "North African",
        time: "15m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "2 eggs",
          "1 cup canned crushed tomatoes",
          "1/2 bell pepper (diced)",
          "1/2 tsp cumin & paprika",
          "1 tbsp crumbled feta"
        ],
        recipe: [
          "Step 1: Simmer tomatoes, peppers, cumin, and paprika for 5 mins.",
          "Step 2: Crack eggs into skillet and cover for 4 mins until whites set.",
          "Step 3: Garnish with crumbled feta and black pepper."
        ]
      },
      {
        name: "Lunch",
        title: "Greek Gyro-Style Chicken Wrap",
        type: "Greek",
        time: "10m",
        emoji: "🌯",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 pitta bread or flatbread",
          "1 cooked chicken breast (sliced)",
          "2 tbsp Greek yogurt (with pinch garlic)",
          "1/2 cucumber & tomato (diced)",
          "1/4 red onion (sliced)"
        ],
        recipe: [
          "Step 1: Warm flatbread in a pan for 1 min.",
          "Step 2: Spread garlic yogurt, then layer sliced chicken, cucumber, tomato, and onion.",
          "Step 3: Roll up and enjoy."
        ]
      },
      {
        name: "Dinner",
        title: "Quick Singapore-Style Curried Rice Noodles",
        type: "Singaporean",
        time: "15m",
        emoji: "🍜",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 portion rice vermicelli or noodles",
          "1 egg (scrambled)",
          "1/2 bell pepper (thinly sliced)",
          "1 tsp curry powder & 1 tbsp soy sauce",
          "1 tbsp oil"
        ],
        recipe: [
          "Step 1: Soak vermicelli in warm water for 5 mins and drain.",
          "Step 2: Sauté sliced pepper in oil with curry powder for 2 mins.",
          "Step 3: Add noodles, scrambled egg, and soy sauce; toss briskly over high heat."
        ]
      }
    ]
  },
  Sunday: {
    prepAlert: "Review pantry and plan the upcoming week's culinary adventure.",
    meals: [
      {
        name: "Breakfast",
        title: "British Eggs & Beans on Toast",
        type: "British Classic",
        time: "8m",
        emoji: "🍳",
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-900",
        ingredients: [
          "1 slice thick bread (toasted)",
          "1/2 cup canned baked beans or seasoned white beans",
          "1 fried egg",
          "Pinch black pepper & butter"
        ],
        recipe: [
          "Step 1: Toast bread and butter generously.",
          "Step 2: Warm beans in a small saucepan for 2 mins.",
          "Step 3: Pour beans over toast and top with a fried egg."
        ]
      },
      {
        name: "Lunch",
        title: "Thai Cucumber & Herb Peanut Salad",
        type: "Thai",
        time: "8m",
        emoji: "🥗",
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-900",
        ingredients: [
          "1 cucumber (thinly sliced)",
          "2 tbsp crushed roasted peanuts",
          "1 tbsp lime juice & 1 tsp soy sauce",
          "1/2 chili (optional)",
          "Fresh cilantro"
        ],
        recipe: [
          "Step 1: Place cucumber slices in a bowl.",
          "Step 2: Whisk lime juice, soy sauce, and a pinch of sugar.",
          "Step 3: Toss cucumbers with dressing, cilantro, and roasted peanuts."
        ]
      },
      {
        name: "Dinner",
        title: "Mediterranean Lemon Garlic Butter Fish",
        type: "Mediterranean",
        time: "15m",
        emoji: "🐟",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        ingredients: [
          "1 white fish fillet (6 oz)",
          "1 tbsp butter & 1 tbsp olive oil",
          "2 cloves garlic (minced)",
          "1 tbsp lemon juice",
          "1 cup spinach or steamed veggies"
        ],
        recipe: [
          "Step 1: Sear fish in olive oil for 3 mins per side until golden.",
          "Step 2: Add butter, minced garlic, and lemon juice; spoon sauce over fish.",
          "Step 3: Serve with quick wilted spinach."
        ]
      }
    ]
  },
  groceries: [
    {
      category: "Produce",
      items: [
        "Eggs (1 dozen)",
        "Tomatoes (6)",
        "Cucumbers (3)",
        "Cherry tomatoes (1 pint)",
        "Bell peppers (3)",
        "Baby spinach (1 tub)",
        "Fresh basil & holy basil",
        "Fresh cilantro / mint",
        "Lemons & Limes (4)",
        "Garlic & Chili"
      ]
    },
    {
      category: "Protein",
      items: [
        "Ground chicken / turkey (300g)",
        "Chicken breasts (2 x 6 oz)",
        "Salmon fillet (1 x 6 oz)",
        "White fish fillet (1 x 6 oz)",
        "Firm tofu (1 block)",
        "Canned solid tuna (2 cans)"
      ]
    },
    {
      category: "Pantry & Global Condiments",
      items: [
        "Canned chickpeas (2 cans)",
        "Canned black beans (2 cans)",
        "Canned cannellini beans (1 can)",
        "Canned crushed tomatoes (2 cans)",
        "Kimchi (1 jar)",
        "Jasmine or Basmati rice (1 bag)",
        "Rice vermicelli / noodles (1 pack)",
        "Pitta pockets / flatbreads (1 pack)",
        "Soy sauce & oyster sauce",
        "Sesame oil & Olive oil",
        "Curry powder & za'atar"
      ]
    },
    {
      category: "Dairy & Nuts",
      items: [
        "Greek yogurt (1 tub)",
        "Feta cheese (1 block)",
        "Butter (1 block)",
        "Roasted peanuts"
      ]
    }
  ]
};

export const PRESETS: PresetMeta[] = [
  {
    id: "anti-slump",
    title: "Anti-Slump High Energy",
    description: "15-minute high-protein, fiber-first meals engineered to eliminate the 3 PM crash.",
    emoji: "⚡",
    tag: "High Protein • Low GI",
    prepTime: "15m avg",
    highlights: ["25g+ protein per meal", "Fiber-first digestion", "Zero 3 PM crash"],
    data: ANTI_SLUMP_PLAN
  },
  {
    id: "solo-vegetarian",
    title: "Solo Vegetarian Express",
    description: "Budget-friendly, high-protein plant meals with zero perishable food waste.",
    emoji: "🥬",
    tag: "Plant Power • Budget",
    prepTime: "15m avg",
    highlights: ["100% vegetarian", "Shared pantry efficiency", "Zero produce spoilage"],
    data: SOLO_VEGETARIAN_PLAN
  },
  {
    id: "one-pan",
    title: "One-Pan Minimal Cleanup",
    description: "Every meal cooked in a single skillet, pot, or pan. Zero kitchen sink pile-up.",
    emoji: "🍳",
    tag: "1 Skillet • Fast Clean",
    prepTime: "15m avg",
    highlights: ["Only 1 pan to wash", "<5 mins cleanup time", "Maximum cooking ease"],
    data: ONE_PAN_PLAN
  },
  {
    id: "global-classics",
    title: "Global Solo Classics",
    description: "Vibrant Mediterranean, Asian, and Latin classics perfectly scaled for one.",
    emoji: "🌏",
    tag: "Global Flavors • Solo Sized",
    prepTime: "15m avg",
    highlights: ["Varied world flavors", "Single-portion scaling", "Chef-crafted staples"],
    data: GLOBAL_CLASSICS_PLAN
  }
];

export const PRESET_MAP: Record<string, PresetMeta> = PRESETS.reduce((acc, preset) => {
  acc[preset.id] = preset;
  return acc;
}, {} as Record<string, PresetMeta>);

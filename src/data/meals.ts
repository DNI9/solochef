export interface MealData { name: string; title: string; type: string; time: string; emoji: string; bg: string; border: string; text: string; recipe: string; }
export interface DayPlan { prepAlert: string | null; meals: MealData[]; }
export const MEAL_DATABASE: Record<string, DayPlan> = {
  Monday: {
    prepAlert: null,
    meals: [
      { name: "Breakfast", title: "3-Egg Veggie Bhurji & Rotis", type: "High-Protein", time: "10m", emoji: "🍳", bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-900", recipe: "Scramble 2 whole eggs + 1 egg white with a handful of chopped spinach, onions, tomatoes, and green chilies. Serve with 1-2 rotis. Side: 5 soaked almonds." },
      { name: "Lunch", title: "Chicken/Soya Curry + Cucumber Salad", type: "Fiber-First", time: "15m", emoji: "🍛", bg: "bg-green-100", border: "border-green-300", text: "text-green-900", recipe: "Cook 150g chicken or 50g soya chunks in a light onion-tomato gravy. EAT FIRST: 1 large bowl of cucumber/carrot salad with lemon juice. Then eat the curry with 2 rotis." },
      { name: "Dinner", title: "Yellow Tadka Dal + Steamed Rice", type: "Easy Digest", time: "10m", emoji: "🥣", bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-900", recipe: "Warm up 1 bowl of yellow moong dal (batch cooked). Serve with 1 measured cup of steamed rice and 100g of plain curd on the side." }
    ]
  },
  Tuesday: {
    prepAlert: null,
    meals: [
      { name: "Breakfast", title: "High-Protein Overnight Oats", type: "Zero-Cook", time: "2m", emoji: "🥣", bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-900", recipe: "Mix 40g rolled oats, 1 tbsp chia seeds, 150g curd, splash of milk, and 1 scoop protein powder (or pumpkin seeds). Top with sliced fruit. (Prep night before)." },
      { name: "Lunch", title: "Leftover Curry + Carrot Salad", type: "Fiber-First", time: "5m", emoji: "🥗", bg: "bg-green-100", border: "border-green-300", text: "text-green-900", recipe: "Reheat Monday's Chicken/Soya curry. EAT FIRST: Crunchy carrot & cucumber salad with black salt. Serve with 2 rotis." },
      { name: "Dinner", title: "Leftover Yellow Dal + Phulkas", type: "Sleep Aid", time: "5m", emoji: "🍲", bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-900", recipe: "Reheat leftover yellow dal. Serve with 2 light phulkas and 1 freshly boiled egg for extra satiating protein." }
    ]
  },
  Wednesday: {
    prepAlert: "Batch Cook Tonight: Spinach Dal!",
    meals: [
      { name: "Breakfast", title: "Paneer & Besan Chilla", type: "High-Protein", time: "15m", emoji: "🥞", bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-900", recipe: "Make batter with besan, water, spices. Cook 2 savory pancakes on a tawa. Stuff with 80g grated paneer, coriander, and carrots. Serve with mint chutney." },
      { name: "Lunch", title: "2-Egg Curry + Moong Dal + Rice", type: "Balanced", time: "15m", emoji: "🥚", bg: "bg-green-100", border: "border-green-300", text: "text-green-900", recipe: "Pan-toss 2 hard-boiled eggs in a quick tomato/onion gravy. Serve with 1 bowl of moong dal, 1 cup rice, and a raw crunchy salad." },
      { name: "Dinner", title: "One-Pot Veggie Dal Khichdi", type: "Restorative", time: "20m", emoji: "🥘", bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-900", recipe: "Pressure cook equal parts yellow moong dal & rice with diced carrots, beans, and peas. Temper with 1 tsp ghee, cumin, and hing. Serve with curd." }
    ]
  },
  Thursday: {
    prepAlert: null,
    meals: [
      { name: "Breakfast", title: "3-Egg Veggie Scramble & Toast", type: "High-Protein", time: "10m", emoji: "🍳", bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-900", recipe: "Scramble 2 whole eggs + 1 egg white with chopped spinach and onions. Serve with 1-2 slices of multigrain toast and 2 walnut halves." },
      { name: "Lunch", title: "Leftover Egg Curry + Dal", type: "Fiber-First", time: "5m", emoji: "🍛", bg: "bg-green-100", border: "border-green-300", text: "text-green-900", recipe: "Reheat Wednesday's Egg Curry and Moong Dal. EAT FIRST: Raw veggie salad. Serve with 2 rotis." },
      { name: "Dinner", title: "Pan-Seared Fish or Paneer", type: "Low-Carb", time: "15m", emoji: "🐟", bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-900", recipe: "Pan-sear 150g fish fillet or paneer cubes with turmeric, chili powder, and a little mustard oil. Toss with stir-fried broccoli and onions. 2 rotis." }
    ]
  },
  Friday: {
    prepAlert: null,
    meals: [
      { name: "Breakfast", title: "Peanut Butter Banana Oats", type: "Zero-Cook", time: "2m", emoji: "🍌", bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-900", recipe: "Overnight oats made with 40g rolled oats, chia seeds, milk. Top with 1 tbsp peanut butter and half a sliced banana in the morning." },
      { name: "Lunch", title: "Paneer/Tofu Bhurji + Capsicum", type: "High-Energy", time: "12m", emoji: "🥗", bg: "bg-green-100", border: "border-green-300", text: "text-green-900", recipe: "Crush 150g paneer or firm tofu. Sauté with bell peppers, peas, and onions. EAT FIRST: Cucumber salad. Serve with 2 rotis." },
      { name: "Dinner", title: "Dal Palak + Steamed Rice", type: "Iron-Boost", time: "10m", emoji: "🌿", bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-900", recipe: "Warm up batch-cooked Dal Palak (Spinach Dal). Serve with 1 cup steamed rice and a side of 100g curd." }
    ]
  },
  Saturday: {
    prepAlert: null,
    meals: [
      { name: "Breakfast", title: "Besan Chilla + Mint Chutney", type: "High-Protein", time: "15m", emoji: "🥞", bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-900", recipe: "Whip up 2 besan (chickpea flour) savory pancakes stuffed with veggies. Serve with plain curd or mint-coriander chutney." },
      { name: "Lunch", title: "Leftover Dal Palak + Boiled Eggs", type: "Fiber-First", time: "5m", emoji: "🍲", bg: "bg-green-100", border: "border-green-300", text: "text-green-900", recipe: "Reheat Dal Palak. Add 2 freshly boiled eggs for protein. EAT FIRST: Chopped carrot/cucumber salad. Serve with 2 rotis." },
      { name: "Dinner", title: "Soya/Chicken Stir-fry", type: "Sleep Aid", time: "15m", emoji: "🥢", bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-900", recipe: "Quick stir-fry of 150g chicken or rehydrated soya chunks with bell peppers, soy sauce, and a pinch of black pepper. Serve with 2 rotis." }
    ]
  },
  Sunday: {
    prepAlert: "Batch Cook Tonight: Yellow Dal & Boil Eggs!",
    meals: [
      { name: "Breakfast", title: "3 Boiled Eggs & Buttered Toast", type: "Quick-Start", time: "5m", emoji: "🥚", bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-900", recipe: "Slice 3 boiled eggs (keep some in fridge for the week). Season with salt and pepper. Serve with 1-2 slices of buttered toast and fresh fruit." },
      { name: "Lunch", title: "Fresh Fish/Chicken Curry + Rice", type: "Sunday Special", time: "25m", emoji: "🥘", bg: "bg-green-100", border: "border-green-300", text: "text-green-900", recipe: "Cook a fresh batch of your favorite chicken or fish curry. EAT FIRST: Generous onion/cucumber salad. Serve with steamed rice." },
      { name: "Dinner", title: "Light Moong Dal + Phulkas", type: "Digestive Reset", time: "15m", emoji: "🥣", bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-900", recipe: "Cook a fresh, light yellow moong dal (cook extra for Mon/Tue). Serve with 2 phulkas and roasted papad." }
    ]
  }
};

export const GROCERY_LIST = [
  { category: "Proteins & Dairy", items: ["1 Dozen Eggs", "Paneer (400g)", "Chicken Breast/Fish (500g)", "Soya Chunks (1 pack)", "Curd/Yogurt (1 large tub)", "Milk (1L)"] },
  { category: "Produce (Veggies & Fruits)", items: ["Cucumbers (4-5)", "Carrots (4-5)", "Onions & Tomatoes (1kg each)", "Spinach (2 large bunches)", "Capsicum/Bell Peppers (2)", "Green Chilies, Coriander, Lemon, Garlic, Ginger", "Bananas/Seasonal Fruit"] },
  { category: "Pantry Staples (Check if needed)", items: ["Whole Wheat Atta", "Rice (Brown or White)", "Yellow Moong Dal", "Toor Dal (Arhar)", "Rolled Oats", "Besan (Chickpea Flour)", "Chia Seeds, Almonds, Walnuts", "Cooking Oil & Ghee"] }
];

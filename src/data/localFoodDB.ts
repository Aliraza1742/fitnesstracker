// Local nutrition database as fallback when Nutritionix API is unavailable
// Data sourced from USDA standard nutrition values

export interface LocalFoodItem {
  food_name: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_fat: number;
  nf_total_carbohydrate: number;
  serving_qty: number;
  serving_unit: string;
  keywords: string[];
}

export const LOCAL_FOOD_DB: LocalFoodItem[] = [
  { food_name: 'Apple', nf_calories: 95, nf_protein: 0.5, nf_total_fat: 0.3, nf_total_carbohydrate: 25, serving_qty: 1, serving_unit: 'medium', keywords: ['apple', 'apples'] },
  { food_name: 'Banana', nf_calories: 105, nf_protein: 1.3, nf_total_fat: 0.4, nf_total_carbohydrate: 27, serving_qty: 1, serving_unit: 'medium', keywords: ['banana', 'bananas'] },
  { food_name: 'Egg', nf_calories: 78, nf_protein: 6, nf_total_fat: 5, nf_total_carbohydrate: 0.6, serving_qty: 1, serving_unit: 'large', keywords: ['egg', 'eggs', 'boiled egg', 'fried egg'] },
  { food_name: 'White Rice', nf_calories: 206, nf_protein: 4.3, nf_total_fat: 0.4, nf_total_carbohydrate: 45, serving_qty: 1, serving_unit: 'cup cooked', keywords: ['rice', 'white rice', 'cooked rice', 'cup of rice'] },
  { food_name: 'Chicken Breast', nf_calories: 165, nf_protein: 31, nf_total_fat: 3.6, nf_total_carbohydrate: 0, serving_qty: 100, serving_unit: 'grams', keywords: ['chicken', 'chicken breast', 'grilled chicken'] },
  { food_name: 'Whole Milk', nf_calories: 149, nf_protein: 8, nf_total_fat: 8, nf_total_carbohydrate: 12, serving_qty: 1, serving_unit: 'cup', keywords: ['milk', 'whole milk', 'glass of milk', 'cup of milk'] },
  { food_name: 'Bread (White)', nf_calories: 79, nf_protein: 2.7, nf_total_fat: 1, nf_total_carbohydrate: 15, serving_qty: 1, serving_unit: 'slice', keywords: ['bread', 'white bread', 'slice of bread', 'toast'] },
  { food_name: 'Oatmeal', nf_calories: 166, nf_protein: 5.9, nf_total_fat: 3.6, nf_total_carbohydrate: 28, serving_qty: 1, serving_unit: 'cup cooked', keywords: ['oatmeal', 'oats', 'oat', 'porridge', 'bowl of oatmeal'] },
  { food_name: 'Orange', nf_calories: 62, nf_protein: 1.2, nf_total_fat: 0.2, nf_total_carbohydrate: 15, serving_qty: 1, serving_unit: 'medium', keywords: ['orange', 'oranges'] },
  { food_name: 'Yogurt (Plain)', nf_calories: 100, nf_protein: 17, nf_total_fat: 0.7, nf_total_carbohydrate: 6, serving_qty: 170, serving_unit: 'grams', keywords: ['yogurt', 'yoghurt', 'greek yogurt', 'plain yogurt'] },
  { food_name: 'Almonds', nf_calories: 164, nf_protein: 6, nf_total_fat: 14, nf_total_carbohydrate: 6, serving_qty: 28, serving_unit: 'grams (1 oz)', keywords: ['almond', 'almonds', 'nuts'] },
  { food_name: 'Peanut Butter', nf_calories: 188, nf_protein: 8, nf_total_fat: 16, nf_total_carbohydrate: 6, serving_qty: 2, serving_unit: 'tablespoons', keywords: ['peanut butter', 'peanutbutter', 'pb'] },
  { food_name: 'Broccoli', nf_calories: 55, nf_protein: 3.7, nf_total_fat: 0.6, nf_total_carbohydrate: 11, serving_qty: 1, serving_unit: 'cup', keywords: ['broccoli'] },
  { food_name: 'Salmon', nf_calories: 208, nf_protein: 20, nf_total_fat: 13, nf_total_carbohydrate: 0, serving_qty: 100, serving_unit: 'grams', keywords: ['salmon', 'grilled salmon', 'fish'] },
  { food_name: 'Pizza (1 slice)', nf_calories: 285, nf_protein: 12, nf_total_fat: 10, nf_total_carbohydrate: 36, serving_qty: 1, serving_unit: 'slice', keywords: ['pizza', 'slice of pizza', 'slices of pizza'] },
  { food_name: 'Burger', nf_calories: 354, nf_protein: 20, nf_total_fat: 17, nf_total_carbohydrate: 30, serving_qty: 1, serving_unit: 'burger', keywords: ['burger', 'hamburger', 'cheeseburger'] },
  { food_name: 'French Fries', nf_calories: 312, nf_protein: 4, nf_total_fat: 15, nf_total_carbohydrate: 41, serving_qty: 1, serving_unit: 'medium serving', keywords: ['fries', 'french fries', 'chips'] },
  { food_name: 'Pasta', nf_calories: 220, nf_protein: 8, nf_total_fat: 1.3, nf_total_carbohydrate: 43, serving_qty: 1, serving_unit: 'cup cooked', keywords: ['pasta', 'spaghetti', 'noodles', 'macaroni'] },
  { food_name: 'Protein Shake', nf_calories: 130, nf_protein: 25, nf_total_fat: 2, nf_total_carbohydrate: 5, serving_qty: 1, serving_unit: 'scoop', keywords: ['protein shake', 'protein powder', 'whey', 'protein'] },
  { food_name: 'Avocado', nf_calories: 240, nf_protein: 3, nf_total_fat: 22, nf_total_carbohydrate: 12, serving_qty: 1, serving_unit: 'medium', keywords: ['avocado', 'avocados'] },
  { food_name: 'Sweet Potato', nf_calories: 103, nf_protein: 2.3, nf_total_fat: 0.1, nf_total_carbohydrate: 24, serving_qty: 1, serving_unit: 'medium', keywords: ['sweet potato', 'sweet potatoes', 'yam'] },
  { food_name: 'Tuna (canned)', nf_calories: 109, nf_protein: 25, nf_total_fat: 1, nf_total_carbohydrate: 0, serving_qty: 100, serving_unit: 'grams', keywords: ['tuna', 'canned tuna', 'tuna can'] },
  { food_name: 'Orange Juice', nf_calories: 112, nf_protein: 1.7, nf_total_fat: 0.5, nf_total_carbohydrate: 26, serving_qty: 1, serving_unit: 'cup', keywords: ['orange juice', 'oj', 'juice'] },
  { food_name: 'Coffee (black)', nf_calories: 2, nf_protein: 0.3, nf_total_fat: 0, nf_total_carbohydrate: 0, serving_qty: 1, serving_unit: 'cup', keywords: ['coffee', 'black coffee', 'espresso'] },
  { food_name: 'Lentils', nf_calories: 230, nf_protein: 18, nf_total_fat: 0.8, nf_total_carbohydrate: 40, serving_qty: 1, serving_unit: 'cup cooked', keywords: ['lentils', 'dal', 'daal', 'lentil'] },
];

/**
 * Search the local food database using keyword matching.
 * Returns items whose keywords match any word in the query string.
 */
export function searchLocalFoods(query: string): LocalFoodItem[] {
  const queryLower = query.toLowerCase().trim();
  const queryWords = queryLower.split(/\s+/);

  const scored: { item: LocalFoodItem; score: number }[] = LOCAL_FOOD_DB.map(item => {
    let score = 0;
    for (const keyword of item.keywords) {
      if (queryLower.includes(keyword)) {
        score += keyword.length; // Longer keyword match = better score
      }
    }
    return { item, score };
  });

  return scored
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.item);
}

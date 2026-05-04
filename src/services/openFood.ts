import axios from 'axios';

// USDA FoodData Central — free, reliable, no sign-up required.
// DEMO_KEY allows 30 requests/hour for development. Get a free personal key at:
// https://api.data.gov/signup/ for higher limits (1000 req/hr).
const USDA_API_KEY = 'DEMO_KEY';

const usdaApi = axios.create({
  baseURL: 'https://api.nal.usda.gov/fdc/v1',
  timeout: 12000,
});

export interface OpenFoodItem {
  food_name: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_fat: number;
  nf_total_carbohydrate: number;
  nf_fiber: number;
  nf_sugars: number;
  serving_qty: number;
  serving_unit: string;
  brand?: string;
}

export interface OpenFoodResponse {
  foods: OpenFoodItem[];
}

// Nutrient IDs in the USDA database
const NUTRIENT = {
  CALORIES: 1008,
  PROTEIN: 1003,
  FAT: 1004,
  CARBS: 1005,
  FIBER: 1079,
  SUGARS: 2000,
};

const getNutrientValue = (nutrients: any[], id: number): number => {
  const found = nutrients.find((n: any) => n.nutrientId === id);
  return found ? Math.round(found.value ?? 0) : 0;
};

const parseFood = (food: any): OpenFoodItem | null => {
  const nutrients: any[] = food.foodNutrients ?? [];
  const calories = getNutrientValue(nutrients, NUTRIENT.CALORIES);
  if (!calories) return null;

  return {
    food_name: food.description || 'Unknown Food',
    nf_calories: calories,
    nf_protein: getNutrientValue(nutrients, NUTRIENT.PROTEIN),
    nf_total_fat: getNutrientValue(nutrients, NUTRIENT.FAT),
    nf_total_carbohydrate: getNutrientValue(nutrients, NUTRIENT.CARBS),
    nf_fiber: getNutrientValue(nutrients, NUTRIENT.FIBER),
    nf_sugars: getNutrientValue(nutrients, NUTRIENT.SUGARS),
    serving_qty: 100,
    serving_unit: 'g',
    brand: food.brandOwner || food.brandName || undefined,
  };
};

export const openFoodService = {
  /**
   * Search USDA FoodData Central by keyword.
   * Returns up to 8 results sorted by relevance.
   */
  searchFood: async (query: string): Promise<OpenFoodResponse> => {
    const response = await usdaApi.get('/foods/search', {
      params: {
        query: query.trim(),
        api_key: USDA_API_KEY,
        pageSize: 20,
        dataType: 'Foundation,SR Legacy,Branded',
      },
    });

    const foods: OpenFoodItem[] = (response.data?.foods ?? [])
      .map(parseFood)
      .filter((item: OpenFoodItem | null): item is OpenFoodItem =>
        item !== null && item.nf_calories > 0 && item.food_name.trim() !== '',
      )
      .slice(0, 8);

    return { foods };
  },
};

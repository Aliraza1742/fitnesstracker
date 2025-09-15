
// Nutritionix-specific types
export interface NutritionixExercise {
  name: string;
  duration_min: number;
  nf_calories: number;
  met: number;
  photo?: {
    highres: string;
    thumb: string;
  };
}

export interface NutritionixFood {
  food_name: string;
  nf_calories: number;
  serving_qty: number;
  serving_unit: string;
}

export interface CalorieCalculationResult {
  activity: string;
  duration: number;
  calories: number;
  source: 'nutritionix' | 'estimation';
}

export interface ExerciseItem {
  name: string;
  duration_min: number;
  nf_calories: number;
  met: number;
  photo?: {
    highres: string;
    thumb: string;
  };
}

export interface ExerciseResponse {
  exercises: ExerciseItem[];
}

export interface FoodItem {
  food_name: string;
  nf_calories: number;
  serving_qty: number;
  serving_unit: string;
}

export interface FoodResponse {
  foods: FoodItem[];
}
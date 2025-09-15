import axios from 'axios';
import { 
  NUTRITIONIX_APP_ID, 
  NUTRITIONIX_API_KEY 
} from '@env';

// DEBUG: Check if environment variables are loaded
console.log('Nutritionix App ID:', NUTRITIONIX_APP_ID || 'NOT FOUND');
console.log('Nutritionix API Key:', NUTRITIONIX_API_KEY ? 'LOADED' : 'NOT FOUND');
console.log('API Key first 5 chars:', NUTRITIONIX_API_KEY ? NUTRITIONIX_API_KEY.substring(0, 5) + '...' : 'N/A');

// Create axios instance with base configuration
export const nutritionixApi = axios.create({
  baseURL: 'https://trackapi.nutritionix.com/v2',
  headers: {
    'Content-Type': 'application/json',
    'x-app-id': NUTRITIONIX_APP_ID,
    'x-app-key': NUTRITIONIX_API_KEY,
  },
});

// Add request interceptor for debugging
nutritionixApi.interceptors.request.use(
  (config) => {
    console.log('Making API Request to:', config.url);
    console.log('Request Headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
nutritionixApi.interceptors.response.use(
  (response) => {
    console.log('API Response Received:', response.status);
    console.log('Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Types for Nutritionix API responses
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

// API functions
export const nutritionixService = {
  /**
   * Convert natural language exercise description to calorie data
   * Example: "ran 3 miles" -> calories burned
   */
  naturalExercise: async (query: string, options?: {
    gender?: 'male' | 'female';
    weight_kg?: number;
    height_cm?: number;
    age?: number;
  }): Promise<ExerciseResponse> => {
    try {
      console.log('Making naturalExercise API call with query:', query);
      const response = await nutritionixApi.post<ExerciseResponse>('/natural/exercise', {
        query,
        gender: options?.gender,
        weight_kg: options?.weight_kg,
        height_cm: options?.height_cm,
        age: options?.age,
      });
      return response.data;
    } catch (error) {
      console.error('naturalExercise API call failed:', error);
      throw error;
    }
  },

  /**
   * Search for food items and their nutrition data
   */
  searchFood: async (query: string): Promise<FoodResponse> => {
    const response = await nutritionixApi.post<FoodResponse>('/natural/nutrients', {
      query,
    });
    return response.data;
  },

  /**
   * Get exercise by ID (from their database)
   */
  getExercise: async (exerciseId: string) => {
    const response = await nutritionixApi.get(`/exercise/${exerciseId}`);
    return response.data;
  },

  /**
   * Search exercises in their database
   */
  searchExercises: async (query: string) => {
    const response = await nutritionixApi.get('/search/exercises', {
      params: { query }
    });
    return response.data;
  },
};

// Utility function to calculate calories for common exercises
export const calculateCaloriesForActivity = async (
  activity: string, 
  durationMinutes: number,
  userWeightKg?: number
): Promise<number> => {
  try {
    console.log('Calculating calories for activity:', activity, durationMinutes, userWeightKg);
    
    const response = await nutritionixService.naturalExercise(
      `${activity} for ${durationMinutes} minutes`,
      userWeightKg ? { weight_kg: userWeightKg } : undefined
    );
    
    const calories = response.exercises[0]?.nf_calories || 0;
    console.log('API calculated calories:', calories);
    return calories;
    
  } catch (error) {
    console.error('Error calculating calories with Nutritionix API:', error);
    console.log('Falling back to MET estimation');
    // Fallback: return estimated calories based on MET values
    return estimateCalories(activity, durationMinutes, userWeightKg);
  }
};

// Fallback estimation if API fails
const estimateCalories = (activity: string, durationMinutes: number, weightKg: number = 70): number => {
  const metValues: { [key: string]: number } = {
    'running': 8,
    'walking': 3.5,
    'cycling': 6,
    'swimming': 7,
    'yoga': 3,
    'weight training': 6,
    'jumping rope': 10,
    'hiking': 6,
  };

  const met = metValues[activity.toLowerCase()] || 4; // Default MET value
  const estimated = (met * 3.5 * (weightKg || 70) * durationMinutes) / 200;
  console.log('Estimated calories (fallback):', estimated);
  return estimated;
};
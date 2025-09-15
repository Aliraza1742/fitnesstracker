import { useState, useCallback } from 'react';
import { nutritionixService, calculateCaloriesForActivity } from '../services/nutritionix';
import { CalorieCalculationResult } from '../types/api';

export const useNutritionix = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateActivityCalories = useCallback(async (
    activity: string,
    durationMinutes: number,
    userWeightKg?: number
  ): Promise<CalorieCalculationResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const calories = await calculateCaloriesForActivity(activity, durationMinutes, userWeightKg);
      
      return {
        activity,
        duration: durationMinutes,
        calories: Math.round(calories),
        source: calories > 0 ? 'nutritionix' : 'estimation'
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate calories';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchExercises = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await nutritionixService.searchExercises(query);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search exercises';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    calculateActivityCalories,
    searchExercises,
    isLoading,
    error,
    clearError,
  };
};
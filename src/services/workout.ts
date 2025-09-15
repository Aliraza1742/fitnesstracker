import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  WorkoutSession,
  WorkoutExercise,
  ExerciseSuggestion,
} from '../types/workout';
import {
  nutritionixService,
  calculateCaloriesForActivity,
} from './nutritionix';

const STORAGE_KEYS = {
  WORKOUTS: '@FitTrack:workouts',
};

// Debug function to log storage operations
const debugLog = (message: string, data?: any) => {
  console.log(
    `[WorkoutService] ${message}`,
    data ? JSON.stringify(data, null, 2) : '',
  );
};

export const workoutService = {
  // Store workouts
  storeWorkouts: async (workouts: WorkoutSession[]): Promise<void> => {
    try {
      debugLog('Storing workouts:', workouts);
      const workoutsJSON = JSON.stringify(workouts);
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, workoutsJSON);
      debugLog('Workouts stored successfully');
    } catch (error) {
      console.error('Error storing workouts:', error);
      throw new Error('Failed to store workout data');
    }
  },

  // Get all workouts for user
  getWorkouts: async (userId: string): Promise<WorkoutSession[]> => {
    try {
      debugLog(`Fetching workouts for user: ${userId}`);
      const workoutsData = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
      debugLog('Raw data from storage:', workoutsData);

      const allWorkouts: WorkoutSession[] = workoutsData
        ? JSON.parse(workoutsData)
        : [];
      debugLog('All workouts from storage:', allWorkouts);

      const userWorkouts = allWorkouts.filter(
        workout => workout.userId === userId,
      );
      debugLog(`Filtered workouts for user ${userId}:`, userWorkouts);

      return userWorkouts;
    } catch (error) {
      console.error('Error retrieving workouts:', error);
      return [];
    }
  },

  // Add new workout session
  addWorkout: async (workout: WorkoutSession): Promise<void> => {
    try {
      debugLog('Adding new workout:', workout);

      const workoutsData = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
      const allWorkouts: WorkoutSession[] = workoutsData
        ? JSON.parse(workoutsData)
        : [];

      debugLog('Current workouts before addition:', allWorkouts);

      // Add the new workout
      allWorkouts.push(workout);

      debugLog('Workouts after addition:', allWorkouts);

      await workoutService.storeWorkouts(allWorkouts);
      debugLog('Workout added successfully');
    } catch (error) {
      console.error('Error adding workout:', error);
      throw new Error('Failed to add workout');
    }
  },

  // Calculate calories for an exercise using Nutritionix
  calculateExerciseCalories: async (
    exerciseName: string,
    durationMinutes: number,
    userWeightKg?: number,
  ): Promise<number> => {
    try {
      debugLog(
        `Calculating calories for: ${exerciseName}, ${durationMinutes}min, ${userWeightKg}kg`,
      );

      // NOW THIS WILL ACTUALLY CALL THE NUTRITIONIX API
      const calories = await calculateCaloriesForActivity(
        exerciseName,
        durationMinutes,
        userWeightKg,
      );

      debugLog(`Calculated calories: ${calories}`);
      return calories;
    } catch (error) {
      console.error('Error in calculateExerciseCalories:', error);
      debugLog('Falling back to estimation');
      return workoutService.estimateCalories(
        exerciseName,
        durationMinutes,
        userWeightKg,
      );
    }
  },

  // Fallback calorie estimation
  estimateCalories: (
    activity: string,
    durationMinutes: number,
    weightKg: number = 70,
  ): number => {
    const metValues: { [key: string]: number } = {
      running: 8,
      jogging: 7,
      walking: 3.5,
      cycling: 6,
      swimming: 7,
      yoga: 3,
      pilates: 3,
      'weight training': 6,
      weightlifting: 6,
      bodyweight: 5,
      'jumping rope': 10,
      hiking: 6,
      dancing: 5,
      elliptical: 5,
      rowing: 7,
      hiit: 8,
      'circuit training': 7,
      boxing: 8,
      'martial arts': 7,
    };

    // Find the best matching MET value
    const activityLower = activity.toLowerCase();
    let met = 4; // Default MET value

    for (const [key, value] of Object.entries(metValues)) {
      if (activityLower.includes(key)) {
        met = value;
        break;
      }
    }

    debugLog(`Estimated calories using MET ${met} for ${activity}`);
    return Math.round((met * 3.5 * weightKg * durationMinutes) / 200);
  },

  // Get exercise suggestions based on user goals
  getExerciseSuggestions: async (
    fitnessGoal?: string,
    availableTime?: number,
    userWeightKg?: number,
  ): Promise<ExerciseSuggestion[]> => {
    try {
      debugLog(
        `Getting suggestions for goal: ${fitnessGoal}, time: ${availableTime}min`,
      );

      const suggestions: ExerciseSuggestion[] = [];

      // Map fitness goals to appropriate exercises
      const goalExercises: { [key: string]: string[] } = {
        weight_loss: [
          'running',
          'cycling',
          'swimming',
          'jumping rope',
          'HIIT',
          'circuit training',
        ],
        muscle_gain: [
          'weight training',
          'weightlifting',
          'bodyweight exercises',
          'resistance training',
        ],
        endurance: [
          'running',
          'cycling',
          'swimming',
          'rowing',
          'hiking',
          'elliptical',
        ],
        general_fitness: [
          'walking',
          'yoga',
          'pilates',
          'dancing',
          'bodyweight exercises',
          'cycling',
        ],
        strength: [
          'weight training',
          'weightlifting',
          'powerlifting',
          'resistance training',
        ],
        flexibility: ['yoga', 'pilates', 'stretching', 'mobility exercises'],
      };

      const exercises =
        goalExercises[fitnessGoal?.toLowerCase() || 'general_fitness'] ||
        goalExercises.general_fitness;

      for (const exercise of exercises) {
        const duration = availableTime ? Math.min(30, availableTime) : 30;

        try {
          const calories = await workoutService.calculateExerciseCalories(
            exercise,
            duration,
            userWeightKg,
          );

          suggestions.push({
            name: exercise,
            duration,
            estimatedCalories: Math.round(calories),
          });

          if (suggestions.length >= 3) break; // Limit to 3 suggestions
        } catch (error) {
          console.error(`Error calculating calories for ${exercise}:`, error);
          // Continue with next exercise if one fails
          continue;
        }
      }

      debugLog('Generated suggestions:', suggestions);
      return suggestions;
    } catch (error) {
      console.error('Error getting exercise suggestions:', error);
      return [];
    }
  },

  // Delete workout
  deleteWorkout: async (workoutId: string): Promise<void> => {
    try {
      debugLog(`Deleting workout: ${workoutId}`);

      const workoutsData = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
      const allWorkouts: WorkoutSession[] = workoutsData
        ? JSON.parse(workoutsData)
        : [];

      const filteredWorkouts = allWorkouts.filter(
        workout => workout.id !== workoutId,
      );
      debugLog(`Workouts after deletion: ${filteredWorkouts.length} remaining`);

      await workoutService.storeWorkouts(filteredWorkouts);
      debugLog('Workout deleted successfully');
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw new Error('Failed to delete workout');
    }
  },

  // Get workout statistics
  getWorkoutStatistics: async (
    userId: string,
  ): Promise<{
    totalWorkouts: number;
    totalCalories: number;
    totalDuration: number;
    averageCaloriesPerWorkout: number;
  }> => {
    try {
      debugLog(`Getting statistics for user: ${userId}`);

      const workouts = await workoutService.getWorkouts(userId);

      const totalCalories = workouts.reduce(
        (sum, workout) => sum + workout.totalCalories,
        0,
      );
      const totalDuration = workouts.reduce(
        (sum, workout) => sum + workout.totalDuration,
        0,
      );
      const totalWorkouts = workouts.length;
      const averageCaloriesPerWorkout =
        totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0;

      const stats = {
        totalWorkouts,
        totalCalories,
        totalDuration,
        averageCaloriesPerWorkout,
      };

      debugLog('Calculated statistics:', stats);
      return stats;
    } catch (error) {
      console.error('Error getting workout statistics:', error);
      return {
        totalWorkouts: 0,
        totalCalories: 0,
        totalDuration: 0,
        averageCaloriesPerWorkout: 0,
      };
    }
  },

  // Clear all workout data (for debugging)
  clearAllWorkouts: async (): Promise<void> => {
    try {
      debugLog('Clearing all workouts');
      await AsyncStorage.removeItem(STORAGE_KEYS.WORKOUTS);
      debugLog('All workouts cleared');
    } catch (error) {
      console.error('Error clearing workouts:', error);
      throw new Error('Failed to clear workouts');
    }
  },

  // Get all workouts regardless of user (for debugging)
  getAllWorkouts: async (): Promise<WorkoutSession[]> => {
    try {
      const workoutsData = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
      return workoutsData ? JSON.parse(workoutsData) : [];
    } catch (error) {
      console.error('Error getting all workouts:', error);
      return [];
    }
  },
};

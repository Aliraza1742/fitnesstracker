import { create } from 'zustand';
import { WorkoutSession, WorkoutFormData, WorkoutExercise, ExerciseSuggestion } from '../types/workout';
import { workoutService } from '../services/workout';
import { ProgressService } from '../services/progress';
import { useAuthStore } from './useAuthStore';

interface WorkoutState {
  workouts: WorkoutSession[];
  isLoading: boolean;
  error: string | null;
  
  loadWorkouts: () => Promise<void>;
  addWorkout: (exercises: WorkoutFormData[]) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  calculateExerciseCalories: (exerciseName: string, durationMinutes: number) => Promise<number>;
  getExerciseSuggestions: (availableTime?: number) => Promise<ExerciseSuggestion[]>;
  getStatistics: () => Promise<{
    totalWorkouts: number;
    totalCalories: number;
    totalDuration: number;
    averageCaloriesPerWorkout: number;
  }>;
  clearError: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  isLoading: false,
  error: null,

  loadWorkouts: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ isLoading: true, error: null });
    try {
      const userWorkouts = await workoutService.getWorkouts(user.id);
      set({ workouts: userWorkouts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to load workouts', isLoading: false });
    }
  },

  addWorkout: async (exercisesData: WorkoutFormData[]) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User must be logged in');

    set({ isLoading: true, error: null });
    try {
      const exercises: WorkoutExercise[] = [];
      let totalCalories = 0;
      let totalDuration = 0;

      for (const exerciseData of exercisesData) {
        const calories = await workoutService.calculateExerciseCalories(
          exerciseData.exerciseName,
          exerciseData.duration,
          user.weight
        );

        const exercise: WorkoutExercise = {
          id: Date.now().toString() + Math.random().toString(),
          name: exerciseData.exerciseName,
          duration: exerciseData.duration,
          calories: Math.round(calories),
          notes: exerciseData.notes,
        };

        exercises.push(exercise);
        totalCalories += exercise.calories;
        totalDuration += exercise.duration;
      }

      const newWorkout: WorkoutSession = {
        id: Date.now().toString(),
        userId: user.id,
        date: new Date().toISOString(),
        exercises,
        totalCalories,
        totalDuration,
      };

      await workoutService.addWorkout(newWorkout);
      set((state) => ({ workouts: [...state.workouts, newWorkout], isLoading: false }));
      
      // Handle notifications
      ProgressService.sendWorkoutCompletionNotification(newWorkout);
      ProgressService.checkAndSendAchievements(user.id);
      
    } catch (error: any) {
      set({ error: error.message || 'Failed to add workout', isLoading: false });
      throw error;
    }
  },

  deleteWorkout: async (workoutId: string) => {
    set({ isLoading: true, error: null });
    try {
      await workoutService.deleteWorkout(workoutId);
      set((state) => ({
        workouts: state.workouts.filter(w => w.id !== workoutId),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete workout', isLoading: false });
      throw error;
    }
  },

  calculateExerciseCalories: async (exerciseName: string, durationMinutes: number) => {
    const user = useAuthStore.getState().user;
    if (!user) return 0;
    return await workoutService.calculateExerciseCalories(exerciseName, durationMinutes, user.weight);
  },

  getExerciseSuggestions: async (availableTime?: number) => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    return await workoutService.getExerciseSuggestions(user.fitnessGoal, availableTime, user.weight);
  },

  getStatistics: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      return { totalWorkouts: 0, totalCalories: 0, totalDuration: 0, averageCaloriesPerWorkout: 0 };
    }
    return await workoutService.getWorkoutStatistics(user.id);
  },

  clearError: () => set({ error: null }),
}));

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WorkoutSession, WorkoutExercise, ExerciseSuggestion, WorkoutFormData } from '../types/workout';
import { workoutService } from '../services/workout';
import { useAuth } from './Auth';
import { ProgressService } from '../services/progress';

interface WorkoutContextValue {
  workouts: WorkoutSession[];
  isLoading: boolean;
  error: string | null;
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
  loadWorkouts: () => Promise<void>;
  getAllWorkouts: () => Promise<WorkoutSession[]>;
}

const WorkoutContext = createContext<WorkoutContextValue | undefined>(undefined);

interface WorkoutProviderProps {
  children: ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWorkouts();
    }
  }, [user]);

  const loadWorkouts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userWorkouts = await workoutService.getWorkouts(user.id);
      setWorkouts(userWorkouts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workouts';
      setError(errorMessage);
      console.error('Error loading workouts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addWorkout = async (exercisesData: WorkoutFormData[]) => {
    if (!user) {
      throw new Error('User must be logged in to add workouts');
    }

    setIsLoading(true);
    setError(null);

    try {
      const exercises: WorkoutExercise[] = [];
      let totalCalories = 0;
      let totalDuration = 0;

      // Calculate calories for each exercise using Nutritionix
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
      setWorkouts(prev => [...prev, newWorkout]);
      
      // AUTOMATIC NOTIFICATION: Send workout completion notification
      ProgressService.sendWorkoutCompletionNotification(newWorkout);
      
      // AUTOMATIC NOTIFICATION: Check for achievements
      ProgressService.checkAndSendAchievements(user.id);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add workout';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    setIsLoading(true);
    try {
      await workoutService.deleteWorkout(workoutId);
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete workout';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateExerciseCalories = async (exerciseName: string, durationMinutes: number): Promise<number> => {
    if (!user) return 0;
    
    try {
      return await workoutService.calculateExerciseCalories(exerciseName, durationMinutes, user.weight);
    } catch (err) {
      console.error('Error calculating calories:', err);
      throw new Error('Failed to calculate calories');
    }
  };

  const getExerciseSuggestions = async (availableTime?: number): Promise<ExerciseSuggestion[]> => {
    if (!user) return [];
    
    try {
      return await workoutService.getExerciseSuggestions(user.fitnessGoal, availableTime, user.weight);
    } catch (err) {
      console.error('Error getting exercise suggestions:', err);
      return [];
    }
  };

  const getAllWorkouts = async (): Promise<WorkoutSession[]> => {
    try {
      return await workoutService.getAllWorkouts();
    } catch (error) {
      console.error('Error getting all workouts:', error);
      return [];
    }
  };

  const getStatistics = async () => {
    if (!user) {
      return {
        totalWorkouts: 0,
        totalCalories: 0,
        totalDuration: 0,
        averageCaloriesPerWorkout: 0,
      };
    }

    try {
      return await workoutService.getWorkoutStatistics(user.id);
    } catch (err) {
      console.error('Error getting statistics:', err);
      return {
        totalWorkouts: 0,
        totalCalories: 0,
        totalDuration: 0,
        averageCaloriesPerWorkout: 0,
      };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: WorkoutContextValue = {
    workouts,
    isLoading,
    error,
    addWorkout,
    deleteWorkout,
    calculateExerciseCalories,
    getExerciseSuggestions,
    getStatistics,
    clearError,
    loadWorkouts,
    getAllWorkouts,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom hook to use the workout context
export const useWorkout = (): WorkoutContextValue => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
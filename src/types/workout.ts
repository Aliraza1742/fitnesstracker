export interface WorkoutSession {
  id: string;
  userId: string;
  date: string;
  exercises: WorkoutExercise[];
  totalCalories: number;
  totalDuration: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
  notes?: string;
}

export interface ExerciseSuggestion {
  name: string;
  duration: number;
  estimatedCalories: number;
}

export interface WorkoutFormData {
  exerciseName: string;
  duration: number;
  notes?: string;
}
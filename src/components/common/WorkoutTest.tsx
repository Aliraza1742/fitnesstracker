import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useWorkout } from '../../hooks/useWorkout';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { AuthButton } from './AuthButton';

export const WorkoutTest: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { calculateExerciseCalories, addWorkout, getExerciseSuggestions, workouts, isLoading } = useWorkout();
  const [result, setResult] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const testCalorieCalculation = async () => {
    try {
      const calories = await calculateExerciseCalories('running', 30);
      setResult({ type: 'calories', data: calories });
    } catch (err) {
      console.error('Test failed:', err);
    }
  };

  const testAddWorkout = async () => {
    try {
      await addWorkout([
        { exerciseName: 'running', duration: 30, notes: 'Morning run' },
        { exerciseName: 'weight training', duration: 45, notes: 'Chest day' },
      ]);
      setResult({ type: 'workout_added', data: 'Workout added successfully!' });
    } catch (err) {
      console.error('Test failed:', err);
    }
  };

  const testGetSuggestions = async () => {
    try {
      const exerciseSuggestions = await getExerciseSuggestions(60);
      setSuggestions(exerciseSuggestions);
      setResult({ type: 'suggestions', data: exerciseSuggestions });
    } catch (err) {
      console.error('Test failed:', err);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: theme.colors.background, flex: 1 }}>
      <Text style={{ color: theme.colors.onBackground, fontSize: 18, marginBottom: 20 }}>
        Workout API Test - User: {user?.firstName}
      </Text>
      
      <AuthButton
        title="Test Calorie Calculation (Running 30min)"
        onPress={testCalorieCalculation}
        loading={isLoading}
      />
      
      <AuthButton
        title="Test Add Workout"
        onPress={testAddWorkout}
        loading={isLoading}
      />
      
      <AuthButton
        title="Get Exercise Suggestions"
        onPress={testGetSuggestions}
        loading={isLoading}
      />

      {result && (
        <ScrollView style={{ marginTop: 20 }}>
          <Text style={{ color: theme.colors.onBackground }}>
            Result: {JSON.stringify(result, null, 2)}
          </Text>
        </ScrollView>
      )}

      {workouts.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>
            Workouts: {workouts.length}
          </Text>
          {workouts.map(workout => (
            <Text key={workout.id} style={{ color: theme.colors.onSurface }}>
              {new Date(workout.date).toLocaleDateString()} - {workout.totalCalories} calories
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};
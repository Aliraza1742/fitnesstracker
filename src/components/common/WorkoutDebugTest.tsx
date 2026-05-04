import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../hooks/useTheme';
import { useWorkout } from '../../hooks/useWorkout';
import { useAuth } from '../../hooks/useAuth';
import { AuthButton } from './AuthButton';
import { WorkoutFormModal } from '../workouts/WorkoutFormModal';
import { customAlert } from '../../utils/alert';


export const WorkoutDebugTest: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { addWorkout, workouts, loadWorkouts, isLoading } = useWorkout();
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setDebugLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAddWorkout = async () => {
    addLog('Starting manual workout test...');
    
    try {
      addLog('Calling addWorkout with test data...');
      await addWorkout([
        { exerciseName: 'Running', duration: 30, notes: 'Debug test run' },
        { exerciseName: 'Weight Training', duration: 45, notes: 'Debug chest day' },
      ]);
      
      addLog('Workout added successfully!');
      customAlert('Success', 'Workout added manually!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Error: ${errorMessage}`);
      customAlert('Error', `Failed to add workout: ${errorMessage}`);
    }
  };

  const handleModalSubmit = async (exercises: any[]) => {
    addLog(`Modal submitted with ${exercises.length} exercises`);
    
    try {
      addLog('Calling addWorkout from modal...');
      await addWorkout(exercises);
      addLog('Workout added successfully from modal!');
      setShowWorkoutModal(false);
      customAlert('Success', 'Workout added from modal!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Modal error: ${errorMessage}`);
      customAlert('Error', `Modal failed: ${errorMessage}`);
    }
  };

  const refreshWorkouts = async () => {
    addLog('Refreshing workouts...');
    await loadWorkouts();
    addLog(`Workouts refreshed. Total: ${workouts.length}`);
  };

  // STEP 5: Check AsyncStorage directly
  const checkStorage = async () => {
    try {
      addLog('Checking AsyncStorage...');
      
      // Get all storage keys
      const allKeys = await AsyncStorage.getAllKeys();
      addLog(`Storage keys: ${allKeys.join(', ')}`);
      
      // Check specifically for workouts
      const workoutsData = await AsyncStorage.getItem('@FitTrack:workouts');
      addLog(`Workouts data: ${workoutsData ? 'EXISTS' : 'NULL'}`);
      
      if (workoutsData) {
        try {
          const parsedWorkouts = JSON.parse(workoutsData);
          addLog(`Parsed workouts: ${parsedWorkouts.length} items`);
          
          // Check if current user's workouts are in storage
          const userWorkouts = parsedWorkouts.filter((w: any) => w.userId === user?.id);
          addLog(`Workouts for current user: ${userWorkouts.length} items`);
          
          // Log detailed workout info
          userWorkouts.forEach((workout: any, index: number) => {
            addLog(`Workout ${index + 1}: ${workout.exercises.length} exercises, ${workout.totalCalories} cal`);
          });
          
        } catch (parseError) {
          addLog(`Parse error: ${parseError}`);
        }
      }
      
    } catch (error) {
      addLog(`Storage check error: ${error}`);
    }
  };

  // Clear all workouts data
  const clearWorkoutsStorage = async () => {
    try {
      addLog('Clearing workouts storage...');
      await AsyncStorage.removeItem('@FitTrack:workouts');
      addLog('Workouts storage cleared');
      await loadWorkouts(); // Refresh the list
      customAlert('Cleared', 'Workouts storage cleared');
    } catch (error) {
      addLog(`Clear error: ${error}`);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: theme.colors.background, flex: 1 }}>
      <Text style={{ color: theme.colors.onBackground, fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Workflow Debug Test
      </Text>

      <Text style={{ color: theme.colors.onSurface, marginBottom: 10 }}>
        User: {user?.firstName} (ID: {user?.id})
      </Text>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <AuthButton
          title="Test Manual Add"
          onPress={testAddWorkout}
          loading={isLoading}
        />

        <AuthButton
          title="Open Modal"
          onPress={() => setShowWorkoutModal(true)}
          variant="secondary"
        />

        <AuthButton
          title="Refresh"
          onPress={refreshWorkouts}
          variant="secondary"
        />

        <AuthButton
          title="Check Storage"
          onPress={checkStorage}
          variant="secondary"
        />

        <AuthButton
          title="Clear Storage"
          onPress={clearWorkoutsStorage}
          variant="secondary"
        />

        <AuthButton
          title="Clear Logs"
          onPress={() => setDebugLogs([])}
          variant="secondary"
        />
      </View>

      {/* Workouts Count */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>
          Current Workouts: {workouts.length}
        </Text>
        {workouts.slice(0, 3).map((workout, index) => (
          <Text key={index} style={{ color: theme.colors.onSurface, fontSize: 12 }}>
            {new Date(workout.date).toLocaleDateString()} - {workout.totalCalories} cal
          </Text>
        ))}
      </View>

      {/* Debug Logs */}
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', marginBottom: 10 }}>
          Debug Logs:
        </Text>
        <ScrollView 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.1)', 
            padding: 10, 
            borderRadius: 8, 
            maxHeight: 300 
          }}
        >
          {debugLogs.map((log, index) => (
            <Text key={index} style={{ color: theme.colors.onSurface, fontSize: 10, marginBottom: 2 }}>
              {log}
            </Text>
          ))}
        </ScrollView>
      </View>

      {/* Workout Modal */}
      <WorkoutFormModal
        visible={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        onSubmit={handleModalSubmit}
        loading={isLoading}
      />
    </View>
  );
};
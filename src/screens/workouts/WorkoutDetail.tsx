import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useWorkout } from '../../hooks/useWorkout';
import { useRoute, RouteProp } from '@react-navigation/native';
import { WorkoutDetailHeader } from '../../components/workouts/WorkoutDetailHeader';
import { ExerciseItem } from '../../components/workouts/ExerciseItem';
import { WorkoutSession } from '../../types/workout';
import LinearGradient  from 'react-native-linear-gradient';


type WorkoutDetailRouteProp = RouteProp<{ params: { workoutId: string } }, 'params'>;

export const WorkoutDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { workouts } = useWorkout();
  const route = useRoute<WorkoutDetailRouteProp>();
  const { workoutId } = route.params;
  
  const [workout, setWorkout] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    const foundWorkout = workouts.find(w => w.id === workoutId);
    setWorkout(foundWorkout || null);
  }, [workoutId, workouts]);

  if (!workout) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.onBackground }]}>
          Workout not found
        </Text>
      </View>
    );
  }

  return (

  <LinearGradient
      colors={theme.colors.gradients.primary} 
      style={styles.container}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <WorkoutDetailHeader workout={workout} />
        
        <View style={styles.exercisesSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Exercises ({workout.exercises.length})
          </Text>
          
          {workout.exercises.map((exercise, index) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              index={index}
            />
          ))}
        </View>

        {workout.notes && (
          <View style={[styles.notesSection, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.notesTitle, { color: theme.colors.onBackground }]}>
              Workout Notes
            </Text>
            <Text style={[styles.notesText, { color: theme.colors.onSurface }]}>
              {workout.notes}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.grey500 }]}>
            Workout logged on {new Date(workout.date).toLocaleDateString()}
          </Text>
        </View>
        
      </ScrollView>
  </LinearGradient>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  exercisesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  notesSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.7,
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { WorkoutExercise } from '../../types/workout';

interface ExerciseItemProps {
  exercise: WorkoutExercise;
  index: number;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, index }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.index, { color: theme.colors.primary }]}>
          {index + 1}
        </Text>
        <View style={styles.exerciseInfo}>
          <Text style={[styles.name, { color: theme.colors.onBackground }]}>
            {exercise.name}
          </Text>
          <Text style={[styles.duration, { color: theme.colors.grey500 }]}>
            {exercise.duration} minutes
          </Text>
        </View>
        <Text style={[styles.calories, { color: theme.colors.primary }]}>
          {exercise.calories} cal
        </Text>
      </View>
      
      {exercise.notes && (
        <View style={styles.notesContainer}>
          <Text style={[styles.notesLabel, { color: theme.colors.grey500 }]}>
            Notes:
          </Text>
          <Text style={[styles.notes, { color: theme.colors.onSurface }]}>
            {exercise.notes}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  index: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  duration: {
    fontSize: 14,
  },
  calories: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    lineHeight: 20,
  },
});
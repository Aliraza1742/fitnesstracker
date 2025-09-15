import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { WorkoutSession } from '../../types/workout';

interface WorkoutCardProps {
  workout: WorkoutSession;
  onPress: () => void;
  onDelete: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onPress, onDelete }) => {
  const { theme } = useTheme();
  const date = new Date(workout.date).toLocaleDateString();
  const time = new Date(workout.date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.date, { color: theme.colors.onSurface }]}>
            {date}
          </Text>
          <Text style={[styles.time, { color: theme.colors.grey500 }]}>
            {time}
          </Text>
        </View>
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {workout.totalDuration}min
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.grey500 }]}>
              Duration
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {workout.totalCalories}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.grey500 }]}>
              Calories
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {workout.exercises.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.grey500 }]}>
              Exercises
            </Text>
          </View>
        </View>
        
        <View style={styles.exercises}>
          {workout.exercises.slice(0, 3).map((exercise, index) => (
            <Text
              key={index}
              style={[styles.exercise, { color: theme.colors.onSurface }]}
              numberOfLines={1}
            >
              • {exercise.name} ({exercise.duration}min)
            </Text>
          ))}
          {workout.exercises.length > 3 && (
            <Text style={[styles.moreExercises, { color: theme.colors.grey500 }]}>
              +{workout.exercises.length - 3} more
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  exercises: {
    marginTop: 8,
  },
  exercise: {
    fontSize: 14,
    marginBottom: 4,
  },
  moreExercises: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
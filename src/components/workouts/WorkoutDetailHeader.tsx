import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { WorkoutSession } from '../../types/workout';
import { CalendarDays, TimerReset, Flame } from 'lucide-react-native';
import { IconBadge } from '../ui/IconBadge';

interface WorkoutDetailHeaderProps {
  workout: WorkoutSession;
}

export const WorkoutDetailHeader: React.FC<WorkoutDetailHeaderProps> = ({ workout }) => {
  const { theme } = useTheme();
  const date = new Date(workout.date).toLocaleDateString();
  const time = new Date(workout.date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.dateContainer}>
        <View style={styles.dateRow}>
          <IconBadge icon={<CalendarDays />} size={36} variant="accent" />
          <View style={styles.dateCopy}>
            <Text style={[styles.date, { color: theme.colors.onBackground }]}>
              {date}
            </Text>
            <Text style={[styles.time, { color: theme.colors.grey500 }]}>
              {time}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <IconBadge icon={<TimerReset />} size={34} variant="default" />
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {workout.totalDuration}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.grey500 }]}>
            Minutes
          </Text>
        </View>
        
        <View style={styles.stat}>
          <IconBadge icon={<Flame />} size={34} variant="warning" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateCopy: {
    flex: 1,
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Dumbbell } from 'lucide-react-native';
import { IconBadge } from '../ui/IconBadge';

interface EmptyWorkoutsStateProps {
  onAddWorkout: () => void;
}

export const EmptyWorkoutsState: React.FC<EmptyWorkoutsStateProps> = ({ onAddWorkout }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <IconBadge icon={<Dumbbell />} size={72} variant="accent" />
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          No Workouts Yet
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
          Start tracking your fitness journey by adding your first workout!
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={onAddWorkout}
        >
          <Text style={[styles.buttonText, { color: theme.colors.white }]}>
            Log Your First Workout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
    lineHeight: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
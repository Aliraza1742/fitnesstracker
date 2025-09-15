import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '../../hooks/useTheme';
import { WorkoutSession } from '../../types/workout';
import { WorkoutCard } from './WorkoutCard';

interface SwipeableWorkoutCardProps {
  workout: WorkoutSession;
  onPress: () => void;
  onDelete: () => void;
}

export const SwipeableWorkoutCard: React.FC<SwipeableWorkoutCardProps> = ({
  workout,
  onPress,
  onDelete,
}) => {
  const { theme } = useTheme();

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={onDelete} style={styles.deleteContainer}>
        <Animated.View
          style={[
            styles.deleteButton,
            { backgroundColor: theme.colors.error },
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
        rightThreshold={40}
      >
        <WorkoutCard workout={workout} onPress={onPress} onDelete={onDelete} />
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  deleteContainer: {
    width: 80,
    height: '100%',
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginLeft: 8,
  },
  deleteText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
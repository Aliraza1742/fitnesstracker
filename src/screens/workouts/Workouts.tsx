import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useWorkout } from '../../hooks/useWorkout';
import { useNavigation } from '@react-navigation/native';
import { MainDrawerNavigationProp } from '../../navigation/types';
import { SwipeableWorkoutCard } from '../../components/workouts/SwipeableWorkoutCard';
import { EmptyWorkoutsState } from '../../components/workouts/EmptyWorkoutsState';
import { WorkoutFormModal } from '../../components/workouts/WorkoutFormModal';
import LinearGradient  from 'react-native-linear-gradient';


export const WorkoutsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { workouts, deleteWorkout, addWorkout, isLoading, loadWorkouts } =
    useWorkout();
  const navigation = useNavigation<MainDrawerNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await deleteWorkout(workoutId);
    } catch (error) {
      console.error('Failed to delete workout:', error);
      Alert.alert('Error', 'Failed to delete workout.');
    }
  };

  // FIX: Properly handle workout form submission
  const handleAddWorkout = async (exercises: any[]) => {
    console.log('WorkoutsScreen: Adding workout with exercises:', exercises);

    try {
      await addWorkout(exercises);
      setShowWorkoutModal(false);

      // Refresh the list after adding
      await loadWorkouts();

      console.log('Workout added successfully from workouts screen');
    } catch (error) {
      console.error('Failed to add workout from workouts screen:', error);
      Alert.alert('Error', 'Failed to add workout. Please try again.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadWorkouts();
    } catch (error) {
      console.error('Error refreshing workouts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToWorkoutDetail = (workoutId: string) => {
    navigation.navigate('WorkoutDetail', { workoutId });
  };

  if (workouts.length === 0) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <EmptyWorkoutsState onAddWorkout={() => setShowWorkoutModal(true)} />
        <WorkoutFormModal
          visible={showWorkoutModal}
          onClose={() => setShowWorkoutModal(false)}
          onSubmit={handleAddWorkout}
          loading={isLoading}
        />
      </View>
    );
  }

  return (
<LinearGradient
      colors={theme.colors.gradients.primary} 
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          My Workouts
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
          {workouts.length} workout{workouts.length !== 1 ? 's' : ''} tracked
        </Text>
      </View>

      <FlatList
        data={workouts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <SwipeableWorkoutCard
            workout={item}
            onPress={() => navigateToWorkoutDetail(item.id)}
            onDelete={() => handleDeleteWorkout(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          console.log('Workouts screen add button pressed');
          setShowWorkoutModal(true);
        }}
      >
        <Text style={[styles.addButtonText, { color: theme.colors.white }]}>
          +
        </Text>
      </TouchableOpacity>

      <WorkoutFormModal
        visible={showWorkoutModal}
        onClose={() => {
          console.log('Workouts modal closed');
          setShowWorkoutModal(false);
        }}
        onSubmit={handleAddWorkout}
        loading={isLoading}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  listContent: {
    padding: 20,
    paddingTop: 60,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

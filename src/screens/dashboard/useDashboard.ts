import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useWorkout } from '../../hooks/useWorkout';

export const useDashboardScreen = () => {
  const { workouts, getStatistics, addWorkout, isLoading, loadWorkouts } = useWorkout();

  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    totalDuration: 0,
    averageCaloriesPerWorkout: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  const loadDashboardData = async () => {
    setLoadingStats(true);
    try {
      const statistics = await getStatistics();
      setStats(statistics);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [workouts]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadWorkouts();
      await loadDashboardData();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddWorkout = async (exercises: any[]) => {
    console.log('Dashboard: Adding workout with exercises:', exercises);

    try {
      await addWorkout(exercises);
      setShowWorkoutModal(false);
      await loadWorkouts();
      await loadDashboardData();
      console.log('Workout added successfully from dashboard');
    } catch (error) {
      console.error('Failed to add workout from dashboard:', error);
      Alert.alert('Error', 'Failed to add workout. Please try again.');
    }
  };

  const weeklyGoalProgress = Math.min(
    Math.round((stats.totalCalories / 3500) * 100),
    100,
  );

  return {
    workouts,
    stats,
    isLoading,
    refreshing,
    showWorkoutModal,
    setShowWorkoutModal,
    loadingStats,
    weeklyGoalProgress,
    onRefresh,
    handleAddWorkout,
  };
};

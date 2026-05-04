import { useEffect, useState } from 'react';

import { useWorkout } from '../../hooks/useWorkout';
import { WorkoutSession } from '../../types/workout';
import { customAlert } from '../../utils/alert';


export const useDashboardScreen = () => {
  const { workouts, getStatistics, addWorkout, isLoading, loadWorkouts } = useWorkout();

  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    totalDuration: 0,
    averageCaloriesPerWorkout: 0,
  });
  const [streak, setStreak] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  const calculateStreak = (workoutsArray: WorkoutSession[]) => {
    if (!workoutsArray || workoutsArray.length === 0) return 0;
    
    // Sort workouts by date descending
    const sortedDates = [...workoutsArray]
      .map(w => new Date(w.date).setHours(0, 0, 0, 0))
      .sort((a, b) => b - a);

    const uniqueDates = [...new Set(sortedDates)];
    let currentStreak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = today - 86400000;

    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        if (uniqueDates[i - 1] - uniqueDates[i] === 86400000) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    return currentStreak;
  };

  const loadDashboardData = async () => {
    setLoadingStats(true);
    try {
      const statistics = await getStatistics();
      setStats(statistics);
      setStreak(calculateStreak(workouts));
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
      customAlert('Error', 'Failed to add workout. Please try again.');
    }
  };

  const weeklyGoalProgress = Math.min(
    Math.round((stats.totalCalories / 3500) * 100),
    100,
  );

  return {
    workouts,
    stats,
    streak,
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

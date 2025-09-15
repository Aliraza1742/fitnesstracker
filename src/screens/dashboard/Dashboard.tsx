import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { ProgressCircle } from '../../components/dashboard/ProgressCircle';
import { WorkoutFormModal } from '../../components/workouts/WorkoutFormModal';
import LinearGradient from 'react-native-linear-gradient';
import { useDashboardScreen } from './useDashboard';
import { styles } from './styles';

export const DashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const {
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
  } = useDashboardScreen();

  if (loadingStats) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.white} />
          <Text style={[styles.loadingText, { color: theme.colors.white }]}>Loading your fitness data...</Text>
        </View>
      </View>
    );
  }

  return (
    <LinearGradient colors={theme.colors.gradients.primary} style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.welcomeText, { color: theme.colors.onBackground }]}>
              Welcome back, {user?.firstName}!
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
              Let's crush your fitness goals today 💪
            </Text>
          </View>

          <View style={styles.goalSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Weekly Progress</Text>
            <ProgressCircle
              progress={weeklyGoalProgress}
              size={140}
              subtitle={`${stats.totalCalories}/3500 calories`}
            />
          </View>

          <View style={styles.statsGrid}>
            <StatsCard title="Total Workouts" value={stats.totalWorkouts} subtitle="This week" />
            <StatsCard title="Calories Burned" value={stats.totalCalories} subtitle="This week" />
            <StatsCard title="Total Duration" value={`${Math.round(stats.totalDuration / 60)}h`} subtitle="This week" />
            <StatsCard title="Avg per Workout" value={stats.averageCaloriesPerWorkout} subtitle="Calories" />
          </View>

          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Recent Activity</Text>
            </View>

            {workouts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
                  No workouts yet. Start your fitness journey!
                </Text>
              </View>
            ) : (
              workouts.slice(0, 3).map(workout => (
                <View key={workout.id} style={styles.recentItem}>
                  <View style={styles.recentItemContent}>
                    <Text style={[styles.recentItemTitle, { color: theme.colors.onBackground }]}>
                      {workout.exercises[0]?.name || 'Workout'}
                    </Text>
                    <Text style={[styles.recentItemSubtitle, { color: theme.colors.onSurface }]}>
                      {new Date(workout.date).toLocaleDateString()} • {workout.totalDuration}min
                    </Text>
                  </View>
                  <Text style={[styles.caloriesText, { color: theme.colors.primaryLight }]}>{workout.totalCalories} cal</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowWorkoutModal(true)}
      >
        <Text style={[styles.addButtonText, { color: theme.colors.white }]}>+</Text>
      </TouchableOpacity>

      <WorkoutFormModal
        visible={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        onSubmit={handleAddWorkout}
        loading={isLoading}
      />
    </LinearGradient>
  );
};

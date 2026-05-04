import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { ProgressCircle } from '../../components/dashboard/ProgressCircle';
import { WorkoutFormModal } from '../../components/workouts/WorkoutFormModal';
import { SectionCard } from '../../components/ui/SectionCard';
import { IconBadge } from '../../components/ui/IconBadge';
import LinearGradient from 'react-native-linear-gradient';
import { useDashboardScreen } from './useDashboard';
import { styles } from './styles';
import { Dumbbell, Flame, Clock3, Target, Sparkles, Plus } from 'lucide-react-native';

export const DashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const {
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
    <LinearGradient colors={theme.colors.gradients.background} style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <SectionCard style={styles.heroCard}>
            <View style={styles.heroRow}>
              <IconBadge icon={<Sparkles />} size={52} variant="accent" />
              <View style={styles.heroCopy}>
                <Text style={[styles.heroLabel, { color: theme.colors.primary }]}>Today&apos;s overview</Text>
                <Text style={[styles.welcomeText, { color: theme.colors.onBackground }]}>
                  Welcome back, {user?.firstName}!
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
                  Build momentum with a clean session and keep the streak moving.
                </Text>
              </View>
            </View>
          </SectionCard>

          <View style={styles.goalSection}>
            <SectionCard>
              <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Weekly Progress</Text>
              <ProgressCircle
                progress={weeklyGoalProgress}
                size={144}
                subtitle={`${stats.totalCalories}/3500 calories`}
              />
            </SectionCard>
          </View>

          <View style={styles.statsGrid}>
            <StatsCard title="Current Streak" value={`${streak} days`} subtitle="Keep going!" icon={<Flame color="#ff7a00" />} />
            <StatsCard title="Total Workouts" value={stats.totalWorkouts} subtitle="This week" icon={<Dumbbell />} />
            <StatsCard title="Calories Burned" value={stats.totalCalories} subtitle="This week" icon={<Flame />} />
            <StatsCard title="Total Duration" value={`${Math.round(stats.totalDuration / 60)}h`} subtitle="This week" icon={<Clock3 />} />
          </View>

          <View style={styles.recentSection}>
            <SectionCard>
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
                        {new Date(workout.date).toLocaleDateString()} - {workout.totalDuration} min
                      </Text>
                    </View>
                    <Text style={[styles.caloriesText, { color: theme.colors.primary }]}>{workout.totalCalories} cal</Text>
                  </View>
                ))
              )}
            </SectionCard>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowWorkoutModal(true)}
      >
        <Plus size={24} color={theme.colors.white} />
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

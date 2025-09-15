import { WorkoutSession } from '../types/workout';
import { notificationService } from './notification';
import { workoutService } from './workout';

export class ProgressService {
  // Get workouts from specific time period
  static async getWorkoutsFromPeriod(days: number = 7): Promise<WorkoutSession[]> {
    try {
      const allWorkouts = await workoutService.getAllWorkouts();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return allWorkouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= cutoffDate;
      });
    } catch (error) {
      console.error('Error getting workouts from period:', error);
      return [];
    }
  }

  // Calculate weekly progress and send notification
  static async sendWeeklyProgressNotification(userId: string) {
    try {
      const weeklyWorkouts = await ProgressService.getWorkoutsFromPeriod(7);
      const userWeeklyWorkouts = weeklyWorkouts.filter(workout => workout.userId === userId);
      
      // Calculate totals
      const totalCalories = userWeeklyWorkouts.reduce((sum, workout) => sum + workout.totalCalories, 0);
      const totalWorkouts = userWeeklyWorkouts.length;
      const totalMinutes = userWeeklyWorkouts.reduce((sum, workout) => sum + workout.totalDuration, 0);
      
      // Format duration
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      
      // Send notification
      await notificationService.scheduleLocalNotification(
        '📊 Weekly Progress Report',
        `You burned ${totalCalories} calories in ${totalWorkouts} workouts this week! Total time: ${durationText}. 🎯`,
        { 
          type: 'weekly_progress',
          totalCalories,
          totalWorkouts,
          totalDuration: totalMinutes
        },
        'progress_updates'
      );
      
      return { success: true, totalCalories, totalWorkouts, totalDuration: totalMinutes };
    } catch (error) {
      console.error('Error sending weekly progress notification:', error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  // Send workout completion notification
  static async sendWorkoutCompletionNotification(workout: WorkoutSession) {
    try {
      // Get weekly totals for context
      const weeklyWorkouts = await ProgressService.getWorkoutsFromPeriod(7);
      const userWeeklyWorkouts = weeklyWorkouts.filter(w => w.userId === workout.userId);
      
      const weeklyCalories = userWeeklyWorkouts.reduce((sum, w) => sum + w.totalCalories, 0);
      const weeklyCount = userWeeklyWorkouts.length;
      
      await notificationService.scheduleLocalNotification(
        '🔥 Workout Completed!',
        `Great job! You burned ${workout.totalCalories} calories. Weekly total: ${weeklyCalories} calories across ${weeklyCount} workouts. 💪`,
        { 
          type: 'workout_completed',
          workoutId: workout.id,
          calories: workout.totalCalories,
          duration: workout.totalDuration
        },
        'progress_updates'
      );
    } catch (error) {
      console.error('Error sending workout completion notification:', error);
    }
  }

  // Send achievement notifications
  static async checkAndSendAchievements(userId: string) {
    try {
      const allWorkouts = await workoutService.getAllWorkouts();
      const userWorkouts = allWorkouts.filter(workout => workout.userId === userId);
      
      const totalCalories = userWorkouts.reduce((sum, workout) => sum + workout.totalCalories, 0);
      const totalWorkouts = userWorkouts.length;
      
      // Check for achievements
      if (totalWorkouts >= 10) {
        await ProgressService.sendAchievementNotification('10 Workouts Completed!', '🏆 You\'ve reached 10 workouts! Keep the momentum going!');
      }
      
      if (totalCalories >= 5000) {
        await ProgressService.sendAchievementNotification('5,000 Calories Burned!', '🔥 Amazing! You\'ve burned 5,000 calories through your workouts!');
      }
      
      if (totalWorkouts >= 5 && userWorkouts.length >= 5) {
        const last5Workouts = userWorkouts.slice(-5);
        const consistent = last5Workouts.every(workout => workout.totalCalories > 100);
        if (consistent) {
          await ProgressService.sendAchievementNotification('Consistent Performer!', '⭐ You\'ve completed 5 consistent workouts in a row!');
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  static async sendAchievementNotification(title: string, message: string) {
    await notificationService.scheduleLocalNotification(
      `🏆 ${title}`,
      message,
      { type: 'achievement' },
      'progress_updates'
    );
  }

  // Setup weekly scheduled progress reports
  static async setupWeeklyProgressReports(userId: string) {
    try {
      // Schedule for every Sunday at 8 PM
      const nextSunday = new Date();
      nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay())); // Next Sunday
      nextSunday.setHours(20, 0, 0, 0); // 8 PM
      
      await notificationService.scheduleWorkoutReminder(
        nextSunday,
        'Weekly Progress Report'
      );
      
      console.log('Weekly progress report scheduled for:', nextSunday);
    } catch (error) {
      console.error('Error setting up weekly progress reports:', error);
    }
  }
}
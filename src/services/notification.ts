import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TriggerType,
  TimestampTrigger,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import { settingsService } from '../utils/settings';
import { customAlert } from '../utils/alert';


class NotificationService {
  private hasPermission: boolean = false;

  // Request notification permissions using Notifee
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        // For iOS, use Notifee's permission request
        const settings = await notifee.requestPermission();
        this.hasPermission = settings.authorizationStatus >= 1; // 1 = granted, 2 = provisional
      } else {
        // For Android, permissions are typically granted by default
        this.hasPermission = true;
      }

      if (this.hasPermission) {
        console.log('Notification permissions granted.');
      } else {
        console.log('Notification permissions denied.');
      }

      return this.hasPermission;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Add this method to your NotificationService class
async sendProgressUpdate(caloriesBurned: number, workoutsCompleted: number, durationMinutes: number) {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  
  await this.scheduleLocalNotification(
    'Progress update',
    `You burned ${caloriesBurned} calories in ${workoutsCompleted} workouts. Total time: ${durationText}. Keep it up.`,
    { 
      type: 'progress_update',
      calories: caloriesBurned,
      workouts: workoutsCompleted,
      duration: durationMinutes
    },
    'progress_updates'
  );
}

  // Check notification permissions using Notifee
  async checkPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const settings = await notifee.getNotificationSettings();
        this.hasPermission = settings.authorizationStatus >= 1;
      } else {
        // Android doesn't require the same permission flow
        this.hasPermission = true;
      }
      return this.hasPermission;
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }

  // Schedule local notification
  async scheduleLocalNotification(
    title: string,
    body: string,
    data: any = {},
    channelId: string = 'default',
  ) {
    try {
      // Check notification settings
      const settings = await settingsService.getNotificationSettings();

      // Only send if notifications are enabled
      if (!settings.workoutReminders && channelId === 'workout_reminders')
        return;
      if (!settings.progressUpdates && channelId === 'progress_updates') return;
      if (
        !settings.motivationalMessages &&
        channelId === 'motivational_messages'
      )
        return;

      // Create a channel (required for Android)
      await notifee.createChannel({
        id: channelId,
        name:
          channelId === 'workout_reminders'
            ? 'Workout Reminders'
            : channelId === 'progress_updates'
            ? 'Progress Updates'
            : 'Motivational Messages',
        importance: AndroidImportance.HIGH,
      });

      // Display notification
      await notifee.displayNotification({
        title,
        body,
        data,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Schedule workout reminder
  async scheduleWorkoutReminder(workoutTime: Date, workoutName: string) {
    try {
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: workoutTime.getTime(),
      };

      // Create channel for Android
      await notifee.createChannel({
        id: 'workout_reminders',
        name: 'Workout Reminders',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createTriggerNotification(
        {
          title: 'Workout reminder',
          body: `Time for your ${workoutName} workout!`,
          data: { type: 'workout_reminder', workoutName },
          android: {
            channelId: 'workout_reminders',
            importance: AndroidImportance.HIGH,
          },
          ios: {
            sound: 'default',
          },
        },
        trigger,
      );
    } catch (error) {
      console.error('Error scheduling workout reminder:', error);
    }
  }

  // Schedule daily motivational message
  async scheduleDailyMotivation() {
    try {
      const messages = [
        "Your body can stand almost anything. It's your mind that you have to convince.",
        "The only bad workout is the one that didn't happen.",
        "Don't stop when you're tired. Stop when you're done.",
        "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
        'Every day is a new opportunity to become a better version of yourself.',
      ];

      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];

      // Schedule for the next day at 8 AM
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(8, 0, 0, 0);

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: nextDay.getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
      };
      // Create channel for Android
      await notifee.createChannel({
        id: 'motivational_messages',
        name: 'Motivational Messages',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createTriggerNotification(
        {
          title: 'Daily motivation',
          body: randomMessage,
          data: { type: 'daily_motivation' },
          android: {
            channelId: 'motivational_messages',
            importance: AndroidImportance.HIGH,
          },
          ios: {
            sound: 'default',
          },
        },
        trigger,
      );
    } catch (error) {
      console.error('Error scheduling motivational message:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await notifee.cancelAllNotifications();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  // Test methods for notification functionality
  async testWorkoutReminder(): Promise<void> {
    try {
      const testTime = new Date();
      testTime.setSeconds(testTime.getSeconds() + 5); // Schedule 5 seconds from now
      await this.scheduleWorkoutReminder(testTime, 'Test Workout');
      customAlert('Success', 'Test workout reminder scheduled for 5 seconds from now');
    } catch (error) {
      console.error('Error sending test workout reminder:', error);
      customAlert('Error', 'Failed to send test workout reminder');
    }
  }

  async testProgressUpdate(): Promise<void> {
    try {
      await this.scheduleLocalNotification(
        'Test Progress Update',
        'You burned 500 calories in 3 workouts this week. Keep it up!',
        { type: 'progress_update' },
        'progress_updates'
      );
      customAlert('Success', 'Test progress update notification sent');
    } catch (error) {
      console.error('Error sending test progress update:', error);
      customAlert('Error', 'Failed to send test progress update');
    }
  }

  async testMotivationalMessage(): Promise<void> {
    try {
      await this.scheduleLocalNotification(
        'Daily Motivation',
        'You\'re doing amazing! Keep pushing towards your fitness goals! 💪',
        { type: 'motivational_message' },
        'motivational_messages'
      );
      customAlert('Success', 'Test motivational message sent');
    } catch (error) {
      console.error('Error sending test motivational message:', error);
      customAlert('Error', 'Failed to send test motivational message');
    }
  }

  // Setup notification handlers
  setupNotificationHandlers() {
    console.log('Setting up Notifee foreground event handlers...');
    return notifee.onForegroundEvent(({ type, detail }) => {
      // type: EventType
      switch (type) {
        case 1: // DISMISSED
          console.log('User dismissed notification', detail.notification);
          break;
        case 2: // PRESS
          console.log('User pressed notification', detail.notification);
          // Here we could navigate to a specific screen based on detail.notification.data
          break;
      }
    });
  }
}

// Background handler function to be registered in index.js
export const notifeeBackgroundHandler = async ({ type, detail }: any) => {
  console.log('Notifee background event received', type, detail.notification);
  // Perform background tasks if needed
};

export const notificationService = new NotificationService();

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { notificationService } from '../services/notification';
import { useSettings } from './Settings';

interface NotificationContextValue {
  hasPermission: boolean;
  requestPermissions: () => Promise<boolean>;
  scheduleWorkoutReminder: (workoutTime: Date, workoutName: string) => Promise<void>;
  sendProgressUpdate: (caloriesBurned: number, workoutsCompleted: number) => Promise<void>;
  sendMotivationalMessage: () => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  testWorkoutReminder: () => Promise<void>;
  testProgressUpdate: () => Promise<void>;
  testMotivationalMessage: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const { notificationSettings } = useSettings();

  useEffect(() => {
    initializeNotifications();
  }, []);

  useEffect(() => {
    // Re-check permissions when settings change
    if (Object.values(notificationSettings).some(setting => setting)) {
      checkPermissions();
    }
  }, [notificationSettings]);

  const initializeNotifications = async () => {
    await checkPermissions();
    // No need for setupNotificationHandlers() since we're not using Firebase
  };

  const checkPermissions = async () => {
    const permissions = await notificationService.checkPermissions();
    setHasPermission(permissions);
    return permissions;
  };

  const requestPermissions = async () => {
    const granted = await notificationService.requestPermissions();
    setHasPermission(granted);
    return granted;
  };

  const scheduleWorkoutReminder = async (workoutTime: Date, workoutName: string) => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return;
    }
    await notificationService.scheduleWorkoutReminder(workoutTime, workoutName);
  };

  const sendProgressUpdate = async (caloriesBurned: number, workoutsCompleted: number) => {
    if (!hasPermission || !notificationSettings.progressUpdates) return;
    
    await notificationService.scheduleLocalNotification(
      'Weekly progress',
      `You burned ${caloriesBurned} calories in ${workoutsCompleted} workouts this week. Keep it up.`,
      { type: 'progress_update' },
      'progress_updates'
    );
  };

  const sendMotivationalMessage = async () => {
    if (!hasPermission || !notificationSettings.motivationalMessages) return;
    await notificationService.scheduleDailyMotivation();
  };

  const cancelAllNotifications = async () => {
    await notificationService.cancelAllNotifications();
  };

  const testWorkoutReminder = async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) throw new Error('Notification permission denied');
    }
    await notificationService.testWorkoutReminder();
  };

  const testProgressUpdate = async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) throw new Error('Notification permission denied');
    }
    await notificationService.testProgressUpdate();
  };

  const testMotivationalMessage = async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) throw new Error('Notification permission denied');
    }
    await notificationService.testMotivationalMessage();
  };

  const value: NotificationContextValue = {
    hasPermission,
    requestPermissions,
    scheduleWorkoutReminder,
    sendProgressUpdate,
    sendMotivationalMessage,
    cancelAllNotifications,
    testWorkoutReminder,
    testProgressUpdate,
    testMotivationalMessage,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
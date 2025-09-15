import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEYS = {
  THEME: '@FitTrack:theme',
  NOTIFICATIONS: '@FitTrack:notifications',
  HEALTH_DATA: '@FitTrack:healthData',
};

export type ThemePreference = 'light' | 'dark' | 'auto';
export type NotificationSettings = {
  workoutReminders: boolean;
  progressUpdates: boolean;
  motivationalMessages: boolean;
};

export const settingsService = {
  // Theme Settings
  getThemePreference: async (): Promise<ThemePreference> => {
    try {
      const theme = await AsyncStorage.getItem(SETTINGS_KEYS.THEME);
      return (theme as ThemePreference) || 'auto';
    } catch (error) {
      console.error('Error getting theme preference:', error);
      return 'auto';
    }
  },

  setThemePreference: async (theme: ThemePreference): Promise<void> => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error setting theme preference:', error);
      throw new Error('Failed to save theme preference');
    }
  },

  // Notification Settings
  getNotificationSettings: async (): Promise<NotificationSettings> => {
    try {
      const settings = await AsyncStorage.getItem(SETTINGS_KEYS.NOTIFICATIONS);
      return settings
        ? JSON.parse(settings)
        : {
            workoutReminders: true,
            progressUpdates: true,
            motivationalMessages: true,
          };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return {
        workoutReminders: true,
        progressUpdates: true,
        motivationalMessages: true,
      };
    }
  },

  setNotificationSettings: async (settings: NotificationSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.NOTIFICATIONS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error setting notification settings:', error);
      throw new Error('Failed to save notification settings');
    }
  },

  // Health Data Sharing
  getHealthDataSharing: async (): Promise<boolean> => {
    try {
      const sharing = await AsyncStorage.getItem(SETTINGS_KEYS.HEALTH_DATA);
      return sharing ? JSON.parse(sharing) : false;
    } catch (error) {
      console.error('Error getting health data sharing:', error);
      return false;
    }
  },

  setHealthDataSharing: async (enabled: boolean): Promise<void> => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.HEALTH_DATA, JSON.stringify(enabled));
    } catch (error) {
      console.error('Error setting health data sharing:', error);
      throw new Error('Failed to save health data sharing setting');
    }
  },

  // Clear all settings
  clearAllSettings: async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(SETTINGS_KEYS.THEME),
        AsyncStorage.removeItem(SETTINGS_KEYS.NOTIFICATIONS),
        AsyncStorage.removeItem(SETTINGS_KEYS.HEALTH_DATA),
      ]);
    } catch (error) {
      console.error('Error clearing settings:', error);
      throw new Error('Failed to clear settings');
    }
  },
};
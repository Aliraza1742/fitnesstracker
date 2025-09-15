import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { settingsService, ThemePreference, NotificationSettings } from '../utils/settings';
import { useTheme } from './Theme';

interface SettingsContextValue {
  themePreference: ThemePreference;
  notificationSettings: NotificationSettings;
  healthDataSharing: boolean;
  setThemePreference: (theme: ThemePreference) => Promise<void>;
  setNotificationSettings: (settings: NotificationSettings) => Promise<void>;
  setHealthDataSharing: (enabled: boolean) => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('auto');
  const [notificationSettings, setNotificationSettingsState] = useState<NotificationSettings>({
    workoutReminders: true,
    progressUpdates: true,
    motivationalMessages: true,
  });
  const [healthDataSharing, setHealthDataSharingState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const themeContext = useTheme();

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Apply theme preference
    if (themePreference === 'auto') {
      // Let the system decide (already handled by ThemeContext)
      return;
    }
    // If the current theme does not match the preference, toggle it
    if (
      (themePreference === 'dark' && !themeContext.isDark) ||
      (themePreference === 'light' && themeContext.isDark)
    ) {
      themeContext.toggleTheme();
    }
  }, [themePreference, themeContext]);

  const loadSettings = async () => {
    try {
      const [theme, notifications, healthData] = await Promise.all([
        settingsService.getThemePreference(),
        settingsService.getNotificationSettings(),
        settingsService.getHealthDataSharing(),
      ]);

      setThemePreferenceState(theme);
      setNotificationSettingsState(notifications);
      setHealthDataSharingState(healthData);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemePreference = async (theme: ThemePreference) => {
    try {
      await settingsService.setThemePreference(theme);
      setThemePreferenceState(theme);
    } catch (error) {
      console.error('Error setting theme preference:', error);
      throw error;
    }
  };

  const setNotificationSettings = async (settings: NotificationSettings) => {
    try {
      await settingsService.setNotificationSettings(settings);
      setNotificationSettingsState(settings);
    } catch (error) {
      console.error('Error setting notification settings:', error);
      throw error;
    }
  };

  const setHealthDataSharing = async (enabled: boolean) => {
    try {
      await settingsService.setHealthDataSharing(enabled);
      setHealthDataSharingState(enabled);
    } catch (error) {
      console.error('Error setting health data sharing:', error);
      throw error;
    }
  };

  const value: SettingsContextValue = {
    themePreference,
    notificationSettings,
    healthDataSharing,
    setThemePreference,
    setNotificationSettings,
    setHealthDataSharing,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
// src/screens/Settings/useSettingsScreen.ts
import { useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../hooks/useAuth';

export const useSettingsScreen = () => {
  const { logout } = useAuth();
  const {
    themePreference,
    notificationSettings,
    healthDataSharing,
    setThemePreference,
    setNotificationSettings,
    setHealthDataSharing,
    isLoading,
  } = useSettings();

  const [appVersion] = useState('1.0.0');
  const [buildNumber] = useState('100');

  const handleNotificationSettingChange = (key: keyof typeof notificationSettings, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
  };

  const handleHealthDataSharingChange = async (value: boolean) => {
    if (value) {
      Alert.alert(
        'Health Data Access',
        'FitTrack would like to access your health data to provide better fitness insights. This data will only be used to improve your experience and will not be shared with third parties.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Allow', onPress: () => setHealthDataSharing(true) },
        ]
      );
    } else {
      setHealthDataSharing(false);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all your workouts and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            // Implement data clearing logic here
            Alert.alert('Success', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@fittrack.com?subject=Support Request');
  };

  const handleRateApp = () => {
    const storeUrl =
      Platform.OS === 'ios'
        ? 'itms-apps://itunes.apple.com/app/idYOUR_APP_ID'
        : 'market://details?id=com.fittrack.app';

    Linking.openURL(storeUrl).catch(() => {
      Alert.alert('Error', 'Could not open app store.');
    });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return {
    themePreference,
    notificationSettings,
    healthDataSharing,
    setThemePreference,
    isLoading,
    appVersion,
    buildNumber,
    handleNotificationSettingChange,
    handleHealthDataSharingChange,
    handleClearData,
    handleContactSupport,
    handleRateApp,
    handleLogout,
  };
};

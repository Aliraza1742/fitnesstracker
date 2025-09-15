// src/screens/Settings/SettingsScreen.tsx
import React from 'react';
import { View, Text, ScrollView, Linking, Alert, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SettingItem } from '../../components/settings/SettingItem';
import { ThemeSelector } from '../../components/settings/ThemeSelector';
import { SectionHeader } from '../../components/settings/SectionHeader';
import { AuthButton } from '../../components/common/AuthButton';
import { styles } from './styles';
import { useSettingsScreen } from './useSettings';
import LinearGradient from 'react-native-linear-gradient';
import { useNotifications } from '../../context/Notification';

export const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const {
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
  } = useSettingsScreen();

  const { 
    hasPermission, 
    requestPermissions
  } = useNotifications();

  const handleNotificationPermission = async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive workout reminders and progress updates.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            }},
          ]
        );
      }
    }
  };

  const handleNotificationSettingWithPermission = async (key: keyof typeof notificationSettings, value: boolean) => {
    // If trying to enable notifications but permissions not granted
    if (value === true && !hasPermission) {
      const granted = await requestPermissions();
      if (!granted) {
        // Don't enable the setting if permission was denied
        return;
      }
    }
    
    // Update the setting
    handleNotificationSettingChange(key, value);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onBackground }}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={theme.colors.gradients.primary} style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Appearance" />
        <ThemeSelector currentTheme={themePreference} onThemeChange={setThemePreference} />

        <SectionHeader title="Notifications" />
        
        {/* Notification Permission Status */}
        <View style={[
          styles.permissionBanner,
          { backgroundColor: hasPermission ? theme.colors.success + '20' : theme.colors.error + '20' }
        ]}>
          <Text style={[
            styles.permissionText,
            { color: hasPermission ? theme.colors.success : theme.colors.error }
          ]}>
            {hasPermission ? '✓ Notifications Enabled' : '⚠ Notifications Disabled'}
          </Text>
          {!hasPermission && (
            <AuthButton
              title="Enable"
              onPress={handleNotificationPermission}
              backgroundColor="transparent"
              textColor={theme.colors.primary}
              borderColor={theme.colors.primary}
              
            />
          )}
        </View>

        <View style={styles.section}>
          <SettingItem
            icon="🔔"
            title="Workout Reminders"
            description="Get reminders for your scheduled workouts"
            type="switch"
            value={notificationSettings.workoutReminders && hasPermission}
            onValueChange={(value) => handleNotificationSettingWithPermission('workoutReminders', value)}
            disabled={!hasPermission}
          />
          <SettingItem
            icon="📊"
            title="Progress Updates"
            description="Weekly progress reports and achievements"
            type="switch"
            value={notificationSettings.progressUpdates && hasPermission}
            onValueChange={(value) => handleNotificationSettingWithPermission('progressUpdates', value)}
            disabled={!hasPermission}
          />
          <SettingItem
            icon="💪"
            title="Motivational Messages"
            description="Daily motivational quotes and tips"
            type="switch"
            value={notificationSettings.motivationalMessages && hasPermission}
            onValueChange={(value) => handleNotificationSettingWithPermission('motivationalMessages', value)}
            disabled={!hasPermission}
          />
        </View>

        <SectionHeader title="Privacy & Data" />
        <View style={styles.section}>
          <SettingItem
            icon="🏥"
            title="Health Data Access"
            description="Connect with Apple Health/Google Fit"
            type="switch"
            value={healthDataSharing}
            onValueChange={handleHealthDataSharingChange}
          />
          <SettingItem
            icon="🗑️"
            title="Clear All Data"
            description="Remove all your workouts and settings"
            type="button"
            onPress={handleClearData}
          />
        </View>

        <SectionHeader title="Support" />
        <View style={styles.section}>
          <SettingItem icon="📧" title="Contact Support" description="Get help with the app" type="button" onPress={handleContactSupport} />
          <SettingItem icon="⭐" title="Rate the App" description="Share your experience" type="button" onPress={handleRateApp} />
          <SettingItem icon="📝" title="Terms of Service" description="View our terms and conditions" type="button" onPress={() => Linking.openURL('https://fittrack.com/terms')} />
          <SettingItem icon="🔒" title="Privacy Policy" description="How we handle your data" type="button" onPress={() => Linking.openURL('https://fittrack.com/privacy')} />
        </View>

        <SectionHeader title="About" />
        <View style={styles.section}>
          <SettingItem icon="📱" title="Version" description={`${appVersion} (${buildNumber})`} type="info" />
          <SettingItem icon="❤️" title="Made with" description="React Native & TypeScript" type="info" />
        </View>

        <AuthButton
          title="Logout"
          onPress={handleLogout}
          backgroundColor={theme.colors.error}
          textColor={theme.colors.white}
          borderColor={theme.colors.white}
        />

        <Text style={[styles.footerText, { color: theme.colors.grey500 }]}>
          © 2024 FitTrack. All rights reserved.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};
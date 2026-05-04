// src/screens/settings/SettingsScreen.tsx
import React from 'react';
import { View, Text, ScrollView, Linking, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SettingItem } from '../../components/settings/SettingItem';
import { ThemeSelector } from '../../components/settings/ThemeSelector';
import { SectionHeader } from '../../components/settings/SectionHeader';
import { AuthButton } from '../../components/common/AuthButton';
import { SectionCard } from '../../components/ui/SectionCard';
import { styles } from './styles';
import { useSettingsScreen } from './useSettings';
import LinearGradient from 'react-native-linear-gradient';
import { useNotifications } from '../../context/Notification';
import { Bell, ChartColumnIncreasing, MessagesSquare, HeartPulse, Trash2, Mail, Star, FileText, ShieldCheck, Smartphone, Heart } from 'lucide-react-native';
import { customAlert } from '../../utils/alert';


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
        customAlert(
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
    <LinearGradient colors={theme.colors.gradients.background} style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Appearance" />
        <SectionCard style={styles.section}>
          <ThemeSelector currentTheme={themePreference} onThemeChange={setThemePreference} />
        </SectionCard>

        <SectionHeader title="Notifications" />
        <SectionCard style={styles.section}>
          <View
            style={[
              styles.permissionBanner,
              { backgroundColor: hasPermission ? theme.colors.success + '12' : theme.colors.error + '12' },
            ]}
          >
            <View>
              <Text
                style={[
                  styles.permissionText,
                  { color: hasPermission ? theme.colors.success : theme.colors.error },
                ]}
              >
                {hasPermission ? 'Notifications enabled' : 'Notifications disabled'}
              </Text>
              <Text style={[styles.permissionDescription]}>
                Keep reminders and progress updates active so the app can stay useful throughout the week.
              </Text>
            </View>
            {!hasPermission && (
              <AuthButton
                title="Enable"
                onPress={handleNotificationPermission}
                backgroundColor={theme.colors.primary}
                textColor={theme.colors.white}
                borderColor={theme.colors.primary}
              />
            )}
          </View>

          <SettingItem
            icon={<Bell />}
            title="Workout Reminders"
            description="Get reminders for your scheduled workouts"
            type="switch"
            value={notificationSettings.workoutReminders && hasPermission}
            onValueChange={(value) => handleNotificationSettingWithPermission('workoutReminders', value)}
            disabled={!hasPermission}
          />
          <SettingItem
            icon={<ChartColumnIncreasing />}
            title="Progress Updates"
            description="Weekly progress reports and achievements"
            type="switch"
            value={notificationSettings.progressUpdates && hasPermission}
            onValueChange={(value) => handleNotificationSettingWithPermission('progressUpdates', value)}
            disabled={!hasPermission}
          />
          <SettingItem
            icon={<MessagesSquare />}
            title="Motivational Messages"
            description="Daily motivational quotes and tips"
            type="switch"
            value={notificationSettings.motivationalMessages && hasPermission}
            onValueChange={(value) => handleNotificationSettingWithPermission('motivationalMessages', value)}
            disabled={!hasPermission}
          />
        </SectionCard>

        <SectionHeader title="Privacy & Data" />
        <SectionCard style={styles.section}>
          <SettingItem
            icon={<HeartPulse />}
            title="Health Data Access"
            description="Connect with Apple Health/Google Fit"
            type="switch"
            value={healthDataSharing}
            onValueChange={handleHealthDataSharingChange}
          />
          <SettingItem
            icon={<Trash2 />}
            title="Clear All Data"
            description="Remove all your workouts and settings"
            type="button"
            onPress={handleClearData}
          />
        </SectionCard>

        <SectionHeader title="Support" />
        <SectionCard style={styles.section}>
          <SettingItem icon={<Mail />} title="Contact Support" description="Get help with the app" type="button" onPress={handleContactSupport} />
          <SettingItem icon={<Star />} title="Rate the App" description="Share your experience" type="button" onPress={handleRateApp} />
          <SettingItem icon={<FileText />} title="Terms of Service" description="View our terms and conditions" type="button" onPress={() => Linking.openURL('https://fittrack.com/terms')} />
          <SettingItem icon={<ShieldCheck />} title="Privacy Policy" description="How we handle your data" type="button" onPress={() => Linking.openURL('https://fittrack.com/privacy')} />
        </SectionCard>

        <SectionHeader title="About" />
        <SectionCard style={styles.section}>
          <SettingItem icon={<Smartphone />} title="Version" description={`${appVersion} (${buildNumber})`} type="info" />
          <SettingItem icon={<Heart />} title="Made with" description="React Native & TypeScript" type="info" />
        </SectionCard>

        <AuthButton
          title="Logout"
          onPress={handleLogout}
          backgroundColor={theme.colors.error}
          textColor={theme.colors.white}
          borderColor={theme.colors.white}
        />

        <Text style={[styles.footerText, { color: theme.colors.grey500 }]}>
          FitTrack - Training built for consistency.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};
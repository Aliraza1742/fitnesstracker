import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from './src/context/Theme';
import { AuthProvider } from './src/context/Auth';
import { WorkoutProvider } from './src/context/Workout';
import { SettingsProvider } from './src/context/Settings';
import { NotificationProvider } from './src/context/Notification';
import { AppNavigator } from './src/navigation/App';
import { useTheme } from './src/hooks/useTheme';

const AppStatusBar = () => {
  const { isDark } = useTheme();
  return (
    <StatusBar
      barStyle={isDark ? 'light-content' : 'dark-content'}
      backgroundColor="transparent"
      translucent
    />
  );
};

const MainApp = () => {
  return (
    <>
      <AppStatusBar />
      <AppNavigator />
    </>
  );
};

const App = () => {
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const { notificationService } = await import(
          './src/services/notification'
        );
        await notificationService.checkPermissions();

        console.log('Notification service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize notification service:', error);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <WorkoutProvider>
          <SettingsProvider>
            <NotificationProvider>
              <MainApp />
            </NotificationProvider>
          </SettingsProvider>
        </WorkoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

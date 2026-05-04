import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from './src/context/Theme';
import { SettingsProvider } from './src/context/Settings';
import { NotificationProvider } from './src/context/Notification';
import { AppNavigator } from './src/navigation/App';
import { useTheme } from './src/hooks/useTheme';
import { useAuthStore } from './src/store/useAuthStore';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { GlobalAlert } from './src/components/ui/GlobalAlert';

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
    <ErrorBoundary>
      <AppStatusBar />
      <AppNavigator />
      <GlobalAlert />
    </ErrorBoundary>
  );
};

const App = () => {
  const checkExistingAuth = useAuthStore((state) => state.checkExistingAuth);

  useEffect(() => {
    let unsubscribeForeground: () => void;

    const initializeNotifications = async () => {
      try {
        const { notificationService } = await import(
          './src/services/notification'
        );
        await notificationService.checkPermissions();

        unsubscribeForeground = notificationService.setupNotificationHandlers();

        console.log('Notification service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize notification service:', error);
      }
    };

    initializeNotifications();
    checkExistingAuth();

    return () => {
      if (unsubscribeForeground) unsubscribeForeground();
    };
  }, [checkExistingAuth]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SettingsProvider>
          <NotificationProvider>
            <MainApp />
          </NotificationProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

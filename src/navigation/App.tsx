import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './Auth';
import { MainNavigator } from './Main';
import { RootStackParamList } from './types';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';


const Stack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme?.colors?.background || '#fff'
    }}>
      <ActivityIndicator size="large" color={theme?.colors?.primary || '#000'} />
    </View>
  );
};

// Update AppNavigator.tsx
export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme(); // Get current theme

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: theme.colors.background === DarkTheme.colors.background,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.onBackground,
          border: theme.colors.grey300,
          notification: theme.colors.primary,
        },
        fonts: DefaultTheme.fonts, // Add fonts property from DefaultTheme
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background }, // Add this
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
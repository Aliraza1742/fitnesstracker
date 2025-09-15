import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { DashboardScreen } from '../screens/dashboard/Dashboard';
import { WorkoutsScreen } from '../screens/workouts/Workouts';
import { WorkoutDetailScreen } from '../screens/workouts/WorkoutDetail';
import { ProfileScreen } from '../screens/profile/Profile';
import { SettingsScreen } from '../screens/settings/Settings';
import { MainDrawerParamList } from './types';

const Drawer = createDrawerNavigator<MainDrawerParamList>();
const Stack = createNativeStackNavigator();

// Workouts Stack
const WorkoutsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WorkoutsList" component={WorkoutsScreen} />
    <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
  </Stack.Navigator>
);

export const MainNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: true,
        drawerType: 'front',
        headerStyle: {
          backgroundColor: theme.colors.primaryLight,
          borderBottomWidth: 0.8,
          borderBottomColor: theme.colors.outline,
        },
        headerTintColor: theme.colors.onBackground,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: theme.colors.primaryLight,
          width: 250,
          borderTopRightRadius: 30,
          borderColor: theme.colors.outline,
          borderWidth: 2.3,
          borderBottomRightRadius: 30,
          paddingVertical: 30,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '500',
          color: theme.colors.black,
          marginLeft: 5,
        },
        drawerActiveBackgroundColor: theme.colors.primary + '20',
        drawerActiveTintColor: theme.colors.white,
        drawerInactiveTintColor: theme.colors.onSurface,
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
          title: 'Dashboard',
        }}
      />
      <Drawer.Screen
        name="Workouts"
        component={WorkoutsStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" size={size} color={color} />
          ),
          title: 'Workouts',
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          title: 'Profile',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
          title: 'Settings',
        }}
      />
    </Drawer.Navigator>
  );
};

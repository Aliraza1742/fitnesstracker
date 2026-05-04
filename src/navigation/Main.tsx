import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import IconFallback from '../components/common/IconFallback';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Apple, 
  User, 
  Settings,
  LogOut
} from 'lucide-react-native';


import { DashboardScreen } from '../screens/dashboard/Dashboard';
import { WorkoutsScreen } from '../screens/workouts/Workouts';
import { WorkoutDetailScreen } from '../screens/workouts/WorkoutDetail';
import { ProfileScreen } from '../screens/profile/Profile';
import { SettingsScreen } from '../screens/settings/Settings';
import { NutritionScreen } from '../screens/nutrition/NutritionScreen';
import { MainDrawerParamList } from './types';
import { CustomDrawerContent } from './DrawerContent';

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
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerType: 'front',
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outline,
          shadowColor: theme.colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        },
        headerTintColor: theme.colors.onBackground,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: theme.colors.onBackground,
        },
        drawerStyle: {
          backgroundColor: theme.colors.surface,
          width: 280,
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          paddingVertical: 20,
          shadowColor: theme.colors.black,
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.colors.onBackground,
          marginLeft: 12,
        },
        drawerActiveBackgroundColor: theme.colors.primary + '20',
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.grey500,
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} />
          ),
          title: 'Dashboard',
        }}
      />
      <Drawer.Screen
        name="Workouts"
        component={WorkoutsStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Dumbbell size={size} color={color} />
          ),
          title: 'Workouts',
        }}
      />
      
      <Drawer.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Apple size={size} color={color} />
          ),
          title: 'Nutrition',
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
          title: 'Profile',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
          title: 'Settings',
        }}
      />
    </Drawer.Navigator>
  );
};

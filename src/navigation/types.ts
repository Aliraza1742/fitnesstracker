// Define the parameter list for each navigator
// This ensures type-safe use of `navigation.navigate('Screen', params)`

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainDrawerParamList = {
  Dashboard: undefined;
  Workouts: undefined;
  WorkoutDetail: { workoutId: string }; // Add this
  Profile: undefined;
  Notifications: undefined;
  Settings: undefined;
};

// Use this type to annotate useNavigation in screens that are part of the main drawer
// Example: useNavigation<MainDrawerNavigationProp>()
export type MainDrawerNavigationProp = import('@react-navigation/drawer').DrawerNavigationProp<MainDrawerParamList>;

// Combine all param lists for the root navigator
export type RootStackParamList = {
  Auth: undefined; // This will point to the Auth Stack Navigator
  Main: undefined; // This will point to the Main Drawer Navigator
};

// Use this type for the root navigator's useNavigation
export type RootStackNavigationProp = import('@react-navigation/native-stack').NativeStackNavigationProp<RootStackParamList>;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

const STORAGE_KEYS = {
  USER: '@FitTrack:user',
  TOKEN: '@FitTrack:token',
  REGISTERED_USERS: '@FitTrack:registeredUsers', // New key to store registered users
};

export const authService = {
  // Store authentication data (after login)
  storeAuthData: async (user: User, token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  },

  // Retrieve authentication data
  getAuthData: async (): Promise<{ user: User | null; token: string | null }> => {
    try {
      const [userData, token] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
      ]);

      return {
        user: userData ? JSON.parse(userData) : null,
        token,
      };
    } catch (error) {
      console.error('Error retrieving auth data:', error);
      return { user: null, token: null };
    }
  },

  // Clear authentication data (logout)
  clearAuthData: async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw new Error('Failed to clear authentication data');
    }
  },

  // Register user and store credentials
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const existingUsersData = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      const existingUsers = existingUsersData ? JSON.parse(existingUsersData) : [];

      // Check if email already exists
      const emailExists = existingUsers.some((user: any) => user.email === credentials.email);
      if (emailExists) {
        throw new Error('Email already registered. Please login instead.');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email,
        password: credentials.password, // Store password for future login validation
        weight: credentials.weight,
        height: credentials.height,
        age: credentials.age,
        fitnessGoal: credentials.fitnessGoal,
      };

      const updatedUsers = [...existingUsers, newUser];

      // Save updated users list in AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(updatedUsers));

      // Auto-login the new user
      const token = 'mock-jwt-token-' + Date.now();
      await authService.storeAuthData(newUser, token);

      return { user: newUser, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login function with credential validation
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const existingUsersData = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      const existingUsers = existingUsersData ? JSON.parse(existingUsersData) : [];

      // Find user by email
      const matchedUser = existingUsers.find((user: any) => user.email === credentials.email);

      if (!matchedUser) {
        throw new Error('No account found with this email. Please register first.');
      }

      // Check password
      if (matchedUser.password !== credentials.password) {
        throw new Error('Incorrect password. Please try again.');
      }

      // Generate token and store auth data
      const token = 'mock-jwt-token-' + Date.now();
      await authService.storeAuthData(matchedUser, token);

      return { user: matchedUser, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  checkAuthentication: async (): Promise<boolean> => {
    try {
      const { token, user } = await authService.getAuthData();
      return !!token && !!user;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  // Update user profile
  updateUserProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const { user } = await authService.getAuthData();
      if (!user) {
        throw new Error('No user found');
      }

      const updatedUser = { ...user, ...userData };

      // Update stored user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      // Update registered users list as well
      const existingUsersData = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      const existingUsers = existingUsersData ? JSON.parse(existingUsersData) : [];
      const updatedUsers = existingUsers.map((u: any) =>
        u.email === updatedUser.email ? updatedUser : u
      );
      await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(updatedUsers));

      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('Failed to update profile');
    }
  },
};

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import apiClient from '../api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  checkExistingAuth: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkExistingAuth: async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@FitTrack:user');
      const token = await AsyncStorage.getItem('@FitTrack:token');
      
      if (storedUser && token) {
        // Try fetching latest user from backend to verify token
        try {
          const response = await apiClient.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
          set({ user: response.data, token, isAuthenticated: true, isLoading: false, error: null });
        } catch (e) {
          // Token expired or invalid
          await AsyncStorage.removeItem('@FitTrack:token');
          await AsyncStorage.removeItem('@FitTrack:user');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false, error: 'Failed to check authentication' });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      await AsyncStorage.setItem('@FitTrack:user', JSON.stringify(user));
      await AsyncStorage.setItem('@FitTrack:token', token);
      
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      // Strip confirmPassword before sending to backend
      const { confirmPassword, ...payload } = credentials as any;
      const response = await apiClient.post('/auth/register', payload);
      const { user, token } = response.data;
      
      await AsyncStorage.setItem('@FitTrack:user', JSON.stringify(user));
      await AsyncStorage.setItem('@FitTrack:token', token);
      
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('@FitTrack:token');
      await AsyncStorage.removeItem('@FitTrack:user');
      set({ user: null, token: null, isAuthenticated: false, error: null });
    } catch (error) {
      set({ error: 'Logout failed' });
    }
  },

  updateUser: async (userData) => {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      const updatedUser = response.data;
      await AsyncStorage.setItem('@FitTrack:user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Update failed';
      set({ error: message });
      throw new Error(message);
    }
  },

  clearError: () => set({ error: null }),
}));

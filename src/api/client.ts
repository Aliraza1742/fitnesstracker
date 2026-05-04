import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

// Use 10.0.2.2 for Android Emulator to access localhost, or localhost for iOS simulator
export const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to headers
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@FitTrack:token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token for API request', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If 401 Unauthorized, automatically log out
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized detected - clearing session');
      // Dispatch logout to Zustand store
      try {
        const store = useAuthStore.getState();
        if (store && store.logout) {
          await store.logout();
        }
      } catch (e) {
        // Fallback clear
        await AsyncStorage.removeItem('@FitTrack:token');
        await AsyncStorage.removeItem('@FitTrack:user');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

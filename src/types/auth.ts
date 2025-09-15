export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  weight?: number;
  height?: number;
  age?: number;
  fitnessGoal?: string;
  avatarUrl?: string; 

}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  weight?: number;
  height?: number;
  age?: number;
  fitnessGoal?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
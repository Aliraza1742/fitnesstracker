// Define your light mode color palette
export const lightColors = {
  // Primary Colors (Soft, Energizing Greens/Teals)
  primary: '#10B981', // Emerald 500
  primaryDark: '#155b45', // Emerald 600
  primaryLight: '#D1FAE5', // Emerald 100

  // Secondary/Accent Colors (Calm Purples/Blues)
  secondary: '#6366F1', // Indigo 500
  accent: '#F59E0B', // Amber 500

  // Neutral Colors
  white: '#FFFFFF',
  grey100: '#F9FAFB',
  grey200: '#F3F4F6',
  grey300: '#E5E7EB',
  grey400: '#9CA3AF',
  grey500: '#6B7280',
  grey600: '#4B5563',
  grey700: '#374151',
  grey800: '#1F2937',
  grey900: '#111827',
  black: '#000000',
  outline: '#E5E7EB',

  // Semantic Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Background & Surface Colors
  background: '#F8FAFC',
  surface: '#ffffff',
  surfaceMuted: '#F1F5F9',
  onBackground: '#111827',
  onSurface: '#4b634b',

  // Gradient Colors
  gradients: {
    primary: ['#10B981', '#3B82F6'],
    background: ['#29d86c', '#f0fff8'],
    auth: ['#29d86c', '#EFF6FF'],
  },
};

// Define your dark mode color palette
export const darkColors = {
  ...lightColors,

  // Override the colors that change in dark mode
  background: '#0F172A',
  surface: '#1E293B',
  surfaceMuted: '#334155',
  onBackground: '#F8FAFC',
  onSurface: '#94A3B8',
  outline: '#334155',

  gradients: {
    primary: ['#10B981', '#34D399'],
    background: ['#0F172A', '#1E293B'],
    auth: ['#0F172A', '#0F172A'],
  },
};

// Type export for color keys
export type AppColors = keyof typeof lightColors;

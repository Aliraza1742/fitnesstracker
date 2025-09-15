// Define your light mode color palette
export const lightColors = {
  // Primary Colors
  primary: '#6a43edff', // A confident, energetic indigo
  primaryDark: '#3931d3ff',
  primaryLight: '#818CF8',

  // Neutral Colors
  white: '#FFFFFF',
  grey100: '#F3F4F6',
  grey200: '#E5E7EB',
  grey300: '#D1D5DB',
  grey400: '#9CA3AF',
  grey500: '#6B7280',
  grey600: '#4B5563',
  grey700: '#374151',
  grey800: '#1F2937',
  grey900: '#111827',
  black: '#000000',
  outline: '#8d38c9ff',

  

  // Semantic Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#1b43e4cf',


  // Background & Surface Colors
  background: '#F9FAF9', // Light subtle background
  surface: '#faf9fbff',
  onBackground: '#111827',
  onSurface: '#000000ff',

  // ✅ Gradient Colors
  gradients: {
    primary: ['#6a92cfdf', '#3d3d41d1'], // Indigo gradient
    background: ['#F9FAF9', '#E5E7EB'], // Light background gradient
  },
};

// Define your dark mode color palette
export const darkColors = {
  ...lightColors, // Spread light colors to ensure all keys exist

  // Override the colors that change in dark mode
  background: '#111827',
  surface: '#1F2937',
  onBackground: '#F3F4F6',
  onSurface: '#D1D5DB',

  // ✅ Dark gradients
  gradients: {
    primary: ['#7873e27c', '#b988ea9d'],
  },
};

// This type will be useful for theming
export type AppColors = keyof typeof lightColors;

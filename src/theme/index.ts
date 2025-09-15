import { lightColors, darkColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

// This defines the structure of our theme
export interface Theme {
  colors: typeof lightColors;
  typography: typeof typography;
  spacing: typeof spacing;
}

// Create our light theme using the defined structure
export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
};

// Create our dark theme
export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
};

// Export the theme type for use in styled components or hooks
export type ThemeType = Theme;
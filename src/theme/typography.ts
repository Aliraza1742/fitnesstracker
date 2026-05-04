import { Platform } from 'react-native';

/**
 * Health apps often use clean Sans-Serif fonts like Inter, Poppins, or Montserrat.
 * We'll set up a structure that makes it easy to add custom fonts, but defaults 
 * to high-quality system fonts (San Francisco on iOS, Roboto on Android)
 */
export const typography = {
  // Font Families
  primary: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  secondary: Platform.select({ ios: 'System', android: 'sans-serif-light' }),
  header: Platform.select({ ios: 'System', android: 'sans-serif-condensed' }),
  
  // Font Sizes
  fontSize: {
    xs: 12,   // Captions, subtle info
    sm: 14,   // Secondary body, buttons
    body: 16, // Main reading text
    lg: 18,   // Highlights, smaller headers
    xl: 20,   // Section titles
    xxl: 24,  // Main titles
    xxxl: 32, // Large emphasis
    display: 48, // Big hero numbers/titles
  },

  // Line Heights
  lineHeight: {
    xs: 16,
    sm: 20,
    body: 24,
    lg: 28,
    xl: 28,
    xxl: 32,
    xxxl: 40,
    display: 56,
  },

  // Font Weights
  weight: {
    thin: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
};

export type FontSize = keyof typeof typography.fontSize;
export type LineHeight = keyof typeof typography.lineHeight;
export type FontWeight = keyof typeof typography.weight;

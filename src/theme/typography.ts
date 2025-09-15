import { Platform } from 'react-native';

export const typography = {
  // Font Families
  primary: Platform.select({ ios: 'System', android: 'Roboto' }),
  primaryBold: Platform.select({ ios: 'System', android: 'Roboto' }),
  // You could later swap to a fitness-friendly font like "Montserrat" or "Poppins" for headings

  // Font Sizes (fitness apps need bold headlines + readable body text)
  fontSize: {
    xs: 12,   // Tiny labels, helper text
    sm: 14,   // Captions, secondary info
    body: 16, // Standard readable text
    lg: 18,   // Buttons, section headers
    xl: 20,   // Emphasis text
    xxl: 24,  // Sub-headlines
    xxxl: 32, // Large headings (dashboard, workout titles)
    display: 40, // Hero numbers (e.g., calories, steps, timer)
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
    display: 48,
  },

  // Font Weights
  weight: {
    regular: '400',
    medium: '500',
    bold: '700',
    extraBold: '800', // Useful for energetic motivational headlines
  },
};

export type FontSize = keyof typeof typography.fontSize;
export type LineHeight = keyof typeof typography.lineHeight;
export type FontWeight = keyof typeof typography.weight;

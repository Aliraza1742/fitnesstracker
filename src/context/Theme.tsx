import React, { createContext, useContext, useEffect, useState, ReactNode} from 'react';
import { useColorScheme } from 'react-native';
import { Theme, lightTheme, darkTheme } from '../theme';

// Define the shape of the context value
interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Props for the provider component
interface ThemeProviderProps {
  children: ReactNode;
}

// Create the provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get the system color scheme
  const systemColorScheme = useColorScheme();
  // State to hold the selected theme mode
  const [isDark, setIsDark] = useState<boolean>(systemColorScheme === 'dark');

  // Effect to listen to system theme changes (optional)
  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  // Function to toggle between light and dark mode
  const toggleTheme = () => setIsDark(prev => !prev);

  // Select the theme based on the state
  const theme = isDark ? darkTheme : lightTheme;

  // The context value that will be supplied to any descendant component.
  const value: ThemeContextValue = {
    theme,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
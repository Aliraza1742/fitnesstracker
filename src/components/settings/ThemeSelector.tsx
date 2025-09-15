import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ThemeSelectorProps {
  currentTheme: 'light' | 'dark' | 'auto';
  onThemeChange: (theme: 'light' | 'dark' | 'auto') => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const { theme } = useTheme();

  const themes = [
    { id: 'light' as const, label: 'Light', icon: '☀️' },
    { id: 'dark' as const, label: 'Dark', icon: '🌙' },
    { id: 'auto' as const, label: 'Auto', icon: '⚙️' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        Theme Preference
      </Text>
      <View style={styles.themesContainer}>
        {themes.map((themeOption) => (
          <TouchableOpacity
            key={themeOption.id}
            style={[
              styles.themeButton,
              {
                backgroundColor:
                  currentTheme === themeOption.id
                    ? theme.colors.primary
                    : theme.colors.surface,
                borderColor: theme.colors.grey300,
              },
            ]}
            onPress={() => onThemeChange(themeOption.id)}
          >
            <Text style={styles.themeIcon}>{themeOption.icon}</Text>
            <Text
              style={[
                styles.themeLabel,
                {
                  color:
                    currentTheme === themeOption.id
                      ? theme.colors.white
                      : theme.colors.onBackground,
                },
              ]}
            >
              {themeOption.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  themesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  themeIcon: {
    fontSize: 16,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
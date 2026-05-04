import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { MoonStar, Settings2, SunMedium } from 'lucide-react-native';

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
    { id: 'light' as const, label: 'Light', icon: SunMedium },
    { id: 'dark' as const, label: 'Dark', icon: MoonStar },
    { id: 'auto' as const, label: 'Auto', icon: Settings2 },
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
                  borderColor:
                    currentTheme === themeOption.id
                      ? theme.colors.primary
                      : theme.colors.grey200,
                  shadowColor: theme.colors.grey900,
              },
            ]}
            onPress={() => onThemeChange(themeOption.id)}
          >
              <themeOption.icon
                size={16}
                color={
                  currentTheme === themeOption.id
                    ? theme.colors.white
                    : theme.colors.primary
                }
              />
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
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  themeIcon: {
    fontSize: 16,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
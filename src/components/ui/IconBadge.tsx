import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface IconBadgeProps {
  icon: React.ReactNode;
  size?: number;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  size = 40,
  variant = 'default',
}) => {
  const { theme } = useTheme();

  const palette = {
    default: {
      backgroundColor: theme.colors.surfaceMuted,
      color: theme.colors.primary,
    },
    accent: {
      backgroundColor: `${theme.colors.primary}18`,
      color: theme.colors.primary,
    },
    success: {
      backgroundColor: `${theme.colors.success}18`,
      color: theme.colors.success,
    },
    warning: {
      backgroundColor: `${theme.colors.warning}18`,
      color: theme.colors.warning,
    },
    danger: {
      backgroundColor: `${theme.colors.error}18`,
      color: theme.colors.error,
    },
  }[variant];

  const child = React.isValidElement(icon)
    ? React.cloneElement(
        icon as React.ReactElement<{ color?: string; size?: number }>,
        {
          color: palette.color,
          size: size * 0.45,
        },
      )
    : icon;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: palette.backgroundColor,
        },
      ]}
    >
      {child}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
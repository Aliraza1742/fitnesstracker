import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { IconBadge } from '../ui/IconBadge';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  type?: 'switch' | 'button' | 'info';
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  disabled?: boolean;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  description,
  type = 'button',
  value,
  onValueChange,
  onPress,
  disabled = false,
}) => {
  const { theme } = useTheme();

  const renderRightElement = () => {
    switch (type) {
      case 'switch':
        return (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: theme.colors.grey300, true: theme.colors.primary }}
            thumbColor={theme.colors.white}
            disabled={disabled}
          />
        );
      case 'button':
        return (
          <Text style={[styles.chevron, { color: theme.colors.black}]}> 
            >
          </Text>
        );
      case 'info':
        return null;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || type === 'info'}
      style={[
        styles.container,
        {
          opacity: disabled ? 0.6 : 1,
          borderBottomColor: theme.colors.grey200,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <IconBadge icon={icon} size={40} variant="accent" />
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>
              {title}
            </Text>
            {description && (
              <Text style={[styles.description, { color: theme.colors.onSurface }]}>
                {description}
              </Text>
            )}
          </View>
        </View>
        {renderRightElement()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
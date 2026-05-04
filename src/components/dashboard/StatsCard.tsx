import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { IconBadge } from '../ui/IconBadge';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.content}>
        <View>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
          <Text style={[styles.value, { color: theme.colors.primary }]}>{value}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>{subtitle}</Text>
          )}
        </View>
        {icon && <IconBadge icon={icon} size={44} variant="accent" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
});
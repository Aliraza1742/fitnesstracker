import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { IconBadge } from '../ui/IconBadge';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  editable?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  value,
  editable = false,
}) => {
  const { theme } = useTheme();

  return (
      <View style={[styles.card, { 
        backgroundColor: theme.colors.surface,
        opacity: editable ? 1 : 0.9,
        borderColor: theme.colors.grey200,
        shadowColor: theme.colors.grey900,
      }]}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <IconBadge icon={icon} size={42} variant="accent" />
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                {title}
              </Text>
              <Text style={[styles.value, { color: theme.colors.onBackground }]}>
                {value}
              </Text>
            </View>
          </View>
        </View>
      </View>

  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
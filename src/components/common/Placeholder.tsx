import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const PlaceholderImage: React.FC<{ size?: number }> = ({ size = 200 }) => {
  const { theme } = useTheme();
  
  return (
    <View 
      style={[
        styles.placeholder, 
        { 
          width: size, 
          height: size, 
          backgroundColor: theme.colors.primaryLight,
          borderRadius: size / 2 
        }
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
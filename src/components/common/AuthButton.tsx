import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  backgroundColor?: string; // custom background
  textColor?: string;       // custom text color
  borderColor?: string;     // custom border color
}

export const AuthButton: React.FC<AuthButtonProps> = ({ 
  title, 
  onPress, 
  loading = false, 
  variant = 'primary',
  disabled = false,
  backgroundColor,
  textColor,
  borderColor,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    let style: any = {};

    if (backgroundColor) {
      style.backgroundColor = backgroundColor;
    } else if (variant === 'secondary') {
      style.backgroundColor = 'transparent';
    } else {
      style.backgroundColor = theme.colors.primary;
    }

    // ✅ border
    if (borderColor) {
      style.borderWidth = 2;
      style.borderColor = borderColor;
    } 
    else if (variant === 'secondary') {
      style.borderWidth = 2;
      style.borderColor = theme.colors.primary;
    }

    return style;
  };

  const getTextStyle = () => {
    if (textColor) {
      return { color: textColor };
    }
    if (variant === 'secondary') {
      return { color: theme.colors.primary };
    }
    return { color: theme.colors.white };
  };

  const isButtonDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        isButtonDisabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={isButtonDisabled}
    >
      {loading ? (
        <ActivityIndicator color={getTextStyle().color} />
      ) : (
        <Text style={[styles.buttonText, getTextStyle()]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

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
    borderRadius: 16,
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, style, ...props }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.onBackground,
            borderColor: error ? theme.colors.error : theme.colors.grey300,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.grey400}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 56,
  },
  error: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
});
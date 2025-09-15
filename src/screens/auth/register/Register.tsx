import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../hooks/useTheme';
import { InputField } from '../../../components/common/InputField';
import { AuthButton } from '../../../components/common/AuthButton';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../../hooks/useAuth';
import { useRegisterForm } from './useRegisterForm';
import { styles } from './styles';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { theme } = useTheme();
  const { register, isLoading: authLoading } = useAuth();
  const { formData, errors, handleInputChange, validateForm } =
    useRegisterForm();
  const [loading, setLoading] = useState(false);

const handleRegister = async () => {
  if (!validateForm()) return;

  setLoading(true);
  try {
    await register(formData);

    Alert.alert(
      'Success 🎉',
      'Account created successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ],
      { cancelable: false },
    );
  } catch (err: any) {
    // More granular error handling:
    let message = 'Registration failed. Please try again.';

    if (err instanceof Error && err.message) {
      message = err.message;
    } else if (err?.code) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already in use. Please log in instead.';
          break;
        case 'auth/weak-password':
          message = 'Your password is too weak. Please choose a stronger one.';
          break;
        default:
          message = 'Something went wrong. Please try again.';
          break;
      }
    }

    Alert.alert('Error ❌', message, [{ text: 'OK' }]);
  } finally {
    setLoading(false);
  }
};


  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={theme.colors.gradients.primary}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logo}
            />
            <Text style={[styles.appTitle, { color: theme.colors.primary }]}>
              FitTrack
            </Text>
            <Text style={[styles.tagline, { color: theme.colors.onSurface}]}>
              Your Fitness Partner!
            </Text>
            <Text style={[styles.tagline, { color: theme.colors.onSurface }]}>
              Join us to get started
            </Text>

            <View style={styles.form}>
              <View style={styles.nameRow}>
                <View style={styles.nameInput}>
                  <InputField
                    label="First Name"
                    placeholder="Ali"
                    value={formData.firstName}
                    onChangeText={text => handleInputChange('firstName', text)}
                    error={errors.firstName}
                    style={[
                      styles.input,
                      {
                        borderColor: errors.firstName
                          ? theme.colors.error
                          : theme.colors.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.nameInput}>
                  <InputField
                    label="Last Name"
                    placeholder="Raza"
                    value={formData.lastName}
                    onChangeText={text => handleInputChange('lastName', text)}
                    error={errors.lastName}
                    style={[
                      styles.input,
                      {
                        borderColor: errors.lastName
                          ? theme.colors.error
                          : theme.colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>

              <InputField
                label="Email Address"
                placeholder="demo.123@example.com"
                value={formData.email}
                onChangeText={text => handleInputChange('email', text)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.input,
                  {
                    borderColor: errors.email
                      ? theme.colors.error
                      : theme.colors.primary,
                  },
                ]}
              />

              <InputField
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChangeText={text => handleInputChange('password', text)}
                error={errors.password}
                secureTextEntry
                style={[
                  styles.input,
                  {
                    borderColor: errors.password
                      ? theme.colors.error
                      : theme.colors.primary,
                  },
                ]}
              />

              <InputField
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={text =>
                  handleInputChange('confirmPassword', text)
                }
                error={errors.confirmPassword}
                secureTextEntry
                style={[
                  styles.input,
                  {
                    borderColor: errors.confirmPassword
                      ? theme.colors.error
                      : theme.colors.primary,
                  },
                ]}
              />

              {errors.general && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.general}
                </Text>
              )}

              <AuthButton
                title="Create Account"
                onPress={handleRegister}
                loading={loading || authLoading}
              />
            </View>

            <View style={styles.footer}>
              <Text
                style={[styles.footerText, { color: theme.colors.onSurface }]}
              >
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text
                  style={[styles.footerLink, { color: theme.colors.black }]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

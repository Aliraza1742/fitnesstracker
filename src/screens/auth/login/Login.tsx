import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';
import { useLoginForm } from './useLoginForm';
import { InputField } from '../../../components/common/InputField';
import { AuthButton } from '../../../components/common/AuthButton';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './styles';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { theme } = useTheme();
  const { login, isLoading: authLoading } = useAuth();
  const { formData, errors, handleInputChange, validateForm } = useLoginForm();

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(formData);
      Alert.alert('Login Successful 🎉', 'Welcome back! You are now logged in.');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Invalid credentials. Please try again.';
      Alert.alert('Login Failed ❌', errorMessage, [{ text: 'Try Again' }]);
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
              resizeMode="contain"
            />

            <Text style={[styles.appTitle, { color: theme.colors.primary }]}>
              FitTrack
            </Text>
            <Text style={[styles.tagline, { color: theme.colors.onSurface }]}>
              Your Fitness Partner!
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>Sign in to continue your journey</Text>

            <View style={styles.form}>
              <InputField
                label="Email Address"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
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

              <AuthButton
                title="Sign In"
                onPress={handleLogin}
                loading={authLoading}
              />
            </View>

            <View style={styles.footer}>
              <Text
                style={[styles.footerText, { color: theme.colors.onSurface }]}
              >
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text
                  style={[styles.footerLink, { color: theme.colors.black }]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

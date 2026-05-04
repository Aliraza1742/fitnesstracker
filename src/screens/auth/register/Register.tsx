import React, { useState } from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image 
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
import { customAlert } from '../../../utils/alert';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { register, isLoading: authLoading } = useAuth();
  const { formData, errors, handleInputChange, validateForm } = useRegisterForm();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData);
      customAlert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      let message = 'Registration failed. Please try again.';
      if (err instanceof Error && err.message) message = err.message;
      customAlert('Error', message, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={theme.colors.gradients.auth} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerSpacer} />

          <View style={styles.content}>
            <View style={styles.brandContainer}>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={[
                  styles.logoImage,
                  isDark && { tintColor: theme.colors.primary }
                ]}
                resizeMode="contain"
              />
              <Text style={[styles.appTitle, { color: theme.colors.onBackground }]}>FitTrack</Text>
              <Text style={[styles.tagline, { color: theme.colors.grey500 }]}>Start your fitness journey today</Text>
            </View>

            <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}> 
              <Text style={[styles.formTitle, { color: theme.colors.onBackground }]}>Create Account</Text>
              <Text style={[styles.formSubtitle, { color: theme.colors.grey500 }]}>Join our community of fitness enthusiasts</Text>

              <View style={styles.form}>
                <View style={styles.nameRow}>
                  <View style={styles.nameInput}>
                    <InputField
                      label="First Name"
                      placeholder="Ali"
                      value={formData.firstName}
                      onChangeText={text => handleInputChange('firstName', text)}
                      error={errors.firstName}
                    />
                  </View>
                  <View style={styles.nameInput}>
                    <InputField
                      label="Last Name"
                      placeholder="Raza"
                      value={formData.lastName}
                      onChangeText={text => handleInputChange('lastName', text)}
                      error={errors.lastName}
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
                />

                <InputField
                  label="Password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChangeText={text => handleInputChange('password', text)}
                  error={errors.password}
                  secureTextEntry
                />

                <InputField
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={text => handleInputChange('confirmPassword', text)}
                  error={errors.confirmPassword}
                  secureTextEntry
                />

                <AuthButton
                  title="Create Account"
                  onPress={handleRegister}
                  loading={loading || authLoading}
                />
              </View>

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.colors.grey600 }]}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

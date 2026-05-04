import React from 'react';
import { 
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image 
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
import { customAlert } from '../../../utils/alert';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { login, isLoading: authLoading } = useAuth();
  const { formData, errors, handleInputChange, validateForm } = useLoginForm();

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(formData);
      customAlert('Login successful', 'Welcome back! You are now logged in.');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Invalid credentials. Please try again.';
      customAlert('Login failed', errorMessage, [{ text: 'Try Again' }]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={theme.colors.gradients.auth}
        style={styles.container}
      >
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
              <Text style={[styles.tagline, { color: theme.colors.grey500 }]}>Elevate your fitness journey</Text>
            </View>

            <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.formTitle, { color: theme.colors.onBackground }]}>Welcome Back</Text>
              <Text style={[styles.formSubtitle, { color: theme.colors.grey500 }]}>Sign in to continue tracking your progress</Text>

              <View style={styles.form}>
                <InputField
                  label="Email Address"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChangeText={text => handleInputChange('email', text)}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <InputField
                  label="Password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={text => handleInputChange('password', text)}
                  secureTextEntry
                  error={errors.password}
                />

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>Forgot Password?</Text>
                </TouchableOpacity>

                <AuthButton title="Sign In" onPress={handleLogin} loading={authLoading} />
              </View>

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.colors.grey600 }]}>New to FitTrack? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

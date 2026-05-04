// screens/auth/login/styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSpacer: {
    height: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandBadge: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOpacity: 0.1,
    elevation: 1,
  },
  logoImage: {
     width: 450,
    height: 300,
     marginTop: -35,

  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: -70,
  },
  tagline: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
  formContainer: {
    borderRadius: 32,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,

  },
  formSubtitle: {
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    height: 56,
    borderRadius: 16,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '700',
  },
});

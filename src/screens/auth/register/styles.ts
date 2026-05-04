// screens/auth/register/styles.ts
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
    height: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  brandBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  logoImage: {
    width: 450,
    height: 300,
    marginTop: -40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: -80,
   
  },
  tagline: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
  formContainer: {
    borderRadius: 33,
    padding: 30,
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
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  nameInput: {
    flex: 1,
  },
  registerButton: {
    height: 56,
    borderRadius: 16,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 12,
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

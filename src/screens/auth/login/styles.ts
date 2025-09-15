// screens/auth/LoginScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  logo: {
    width: 550,
    height: 500,
    marginTop: -85,
    marginBottom: -150,
    alignSelf: 'center',
    borderRadius: 20,
  },
  appTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#423c3cff',
  },
  form: { flex: 1, justifyContent: 'center', marginBottom: 20 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40 },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 2.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: 'black',
    backgroundColor: '#ffffffd5',
  },
});

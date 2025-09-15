import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  logo: {
    width: 350,
    height: 250,
    marginTop: -10,
    marginBottom: -60,
    alignSelf: 'center',
    borderRadius: 20,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  form: { flex: 1, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between' },
  nameInput: { width: '48%' },
  errorText: { fontSize: 14, textAlign: 'center', marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40 },
  footerText: { fontSize: 16, marginEnd: 4 },
  footerLink: { fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 2.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffffd5',
    color: 'black',

  },
});

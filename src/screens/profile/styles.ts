import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    gap: 10,
  },
  profileHeaderCard: {
    marginBottom: 20,
    marginTop: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
    letterSpacing: -0.4,
  },
  userEmail: {
    fontSize: 16,
  },
  actions: {
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
});

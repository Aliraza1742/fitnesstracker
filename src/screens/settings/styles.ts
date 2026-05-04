// src/screens/Settings/styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 12,
  },
  logoutSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 16,
  },
  permissionBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 6,
    marginBottom: 8,
  },

  permissionText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});

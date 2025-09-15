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
    marginBottom: 8,
  },
  logoutSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
  },
  // Add to your existing styles
permissionBanner: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
  borderRadius: 12,
  marginBottom: 16,
  marginHorizontal: 16,
},
permissionText: {
  fontSize: 16,
  fontWeight: '600',
},
testSection: {
  marginTop: 16,
  padding: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
},
testDescription: {
  fontSize: 14,
  marginBottom: 12,
  textAlign: 'center',
},
testButtons: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  gap: 8,
},
});

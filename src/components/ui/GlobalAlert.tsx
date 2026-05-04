import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAlertStore } from '../../store/useAlertStore';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const GlobalAlert: React.FC = () => {
  const { theme } = useTheme();
  const { visible, title, message, buttons, hideAlert } = useAlertStore();

  if (!visible) return null;

  const handlePress = (onPress?: () => void) => {
    hideAlert();
    if (onPress) {
      setTimeout(onPress, 300); // Wait for modal to hide before triggering action
    }
  };

  const isError = title.toLowerCase().includes('error') || title.toLowerCase().includes('fail');
  const isSuccess = title.toLowerCase().includes('success');

  const Icon = isError ? AlertCircle : isSuccess ? CheckCircle2 : Info;
  const iconColor = isError ? theme.colors.error : isSuccess ? theme.colors.primary : theme.colors.primary;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.alertBox, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.iconContainer}>
            <Icon size={40} color={iconColor} />
          </View>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.colors.onSurface }]}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            {buttons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  btn.style === 'destructive' && { backgroundColor: theme.colors.error },
                  btn.style === 'cancel' && { backgroundColor: theme.colors.grey300 },
                  btn.style !== 'destructive' && btn.style !== 'cancel' && { backgroundColor: theme.colors.primary },
                  buttons.length > 1 && { flex: 1, marginHorizontal: 5 } // side-by-side if multiple
                ]}
                onPress={() => handlePress(btn.onPress)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    btn.style === 'cancel' && { color: theme.colors.onBackground },
                  ]}
                >
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: width * 0.85,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

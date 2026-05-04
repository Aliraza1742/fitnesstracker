import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { InputField } from '../common/InputField';
import { AuthButton } from '../common/AuthButton';
import { User } from '../../types/auth';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (userData: Partial<User>) => void;
  user: User | null;
  loading?: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onSubmit,
  user,
  loading = false,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    weight: '',
    height: '',
    age: '',
    fitnessGoal: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        weight: user.weight?.toString() || '',
        height: user.height?.toString() || '',
        age: user.age?.toString() || '',
        fitnessGoal: user.fitnessGoal || '',
      });
    }
  }, [user, visible]);

  const handleSubmit = () => {
    const updatedData: Partial<User> = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
      fitnessGoal: formData.fitnessGoal.trim() || undefined,
    };

    onSubmit(updatedData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View
           style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.black,
                borderColor: theme.colors.primary,
                borderWidth: 1.5,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text
                style={[styles.title, { color: theme.colors.onBackground }]}
              >
                Edit Profile
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text
                  style={[styles.closeText, { color: theme.colors.black }]}
                >
                  X
                </Text>
              </TouchableOpacity>
            </View>

            {/* Scrollable Form */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Personal Info */}
              <View style={styles.section}>
                <Text
                  style={[styles.sectionTitle, { color: theme.colors.black }]}
                >
                  Personal Information
                </Text>

                <View style={styles.row}>
                  <View style={styles.halfInput}>
                    <InputField
                      label="First Name"
                      placeholder="John"
                      value={formData.firstName}
                      onChangeText={text =>
                        handleInputChange('firstName', text)
                      }
                      style={[
                        styles.inputBorder,
                        { borderColor: theme.colors.primary },
                      ]}
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <InputField
                      label="Last Name"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChangeText={text => handleInputChange('lastName', text)}
                      style={[
                        styles.inputBorder,
                        { borderColor: theme.colors.primary },
                      ]}
                    />
                  </View>
                </View>

                <InputField
                  label="Fitness Goal"
                  placeholder="e.g., Weight loss, Muscle gain, Endurance"
                  value={formData.fitnessGoal}
                  onChangeText={text => handleInputChange('fitnessGoal', text)}
                  style={[
                    styles.inputBorder,
                    { borderColor: theme.colors.primary },
                  ]}
                />
              </View>

              {/* Body Metrics */}
              <View style={styles.section}>
                <Text
                  style={[styles.sectionTitle, { color: theme.colors.black }]}
                >
                  Body Metrics
                </Text>

                <View style={styles.row}>
                  <View style={styles.thirdInput}>
                    <InputField
                      label="Weight (kg)"
                      placeholder="70"
                      value={formData.weight}
                      onChangeText={text => handleInputChange('weight', text)}
                      keyboardType="numeric"
                      style={[
                        styles.inputBorder,
                        { borderColor: theme.colors.primary },
                      ]}
                    />
                  </View>
                  <View style={styles.thirdInput}>
                    <InputField
                      label="Height (cm)"
                      placeholder="175"
                      value={formData.height}
                      onChangeText={text => handleInputChange('height', text)}
                      keyboardType="numeric"
                      style={[
                        styles.inputBorder,
                        { borderColor: theme.colors.primary },
                      ]}
                    />
                  </View>
                  <View style={styles.thirdInput}>
                    <InputField
                      label="Age"
                      placeholder="28"
                      value={formData.age}
                      onChangeText={text => handleInputChange('age', text)}
                      keyboardType="numeric"
                      style={[
                        styles.inputBorder,
                        { borderColor: theme.colors.primary },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <AuthButton
                title="Save Changes"
                onPress={handleSubmit}
                loading={loading}
                textColor={theme.colors.white}
          borderColor={theme.colors.info}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '95%',
    overflow: 'hidden',
  },
  inputBorder: {
    borderWidth: 2.0,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // keep space for button
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  thirdInput: {
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
});

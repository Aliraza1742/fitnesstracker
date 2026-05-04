import React, { useState, useEffect } from 'react';
import { View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { InputField } from '../common/InputField';
import { AuthButton } from '../common/AuthButton';
import { X, Plus } from 'lucide-react-native';
import { customAlert } from '../../utils/alert';


const { width } = Dimensions.get('window');

interface ExerciseForm {
  name: string;
  duration: string;
  notes: string;
}

interface WorkoutFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    exercises: { exerciseName: string; duration: number; notes?: string }[],
  ) => void;
  loading?: boolean;
}

export const WorkoutFormModal: React.FC<WorkoutFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const { theme } = useTheme();
  const [exercises, setExercises] = useState<ExerciseForm[]>([
    { name: '', duration: '', notes: '' },
  ]);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setExercises([{ name: '', duration: '', notes: '' }]);
    }
  }, [visible]);

  const addExercise = () => {
    setExercises(prev => [...prev, { name: '', duration: '', notes: '' }]);
  };

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateExercise = (
    index: number,
    field: keyof ExerciseForm,
    value: string,
  ) => {
    setExercises(prev =>
      prev.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise,
      ),
    );
  };

  const handleSubmit = () => {
    console.log('Submit button clicked in modal');
    console.log('Exercises data:', exercises);

    // Validate all exercises have name and duration
    const invalidExercises = exercises.filter(
      ex =>
        !ex.name.trim() ||
        !ex.duration.trim() ||
        isNaN(parseInt(ex.duration)) ||
        parseInt(ex.duration) <= 0,
    );

    if (invalidExercises.length > 0) {
      console.log('Validation failed - invalid exercises:', invalidExercises);
      customAlert(
        'Validation Error',
        'Please make sure all exercises have a name and a valid duration (minimum 1 minute).',
      );
      return;
    }

    // Prepare data for submission
    const validExercises = exercises.map(ex => ({
      exerciseName: ex.name.trim(),
      duration: Math.max(1, parseInt(ex.duration)),
      notes: ex.notes.trim() || undefined,
    }));

    console.log('Submitting valid exercises:', validExercises);

    // Call the onSubmit callback
    onSubmit(validExercises);
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
                backgroundColor: theme.colors.background,
                shadowColor: theme.colors.onBackground,
              },
            ]}
          >
            {/* Modal Handle */}
            <View style={styles.modalHandle} />

            {/* Header */}
            <View
              style={[
                styles.header,
                {
                  borderBottomColor:
                    theme.colors.surface || 'rgba(0, 0, 0, 0.08)',
                },
              ]}
            >
              <View style={styles.headerContent}>
                <Text
                  style={[styles.title, { color: theme.colors.onBackground }]}
                >
                  Log New Workout
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: theme.colors.onSurface || '#666' },
                  ]}
                >
                  Track your exercise activities
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={[
                  styles.closeButton,
                  { backgroundColor: theme.colors.surface || '#f5f5f5' },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.closeText,
                    { color: theme.colors.onSurface || '#666' },
                  ]}
                >
                  <X size={16} color={theme.colors.onSurface || '#666'} />
                </Text>
              </TouchableOpacity>
            </View>

            {/* Scrollable Form */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {exercises.map((exercise, index) => (
                <View
                  key={index}
                  style={[
                    styles.exerciseCard,
                    {
                      backgroundColor: theme.colors.primaryLight || '#f8f9fa',
                      shadowColor: theme.colors.black,
                    },
                  ]}
                >
                  <View style={styles.exerciseHeader}>
                    <View style={styles.exerciseNumberContainer}>
                      <View
                        style={[
                          styles.exerciseNumberBadge,
                          { backgroundColor: theme.colors.primary },
                        ]}
                      >
                        <Text style={styles.exerciseNumberText}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.exerciseTitle,
                          { color: theme.colors.onBackground },
                        ]}
                      >
                        Exercise {index + 1}
                      </Text>
                    </View>
                    {exercises.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeExercise(index)}
                        style={[
                          styles.removeButton,
                          { backgroundColor: `${theme.colors.error}15` },
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.removeText,
                            { color: theme.colors.error },
                          ]}
                        >
                          Remove
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <InputField
                      label="Exercise Name *"
                      placeholder="e.g., Running, Weight Training"
                      value={exercise.name}
                      onChangeText={text => updateExercise(index, 'name', text)}
                      returnKeyType="next"
                      style={[
                        styles.input,
                        { borderColor: theme.colors.primary },
                      ]}
                    />

                    <InputField
                      label="Duration (minutes) *"
                      placeholder="30"
                      value={exercise.duration}
                      onChangeText={text =>
                        updateExercise(
                          index,
                          'duration',
                          text.replace(/[^0-9]/g, ''),
                        )
                      }
                      keyboardType="numeric"
                      returnKeyType="next"
                      style={[
                        styles.input,
                        { borderColor: theme.colors.primary },
                      ]}
                    />

                    <InputField
                      label="Notes (optional)"
                      placeholder="How did it feel? Any observations?"
                      value={exercise.notes}
                      onChangeText={text =>
                        updateExercise(index, 'notes', text)
                      }
                      multiline
                      style={[
                        styles.input,
                        { borderColor: theme.colors.primary },
                      ]}
                    />
                  </View>
                </View>
              ))}

              <TouchableOpacity
                onPress={addExercise}
                style={[
                  styles.addButton,
                  {
                    borderColor: theme.colors.primary,
                    backgroundColor: `${theme.colors.primary}08`,
                  },
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.addButtonContent}>
                  <View
                    style={[
                      styles.addIcon,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Plus size={16} color={theme.colors.white} />
                  </View>
                  <Text
                    style={[
                      styles.addButtonText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Add Another Exercise
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>

            {/* Footer */}
            <View
              style={[
                styles.footer,
                {
                  backgroundColor: theme.colors.background,
                  borderTopColor: theme.colors.surface || 'rgba(0, 0, 0, 0.08)',
                },
              ]}
            >
              <AuthButton
                title={loading ? 'Logging Workout...' : 'Log Workout'}
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 2,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    opacity: 0.7,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  exerciseCard: {
    marginBottom: 20,
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  exerciseNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 4,
  },
  addButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addIconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    color:'black'
  },
});

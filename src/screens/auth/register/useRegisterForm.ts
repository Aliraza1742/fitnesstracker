import { useState } from 'react';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
} from '../../../utils/validators';

export const useRegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: validateName(formData.firstName),
      lastName: validateName(formData.lastName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword,
      ),
    };

    setErrors(newErrors as { [key: string]: string });
    return !Object.values(newErrors).some(error => error !== null);
  };

  return { formData, errors, handleInputChange, validateForm };
};

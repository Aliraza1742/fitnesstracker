// hooks/useLoginForm.ts
import { useState } from 'react';
import { validateEmail, validatePassword } from '../../../utils/validators';

export const useLoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    setErrors(newErrors as { [key: string]: string });
    return !newErrors.email && !newErrors.password;
  };

  return { formData, errors, handleInputChange, validateForm };
};

import { useState } from 'react';
import { RegisterDriverUseCase } from '../../../domain/usecases/auth/RegisterDriverUseCase';

export type Role = 'passenger' | 'driver';

export const useRegistrationViewModel = (registerUseCase: RegisterDriverUseCase) => {
  const [role, setRole] = useState<Role>('passenger');
  const [showRolePicker, setShowRolePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Данные машины
    vehicleNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    vehicleYear: '',
    vehicleSeats: '',
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [confirmedOwnership, setConfirmedOwnership] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof typeof formData, value: string) => {
    // Для ФИО: разрешаем только буквы, пробелы и дефис
    if (field === 'fullName') {
      const lettersOnly = value.replace(/[^а-яА-ЯёЁa-zA-Z\s-]/g, '');
      setFormData(prev => ({ ...prev, [field]: lettersOnly }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleRegister = async (onSuccess: (phone: string) => void) => {
    setError(null);

    // 1. Проверка обязательных полей
    const commonFields = ['fullName', 'email', 'phone', 'password', 'confirmPassword'];
    const driverFields = ['vehicleNumber', 'vehicleMake', 'vehicleModel', 'vehicleColor', 'vehicleYear', 'vehicleSeats'];
    
    const requiredFields = role === 'driver' ? [...commonFields, ...driverFields] : commonFields;
    const hasEmptyFields = requiredFields.some(field => !formData[field as keyof typeof formData].trim());

    if (hasEmptyFields) {
      setError('Заполните обязательные поля!');
      return;
    }

    // 2. Валидация чекбоксов
    if (!agreedToTerms) {
      setError('Необходимо согласиться с условиями пользования');
      return;
    }

    if (role === 'driver' && !confirmedOwnership) {
      setError('Необходимо подтвердить владение автомобилем');
      return;
    }

    // 3. Валидация паролей
    if (formData.password.length < 8) {
      setError('Пароль должен быть не короче 8 символов!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают!');
      return;
    }

    setIsLoading(true);

    const result = await registerUseCase.execute({
      ...formData,
      licenseNumber: 'MOCK_LICENSE',
      passwordHash: formData.password,
      vehicleYear: parseInt(formData.vehicleYear) || 0,
      vehicleSeats: parseInt(formData.vehicleSeats) || 0,
    });

    if (result.success) {
      onSuccess(formData.phone);
    } else {
      setError(result.error.message);
    }

    setIsLoading(false);
  };

  return {
    role, setRole,
    showRolePicker, setShowRolePicker,
    formData,
    updateField,
    agreedToTerms, setAgreedToTerms,
    confirmedOwnership, setConfirmedOwnership,
    isLoading,
    error,
    handleRegister,
  };
};

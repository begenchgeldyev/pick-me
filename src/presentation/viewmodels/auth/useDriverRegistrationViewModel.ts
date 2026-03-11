import { useState } from 'react';
import { RegisterDriverUseCase } from '../../../domain/usecases/auth/RegisterDriverUseCase';

export const useDriverRegistrationViewModel = (registerUseCase: RegisterDriverUseCase) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    licenseNumber: '',
    vehicleNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    vehicleYear: '',
    vehicleSeats: '4',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (onSuccess: (phone: string) => void) => {
    setIsLoading(true);
    setError(null);

    const result = await registerUseCase.execute({
      ...formData,
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
    formData,
    updateField,
    isLoading,
    error,
    handleRegister,
  };
};

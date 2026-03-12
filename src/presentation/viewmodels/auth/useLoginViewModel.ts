import { useState } from 'react';
import { LoginUseCase } from '../../../domain/usecases/auth/LoginUseCase';

export type Role = 'passenger' | 'driver';

export const useLoginViewModel = (loginUseCase: LoginUseCase, onSuccess?: () => void) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('passenger');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRolePicker, setShowRolePicker] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    const result = await loginUseCase.execute({ 
      phone, 
      passwordHash: password // В реальности здесь должен быть хеш
    });

    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error.message);
    }

    setIsLoading(false);
  };

  return {
    phone, setPhone,
    password, setPassword,
    role, setRole,
    isLoading,
    error,
    showRolePicker, setShowRolePicker,
    handleLogin,
  };
};

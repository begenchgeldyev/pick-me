import { useState } from 'react';
import { VerifyPhoneUseCase } from '../../../domain/usecases/auth/VerifyPhoneUseCase';

export const useVerificationViewModel = (verifyUseCase: VerifyPhoneUseCase) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (onSuccess: () => void) => {
    setIsLoading(true);
    setError(null);

    const result = await verifyUseCase.execute(code);

    if (result.success && result.data) {
      onSuccess();
    } else {
      setError(result.success ? 'Неверный код' : result.error.message);
    }

    setIsLoading(false);
  };

  const resendCode = async () => {
    // В реальности здесь был бы вызов ResendUseCase
    console.log('Повторная отправка кода...');
  };

  return {
    code, setCode,
    isLoading,
    error,
    handleVerify,
    resendCode,
  };
};

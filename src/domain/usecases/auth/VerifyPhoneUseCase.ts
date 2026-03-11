import { IAuthRepository } from '../../repositories/IAuthRepository';
import { Result, failure } from '../../../core/types/Result';
import { AppError } from '../../../core/errors/AppError';

export class VerifyPhoneUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(code: string): Promise<Result<boolean, AppError>> {
    if (code.length < 4) {
      return failure(new AppError('ValidationError', 'Код должен содержать 4 цифры'));
    }
    return this.authRepository.verifyPhone(code);
  }
}

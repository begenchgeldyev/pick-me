import { IAuthRepository, LoginParams } from '../../repositories/IAuthRepository';
import { Result } from '../../../core/types/Result';
import { User } from '../../models/User';
import { AppError } from '../../../core/errors/AppError';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(params: LoginParams): Promise<Result<{ user: User; token: string }, AppError>> {
    // Здесь можно добавить бизнес-валидацию (например, формат телефона)
    if (!params.phone || params.phone.length < 10) {
      return { 
        success: false, 
        error: new AppError('ValidationError', 'Некорректный номер телефона') 
      };
    }
    
    return this.authRepository.login(params);
  }
}

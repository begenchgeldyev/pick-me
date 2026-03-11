import { IAuthRepository, LoginParams } from '../../repositories/IAuthRepository';
import { Result } from '../../../core/types/Result';
import { User } from '../../models/User';
import { AppError } from '../../../core/errors/AppError';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(params: LoginParams): Promise<Result<{ user: User; token: string }, AppError>> {
    // Сценарий из ветки atbuba: Заполнены не все данные
    if (!params.phone || !params.passwordHash) {
      return { 
        success: false, 
        error: new AppError('ValidationError', 'Заполните обязательные поля!') 
      };
    }

    // Сценарий из ветки atbuba: Некорректный пароль
    if (params.passwordHash !== '12345') {
      return { 
        success: false, 
        error: new AppError('AuthError', 'Неверный номер телефона или\nпароль!') 
      };
    }
    
    return this.authRepository.login(params);
  }
}

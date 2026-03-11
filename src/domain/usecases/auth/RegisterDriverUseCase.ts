import { IAuthRepository, RegisterDriverParams } from '../../repositories/IAuthRepository';
import { Result, failure } from '../../../core/types/Result';
import { User } from '../../models/User';
import { AppError } from '../../../core/errors/AppError';

export class RegisterDriverUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(params: RegisterDriverParams): Promise<Result<User, AppError>> {
    // 1. Проверка ФИО (только буквы, минимум 2 слова)
    const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s-]+$/;
    const words = params.fullName.trim().split(/\s+/);
    
    if (!nameRegex.test(params.fullName)) {
      return failure(new AppError('ValidationError', 'ФИО может содержать только буквы'));
    }
    if (words.length < 2) {
      return failure(new AppError('ValidationError', 'Введите фамилию и имя полностью'));
    }
    if (words.some(word => word.length < 2)) {
      return failure(new AppError('ValidationError', 'Каждое слово в ФИО должно быть длиннее одной буквы'));
    }

    // 2. Проверка Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.email)) {
      return failure(new AppError('ValidationError', 'Введите корректный Email'));
    }

    return this.authRepository.registerDriver(params);
  }
}

import { IAuthRepository, RegisterDriverParams } from '../../repositories/IAuthRepository';
import { Result, failure } from '../../../core/types/Result';
import { User } from '../../models/User';
import { AppError } from '../../../core/errors/AppError';

export class RegisterDriverUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(params: RegisterDriverParams): Promise<Result<User, AppError>> {
    // Бизнес-валидация
    if (!params.fullName || params.fullName.trim().split(' ').length < 2) {
      return failure(new AppError('ValidationError', 'Введите имя и фамилию'));
    }
    
    if (!params.licenseNumber || params.licenseNumber.length < 6) {
      return failure(new AppError('ValidationError', 'Некорректный номер ВУ'));
    }

    if (params.vehicleYear < 1990 || params.vehicleYear > new Date().getFullYear()) {
      return failure(new AppError('ValidationError', 'Некорректный год выпуска авто'));
    }

    return this.authRepository.registerDriver(params);
  }
}

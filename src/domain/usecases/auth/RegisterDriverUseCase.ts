import { IAuthRepository, RegisterDriverParams } from '../../repositories/IAuthRepository';
import { Result, failure } from '../../../core/types/Result';
import { User } from '../../models/User';
import { AppError } from '../../../core/errors/AppError';

export class RegisterDriverUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(params: RegisterDriverParams): Promise<Result<User, AppError>> {
    // 1. Проверка пароля (минимум 8 символов)
    if (params.passwordHash.length < 8) {
      return failure(new AppError('ValidationError', 'Пароль должен быть не короче 8 символов!'));
    }

    // 2. Проверка ФИО (только буквы, минимум 2 слова)
    const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s-]+$/;
    const words = params.fullName.trim().split(/\s+/);
    if (!nameRegex.test(params.fullName) || words.length < 2 || words.some(word => word.length < 2)) {
      return failure(new AppError('ValidationError', 'Неполное ФИО!'));
    }

    // 3. Проверка Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.email)) {
      return failure(new AppError('ValidationError', 'Некорректный email!'));
    }

    // --- Проверки только для ВОДИТЕЛЯ (если переданы данные машины) ---
    if (params.vehicleNumber) {
      // 4. Маска госномера РФ (Пример: А123АА77 или А123АА777)
      // Разрешенные буквы: А, В, Е, К, М, Н, О, Р, С, Т, У, Х
      const plateRegex = /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/i;
      if (!plateRegex.test(params.vehicleNumber.replace(/\s/g, ''))) {
        return failure(new AppError('ValidationError', 'Некорректный номер!'));
      }

      // 5. Год выпуска
      const currentYear = new Date().getFullYear();
      if (params.vehicleYear > currentYear) {
        return failure(new AppError('ValidationError', 'Год не может быть больше текущего!'));
      }

      // 6. Количество мест (1-20)
      if (params.vehicleSeats < 1 || params.vehicleSeats > 20) {
        return failure(new AppError('ValidationError', 'Некорректное количество мест!'));
      }
    }

    return this.authRepository.registerDriver(params);
  }
}

import { IAuthRepository, LoginParams, RegisterParams } from '../../domain/repositories/IAuthRepository';
import { Result, success, failure } from '../../core/types/Result';
import { User } from '../../domain/models/User';
import { AppError } from '../../core/errors/AppError';

export class AuthRepositoryImpl implements IAuthRepository {
  async login(params: LoginParams): Promise<Result<{ user: User; token: string }, AppError>> {
    // Имитация сетевой задержки
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Тестовая логика: если пароль "12345", то успех, иначе ошибка
    if (params.passwordHash === '12345') {
      const mockUser: User = {
        id: '1',
        name: 'Иван Иванов',
        phone: params.phone,
        email: 'test@example.com',
        rating: 4.8,
        isVerified: true,
        createdAt: new Date(),
      };
      return success({ user: mockUser, token: 'mock-jwt-token' });
    }

    return failure(new AppError('AuthError', 'Неверный логин или пароль'));
  }

  async register(params: RegisterParams): Promise<Result<User, AppError>> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return success({
      id: '2',
      name: params.fullName,
      phone: params.phone,
      email: params.email,
      rating: 5.0,
      isVerified: false,
      createdAt: new Date(),
    });
  }

  async verifyPhone(code: string): Promise<Result<boolean, AppError>> {
    return success(code === '1111');
  }
}

import { Result } from '../../core/types/Result';
import { User } from '../models/User';
import { AppError } from '../../core/errors/AppError';

export interface LoginParams {
  phone: string;
  passwordHash: string;
}

export interface RegisterParams {
  fullName: string;
  phone: string;
  email: string;
  passwordHash: string;
  role: 'passenger' | 'driver';
}

export interface RegisterDriverParams {
  fullName: string;
  phone: string;
  email: string;
  passwordHash: string;
  licenseNumber: string;
  vehicleNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleYear: number;
  vehicleSeats: number;
}

export interface IAuthRepository {
  login(params: LoginParams): Promise<Result<{ user: User; token: string }, AppError>>;
  register(params: RegisterParams): Promise<Result<User, AppError>>;
  registerDriver(params: RegisterDriverParams): Promise<Result<User, AppError>>;
  verifyPhone(code: string): Promise<Result<boolean, AppError>>;
}

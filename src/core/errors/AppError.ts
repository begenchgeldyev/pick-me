export type AppErrorType = 
  | 'NetworkError' 
  | 'AuthError' 
  | 'ValidationError' 
  | 'UnknownError';

export class AppError extends Error {
  constructor(
    public type: AppErrorType,
    public message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}
